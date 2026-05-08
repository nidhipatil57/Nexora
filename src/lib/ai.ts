import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function cleanAIResponse(text: string): string {
  // Strip markdown code blocks if present
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

export async function generateAIResponse(prompt: string, systemInstruction?: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction || "You are Nexora AI, an expert career guidance counselor. You are warm, insightful, and data-driven. Provide actionable advice.",
    });
    const result = await model.generateContent(prompt);
    return cleanAIResponse(result.response.text());
  } catch (error) {
    console.error("Gemini API error:", error);
    return getFallbackResponse(prompt);
  }
}

export async function generateCareerRecommendations(profile: Record<string, unknown>): Promise<string> {
  const prompt = `Act as a senior career strategist. Analyze this user's unique profile and recommend the top 5 highly-relevant career paths that align perfectly with their specific interests, skills, and personality traits.
  
  User Profile:
  ${JSON.stringify(profile, null, 2)}

  For each recommended career, you MUST provide:
  1. title: The specific job title.
  2. matchScore: A number from 0-100 reflecting the alignment with the profile.
  3. description: A compelling summary of the role.
  4. salaryRange: Estimated annual salary (e.g., "$90,000 - $150,000").
  5. growthPotential: "high", "medium", or "low".
  6. requiredSkills: An array of the top 5 technical and soft skills needed.
  7. reasoning: A specific explanation of WHY this fits the user's provided interests and skills.

  CRITICAL: Base your recommendations HEAVILY on the "interests" and "skills" provided in the profile. Do not give generic tech roles if they don't match the user's input.
  
  Respond ONLY with a valid JSON array of objects. No markdown, no conversational text.`;

  return generateAIResponse(prompt, "You are a precise career recommendation engine. Your output must be ONLY a valid JSON array of objects.");
}

export async function generateSkillGapAnalysis(currentSkills: string[], targetCareer: string): Promise<string> {
  const prompt = `Analyze skill gaps for someone with skills [${currentSkills.join(", ")}] wanting to pursue "${targetCareer}". 
  
For each missing skill provide: name, currentLevel (0-100), requiredLevel (0-100), priority (high/medium/low), resources (array of course names).

Respond ONLY with a valid JSON array.`;

  return generateAIResponse(prompt, "You are a skill gap analysis AI. Respond only with valid JSON.");
}

export async function generateAssessmentAnalysis(type: string, questions: any[], answers: any[]): Promise<string> {
  const prompt = `Analyze these assessment results for category "${type}".
  
Questions & Answers:
${questions.map((q, i) => `Q: ${q.question} | A: ${q.options[answers[i]] || "No Answer"}`).join("\n")}

Provide:
1. traits: A JSON array of 4-5 personality/leadership traits identified.
2. overview: A short professional paragraph (3-4 sentences) summarizing their profile.
3. compatibility: A percentage (0-100) representing how well this personality/leadership style fits a general high-performance career pathway.

Respond ONLY with valid JSON with keys: traits (array), overview (string), compatibility (number).`;

  return generateAIResponse(prompt, "You are an expert psychometric analyst. Respond only with valid JSON.");
}

export async function generateResumeContent(profile: Record<string, unknown>): Promise<string> {
  const prompt = `Generate a professional resume for this profile: ${JSON.stringify(profile)}. 
Include: summary, experience highlights, skills section, education. Format as JSON with keys: summary, highlights (array), skills (array), education (string).

Respond ONLY with valid JSON.`;

  return generateAIResponse(prompt, "You are an expert resume writer. Respond only with valid JSON.");
}

export async function chatWithMentor(messages: Array<{role: string; content: string}>, mode: string): Promise<string> {
  const modeInstructions: Record<string, string> = {
    general: "You are Nexora AI, a warm and insightful career mentor. Help users navigate their career journey with empathy and data-driven insights.",
    career: "You are a career strategy expert. Help users make informed career decisions with market data and personal fit analysis.",
    resume: "You are an expert resume reviewer. Help users optimize their resumes for ATS systems and human readers.",
    interview: "You are an interview preparation coach. Help users practice for interviews with mock questions and feedback.",
  };

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: modeInstructions[mode] || modeInstructions.general,
    });

    const history = messages.slice(0, -1).map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));
    
    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API error in chat:", error);
    return "I'm currently experiencing some technical difficulties connecting to my knowledge base, but I'm here to help you navigate your career journey! Tell me about your interests, skills, and goals, and I'll provide personalized guidance as soon as I'm back online.";
  }
}

function getFallbackResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes("career") || lower.includes("recommend")) {
    return JSON.stringify([
      { title: "Software Engineer", matchScore: 92, description: "Design and build software systems", salaryRange: "$80,000 - $180,000", growthPotential: "high", requiredSkills: ["Programming", "Problem Solving", "System Design"], reasoning: "Strong analytical skills and technical aptitude" },
      { title: "Data Scientist", matchScore: 88, description: "Extract insights from data using ML", salaryRange: "$90,000 - $170,000", growthPotential: "high", requiredSkills: ["Python", "Statistics", "Machine Learning"], reasoning: "Excellent quantitative abilities" },
      { title: "Product Manager", matchScore: 85, description: "Lead product strategy and development", salaryRange: "$100,000 - $190,000", growthPotential: "high", requiredSkills: ["Strategy", "Communication", "Analytics"], reasoning: "Strong leadership and analytical thinking" },
      { title: "UX Designer", matchScore: 82, description: "Create intuitive user experiences", salaryRange: "$70,000 - $150,000", growthPotential: "high", requiredSkills: ["Design Thinking", "Prototyping", "User Research"], reasoning: "Creative problem-solving abilities" },
      { title: "AI/ML Engineer", matchScore: 80, description: "Build intelligent AI systems", salaryRange: "$110,000 - $200,000", growthPotential: "high", requiredSkills: ["Deep Learning", "Python", "Mathematics"], reasoning: "Strong technical and analytical foundation" },
    ]);
  }
  if (lower.includes("skill") || lower.includes("gap")) {
    return JSON.stringify([
      { name: "Python", currentLevel: 30, requiredLevel: 80, priority: "high", resources: ["Python Bootcamp", "Automate the Boring Stuff"] },
      { name: "Machine Learning", currentLevel: 10, requiredLevel: 70, priority: "high", resources: ["Andrew Ng ML Course", "Fast.ai"] },
      { name: "Data Visualization", currentLevel: 40, requiredLevel: 75, priority: "medium", resources: ["D3.js Mastery", "Tableau Training"] },
    ]);
  }
  return "I'm here to help you navigate your career journey! Tell me about your interests, skills, and goals, and I'll provide personalized guidance. What aspect of your career would you like to explore?";
}
