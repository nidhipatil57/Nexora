const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const achievements = [
    {
      title: "Welcome Aboard",
      description: "Successfully created your account and joined Nexora",
      icon: "Award",
      xpReward: 100,
      category: "ONBOARDING",
      condition: JSON.stringify({ count: 1 })
    },
    {
      title: "First Step",
      description: "Complete your first assessment",
      icon: "Award",
      xpReward: 100,
      category: "ASSESSMENT",
      condition: JSON.stringify({ count: 1 })
    },
    {
      title: "Thinker",
      description: "Complete 5 assessments",
      icon: "Brain",
      xpReward: 500,
      category: "ASSESSMENT",
      condition: JSON.stringify({ count: 5 })
    },
    {
      title: "Visionary",
      description: "Generate your first career pathway",
      icon: "Map",
      xpReward: 150,
      category: "PATHWAY",
      condition: JSON.stringify({ count: 1 })
    },
    {
      title: "Architect",
      description: "Generate 3 different career pathways",
      icon: "Layers",
      xpReward: 400,
      category: "PATHWAY",
      condition: JSON.stringify({ count: 3 })
    },
    {
      title: "Professional",
      description: "Build your first AI-optimized resume",
      icon: "FileText",
      xpReward: 200,
      category: "RESUME",
      condition: JSON.stringify({ count: 1 })
    },
    {
      title: "Rising Star",
      description: "Reach 500 XP points",
      icon: "Sparkles",
      xpReward: 300,
      category: "XP",
      condition: JSON.stringify({ xp: 500 })
    },
    {
      title: "Elite Member",
      description: "Reach Level 5",
      icon: "Trophy",
      xpReward: 1000,
      category: "LEVEL",
      condition: JSON.stringify({ level: 5 })
    }
  ];

  console.log("Seeding achievements...");
  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { title: ach.title },
      update: ach,
      create: ach
    });
  }
  console.log("Achievements seeded.");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
