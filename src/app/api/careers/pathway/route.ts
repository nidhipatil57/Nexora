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

    const prompt = `Generate a detailed 5-year career pathway for becoming a "${careerTitle}". 
The user has these skills: ${userSkills} and interests: ${userInterests}.

Create exactly 5 phases, one for each individual year: Year 1, Year 2, Year 3, Year 4, and Year 5.
For each year, provide:
1. title: A specific phase title (e.g., "Junior Implementation").
2. desc: What they should achieve.
3. milestones: 3 specific goals for that year.
4. skills: 4-5 unique skills that advance from previous years (e.g., Year 1: Basic React, Year 2: Advanced React & State Management).

Respond ONLY with a valid JSON array of 5 objects:
[
  { "year": "1", "title": "Foundation", "desc": "...", "milestones": ["..."], "skills": ["..."] },
  ...
  { "year": "5", "title": "Expertise", "desc": "...", "milestones": ["..."], "skills": ["..."] }
]`;

    const aiResponse = await generateAIResponse(prompt, "You are a career pathway expert. Respond ONLY with valid JSON arrays of 5 objects. No markdown.");

    let milestones;
    try {
      const cleaned = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      milestones = JSON.parse(cleaned);
    } catch {
      milestones = Array.from({ length: 5 }, (_, i) => ({
        year: (i + 1).toString(),
        title: i === 0 ? "Entry Level" : i < 3 ? "Growth Phase" : "Mastery",
        desc: `Strategic growth plan for year ${i + 1}`,
        status: i === 0 ? "current" : "future",
        milestones: [`Key objective for year ${i + 1}`, `Networking goal ${i + 1}`, `Skill acquisition target ${i + 1}`],
        skills: i === 0 ? ["Foundations"] : ["Advanced Concepts"]
      }));
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
