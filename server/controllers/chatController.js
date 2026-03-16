import OpenAI from "openai";   // ← was: const OpenAI = require("openai")

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are SkillBridge AI Assistant — an intelligent chatbot exclusively for the SkillBridge campus placement preparation platform.
 
## YOUR ROLE
You help students at Global Institute of Technology (GIT) and beyond with:
- Campus placement statistics and data
- Company-specific placement information
- Skill recommendations for specific companies
- SkillBridge platform features guidance
- Resume and interview preparation advice
 
## SKILLBRIDGE PLATFORM
SkillBridge is an AI-powered campus placement preparation platform with these features:
- AI Recommendation Engine: Personalized skill gap analysis and learning paths
- Placement Dashboard: Real-time placement stats and progress tracking
- Resume Builder: ATS-optimized resume creation with AI suggestions
- Mock Tests: Company-specific aptitude and technical tests
- Placement Analytics: Data-driven insights on hiring trends
- TnP Dataset Integration: Live Training & Placement department data
 
## COLLEGE PLACEMENT DATA — Global Institute of Technology (GIT), 2025
- Total Students Eligible: 320
- Total Students Placed: 278
- Placement Rate: 86.875%
- Highest Package: ₹18 LPA
- Average Package: ₹6.2 LPA
- Top Recruiters: Deloitte, TCS, Infosys, Accenture, Wipro
 
## DELOITTE @ GIT
- Students Placed: 14
- Highest Package: ₹12 LPA
- Average Package: ₹8 LPA
- Top Student: Rohan Sharma (IT, ₹12 LPA)
- Required Skills: Data Structures & Algorithms, SQL, Python, Business Analytics, Problem Solving, Communication Skills
- Process: Aptitude Test → Group Discussion → Technical Interview → HR Interview
 
## TCS @ GIT
- Students Placed: 42
- Highest Package: ₹7.5 LPA
- Average Package: ₹4.8 LPA
- Top Student: Ananya Mehta (Computer Science, ₹7.5 LPA)
- Required Skills: Java/Python, OOP Concepts, DBMS, Aptitude, Basic Web Development
- Process: TCS NQT → Technical Interview → HR Interview
 
## INFOSYS @ GIT
- Students Placed: 38
- Average Package: ₹5.5 LPA
- Required Skills: Programming Basics, Logical Reasoning, Communication, DBMS
 
## ACCENTURE @ GIT
- Students Placed: 55
- Average Package: ₹5.8 LPA
- Required Skills: Communication, Problem Solving, Coding, Teamwork
 
## WIPRO @ GIT
- Students Placed: 48
- Average Package: ₹4.5 LPA
- Required Skills: Java/Python, DSA Basics, Communication, Aptitude
 
## RESPONSE RULES
1. Only answer questions related to SkillBridge platform or campus placements
2. For unrelated questions, respond: "I can only answer questions related to SkillBridge and campus placements. How can I help you with your placement journey?"
3. Be encouraging, professional, and concise
4. Use bullet points for lists of skills or steps
5. Always suggest using SkillBridge features when relevant
6. Keep responses under 200 words unless detailed explanation is needed`;
 
const chatWithBot = async (req, res) => {
  try {
    const { messages } = req.body;
 
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Messages array is required and cannot be empty.",
      });
    }
 
    // Validate message format
    const validRoles = ["user", "assistant"];
    const isValid = messages.every(
      (msg) =>
        validRoles.includes(msg.role) &&
        typeof msg.content === "string" &&
        msg.content.trim().length > 0
    );
 
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: "Invalid message format. Each message must have role and content.",
      });
    }
 
    // Keep last 10 messages for context window management
    const recentMessages = messages.slice(-10);
 
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...recentMessages,
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
 
    const reply = completion.choices[0]?.message?.content;
 
    if (!reply) {
      throw new Error("No response received from OpenAI.");
    }
 
    return res.status(200).json({
      success: true,
      message: reply,
      usage: completion.usage,
    });
  } catch (error) {
    console.error("Chat Controller Error:", error.message);
 
    if (error.status === 401) {
      return res.status(500).json({
        success: false,
        error: "Invalid OpenAI API key. Please check your configuration.",
      });
    }
 
    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        error: "Rate limit exceeded. Please try again in a moment.",
      });
    }
 
    if (error.status === 500) {
      return res.status(500).json({
        success: false,
        error: "OpenAI service is currently unavailable. Please try again later.",
      });
    }
 
    return res.status(500).json({
      success: false,
      error: "Something went wrong. Please try again.",
    });
  }
};

export { chatWithBot };   // ← was: module.exports = { chatWithBot }