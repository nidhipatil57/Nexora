import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const data = await req.json();

    // Map new onboarding fields to existing Profile columns (all stored as JSON strings)
    await prisma.profile.upsert({
      where: { userId: auth.userId },
      update: {
        education: JSON.stringify(data.experience),         // { level, yearsOfExp, fieldOfStudy }
        interests: JSON.stringify(data.domains),             // tech domain IDs
        skills: JSON.stringify(data.tools),                  // programming languages & tools
        personalityType: JSON.stringify(data.workStyle),     // { teamPref, environment, orgType }
        dreamCareers: JSON.stringify(data.dreamRoles),       // dream role titles
        strengths: JSON.stringify(data.projectTypes),        // project interest IDs
        values: JSON.stringify(data.careerGoals),            // career goal IDs
        learningStyle: data.workStyle?.environment || "hybrid",
        careerScore: 65,
      },
      create: {
        userId: auth.userId,
        education: JSON.stringify(data.experience),
        interests: JSON.stringify(data.domains),
        skills: JSON.stringify(data.tools),
        personalityType: JSON.stringify(data.workStyle),
        dreamCareers: JSON.stringify(data.dreamRoles),
        strengths: JSON.stringify(data.projectTypes),
        values: JSON.stringify(data.careerGoals),
        learningStyle: data.workStyle?.environment || "hybrid",
        careerScore: 65,
      },
    });

    // Clear existing recommendations so fresh ones are generated based on new data
    await prisma.careerRecommendation.deleteMany({
      where: { userId: auth.userId }
    });

    // Mark user as onboarded and award XP
    await prisma.user.update({
      where: { id: auth.userId },
      data: { onboarded: true, xp: { increment: 200 } },
    });

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: auth.userId,
        title: "Welcome to Nexora! 🎉",
        message: "Your AI career profile has been created. Explore your personalized recommendations!",
        type: "achievement",
        actionUrl: "/dashboard",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
