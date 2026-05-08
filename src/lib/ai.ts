export async function generateAIResponse(prompt: string, systemInstruction?: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return "ERROR: No API Key found in .env file.";

  // Use the EXACT models found in your account's allowed list
  const models = [
    "models/gemini-2.0-flash",
    "models/gemini-flash-latest",
    "models/gemini-2.0-flash-lite",
    "models/gemini-3.1-flash-lite"
  ];

  for (const model of models) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt }] }]
        })
      });
      
      const data = await response.json();
      
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return cleanAIResponse(data.candidates[0].content.parts[0].text);
      }
    } catch (e) {
      continue;
    }
  }

  return "I'm here to help you navigate your career journey! Tell me about your goals and I'll do my best to guide you.";
}

function cleanAIResponse(text: string): string {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/\*\*/g, "") // Remove bold stars
    .replace(/\*/g, "")   // Remove single stars
    .replace(/#/g, "")    // Remove headers
    .replace(/ - /g, "\n• ") // Convert dashes to bullets for better readability if needed
    .trim();
}

export async function generateCareerRecommendations(profile: Record<string, unknown>): Promise<string> {
  const prompt = `Act as a senior career strategist. Analyze: ${JSON.stringify(profile)}. Recommend 5 career paths in JSON array.`;
  return generateAIResponse(prompt, "Respond ONLY with a JSON array of objects.");
}

export async function generateSkillGapAnalysis(currentSkills: string[], targetCareer: string): Promise<string> {
  const prompt = `Skill gaps for [${currentSkills.join(", ")}] to "${targetCareer}". JSON array only.`;
  return generateAIResponse(prompt, "Respond ONLY with a JSON array.");
}

export async function generateAssessmentAnalysis(type: string, questions: any[], answers: any[]): Promise<string> {
  const prompt = `Analyze assessment for "${type}". Results: ${JSON.stringify(answers)}. JSON only.`;
  return generateAIResponse(prompt, "Respond ONLY with valid JSON.");
}

export async function generateResumeContent(profile: Record<string, unknown>): Promise<string> {
  const prompt = `Resume for: ${JSON.stringify(profile)}. JSON format only.`;
  return generateAIResponse(prompt, "Respond ONLY with valid JSON.");
}

export async function chatWithMentor(messages: Array<{role: string; content: string}>, mode: string): Promise<string> {
  const modeInstructions: Record<string, string> = {
    general: "You are Nexora AI, a warm career mentor. Respond in plain text ONLY. Do NOT use markdown, stars, or symbols.",
    career: "You are a career strategy expert. Respond in plain text ONLY.",
    resume: "You are a resume reviewer. Respond in plain text ONLY.",
    interview: "You are an interview coach. Respond in plain text ONLY.",
  };
  const lastMessage = messages[messages.length - 1];
  return generateAIResponse(lastMessage.content, modeInstructions[mode] || modeInstructions.general);
}
