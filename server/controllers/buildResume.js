import fsExtra from "fs-extra";
import { extractTextFromPDF, htmlToPDF, deleteTempFile } from "../services/pdfService.js";
import { generateStructuredResume } from "../services/openaiService.js";
import { renderResumeHTML } from "../services/resumeGenerator.js";

export async function generateResume(req, res) {
  const uploadedFilePath = req.file?.path;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }
    const fileBuffer = await fsExtra.readFile(uploadedFilePath);
    const extractedText = await extractTextFromPDF(fileBuffer);
    if (!extractedText || extractedText.trim().length < 50) {
      await deleteTempFile(uploadedFilePath);
      return res.status(422).json({ success: false, message: "Could not extract text from PDF." });
    }
    const structuredResume = await generateStructuredResume(extractedText);
    const htmlContent = await renderResumeHTML(structuredResume);
    const pdfBuffer = await htmlToPDF(htmlContent);
    const safeName = (structuredResume.name || "Resume")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "_");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${safeName}_Resume.pdf"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("[ResumeController] Error:", error);
    res.status(500).json({ success: false, message: error.message || "Unexpected error." });
  } finally {
    if (uploadedFilePath) await deleteTempFile(uploadedFilePath);
  }
}