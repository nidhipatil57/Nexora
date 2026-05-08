import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    await prisma.profile.create({ data: { userId: user.id } });

    // Send welcome email to manual registrations
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (mailError) {
      console.error("Welcome email failed:", mailError);
    }

    const token = generateToken({ userId: user.id, role: user.role });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, xp: user.xp, level: user.level, streak: user.streak, onboarded: user.onboarded },
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 });
  }
}
