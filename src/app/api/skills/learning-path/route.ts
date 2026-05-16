import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { generateAIResponse } from "@/lib/ai";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { skillGaps } = await req.json();

    // Fetch user profile for personalization context
    const profile = await prisma.profile.findUnique({ where: { userId: auth.userId } });
    const safeJsonParse = (val: string | null | undefined, fallback: any = null) => {
      if (!val) return fallback;
      try { return JSON.parse(val); } catch { return fallback; }
    };

    const userTools = safeJsonParse(profile?.skills, []);
    const userDomains = safeJsonParse(profile?.interests, []);
    const experience = safeJsonParse(profile?.education, {});
    const dreamRoles = safeJsonParse(profile?.dreamCareers, []);

    // Build a detailed, multi-gap learning plan
    const gapDescriptions = skillGaps.map((g: any) =>
      `"${g.name}" (current: ${g.currentLevel}/100, required: ${g.requiredLevel}/100, priority: ${g.priority}, category: ${g.category})`
    ).join("\n  - ");

    const prompt = `You are an elite learning architect specializing in tech career development. Create an EXTREMELY DETAILED, week-by-week learning plan that addresses ALL of the following skill gaps simultaneously:

SKILL GAPS TO ADDRESS:
  - ${gapDescriptions}

USER CONTEXT:
- Experience Level: ${experience.level || "not specified"}
- Field of Study: ${experience.fieldOfStudy || "not specified"}
- Current Tools/Languages: ${userTools.join(", ") || "not specified"}
- Interested Domains: ${userDomains.join(", ") || "not specified"}
- Dream Roles: ${dreamRoles.join(", ") || "not specified"}

Create a structured plan with 6 phases (covering approximately 12-16 weeks total). For EACH phase:

1. "week": The week range (e.g., "Week 1-2")
2. "title": An inspiring phase name that captures what the learner will achieve
3. "concepts": Array of 5-6 specific concepts/topics to learn (not vague — be specific like "Binary Search Trees and their time complexity analysis" instead of "Data Structures")
4. "resources": Array of 3-4 resources, each with:
   - "name": Specific course/book/channel name (use REAL resources like "freeCodeCamp", "Traversy Media", "CS50", "The Odin Project", "LeetCode", specific YouTube channels, specific Udemy/Coursera courses)
   - "type": "video" | "course" | "article" | "practice" | "book" | "project"
   - "url": Real URL or descriptive link
5. "hoursEstimate": Total hours needed for this phase (be realistic — 15-25 hours per phase)
6. "goal": A specific, measurable goal for the end of this phase (e.g., "Be able to solve medium-difficulty dynamic programming problems in under 30 minutes")
7. "skillsFocus": Array of which skill gaps this phase primarily addresses (from the gaps listed above)
8. "projects": Array of 1-2 hands-on projects to build during this phase, each described in one sentence

The plan should:
- Start from the user's current level and progressively build up
- Interleave the different skill gaps so the learner doesn't get bored
- Include practical projects that combine multiple skills
- Be specific about tools, frameworks, and technologies to use
- Include both theoretical learning and hands-on practice

Respond ONLY with valid JSON:
{
  "totalWeeks": number,
  "hoursPerWeek": number,
  "overview": "A 2-3 sentence summary of what this learning plan will achieve",
  "phases": [array of phase objects as described above]
}`;

    const aiResponse = await generateAIResponse(prompt, `You are an expert learning path designer for tech professionals. 
CRITICAL: Your response MUST be extremely detailed. Each phase must have 5-6 concepts, 3-4 real resources with URLs, 1-2 project ideas, and a specific measurable goal.
Output ONLY valid JSON. No markdown fences, no explanations.`);

    let learningPath;
    try {
      let cleaned = aiResponse.trim();
      // Find JSON boundaries
      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
      }
      learningPath = JSON.parse(cleaned);
      // Validate and sanitize
      if (!learningPath.phases || !Array.isArray(learningPath.phases)) throw new Error("Invalid structure");
      learningPath.phases = learningPath.phases.map((p: any, i: number) => ({
        week: p.week || `Week ${i * 2 + 1}-${i * 2 + 2}`,
        title: p.title || `Phase ${i + 1}`,
        concepts: Array.isArray(p.concepts) ? p.concepts : ["Core concepts"],
        resources: Array.isArray(p.resources) ? p.resources.map((r: any) => ({
          name: typeof r === "string" ? r : r?.name || "Resource",
          type: typeof r === "string" ? "resource" : r?.type || "resource",
          url: typeof r === "string" ? "" : r?.url || "",
        })) : [{ name: "freeCodeCamp", type: "course", url: "https://freecodecamp.org" }],
        hoursEstimate: p.hoursEstimate || 20,
        goal: p.goal || "Complete this phase",
        skillsFocus: Array.isArray(p.skillsFocus) ? p.skillsFocus : [],
        projects: Array.isArray(p.projects) ? p.projects : [],
      }));
    } catch {
      // Detailed fallback
      const gapNames = skillGaps.map((g: any) => g.name);
      learningPath = {
        totalWeeks: 14,
        hoursPerWeek: 10,
        overview: `A comprehensive 14-week plan to bridge your skill gaps in ${gapNames.join(", ")}. This plan combines theory, practice, and real-world projects to get you from your current level to professional competency.`,
        phases: [
          { week: "Week 1-2", title: "Foundation Assessment & Core Basics", concepts: ["Identify knowledge baseline", "Core terminology and concepts", "Industry best practices overview", "Tool setup and environment configuration", "Basic exercises and drills"], resources: [{ name: "freeCodeCamp", type: "course", url: "https://freecodecamp.org" }, { name: "The Odin Project", type: "course", url: "https://theodinproject.com" }, { name: "YouTube - Traversy Media", type: "video", url: "https://youtube.com/@TraversyMedia" }], hoursEstimate: 20, goal: "Understand core fundamentals and set up your learning environment", skillsFocus: gapNames, projects: ["Build a personal study tracker app to monitor your progress"] },
          { week: "Week 3-4", title: "Intermediate Concepts & Applied Learning", concepts: ["Intermediate patterns and techniques", "Problem-solving frameworks", "Code review best practices", "Applied exercises with increasing difficulty", "Debugging and troubleshooting strategies"], resources: [{ name: "LeetCode", type: "practice", url: "https://leetcode.com" }, { name: "Coursera - Specialization courses", type: "course", url: "https://coursera.org" }, { name: "MDN Web Docs", type: "article", url: "https://developer.mozilla.org" }], hoursEstimate: 22, goal: "Solve intermediate-level problems independently", skillsFocus: gapNames, projects: ["Complete a medium-complexity project that uses concepts from this phase"] },
          { week: "Week 5-7", title: "Deep Dive & Specialization", concepts: ["Advanced algorithms and data structures", "Architecture patterns", "Performance optimization techniques", "Security considerations", "Testing strategies"], resources: [{ name: "Educative.io", type: "course", url: "https://educative.io" }, { name: "YouTube - Fireship", type: "video", url: "https://youtube.com/@Fireship" }, { name: "GeeksforGeeks", type: "article", url: "https://geeksforgeeks.org" }], hoursEstimate: 30, goal: "Handle complex scenarios and edge cases confidently", skillsFocus: gapNames, projects: ["Build a production-grade mini-project showcasing advanced concepts", "Contribute to an open-source project"] },
          { week: "Week 8-9", title: "Cross-Skill Integration", concepts: ["Combining multiple skill areas", "Real-world workflow simulation", "Collaborative coding practices", "Code architecture decisions", "Documentation and communication"], resources: [{ name: "GitHub - Open Source projects", type: "practice", url: "https://github.com/explore" }, { name: "Tech blogs (Dev.to, Medium)", type: "article", url: "https://dev.to" }, { name: "System Design Primer", type: "article", url: "https://github.com/donnemartin/system-design-primer" }], hoursEstimate: 20, goal: "Apply all skills together in a cohesive project", skillsFocus: gapNames, projects: ["Build an end-to-end project that integrates all skill gap areas"] },
          { week: "Week 10-12", title: "Project-Based Mastery", concepts: ["Full project lifecycle management", "Deployment and CI/CD", "User testing and feedback", "Portfolio-ready documentation", "Interview preparation for target skills"], resources: [{ name: "Vercel/Netlify Docs", type: "article", url: "https://vercel.com/docs" }, { name: "YouTube - TechLead", type: "video", url: "https://youtube.com/@TechLead" }, { name: "Pramp (mock interviews)", type: "practice", url: "https://pramp.com" }], hoursEstimate: 30, goal: "Complete a portfolio-worthy project demonstrating mastery", skillsFocus: gapNames, projects: ["Build and deploy a complete, polished application to your portfolio"] },
          { week: "Week 13-14", title: "Assessment & Certification", concepts: ["Self-assessment and gap review", "Certification preparation", "Interview skills for target roles", "Professional networking strategies", "Continuous learning plan"], resources: [{ name: "HackerRank Certification", type: "practice", url: "https://hackerrank.com" }, { name: "LinkedIn Learning", type: "course", url: "https://linkedin.com/learning" }, { name: "Cracking the Coding Interview", type: "book", url: "https://amazon.com" }], hoursEstimate: 18, goal: "Pass a skill certification and be interview-ready", skillsFocus: gapNames, projects: ["Create a 'lessons learned' blog post documenting your growth journey"] },
        ]
      };
    }

    return NextResponse.json({ success: true, learningPath });
  } catch (error) {
    console.error("Learning path error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate learning path" }, { status: 500 });
  }
}
