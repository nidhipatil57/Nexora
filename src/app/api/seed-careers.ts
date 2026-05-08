import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const careers = [
    {
      title: "Software Engineer",
      slug: "software-engineer",
      description: "Design, develop, and maintain software systems and applications.",
      category: "Technology",
      industry: "Software",
      salaryMin: 80000,
      salaryMax: 160000,
      growthRate: 22.0,
      demandLevel: "High",
      automationRisk: 0.1,
      requiredSkills: JSON.stringify(["Problem Solving", "Programming", "System Design", "Testing"]),
      education: "Bachelor's in Computer Science",
      experienceLevel: "Entry to Senior",
      workStyle: "Remote/Hybrid",
      futureOutlook: "Excellent due to digitalization.",
      icon: "Code",
      color: "blue"
    },
    {
      title: "Data Scientist",
      slug: "data-scientist",
      description: "Extract insights from complex datasets to drive business decisions.",
      category: "Data Science",
      industry: "Tech/Finance",
      salaryMin: 95000,
      salaryMax: 175000,
      growthRate: 36.0,
      demandLevel: "Very High",
      automationRisk: 0.15,
      requiredSkills: JSON.stringify(["Python", "Statistics", "Machine Learning", "Data Visualization"]),
      education: "Master's or PhD",
      experienceLevel: "Mid to Senior",
      workStyle: "Hybrid",
      futureOutlook: "Growing rapidly with AI adoption.",
      icon: "Database",
      color: "purple"
    },
    {
      title: "UX/UI Designer",
      slug: "ux-ui-designer",
      description: "Create intuitive and visually appealing digital experiences.",
      category: "Design",
      industry: "Tech/Creative",
      salaryMin: 75000,
      salaryMax: 140000,
      growthRate: 16.0,
      demandLevel: "High",
      automationRisk: 0.2,
      requiredSkills: JSON.stringify(["User Research", "Prototyping", "Visual Design", "Figma"]),
      education: "Bachelor's or Bootcamp",
      experienceLevel: "All Levels",
      workStyle: "Remote",
      futureOutlook: "Steady demand for user-centric products.",
      icon: "Palette",
      color: "pink"
    },
    {
      title: "Product Manager",
      slug: "product-manager",
      description: "Lead the strategy, roadmap, and feature definition for a product.",
      category: "Business",
      industry: "Technology",
      salaryMin: 100000,
      salaryMax: 190000,
      growthRate: 14.0,
      demandLevel: "High",
      automationRisk: 0.05,
      requiredSkills: JSON.stringify(["Strategy", "Prioritization", "Communication", "Leadership"]),
      education: "Bachelor's in CS or Business",
      experienceLevel: "Mid to Senior",
      workStyle: "Hybrid/On-site",
      futureOutlook: "Critical role for product-led companies.",
      icon: "Briefcase",
      color: "indigo"
    }
  ];

  console.log("Seeding careers...");
  for (const c of careers) {
    await prisma.career.upsert({
      where: { slug: c.slug },
      update: c,
      create: c
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
