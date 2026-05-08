import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth || auth.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const [userCount, assessmentCount, resumeCount, pathwayCount, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.assessment.count(),
      prisma.resume.count(),
      prisma.careerPathway.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, createdAt: true, xp: true, level: true }
      })
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        users: userCount,
        assessments: assessmentCount,
        resumes: resumeCount,
        pathways: pathwayCount
      },
      recentUsers
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
