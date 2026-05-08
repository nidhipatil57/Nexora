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

    const prompt = `Generate a 5-phase career roadmap for "${careerTitle}". 
Include specific milestones and skills for each year. 
User skills: ${userSkills}.
Respond ONLY with a JSON array of 5 objects: [{"year":1,"title":"...","desc":"...","milestones":["..."],"skills":["..."]}, ...]`;

    const aiResponse = await generateAIResponse(prompt, "JSON only. No markdown. Fast response.");

    let milestones;
    try {
      const cleaned = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      milestones = JSON.parse(cleaned);
    } catch {
      milestones = [
        { year: 1, title: "Foundations", desc: "Building the core expertise", milestones: ["Establish basics", "Network", "Get certified"], skills: ["Core Tech", "Soft Skills"] },
        { year: 2, title: "Growth", desc: "Expanding scope and responsibility", milestones: ["Lead small project", "Advanced cert", "Contribute to OSS"], skills: ["System Design", "Cloud"] },
        { year: 3, title: "Specialization", desc: "Becoming a subject matter expert", milestones: ["Mentor others", "Speak at event", "Design architecture"], skills: ["Deep Tech", "Strategy"] },
        { year: 4, title: "Leadership", desc: "Strategic impact and vision", milestones: ["Strategic planning", "Cross-team lead", "Major delivery"], skills: ["Leadership", "Budgeting"] },
        { year: 5, title: "Mastery", desc: "Industry recognition", milestones: ["Thought leadership", "Executive influence", "Global impact"], skills: ["Executive Presence", "Innovation"] }
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
