import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { generateCareerRecommendations } from "@/lib/ai";

export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    // Check for existing recommendations
    const existing = await prisma.careerRecommendation.findMany({
      where: { userId: auth.userId },
      include: { career: true },
      orderBy: { matchScore: "desc" },
    });

    if (existing.length > 0) {
      return NextResponse.json({ success: true, recommendations: existing });
    }

    // Generate new recommendations
    const profile = await prisma.profile.findUnique({ where: { userId: auth.userId } });
    const user = await prisma.user.findUnique({ where: { id: auth.userId } });

    const aiResponse = await generateCareerRecommendations({
      name: user?.name,
      education: profile?.education ? JSON.parse(profile.education) : null,
      interests: profile?.interests ? JSON.parse(profile.interests) : null,
      skills: profile?.skills ? JSON.parse(profile.skills) : null,
      personalityType: profile?.personalityType,
      dreamCareers: profile?.dreamCareers ? JSON.parse(profile.dreamCareers) : null,
    });

    let recommendations;
    try {
      recommendations = JSON.parse(aiResponse);
    } catch {
      // Intelligent fallback: Use user's dream careers if AI fails
      const dreamCareers = profile?.dreamCareers ? JSON.parse(profile.dreamCareers) : [];
      if (dreamCareers.length > 0) {
        recommendations = dreamCareers.map((title: string) => ({
          title,
          matchScore: 95,
          description: `A career pathway specifically aligned with your interest in ${title}.`,
          salaryRange: "$70,000 - $160,000",
          growthPotential: "high",
          requiredSkills: profile?.skills ? JSON.parse(profile.skills) : ["Industry Expertise"],
          reasoning: "Directly matches your stated dream career in onboarding."
        }));
      } else {
        recommendations = [
          { title: "Software Engineer", matchScore: 92, description: "Build innovative software", salaryRange: "$80K-$180K", growthPotential: "high", requiredSkills: ["Programming", "Problem Solving"], reasoning: "Strong technical aptitude" },
          { title: "Data Scientist", matchScore: 88, description: "Unlock insights from data", salaryRange: "$90K-$170K", growthPotential: "high", requiredSkills: ["Python", "Statistics", "ML"], reasoning: "Analytical mindset" },
          { title: "Product Manager", matchScore: 85, description: "Lead product strategy", salaryRange: "$100K-$190K", growthPotential: "high", requiredSkills: ["Strategy", "Communication"], reasoning: "Leadership potential" },
        ];
      }
    }

    // Store recommendations with career entries
    const stored = [];
    for (const rec of recommendations) {
      let career = await prisma.career.findFirst({ where: { title: rec.title } });
      if (!career) {
        career = await prisma.career.create({
          data: {
            title: rec.title,
            slug: rec.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            description: rec.description || "",
            category: "Technology",
            industry: "Technology",
            salaryMin: (() => {
              let range = rec.salaryRange || "60000 - 150000";
              const parts = range.split("-");
              let minStr = parts[0].replace(/[^0-9kK]/g, "").toLowerCase();
              let min = parseInt(minStr);
              if (minStr.includes("k")) min *= 1000;
              return isNaN(min) ? 60000 : min;
            })(),
            salaryMax: (() => {
              let range = rec.salaryRange || "60000 - 150000";
              const parts = range.split("-");
              let maxStr = parts[parts.length - 1].replace(/[^0-9kK]/g, "").toLowerCase();
              let max = parseInt(maxStr);
              if (maxStr.includes("k")) max *= 1000;
              return isNaN(max) ? 150000 : max;
            })(),
            growthRate: rec.growthPotential === "high" ? 15 : rec.growthPotential === "medium" ? 8 : 3,
            demandLevel: rec.growthPotential || "high",
            automationRisk: 0.2,
            requiredSkills: JSON.stringify(rec.requiredSkills || []),
            education: "Bachelor's degree",
            experienceLevel: "Entry to Senior",
            workStyle: "hybrid",
            futureOutlook: "Positive growth trajectory",
          },
        });
      }

      const recommendation = await prisma.careerRecommendation.create({
        data: {
          userId: auth.userId,
          careerId: career.id,
          matchScore: rec.matchScore || 75,
          satisfactionProb: (rec.matchScore || 75) / 100,
          growthPotential: rec.growthPotential === "high" ? 0.9 : 0.6,
          reasoning: rec.reasoning || "",
          salaryPrediction: JSON.stringify({ min: career.salaryMin, max: career.salaryMax }),
        },
      });
      stored.push({ ...recommendation, career });
    }

    return NextResponse.json({ success: true, recommendations: stored });
  } catch (error) {
    console.error("Recommendations error:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await prisma.careerRecommendation.deleteMany({
      where: { userId: auth.userId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete recommendations error:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
