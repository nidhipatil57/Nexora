import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import prisma from "@/lib/db";


export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const assessments = await prisma.assessment.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
      include: { questions: true, answers: true }
    });

    return NextResponse.json({ success: true, assessments });
  } catch (error) {
    console.error("Fetch assessments error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch assessments" }, { status: 500 });
  }
}

import { generateAssessmentAnalysis } from "@/lib/ai";

const answerKeys: Record<string, number[]> = {
  cog: [0, 1, 0, 2, 0, 0, 1, 1, 0, 1],
  pers: [0, 0, 1, 2, 3, 0, 0, 2, 3, 3], 
  tech: [2, 2, 1, 0, 1, 2, 1, 2, 1, 1],
  lead: [1, 1, 0, 1, 1, 1, 1, 1, 2, 2],
  creative: [1, 0, 2, 1, 0, 2, 1, 0, 2, 1],
  analytical: [0, 2, 1, 0, 2, 1, 0, 2, 0, 1],
};

export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { type, title, questions, answers } = await req.json();

    // Calculate score
    let correctCount = 0;
    const correctAnswers: Record<string, number> = {};
    const keys = answerKeys[type] || answerKeys.cog;
    
    for (let i = 0; i < questions.length; i++) {
      const userAnswer = answers[i];
      const correct = keys[i] !== undefined ? keys[i] : 0;
      correctAnswers[i] = correct;
      if (userAnswer === correct) correctCount++;
    }

    const score = Math.round((correctCount / questions.length) * 100);
    let analysis = null;

    // Custom logic for personality and leadership
    if (type === "pers" || type === "lead") {
      try {
        const aiResponse = await generateAssessmentAnalysis(type, questions, answers);
        analysis = JSON.parse(aiResponse);
      } catch (e) {
        console.error("AI Analysis error:", e);
        analysis = { traits: ["Adaptable", "Communicator"], overview: "Your results indicate a balanced professional style with strong potential for growth.", compatibility: 75 };
      }
    }

    // Create assessment record
    const assessment = await prisma.assessment.create({
      data: {
        userId: auth.userId,
        type,
        title,
        status: "completed",
        score: (type === "pers" || type === "lead") ? 0 : score, // Set score to 0 for these types
        maxScore: 100,
        results: JSON.stringify({ 
          answers, 
          correctAnswers, 
          correctCount, 
          totalQuestions: questions.length,
          analysis 
        }),
        completedAt: new Date(),
        startedAt: new Date(),
      }
    });

    // Create question records
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      await prisma.assessmentQuestion.create({
        data: {
          assessmentId: assessment.id,
          question: q.question,
          options: JSON.stringify(q.options),
          correctAnswer: String(keys[i] !== undefined ? keys[i] : 0),
          difficulty: 3,
          category: type,
        }
      });
    }

    // Update user XP
    await prisma.user.update({
      where: { id: auth.userId },
      data: { xp: { increment: score >= 70 ? 150 : 50 } }
    });

    return NextResponse.json({
      success: true,
      assessment: { id: assessment.id, score, type, title, analysis },
      correctAnswers,
    });
  } catch (error) {
    console.error("Submit assessment error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit assessment" }, { status: 500 });
  }
}
