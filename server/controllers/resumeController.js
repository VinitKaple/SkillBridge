import fs from "fs";
import pdfParse from "pdf-parse";
import OpenAI from "openai";
import Company from "../models/companyModel.js";
import { matchSkills } from "../utils/skillMatcher.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API
});

export const analyzeResume = async (req, res) => {

  try {

    const {
      cgpa,
      backlogs,
      branch,
      gradYear,
      targetRole
    } = req.body;

    const file = req.file;

    const pdfBuffer = fs.readFileSync(file.path);

    const pdfData = await pdfParse(pdfBuffer);

    const text = pdfData.text;

    // AI SKILL EXTRACTION

    const aiResponse = await openai.chat.completions.create({

      model: "gpt-4o-mini",

      messages: [
        {
          role: "system",
          content:
            "Extract skills from resume. Return JSON array of skills only."
        },
        {
          role: "user",
          content: text
        }
      ]

    });

    let resumeSkills = [];

    try {

      resumeSkills = JSON.parse(aiResponse.choices[0].message.content);

    } catch {

      resumeSkills = [];

    }

    const companies = await Company.find();

    const eligibleCompanies = [];

    companies.forEach(company => {

      const isEligible =
        cgpa >= company.minCGPA &&
        backlogs <= company.maxBacklogs &&
        company.branchesAllowed.includes(branch);

      if (isEligible) {

        const skillMatch = matchSkills(
          resumeSkills,
          company.skillKeywords
        );

        eligibleCompanies.push({
          company: company.name,
          matchScore: skillMatch.score,
          matchedSkills: skillMatch.matched
        });

      }

    });

    const atsScore = Math.min(100, resumeSkills.length * 5);

    // AI Recommendation

    const recommendation = await openai.chat.completions.create({

      model: "gpt-4o-mini",

      messages: [
        {
          role: "system",
          content:
            "You are an AI career advisor. Give concise recommendations."
        },
        {
          role: "user",
          content: `
Student Skills: ${resumeSkills}
Target Role: ${targetRole}
Provide improvement suggestions.
`
        }
      ]

    });

    res.json({

      atsScore,

      extractedSkills: resumeSkills,

      eligibleCompanies,

      aiAdvice: recommendation.choices[0].message.content

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Resume analysis failed"
    });

  }

};