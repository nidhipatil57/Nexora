import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔴 WIPING ALL USER DATA FROM DATABASE...\n");

  // Delete in dependency order (children first)
  const tables = [
    { name: "AssessmentAnswer", fn: () => prisma.assessmentAnswer.deleteMany() },
    { name: "AssessmentQuestion", fn: () => prisma.assessmentQuestion.deleteMany() },
    { name: "Assessment", fn: () => prisma.assessment.deleteMany() },
    { name: "ChatMessage", fn: () => prisma.chatMessage.deleteMany() },
    { name: "ChatSession", fn: () => prisma.chatSession.deleteMany() },
    { name: "CareerRecommendation", fn: () => prisma.careerRecommendation.deleteMany() },
    { name: "CareerPathway", fn: () => prisma.careerPathway.deleteMany() },
    { name: "UserAchievement", fn: () => prisma.userAchievement.deleteMany() },
    { name: "UserSkill", fn: () => prisma.userSkill.deleteMany() },
    { name: "SkillGap", fn: () => prisma.skillGap.deleteMany() },
    { name: "LearningPlan", fn: () => prisma.learningPlan.deleteMany() },
    { name: "Resume", fn: () => prisma.resume.deleteMany() },
    { name: "Notification", fn: () => prisma.notification.deleteMany() },
    { name: "Profile", fn: () => prisma.profile.deleteMany() },
    { name: "User", fn: () => prisma.user.deleteMany() },
  ];

  for (const table of tables) {
    const result = await table.fn();
    console.log(`  ✅ ${table.name}: deleted ${result.count} records`);
  }

  console.log("\n🟢 ALL USER DATA HAS BEEN WIPED SUCCESSFULLY.");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
