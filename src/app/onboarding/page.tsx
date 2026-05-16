"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import {
  Sparkles, ArrowRight, ArrowLeft, GraduationCap, Heart, Lightbulb,
  Brain, Rocket, CheckCircle2, Code2, Target, Users
} from "lucide-react";

const steps = [
  { id: "welcome", title: "Welcome to Nexora", subtitle: "Let's build your AI career profile", color: "from-indigo-500 to-purple-600" },
  { id: "experience", title: "Your Experience", subtitle: "Where are you in your journey?", color: "from-blue-500 to-cyan-600" },
  { id: "domains", title: "Tech Domains", subtitle: "What areas of tech excite you?", color: "from-pink-500 to-rose-600" },
  { id: "techStack", title: "Languages & Tools", subtitle: "What's in your toolkit?", color: "from-emerald-500 to-teal-600" },
  { id: "workStyle", title: "Work Preference", subtitle: "How do you love working?", color: "from-amber-500 to-orange-600" },
  { id: "projectType", title: "Project Interests", subtitle: "What kind of work thrills you?", color: "from-cyan-500 to-blue-600" },
  { id: "careerGoals", title: "Career Goals", subtitle: "What drives your career?", color: "from-violet-500 to-purple-600" },
  { id: "dreamRole", title: "Dream Role", subtitle: "Where do you see yourself?", color: "from-purple-500 to-pink-600" },
];

const stepIcons = [Sparkles, GraduationCap, Heart, Code2, Users, Lightbulb, Target, Rocket];

const techDomains = [
  { id: "frontend", label: "Frontend Development", emoji: "🎨", desc: "React, Vue, Angular, UI systems" },
  { id: "backend", label: "Backend Engineering", emoji: "⚙️", desc: "APIs, microservices, server logic" },
  { id: "fullstack", label: "Full Stack Development", emoji: "🔄", desc: "End-to-end web applications" },
  { id: "ai-ml", label: "AI & Machine Learning", emoji: "🤖", desc: "Neural networks, NLP, computer vision" },
  { id: "data-eng", label: "Data Engineering", emoji: "📊", desc: "Pipelines, ETL, data warehouses" },
  { id: "data-science", label: "Data Science & Analytics", emoji: "📈", desc: "Statistical modeling, insights" },
  { id: "devops", label: "DevOps & Cloud", emoji: "☁️", desc: "CI/CD, infrastructure, containers" },
  { id: "cybersecurity", label: "Cybersecurity", emoji: "🔒", desc: "Pen testing, security architecture" },
  { id: "mobile", label: "Mobile Development", emoji: "📱", desc: "iOS, Android, cross-platform" },
  { id: "game-dev", label: "Game Development", emoji: "🎮", desc: "Game engines, 3D graphics" },
  { id: "blockchain", label: "Blockchain & Web3", emoji: "⛓️", desc: "Smart contracts, DeFi, dApps" },
  { id: "ui-ux", label: "UI/UX Design", emoji: "✏️", desc: "User research, prototyping, design systems" },
  { id: "embedded", label: "Embedded & IoT", emoji: "🔌", desc: "Hardware, firmware, real-time systems" },
  { id: "qa", label: "QA & Test Automation", emoji: "🧪", desc: "Testing frameworks, quality assurance" },
  { id: "sre", label: "Site Reliability Engineering", emoji: "🛡️", desc: "Uptime, monitoring, incident response" },
];

const techTools = [
  "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "Swift", "Kotlin", "PHP", "Ruby", "SQL", "R",
  "React", "Next.js", "Vue.js", "Angular", "Node.js", "Express", "Django", "Flask", "Spring Boot", ".NET",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Jenkins", "GitHub Actions",
  "TensorFlow", "PyTorch", "Pandas", "Spark", "Tableau", "Power BI",
  "Git", "Linux", "Figma", "MongoDB", "PostgreSQL", "Redis", "GraphQL", "REST APIs",
];

const workTeamPrefs = [
  { id: "solo", label: "Solo Developer", emoji: "🧑‍💻", desc: "I do my best work independently" },
  { id: "small-team", label: "Small Team (2-5)", emoji: "👥", desc: "Close-knit, agile collaboration" },
  { id: "large-team", label: "Large Team (10+)", emoji: "🏢", desc: "Enterprise scale coordination" },
];
const workEnvOptions = [
  { id: "remote", label: "Fully Remote", emoji: "🏠" },
  { id: "hybrid", label: "Hybrid", emoji: "🔄" },
  { id: "onsite", label: "On-site", emoji: "🏢" },
];
const workOrgOptions = [
  { id: "startup", label: "Startup", emoji: "🚀", desc: "Fast-paced, wear many hats" },
  { id: "mid-company", label: "Mid-size Company", emoji: "🏗️", desc: "Growth stage, structured" },
  { id: "corporation", label: "Large Corporation", emoji: "🏛️", desc: "Enterprise, specialized roles" },
  { id: "freelance", label: "Freelance", emoji: "💼", desc: "Independent, client-facing" },
];

