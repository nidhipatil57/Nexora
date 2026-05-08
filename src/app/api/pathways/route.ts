import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const pathways = await prisma.careerPathway.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, pathways });
  } catch (error) {
    console.error("Fetch pathways error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch pathways" }, { status: 500 });
  }
}
