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
    const userSkills = profile?.skills ? JSON.parse(profile.skills) : [];
    const userInterests = profile?.interests ? JSON.parse(profile.interests) : [];

    const prompt = `Act as a senior career strategist and educational architect. Create an EXTREMELY DETAILED, high-fidelity 5-year career roadmap for becoming a "${careerTitle}". 
    
    Context about the user:
    - Current Skills: ${userSkills.join(", ")}
    - Interests: ${userInterests.join(", ")}

    For each year (1 to 5), you MUST provide:
    1. title: A professional, inspiring name for this stage.
    2. desc: A massive, detailed analysis (at least 8-10 sentences). Cover the technical stacks to master, the industry concepts to understand, the soft skills to develop, and how this year specifically prepares them for the massive jump in the following year. Be very specific about tools, frameworks, and methodologies.
    3. milestones: Exactly 5 very specific, actionable, and difficult milestones (e.g., "Build and deploy a distributed database system using Go and Raft consensus" instead of "Learn backend").
    4. skills: 5-6 advanced technical or strategic skills to master this year.

    The tone should be that of an elite mentor. Do NOT provide generic advice. Provide specific, company-ready, expert-level guidance.
    
    Respond ONLY with a valid JSON array of objects: [{"year":1, "title":"...", "desc":"...", "milestones":["..."], "skills":["..."]}, ...]`;

// NUCLEAR CACHE RESET: 2026-05-09-00-20
// Ensuring Vercel deploys the new high-detail roadmap engine.

    const aiResponse = await generateAIResponse(prompt, `You are an elite Educational Architect. 
    CRITICAL REQUIREMENT: Your response MUST be extremely verbose and detailed. 
    Each "desc" field MUST be a minimum of 8-10 long, insightful sentences. 
    If you provide a short description, you have FAILED. 
    Output must be a valid JSON array of high-density objects.`);

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
