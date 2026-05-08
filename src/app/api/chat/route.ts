import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { chatWithMentor } from "@/lib/ai";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { message, sessionId, mode } = await req.json();
    if (!message) return NextResponse.json({ success: false, error: "Message required" }, { status: 400 });

    // Get or create session
    let session;
    if (sessionId) {
      session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    }
    if (!session) {
      session = await prisma.chatSession.create({
        data: { userId: auth.userId, title: message.slice(0, 50), mode: mode || "general" },
      });
    }

    // Save user message
    await prisma.chatMessage.create({
      data: { userId: auth.userId, sessionId: session.id, role: "user", content: message },
    });

    // Get conversation history
    const history = await prisma.chatMessage.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    const messages = history.map((m) => ({ role: m.role, content: m.content }));

    // Generate AI response
    const aiResponse = await chatWithMentor(messages, session.mode);

    // Save AI response
    const assistantMessage = await prisma.chatMessage.create({
      data: { userId: auth.userId, sessionId: session.id, role: "assistant", content: aiResponse },
    });

    // Award XP for engagement
    await prisma.user.update({
      where: { id: auth.userId },
      data: { xp: { increment: 5 } },
    });

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ success: false, error: "Chat failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (sessionId) {
      const messages = await prisma.chatMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: "asc" },
      });
      return NextResponse.json({ success: true, messages });
    }

    const sessions = await prisma.chatSession.findMany({
      where: { userId: auth.userId },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });
    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    console.error("Chat fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
