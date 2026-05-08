const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const careers = [
  {
    title: "Software Engineer",
    slug: "software-engineer",
    description: "Develops, tests, and maintains software applications across various platforms. Focuses on writing clean, efficient code and collaborating with cross-functional teams.",
    category: "Technology",
    industry: "Information Technology",
    salaryMin: 80000,
    salaryMax: 180000,
    growthRate: 22,
    demandLevel: "High",
    automationRisk: 0.1,
    requiredSkills: JSON.stringify(["JavaScript", "TypeScript", "React", "Node.js", "System Design"]),
    education: "Bachelor's in Computer Science",
    experienceLevel: "Junior to Senior",
    workStyle: "Remote/Hybrid",
    futureOutlook: "Excellent growth as digital transformation continues to accelerate."
  },
  {
    title: "Data Scientist",
    slug: "data-scientist",
    description: "Analyzes complex data sets to help organizations make informed decisions. Uses machine learning, statistics, and programming to extract insights.",
    category: "Data",
    industry: "Tech/Finance",
    salaryMin: 95000,
    salaryMax: 195000,
    growthRate: 35,
    demandLevel: "Extreme",
    automationRisk: 0.05,
    requiredSkills: JSON.stringify(["Python", "SQL", "Machine Learning", "Statistics", "Pandas"]),
    education: "Master's or PhD in STEM",
    experienceLevel: "Mid to Senior",
    workStyle: "Hybrid",
    futureOutlook: "Predictive analytics and AI are becoming core to every business."
  },
  {
    title: "UX Designer",
    slug: "ux-designer",
    description: "Focuses on the interaction between users and products. Designs intuitive interfaces and conducts research to improve user satisfaction.",
    category: "Design",
    industry: "Design/Creative",
    salaryMin: 70000,
    salaryMax: 155000,
    growthRate: 15,
    demandLevel: "High",
    automationRisk: 0.15,
    requiredSkills: JSON.stringify(["Figma", "User Research", "Prototyping", "Visual Design", "Accessibility"]),
    education: "Bachelor's in Design or Psychology",
    experienceLevel: "Entry to Senior",
    workStyle: "Remote/Hybrid",
    futureOutlook: "As digital products multiply, the need for intuitive design grows."
  },
  {
    title: "Cybersecurity Analyst",
    slug: "cybersecurity-analyst",
    description: "Protects an organization's computer networks and systems. Plans and carries out security measures to prevent data breaches.",
    category: "Security",
    industry: "IT/Government",
    salaryMin: 85000,
    salaryMax: 170000,
    growthRate: 33,
    demandLevel: "High",
    automationRisk: 0.08,
    requiredSkills: JSON.stringify(["Network Security", "Threat Detection", "SIEM", "Python", "Cloud Security"]),
    education: "Bachelor's in Cybersecurity/IT",
    experienceLevel: "Junior to Senior",
    workStyle: "On-site/Hybrid",
    futureOutlook: "Security is the #1 priority for modern enterprises."
  },
  {
    title: "AI Engineer",
    slug: "ai-engineer",
    description: "Specializes in developing intelligent systems and algorithms. Implements neural networks and works on natural language processing.",
    category: "Technology",
    industry: "Tech/AI",
    salaryMin: 120000,
    salaryMax: 250000,
    growthRate: 40,
    demandLevel: "Extreme",
    automationRisk: 0.02,
    requiredSkills: JSON.stringify(["PyTorch", "TensorFlow", "Deep Learning", "NLP", "C++"]),
    education: "Master's or PhD in CS/AI",
    experienceLevel: "Mid to Senior",
    workStyle: "Hybrid",
    futureOutlook: "Generative AI is transforming every industry simultaneously."
  },
  {
    title: "Product Manager",
    slug: "product-manager",
    description: "Leads the strategy and roadmap for a product. Bridges the gap between business, design, and engineering teams.",
    category: "Management",
    industry: "Business/Tech",
    salaryMin: 90000,
    salaryMax: 200000,
    growthRate: 10,
    demandLevel: "Medium",
    automationRisk: 0.2,
    requiredSkills: JSON.stringify(["Product Strategy", "Market Analysis", "Agile", "Stakeholder Management"]),
    education: "Bachelor's/MBA",
    experienceLevel: "Mid to Senior",
    workStyle: "Hybrid",
    futureOutlook: "Strategic product leadership remains a core human-centric role."
  }
];

async function main() {
  console.log('Seeding careers...');
  for (const career of careers) {
    await prisma.career.upsert({
      where: { slug: career.slug },
      update: career,
      create: career,
    });
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
