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

    // Save user message
    await prisma.chatMessage.create({
      data: { sessionId, userId: auth.userId, role: "user", content: message },
    });

    // Get conversation history
    const history = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const context = history.reverse().map(m => `${m.role}: ${m.content}`).join("\n");
    const prompt = `You are the Nexora AI Career Mentor. Be helpful, professional, and encouraging. 
    Context:\n${context}\n\nAssistant:`;

    const aiResponse = await generateAIResponse(prompt, "You are a career mentor. Help the user with their career goals.");

    const botMessage = await prisma.chatMessage.create({
      data: { sessionId, userId: auth.userId, role: "assistant", content: aiResponse },
    });

    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: botMessage, sessionId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "AI Mentor is temporarily unavailable" }, { status: 500 });
  }
}
