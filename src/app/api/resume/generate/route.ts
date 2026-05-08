import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { generateAIResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { name, email, phone, location, skills, languages, experience, education, projects, template } = await req.json();

    const prompt = `Generate a professional resume in JSON format for:
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Location: ${location || "Not provided"}
Skills: ${skills}
Languages: ${languages}
Experience: ${experience}
Education: ${education}
Projects: ${projects || "Not provided"}

Writing Tone/Style: ${template} (e.g., Creative = bold & narrative, Corporate = professional & metrics-driven, Minimal = concise & direct)

CRITICAL: Rewrite the content specifically in the chosen "${template}" tone.
Respond ONLY with valid JSON:
{
  "summary": "Professional summary in ${template} tone",
  "experience": [{"title": "Job Title", "company": "Company", "period": "Date Range", "bullets": ["achievement rewritten in ${template} style"]}],
  "education": [{"degree": "Degree", "institution": "School", "year": "Year"}],
  "skills": ["skill1", "skill2"],
  "projects": [{"name": "Project", "description": "Description in ${template} style", "tech": ["tech1"]}],
  "languages": ["language1"],
  "certifications": []
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
