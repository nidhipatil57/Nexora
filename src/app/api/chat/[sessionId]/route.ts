import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import prisma from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { sessionId } = await params; // Ensure params are awaited in newer Next.js

    // Check if session exists and belongs to user
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId, userId: auth.userId }
    });

    if (!session) return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });

    // Delete session (onDelete: Cascade will handle messages)
    await prisma.chatSession.delete({
      where: { id: sessionId, userId: auth.userId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE ERROR:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { sessionId } = await params;
    const { title } = await req.json();

    await prisma.chatSession.update({
      where: { id: sessionId, userId: auth.userId },
      data: { title },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PATCH ERROR:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
