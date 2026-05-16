import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import prisma from "@/lib/db";

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

    // Get chat history
    const history = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    // Get user profile for context
    const profile = await prisma.profile.findUnique({ where: { userId: auth.userId } });
    const user = await prisma.user.findUnique({ where: { id: auth.userId } });

    const safeJsonParse = (val: string | null | undefined, fallback: any = null) => {
      if (!val) return fallback;
      try { return JSON.parse(val); } catch { return fallback; }
    };

    const userTools = safeJsonParse(profile?.skills, []);
    const userDomains = safeJsonParse(profile?.interests, []);
    const experience = safeJsonParse(profile?.education, {});
    const dreamRoles = safeJsonParse(profile?.dreamCareers, []);
    const projectTypes = safeJsonParse(profile?.strengths, []);
    const careerGoals = safeJsonParse(profile?.values, []);

    // Build a rich system prompt with user context
    const systemPrompt = `You are Nexora AI Mentor — an expert career advisor and tech mentor. You are speaking with ${user?.name || "a user"}.

ABOUT THIS USER:
- Experience: ${experience.level || "unknown"}, studying ${experience.fieldOfStudy || "tech"}
- Tech domains of interest: ${userDomains.join(", ") || "not specified"}
- Tools/Languages they know: ${userTools.join(", ") || "not specified"}
- Dream career roles: ${dreamRoles.join(", ") || "not specified"}
- Project interests: ${projectTypes.join(", ") || "not specified"}
- Career goals: ${careerGoals.join(", ") || "not specified"}

YOUR BEHAVIOR RULES:
1. You are a knowledgeable, warm, and encouraging tech career mentor.
2. ALWAYS answer the user's question directly and thoroughly. Never give vague or evasive responses.
3. When asked about a technical topic (programming, frameworks, tools), provide specific, accurate, and detailed information.
4. When asked career advice, give actionable, specific guidance tailored to their profile above.
5. When asked for resources, provide REAL course names, book titles, YouTube channels, and websites.
6. When asked interview questions, give detailed sample answers with explanations.
7. Use clear paragraph structure. Use numbered lists for steps. Use bullet points for lists of items.
8. Keep your tone professional but friendly — like a senior engineer mentoring a junior.
9. If you don't know something, say so honestly. Don't make up facts.
10. Each response should be substantive (at least 3-4 sentences for simple questions, more for complex ones).
11. Personalize advice using the user's profile data above — reference their tools, domains, and goals.
12. Do NOT use markdown formatting symbols like **, ##, etc. Use plain text with numbered lists (1. 2. 3.) and dashes (- item) for structure.`;

    const messagesForAI = history.map(m => ({
      role: m.role,
      content: m.content
    }));

    // Call Gemini directly with proper system instruction handling
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: true, message: { id: "err", role: "assistant", content: "AI service is not configured. Please check API key." }, sessionId });
    }

    const models = [
      "models/gemini-2.0-flash",
      "models/gemini-flash-latest",
      "models/gemini-2.0-flash-lite"
    ];

    let aiResponse = "";

    for (const model of models) {
      try {
        // Build proper Gemini contents with system instruction as the first turn
        const contents: any[] = [];

        // Add system instruction as a user message, followed by acknowledgment
        contents.push({
          role: "user",
          parts: [{ text: systemPrompt }]
        });
        contents.push({
          role: "model",
          parts: [{ text: `Understood! I'm Nexora AI Mentor, ready to help ${user?.name || "you"} with personalized career and tech guidance. I have your profile context and I'll provide thorough, specific answers to every question. What would you like to discuss?` }]
        });

        // Add chat history
        for (const m of messagesForAI) {
          contents.push({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }]
          });
        }

        // Ensure the last message is from the user (Gemini requirement)
        if (contents[contents.length - 1].role === "model") {
          // This shouldn't happen since we just added the user message, but safety check
          contents.push({
            role: "user",
            parts: [{ text: "Please respond to my previous message." }]
          });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.7,
              topP: 0.9,
              maxOutputTokens: 2048,
            }
          })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          aiResponse = data.candidates[0].content.parts[0].text
            .replace(/```/g, "")       // Remove code fences
            .replace(/\*\*/g, "")      // Remove bold markdown
            .replace(/\*/g, "")        // Remove italic markdown
            .replace(/^#{1,6}\s/gm, "") // Remove heading markers at line start only
            .trim();
          break;
        }
      } catch (e) {
        console.error(`Chat model ${model} failed:`, e);
        continue;
      }
    }

    if (!aiResponse) {
      aiResponse = "I apologize, but I'm having trouble processing your request right now. Could you please rephrase your question or try again in a moment?";
    }

    const botMessage = await prisma.chatMessage.create({
      data: { sessionId, userId: auth.userId, role: "assistant", content: aiResponse },
    });

    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: botMessage, sessionId });
  } catch (error) {
    console.error("Chat error:", error);
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
