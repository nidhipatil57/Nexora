import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const data = await req.json();

    // Update profile with onboarding data
    await prisma.profile.upsert({
      where: { userId: auth.userId },
      update: {
        education: JSON.stringify(data.education),
        interests: JSON.stringify(data.interests),
        skills: JSON.stringify(data.skills),
        personalityType: data.personalityType,
        dreamCareers: JSON.stringify(data.dreamCareers),
        strengths: JSON.stringify(data.strengths),
        hobbies: JSON.stringify(data.hobbies),
        learningStyle: data.learningStyle,
        careerScore: 65,
      },
      create: {
        userId: auth.userId,
        education: JSON.stringify(data.education),
        interests: JSON.stringify(data.interests),
        skills: JSON.stringify(data.skills),
        personalityType: data.personalityType,
        dreamCareers: JSON.stringify(data.dreamCareers),
        strengths: JSON.stringify(data.strengths),
        hobbies: JSON.stringify(data.hobbies),
        learningStyle: data.learningStyle,
        careerScore: 65,
      },
    });

    // Clear existing recommendations to ensure fresh ones based on new onboarding data
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
