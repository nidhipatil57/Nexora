import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyPassword, generateToken } from "@/lib/auth";



export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    // Update streak logic: only increment if last login was not today
    const lastUpdate = new Date(user.updatedAt);
    const now = new Date();
    const isSameDay = lastUpdate.getFullYear() === now.getFullYear() &&
                      lastUpdate.getMonth() === now.getMonth() &&
                      lastUpdate.getDate() === now.getDate();

    let newStreak = user.streak;
    if (!isSameDay) {
      newStreak = user.streak + 1;
      await prisma.user.update({
        where: { id: user.id },
        data: { streak: newStreak },
      });
    }

    const token = generateToken({ userId: user.id, role: user.role });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, xp: user.xp, level: user.level, streak: newStreak, onboarded: user.onboarded },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 });
  }
}
