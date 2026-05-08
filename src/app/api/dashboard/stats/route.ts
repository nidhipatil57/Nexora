import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = auth.userId;

    // Fetch the user's profile for career score
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { careerScore: true }
    });

    // Count career recommendations
    const matchesCount = await prisma.careerRecommendation.count({
      where: { userId }
    });

    // Count skills tracked
    const skillsCount = await prisma.userSkill.count({
      where: { userId }
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streak: true }
    });

    return NextResponse.json({
      success: true,
      stats: {
        careerScore: profile?.careerScore || 0,
        matches: matchesCount,
        skills: skillsCount,
        streak: user?.streak || 0
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}
