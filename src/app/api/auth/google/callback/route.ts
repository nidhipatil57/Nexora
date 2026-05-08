import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { generateToken, hashPassword } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/mail";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    if (error || !code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=google_auth_failed`);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=google_not_configured`);
    }

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=google_token_failed`);
    }

    // Fetch user info from Google
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userInfoRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=google_no_email`);
    }

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email: googleUser.email } });
    let isNew = false;

    if (!user) {
      // Create new user
      const randomPassword = await hashPassword(crypto.randomUUID());
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || googleUser.email.split("@")[0],
          password: randomPassword,
          avatar: googleUser.picture || null,
          emailVerified: true,
        },
      });
      await prisma.profile.create({ data: { userId: user.id } });
      isNew = true;
      
      // Send welcome email in background
      sendWelcomeEmail(user.email, user.name).catch(e => console.error("Email error:", e));
    }

    // Generate JWT
    const jwtToken = generateToken({ userId: user.id, role: user.role });

    // Build the user data to pass to the frontend
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      onboarded: user.onboarded,
    };

    // Redirect to a client page that sets auth state
    const redirectTo = isNew && !user.onboarded ? "/onboarding" : "/dashboard";
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/success?redirect=${redirectTo}`);
    
    // Set the auth data as cookies so the frontend can pick them up
    response.cookies.set("google_auth_token", jwtToken, { path: "/", maxAge: 60, httpOnly: false });
    response.cookies.set("google_auth_user", JSON.stringify(userData), { path: "/", maxAge: 60, httpOnly: false });
    response.cookies.set("google_auth_is_new", isNew ? "true" : "false", { path: "/", maxAge: 60, httpOnly: false });

    return response;
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=google_callback_error`);
  }
}
