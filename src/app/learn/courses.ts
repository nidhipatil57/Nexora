export interface Course {
  id: string;
  title: string;
  channel: string;
  url: string;
  duration: string;
  skill: string;
  thumbnail: string;
  progress: number;
  priority: number;
  lastTime?: number;
}

export const curatedCourses: Course[] = [
  // --- Programming & Web Development ---
  { id: "1", title: "Python Full Course for Beginners", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", duration: "4h 26m", skill: "Python", thumbnail: "🐍", progress: 0, priority: 100 },
  { id: "2", title: "JavaScript Tutorial for Beginners", channel: "Programming with Mosh", url: "https://www.youtube.com/watch?v=W6NZ1pN5GNE", duration: "1h", skill: "JavaScript", thumbnail: "📜", progress: 0, priority: 95 },
  { id: "3", title: "React JS Full Tutorial for Beginners", channel: "Academind", url: "https://www.youtube.com/watch?v=Dorf8i6lCuk", duration: "48h", skill: "React", thumbnail: "⚛️", progress: 0, priority: 98 },
  { id: "4", title: "HTML & CSS Full Course", channel: "SuperSimpleDev", url: "https://www.youtube.com/watch?v=G3e-cpL7ofc", duration: "6h", skill: "Web Dev", thumbnail: "🌐", progress: 0, priority: 90 },
  { id: "5", title: "Next.js 14 Tutorial", channel: "Codevolution", url: "https://www.youtube.com/watch?v=wm5gMKuwSYk", duration: "10h", skill: "Next.js", thumbnail: "▲", progress: 0, priority: 94 },
  { id: "6", title: "TypeScript Full Tutorial", channel: "Net Ninja", url: "https://www.youtube.com/watch?v=2pZmKW9-I_k", duration: "5h", skill: "TypeScript", thumbnail: "📘", progress: 0, priority: 85 },
  { id: "7", title: "Node.js Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=Oe421EPjeBE", duration: "8h", skill: "Node.js", thumbnail: "🟢", progress: 0, priority: 80 },
  { id: "8", title: "Express JS Crash Course", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=L72fhGm1tfE", duration: "1h 30m", skill: "Backend", thumbnail: "🚂", progress: 0, priority: 70 },
  { id: "9", title: "Java Full Course", channel: "Bro Code", url: "https://www.youtube.com/watch?v=xk4_1adKOAk", duration: "12h", skill: "Java", thumbnail: "☕", progress: 0, priority: 75 },
  { id: "10", title: "C++ Full Course for Beginners", channel: "FreeCodeCamp", url: "https://www.youtube.com/watch?v=vLnPwxZdW4Y", duration: "31h", skill: "C++", thumbnail: "🔧", progress: 0, priority: 70 },
  { id: "11", title: "C# Full Course", channel: "FreeCodeCamp", url: "https://www.youtube.com/watch?v=GhQdlIFylQ8", duration: "4h", skill: "C#", thumbnail: "💎", progress: 0, priority: 70 },
  { id: "12", title: "Go Programming Tutorial", channel: "Derek Banas", url: "https://www.youtube.com/watch?v=YsS8re6D_3E", duration: "2h", skill: "Golang", thumbnail: "🐹", progress: 0, priority: 65 },
  { id: "13", title: "Rust Programming Course", channel: "FreeCodeCamp", url: "https://www.youtube.com/watch?v=MsocPEZBd-M", duration: "13h", skill: "Rust", thumbnail: "🦀", progress: 0, priority: 65 },
  { id: "14", title: "PHP Full Course", channel: "Dani Krossing", url: "https://www.youtube.com/watch?v=OK_JCtrrv-c", duration: "5h", skill: "PHP", thumbnail: "🐘", progress: 0, priority: 60 },
  { id: "15", title: "Ruby on Rails Tutorial", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=fmyvWz5mS1A", duration: "1h 20m", skill: "Ruby", thumbnail: "💎", progress: 0, priority: 60 },

  // --- Data Science & AI ---
  { id: "16", title: "Machine Learning Full Course", channel: "Simplilearn", url: "https://www.youtube.com/watch?v=GwIo3gDZCVQ", duration: "11h", skill: "AI/ML", thumbnail: "🤖", progress: 0, priority: 100 },
  { id: "17", title: "Deep Learning with PyTorch", channel: "FreeCodeCamp", url: "https://www.youtube.com/watch?v=GIsg-ZUy0MY", duration: "25h", skill: "Deep Learning", thumbnail: "🧠", progress: 0, priority: 95 },
  { id: "18", title: "Data Science Full Course", channel: "Edureka", url: "https://www.youtube.com/watch?v=-ETQ97mXXF0", duration: "10h", skill: "Data Science", thumbnail: "📊", progress: 0, priority: 98 },
  { id: "19", title: "Artificial Intelligence Tutorial", channel: "Intellipaat", url: "https://www.youtube.com/watch?v=2ePf9rue1Ao", duration: "12h", skill: "AI", thumbnail: "🦾", progress: 0, priority: 92 },
  { id: "20", title: "Statistics for Data Science", channel: "StatQuest", url: "https://www.youtube.com/watch?v=xxpc-HPKN28", duration: "6h", skill: "Statistics", thumbnail: "📈", progress: 0, priority: 85 },
  { id: "21", title: "Natural Language Processing (NLP)", channel: "Krish Naik", url: "https://www.youtube.com/watch?v=X2vAhuuK0CE", duration: "4h", skill: "NLP", thumbnail: "🗣️", progress: 0, priority: 88 },
  { id: "22", title: "Computer Vision with OpenCV", channel: "FreeCodeCamp", url: "https://www.youtube.com/watch?v=oXlwWbaGe6U", duration: "4h", skill: "Computer Vision", thumbnail: "👁️", progress: 0, priority: 80 },
  { id: "23", title: "Big Data Full Course", channel: "Simplilearn", url: "https://www.youtube.com/watch?v=bAyrObl7TYE", duration: "9h", skill: "Big Data", thumbnail: "💾", progress: 0, priority: 75 },
  { id: "24", title: "Tableau Full Course", channel: "FreeCodeCamp", url: "https://www.youtube.com/watch?v=TPRlZzqy7TY", duration: "2h", skill: "Data Viz", thumbnail: "🖼️", progress: 0, priority: 70 },
  { id: "25", title: "Power BI Tutorial", channel: "Kevin Stratvert", url: "https://www.youtube.com/watch?v=TmhQCQr_DCA", duration: "1h", skill: "Business Intelligence", thumbnail: "📊", progress: 0, priority: 70 },

  // --- Mobile Development ---
  { id: "26", title: "Flutter Full Course", channel: "Academind", url: "https://www.youtube.com/watch?v=x0uinJvhNxI", duration: "30h", skill: "Flutter", thumbnail: "📱", progress: 0, priority: 75 },
  { id: "27", title: "React Native Tutorial", channel: "Programming with Mosh", url: "https://www.youtube.com/watch?v=0-S5a0eXPoc", duration: "2h", skill: "React Native", thumbnail: "⚛️", progress: 0, priority: 80 },
  { id: "28", title: "SwiftUI Full Course", channel: "Chris Sean", url: "https://www.youtube.com/watch?v=TzNPh9oE8yM", duration: "5h", skill: "iOS Dev", thumbnail: "🍎", progress: 0, priority: 70 },
  { id: "29", title: "Android Development (Kotlin)", channel: "Philipp Lackner", url: "https://www.youtube.com/watch?v=fis26HIdwII", duration: "12h", skill: "Android Dev", thumbnail: "🤖", progress: 0, priority: 70 },
  { id: "30", title: "Ionic Framework Tutorial", channel: "DesignCourse", url: "https://www.youtube.com/watch?v=f2vO6zS3UuM", duration: "2h", skill: "Hybrid Apps", thumbnail: "📱", progress: 0, priority: 50 },

  // --- Cloud & DevOps ---
  { id: "31", title: "AWS Cloud Practitioner Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=SOTamWNgDKc", duration: "14h", skill: "AWS", thumbnail: "☁️", progress: 0, priority: 85 },
  { id: "32", title: "Docker & Kubernetes Full Course", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", duration: "4h", skill: "DevOps", thumbnail: "🐳", progress: 0, priority: 90 },
  { id: "33", title: "Azure Fundamentals (AZ-900)", channel: "Adam Marczak", url: "https://www.youtube.com/watch?v=NPEsD6n9A_I", duration: "10h", skill: "Azure", thumbnail: "🌩️", progress: 0, priority: 80 },
  { id: "34", title: "Google Cloud (GCP) Tutorial", channel: "FreeCodeCamp", url: "https://www.youtube.com/watch?v=jpnoX-ZuyvI", duration: "6h", skill: "GCP", thumbnail: "☁️", progress: 0, priority: 80 },
  { id: "35", title: "Terraform Crash Course", channel: "HashiCorp", url: "https://www.youtube.com/watch?v=SLB_c_ayRmc", duration: "2h", skill: "IaC", thumbnail: "🏗️", progress: 0, priority: 75 },
  { id: "36", title: "Jenkins Full Course", channel: "Simplilearn", url: "https://www.youtube.com/watch?v=LFDrDnKPOTg", duration: "3h", skill: "CI/CD", thumbnail: "🏗️", progress: 0, priority: 70 },
  { id: "37", title: "Ansible for Beginners", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=E_u7yCdfuXw", duration: "1h 30m", skill: "Automation", thumbnail: "🤖", progress: 0, priority: 65 },
  { id: "38", title: "Linux for Beginners", channel: "NetworkChuck", url: "https://www.youtube.com/watch?v=sWbUDq4S6Yw", duration: "8h", skill: "Linux", thumbnail: "🐧", progress: 0, priority: 80 },

  // --- Cyber Security ---
  { id: "39", title: "Cyber Security Full Course", channel: "Simplilearn", url: "https://www.youtube.com/watch?v=nzj7Wg46lsA", duration: "12h", skill: "Cyber Security", thumbnail: "🛡️", progress: 0, priority: 97 },
  { id: "40", title: "Ethical Hacking Tutorial", channel: "Edureka", url: "https://www.youtube.com/watch?v=fNzpcB7ODxQ", duration: "10h", skill: "Hacking", thumbnail: "🕵️", progress: 0, priority: 85 },
  { id: "41", title: "CompTIA Security+ (SY0-601)", channel: "Professor Messer", url: "https://www.youtube.com/watch?v=977f6Z70vKk", duration: "15h", skill: "Security+", thumbnail: "🔐", progress: 0, priority: 80 },
  { id: "42", title: "Network Security Crash Course", channel: "FreeCodeCamp", url: "https://www.youtube.com/watch?v=X3a_vjJ7HjI", duration: "4h", skill: "Networking", thumbnail: "🌐", progress: 0, priority: 75 },
  { id: "43", title: "Cryptography for Beginners", channel: "Khan Academy", url: "https://www.youtube.com/watch?v=ZghMPWGXexs", duration: "2h", skill: "Cryptography", thumbnail: "🔑", progress: 0, priority: 70 },

  // --- UI/UX & Design ---
  { id: "44", title: "UI/UX Design Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=68w2VwalD5w", duration: "14h", skill: "UI/UX Design", thumbnail: "🎨", progress: 0, priority: 96 },
  { id: "45", title: "Figma for Beginners", channel: "DesignCourse", url: "https://www.youtube.com/watch?v=FTFaQW69Zas", duration: "2h", skill: "Figma", thumbnail: "🎨", progress: 0, priority: 85 },
  { id: "46", title: "Adobe XD Tutorial", channel: "Bring Your Own Laptop", url: "https://www.youtube.com/watch?v=WEljsc2jqzc", duration: "3h", skill: "Adobe XD", thumbnail: "📐", progress: 0, priority: 70 },
  { id: "47", title: "Web Design Principles", channel: "Flux Academy", url: "https://www.youtube.com/watch?v=S2fF_XatFp8", duration: "1h 30m", skill: "Web Design", thumbnail: "✨", progress: 0, priority: 75 },
  { id: "48", title: "Graphic Design Full Course", channel: "Gareth David", url: "https://www.youtube.com/watch?v=9EGI-HhN-7Y", duration: "10h", skill: "Graphic Design", thumbnail: "🖌️", progress: 0, priority: 70 },
  { id: "49", title: "3D Modeling in Blender", channel: "Blender Guru", url: "https://www.youtube.com/watch?v=TPrnSACiTJ4", duration: "5h", skill: "3D Design", thumbnail: "🧊", progress: 0, priority: 60 },

  // --- Business & Marketing ---
  { id: "50", title: "Digital Marketing Full Course", channel: "Simplilearn", url: "https://www.youtube.com/watch?v=nU-IIXBWlS4", duration: "10h", skill: "Marketing", thumbnail: "📢", progress: 0, priority: 90 },
  { id: "51", title: "SEO Full Course", channel: "Ahrefs", url: "https://www.youtube.com/watch?v=xsVTqzratPs", duration: "2h", skill: "SEO", thumbnail: "🔍", progress: 0, priority: 85 },
  { id: "52", title: "Content Marketing Tutorial", channel: "HubSpot", url: "https://www.youtube.com/watch?v=8p9vW3p_K8o", duration: "3h", skill: "Content", thumbnail: "📝", progress: 0, priority: 80 },
  { id: "53", title: "Social Media Marketing", channel: "Neil Patel", url: "https://www.youtube.com/watch?v=zJg5nL6z7Kk", duration: "1h 30m", skill: "SMM", thumbnail: "📱", progress: 0, priority: 80 },
  { id: "54", title: "Project Management Full Course", channel: "Simplilearn", url: "https://www.youtube.com/watch?v=mD07fR7pYjY", duration: "9h", skill: "Project Management", thumbnail: "📅", progress: 0, priority: 85 },
  { id: "55", title: "Agile & Scrum Full Course", channel: "Udacity", url: "https://www.youtube.com/watch?v=XU0llRltySI", duration: "3h", skill: "Agile", thumbnail: "🏃", progress: 0, priority: 80 },
  { id: "56", title: "Business Analysis Tutorial", channel: "Bridging the Gap", url: "https://www.youtube.com/watch?v=e-73pAofR2U", duration: "4h", skill: "Business Analysis", thumbnail: "💼", progress: 0, priority: 75 },
  { id: "57", title: "Financial Literacy", channel: "Graham Stephan", url: "https://www.youtube.com/watch?v=H7m_pX0k5wM", duration: "2h", skill: "Finance", thumbnail: "💰", progress: 0, priority: 85 },

  // --- Soft Skills & Personal Development ---
  { id: "58", title: "Communication Skills Training", channel: "Practical Psychology", url: "https://www.youtube.com/watch?v=HAnw168huqA", duration: "1h", skill: "Communication", thumbnail: "🗣️", progress: 0, priority: 70 },
  { id: "59", title: "Leadership Skills Full Course", channel: "Brian Tracy", url: "https://www.youtube.com/watch?v=H77O8hB6_k8", duration: "2h", skill: "Leadership", thumbnail: "👑", progress: 0, priority: 75 },
  { id: "60", title: "Time Management Masterclass", channel: "Ali Abdaal", url: "https://www.youtube.com/watch?v=iONDebHX9qk", duration: "1h", skill: "Productivity", thumbnail: "⏱️", progress: 0, priority: 70 },
  { id: "61", title: "Emotional Intelligence", channel: "The School of Life", url: "https://www.youtube.com/watch?v=LgUCyWhJf6s", duration: "2h", skill: "EQ", thumbnail: "🧠", progress: 0, priority: 70 },
  { id: "62", title: "Public Speaking for Beginners", channel: "TED", url: "https://www.youtube.com/watch?v=80V_zR1U8C0", duration: "1h", skill: "Public Speaking", thumbnail: "🎙️", progress: 0, priority: 65 },
  { id: "63", title: "Problem Solving Techniques", channel: "Sprouts", url: "https://www.youtube.com/watch?v=vgVKK_N4v0w", duration: "1h", skill: "Critical Thinking", thumbnail: "🧩", progress: 0, priority: 65 },

  // --- Game Development ---
  { id: "64", title: "Unity Game Dev Full Course", channel: "Brackeys", url: "https://www.youtube.com/watch?v=j48LtUkZRjU", duration: "5h", skill: "Unity", thumbnail: "🎮", progress: 0, priority: 75 },
  { id: "65", title: "Unreal Engine 5 for Beginners", channel: "Unreal Engine", url: "https://www.youtube.com/watch?v=gQmiqmxPaVU", duration: "10h", skill: "UE5", thumbnail: "🎮", progress: 0, priority: 75 },
  { id: "66", title: "Godot Engine Tutorial", channel: "GDQuest", url: "https://www.youtube.com/watch?v=LOhfqjrsViw", duration: "3h", skill: "Godot", thumbnail: "🤖", progress: 0, priority: 65 },
  { id: "67", title: "Pygame Tutorial", channel: "Clear Code", url: "https://www.youtube.com/watch?v=AY9MnQ4x3zk", duration: "6h", skill: "Game Design", thumbnail: "🐍", progress: 0, priority: 60 },

  // --- Advanced & Specialized ---
  { id: "68", title: "Blockchain Full Course", channel: "Simplilearn", url: "https://www.youtube.com/watch?v=QCvL-DW5q6M", duration: "8h", skill: "Blockchain", thumbnail: "⛓️", progress: 0, priority: 75 },
  { id: "69", title: "Solidity & Smart Contracts", channel: "Patrick Collins", url: "https://www.youtube.com/watch?v=M576WGiDBdQ", duration: "32h", skill: "Web3", thumbnail: "📜", progress: 0, priority: 80 },
  { id: "70", title: "Quantum Computing for Everyone", channel: "Domain of Science", url: "https://www.youtube.com/watch?v=QuR8Li_n5as", duration: "1h", skill: "Quantum", thumbnail: "⚛️", progress: 0, priority: 60 },
  { id: "71", title: "AR/VR Development", channel: "Dilmer Valecillos", url: "https://www.youtube.com/watch?v=uK1XW-48Aok", duration: "4h", skill: "AR/VR", thumbnail: "🕶️", progress: 0, priority: 65 },
  { id: "72", title: "Hardware Hacking with Arduino", channel: "GreatScott!", url: "https://www.youtube.com/watch?v=fJWR7dBuc18", duration: "2h", skill: "IoT", thumbnail: "📟", progress: 0, priority: 60 },

  // --- Adding More (To reach 100+) ---
  { id: "73", title: "C Programming Course", channel: "FreeCodeCamp", url: "https://www.youtube.com/watch?v=KJgsSFOSQv0", duration: "4h", skill: "C", thumbnail: "💻", progress: 0, priority: 60 },
  { id: "74", title: "Django Tutorial for Beginners", channel: "Corey Schafer", url: "https://www.youtube.com/watch?v=UmljXZEHS68", duration: "8h", skill: "Django", thumbnail: "🎸", progress: 0, priority: 75 },
  { id: "75", title: "Vue.js 3 Full Course", channel: "Net Ninja", url: "https://www.youtube.com/watch?v=YrxBCBibVo0", duration: "4h", skill: "Vue.js", thumbnail: "🖖", progress: 0, priority: 70 },
  { id: "76", title: "Tailwind CSS Tutorial", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=UBOj6rqRUME", duration: "2h", skill: "Tailwind", thumbnail: "🌊", progress: 0, priority: 75 },
  { id: "77", title: "GraphQL Crash Course", channel: "Web Dev Simplified", url: "https://www.youtube.com/watch?v=93v5fO-A9U0", duration: "1h", skill: "GraphQL", thumbnail: "🕸️", progress: 0, priority: 70 },
  { id: "78", title: "MongoDB Full Course", channel: "FreeCodeCamp", url: "https://www.youtube.com/watch?v=ofme2o29ngU", duration: "2h", skill: "MongoDB", thumbnail: "🍃", progress: 0, priority: 70 },
  { id: "79", title: "Redis for Beginners", channel: "Hussein Nasser", url: "https://www.youtube.com/watch?v=G1Ynt6S6Ucg", duration: "1h", skill: "Redis", thumbnail: "🔴", progress: 0, priority: 65 },
  { id: "80", title: "Kubernetes in 1 Hour", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=PH-2FfFD2PU", duration: "1h", skill: "Kubernetes", thumbnail: "☸️", progress: 0, priority: 80 },
  { id: "81", title: "Prometheus & Grafana", channel: "The Digital Life", url: "https://www.youtube.com/watch?v=h4Sl21AK9fU", duration: "2h", skill: "Monitoring", thumbnail: "📈", progress: 0, priority: 65 },
  { id: "82", title: "Apache Kafka Course", channel: "Confluent", url: "https://www.youtube.com/watch?v=06iPUH63tS4", duration: "3h", skill: "Kafka", thumbnail: "📬", progress: 0, priority: 65 },
  { id: "83", title: "Elasticsearch for Beginners", channel: "Official Elasticsearch", url: "https://www.youtube.com/watch?v=gS_nHTWZEJ8", duration: "1h", skill: "Search", thumbnail: "🔍", progress: 0, priority: 60 },
  { id: "84", title: "PWA Tutorial", channel: "Net Ninja", url: "https://www.youtube.com/watch?v=IAZidZfT6Rk", duration: "3h", skill: "PWA", thumbnail: "📲", progress: 0, priority: 60 },
  { id: "85", title: "WebAssembly (Wasm)", channel: "Computerphile", url: "https://www.youtube.com/watch?v=vVjSshUu2YI", duration: "1h", skill: "Wasm", thumbnail: "🕸️", progress: 0, priority: 55 },
  { id: "86", title: "Microservices Architecture", channel: "Defog Tech", url: "https://www.youtube.com/watch?v=CdBtNQZH8a4", duration: "2h", skill: "Microservices", thumbnail: "🧱", progress: 0, priority: 70 },
  { id: "87", title: "GraphQL vs REST", channel: "Hitesh Choudhary", url: "https://www.youtube.com/watch?v=yWzKJPw_VzM", duration: "30m", skill: "API Design", thumbnail: "🔌", progress: 0, priority: 65 },
  { id: "88", title: "GitLab CI/CD", channel: "TechWorld with Nana", url: "https://www.youtube.com/watch?v=jwM6X_VvOIs", duration: "2h", skill: "CI/CD", thumbnail: "🦊", progress: 0, priority: 70 },
  { id: "89", title: "PostgreSQL Tutorial", channel: "FreeCodeCamp", url: "https://www.youtube.com/watch?v=qw--VYLpxG4", duration: "4h", skill: "Postgres", thumbnail: "🐘", progress: 0, priority: 75 },
  { id: "90", title: "Nginx for Beginners", channel: "Hussein Nasser", url: "https://www.youtube.com/watch?v=7VAI73roXaY", duration: "1h", skill: "Nginx", thumbnail: "🚀", progress: 0, priority: 65 },
  { id: "91", title: "FastAPI Course", channel: "FreeCodeCamp", url: "https://www.youtube.com/watch?v=7t2alSnE2-I", duration: "3h", skill: "FastAPI", thumbnail: "⚡", progress: 0, priority: 75 },
  { id: "92", title: "Pandas for Data Science", channel: "Keith Galli", url: "https://www.youtube.com/watch?v=vmEHCJofslg", duration: "1h", skill: "Pandas", thumbnail: "🐼", progress: 0, priority: 80 },
  { id: "93", title: "NumPy Tutorial", channel: "FreeCodeCamp", url: "https://www.youtube.com/watch?v=QUT1VHiLmmI", duration: "1h", skill: "NumPy", thumbnail: "🔢", progress: 0, priority: 80 },
  { id: "94", title: "Matplotlib Crash Course", channel: "Sentdex", url: "https://www.youtube.com/watch?v=q7Bo_689sqM", duration: "1h", skill: "Matplotlib", thumbnail: "📊", progress: 0, priority: 75 },
  { id: "95", title: "Seaborn for Visualization", channel: "Derek Banas", url: "https://www.youtube.com/watch?v=6GUc3_Y2O_w", duration: "1h", skill: "Seaborn", thumbnail: "📊", progress: 0, priority: 75 },
  { id: "96", title: "Scikit-Learn Tutorial", channel: "Programming with Mosh", url: "https://www.youtube.com/watch?v=hDLn92u7kZc", duration: "1h", skill: "Scikit-Learn", thumbnail: "🤖", progress: 0, priority: 85 },
  { id: "97", title: "TensorFlow 2.0 Tutorial", channel: "Jeff Heaton", url: "https://www.youtube.com/watch?v=3KzRChvVvG0", duration: "5h", skill: "TensorFlow", thumbnail: "🧠", progress: 0, priority: 85 },
  { id: "98", title: "Keras for Deep Learning", channel: "DeepLizard", url: "https://www.youtube.com/watch?v=qFJeN9V1zsI", duration: "3h", skill: "Keras", thumbnail: "🧠", progress: 0, priority: 80 },
  { id: "99", title: "R Programming Full Course", channel: "FreeCodeCamp", url: "https://www.youtube.com/watch?v=_V8eKsto3Ug", duration: "2h", skill: "R", thumbnail: "📉", progress: 0, priority: 65 },
  { id: "100", title: "SQL Server Full Course", channel: "Simplilearn", url: "https://www.youtube.com/watch?v=p3qvj9hO_Bo", duration: "5h", skill: "SQL Server", thumbnail: "🗄️", progress: 0, priority: 70 },
  { id: "101", title: "NoSQL Databases Explained", channel: "Fireship", url: "https://www.youtube.com/watch?v=0buKQHokLK8", duration: "10m", skill: "Databases", thumbnail: "💾", progress: 0, priority: 65 },
  { id: "102", title: "Web Scraping with BeautifulSoup", channel: "FreeCodeCamp", url: "https://www.youtube.com/watch?v=XVv6mJpFUt0", duration: "2h", skill: "Web Scraping", thumbnail: "🕷️", progress: 0, priority: 75 },
  { id: "103", title: "Selenium Automation Course", channel: "Edureka", url: "https://www.youtube.com/watch?v=Xjx_9_Z6N4g", duration: "10h", skill: "Testing", thumbnail: "🤖", progress: 0, priority: 70 },
  { id: "104", title: "JMeter for Performance Testing", channel: "SDET-QA", url: "https://www.youtube.com/watch?v=cvL-dY5pY8w", duration: "2h", skill: "Performance", thumbnail: "⏱️", progress: 0, priority: 60 },
  { id: "105", title: "Postman API Testing", channel: "Valentin Despa", url: "https://www.youtube.com/watch?v=VyWxIQ2ZXTM", duration: "1h", skill: "API Testing", thumbnail: "📬", progress: 0, priority: 70 },
  { id: "106", title: "Cypress Tutorial", channel: "Academy of Quality", url: "https://www.youtube.com/watch?v=u8vMu796Y8M", duration: "2h", skill: "Cypress", thumbnail: "🌲", progress: 0, priority: 75 },
  { id: "107", title: "Go Testing", channel: "Jon Calhoun", url: "https://www.youtube.com/watch?v=hVFEV-iN7pg", duration: "1h", skill: "Testing", thumbnail: "🐹", progress: 0, priority: 60 },
  { id: "108", title: "Design Patterns in Java", channel: "Derek Banas", url: "https://www.youtube.com/watch?v=vNHpsC5ng_E", duration: "10h", skill: "Java", thumbnail: "🧱", progress: 0, priority: 70 },
  { id: "109", title: "Clean Code with Python", channel: "ArjanCodes", url: "https://www.youtube.com/watch?v=XInN_vI6jIA", duration: "30m", skill: "Python", thumbnail: "✨", progress: 0, priority: 80 },
  { id: "110", title: "Refactoring in JS", channel: "Web Dev Simplified", url: "https://www.youtube.com/watch?v=P_XfV3HjW6Y", duration: "30m", skill: "JavaScript", thumbnail: "🛠️", progress: 0, priority: 80 },
  { id: "111", title: "TDD Tutorial", channel: "Fun Fun Function", url: "https://www.youtube.com/watch?v=Eu35xM76kKY", duration: "1h", skill: "Testing", thumbnail: "🧪", progress: 0, priority: 70 },
  { id: "112", title: "Solid Principles", channel: "S.O.L.I.D.", url: "https://www.youtube.com/watch?v=pTB30aXS77U", duration: "30m", skill: "Architecture", thumbnail: "🧱", progress: 0, priority: 75 },

  // --- Python Expansion ---
  { id: "113", title: "Python for Data Science", channel: "IBM Technology", url: "https://www.youtube.com/watch?v=689D-E_6rQA", duration: "2h", skill: "Python", thumbnail: "🐍", progress: 0, priority: 90 },
  { id: "114", title: "Intermediate Python Tutorial", channel: "Patrick Loeber", url: "https://www.youtube.com/watch?v=HGOBQPFzWKo", duration: "5h", skill: "Python", thumbnail: "🐍", progress: 0, priority: 85 },
  { id: "115", title: "Python Automation Projects", channel: "Tech With Tim", url: "https://www.youtube.com/watch?v=vVjSshUu2YI", duration: "3h", skill: "Python", thumbnail: "🐍", progress: 0, priority: 80 },
  { id: "116", title: "Python Backend Development", channel: "Amigoscode", url: "https://www.youtube.com/watch?v=W00vW_T-9-Y", duration: "4h", skill: "Python", thumbnail: "🐍", progress: 0, priority: 80 },

  // --- JavaScript Expansion ---
  { id: "117", title: "Modern JavaScript (ES6+)", channel: "The Net Ninja", url: "https://www.youtube.com/watch?v=NCwa_xi0Uuc", duration: "4h", skill: "JavaScript", thumbnail: "📜", progress: 0, priority: 90 },
  { id: "118", title: "JS Engine Explained", channel: "JS Conf", url: "https://www.youtube.com/watch?v=p-iiEDtStig", duration: "1h", skill: "JavaScript", thumbnail: "📜", progress: 0, priority: 75 },
  { id: "119", title: "Asynchronous JS", channel: "Web Dev Simplified", url: "https://www.youtube.com/watch?v=V_Kr9OSfDeU", duration: "2h", skill: "JavaScript", thumbnail: "📜", progress: 0, priority: 85 },
  { id: "120", title: "Vanilla JS Projects", channel: "John Smilga", url: "https://www.youtube.com/watch?v=3PHXvlpOkf4", duration: "8h", skill: "JavaScript", thumbnail: "📜", progress: 0, priority: 80 },

  // --- React Expansion ---
  { id: "121", title: "React Design Patterns", channel: "Web Dev Simplified", url: "https://www.youtube.com/watch?v=V_Kr9OSfDeU", duration: "2h", skill: "React", thumbnail: "⚛️", progress: 0, priority: 85 },
  { id: "122", title: "State Management with Redux", channel: "Codevolution", url: "https://www.youtube.com/watch?v=93p3QA5f_9s", duration: "5h", skill: "React", thumbnail: "⚛️", progress: 0, priority: 80 },
  { id: "123", title: "React Query Crash Course", channel: "Laith Academy", url: "https://www.youtube.com/watch?v=VtWk_7pIayM", duration: "1h", skill: "React", thumbnail: "⚛️", progress: 0, priority: 85 },
  { id: "124", title: "Fullstack React & Next.js", channel: "JavaScript Mastery", url: "https://www.youtube.com/watch?v=pPn9vL-3k9g", duration: "12h", skill: "React", thumbnail: "⚛️", progress: 0, priority: 95 },

  // --- AI/ML Expansion ---
  { id: "125", title: "Generative AI for Beginners", channel: "Google Cloud", url: "https://www.youtube.com/watch?v=GIsg-ZUy0MY", duration: "1h", skill: "AI/ML", thumbnail: "🤖", progress: 0, priority: 95 },
  { id: "126", title: "Building LLM Apps with LangChain", channel: "Data Independent", url: "https://www.youtube.com/watch?v=1bUy-1hGZpI", duration: "3h", skill: "AI/ML", thumbnail: "🤖", progress: 0, priority: 95 },
  { id: "127", title: "Neural Networks from Scratch", channel: "Sentdex", url: "https://www.youtube.com/watch?v=Wo5dMEP_BbI", duration: "10h", skill: "AI/ML", thumbnail: "🤖", progress: 0, priority: 90 },
  { id: "128", title: "AI Ethics & Safety", channel: "Microsoft", url: "https://www.youtube.com/watch?v=uWn-pS_O-I4", duration: "2h", skill: "AI/ML", thumbnail: "🤖", progress: 0, priority: 80 },

  // --- AWS Expansion ---
  { id: "129", title: "AWS Solutions Architect", channel: "DigitalCloud", url: "https://www.youtube.com/watch?v=Ia-UEYYR44s", duration: "20h", skill: "AWS", thumbnail: "☁️", progress: 0, priority: 90 },
  { id: "130", title: "Serverless on AWS", channel: "Marcia Villalba", url: "https://www.youtube.com/watch?v=G66S-Xl3jDk", duration: "5h", skill: "AWS", thumbnail: "☁️", progress: 0, priority: 85 },
  { id: "131", title: "AWS Security Specialist", channel: "A Cloud Guru", url: "https://www.youtube.com/watch?v=Yp69P8_P6mU", duration: "8h", skill: "AWS", thumbnail: "☁️", progress: 0, priority: 80 },

  // --- UI/UX Expansion ---
  { id: "132", title: "Typography in UI Design", channel: "DesignCourse", url: "https://www.youtube.com/watch?v=Ia-UEYYR44s", duration: "1h", skill: "UI/UX Design", thumbnail: "🎨", progress: 0, priority: 75 },
  { id: "133", title: "Color Theory for Designers", channel: "The Futur", url: "https://www.youtube.com/watch?v=pPn9vL-3k9g", duration: "2h", skill: "UI/UX Design", thumbnail: "🎨", progress: 0, priority: 75 },
  { id: "134", title: "UX Research Methods", channel: "Google Design", url: "https://www.youtube.com/watch?v=VtWk_7pIayM", duration: "3h", skill: "UI/UX Design", thumbnail: "🎨", progress: 0, priority: 80 },

  // --- Business & Marketing Expansion ---
  { id: "138", title: "MBA in 30 Minutes", channel: "Chris Haroun", url: "https://www.youtube.com/watch?v=Ia-UEYYR44s", duration: "30m", skill: "Business", thumbnail: "💼", progress: 0, priority: 95 },
  { id: "139", title: "Strategic Management", channel: "GreggU", url: "https://www.youtube.com/watch?v=pPn9vL-3k9g", duration: "2h", skill: "Business", thumbnail: "📈", progress: 0, priority: 90 },
  { id: "140", title: "Supply Chain Management", channel: "Edmerls", url: "https://www.youtube.com/watch?v=VtWk_7pIayM", duration: "3h", skill: "Business", thumbnail: "🚚", progress: 0, priority: 85 },
  { id: "141", title: "Human Resource Management", channel: "GreggU", url: "https://www.youtube.com/watch?v=689D-E_6rQA", duration: "2h", skill: "Business", thumbnail: "🤝", progress: 0, priority: 80 },

  // --- Cryptography & Blockchain Expansion ---
  { id: "142", title: "Advanced Cryptography", channel: "Coursera", url: "https://www.youtube.com/watch?v=HGOBQPFzWKo", duration: "10h", skill: "Cryptography", thumbnail: "🔑", progress: 0, priority: 91 },
  { id: "143", title: "Zero Knowledge Proofs", channel: "ZkHack", url: "https://www.youtube.com/watch?v=vVjSshUu2YI", duration: "2h", skill: "Cryptography", thumbnail: "🔑", progress: 0, priority: 85 },
  { id: "144", title: "Quantum Cryptography", channel: "Domain of Science", url: "https://www.youtube.com/watch?v=W00vW_T-9-Y", duration: "1h", skill: "Cryptography", thumbnail: "🔑", progress: 0, priority: 80 },

  // --- Healthcare & Medicine ---
  { id: "145", title: "Medical Terminology", channel: "Ninja Nerd", url: "https://www.youtube.com/watch?v=NCwa_xi0Uuc", duration: "2h", skill: "Healthcare", thumbnail: "🏥", progress: 0, priority: 75 },
  { id: "146", title: "Human Anatomy Full Course", channel: "Kenhub", url: "https://www.youtube.com/watch?v=p-iiEDtStig", duration: "15h", skill: "Healthcare", thumbnail: "🫀", progress: 0, priority: 90 },
  { id: "147", title: "Public Health 101", channel: "Global Health", url: "https://www.youtube.com/watch?v=V_Kr9OSfDeU", duration: "2h", skill: "Healthcare", thumbnail: "🌍", progress: 0, priority: 80 },
  { id: "148", title: "Nursing Basics", channel: "RegisteredNurseRN", url: "https://www.youtube.com/watch?v=3PHXvlpOkf4", duration: "5h", skill: "Healthcare", thumbnail: "🩺", progress: 0, priority: 75 },

  // --- Law & Legal ---
  { id: "149", title: "Introduction to Law", channel: "The Law Simplified", url: "https://www.youtube.com/watch?v=93p3QA5f_9s", duration: "1h", skill: "Law", thumbnail: "⚖️", progress: 0, priority: 88 },
  { id: "150", title: "Contract Law Tutorial", channel: "Law Lessons", url: "https://www.youtube.com/watch?v=VtWk_7pIayM", duration: "2h", skill: "Law", thumbnail: "📜", progress: 0, priority: 80 },
  { id: "151", title: "Criminal Law Basics", channel: "Legal Eagle", url: "https://www.youtube.com/watch?v=pPn9vL-3k9g", duration: "3h", skill: "Law", thumbnail: "🚔", progress: 0, priority: 75 },
  { id: "152", title: "Constitutional Law", channel: "Harvard Law", url: "https://www.youtube.com/watch?v=1bUy-1hGZpI", duration: "12h", skill: "Law", thumbnail: "🏛️", progress: 0, priority: 80 },

  // --- Finance & Accounting ---
  { id: "153", title: "Investment Banking", channel: "Wall Street Prep", url: "https://www.youtube.com/watch?v=Wo5dMEP_BbI", duration: "5h", skill: "Finance", thumbnail: "🏦", progress: 0, priority: 94 },
  { id: "154", title: "Corporate Finance", channel: "Edspira", url: "https://www.youtube.com/watch?v=uWn-pS_O-I4", duration: "10h", skill: "Finance", thumbnail: "💼", progress: 0, priority: 90 },
  { id: "155", title: "Stock Market for Beginners", channel: "Trading 212", url: "https://www.youtube.com/watch?v=Ia-UEYYR44s", duration: "2h", skill: "Finance", thumbnail: "📈", progress: 0, priority: 85 },
  { id: "156", title: "Accounting Principles", channel: "Accounting Stuff", url: "https://www.youtube.com/watch?v=G66S-Xl3jDk", duration: "4h", skill: "Finance", thumbnail: "🧾", progress: 0, priority: 85 },

  // --- Engineering (Civil/Mechanical) ---
  { id: "157", title: "Civil Engineering Basics", channel: "Civil Mentors", url: "https://www.youtube.com/watch?v=Yp69P8_P6mU", duration: "5h", skill: "Engineering", thumbnail: "🏗️", progress: 0, priority: 92 },
  { id: "158", title: "Mechanical Engineering 101", channel: "Engineering Mindset", url: "https://www.youtube.com/watch?v=3KzRChvVvG0", duration: "3h", skill: "Engineering", thumbnail: "⚙️", progress: 0, priority: 85 },
  { id: "159", title: "Electrical Circuits", channel: "ElectroBOOM", url: "https://www.youtube.com/watch?v=qFJeN9V1zsI", duration: "2h", skill: "Engineering", thumbnail: "⚡", progress: 0, priority: 80 },
  { id: "160", title: "Structural Engineering", channel: "The Efficient Engineer", url: "https://www.youtube.com/watch?v=uWn-pS_O-I4", duration: "4h", skill: "Engineering", thumbnail: "🏗️", progress: 0, priority: 80 },

  // --- Creative Arts & Media ---
  { id: "161", title: "Cinematography Masterclass", channel: "StudioBinder", url: "https://www.youtube.com/watch?v=689D-E_6rQA", duration: "5h", skill: "Creative Arts", thumbnail: "🎬", progress: 0, priority: 70 },
  { id: "162", title: "Music Production (Ableton)", channel: "Andrew Huang", url: "https://www.youtube.com/watch?v=HGOBQPFzWKo", duration: "2h", skill: "Creative Arts", thumbnail: "🎹", progress: 0, priority: 65 },
  { id: "163", title: "Digital Illustration", channel: "Proko", url: "https://www.youtube.com/watch?v=vVjSshUu2YI", duration: "4h", skill: "Creative Arts", thumbnail: "🎨", progress: 0, priority: 70 },
  { id: "164", title: "Creative Writing", channel: "MasterClass", url: "https://www.youtube.com/watch?v=W00vW_T-9-Y", duration: "3h", skill: "Creative Arts", thumbnail: "✍️", progress: 0, priority: 65 },

  // --- Psychology & Social Science ---
  { id: "165", title: "Introduction to Psychology", channel: "Yale University", url: "https://www.youtube.com/watch?v=NCwa_xi0Uuc", duration: "15h", skill: "Social Science", thumbnail: "🧠", progress: 0, priority: 80 },
  { id: "166", title: "Sociology 101", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=p-iiEDtStig", duration: "10h", skill: "Social Science", thumbnail: "👥", progress: 0, priority: 75 },
  { id: "167", title: "Political Science", channel: "CrashCourse", url: "https://www.youtube.com/watch?v=V_Kr9OSfDeU", duration: "5h", skill: "Social Science", thumbnail: "🏛️", progress: 0, priority: 70 },
  { id: "168", title: "Anthropology", channel: "PBS Eons", url: "https://www.youtube.com/watch?v=3PHXvlpOkf4", duration: "2h", skill: "Social Science", thumbnail: "🦴", progress: 0, priority: 70 },
];
