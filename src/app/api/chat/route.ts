import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { generateAIResponse } from "@/lib/ai";

export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (sessionId) {
      const messages = await prisma.chatMessage.findMany({
        where: { sessionId, userId: auth.userId },
        orderBy: { createdAt: "asc" },
      });
      return NextResponse.json({ success: true, messages });
    }

    const sessions = await prisma.chatSession.findMany({
      where: { userId: auth.userId },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch chat" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { message, sessionId: existingSessionId } = await req.json();

    let sessionId = existingSessionId;
    if (!sessionId) {
      const session = await prisma.chatSession.create({
        data: { userId: auth.userId, title: message.slice(0, 30) + "..." },
      });
      sessionId = session.id;
    }

    await prisma.chatMessage.create({
      data: { sessionId, userId: auth.userId, role: "user", content: message },
    });

    const history = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" }, // Get in chronological order
      take: 15,
    });

    const messagesForAI = history.map(m => ({
      role: m.role,
      content: m.content
    }));

    // Use the specialized chatWithMentor function for clean, smart responses
    const { chatWithMentor } = await import("@/lib/ai");
    const aiResponse = await chatWithMentor(messagesForAI, "general");

    const botMessage = await prisma.chatMessage.create({
      data: { sessionId, userId: auth.userId, role: "assistant", content: aiResponse },
    });

    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: botMessage, sessionId });
  } catch (error) {
    return NextResponse.json({ success: false, error: "AI Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) return NextResponse.json({ success: false }, { status: 400 });

    await prisma.chatSession.delete({
      where: { id: sessionId, userId: auth.userId }
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const { title } = await req.json();

    if (!sessionId) return NextResponse.json({ success: false }, { status: 400 });

    await prisma.chatSession.update({
      where: { id: sessionId, userId: auth.userId },
      data: { title }
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
