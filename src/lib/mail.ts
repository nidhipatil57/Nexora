import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendWelcomeEmail(to: string, name: string) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: sans-serif; background-color: #05050A; color: #E2E8F0; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #0F172A; border: 1px solid #1E293B; border-radius: 16px; overflow: hidden; }
        .header { background: linear-gradient(90deg, #8B5CF6, #6366F1, #06B6D4); padding: 40px; text-align: center; }
        .content { padding: 40px; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #1E293B; }
        h1 { margin: 0; font-size: 24px; color: white; }
        h2 { color: white; margin-top: 0; }
        p { line-height: 1.6; color: #94A3B8; }
        .btn { display: inline-block; padding: 12px 24px; background: #6366F1; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
        ul { color: #94A3B8; padding-left: 20px; }
        li { margin-bottom: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Nexora</h1>
          <div style="font-size: 10px; font-weight: bold; margin-top: 5px; color: rgba(255,255,255,0.8); letter-spacing: 2px;">YOUR TECH ASSISTANT</div>
        </div>
        <div class="content">
          <h2>Account Created Successfully!</h2>
          <p>Hey ${name},</p>
          <p>Welcome to Nexora, your AI-powered career intelligence engine. We're excited to help you navigate your professional journey with precision and intelligence.</p>
          <p><b>Your Profile Characteristics:</b></p>
          <ul>
            <li><b>Account Type:</b> Google Authenticated</li>
            <li><b>Role:</b> Career Explorer</li>
            <li><b>Focus:</b> 100% Technical Career Development</li>
            <li><b>Status:</b> Active</li>
          </ul>
          <p>Get started by exploring careers and generating your first personalized 10-year roadmap.</p>
          <a href="${dashboardUrl}" style="color: white;" class="btn">Go to Dashboard</a>
        </div>
        <div class="footer">
          © 2026 Nexora. Designed for the ambitious.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Nexora AI" <${process.env.SMTP_USER}>`,
      to,
      subject: "Welcome to Nexora - Your Tech Assistant",
      html,
    });
    console.log(`Welcome email sent to ${to}`);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}
