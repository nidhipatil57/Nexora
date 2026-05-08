import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const techRoles = [
    {
      title: "Cloud Architect",
      description: "Design and implement scalable, secure cloud infrastructure strategies for global enterprises.",
      category: "Technology",
      industry: "Cloud Computing",
      salaryMin: 120000,
      salaryMax: 220000,
      growthRate: 18,
      demandLevel: "Extreme",
      automationRisk: 0.1,
      requiredSkills: JSON.stringify(["AWS/Azure/GCP", "Terraform", "Cloud Security", "System Architecture"]),
      education: "Bachelor's in Computer Science",
      experienceLevel: "Senior",
      workStyle: "Remote/Hybrid",
      futureOutlook: "Essential for digital transformation."
    },
    {
      title: "DevOps Engineer",
      description: "Bridge the gap between development and operations through automation and robust CI/CD pipelines.",
      category: "Technology",
      industry: "Software Engineering",
      salaryMin: 95000,
      salaryMax: 185000,
      growthRate: 21,
      demandLevel: "Very High",
      automationRisk: 0.15,
      requiredSkills: JSON.stringify(["Docker", "Kubernetes", "CI/CD", "Python", "Linux"]),
      education: "Bachelor's Degree",
      experienceLevel: "Mid-Senior",
      workStyle: "Hybrid",
      futureOutlook: "Critical for rapid software delivery."
    },
    {
      title: "Full Stack Developer",
      description: "Master of both worlds, building comprehensive web applications from database schemas to polished user interfaces.",
      category: "Technology",
      industry: "Web Development",
      salaryMin: 85000,
      salaryMax: 170000,
      growthRate: 16,
      demandLevel: "High",
      automationRisk: 0.2,
      requiredSkills: JSON.stringify(["React/Next.js", "Node.js", "TypeScript", "PostgreSQL", "Tailwind"]),
      education: "Bachelor's or Bootcamp",
      experienceLevel: "All Levels",
      workStyle: "Any",
      futureOutlook: "Universal demand for product builders."
    },
    {
      title: "Blockchain Developer",
      description: "Engineer the future of decentralized finance and trustless systems using smart contracts and ledger technology.",
      category: "Technology",
      industry: "FinTech",
      salaryMin: 110000,
      salaryMax: 240000,
      growthRate: 25,
      demandLevel: "Extreme",
      automationRisk: 0.05,
      requiredSkills: JSON.stringify(["Solidity", "Rust", "Smart Contracts", "Cryptography", "Web3.js"]),
      education: "Technical Degree",
      experienceLevel: "Mid-Senior",
      workStyle: "Remote Preferred",
      futureOutlook: "High growth in decentralized infrastructure."
    },
    {
      title: "UI/UX Engineer",
      description: "Crafting beautiful, accessible, and intuitive digital experiences that delight users and drive engagement.",
      category: "Technology",
      industry: "Design & Technology",
      salaryMin: 75000,
      salaryMax: 160000,
      growthRate: 12,
      demandLevel: "High",
      automationRisk: 0.15,
      requiredSkills: JSON.stringify(["React", "Figma", "Interaction Design", "CSS Animation", "Accessibility"]),
      education: "Design or CS Degree",
      experienceLevel: "All Levels",
      workStyle: "Hybrid",
      futureOutlook: "Increasing focus on user-centric design."
    },
    {
      title: "Technical Product Manager",
      description: "Lead the product vision by aligning technical capabilities with business goals and user needs.",
      category: "Technology",
      industry: "Product Management",
      salaryMin: 105000,
      salaryMax: 195000,
      growthRate: 14,
      demandLevel: "Very High",
      automationRisk: 0.1,
      requiredSkills: JSON.stringify(["Agile", "Strategy", "Data Analysis", "API Design", "Stakeholder Mgmt"]),
      education: "CS + Business Background",
      experienceLevel: "Mid-Senior",
      workStyle: "Hybrid",
      futureOutlook: "Critical role for AI productization."
    },
    {
      title: "Mobile App Developer",
      description: "Build the next generation of mobile applications that live in the pockets of millions.",
      category: "Technology",
      industry: "Mobile Tech",
      salaryMin: 90000,
      salaryMax: 180000,
      growthRate: 15,
      demandLevel: "High",
      automationRisk: 0.18,
      requiredSkills: JSON.stringify(["Swift", "Kotlin", "React Native", "Mobile UI", "API Integration"]),
      education: "Bachelor's Degree",
      experienceLevel: "All Levels",
      workStyle: "Any",
      futureOutlook: "Mobile-first world keeps demand high."
    },
    {
      title: "QA Automation Engineer",
      description: "Ensure the highest standards of software quality through sophisticated automated testing frameworks.",
      category: "Technology",
      industry: "Software Quality",
      salaryMin: 80000,
      salaryMax: 155000,
      growthRate: 10,
      demandLevel: "High",
      automationRisk: 0.3,
      requiredSkills: JSON.stringify(["Playwright/Cypress", "JavaScript", "CI/CD Integration", "Test Planning"]),
      education: "Bachelor's Degree",
      experienceLevel: "All Levels",
      workStyle: "Any",
      futureOutlook: "Automation is replacing manual QA."
    }
  ];

  console.log("Seeding tech roles...");

  for (const role of techRoles) {
    const slug = role.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.career.upsert({
      where: { slug },
      update: role,
      create: { ...role, slug }
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
