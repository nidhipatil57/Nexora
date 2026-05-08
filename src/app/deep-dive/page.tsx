"use client";
import { useState, useEffect } from "react";
import { Search, Briefcase, TrendingUp, Target, BookOpen, Zap, Clock, Globe, Award, Sparkles, Loader2, Code2, GraduationCap, Lightbulb, Map, ArrowRight, X, Layers, MessageSquare, Shield, HelpCircle, Workflow, History, CheckCircle2, AlertCircle, BarChart, ExternalLink, Users, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store";

interface Career {
  id: string;
  title: string;
  description: string;
  category: string;
  industry: string;
  salaryMin: number;
  salaryMax: number;
  growthRate: number;
  demandLevel: string;
  automationRisk: number;
  requiredSkills: string;
  education: string;
  experienceLevel: string;
  workStyle: string;
  futureOutlook: string;
}

export default function DeepDivePage() {
  const { token } = useAuthStore();
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCareers() {
      try {
        const res = await fetch("/api/careers", {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const data = await res.json();
        if (data.success) setCareers(data.careers);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchCareers();
  }, [token]);

  const filteredCareers = careers.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getJobKnowledge = (careerTitle: string) => {
    const common = {
      marketTrends: ["Increasing reliance on AI integration", "Shift towards remote-first global teams", "Growing demand for domain-specific expertise"],
      resources: ["Coursera Professional Certificate", "Udemy Bestsellers", "Official Documentation"],
      pros: ["High earning potential", "Intellectual challenge", "Global opportunities"],
      cons: ["High pressure environments", "Constant need for upskilling", "Screen fatigue"],
    };

    const data: Record<string, any> = {
      "Software Engineer": {
        ...common,
        concepts: ["RESTful APIs & GraphQL", "Database Indexing & Normalization", "Concurrency & Parallelism", "CI/CD Pipelines & DevOps", "Containerization (Docker/K8s)", "Unit, Integration & E2E Testing", "System Design & Scalability", "Clean Code & SOLID Principles", "Microservices Architecture", "Memory Management", "Garbage Collection Algorithms", "Asynchronous Programming Models", "WebSockets & Real-time Data", "Authentication & JWT", "Load Balancing Strategies"],
        languages: ["JavaScript/TypeScript", "Python", "Java", "C++", "SQL", "Go", "Rust", "Swift", "PHP", "Ruby", "Kotlin", "C#", "Dart", "Solidity", "Assembly"],
        softSkills: ["Agile Communication", "Systemic Thinking", "Empathy in Peer Review", "Time Management", "Stakeholder Alignment"],
        roadmap: ["Computer Science Fundamentals", "Data Structures & Algorithms Mastery", "Language-Specific Specialization", "Web/Mobile Framework Proficiency", "Cloud Infrastructure (AWS/GCP/Azure)", "Open Source Leadership", "System Architect Designation", "Chief Technology Officer Path"],
        responsibilities: [
          "Designing and maintaining high-performance software systems for global users.",
          "Writing scalable, secure, and well-documented code for mission-critical apps.",
          "Collaborating with product managers and designers to define technical feasibility.",
          "Leading code reviews and enforcing high-quality engineering standards.",
          "Architecting microservices to ensure system resilience and fault tolerance.",
          "Optimizing database queries and system performance for low-latency responses.",
          "Mentoring junior developers and fostering a culture of technical excellence."
        ],
        interviewPrep: [
          "Explain the difference between a Process and a Thread.",
          "How would you design a distributed URL shortener like Bitly?",
          "Explain the CAP theorem and its implications on distributed databases.",
          "What is the difference between SQL and NoSQL? When would you use each?",
          "How do you handle memory leaks in a production JavaScript environment?",
          "Describe the process of a browser fetching a URL from start to finish."
        ],
        marketTrends: ["Rise of AI-assisted coding (Copilots)", "Growth of Rust in systems programming", "Edge computing becoming standard", "Low-code/No-code integration for rapid prototyping"],
        impact: "Software engineers build the digital nervous system of the modern world, enabling everything from global finance to life-saving medical tech.",
        dailyDay: "A balanced mix of 'deep work' coding blocks, technical grooming sessions with the product team, and providing constructive feedback on pull requests. The day often ends with monitoring deployment pipelines and ensuring system stability."
      },
      "Data Scientist": {
        ...common,
        concepts: ["Bayesian Statistics & Probability", "Gradient Descent Optimization", "Feature Engineering & Selection", "Data Normalization & Cleaning", "A/B Testing & Hypothesis Testing", "Ensemble Methods (XGBoost/RandomForest)", "Neural Networks & Backpropagation", "Data Visualization Principles", "Dimensionality Reduction (PCA)", "Big Data Processing", "Natural Language Processing (NLP)", "Reinforcement Learning Fundamentals", "Time Series Forecasting", "Causal Inference", "Statistical Power Analysis"],
        languages: ["Python", "R", "SQL", "Julia", "Scala", "MATLAB", "SAS", "Hadoop", "Spark", "Tableau", "PowerBI", "PyTorch", "TensorFlow", "Pandas", "Scikit-Learn"],
        softSkills: ["Storytelling with Data", "Ethical Decision Making", "Curiosity-Driven Research", "Cross-Functional Collaboration", "Business Acumen"],
        roadmap: ["Mathematics & Linear Algebra Mastery", "Probability & Statistics Deep Dive", "Data Wrangling & ETL Proficiency", "Supervised & Unsupervised Learning", "Deep Learning & AI Specialization", "Big Data Engineering Foundations", "Head of Data Analytics Path", "Chief Data Officer Horizon"],
        responsibilities: [
          "Mining and analyzing massive datasets to uncover hidden business opportunities.",
          "Building and deploying predictive models that drive strategic decision-making.",
          "Designing and interpreting complex A/B tests to optimize user experiences.",
          "Creating high-fidelity data visualizations for executive-level presentations.",
          "Collaborating with engineering teams to integrate ML models into production.",
          "Cleaning and validating data streams to ensure model accuracy and reliability.",
          "Researching state-of-the-art algorithms to maintain a competitive data edge."
        ],
        interviewPrep: [
          "Explain the bias-variance tradeoff in machine learning.",
          "What is the difference between L1 and L2 regularization?",
          "How would you detect and handle outliers in a highly skewed dataset?",
          "Describe the Central Limit Theorem and why it's important for statistics.",
          "How do you evaluate the performance of a classification model (ROC/AUC)?",
          "Explain the 'Kernel Trick' in Support Vector Machines."
        ],
        marketTrends: ["Automated Machine Learning (AutoML)", "Ethical AI and Bias Detection", "Data Observability & Reliability Engineering", "Real-time stream processing for instant insights"],
        impact: "Data Scientists transform raw noise into strategic signals, helping organizations predict the future and solve complex societal challenges.",
        dailyDay: "Mornings are spent in data cleaning and feature engineering. Afternoons involve training and validating models, followed by meetings with stakeholders to explain what the numbers actually mean for the business."
      },
      "AI Engineer": {
        ...common,
        concepts: ["Transformer Architectures (BERT/GPT)", "LLM Fine-tuning & Prompt Engineering", "Reinforcement Learning from Human Feedback (RLHF)", "Computer Vision (CNNs/YOLO)", "Generative Adversarial Networks (GANs)", "Vector Databases (Pinecone/Milvus/Weaviate)", "Neural Architecture Search", "Model Quantization & Pruning", "Hyperparameter Optimization", "AI Safety & Alignment Frameworks", "Knowledge Distillation", "Attention Mechanisms", "Long-term Memory in AI", "Multi-modal Learning", "Edge AI Deployment"],
        languages: ["Python", "C++", "CUDA", "Rust", "Lisp", "Mojo", "Java", "Scala", "Lua", "Julia", "Triton", "OpenCL", "Go", "TypeScript", "Swift"],
        softSkills: ["Ethical Reasoning", "Rapid Research Adaptation", "Philosophical Inquiry", "Technical Writing", "Creative Problem Solving"],
        roadmap: ["AI Foundations & Classical ML", "Deep Learning Mastery (PyTorch/TF)", "NLP or Computer Vision Specialization", "Large Scale LLM Engineering", "Autonomous Systems Development", "AI Ethics & Governance Specialist", "Principal AI Architect", "Director of AI Research"],
        responsibilities: [
          "Developing and fine-tuning large-scale foundational AI models.",
          "Optimizing model inference for low-latency and high-throughput use cases.",
          "Building robust data pipelines for training massive neural networks.",
          "Implementing AI safety measures to prevent model hallucination and bias.",
          "Researching new neural architectures to solve industry-specific problems.",
          "Deploying AI systems to edge devices and cloud infrastructure.",
          "Collaborating with researchers to translate theoretical papers into code."
        ],
        interviewPrep: [
          "Explain the architecture of a standard Transformer model.",
          "What is the difference between supervised and self-supervised learning?",
          "How do you handle the 'Vanishing Gradient' problem in deep networks?",
          "Explain RLHF and its role in modern LLM development.",
          "How would you optimize a model for deployment on a mobile device?",
          "Describe the intuition behind Generative Adversarial Networks."
        ],
        marketTrends: ["Generative AI explosion across all sectors", "Specialized hardware (TPUs/LPUs) becoming critical", "Agentic AI workflows (AI doing tasks)", "Open-source vs Proprietary model wars"],
        impact: "AI Engineers are building the next level of human intelligence, creating tools that can see, hear, think, and solve problems beyond human capacity.",
        dailyDay: "Heavy focus on experimental runs—adjusting weights, monitoring loss curves, and reading the latest research papers to keep the models at the absolute cutting edge."
      },
      "Cybersecurity Analyst": {
        ...common,
        concepts: ["Zero Trust Security Models", "Advanced Encryption Standards (AES/RSA/ECC)", "Penetration Testing & Red Teaming", "SOC Workflows", "Incident Response & Forensics", "Network Protocol Analysis", "Cloud Security Architecture", "Malware Analysis", "Compliance Frameworks", "Threat Intelligence", "Firewall & WAF Configuration", "Vulnerability Management", "Social Engineering Defense", "DDoS Mitigation", "Blockchain Security"],
        languages: ["Python", "Bash", "PowerShell", "C", "Assembly", "Go", "SQL", "Javascript", "Rust"],
        softSkills: ["Adversarial Thinking", "Precision Under Pressure", "Clear Crisis Communication", "Attention to Detail", "Integrity"],
        roadmap: ["Networking & Linux Fundamentals", "CompTIA Security+ Mastery", "Ethical Hacking (OSCP) Track", "Security Engineering Specialization", "Digital Forensics Expert", "Chief Information Security Officer (CISO)", "Security Consultant Horizon"],
        responsibilities: ["Monitoring enterprise networks for intrusions", "Performing regular penetration tests", "Developing cybersecurity policies", "Investigating security incidents", "Managing security infrastructure", "Educating employees on security", "Staying ahead of global threat actors"],
        interviewPrep: ["Explain the 3-way TCP handshake and how it can be exploited.", "What is the difference between Symmetric and Asymmetric encryption?", "How would you detect a man-in-the-middle attack?", "Describe the steps of a standard incident response plan.", "What is 'Salting' in the context of password hashing?"],
        marketTrends: ["AI-powered cyberattacks", "Focus on Supply Chain Security", "Quantum-resistant cryptography"],
        impact: "Cybersecurity analysts are the silent guardians of the digital era, protecting the privacy and safety of billions.",
        dailyDay: "Constant vigilance—monitoring real-time traffic alerts, patching critical zero-day vulnerabilities, and running 'war games' to test response speed."
      },
      "Cloud Architect": {
        ...common,
        concepts: ["Multi-cloud Strategy", "Serverless Computing", "Cloud-Native Design", "High Availability & Disaster Recovery", "Infrastructure as Code (IaC)", "Microservices Orchestration", "Cloud FinOps & Cost Optimization", "Virtual Private Clouds (VPC)", "Content Delivery Networks (CDN)", "Edge Computing"],
        languages: ["Terraform", "CloudFormation", "Python", "Go", "YAML", "HCL", "Bash", "JSON"],
        softSkills: ["Strategic Vision", "Stakeholder Management", "Risk Assessment", "Cost Consciousness"],
        roadmap: ["Cloud Practitioner Foundations", "Associate Solutions Architect", "Professional Cloud Architect", "Infrastructure Specialization", "Cloud Security Expert", "Principal Cloud Architect", "Chief Infrastructure Officer"],
        responsibilities: ["Designing scalable cloud infrastructure for global applications", "Directing cloud migration strategies for legacy systems", "Optimizing cloud spend and resource allocation", "Ensuring high availability across multiple geographic regions", "Developing IaC templates for automated deployments"],
        interviewPrep: ["Compare AWS, Azure, and GCP in terms of market fit.", "How do you design for 99.999% availability?", "Explain the difference between vertical and horizontal scaling.", "What is a 'Well-Architected Framework'?", "How do you handle data sovereignty in a global cloud setup?"],
        marketTrends: ["Rise of Sovereign Clouds", "FinOps becoming a core discipline", "AI-optimized cloud hardware"],
        impact: "Cloud Architects build the foundation for the world's most powerful applications, enabling global scale and instant innovation.",
        dailyDay: "Balancing high-level architectural drawings with reviewing infrastructure costs and troubleshooting complex networking routes between cloud providers."
      },
      "DevOps Engineer": {
        ...common,
        concepts: ["CI/CD Pipeline Automation", "GitOps Workflows", "Container Orchestration (Kubernetes)", "Observability & Monitoring (ELK/Prometheus)", "Configuration Management (Ansible/Chef)", "Site Reliability Engineering (SRE)", "Blue-Green & Canary Deployments", "Secret Management", "Log Aggregation", "Automated Testing Integration"],
        languages: ["Python", "Go", "Bash", "Groovy", "YAML", "Ruby", "Rust"],
        softSkills: ["Collaboration", "Agile Mindset", "Problem Solving", "Efficiency Obsession"],
        roadmap: ["Linux & Scripting Mastery", "CI/CD Toolchain Specialization", "Kubernetes Administration (CKA)", "SRE Principles Implementation", "DevSecOps Integration", "Platform Engineer Designation", "Director of Engineering Operations"],
        responsibilities: ["Automating the software delivery lifecycle", "Managing production Kubernetes clusters", "Implementing comprehensive monitoring and alerting", "Ensuring 99.9% uptime and system reliability", "Building developer self-service platforms"],
        interviewPrep: ["Explain the difference between Continuous Delivery and Deployment.", "How do you handle a massive traffic spike in K8s?", "Describe a GitOps workflow.", "What is 'Infrastructure as Code' and why use it?", "How do you secure a CI/CD pipeline?"],
        marketTrends: ["Platform Engineering growth", "AI-driven incident response (AIOps)", "ebpf for deep system observability"],
        impact: "DevOps Engineers are the force multipliers of tech, enabling teams to ship faster and more reliably than ever before.",
        dailyDay: "Tweaking build pipelines, responding to on-call alerts, and writing automation scripts to ensure developers never have to wait on infrastructure."
      },
      "Full Stack Developer": {
        ...common,
        concepts: ["Universal JavaScript/TypeScript", "State Management (Redux/Zustand)", "API Design (REST/GraphQL/gRPC)", "Responsive Web Design", "Progressive Web Apps (PWA)", "Database Integration (NoSQL/Relational)", "Server-side Rendering (SSR)", "Hydration Models", "Web Security Basics (CORS/CSRF)", "Browser Rendering Optimization"],
        languages: ["TypeScript", "JavaScript", "React", "Next.js", "Node.js", "Python", "SQL", "HTML/CSS", "TailwindCSS"],
        softSkills: ["User Empathy", "Holistic Product Thinking", "Adaptability", "Communication"],
        roadmap: ["Front-end Mastery (React/CSS)", "Back-end Fundamentals (Node/SQL)", "Full Stack Project Leadership", "Architecting Complex SaaS Platforms", "Engineering Manager or Principal Engineer", "Product-Focused CTO"],
        responsibilities: ["Building end-to-end features from UI to database", "Designing scalable API contracts", "Optimizing front-end performance and SEO", "Managing complex application state", "Integrating third-party services and payments"],
        interviewPrep: ["Explain the event loop in Node.js.", "How does React's Virtual DOM work?", "Compare Client-side vs Server-side rendering.", "How do you secure an API endpoint?", "Describe your favorite state management pattern."],
        marketTrends: ["Server Components and Edge computing", "AI-assisted UI generation", "TypeScript everywhere"],
        impact: "Full Stack Developers are the builders of the internet, turning ideas into fully functional digital realities.",
        dailyDay: "A mix of CSS polishing, API debugging, and database schema migrations. A true generalist's life."
      },
      "Blockchain Developer": {
        ...common,
        concepts: ["Smart Contract Security", "Decentralized Finance (DeFi)", "NFT Architectures", "Consensus Mechanisms (PoS/PoW)", "Layer 2 Scaling (Rollups/Zk)", "Cryptographic Hash Functions", "Web3 Integration (Ethers.js/Wagmi)", "Oracles & External Data (Chainlink)", "DAOs & Governance Models", "Gas Optimization"],
        languages: ["Solidity", "Rust", "TypeScript", "Go", "C++", "Python", "Assembly (Yul)"],
        softSkills: ["Security Mindset", "Long-term Economic Thinking", "Technical Writing", "Open Source Ethics"],
        roadmap: ["Cryptography Basics", "Ethereum & Solidity Specialization", "DeFi Protocol Development", "Layer 2 & ZK-Research", "Blockchain Architect", "Protocol Founder"],
        responsibilities: ["Writing and auditing secure smart contracts", "Developing decentralized applications (dApps)", "Implementing tokenomics and governance models", "Optimizing gas usage on mainnet", "Building secure bridges between networks"],
        interviewPrep: ["What is a Reentrancy attack and how do you prevent it?", "Explain the difference between Optimistic and ZK rollups.", "How does the EVM work?", "What are EIPs and why are they important?", "Describe how a blockchain reaches consensus."],
        marketTrends: ["Zero Knowledge (ZK) Proofs dominance", "Tokenization of Real World Assets (RWA)", "Account Abstraction for better UX"],
        impact: "Blockchain Developers are building the infrastructure for a more transparent and trustless global economy.",
        dailyDay: "Writing Solidity, running extensive unit tests for edge cases, and keeping a close eye on the latest security vulnerability reports in the space."
      },
      "UX Designer": {
        ...common,
        concepts: ["Design Systems Engineering", "Interaction Design", "Accessibility (WCAG)", "Animation Orchestration (Framer Motion/GSAP)", "Typography & Color Theory", "Component Library Architecture", "Design-to-Code Workflows", "User Research Analysis", "Prototyping High Fidelity", "Visual Storytelling"],
        languages: ["TypeScript", "CSS/SASS", "React", "Figma", "Storybook", "SVG", "Tailwind", "Canvas API"],
        softSkills: ["Empathy", "Attention to Detail", "Creative Vision", "Collaboration with Designers"],
        roadmap: ["Front-end Development Core", "Interaction Design Specialization", "Design System Lead", "Creative Technologist", "Principal UX Engineer", "Design Engineering Director"],
        responsibilities: ["Bridging the gap between design and engineering", "Building and maintaining reusable design systems", "Creating fluid, high-performance animations", "Ensuring 100% accessibility compliance", "Advocating for the user in technical decisions"],
        interviewPrep: ["How do you ensure a design system is adoptable?", "What is your process for optimizing web performance?", "Explain the importance of accessible design.", "Describe a complex animation you built.", "How do you handle design-engineering handoffs?"],
        marketTrends: ["AI-generated design assets", "Variables in CSS and Figma", "Micro-interactions as a brand differentiator"],
        impact: "UX Designers make technology human, ensuring that digital tools are beautiful, accessible, and intuitive for everyone.",
        dailyDay: "Pixel-perfecting layouts, building Storybook components, and working closely with designers to bring static mocks to life."
      },
      "Product Manager": {
        ...common,
        concepts: ["Agile/Scrum Frameworks", "API Strategy & Ecosystems", "Data-Driven Decision Making", "Product Roadmap Planning", "Stakeholder Alignment", "User Story Mapping", "Competitive Analysis", "Market Fit Validation", "Technical Debt Management", "Go-to-Market (GTM) Strategy"],
        languages: ["SQL", "Python (for Analysis)", "Jira/Linear", "Productboard", "Mixpanel/Amplitude", "Tableau"],
        softSkills: ["Leadership without Authority", "Strategic Thinking", "Public Speaking", "Conflict Resolution", "Negotiation"],
        roadmap: ["Software Engineering Foundation", "Product Management Core", "Senior TPM", "Group Product Manager", "VP of Product", "Chief Product Officer"],
        responsibilities: ["Defining the technical product vision and strategy", "Prioritizing the engineering backlog", "Translating business needs into technical requirements", "Managing product launches and stakeholder expectations", "Analyzing product metrics to drive growth"],
        interviewPrep: ["How do you prioritize a backlog with competing interests?", "Describe a time you said 'no' to a feature.", "How do you measure the success of a technical product?", "Explain a complex technical concept to a non-technical person.", "How do you manage technical debt vs new features?"],
        marketTrends: ["Product-led growth (PLG)", "AI integration in product workflows", "Focus on Platform-as-a-Product"],
        impact: "Product Managers are the bridge between vision and reality, ensuring that the most impactful products are built efficiently and effectively.",
        dailyDay: "Mornings in standups and technical grooming, afternoons in strategic planning and customer interviews. Constant context switching."
      },
      "Mobile App Developer": {
        ...common,
        concepts: ["Native vs Cross-Platform Architecture", "Mobile UI Lifecycle", "Local Persistence (CoreData/Room/SQLite)", "App Store/Play Store Deployment", "Mobile Security Patterns", "Offline-first Design", "Push Notifications & Deep Linking", "Memory Management in Mobile", "Gesture Handling", "Mobile Analytics Integration"],
        languages: ["Swift", "Kotlin", "TypeScript (React Native)", "Dart (Flutter)", "Objective-C", "Java", "C#"],
        softSkills: ["User Experience Mindset", "Resourcefulness", "Platform Passion", "Performance Focus"],
        roadmap: ["Platform Core Mastery (iOS or Android)", "Cross-Platform Framework Specialization", "Mobile Architect", "Principal Mobile Engineer", "Director of Mobile Engineering"],
        responsibilities: ["Building high-performance native and cross-platform apps", "Optimizing app battery and memory usage", "Implementing complex UI transitions and animations", "Managing continuous integration for mobile", "Keeping up with yearly OS updates from Apple/Google"],
        interviewPrep: ["Explain the difference between Frame and Bounds (iOS).", "How do you handle background tasks in Android?", "Compare React Native and Flutter.", "What is your strategy for offline data syncing?", "How do you optimize app startup time?"],
        marketTrends: ["SwiftUI and Jetpack Compose maturity", "Super-apps becoming a trend", "AR/VR integration on mobile"],
        impact: "Mobile Developers build the tools that live in people's pockets, creating the most personal and frequent touchpoints in tech.",
        dailyDay: "Testing on physical devices, debugging threading issues, and perfecting the 'feel' of a swipe or button press."
      },
      "QA Automation Engineer": {
        ...common,
        concepts: ["Test Automation Frameworks (Playwright/Cypress/Selenium)", "Behavior Driven Development (BDD)", "Continuous Testing in CI/CD", "Performance & Load Testing (JMeter/K6)", "API Testing & Mocking", "Visual Regression Testing", "Test Data Management", "Mobile Testing Automation", "Chaos Engineering Basics", "Security Testing Integration"],
        languages: ["TypeScript", "JavaScript", "Python", "Java", "C#", "SQL", "Bash"],
        softSkills: ["Skeptical Mindset", "Extreme Attention to Detail", "Quality Advocacy", "Technical Writing"],
        roadmap: ["Manual Testing Foundations", "Automation Scripting Specialization", "Lead Automation Engineer", "SDET (Software Development Engineer in Test)", "QA Architect", "Head of Quality Engineering"],
        responsibilities: ["Designing and building automated test suites", "Integrating testing into the deployment pipeline", "Reporting and tracking complex bug regressions", "Advocating for quality in the design phase", "Building internal tools for developers to test better"],
        interviewPrep: ["What is the Page Object Model?", "How do you handle flaky tests?", "Explain the difference between smoke and sanity testing.", "How do you test an API with no documentation?", "Describe your automation framework architecture."],
        marketTrends: ["AI-driven test generation", "Shift-left testing in DevOps", "Visual testing becoming standard"],
        impact: "QA Automation Engineers are the last line of defense, ensuring that only high-quality, stable software reaches the user.",
        dailyDay: "Writing end-to-end test scripts, analyzing failing pipeline builds, and helping developers write better unit tests."
      },
      "Site Reliability Engineer (SRE)": {
        ...common,
        concepts: ["Error Budgets & SLOs", "Toil Reduction", "Incident Management", "Chaos Engineering", "Distributed Tracing", "Latency Optimization", "Disaster Recovery Planning", "Capacity Planning", "Automated Remediation", "Infrastructure Observability"],
        languages: ["Go", "Python", "C++", "Rust", "Bash", "SQL"],
        softSkills: ["Composure Under Pressure", "Analytical Troubleshooting", "Efficiency Obsession", "Post-mortem Culture"],
        roadmap: ["Software Engineering Mastery", "Systems & Networking Deep Dive", "SRE Principles Adoption", "Incident Response Leadership", "Reliability Architect", "VP of Reliability Engineering"],
        responsibilities: ["Managing massive-scale service reliability", "Designing automated self-healing systems", "Defining and monitoring SLIs/SLOs/SLAs", "Conducting blameless post-mortems", "Optimizing system performance and cost"],
        interviewPrep: ["What is an Error Budget and how do you use it?", "How do you handle a cascading failure?", "Describe your approach to capacity planning.", "What is the difference between SRE and DevOps?", "How do you measure system availability?"],
        marketTrends: ["AIOps for automated incident resolution", "Serverless SRE patterns", "Focus on Resilience Engineering"],
        impact: "SREs ensure the world's most critical digital services stay online 24/7, no matter the scale.",
        dailyDay: "Balancing 'toil reduction' coding projects with managing production incidents and reviewing system architecture for reliability."
      },
      "Machine Learning Engineer": {
        ...common,
        concepts: ["Model Deployment Pipelines", "Feature Stores", "Model Monitoring & Drift Detection", "Training Infrastructure scaling", "MLflow/Kubeflow Workflows", "Data Versioning (DVC)", "Hyperparameter Tuning Automation", "Serving Latency Optimization", "A/B Testing for ML Models", "Continuous Retraining"],
        languages: ["Python", "Go", "YAML", "SQL", "C++", "Triton"],
        softSkills: ["Bridge-building (Data/Ops)", "Experimental Mindset", "Scalability Thinking", "Precision"],
        roadmap: ["DevOps Fundamentals", "Machine Learning Basics", "ML Production Systems Engineering", "MLOps Architect", "Director of AI Infrastructure"],
        responsibilities: ["Automating the ML lifecycle (CICD for ML)", "Building and maintaining feature stores", "Monitoring model performance in production", "Optimizing model inference at scale", "Bridging the gap between Data Scientists and Engineers"],
        interviewPrep: ["How do you detect feature drift in production?", "Describe an ML CI/CD pipeline.", "What is a Feature Store and why use it?", "How do you scale model training in the cloud?", "Explain the challenges of serving large LLMs."],
        marketTrends: ["LLMOps (Operationalizing Large Language Models)", "Real-time online learning", "Edge ML deployment maturity"],
        impact: "Machine Learning Engineers turn experimental AI models into reliable, high-impact production products.",
        dailyDay: "Building automation for model deployment, monitoring health dashboards for drift, and collaborating with Data Scientists to improve training efficiency."
      },
      "Data Engineer": {
        ...common,
        concepts: ["Big Data Architectures (Lakehouse/Delta)", "ETL/ELT Pipeline Development", "Data Warehousing (Snowflake/BigQuery)", "Stream Processing (Kafka/Flink)", "Data Governance & Lineage", "Schema Evolution", "Distributed Computing (Spark/Hadoop)", "Data Modeling (Star/Snowflake)", "Partitioning Strategies", "Data Quality Frameworks"],
        languages: ["Python", "SQL", "Scala", "Java", "Go"],
        softSkills: ["Structured Thinking", "Detail Oriented", "Efficiency Focus", "Clear Technical Communication"],
        roadmap: ["SQL & Database Mastery", "Distributed Systems Fundamentals", "Big Data Engineering Track", "Data Architect Designation", "Chief Data Officer Horizon"],
        responsibilities: ["Building robust data pipelines and infrastructures", "Optimizing large-scale database queries", "Designing data architectures for analytics and ML", "Ensuring data quality and accessibility", "Implementing data security and compliance protocols"],
        interviewPrep: ["Explain the difference between ETL and ELT.", "How do you handle a late-arriving data point in a stream?", "Describe the Star Schema vs Snowflake Schema.", "How do you optimize a Spark job?", "Explain CAP theorem in the context of Big Data."],
        marketTrends: ["Modern Data Stack (MDS) consolidation", "Real-time data streaming everywhere", "Data Mesh and Decentralized Ownership"],
        impact: "Data Engineers build the digital plumbing that allows data to flow from raw sources to impactful insights.",
        dailyDay: "Writing complex SQL, building Spark jobs, and ensuring that multi-terabyte data streams are flowing correctly into the warehouse."
      },
      "Embedded Systems Engineer": {
        ...common,
        concepts: ["Real-time Operating Systems (RTOS)", "Microcontroller Programming", "Hardware Abstraction Layers (HAL)", "I2C/SPI/UART Communication", "Low-power Design", "Memory Constraints Management", "Interrupt Handling", "Firmware Over-the-Air (FOTA)", "Hardware/Software Co-design", "Safety Critical Systems"],
        languages: ["C", "C++", "Rust", "Assembly", "Python (for testing)"],
        softSkills: ["Methodical Troubleshooting", "Patience", "Cross-disciplinary Collaboration", "Precision"],
        roadmap: ["Electrical Engineering Fundamentals", "Low-level Programming Mastery", "Embedded Systems Architect", "Firmware Engineering Lead", "Director of Hardware/Software Systems"],
        responsibilities: ["Writing efficient code for specialized hardware", "Debugging hardware-software interactions", "Optimizing memory and power consumption", "Designing low-level drivers and RTOS tasks", "Testing systems for reliability and safety"],
        interviewPrep: ["What is an Interrupt Service Routine (ISR)?", "Explain Volatile keyword in C.", "How do you debug a memory leak in a system with no heap?", "Describe the difference between I2C and SPI.", "What is a Watchdog Timer?"],
        marketTrends: ["Rust for Embedded Systems growth", "Edge AI on microcontrollers (TinyML)", "IoT connectivity becoming standard"],
        impact: "Embedded engineers bring inanimate objects to life, from medical devices to autonomous vehicles.",
        dailyDay: "Working with oscilloscopes, reading hardware datasheets, and writing highly-optimized C code that runs on tiny chips."
      },
      "Game Developer": {
        ...common,
        concepts: ["Game Engine Architecture (Unity/Unreal)", "3D Mathematics & Linear Algebra", "Shader Programming (HLSL/GLSL)", "Game Loop Optimization", "Networking for Multiplayer", "Artificial Intelligence for NPCs", "Level Streaming & LOD", "Physics Simulation", "Animation Blending", "Performance Profiling"],
        languages: ["C++", "C#", "C", "Lua", "Python", "Rust"],
        softSkills: ["Creativity", "Passion for UX", "Rapid Iteration", "Collaboration with Artists"],
        roadmap: ["Mathematics & CS Foundations", "Game Engine Specialization", "Gameplay or Graphics Programming", "Technical Director Path", "Studio Creative Lead"],
        responsibilities: ["Implementing core gameplay mechanics", "Optimizing graphics and rendering performance", "Building tools for level designers and artists", "Developing multiplayer networking logic", "Debugging complex engine-level issues"],
        interviewPrep: ["How do you optimize a draw call in a 3D scene?", "Explain the Dot Product and its use in games.", "What is the difference between Forward and Deferred rendering?", "How do you handle lag compensation in multiplayer?", "Describe the Game Loop."],
        marketTrends: ["Real-time ray tracing maturity", "Cloud gaming infrastructure", "Procedural content generation via AI"],
        impact: "Game developers create entire worlds, providing entertainment and emotional experiences to millions.",
        dailyDay: "A mix of physics debugging, shader tweaking, and playtesting new mechanics to ensure they 'feel' right."
      },
      "Solutions Architect": {
        ...common,
        concepts: ["Enterprise Integration Patterns", "Cloud Migration Strategy", "Requirement Analysis", "TCO (Total Cost of Ownership)", "Reference Architectures", "API Management", "Security & Compliance Review", "Proof of Concept (PoC) Development", "Legacy System Modernization", "Vendor Selection"],
        languages: ["Python", "Java", "Go", "Diagramming Tools (Lucid/Miro)"],
        softSkills: ["Consultative Selling", "Complex Problem Solving", "Strategic Alignment", "Public Speaking"],
        roadmap: ["Software Engineering Foundation", "Solution Design Mastery", "Senior Solutions Architect", "Principal/Enterprise Architect", "Chief Strategy Officer"],
        responsibilities: ["Designing end-to-end technical solutions for clients", "Bridging business needs with technical possibilities", "Building prototypes to prove architectural feasibility", "Leading technical workshops and sales calls", "Governing the technical standards across a portfolio"],
        interviewPrep: ["How do you handle a client with conflicting requirements?", "Describe a complex migration you led.", "How do you balance cost vs performance in an architecture?", "Explain a 'serverless first' strategy.", "How do you evaluate new technology for a company?"],
        marketTrends: ["Composable Architectures", "Focus on Digital Sovereignty", "AI as a core architectural component"],
        impact: "Solutions Architects ensure that complex technology actually solves real-world business problems.",
        dailyDay: "Mornings in whiteboarding sessions, afternoons writing technical proposals and meeting with executive stakeholders."
      },
      "Ethical Hacker": {
        ...common,
        concepts: ["Advanced Persistent Threats (APT)", "Exploit Development", "Web Application Hacking", "Wireless Security Auditing", "Social Engineering Scenarios", "Cryptography Breaking", "Privilege Escalation", "Post-exploitation Techniques", "Cloud Infrastructure Pentesting", "Reporting & Remediation Advice"],
        languages: ["Python", "Bash", "JavaScript", "C", "Go", "Ruby"],
        softSkills: ["Persistence", "Curiosity", "Ethics & Integrity", "Attention to Detail"],
        roadmap: ["Security Foundations", "Penetration Testing Certification (OSCP/GPEN)", "Red Team Specialist", "Security Research Lead", "Director of Offensive Security"],
        responsibilities: ["Legally attacking systems to find vulnerabilities", "Developing exploit proofs of concept", "Writing detailed remediation reports for engineers", "Conducting social engineering tests", "Staying ahead of real-world attacker techniques"],
        interviewPrep: ["What is a Buffer Overflow and how do you prevent it?", "Walk me through your process for hacking a web app.", "What is the difference between a vulnerability and an exploit?", "How do you bypass an IDS/IPS?", "Describe a recent 0-day you followed."],
        marketTrends: ["Bug Bounty program dominance", "AI-assisted vulnerability discovery", "Focus on IoT and Edge security"],
        impact: "Ethical hackers find the holes in the wall before the bad guys do, protecting global infrastructure from catastrophe.",
        dailyDay: "Running scanners, manually poking at API endpoints, and writing scripts to automate the 'boring' parts of an attack."
      },
      "Network Engineer": {
        ...common,
        concepts: ["Software Defined Networking (SDN)", "BGP & OSPF Routing Protocols", "Load Balancing & Traffic Engineering", "Network Virtualization", "Zero Trust Network Access", "VPC/VPN Tunneling", "QoS (Quality of Service)", "Network Automation (NetDevOps)", "Firewall & Security Groups", "Fiber Optics & Physical Layer"],
        languages: ["Python", "Bash", "Ansible", "Terraform", "Cisco CLI", "YAML"],
        softSkills: ["Patience", "Methodical Logic", "Systemic View", "Precision"],
        roadmap: ["CCNA/JNCIA Foundations", "Professional Network Specialization", "Network Architect", "Global Infrastructure Lead", "VP of Network Engineering"],
        responsibilities: ["Designing and maintaining global network backbones", "Automating network configuration and deployment", "Troubleshooting complex connectivity issues", "Ensuring low-latency and high-bandwidth paths", "Managing network security and access controls"],
        interviewPrep: ["Explain the 7 layers of the OSI model.", "How does BGP reach a routing decision?", "What is the difference between a Switch and a Router?", "Describe a Zero Trust network architecture.", "How do you troubleshoot a packet loss issue?"],
        marketTrends: ["Transition to 400G/800G networks", "Satellite internet integration (Starlink)", "AI-driven network optimization"],
        impact: "Network Engineers build the invisible highways that connect the entire digital world.",
        dailyDay: "Updating routing tables, debugging latency spikes, and writing Python scripts to automate switch configurations."
      },
      "Computer Vision Engineer": {
        ...common,
        concepts: ["Object Detection & Tracking", "Image Segmentation", "3D Reconstruction", "Feature Extraction (ORB/SIFT)", "Optical Flow", "Camera Calibration", "Embedded Vision (OpenCV)", "Pose Estimation", "Generative Vision Models", "Sensor Fusion"],
        languages: ["Python", "C++", "CUDA", "PyTorch", "OpenCV"],
        softSkills: ["Mathematical Rigor", "Patience with Data", "Visual Intuition", "Research Adaptation"],
        roadmap: ["Mathematics & Signal Processing", "Deep Learning for Vision Mastery", "Specialized Research (Robotics/Auto)", "Principal Vision Scientist", "Head of AI Vision Research"],
        responsibilities: ["Developing algorithms for machines to see and understand", "Training and optimizing vision models for production", "Processing high-speed video streams in real-time", "Integrating vision systems into robots or vehicles", "Staying current with CVPR/ICCV research"],
        interviewPrep: ["How does a Convolutional Neural Network work?", "What is IoU (Intersection over Union)?", "Explain Camera Intrinsic vs Extrinsic parameters.", "How do you handle varying lighting conditions in CV?", "Describe the architecture of YOLO (You Only Look Once)."],
        marketTrends: ["Foundation models for vision (SAM)", "Spatial Computing growth (Vision Pro/Meta)", "3D Gaussian Splatting"],
        impact: "Computer Vision Engineers give machines the gift of sight, enabling autonomous cars and life-saving diagnostic tools.",
        dailyDay: "Staring at data annotations, debugging model weights, and running real-time tests on video footage."
      },
      "Information Security Manager": {
        ...common,
        concepts: ["Risk Management Frameworks", "Compliance (GDPR/HIPAA/ISO)", "Security Governance", "Policy Development", "Business Continuity Planning", "Security Auditing", "Third-party Risk Management", "Incident Response Management", "Identity & Access Management (IAM)", "Security Awareness Training"],
        languages: ["SQL (for auditing)", "GRC Tools", "Dashboarding (PowerBI/Tableau)"],
        softSkills: ["Leadership", "Strategic Communication", "Pragmatism", "Regulatory Knowledge"],
        roadmap: ["Security Engineering Experience", "Security Management (CISM/CISSP)", "Information Security Lead", "CISO (Chief Information Security Officer)", "Board Advisory"],
        responsibilities: ["Leading the organization's security strategy", "Ensuring regulatory compliance across all products", "Managing security teams and budgets", "Overseeing incident response and recovery", "Reporting security risks to executive leadership"],
        interviewPrep: ["How do you balance security needs with business speed?", "Describe a time you managed a major security breach.", "How do you build a culture of security in a company?", "What is your approach to risk assessment?", "Explain the importance of ISO 27001."],
        marketTrends: ["Shift to 'Security as an Enabler'", "AI governance and safety policies", "Focus on Supply Chain Risk Management"],
        impact: "Information Security Managers protect the integrity and reputation of entire organizations from modern threats.",
        dailyDay: "A mix of policy writing, risk assessment meetings, and overseeing the security operations center's output."
      },
      "NLP Engineer": {
        ...common,
        concepts: ["Tokenization & Embeddings", "Transformers & Attention Mechanisms", "Sequence-to-Sequence Models", "Named Entity Recognition (NER)", "Sentiment Analysis", "Language Modeling (LLMs)", "Reinforcement Learning from Human Feedback (RLHF)", "Vector Databases", "Prompt Engineering", "Semantic Search"],
        languages: ["Python", "PyTorch", "HuggingFace", "TypeScript", "SQL"],
        softSkills: ["Linguistic Nuance", "Ethical AI Mindset", "Research Proficiency", "Patience"],
        roadmap: ["Linguistics & CS Foundations", "Deep Learning for NLP Mastery", "LLM Specialization", "Principal AI Scientist", "Director of Language Technologies"],
        responsibilities: ["Developing and fine-tuning large language models", "Building semantic search and chatbot infrastructures", "Optimizing model inference for real-time text processing", "Cleaning and managing massive text corpora", "Researching state-of-the-art NLP architectures"],
        interviewPrep: ["Explain the difference between BERT and GPT.", "What is self-attention and why is it important?", "How do you handle out-of-vocabulary tokens?", "Describe the process of fine-tuning an LLM.", "What are vector embeddings and how are they used?"],
        marketTrends: ["Retrieval Augmented Generation (RAG)", "Small Language Models (SLMs) for edge", "Multi-modal text/vision models"],
        impact: "NLP Engineers bridge the gap between human language and machine understanding, enabling seamless communication with AI.",
        dailyDay: "Monitoring training runs for LLMs, experimenting with prompt strategies, and analyzing model outputs for bias or hallucinations."
      },
      "Autonomous Systems Engineer": {
        ...common,
        concepts: ["Sensor Fusion (LiDAR/Radar/Camera)", "Path Planning Algorithms", "SLAM (Simultaneous Localization and Mapping)", "Control Theory & PID", "Behavior Prediction", "Safety-Critical Software Design", "Robot Operating System (ROS)", "Computer Vision for Navigation", "Simulation Environments", "Motion Planning"],
        languages: ["C++", "Python", "CUDA", "Linux", "MATLAB"],
        softSkills: ["Safety First Mindset", "Extreme Precision", "Interdisciplinary Collaboration", "Risk Management"],
        roadmap: ["Robotics & Control Foundations", "Autonomous Navigation Specialization", "System Integration Expert", "Chief Robotics Architect", "VP of Autonomous Systems"],
        responsibilities: ["Designing navigation and control systems for robots/vehicles", "Implementing SLAM and path planning algorithms", "Integrating multiple sensors for 360-degree awareness", "Developing high-fidelity simulation tests", "Ensuring real-time safety and collision avoidance"],
        interviewPrep: ["Explain the Kalman Filter and its use in robotics.", "What is SLAM and why is it difficult?", "Compare A* and Dijkstra algorithms for path planning.", "How do you handle sensor noise in a real-world environment?", "Describe a safety-critical code review process."],
        marketTrends: ["Autonomous delivery drones", "Level 4 self-driving maturity", "Human-Robot Collaboration (Cobots)"],
        impact: "Autonomous Systems Engineers are moving the world into a future where machines can navigate and assist in any environment.",
        dailyDay: "A mix of simulation testing, low-level C++ debugging, and occasionally working with physical prototypes in the field."
      },
      "Cloud Security Engineer": {
        ...common,
        concepts: ["IAM (Identity & Access Management)", "Cloud Compliance (SOC2/HIPAA)", "Container Security", "Serverless Security", "VPC Flow Log Analysis", "Secrets Management", "Infrastructure as Code Security (tfsec/checkov)", "DevSecOps Integration", "Incident Response in Cloud", "Zero Trust Architecture"],
        languages: ["Python", "Terraform", "Go", "Bash", "YAML", "HCL"],
        softSkills: ["Security First Advocacy", "Attention to Detail", "Pragmatism", "Conflict Resolution"],
        roadmap: ["Cloud Engineering Foundations", "Security Specialization", "Cloud Security Architect", "Principal DevSecOps Engineer", "Director of Cloud Security"],
        responsibilities: ["Securing multi-cloud environments", "Implementing automated security guardrails in CI/CD", "Managing cloud identity and access policies", "Responding to cloud-native security incidents", "Performing security audits on infrastructure as code"],
        interviewPrep: ["How do you secure a S3 bucket / Blob storage?", "Explain the Shared Responsibility Model.", "What are the common security risks in Kubernetes?", "How do you automate IAM least-privilege?", "Describe a cloud-native incident response plan."],
        marketTrends: ["Cloud-Native Application Protection Platforms (CNAPP)", "Agentless security scanning", "Focus on Software Supply Chain Security"],
        impact: "Cloud Security Engineers ensure the world's data remains safe in the ever-expanding cloud ecosystem.",
        dailyDay: "Auditing IAM roles, building automated security scanners for pipelines, and responding to unusual activity alerts in the cloud dashboard."
      },
      "Data Architect": {
        ...common,
        concepts: ["Enterprise Data Strategy", "Data Modeling (Conceptual/Logical/Physical)", "Master Data Management (MDM)", "Data Mesh & Data Fabric", "Database Scalability Patterns", "Data Sovereignty & Privacy", "Data Integration Architectures", "Modern Data Stack Design", "Metadata Management", "Data Lifecycle Policy"],
        languages: ["SQL", "Python", "Java", "ERD Tools", "Snowflake/BigQuery"],
        softSkills: ["Strategic Vision", "Systemic Thinking", "Stakeholder Alignment", "Patience"],
        roadmap: ["Data Engineering Core", "Data Modeling Specialization", "Enterprise Data Architect", "Principal Data Architect", "Chief Data Officer (CDO)"],
        responsibilities: ["Defining the high-level data strategy for the organization", "Designing complex database schemas and integrations", "Ensuring data consistency across distributed systems", "Managing data governance and privacy standards", "Evaluating and selecting data technologies"],
        interviewPrep: ["What is the difference between a Data Lake and a Data Warehouse?", "Describe a Data Mesh architecture.", "How do you handle schema evolution in a global system?", "Explain your process for designing a multi-region data strategy.", "How do you balance data normalization vs performance?"],
        marketTrends: ["Rise of the Data Lakehouse", "Active Metadata Management", "AI-driven data discovery"],
        impact: "Data Architects create the blueprint for how information is captured, stored, and utilized to drive global organizations.",
        dailyDay: "High-level whiteboarding, reviewing database designs for consistency, and meeting with business leaders to align data strategy with company goals."
      },
      "AR/VR Developer": {
        ...common,
        concepts: ["Spatial Computing", "3D Graphics Pipeline", "Computer Vision for Tracking", "Interaction Design (XR)", "Latency Optimization", "Hand & Eye Tracking", "Augmented Reality Frameworks (ARKit/ARCore)", "Unity/Unreal Engine", "Stereoscopic Rendering", "Spatial Audio"],
        languages: ["C#", "C++", "Swift", "TypeScript", "HLSL"],
        softSkills: ["Creative Vision", "User Empathy", "Patience with Hardware", "Rapid Prototyping"],
        roadmap: ["Game Development Foundations", "XR Specialization", "Spatial Computing Engineer", "Technical Director (XR)", "Creative Technologist Lead"],
        responsibilities: ["Building immersive VR and AR experiences", "Optimizing 3D assets for mobile hardware", "Implementing natural interaction models (hand/voice)", "Developing spatial mapping and tracking logic", "Ensuring 90Hz+ performance to prevent motion sickness"],
        interviewPrep: ["How do you optimize 3D rendering for a headset?", "Explain the difference between AR, VR, and MR.", "What is 'World Tracking' and how does it work?", "Describe your process for designing XR interactions.", "How do you handle movement in VR to avoid nausea?"],
        marketTrends: ["Vision Pro and Spatial Computing", "Industrial AR for maintenance", "WebXR for browser-based immersion"],
        impact: "AR/VR Developers are creating the next computing frontier, blending the digital and physical worlds.",
        dailyDay: "Wearing a headset for half the day, debugging spatial coordinate systems, and fine-tuning hand-tracking gestures."
      },
      "Hardware Engineer": {
        ...common,
        concepts: ["PCB Design & Layout", "Circuit Analysis", "FPGA Programming (Verilog/VHDL)", "Digital Signal Processing (DSP)", "Thermal Management", "EMI/EMC Compliance", "Hardware Prototyping", "Power Electronics", "System-on-Chip (SoC) Integration", "Manufacturing (DFM)"],
        languages: ["C", "Verilog", "VHDL", "Python", "Assembly"],
        softSkills: ["Precision", "Patience", "Hands-on Problem Solving", "Analytical Rigor"],
        roadmap: ["Electrical Engineering Mastery", "Digital Systems Design", "Hardware Architect", "Principal Silicon Engineer", "VP of Hardware Engineering"],
        responsibilities: ["Designing and testing electronic circuits and PCBs", "Programming FPGAs for custom high-speed logic", "Testing hardware for reliability and compliance", "Optimizing power and thermal performance", "Collaborating with software teams on system integration"],
        interviewPrep: ["Explain the difference between a Microprocessor and a Microcontroller.", "How do you handle signal integrity in a high-speed PCB?", "Describe a simple circuit to regulate power.", "What is a Finite State Machine in the context of FPGAs?", "How do you debug a hardware failure?"],
        marketTrends: ["Custom AI chips (ASICs)", "Focus on Green/Efficient Electronics", "Integration of IoT at the silicon level"],
        impact: "Hardware Engineers build the physical heart of every technology, from the phone in your pocket to the servers in the cloud.",
        dailyDay: "Working with CAD tools for PCB layouts, using logic analyzers and oscilloscopes, and reviewing hardware manufacturing specifications."
      },
      "QA Lead": {
        ...common,
        concepts: ["Quality Strategy & Planning", "Test Management Tools", "Risk-Based Testing", "CI/CD Integration", "User Acceptance Testing (UAT)", "Defect Lifecycle Management", "Performance & Security Testing Strategy", "Team Leadership & Mentorship", "Quality Metrics & Reporting", "Process Improvement"],
        languages: ["JavaScript", "Python", "SQL", "Jira/Xray"],
        softSkills: ["Leadership", "Advocacy for Quality", "Strategic Planning", "Diplomacy"],
        roadmap: ["QA Automation Experience", "Senior QA Engineer", "QA Lead", "Director of Quality Assurance", "VP of Quality & Reliability"],
        responsibilities: ["Defining the organization's quality strategy", "Managing and mentoring a team of QA engineers", "Overseeing test planning and execution for major releases", "Communicating quality risks to stakeholders", "Driving continuous improvement in testing processes"],
        interviewPrep: ["How do you handle a release with major known bugs?", "Describe your approach to building a QA team from scratch.", "How do you measure the ROI of automation?", "How do you handle conflict between Dev and QA teams?", "What are the most important quality metrics to track?"],
        marketTrends: ["Shift-left and Shift-right testing", "AI in test management", "Focus on Total Quality Management (TQM)"],
        impact: "QA Leads ensure that the products users rely on are stable, secure, and delightful to use.",
        dailyDay: "Mornings in release planning, afternoons mentoring engineers on test strategy, and reviewing automated test results to assess release readiness."
      },
      "Chief Technology Officer (CTO)": {
        ...common,
        concepts: ["Technical Vision & Strategy", "Engineering Culture & Branding", "Organizational Design", "Budgeting & Financial Planning", "Investor Relations", "R&D Strategy", "M&A Technical Due Diligence", "Executive Leadership", "Board Communication", "Long-term Innovation"],
        languages: ["English (Strategic Communication)", "Data Visualisation"],
        softSkills: ["Executive Leadership", "Strategic Vision", "Public Speaking", "Emotional Intelligence", "Negotiation"],
        roadmap: ["Senior Engineering Leadership", "VP of Engineering", "CTO of a Startup", "CTO of an Enterprise", "Board Member / Advisor"],
        responsibilities: ["Defining the long-term technical vision of the company", "Building and scaling a world-class engineering organization", "Aligning technology strategy with business goals", "Representing the company's technology to investors and the public", "Overseeing the R&D budget and technical roadmap"],
        interviewPrep: ["How do you handle a major pivot in company strategy?", "How do you attract top engineering talent in a competitive market?", "Describe your approach to managing technical debt at scale.", "How do you communicate complex tech risks to a non-technical board?", "What is the most important cultural value in an engineering org?"],
        marketTrends: ["Fractional CTOs for startups", "Focus on Sustainability and Green Tech", "AI as a core business driver"],
        impact: "CTOs shape the technological future of organizations, driving innovation that impacts industries and millions of lives.",
        dailyDay: "A high-stakes mix of board meetings, strategic planning, high-level recruiting, and ensuring the engineering culture remains healthy and productive."
      },
    };
    return data[careerTitle] || { 
      ...common,
      concepts: ["Foundational Logic", "Systematic Problem Solving", "Process Optimization", "Industry Tools", "Strategic Planning"],
      languages: ["Industry Standard Software", "Productivity Suites"],
      roadmap: ["Entry Level", "Specialization", "Management", "Executive Leadership"],
      responsibilities: ["Core task execution", "Quality control", "Stakeholder communication", "Strategic planning"],
      interviewPrep: ["Problem-solving case studies", "Behavioral questions"],
      impact: "This role contributes to the core infrastructure and success of the industry.",
      dailyDay: "Managing core operations and ensuring project success through collaboration and technical expertise."
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#050510]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 mb-6" />
        <p className="text-slate-400 font-bold tracking-[0.2em] uppercase text-xs animate-pulse">Accessing Knowledge Vault</p>
      </div>
    );
  }

  return (
    <div className="pb-32 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20 pt-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400">Professional Compendium v2.0</span>
          </div>
          <h1 className="text-7xl font-black text-white tracking-tighter leading-none mb-6">
            Career <span className="gradient-text">Encyclopedia</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl leading-relaxed font-medium mb-6">
            The definitive technical knowledge base for high-growth careers. Explore deep-dive insights, tech stacks, and professional roadmaps.
          </p>
        </motion.div>
        
        <div className="relative w-full lg:w-[450px]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600" />
          <input 
            type="text" 
            placeholder="Search roles, industries, skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border-2 border-white/5 rounded-3xl pl-16 pr-8 py-6 text-lg text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all placeholder:text-slate-700 shadow-2xl"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredCareers.map((career, i) => (
          <motion.div
            key={career.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -8 }}
            className="glass-card p-10 cursor-pointer group hover:bg-indigo-500/[0.03] border-white/5 relative overflow-hidden flex flex-col h-full"
            onClick={() => setSelectedCareer(career)}
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.1] transition-all duration-500 scale-150 -rotate-12 group-hover:rotate-0">
              <Briefcase className="w-48 h-48 text-white" />
            </div>
            
            <div className="relative z-10 flex-1">
              <div className="flex items-center justify-between mb-10">
                <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-indigo-500/40">
                  <Sparkles className="w-8 h-8 text-indigo-400 group-hover:text-white" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 block mb-1">Growth</span>
                  <span className="text-xl font-black text-emerald-400">+{career.growthRate}%</span>
                </div>
              </div>
              
              <h3 className="text-3xl font-black text-white mb-4 tracking-tight group-hover:text-indigo-400 transition-colors leading-tight">{career.title}</h3>
              <p className="text-slate-500 leading-relaxed line-clamp-4 mb-10 text-[0.95rem]">{career.description}</p>
              
              <div className="grid grid-cols-2 gap-6 pt-10 border-t border-white/5">
                <div>
                  <div className="text-[10px] text-slate-600 uppercase font-black tracking-widest mb-2">Salary Ceiling</div>
                  <div className="text-2xl font-black text-white">${(career.salaryMax/1000).toFixed(0)}K</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-600 uppercase font-black tracking-widest mb-2">Market Need</div>
                  <div className="text-lg font-black text-indigo-400 flex items-center justify-end gap-2 uppercase tracking-tighter">
                    <TrendingUp className="w-5 h-5" /> {career.demandLevel}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 flex items-center gap-3 text-indigo-400 text-xs font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
              Access Full Knowledge Base <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* "Huge" Modal Detail View */}
      <AnimatePresence>
        {selectedCareer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#050510]/98 backdrop-blur-2xl" onClick={() => setSelectedCareer(null)} />
            
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[1500px] bg-[#0A0A15] border-t md:border border-white/10 rounded-t-3xl md:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col h-full md:h-[94vh]"
            >
              {/* Top Navigation */}
              <div className="sticky top-0 z-30 p-8 flex items-center justify-between border-b border-white/5 bg-[#0A0A15]/80 backdrop-blur-md">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">{selectedCareer.title}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Compendium Entry #821</span>
                      <div className="w-1 h-1 rounded-full bg-slate-700" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Verified Knowledge</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedCareer(null)} className="p-4 rounded-2xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-3">
                  <span className="text-xs font-black uppercase tracking-widest">Close Compendium</span>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Huge Content Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-20">
                <div className="max-w-6xl mx-auto">
                  
                  {/* Hero Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
                    <div className="lg:col-span-8">
                      <h3 className="text-sm font-black uppercase tracking-[0.4em] text-indigo-400 mb-8">Executive Summary</h3>
                      <h2 className="text-7xl font-black text-white mb-10 tracking-tighter leading-[1.05]">{selectedCareer.title}</h2>
                      <p className="text-3xl text-slate-400 leading-relaxed font-medium mb-12">
                        {selectedCareer.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-4">
                        {getJobKnowledge(selectedCareer.title).pros.map((pro: string) => (
                          <div key={pro} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold">
                            <CheckCircle2 className="w-4 h-4" /> {pro}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="lg:col-span-4">
                      <div className="glass-card p-10 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20 rounded-[2.5rem]">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-10">Market Pulse</h4>
                        <div className="space-y-10">
                          <div>
                            <div className="flex justify-between mb-3 items-end">
                              <span className="text-sm text-slate-400 font-bold">Salary Horizon</span>
                              <span className="text-2xl font-black text-white">${(selectedCareer.salaryMax/1000).toFixed(0)}K</span>
                            </div>
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-gradient-to-r from-indigo-500 to-purple-600" />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-3 items-end">
                              <span className="text-sm text-slate-400 font-bold">Industry Demand</span>
                              <span className="text-2xl font-black text-emerald-400">{selectedCareer.demandLevel}</span>
                            </div>
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-emerald-500" />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-3 items-end">
                              <span className="text-sm text-slate-400 font-bold">AI Disruption Risk</span>
                              <span className="text-2xl font-black text-rose-500">{(selectedCareer.automationRisk*100).toFixed(0)}%</span>
                            </div>
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${selectedCareer.automationRisk*100}%` }} className="h-full bg-rose-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section: The Knowledge Architecture */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
                    <div className="lg:col-span-4">
                      <div className="sticky top-10 space-y-12">
                        <section>
                          <h4 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400 mb-8">Mastery Concepts</h4>
                          <div className="space-y-3">
                            {getJobKnowledge(selectedCareer.title).concepts.map((concept: string, i: number) => (
                              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-indigo-500/5 transition-all">
                                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black text-xs">{i+1}</div>
                                <span className="text-sm text-slate-400 font-bold group-hover:text-white transition-colors">{concept}</span>
                              </div>
                            ))}
                          </div>
                        </section>
                        
                        <section>
                          <h4 className="text-xs font-black uppercase tracking-[0.4em] text-amber-400 mb-8">Resource Library</h4>
                          <div className="space-y-4">
                            {getJobKnowledge(selectedCareer.title).resources.map((res: string) => (
                              <div key={res} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer">
                                <span className="text-sm text-slate-300 font-bold">{res}</span>
                                <ExternalLink className="w-4 h-4 text-amber-500" />
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>
                    </div>

                    <div className="lg:col-span-8 space-y-24">
                      {/* Responsibilities */}
                      <section>
                        <div className="flex items-center gap-4 mb-10">
                          <Workflow className="w-8 h-8 text-indigo-400" />
                          <h3 className="text-4xl font-black text-white tracking-tight">Core Responsibilities</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                          {getJobKnowledge(selectedCareer.title).responsibilities.map((resp: string, i: number) => (
                            <div key={i} className="flex items-start gap-8 p-10 rounded-[2.5rem] bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all group">
                              <div className="text-5xl font-black text-white/5 group-hover:text-indigo-500/20 transition-colors">0{i+1}</div>
                              <p className="text-xl text-slate-300 leading-relaxed font-medium mt-2">{resp}</p>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Tech Stack */}
                      <section>
                        <div className="flex items-center gap-4 mb-10">
                          <Code2 className="w-8 h-8 text-cyan-400" />
                          <h3 className="text-4xl font-black text-white tracking-tight">Technical Stack</h3>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          {getJobKnowledge(selectedCareer.title).languages.map((lang: string) => (
                            <div key={lang} className="px-8 py-5 rounded-[1.5rem] bg-white/[0.03] border border-white/10 text-white font-black text-lg hover:bg-indigo-500 hover:scale-105 transition-all cursor-default shadow-lg">
                              {lang}
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>

                  {/* 10-Year Roadmap - Full Width Section */}
                  <div className="mb-32">
                    <h4 className="text-sm font-black uppercase tracking-[0.4em] text-indigo-400 text-center mb-20">Comprehensive Career Pathway</h4>
                    <div className="relative">
                      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/5 hidden lg:block" />
                      <div className="space-y-20">
                        {getJobKnowledge(selectedCareer.title).roadmap.map((step: any, i: number) => {
                          const stepTitle = typeof step === "string" ? step : step.title;
                          const stepDesc = typeof step === "string" 
                            ? (i === 0 ? "Focus on core fundamentals and mastering the base tools of the trade." :
                               i === 1 ? "Developing deep specialization and taking ownership of complex sub-systems." :
                               i <= 3 ? "Beginning to lead technical initiatives and mentoring junior members of the team." :
                               "Influencing high-level strategy and architecting long-term organizational success.")
                            : step.desc;

                          return (
                            <div key={i} className={`flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-0 ${i % 2 === 0 ? "lg:flex-row-reverse" : ""}`}>
                              <div className="lg:w-[45%] p-10 glass-card rounded-[2.5rem] border-white/10 bg-white/[0.01] hover:bg-indigo-500/[0.02] transition-all">
                                <div className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">Phase 0{i+1}</div>
                                <h5 className="text-2xl font-black text-white mb-4">{stepTitle}</h5>
                                <div className="space-y-4">
                                  <p className="text-slate-300 text-[0.95rem] leading-relaxed font-medium">
                                    {stepDesc}
                                  </p>
                                  <div className="pt-4 border-t border-white/5">
                                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Operational Focus</div>
                                    <p className="text-xs text-slate-500 leading-relaxed italic">
                                      {i === 0 ? "Daily execution and rapid skill acquisition." :
                                       i === 1 ? "Feature ownership and collaborative technical grooming." :
                                       i <= 3 ? "System architecture and team-wide process optimization." :
                                       "Long-term vision alignment and high-stakes decision making."}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center font-black text-2xl z-10 shadow-2xl shadow-indigo-500/40 relative group-hover:scale-110 transition-transform">
                                {i+1}
                              </div>
                              <div className="lg:w-[45%] hidden lg:block" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Daily Life & Interview Prep - Moved Below Roadmap */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
                    <div className="lg:col-span-12 space-y-24">
                      {/* Daily Life */}
                      <section>
                        <div className="flex items-center gap-4 mb-10">
                          <History className="w-8 h-8 text-emerald-400" />
                          <h3 className="text-4xl font-black text-white tracking-tight">A Typical Day</h3>
                        </div>
                        <div className="p-16 rounded-[3rem] bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 border border-white/5 text-3xl text-slate-300 leading-[1.6] italic font-medium">
                          &quot;{getJobKnowledge(selectedCareer.title).dailyDay}&quot;
                        </div>
                      </section>
                      
                      {/* Interview Prep */}
                      <section>
                        <div className="flex items-center gap-4 mb-10">
                          <HelpCircle className="w-8 h-8 text-amber-400" />
                          <h3 className="text-4xl font-black text-white tracking-tight">Interview Masterclass</h3>
                        </div>
                        <div className="space-y-6">
                          {getJobKnowledge(selectedCareer.title).interviewPrep.map((q: string, i: number) => (
                            <div key={i} className="p-10 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 flex items-start gap-8">
                              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-xl shadow-amber-500/20 shrink-0">?</div>
                              <div className="text-2xl font-bold text-white leading-snug">{q}</div>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>

                  {/* Impact & Trends */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
                    <div className="p-12 rounded-[3rem] bg-white/[0.02] border border-white/5">
                      <h4 className="text-sm font-black uppercase tracking-[0.4em] text-indigo-400 mb-8 flex items-center gap-3">
                        <Globe className="w-5 h-5" /> Global Impact
                      </h4>
                      <p className="text-2xl text-slate-300 leading-relaxed font-medium">
                        {getJobKnowledge(selectedCareer.title).impact}
                      </p>
                    </div>
                    <div className="p-12 rounded-[3rem] bg-white/[0.02] border border-white/5">
                      <h4 className="text-sm font-black uppercase tracking-[0.4em] text-emerald-400 mb-8 flex items-center gap-3">
                        <BarChart className="w-5 h-5" /> 2026 Market Trends
                      </h4>
                      <div className="space-y-4">
                        {getJobKnowledge(selectedCareer.title).marketTrends.map((trend: string) => (
                          <div key={trend} className="flex items-center gap-4 text-slate-400 font-bold">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            {trend}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* End of content */}

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
