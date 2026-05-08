import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const techRoles = [
    {
      title: "Site Reliability Engineer (SRE)",
      description: "Ensure massive-scale digital services are reliable, scalable, and efficient through engineering and automation.",
      category: "Technology",
      industry: "Operations",
      salaryMin: 110000,
      salaryMax: 210000,
      growthRate: 19,
      demandLevel: "Extreme",
      automationRisk: 0.1,
      requiredSkills: JSON.stringify(["Go/Python", "Distributed Systems", "Incident Response", "Kubernetes"]),
      education: "BS in Computer Science",
      experienceLevel: "Mid-Senior",
      workStyle: "Hybrid",
      futureOutlook: "Essential for cloud-native reliability."
    },
    {
      title: "MLOps Engineer",
      description: "Scale machine learning models to production by building robust pipelines for deployment, monitoring, and retraining.",
      category: "Technology",
      industry: "Artificial Intelligence",
      salaryMin: 115000,
      salaryMax: 230000,
      growthRate: 32,
      demandLevel: "Extreme",
      automationRisk: 0.05,
      requiredSkills: JSON.stringify(["Python", "Kubeflow", "Cloud Infrastructure", "CI/CD for ML"]),
      education: "Master's or equivalent experience",
      experienceLevel: "Mid-Senior",
      workStyle: "Remote/Hybrid",
      futureOutlook: "Hyper-growth as AI matures."
    },
    {
      title: "Data Engineer",
      description: "Architect and build the data infrastructure that powers modern analytics and AI systems.",
      category: "Technology",
      industry: "Data Engineering",
      salaryMin: 100000,
      salaryMax: 190000,
      growthRate: 24,
      demandLevel: "Very High",
      automationRisk: 0.12,
      requiredSkills: JSON.stringify(["SQL", "Spark/Flink", "Python", "Data Warehousing"]),
      education: "Bachelor's Degree",
      experienceLevel: "All Levels",
      workStyle: "Hybrid",
      futureOutlook: "Foundation of every data-driven company."
    },
    {
      title: "Embedded Systems Engineer",
      description: "Design and develop the low-level software that brings hardware to life, from IoT devices to medical tech.",
      category: "Technology",
      industry: "Hardware/IoT",
      salaryMin: 85000,
      salaryMax: 175000,
      growthRate: 11,
      demandLevel: "High",
      automationRisk: 0.15,
      requiredSkills: JSON.stringify(["C/C++", "RTOS", "Microcontrollers", "Debugging"]),
      education: "Electrical Engineering or CS",
      experienceLevel: "Mid-Senior",
      workStyle: "In-person/Hybrid",
      futureOutlook: "Growing with smart devices."
    },
    {
      title: "Game Developer",
      description: "Create immersive worlds and interactive experiences using high-performance game engines and 3D graphics.",
      category: "Technology",
      industry: "Entertainment",
      salaryMin: 70000,
      salaryMax: 180000,
      growthRate: 13,
      demandLevel: "High",
      automationRisk: 0.1,
      requiredSkills: JSON.stringify(["C++/C#", "Unity/Unreal", "3D Math", "Gameplay Logic"]),
      education: "CS or Digital Arts",
      experienceLevel: "All Levels",
      workStyle: "Any",
      futureOutlook: "Metaverse and high-fidelity gaming growth."
    },
    {
      title: "Solutions Architect",
      description: "Design complex technical solutions that solve real-world business challenges for enterprise clients.",
      category: "Technology",
      industry: "Consulting",
      salaryMin: 115000,
      salaryMax: 215000,
      growthRate: 16,
      demandLevel: "Very High",
      automationRisk: 0.08,
      requiredSkills: JSON.stringify(["Architecture Patterns", "Cloud Strategy", "Communication", "PoC Dev"]),
      education: "Senior Technical Background",
      experienceLevel: "Senior",
      workStyle: "Hybrid/Client-facing",
      futureOutlook: "Strategic role in technology adoption."
    },
    {
      title: "Ethical Hacker",
      description: "Protect global organizations by legally attacking their systems to find and fix vulnerabilities.",
      category: "Technology",
      industry: "Cybersecurity",
      salaryMin: 95000,
      salaryMax: 200000,
      growthRate: 28,
      demandLevel: "Extreme",
      automationRisk: 0.05,
      requiredSkills: JSON.stringify(["Penetration Testing", "Python", "Exploit Dev", "Security Frameworks"]),
      education: "CS or Security Certs",
      experienceLevel: "Mid-Senior",
      workStyle: "Remote/Hybrid",
      futureOutlook: "The frontline of digital defense."
    },
    {
      title: "Network Engineer",
      description: "Design and manage the global infrastructure that keeps the world connected through high-speed networks.",
      category: "Technology",
      industry: "Infrastructure",
      salaryMin: 80000,
      salaryMax: 165000,
      growthRate: 8,
      demandLevel: "High",
      automationRisk: 0.25,
      requiredSkills: JSON.stringify(["BGP/OSPF", "SDN", "Python/Ansible", "Routing/Switching"]),
      education: "Bachelor's Degree",
      experienceLevel: "All Levels",
      workStyle: "Hybrid",
      futureOutlook: "Transitioning to software-defined networking."
    },
    {
      title: "Computer Vision Engineer",
      description: "Develop the algorithms that allow machines to see, understand, and interact with the physical world.",
      category: "Technology",
      industry: "Artificial Intelligence",
      salaryMin: 120000,
      salaryMax: 240000,
      growthRate: 26,
      demandLevel: "Extreme",
      automationRisk: 0.05,
      requiredSkills: JSON.stringify(["C++/Python", "Deep Learning", "OpenCV", "Mathematics"]),
      education: "Master's/PhD preferred",
      experienceLevel: "Mid-Senior",
      workStyle: "Remote/Hybrid",
      futureOutlook: "Critical for autonomous systems and AR."
    },
    {
      title: "Information Security Manager",
      description: "Lead the security strategy and governance that protects an organization's most valuable assets.",
      category: "Technology",
      industry: "Security Management",
      salaryMin: 110000,
      salaryMax: 190000,
      growthRate: 14,
      demandLevel: "Very High",
      automationRisk: 0.05,
      requiredSkills: JSON.stringify(["GRC", "Strategy", "Incident Mgmt", "Leadership"]),
      education: "Senior Security Experience",
      experienceLevel: "Lead/Executive",
      workStyle: "Hybrid",
      futureOutlook: "Board-level importance in the digital age."
    }
  ];

  console.log("Seeding more tech roles...");

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
