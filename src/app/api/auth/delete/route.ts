import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token) as { userId: string };
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    // Delete the user (cascading will handle related records)
    await prisma.user.delete({
      where: { id: decoded.userId },
    });

    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete account" }, { status: 500 });
  }
}
