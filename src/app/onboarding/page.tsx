"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { Sparkles, ArrowRight, ArrowLeft, GraduationCap, Heart, Lightbulb, Brain, Rocket, CheckCircle2 } from "lucide-react";

const steps = [
  { id: "welcome", icon: Sparkles, title: "Welcome to Nexora", subtitle: "Let's build your AI career profile" },
  { id: "education", icon: GraduationCap, title: "Your Education", subtitle: "Tell us about your academic background" },
  { id: "interests", icon: Heart, title: "Your Interests", subtitle: "What topics excite you the most?" },
  { id: "skills", icon: Lightbulb, title: "Your Skills", subtitle: "What are you good at?" },
  { id: "personality", icon: Brain, title: "Your Personality", subtitle: "How do you approach challenges?" },
  { id: "dreams", icon: Rocket, title: "Dream Careers", subtitle: "Where do you see yourself?" },
];

const interestOptions = ["AI & Machine Learning", "Cloud Computing", "Web Development", "Cyber Security", "Data Science", "Blockchain", "FinTech", "UI/UX Design", "Game Development", "Mobile Apps", "IoT", "DevOps", "Open Source", "Software Architecture", "Quantum Computing"];
const skillOptions = ["Coding", "System Design", "Cloud Infrastructure", "UI/UX Prototyping", "Data Modeling", "API Development", "Version Control", "Cyber Auditing", "Database Management", "Scripting", "Agile Methodologies", "Project Planning", "Technical Writing", "Problem Solving", "Collaboration"];
const personalityOptions = [
  { id: "analytical", label: "Analytical Thinker", emoji: "🧠", desc: "I love breaking down complex technical problems" },
  { id: "creative", label: "Creative Visionary", emoji: "🎨", desc: "I see possibilities in design and architecture" },
  { id: "leader", label: "Engineering Lead", emoji: "👑", desc: "I inspire and guide technical teams" },
  { id: "helper", label: "Community Contributor", emoji: "🤝", desc: "I thrive when helping other devs succeed" },
  { id: "builder", label: "System Architect", emoji: "🏗️", desc: "I love creating robust software structures" },
  { id: "explorer", label: "Tech Explorer", emoji: "🔍", desc: "I'm always learning new stacks and tools" },
];
const careerOptions = ["Software Engineer", "Frontend Developer", "Backend Engineer", "Full Stack Developer", "Data Scientist", "DevOps Engineer", "Cloud Architect", "AI Researcher", "Product Manager", "UX Designer", "Security Analyst", "Systems Engineer", "Mobile Developer", "Site Reliability Engineer", "Blockchain Developer"];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [education, setEducation] = useState({ level: "", field: "", institution: "" });
  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [personality, setPersonality] = useState("");
  const [dreamCareers, setDreamCareers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuthStore();
  const router = useRouter();

  const toggleItem = (arr: string[], setArr: (v: string[]) => void, item: string) => {
    setArr(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          education, interests, skills, personalityType: personality,
          dreamCareers, strengths: skills.slice(0, 3), hobbies: interests.slice(0, 3),
          learningStyle: personality === "analytical" ? "structured" : "exploratory",
        }),
      });
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return education.level && education.field;
    if (step === 2) return interests.length >= 2;
    if (step === 3) return skills.length >= 2;
    if (step === 4) return personality;
    if (step === 5) return dreamCareers.length >= 1;
    return false;
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
      <div className="aurora-bg" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: i <= step ? "100%" : "0%" }}
                transition={{ duration: 0.5 }}
              />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass-card-static p-8 sm:p-10">
              {/* Step 0: Welcome */}
              {step === 0 && (
                <div className="text-center py-8">
                  <motion.div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>
                  <h1 className="text-3xl font-bold text-white mb-3">Hey {user?.name?.split(" ")[0]}! 👋</h1>
                  <p className="text-slate-400 text-lg mb-2">Welcome to Nexora</p>
                  <p className="text-slate-500 max-w-md mx-auto">I&apos;m going to ask you a few questions to understand your background and aspirations. This helps me create your personalized career intelligence profile.</p>
                </div>
              )}

              {/* Step 1: Education */}
              {step === 1 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{steps[1].title}</h2>
                      <p className="text-sm text-slate-500">{steps[1].subtitle}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Education Level</label>
                      <select value={education.level} onChange={(e) => setEducation({ ...education, level: e.target.value })} className="input-field">
                        <option value="">Select...</option>
                        <option value="high-school">High School</option>
                        <option value="undergraduate">Undergraduate</option>
                        <option value="graduate">Graduate (Masters)</option>
                        <option value="doctorate">Doctorate (PhD)</option>
                        <option value="professional">Working Professional</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Field of Study</label>
                      <input type="text" value={education.field} onChange={(e) => setEducation({ ...education, field: e.target.value })} placeholder="e.g., Computer Science, Software Engineering, IT..." className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Institution (optional)</label>
                      <input type="text" value={education.institution} onChange={(e) => setEducation({ ...education, institution: e.target.value })} placeholder="University or school name" className="input-field" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Interests */}
              {step === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center"><Heart className="w-5 h-5 text-white" /></div>
                    <div><h2 className="text-xl font-bold text-white">{steps[2].title}</h2><p className="text-sm text-slate-500">Select at least 2 that excite you</p></div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((item) => (
                      <button key={item} onClick={() => toggleItem(interests, setInterests, item)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${interests.includes(item) ? "bg-indigo-500/20 border border-indigo-500/40 text-indigo-300" : "bg-white/5 border border-white/10 text-slate-400 hover:border-white/20"}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Skills */}
              {step === 3 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"><Lightbulb className="w-5 h-5 text-white" /></div>
                    <div><h2 className="text-xl font-bold text-white">{steps[3].title}</h2><p className="text-sm text-slate-500">Select at least 2 skills you have</p></div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillOptions.map((item) => (
                      <button key={item} onClick={() => toggleItem(skills, setSkills, item)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${skills.includes(item) ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300" : "bg-white/5 border border-white/10 text-slate-400 hover:border-white/20"}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Personality */}
              {step === 4 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"><Brain className="w-5 h-5 text-white" /></div>
                    <div><h2 className="text-xl font-bold text-white">{steps[4].title}</h2><p className="text-sm text-slate-500">Which describes you best?</p></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {personalityOptions.map((p) => (
                      <button key={p.id} onClick={() => setPersonality(p.id)}
                        className={`p-4 rounded-xl text-left transition-all ${personality === p.id ? "bg-indigo-500/15 border-2 border-indigo-500/40" : "bg-white/5 border-2 border-transparent hover:border-white/10"}`}>
                        <div className="text-2xl mb-2">{p.emoji}</div>
                        <div className="text-sm font-semibold text-white">{p.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{p.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Dream Careers */}
              {step === 5 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center"><Rocket className="w-5 h-5 text-white" /></div>
                    <div><h2 className="text-xl font-bold text-white">{steps[5].title}</h2><p className="text-sm text-slate-500">Select careers that interest you</p></div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {careerOptions.map((item) => (
                      <button key={item} onClick={() => toggleItem(dreamCareers, setDreamCareers, item)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${dreamCareers.includes(item) ? "bg-purple-500/20 border border-purple-500/40 text-purple-300" : "bg-white/5 border border-white/10 text-slate-400 hover:border-white/20"}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                {step > 0 ? (
                  <button onClick={() => setStep(step - 1)} className="btn-ghost flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back</button>
                ) : <div />}
                {step < steps.length - 1 ? (
                  <button onClick={() => setStep(step + 1)} disabled={!canProceed()} className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed">
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
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