const projectInterests = [
  { id: "build-products", label: "Build Products", emoji: "🛠️", desc: "Ship user-facing apps and features" },
  { id: "research", label: "Research & Innovate", emoji: "🔬", desc: "Push boundaries with new tech" },
  { id: "optimize", label: "Optimize Systems", emoji: "⚡", desc: "Make things faster, more reliable" },
  { id: "design-ux", label: "Create UX", emoji: "🎨", desc: "Craft beautiful, intuitive interfaces" },
  { id: "data-insights", label: "Analyze Data", emoji: "📊", desc: "Uncover patterns, drive decisions" },
  { id: "lead-teams", label: "Lead Teams", emoji: "👑", desc: "Guide engineering teams and strategy" },
  { id: "security", label: "Secure & Protect", emoji: "🔐", desc: "Find vulnerabilities, build defenses" },
  { id: "automate", label: "Automate Everything", emoji: "🤖", desc: "Eliminate toil with pipelines, bots" },
];

const careerGoalOptions = [
  { id: "high-salary", label: "High Compensation", emoji: "💰", desc: "Maximize earning potential" },
  { id: "work-life", label: "Work-Life Balance", emoji: "⚖️", desc: "Sustainable pace, personal time" },
  { id: "innovation", label: "Innovation & Impact", emoji: "💡", desc: "Work on cutting-edge technology" },
  { id: "leadership", label: "Leadership Path", emoji: "🎯", desc: "Grow into management/executive" },
  { id: "job-security", label: "Job Security", emoji: "🛡️", desc: "Stable, in-demand career" },
  { id: "remote-flex", label: "Remote Flexibility", emoji: "🌍", desc: "Work from anywhere" },
  { id: "learning", label: "Continuous Learning", emoji: "📚", desc: "Always growing, always learning" },
  { id: "entrepreneurship", label: "Entrepreneurship", emoji: "🚀", desc: "Build my own company someday" },
];

const dreamRoleOptions = [
  "Software Engineer", "Frontend Developer", "Backend Engineer", "Full Stack Developer",
  "Data Scientist", "Data Engineer", "ML Engineer", "AI Researcher",
  "DevOps Engineer", "Cloud Architect", "SRE", "Platform Engineer",
  "Product Manager", "Engineering Manager", "CTO", "Tech Lead",
  "UX Designer", "UI Engineer", "Security Engineer", "Penetration Tester",
  "Mobile Developer", "iOS Developer", "Android Developer",
  "Game Developer", "Blockchain Developer", "QA Engineer",
  "Solutions Architect", "Systems Engineer", "Database Administrator",
];

