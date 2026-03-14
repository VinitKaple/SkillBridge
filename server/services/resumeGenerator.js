// server/services/resumeGenerator.js
import Handlebars from "handlebars";
import fsExtra from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_PATH = path.join(__dirname, "../templates/resumeTemplate.html");

export async function renderResumeHTML(resumeData) {
  const templateSource = await fsExtra.readFile(TEMPLATE_PATH, "utf-8");
  const template = Handlebars.compile(templateSource);

  const safeData = {
    name: resumeData.name || "Your Name",
    email: resumeData.email || "",
    phone: resumeData.phone || "",
    location: resumeData.location || "",
    linkedin: resumeData.linkedin || "",
    github: resumeData.github || "",
    portfolio: resumeData.portfolio || "",
    summary: resumeData.summary || "",
    skills: Array.isArray(resumeData.skills) ? resumeData.skills : [],
    experience: Array.isArray(resumeData.experience)
      ? resumeData.experience.map((e) => ({ ...e, bullets: Array.isArray(e.bullets) ? e.bullets : [] }))
      : [],
    projects: Array.isArray(resumeData.projects)
      ? resumeData.projects.map((p) => ({ ...p, bullets: Array.isArray(p.bullets) ? p.bullets : [] }))
      : [],
    education: Array.isArray(resumeData.education) ? resumeData.education : [],
    achievements: Array.isArray(resumeData.achievements) ? resumeData.achievements : [],
  };

  return template(safeData);
}