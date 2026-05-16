import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import prisma from "@/lib/db";
import { generateAIResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const auth = getUserFromRequest(req);
    if (!auth) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { careerId, careerTitle } = await req.json();

    const profile = await prisma.profile.findUnique({ where: { userId: auth.userId } });

    // Parse all profile data for context
    const safeJsonParse = (val: string | null | undefined, fallback: any = null) => {
      if (!val) return fallback;
      try { return JSON.parse(val); } catch { return fallback; }
    };

    const experience = safeJsonParse(profile?.education, {});
    const userTools = safeJsonParse(profile?.skills, []);
    const userDomains = safeJsonParse(profile?.interests, []);
    const projectTypes = safeJsonParse(profile?.strengths, []);
    const careerGoals = safeJsonParse(profile?.values, []);
    const workStyle = safeJsonParse(profile?.personalityType, {});

    const prompt = `You are an elite career strategist and educational architect. Create an EXTREMELY DETAILED, comprehensive 5-year career roadmap for someone who wants to become a "${careerTitle}".

FULL USER CONTEXT:
- Experience Level: ${experience.level || "not specified"}
- Field of Study: ${experience.fieldOfStudy || "not specified"}
- Years of Coding: ${experience.yearsOfExp || "not specified"}
- Current Tools/Languages: ${userTools.join(", ") || "not specified"}
- Interested Domains: ${userDomains.join(", ") || "not specified"}
- Project Interests: ${projectTypes.join(", ") || "not specified"}
- Career Goals: ${careerGoals.join(", ") || "not specified"}
- Work Preferences: Team=${workStyle.teamPref || "any"}, Env=${workStyle.environment || "any"}, Org=${workStyle.orgType || "any"}

For EACH of the 5 years, provide:

1. "year": The year number (1-5)
2. "title": A professional, inspiring phase name (e.g., "Foundation & Core Mastery", "Specialization Sprint", "Technical Leadership")
3. "desc": A MASSIVE, EXTREMELY DETAILED description (minimum 8-10 full sentences). Cover:
   - Exact technologies, frameworks, and tools to master this year
   - Industry concepts and domain knowledge to acquire
   - Soft skills to develop
   - How this year builds on the previous and prepares for the next
   - Specific types of projects to build
   - What makes this year a critical inflection point
4. "milestones": EXACTLY 6 very specific, actionable milestones (not vague like "learn backend" but specific like "Build and deploy a full microservices architecture using Node.js, Docker, and Kubernetes with CI/CD pipelines")
5. "skills": 6 specific technical or strategic skills to master this year
6. "resources": 3 recommended learning resources with name and type (e.g., {"name": "CS50 by Harvard", "type": "course"}, {"name": "Designing Data-Intensive Applications", "type": "book"})
7. "salary": Estimated salary range for this career stage (e.g., "$65,000 - $85,000")

The roadmap MUST be personalized based on the user's current skills and experience level. If they are a beginner, Year 1 should start from fundamentals. If experienced, Year 1 should start from intermediate/advanced topics.

The tone should be that of an elite mentor. Provide specific, company-ready, expert-level guidance. Do NOT provide generic advice.

Respond ONLY with a valid JSON array of 5 objects. No markdown, no explanation, just the JSON array.`;

    const aiResponse = await generateAIResponse(prompt, `You are an elite Educational Architect. 
CRITICAL REQUIREMENT: Your response MUST be extremely verbose and detailed. 
Each "desc" field MUST be a minimum of 8-10 long, insightful sentences. 
Each phase must have exactly 6 milestones, 6 skills, 3 resources, and a salary range.
If you provide short descriptions, you have FAILED.
Output must be a valid JSON array ONLY. No markdown fences, no explanations.`);

    let milestones;
    try {
      let cleaned = aiResponse.trim();
      // Strip any non-JSON wrapping
      const jsonStart = cleaned.indexOf("[");
      const jsonEnd = cleaned.lastIndexOf("]");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
      }
      milestones = JSON.parse(cleaned);
      if (!Array.isArray(milestones)) throw new Error("Not an array");
      // Validate structure
      milestones = milestones.map((phase: any, i: number) => ({
        year: phase.year || i + 1,
        title: phase.title || `Year ${i + 1}`,
        desc: phase.desc || phase.description || "Detailed career development phase.",
        milestones: Array.isArray(phase.milestones) ? phase.milestones.slice(0, 6) : ["Complete core training"],
        skills: Array.isArray(phase.skills) ? phase.skills.slice(0, 6) : ["Core Technical Skills"],
        resources: Array.isArray(phase.resources) ? phase.resources.slice(0, 3) : [],
        salary: phase.salary || phase.salaryRange || "",
      }));
    } catch {
      // Robust fallback with detailed content
      milestones = [
        { year: 1, title: "Foundation & Core Mastery", desc: `Begin your journey toward becoming a ${careerTitle} by building a rock-solid foundation. This year focuses on mastering the fundamental technologies, concepts, and workflows that every ${careerTitle} needs. You will build multiple projects from scratch, contribute to open source, and establish your professional presence. Focus on understanding not just the "how" but the "why" behind each technology you learn. Build a portfolio of at least 3 substantial projects that demonstrate your growing expertise. Network with professionals in the field through meetups, conferences, and online communities. This is the year where consistent daily practice separates future experts from hobbyists.`, milestones: ["Complete a comprehensive online course or bootcamp in your core technology stack", "Build and deploy 3 portfolio projects showcasing different aspects of the role", "Contribute to at least 2 open-source projects in your domain", "Earn a foundational certification relevant to the role", "Create a professional blog or portfolio website documenting your learning journey", "Complete 50+ coding challenges on platforms like LeetCode or HackerRank"], skills: ["Core Programming", "Version Control (Git)", "Problem Solving", "Technical Writing", "Basic System Design", "Debugging"], resources: [{ name: "FreeCodeCamp", type: "platform" }, { name: "The Pragmatic Programmer", type: "book" }, { name: "CS50 by Harvard", type: "course" }], salary: "$55,000 - $75,000" },
        { year: 2, title: "Professional Growth & Specialization", desc: `Year two is about going deep. Having built your foundation, you now specialize in the specific technologies and methodologies that define a professional ${careerTitle}. This year you should be working in a professional team environment, learning enterprise patterns, and building production-grade systems. Focus on understanding architectural decisions, code review practices, and agile methodologies. You will encounter real-world challenges like scaling, security, and performance optimization for the first time. Start mentoring junior developers and contributing to technical discussions. Your goal is to become a reliable, independent contributor who can own features end-to-end.`, milestones: ["Lead a feature development cycle from design to deployment", "Get a professional-level certification in your specialization", "Present a technical talk at a meetup or internal team session", "Build a production-grade project that handles real users", "Set up comprehensive CI/CD pipelines for your projects", "Complete a deep-dive course in system design or architecture"], skills: ["Advanced System Design", "Cloud Architecture", "Performance Optimization", "Code Review", "Agile/Scrum", "Testing Strategies"], resources: [{ name: "System Design Interview by Alex Xu", type: "book" }, { name: "Udemy Pro courses", type: "platform" }, { name: "Tech conferences (virtual)", type: "event" }], salary: "$75,000 - $110,000" },
        { year: 3, title: "Technical Expertise & Impact", desc: `This is the year you transition from a solid professional to a recognized technical expert. You should be making architectural decisions, driving technical initiatives, and having measurable impact on business outcomes. Deep-dive into advanced topics specific to ${careerTitle} - distributed systems, machine learning pipelines, security frameworks, or whatever your specialization demands. Start writing technical articles, speaking at conferences, and building your reputation in the community. Take ownership of complex cross-team projects and learn to communicate technical concepts to non-technical stakeholders. This year marks the inflection point where you become the go-to person for your area of expertise.`, milestones: ["Architect and lead a major cross-team technical initiative", "Publish 3+ technical articles or blog posts that gain industry attention", "Mentor 2-3 junior engineers through their growth", "Speak at a tech conference or major meetup", "Design and implement a system handling significant scale or complexity", "Earn an advanced certification in your specialization"], skills: ["Technical Leadership", "Architecture Design", "Mentoring", "Strategic Thinking", "Cross-functional Collaboration", "Advanced Domain Expertise"], resources: [{ name: "Designing Data-Intensive Applications", type: "book" }, { name: "O'Reilly Learning Platform", type: "platform" }, { name: "Industry conferences", type: "event" }], salary: "$110,000 - $150,000" },
        { year: 4, title: "Leadership & Strategic Influence", desc: `Year four is about multiplying your impact through leadership. Whether you choose the individual contributor or management track, this year is about strategic influence. You are now setting technical direction for your team or organization, evaluating emerging technologies, and making decisions that affect the company's technical trajectory. Build expertise in areas like technical strategy, team scaling, and product thinking. Lead hiring efforts, define engineering standards, and drive cultural improvements. Your technical decisions now have significant business impact, and you need to balance innovation with pragmatism. This is where you develop the executive presence and strategic mindset that defines senior leaders in tech.`, milestones: ["Lead a team of 5+ engineers on a high-impact project", "Define and implement engineering standards adopted across the organization", "Drive a major technical decision that significantly impacts business metrics", "Build and present a technical roadmap to executive leadership", "Conduct technical interviews and help grow the engineering team", "Pioneer adoption of a new technology or methodology in your organization"], skills: ["Engineering Management", "Technical Strategy", "Executive Communication", "Hiring & Team Building", "Product Thinking", "Business Acumen"], resources: [{ name: "An Elegant Puzzle by Will Larson", type: "book" }, { name: "Staff Engineer by Will Larson", type: "book" }, { name: "Leadership coaching", type: "mentorship" }], salary: "$150,000 - $200,000" },
        { year: 5, title: "Industry Mastery & Thought Leadership", desc: `Year five represents mastery. You are now a recognized authority in your field with the ability to shape industry direction. Your influence extends beyond your organization through thought leadership, open-source contributions, and community engagement. At this stage, you are either a principal/staff engineer making company-wide technical decisions or a director/VP leading large engineering organizations. You evaluate new paradigms, predict technology trends, and position your organization for future success. Your network includes industry leaders and your opinion carries weight in technical communities. This year is about cementing your legacy and creating lasting impact.`, milestones: ["Deliver a keynote or major talk at a premier industry conference", "Launch an open-source project or framework used by other organizations", "Achieve a principal/staff-level or director-level position", "Publish a comprehensive technical guide or contribute to an industry standard", "Build a professional network of 500+ industry connections", "Mentor the next generation of technical leaders"], skills: ["Thought Leadership", "Innovation Strategy", "Industry Influence", "Organizational Design", "Technical Vision", "Executive Leadership"], resources: [{ name: "The Manager's Path by Camille Fournier", type: "book" }, { name: "Executive coaching programs", type: "mentorship" }, { name: "Board advisory roles", type: "experience" }], salary: "$200,000 - $350,000+" },
      ];
    }

    const pathway = await prisma.careerPathway.create({
      data: {
        userId: auth.userId,
        careerId: careerId || null,
        title: `${careerTitle} Career Pathway`,
        milestones: JSON.stringify(milestones),
        timeframe: "5y",
      }
    });

    return NextResponse.json({ 
      success: true, 
      pathway: { id: pathway.id, title: pathway.title, milestones },
    });
  } catch (error) {
    console.error("Pathway generation error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate pathway" }, { status: 500 });
  }
}
