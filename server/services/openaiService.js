import OpenAI from "openai";

export async function generateStructuredResume(rawText) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const systemPrompt = `You are an expert technical resume writer.
Convert the raw document text into a structured JSON resume.
Rules:
1. Output ONLY valid JSON. No markdown, no code blocks.
2. Write bullets in action-verb format: "Built X using Y, achieving Z".
3. Quantify achievements wherever possible.
4. Group skills by category.
5. Summary: 2-3 sentences max.

Return exactly this JSON structure:
{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "github": "",
  "portfolio": "",
  "summary": "",
  "skills": [
    { "category": "Languages", "items": "Python, JavaScript" },
    { "category": "Frameworks", "items": "React, Node.js" },
    { "category": "Databases", "items": "MongoDB, PostgreSQL" },
    { "category": "Tools & Platforms", "items": "Git, Docker, AWS" }
  ],
  "experience": [
    {
      "role": "",
      "company": "",
      "location": "",
      "duration": "",
      "bullets": []
    }
  ],
  "projects": [
    {
      "name": "",
      "duration": "",
      "techStack": "",
      "bullets": []
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "duration": "",
      "details": ""
    }
  ],
  "achievements": []
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Convert this to resume JSON:\n\n${rawText.slice(0, 12000)}\n\nReturn ONLY JSON.` },
    ],
    temperature: 0.3,
    max_tokens: 3000,
  });

  const raw = completion.choices[0].message.content.trim()
    .replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

  return JSON.parse(raw);
}