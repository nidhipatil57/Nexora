import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { generateCareerRecommendations } from "@/lib/ai";

export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    // Check for existing recommendations (de-duplicated)
    const existing = await prisma.careerRecommendation.findMany({
      where: { userId: auth.userId },
      include: { career: true },
      orderBy: { matchScore: "desc" },
    });

    if (existing.length > 0) {
      const unique = [];
      const seen = new Set();
      for (const item of existing) {
        if (!seen.has(item.career.title)) {
          seen.add(item.career.title);
          unique.push(item);
        }
      }
      return NextResponse.json({ success: true, recommendations: unique });
    }

    // Fetch user profile with all onboarding data
    const profile = await prisma.profile.findUnique({ where: { userId: auth.userId } });
    const user = await prisma.user.findUnique({ where: { id: auth.userId } });

    // Parse all profile fields for the AI prompt
    const safeJsonParse = (val: string | null | undefined, fallback: any = null) => {
      if (!val) return fallback;
      try { return JSON.parse(val); } catch { return fallback; }
    };

    const enrichedProfile = {
      name: user?.name,
      experience: safeJsonParse(profile?.education, {}),
      domains: safeJsonParse(profile?.interests, []),
      tools: safeJsonParse(profile?.skills, []),
      workStyle: safeJsonParse(profile?.personalityType, {}),
      dreamRoles: safeJsonParse(profile?.dreamCareers, []),
      projectTypes: safeJsonParse(profile?.strengths, []),
      careerGoals: safeJsonParse(profile?.values, []),
    };

    const aiResponse = await generateCareerRecommendations(enrichedProfile);

    let recommendations;
    try {
      // Try to parse AI response - strip any non-JSON prefix/suffix
      let cleaned = aiResponse.trim();
      const jsonStart = cleaned.indexOf("[");
      const jsonEnd = cleaned.lastIndexOf("]");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
      }
      recommendations = JSON.parse(cleaned);
      if (!Array.isArray(recommendations)) throw new Error("Not an array");
    } catch {
      // Fallback: use dream careers and domains to build recommendations
      const dreamCareers = safeJsonParse(profile?.dreamCareers, []);
      const userTools = safeJsonParse(profile?.skills, []);
      if (dreamCareers.length > 0) {
        recommendations = dreamCareers.slice(0, 6).map((title: string, i: number) => ({
          title,
          matchScore: 95 - i * 2,
          description: `A career pathway specifically aligned with your interest in ${title}, leveraging your skills in ${userTools.slice(0, 3).join(", ") || "your domain"}.`,
          salaryRange: "$70,000 - $160,000",
          growthPotential: "high",
          requiredSkills: userTools.slice(0, 5).length > 0 ? userTools.slice(0, 5) : ["Industry Expertise"],
          reasoning: "Directly matches your stated dream career from onboarding."
        }));
      } else {
        recommendations = [
          { title: "Software Engineer", matchScore: 90, description: "Build innovative software solutions", salaryRange: "$80K-$180K", growthPotential: "high", requiredSkills: ["Programming", "Problem Solving", "System Design"], reasoning: "Strong technical foundation" },
          { title: "Data Scientist", matchScore: 86, description: "Unlock insights from data", salaryRange: "$90K-$170K", growthPotential: "high", requiredSkills: ["Python", "Statistics", "ML"], reasoning: "Analytical aptitude" },
          { title: "DevOps Engineer", matchScore: 82, description: "Automate and scale infrastructure", salaryRange: "$85K-$175K", growthPotential: "high", requiredSkills: ["Docker", "CI/CD", "Cloud"], reasoning: "Systems thinking" },
        ];
      }
    }

    // Store recommendations with career entries (de-duplicated)
    const stored = [];
    const seenTitles = new Set();
    
    for (const rec of recommendations) {
      if (seenTitles.has(rec.title)) continue;
      seenTitles.add(rec.title);
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
