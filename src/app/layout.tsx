import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexora — Your Future, Intelligently Designed",
  description: "AI-powered career guidance platform that analyzes your aptitude, personality, and aspirations to deliver personalized career recommendations, roadmaps, and mentorship.",
  keywords: "AI career guidance, career recommendations, skill gap analysis, career roadmap, AI mentor",
};

import ThemeProvider from "@/components/ThemeProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
