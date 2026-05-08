import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import prisma from "@/lib/db";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id: sessionId } = await params;
    if (!sessionId) return NextResponse.json({ success: false, error: "Session ID required" }, { status: 400 });

    // Ensure the session belongs to the user
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== auth.userId) {
      return NextResponse.json({ success: false, error: "Session not found or unauthorized" }, { status: 404 });
    }

    // Delete the session (cascade deletes messages)
    await prisma.chatSession.delete({
      where: { id: sessionId },
    });

    return NextResponse.json({ success: true, message: "Session deleted successfully" });
  } catch (error) {
    console.error("Chat delete error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete session" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id: sessionId } = await params;
    if (!sessionId) return NextResponse.json({ success: false, error: "Session ID required" }, { status: 400 });

    const { title } = await req.json();
    if (!title || typeof title !== "string") {
      return NextResponse.json({ success: false, error: "Invalid title" }, { status: 400 });
    }

    // Ensure the session belongs to the user
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== auth.userId) {
      return NextResponse.json({ success: false, error: "Session not found or unauthorized" }, { status: 404 });
    }

    // Update the session title
    const updatedSession = await prisma.chatSession.update({
      where: { id: sessionId },
      data: { title: title.slice(0, 100) },
    });

    return NextResponse.json({ success: true, session: updatedSession });
  } catch (error) {
    console.error("Chat rename error:", error);
    return NextResponse.json({ success: false, error: "Failed to rename session" }, { status: 500 });
  }
}
