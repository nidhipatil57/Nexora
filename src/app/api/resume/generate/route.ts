import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { generateAIResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { name, email, phone, location, skills, languages, experience, education, projects, template } = await req.json();

    const prompt = `Act as an Executive Resume Writer and ATS Optimization Expert. Generate a high-fidelity, company-ready professional resume in JSON format for:
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Location: ${location || "Not provided"}
Skills: ${skills}
Languages: ${languages}
Experience: ${experience}
Education: ${education}
Projects: ${projects || "Not provided"}

Writing Tone: ${template} (Professional, ATS-Optimized, High-Impact)

CRITICAL INSTRUCTIONS FOR CONTENT:
1. SUMMARY: Write a 4-5 sentence powerful executive summary that highlights expertise, years of learning/work, and a unique value proposition.
2. EXPERIENCE: For every role mentioned, generate 4-5 high-impact bullet points. Use the formula: [Action Verb] + [Task] + [Measurable Result (e.g., %, $, Time)]. Ensure it sounds senior and professional.
3. PROJECTS: Provide detailed technical descriptions for projects. Mention the exact tech stack, the architectural challenge solved, and the final impact.
4. SKILLS: Categorize the provided skills into "Technical Expertise" and "Professional Competencies".
5. ATS OPTIMIZATION: Use industry-standard keywords related to the skills provided to ensure the resume passes through recruitment software.

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

    const aiResponse = await generateAIResponse(prompt, "You are an expert resume writer and ATS optimization specialist. Respond ONLY with valid JSON.");

    let resumeData;
    try {
      const cleaned = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
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
