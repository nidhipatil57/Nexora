import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const careers = await prisma.career.findMany({
      orderBy: { growthRate: "desc" }
    });

    const priorityOrder = [
      "AI Engineer",
      "Software Engineer",
      "Full Stack Developer",
      "Machine Learning Engineer",
      "Data Scientist",
      "Cloud Architect",
      "UX Designer",
      "Cybersecurity Analyst",
      "Data Architect",
      "Mobile App Developer",
      "Data Engineer",
      "DevOps Engineer",
      "Blockchain Developer",
      "Product Manager"
    ];

    // Map existing names and remove duplicates
    const seenTitles = new Set();
    const mappedCareers = careers.map(c => {
      let title = c.title;
      if (title === "MLOps Engineer") title = "Machine Learning Engineer";
      if (title === "UI/UX Engineer") title = "UX Designer";
      if (title === "Technical Product Manager") title = "Product Manager";
      return { ...c, title };
    }).filter(c => {
      if (seenTitles.has(c.title)) return false;
      seenTitles.add(c.title);
      return true;
    });

    // Sort by priorityOrder then by growthRate
    const sorted = [...mappedCareers].sort((a, b) => {
      const indexA = priorityOrder.indexOf(a.title);
      const indexB = priorityOrder.indexOf(b.title);

      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      return (b.growthRate || 0) - (a.growthRate || 0);
    });

    return NextResponse.json({ success: true, careers: sorted });
  } catch (error: any) {
    console.error("Fetch careers error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to fetch careers" 
    }, { status: 500 });
  }
}
