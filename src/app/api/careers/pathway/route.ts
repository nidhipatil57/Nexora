import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { generateAIResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { careerId, careerTitle } = await req.json();

    const profile = await prisma.profile.findUnique({ where: { userId: auth.userId } });
    const userSkills = profile?.skills || "[]";
    const userInterests = profile?.interests || "[]";

    const prompt = `Create a 5-phase career roadmap for becoming a "${careerTitle}". 
    For each year (1 to 5), provide a specific title, a description, and 3 clear milestones.
    Respond ONLY with a JSON array: [{"year":1, "title":"Foundations", "desc":"Description", "milestones":["Goal 1","Goal 2","Goal 3"], "skills":["Skill 1","Skill 2"]}, ...]`;

    const aiResponse = await generateAIResponse(prompt, "JSON only. Must include milestones array.");

    let milestones;
    try {
      const cleaned = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      milestones = JSON.parse(cleaned);
      // Ensure milestones is an array and each object has the required fields
      if (!Array.isArray(milestones)) throw new Error("Not an array");
    } catch {
      milestones = [
        { year: 1, title: "Initial Phase", desc: `Starting your journey as ${careerTitle}`, milestones: ["Complete core training", "Build basic portfolio", "Network with peers"], skills: ["Core Tech", "Communication"] },
        { year: 2, title: "Professional Growth", desc: "Expanding your technical scope", milestones: ["Lead a small project", "Get certified", "Contribute to OSS"], skills: ["System Design", "Cloud"] },
        { year: 3, title: "Specialization", desc: "Becoming a subject expert", milestones: ["Mentor others", "Speak at a conference", "Design architecture"], skills: ["Deep Tech", "Strategy"] },
        { year: 4, title: "Leadership", desc: "Strategic impact and vision", milestones: ["Strategic planning", "Cross-team lead", "Major delivery"], skills: ["Leadership", "Management"] },
        { year: 5, title: "Industry Mastery", desc: "Global recognition", milestones: ["Thought leadership", "Executive influence", "Innovate process"], skills: ["Executive Presence", "Innovation"] }
      ];
    }

    const pathway = await prisma.careerPathway.create({
      data: {
        userId: auth.userId,
        careerId: careerId || null,
        title: `${careerTitle} Career Pathway`,
        milestones: JSON.stringify(milestones),
        timeframe: "10y",
      }
    });

    return NextResponse.json({ 
      success: true, 
      pathway: { id: pathway.id, title: pathway.title, milestones },
    });
  } catch (error) {
    console.error("Pathway generation error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate pathway" }, { status: 500 });
  }
}
