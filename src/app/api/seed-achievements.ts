import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const achievements = [
    { title: "First Steps", description: "Complete your AI career profile", icon: "Star", xpReward: 100, category: "onboarding", condition: "{}" },
    { title: "Curious Mind", description: "Explore 10 different career paths", icon: "Target", xpReward: 150, category: "career", condition: "{}" },
    { title: "Knowledge Seeker", description: "Complete your first assessment", icon: "Brain", xpReward: 200, category: "assessment", condition: "{}" },
    { title: "Pathfinder", description: "Generate a 10-year career pathway", icon: "Route", xpReward: 250, category: "career", condition: "{}" },
    { title: "Skill Master", description: "Complete a full learning roadmap", icon: "Zap", xpReward: 300, category: "learning", condition: "{}" },
    { title: "Resume Ready", description: "Generate your first AI resume", icon: "FileText", xpReward: 150, category: "career", condition: "{}" },
    { title: "Consistent Learner", description: "Maintain a 7-day login streak", icon: "Flame", xpReward: 500, category: "streak", condition: "{}" },
    { title: "Top of the Class", description: "Score 90% or higher on an assessment", icon: "Trophy", xpReward: 400, category: "assessment", condition: "{}" },
  ];

  console.log("Seeding achievements...");
  
  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { id: ach.title }, // This is a hack for upsert since title isn't unique in schema, but we'll use findFirst/create instead or just use create if empty
      update: {},
      create: {
        title: ach.title,
        description: ach.description,
        icon: ach.icon,
        xpReward: ach.xpReward,
        category: ach.category,
        condition: ach.condition
      }
    }).catch(async (e) => {
        // Fallback for unique constraint issue if id is not title
        const existing = await prisma.achievement.findFirst({ where: { title: ach.title } });
        if (!existing) {
            await prisma.achievement.create({ data: ach });
        }
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
