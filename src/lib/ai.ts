export async function generateAIResponse(prompt: string | any[], systemInstruction?: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return "ERROR: No API Key found in .env file.";

  const models = [
    "models/gemini-2.0-flash",
    "models/gemini-flash-latest",
    "models/gemini-2.0-flash-lite"
  ];

  for (const model of models) {
    try {
      let contents: any[] = [];
      
      if (Array.isArray(prompt)) {
        contents = prompt.map(m => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }));
        
        if (systemInstruction) {
          contents.unshift({
            role: "user",
            parts: [{ text: `SYSTEM INSTRUCTION: ${systemInstruction}` }]
          });
          contents.push({
            role: "model",
            parts: [{ text: "Understood. I will follow those instructions." }]
          });
        }
      } else {
        contents = [{ 
          parts: [{ text: systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt }] 
        }];
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents })
      });
      
      const data = await response.json();
      
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return cleanAIResponse(data.candidates[0].content.parts[0].text);
      }
    } catch (e) {
      console.error(`AI Model ${model} failed:`, e);
      continue;
    }
  }

  return "I'm ready to help you with your career! What specifically would you like to discuss next?";
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

// Domain ID to human-readable label mapping
const domainLabels: Record<string, string> = {
  "frontend": "Frontend Development",
  "backend": "Backend Engineering",
  "fullstack": "Full Stack Development",
  "ai-ml": "AI & Machine Learning",
  "data-eng": "Data Engineering",
  "data-science": "Data Science & Analytics",
  "devops": "DevOps & Cloud",
  "cybersecurity": "Cybersecurity",
  "mobile": "Mobile Development",
  "game-dev": "Game Development",
  "blockchain": "Blockchain & Web3",
  "ui-ux": "UI/UX Design",
  "embedded": "Embedded & IoT",
  "qa": "QA & Test Automation",
  "sre": "Site Reliability Engineering",
};

const projectLabels: Record<string, string> = {
  "build-products": "Building Products",
  "research": "Research & Innovation",
  "optimize": "Optimizing Systems",
  "design-ux": "Creating User Experiences",
  "data-insights": "Data Analysis",
  "lead-teams": "Leading Teams",
  "security": "Security & Protection",
  "automate": "Automation",
};

const goalLabels: Record<string, string> = {
  "high-salary": "High Compensation",
  "work-life": "Work-Life Balance",
  "innovation": "Innovation & Impact",
  "leadership": "Leadership Path",
  "job-security": "Job Security",
  "remote-flex": "Remote Flexibility",
  "learning": "Continuous Learning",
  "entrepreneurship": "Entrepreneurship",
};

export async function generateCareerRecommendations(profile: Record<string, unknown>): Promise<string> {
  const experience = profile.experience as any || {};
  const domains = (profile.domains as string[] || []).map(d => domainLabels[d] || d);
  const tools = profile.tools as string[] || [];
  const workStyle = profile.workStyle as any || {};
  const projectTypes = (profile.projectTypes as string[] || []).map(p => projectLabels[p] || p);
  const careerGoals = (profile.careerGoals as string[] || []).map(g => goalLabels[g] || g);
  const dreamRoles = profile.dreamRoles as string[] || [];

  const prompt = `You are an elite career strategist for the tech industry. A user has completed a detailed onboarding profile. Based on EXACTLY their answers below, recommend 6 career paths that are the BEST FIT for this specific person.

USER PROFILE:
- Experience Level: ${experience.level || "Not specified"} 
- Field of Study: ${experience.fieldOfStudy || "Not specified"}
- Years of Coding: ${experience.yearsOfExp || "Not specified"}
- Tech Domains They Love: ${domains.join(", ") || "Not specified"}
- Programming Languages & Tools They Know: ${tools.join(", ") || "Not specified"}
- Work Preferences: Team=${workStyle.teamPref || "any"}, Environment=${workStyle.environment || "any"}, Org=${workStyle.orgType || "any"}
- Project Types They Enjoy: ${projectTypes.join(", ") || "Not specified"}
- Career Goals: ${careerGoals.join(", ") || "Not specified"}
- Dream Roles: ${dreamRoles.join(", ") || "Not specified"}

CRITICAL RULES:
1. Every recommended career MUST directly connect to the user's selected tech domains, tools, and project interests. Do NOT recommend random or unrelated careers.
2. If they selected "Frontend Development" and know "React, TypeScript", recommend frontend-specific roles, not backend roles.
3. If they selected "AI & Machine Learning" and know "Python, TensorFlow", recommend AI/ML roles, not web dev roles.
4. The match scores should reflect how well the career aligns with their EXACT profile.
5. Include their dream roles if they align with their skills and domains.
6. Each career must have a detailed, unique description specific to how it fits THIS user.

Respond ONLY with a valid JSON array of exactly 6 objects with these fields:
[{
  "title": "exact career title",
  "matchScore": 75-98,
  "description": "2-3 sentence description of this career and why it fits this user specifically",
  "salaryRange": "$XXk - $XXXk",
  "growthPotential": "high" | "medium" | "low",
  "requiredSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "reasoning": "1 sentence on why this matches their profile"
}]`;

  return generateAIResponse(prompt, "Respond ONLY with a valid JSON array. No markdown, no explanations, just the JSON array.");
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
  return generateAIResponse(messages, modeInstructions[mode] || modeInstructions.general);
}
