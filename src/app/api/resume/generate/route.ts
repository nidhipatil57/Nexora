import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { generateAIResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { name, email, phone, location, skills, languages, experience, education, projects, template } = await req.json();

    const prompt = `Act as an Elite Executive Resume Writer and ATS Optimization Expert. Generate a high-fidelity, company-ready professional resume in JSON format.

USER INPUT DATA:
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Location: ${location || "Not provided"}
Skills: ${skills}
Languages: ${languages}
Experience: ${experience}
Education: ${education}
Projects: ${projects || "Not provided"}

CRITICAL INSTRUCTION - STRICT ACCURACY BUT MAXIMUM IMPACT:
1. STRICT ACCURACY: You MUST ONLY use the specific jobs, projects, degrees, and core skills provided in the user input above. Do NOT invent new past employers, fake degrees, or completely unrelated skills.
2. MAXIMUM FRAMING: However, you MUST dramatically enhance and expand upon the descriptions of the provided input. Frame their raw input into powerful, highly detailed, and "company-ready" statements. Use elite professional language and industry-standard keywords to make their actual experience sound incredibly impressive.

CONTENT REQUIREMENTS:
1. SUMMARY: Write a 4-5 sentence powerful executive summary based ONLY on the user's provided profile. Highlight their unique value proposition.
2. EXPERIENCE: For every role mentioned in the input, generate 4-6 highly detailed, high-impact bullet points (2-3 lines each if needed). Frame their raw input using the formula: [Action Verb] + [Task/Scope] + [Implied or Measurable Impact]. Make the language extremely professional.
3. PROJECTS: Provide extremely detailed technical descriptions for the projects mentioned. Frame them as major achievements.
4. SKILLS: Organize the provided skills logically into categories.
5. ATS OPTIMIZATION: Seamlessly weave relevant keywords throughout the bullet points to ensure high ATS match rates.

Respond ONLY with valid JSON:
{
  "summary": "High-impact executive summary...",
  "experience": [{"title": "Job Title", "company": "Company", "period": "Date Range", "bullets": ["Metric-driven achievement 1", "Metric-driven achievement 2", "Metric-driven achievement 3", "Metric-driven achievement 4"]}],
  "education": [{"degree": "Degree", "institution": "School", "year": "Year"}],
  "skills": ["Skill Category 1: Skill A, Skill B", "Skill Category 2: Skill C, Skill D"],
  "projects": [{"name": "Project Name", "description": "Detailed technical problem/solution/impact description", "tech": ["Tech1", "Tech2"]}],
  "languages": ["Language (Proficiency Level)"],
  "certifications": ["Relevant Certification A", "Relevant Certification B"]
}`;

    const aiResponse = await generateAIResponse(prompt, "You are an elite expert resume writer. CRITICAL: Expand the user's raw input into highly impressive, detailed, company-ready professional statements, but DO NOT invent fake jobs or fake degrees. Respond ONLY with valid JSON.");

    let resumeData;
    try {
      let cleaned = aiResponse.trim();
      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
      }
      resumeData = JSON.parse(cleaned);
    } catch {
      resumeData = {
        summary: `Dedicated professional with expertise in ${skills}. Experienced in ${experience}. Seeking opportunities to leverage skills in a dynamic environment.`,
        experience: [{ title: "Professional", company: "Company", period: "Present", bullets: ["Developed and maintained applications", "Collaborated with cross-functional teams", "Improved processes and workflows"] }],
        education: [{ degree: education, institution: "University", year: "2024" }],
        skills: skills.split(",").map((s: string) => s.trim()),
        projects: [],
        languages: languages.split(",").map((l: string) => l.trim()),
        certifications: []
      };
    }

    return NextResponse.json({ success: true, resumeData });
  } catch (error) {
    console.error("Resume generation error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate resume" }, { status: 500 });
  }
}
