import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { generateAIResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { skillName, currentLevel, requiredLevel } = await req.json();

    const prompt = `Create a detailed learning roadmap for improving "${skillName}" from level ${currentLevel}/100 to ${requiredLevel}/100.

Include:
- Weekly schedule (how many hours per day/week)
- Phase breakdown (what to learn when)
- Specific concepts to cover
- Estimated time for each phase
- Free resources (YouTube channels, websites)

Respond ONLY with valid JSON:
{
  "totalWeeks": number,
  "hoursPerWeek": number,
  "phases": [
    {
      "week": "Week 1-2",
      "title": "Phase Title",
      "concepts": ["concept1", "concept2"],
      "resources": [{"name": "Resource Name", "type": "video/article/course", "url": "URL or description"}],
      "hoursEstimate": number,
      "goal": "What you'll achieve"
    }
  ]
}`;

    const aiResponse = await generateAIResponse(prompt, "You are an expert learning path designer. Respond ONLY with valid JSON. No markdown.");

    let learningPath;
    try {
      const cleaned = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      learningPath = JSON.parse(cleaned);
    } catch {
      learningPath = {
        totalWeeks: 12,
        hoursPerWeek: 10,
        phases: [
          { week: "Week 1-3", title: "Fundamentals", concepts: ["Core basics", "Key terminology", "Basic exercises"], resources: [{ name: "FreeCodeCamp", type: "course", url: "freecodecamp.org" }], hoursEstimate: 30, goal: "Understand the basics" },
          { week: "Week 4-6", title: "Intermediate", concepts: ["Applied concepts", "Projects", "Best practices"], resources: [{ name: "YouTube tutorials", type: "video", url: "youtube.com" }], hoursEstimate: 30, goal: "Build working projects" },
          { week: "Week 7-9", title: "Advanced", concepts: ["Complex patterns", "Optimization", "Architecture"], resources: [{ name: "Documentation", type: "article", url: "docs" }], hoursEstimate: 30, goal: "Master advanced topics" },
          { week: "Week 10-12", title: "Mastery", concepts: ["Real-world projects", "Contributing", "Teaching others"], resources: [{ name: "Open source", type: "course", url: "github.com" }], hoursEstimate: 30, goal: "Professional proficiency" },
        ]
      };
    }

    return NextResponse.json({ success: true, learningPath });
  } catch (error) {
    console.error("Learning path error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate learning path" }, { status: 500 });
  }
}
