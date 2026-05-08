"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Route, Map, Milestone, ArrowRight, CheckCircle2, Loader2, Sparkles, RefreshCcw } from "lucide-react";
import { useAuthStore } from "@/store";
import Link from "next/link";

interface PathwayPhase {
  year: string;
  title: string;
  desc: string;
  status: string;
  milestones: string[];
  skills?: string[];
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
            Our AI strategist needs your input. Select a career role to generate a complete 10-year growth horizon.
          </p>
          <Link href="/careers" className="btn-primary inline-flex">
            Explore Careers <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const roadmap = activePathway?.milestones || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 pb-32">
      {/* Header Section */}
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
          className="btn-primary flex items-center gap-2 !py-4 !px-8"
        >
          <RefreshCcw className="w-5 h-5" /> Fresh AI Synthesis
        </button>
      </div>


      {/* North Star Section */}
      <div className="glass-card p-8 mb-16 border-indigo-500/10">
        <div className="flex items-start gap-4 mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">North Star</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">{activePathway?.title}</h2>
        <p className="text-slate-400 max-w-2xl leading-relaxed">
          Becoming an influential technical leader in {activePathway?.title}, driving innovation and substantial impact within the global industry.
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-12 md:pl-20">
        {/* Connection Line */}
        <div className="absolute left-[2.2rem] md:left-[4.2rem] top-8 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500/50 to-transparent" />

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
              <div className="absolute -left-[3.2rem] md:-left-[5.2rem] top-2 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 z-10 text-lg">
                {phase?.year?.toString().match(/\d+/)?.[0] || i + 1}
              </div>

              <div className="glass-card p-8 md:p-10 border-white/5 bg-[#0F172A]/40 backdrop-blur-md">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-3xl font-bold text-white">Year {phase?.year?.toString().match(/\d+/)?.[0] || i + 1}</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">{phase?.title}</span>
                    </div>
                    
                    <div className="mt-8 max-w-2xl">
                      {/* Milestones */}
                      <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Key Milestones</span>
                        <ul className="space-y-4">
                          {(phase?.milestones || []).map((m: any, j: number) => (
                            <li key={j} className="flex items-start gap-3 group">
                              <ArrowRight className="w-4 h-4 mt-1 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                              <span className="text-slate-300 text-[0.95rem] leading-relaxed">{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
