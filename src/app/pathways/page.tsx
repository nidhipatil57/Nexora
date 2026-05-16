"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Map, ArrowRight, Loader2, Sparkles, RefreshCcw, BookOpen, DollarSign, Trophy } from "lucide-react";
import { useAuthStore } from "@/store";
import Link from "next/link";

interface PathwayResource {
  name: string;
  type: string;
}

interface PathwayPhase {
  year: number;
  title: string;
  desc: string;
  milestones: string[];
  skills?: string[];
  resources?: PathwayResource[];
  salary?: string;
}

interface Pathway {
  id: string;
  title: string;
  milestones: PathwayPhase[];
  timeframe: string;
  createdAt: string;
}

export default function PathwaysPage() {
  const { token } = useAuthStore();
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePathway, setActivePathway] = useState<Pathway | null>(null);

  useEffect(() => {
    async function fetchPathways() {
      if (!token) return;
      try {
        const res = await fetch("/api/pathways", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success && data.pathways.length > 0) {
          const parsed = data.pathways.map((p: any) => ({
            ...p,
            milestones: typeof p.milestones === "string" ? JSON.parse(p.milestones) : p.milestones,
          }));
          setPathways(parsed);
          setActivePathway(parsed[0]);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchPathways();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-slate-400">Synthesizing your AI roadmap...</p>
      </div>
    );
  }

  if (pathways.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Pathway Visualizer</span>
          <h1 className="text-5xl font-bold text-white mt-2 mb-4">
            A roadmap built for <span className="gradient-text">your future</span>
          </h1>
          <p className="text-slate-400 text-lg">Explore careers and click &quot;Generate Pathway&quot; to create your personalized career roadmap.</p>
        </div>
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-6">
            <Map className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No Pathways Yet</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Our AI strategist needs your input. Select a career role to generate a complete 5-year growth horizon.
          </p>
          <Link href="/careers" className="btn-primary inline-flex">
            Explore Careers <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const roadmap = activePathway?.milestones || [];

  // Phase gradient colors
  const phaseColors = [
    "from-blue-500 to-cyan-500",
    "from-indigo-500 to-purple-500",
    "from-purple-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-emerald-500 to-teal-500",
  ];

  const phaseShadows = [
    "shadow-blue-500/20",
    "shadow-indigo-500/20",
    "shadow-purple-500/20",
    "shadow-amber-500/20",
    "shadow-emerald-500/20",
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Pathway Visualizer</span>
          <h1 className="text-5xl font-bold text-white mt-2 mb-4 tracking-tight">
            A roadmap built for <span className="gradient-text">your future</span>
          </h1>
          <p className="text-slate-400 text-lg">Detailed year-by-year horizons synthesized by your AI strategist.</p>
        </div>

        <button
          onClick={async () => {
            if (!activePathway) return;
            setLoading(true);
            try {
              const res = await fetch("/api/careers/pathway", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                  careerId: activePathway.id,
                  careerTitle: activePathway.title.replace(" Career Pathway", "")
                })
              });
              const data = await res.json();
              if (data.success) {
                const newPathway = {
                  ...data.pathway,
                  milestones: typeof data.pathway.milestones === "string" ? JSON.parse(data.pathway.milestones) : data.pathway.milestones
                };
                setPathways([newPathway, ...pathways]);
                setActivePathway(newPathway);
              }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
          }}
          className="btn-primary flex items-center gap-2 !py-4 !px-8 shrink-0"
        >
          <RefreshCcw className="w-5 h-5" /> Fresh AI Synthesis
        </button>
      </div>

      {/* Pathway Selector (if multiple pathways exist) */}
      {pathways.length > 1 && (
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
          {pathways.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePathway(p)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activePathway?.id === p.id
                  ? "bg-indigo-500/20 border border-indigo-500/40 text-indigo-300"
                  : "bg-white/5 border border-white/10 text-slate-400 hover:border-white/20"
              }`}
            >
              {p.title.replace(" Career Pathway", "")}
            </button>
          ))}
        </div>
      )}

      {/* North Star Section */}
      <div className="glass-card p-8 mb-16 border-indigo-500/10">
        <div className="flex items-start gap-4 mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">North Star</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">{activePathway?.title}</h2>
        <p className="text-slate-400 max-w-2xl leading-relaxed">
          A comprehensive 5-year roadmap to becoming an influential {activePathway?.title?.replace(" Career Pathway", "")} — from foundations to industry mastery.
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-12 md:pl-20">
        <div className="absolute left-[2.2rem] md:left-[4.2rem] top-8 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500/50 via-purple-500/30 to-transparent" />

        <div className="space-y-16">
          {roadmap.map((phase, i) => (
            <motion.div
              key={phase?.year || i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              {/* Numbered Circle */}
              <div className={`absolute -left-[3.2rem] md:-left-[5.2rem] top-2 w-10 h-10 rounded-xl bg-gradient-to-br ${phaseColors[i % 5]} flex items-center justify-center text-white font-black shadow-lg ${phaseShadows[i % 5]} z-10 text-lg`}>
                {phase?.year || i + 1}
              </div>

              <div className="glass-card p-8 md:p-10 border-white/5 bg-[#0F172A]/40 backdrop-blur-md">
                {/* Phase Header */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-3xl font-bold text-white">Year {phase?.year || i + 1}</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">{phase?.title}</span>
                    </div>
                    {/* Salary Badge */}
                    {phase?.salary && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-semibold text-emerald-400">{phase.salary}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-3xl">
                  {phase?.desc}
                </p>

                {/* Milestones */}
                <div className="mb-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 block flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5" /> Key Milestones
                  </span>
                  <ul className="space-y-3">
                    {(phase?.milestones || []).map((m: any, j: number) => (
                      <li key={j} className="flex items-start gap-3 group">
                        <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${phaseColors[i % 5]} flex items-center justify-center shrink-0 mt-0.5`}>
                          <span className="text-white text-[10px] font-bold">{j + 1}</span>
                        </div>
                        <span className="text-slate-300 text-[0.95rem] leading-relaxed">{typeof m === "string" ? m : m?.text || m?.name || JSON.stringify(m)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills */}
                {phase?.skills && phase.skills.length > 0 && (
                  <div className="mb-8 pt-6 border-t border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 block flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" /> Target Skills
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {phase.skills.map((skill: string, j: number) => (
                        <span key={j} className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${phaseColors[i % 5]} bg-opacity-10 border border-white/10 text-white/80 text-xs font-medium`} style={{ background: `linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))` }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resources */}
                {phase?.resources && phase.resources.length > 0 && (
                  <div className="pt-6 border-t border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 block flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5" /> Recommended Resources
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {phase.resources.map((res: any, j: number) => {
                        const name = typeof res === "string" ? res : res?.name || "Resource";
                        const type = typeof res === "string" ? "resource" : res?.type || "resource";
                        return (
                          <div key={j} className="p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="text-sm font-medium text-white mb-1">{name}</div>
                            <div className="text-xs text-slate-500 capitalize">{type}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
