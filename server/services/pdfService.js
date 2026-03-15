import puppeteer from "puppeteer";
import fsExtra from "fs-extra";
import { createRequire } from "module";
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { randomBytes } from "crypto";

const require = createRequire(import.meta.url);

export async function extractTextFromPDF(buffer) {
  const tmpPath = join(tmpdir(), `resume-${randomBytes(8).toString("hex")}.pdf`);
  try {
    await writeFile(tmpPath, buffer);
    const PDFParser = require("pdf2json");
    return await new Promise((resolve, reject) => {
      const parser = new PDFParser(null, 1);
      parser.on("pdfParser_dataReady", (pdfData) => {
        try {
          const text = pdfData.Pages
            .map(page =>
              page.Texts
                .map(t => t.R.map(r => {
                  try { return decodeURIComponent(r.T); }
                  catch { return r.T.replace(/%[0-9A-Fa-f]{2}/g, " "); }
                }).join(" "))
                .join(" "))
            .join("\n");
          resolve(text);
        } catch (e) { reject(e); }
      });
      parser.on("pdfParser_dataError", (err) => {
        reject(new Error(err.parserError || "PDF parsing failed"));
      });
      parser.loadPDF(tmpPath);
    });
  } finally {
    try { await unlink(tmpPath); } catch (_) {}
  }
}

export async function htmlToPDF(htmlContent) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    await page.emulateMediaType("screen");
    return await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" },
    });
  } finally {
    if (browser) await browser.close();
  }
}

export async function deleteTempFile(filePath) {
  try { await fsExtra.remove(filePath); } catch (_) {}
}