const expLevels = [
  { id: "high-school", label: "High School Student", emoji: "🎒" },
  { id: "undergraduate", label: "Undergrad Student", emoji: "🎓" },
  { id: "graduate", label: "Graduate (Masters)", emoji: "📜" },
  { id: "doctorate", label: "PhD / Researcher", emoji: "🔬" },
  { id: "early-career", label: "Early Career (0-2 yrs)", emoji: "🌱" },
  { id: "mid-career", label: "Mid Career (3-7 yrs)", emoji: "📈" },
  { id: "senior", label: "Senior (8+ yrs)", emoji: "⭐" },
  { id: "career-switch", label: "Career Switcher", emoji: "🔄" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [experience, setExperience] = useState({ level: "", yearsOfExp: "", fieldOfStudy: "" });
  const [domains, setDomains] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [workStyle, setWorkStyle] = useState({ teamPref: "", environment: "", orgType: "" });
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [careerGoals, setCareerGoals] = useState<string[]>([]);
  const [dreamRoles, setDreamRoles] = useState<string[]>([]);
  const [customDreamRole, setCustomDreamRole] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuthStore();
  const router = useRouter();

  const toggle = (arr: string[], setArr: (v: string[]) => void, item: string) => {
    setArr(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const finalDreamRoles = customDreamRole.trim() ? [...dreamRoles, customDreamRole.trim()] : dreamRoles;
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ experience, domains, tools, workStyle, projectTypes, careerGoals, dreamRoles: finalDreamRoles }),
      });
      router.push("/dashboard");
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return experience.level && experience.fieldOfStudy;
    if (step === 2) return domains.length >= 1;
    if (step === 3) return tools.length >= 2;
    if (step === 4) return workStyle.teamPref && workStyle.environment && workStyle.orgType;
    if (step === 5) return projectTypes.length >= 1;
    if (step === 6) return careerGoals.length >= 1;
    if (step === 7) return dreamRoles.length >= 1 || customDreamRole.trim().length > 0;
    return false;
  };

  const Icon = stepIcons[step];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
      <div className="aurora-bg" />
      <div className="w-full max-w-2xl relative z-10">
        <div className="flex items-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s.id} className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/5">
              <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" initial={{ width: "0%" }} animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.5 }} />
            </div>
          ))}
        </div>
        <p className="text-center text-xs font-medium text-slate-500 mb-4">Step {step + 1} of {steps.length}</p>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="glass-card-static p-8 sm:p-10">

              {step === 0 && (
                <div className="text-center py-8">
                  <motion.div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>
                  <h1 className="text-3xl font-bold text-white mb-3">Hey {user?.name?.split(" ")[0]}! 👋</h1>
                  <p className="text-slate-400 text-lg mb-2">Welcome to Nexora</p>
                  <p className="text-slate-500 max-w-md mx-auto">I&apos;ll ask a few questions about your tech background, interests, and goals to find the <span className="text-indigo-400 font-medium">perfect career paths</span> and build a <span className="text-purple-400 font-medium">personalized roadmap</span> for you.</p>
                </div>
              )}

              {step === 1 && (
                <div>
                  <SH icon={GraduationCap} title={steps[1].title} sub={steps[1].subtitle} color={steps[1].color} />
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Where are you right now?</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {expLevels.map((o) => (
                          <button key={o.id} onClick={() => setExperience({ ...experience, level: o.id })}
                            className={`p-3 rounded-xl text-left transition-all flex items-center gap-3 ${experience.level === o.id ? "bg-blue-500/15 border-2 border-blue-500/40" : "bg-white/5 border-2 border-transparent hover:border-white/10"}`}>
                            <span className="text-xl">{o.emoji}</span><span className="text-sm font-medium text-white">{o.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Field of Study / Background</label>
                      <input type="text" value={experience.fieldOfStudy} onChange={(e) => setExperience({ ...experience, fieldOfStudy: e.target.value })} placeholder="e.g., Computer Science, Self-taught..." className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Years of coding experience (optional)</label>
                      <select value={experience.yearsOfExp} onChange={(e) => setExperience({ ...experience, yearsOfExp: e.target.value })} className="input-field">
                        <option value="">Select...</option>
                        <option value="0">Less than 1 year</option>
                        <option value="1-2">1-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <SH icon={Heart} title={steps[2].title} sub="Pick the areas that excite you most" color={steps[2].color} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-2">
                    {techDomains.map((d) => (
                      <button key={d.id} onClick={() => toggle(domains, setDomains, d.id)}
                        className={`p-3 rounded-xl text-left transition-all ${domains.includes(d.id) ? "bg-pink-500/15 border-2 border-pink-500/40" : "bg-white/5 border-2 border-transparent hover:border-white/10"}`}>
                        <div className="flex items-center gap-2 mb-1"><span className="text-lg">{d.emoji}</span><span className="text-sm font-semibold text-white">{d.label}</span></div>
                        <p className="text-xs text-slate-500 pl-7">{d.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <SH icon={Code2} title={steps[3].title} sub="Select technologies you know or are learning (2+)" color={steps[3].color} />
                  <div className="flex flex-wrap gap-2 max-h-[50vh] overflow-y-auto pr-2">
                    {techTools.map((t) => (
                      <button key={t} onClick={() => toggle(tools, setTools, t)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tools.includes(t) ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300" : "bg-white/5 border border-white/10 text-slate-400 hover:border-white/20"}`}>{t}</button>
                    ))}
                  </div>
                  {tools.length > 0 && <p className="text-xs text-emerald-400/70 mt-3">{tools.length} selected</p>}
                </div>
              )}

              {step === 4 && (
                <div>
                  <SH icon={Users} title={steps[4].title} sub={steps[4].subtitle} color={steps[4].color} />
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Team Preference</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {workTeamPrefs.map((o) => (
                          <button key={o.id} onClick={() => setWorkStyle({ ...workStyle, teamPref: o.id })}
                            className={`p-3 rounded-xl text-center transition-all ${workStyle.teamPref === o.id ? "bg-amber-500/15 border-2 border-amber-500/40" : "bg-white/5 border-2 border-transparent hover:border-white/10"}`}>
                            <div className="text-xl mb-1">{o.emoji}</div><div className="text-sm font-medium text-white">{o.label}</div><div className="text-xs text-slate-500 mt-1">{o.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Work Environment</label>
                      <div className="flex gap-3">
                        {workEnvOptions.map((o) => (
                          <button key={o.id} onClick={() => setWorkStyle({ ...workStyle, environment: o.id })}
                            className={`flex-1 p-3 rounded-xl text-center transition-all ${workStyle.environment === o.id ? "bg-amber-500/15 border-2 border-amber-500/40" : "bg-white/5 border-2 border-transparent hover:border-white/10"}`}>
                            <div className="text-xl mb-1">{o.emoji}</div><div className="text-sm font-medium text-white">{o.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Organization Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        {workOrgOptions.map((o) => (
                          <button key={o.id} onClick={() => setWorkStyle({ ...workStyle, orgType: o.id })}
                            className={`p-3 rounded-xl text-left transition-all ${workStyle.orgType === o.id ? "bg-amber-500/15 border-2 border-amber-500/40" : "bg-white/5 border-2 border-transparent hover:border-white/10"}`}>
                            <span className="text-lg mr-2">{o.emoji}</span><span className="text-sm font-medium text-white">{o.label}</span>
                            <p className="text-xs text-slate-500 mt-1 pl-7">{o.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <SH icon={Lightbulb} title={steps[5].title} sub="What kind of work makes you excited?" color={steps[5].color} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {projectInterests.map((p) => (
                      <button key={p.id} onClick={() => toggle(projectTypes, setProjectTypes, p.id)}
                        className={`p-4 rounded-xl text-left transition-all ${projectTypes.includes(p.id) ? "bg-cyan-500/15 border-2 border-cyan-500/40" : "bg-white/5 border-2 border-transparent hover:border-white/10"}`}>
                        <div className="text-2xl mb-2">{p.emoji}</div><div className="text-sm font-semibold text-white">{p.label}</div><div className="text-xs text-slate-500 mt-1">{p.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 6 && (
                <div>
                  <SH icon={Target} title={steps[6].title} sub="What matters most in your career?" color={steps[6].color} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {careerGoalOptions.map((g) => (
                      <button key={g.id} onClick={() => toggle(careerGoals, setCareerGoals, g.id)}
                        className={`p-4 rounded-xl text-left transition-all ${careerGoals.includes(g.id) ? "bg-violet-500/15 border-2 border-violet-500/40" : "bg-white/5 border-2 border-transparent hover:border-white/10"}`}>
                        <div className="text-2xl mb-2">{g.emoji}</div><div className="text-sm font-semibold text-white">{g.label}</div><div className="text-xs text-slate-500 mt-1">{g.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 7 && (
                <div>
                  <SH icon={Rocket} title={steps[7].title} sub="Select dream roles or type your own" color={steps[7].color} />
                  <div className="flex flex-wrap gap-2 mb-4 max-h-[35vh] overflow-y-auto pr-2">
                    {dreamRoleOptions.map((item) => (
                      <button key={item} onClick={() => toggle(dreamRoles, setDreamRoles, item)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${dreamRoles.includes(item) ? "bg-purple-500/20 border border-purple-500/40 text-purple-300" : "bg-white/5 border border-white/10 text-slate-400 hover:border-white/20"}`}>{item}</button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Or type a custom role</label>
                    <input type="text" value={customDreamRole} onChange={(e) => setCustomDreamRole(e.target.value)} placeholder="e.g., AI Product Lead, Robotics Engineer..." className="input-field" />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                {step > 0 ? (<button onClick={() => setStep(step - 1)} className="btn-ghost flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back</button>) : <div />}
                {step < steps.length - 1 ? (
                  <button onClick={() => setStep(step + 1)} disabled={!canProceed()} className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed">Continue <ArrowRight className="w-4 h-4" /></button>
                ) : (
                  <button onClick={handleComplete} disabled={!canProceed() || loading} className="btn-primary">
                    {loading ? <span className="typing-dots"><span /><span /><span /></span> : <><CheckCircle2 className="w-4 h-4" /> Complete Profile</>}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function SH({ icon: I, title, sub, color }: { icon: any; title: string; sub: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}><I className="w-5 h-5 text-white" /></div>
      <div><h2 className="text-xl font-bold text-white">{title}</h2><p className="text-sm text-slate-500">{sub}</p></div>
    </div>
  );
}
