import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import OpenAI from "openai";
import Company from "../models/companyModel.js";
import { matchSkills } from "../utils/skillMatcher.js";

async function extractTextFromPDF(buffer) {
  const uint8Array = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdf = await loadingTask.promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n";
  }
  return fullText;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeResume = async (req, res) => {
  try {
    const { cgpa, backlogs, branch, gradYear, targetRole } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const pdfBuffer = fs.readFileSync(file.path);
    const text = await extractTextFromPDF(pdfBuffer);

    // AI call for skills & advice
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI career advisor and resume analyzer.
Return ONLY a valid JSON object in this exact format, no markdown, no extra text:
{
  "skills": ["skill1", "skill2"],
  "advice": "Your career improvement suggestions here"
}`,
        },
        {
          role: "user",
          content: `Resume Text: ${text}

Target Role: ${targetRole || "Not specified"}

Extract all technical and soft skills from the resume, and provide concise career improvement suggestions for the target role.`,
        },
      ],
    });

    let resumeSkills = [];
    let aiAdvice = "";
    try {
      const parsed = JSON.parse(aiResponse.choices[0].message.content);
      // Normalise all skills to lowercase for case‑insensitive matching
      resumeSkills = (parsed.skills || []).map(s => s.toLowerCase());
      aiAdvice = parsed.advice || "";
    } catch {
      resumeSkills = [];
      aiAdvice = "Could not generate advice.";
    }

    // Get all companies from DB
    const companies = await Company.find();
    const companiesWithMatch = [];

    companies.forEach((company) => {
      const skillMatch = matchSkills(resumeSkills, company.skillKeywords);
      const isEligible =
        parseFloat(cgpa) >= company.minCGPA &&
        parseInt(backlogs) <= company.maxBacklogs &&
        company.branchesAllowed.includes(branch);

      // Missing skills (case‑insensitive)
      const missingSkills = company.skillKeywords.filter(
        (skill) => !resumeSkills.includes(skill.toLowerCase())
      );

      companiesWithMatch.push({
        company: company.name,
        matchScore: Math.round(skillMatch.score),
        matchedSkills: skillMatch.matched,      // original case from company (for display)
        missingSkills: missingSkills,
        eligible: isEligible,
        minCGPA: company.minCGPA,
        maxBacklogs: company.maxBacklogs,
        branchesAllowed: company.branchesAllowed,
      });
    });

    // Simple ATS score (customise as needed)
    const atsScore = Math.min(100, resumeSkills.length * 5);

    // Delete the uploaded file
    fs.unlinkSync(file.path);

    res.json({
      atsScore,
      extractedSkills: resumeSkills,            // lowercase skills
      companies: companiesWithMatch,
      // optional backward compatibility
      eligibleCompanies: companiesWithMatch,
      aiAdvice,
    });

  } catch (error) {
    console.error("Resume analysis error:", error);
    res.status(500).json({ error: "Resume analysis failed" });
  }
};