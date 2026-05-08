"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Compass, Search, Star, TrendingUp, Sparkles, Brain, ArrowRight, X, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";

interface CareerRecommendation {
  id: string;
  matchScore: number;
  salaryPrediction: string;
  career: {
    title: string;
    description: string;
    industry: string;
    salaryMin: number;
    salaryMax: number;
    demandLevel: string;
    requiredSkills: string;
  };
}

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function CareerExplorerPage() {
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);
  const { token, fetchUser } = useAuthStore();
  const router = useRouter();
  const [generatingPathway, setGeneratingPathway] = useState(false);

  useEffect(() => {
    async function fetchRecommendations() {
      if (!token) return;
      try {
        const res = await fetch("/api/careers/recommendations", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setRecommendations(data.recommendations);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchRecommendations();
  }, [token]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Clear current recommendations
      await fetch("/api/careers/recommendations", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      // Fetch new ones (this will trigger generation in the API)
      const res = await fetch("/api/careers/recommendations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = recommendations.filter(r => 
    r.career.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.career.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Compass className="w-8 h-8 text-indigo-400" /> Career Explorer
          </h1>
          <p className="text-slate-400">AI-curated paths based on your unique profile</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all disabled:opacity-50 h-[42px]"
          >
            <Sparkles className={`w-4 h-4 text-indigo-400 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Re-analyzing..." : "Re-analyze Profile"}
          </button>
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search careers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field !pl-10 !py-2"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center animate-pulse">
            <Brain className="w-6 h-6 text-indigo-400" />
          </div>
          <p className="text-slate-400">Analyzing your profile and matching careers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((rec, i) => {
            const skills = JSON.parse(rec.career.requiredSkills || "[]");
            return (
              <motion.div 
                key={rec.id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex flex-col h-full cursor-pointer"
                onClick={() => setSelectedCareer(rec)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center">
                    <Star className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-400">{rec.matchScore}% Match</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{rec.career.title}</h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{rec.career.description}</p>

                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Industry</span>
                    <span className="text-slate-300 font-medium">{rec.career.industry}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Est. Salary</span>
                    <span className="text-slate-300 font-medium">${(rec.career.salaryMin / 1000).toFixed(0)}k - ${(rec.career.salaryMax / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Demand</span>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <TrendingUp className="w-4 h-4" /> <span className="capitalize">{rec.career.demandLevel}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2">
                    {skills.slice(0, 3).map((skill: string) => (
                      <span key={skill} className="px-2 py-1 rounded-md bg-white/5 text-xs text-slate-300 border border-white/10">
                        {skill}
                      </span>
                    ))}
                    {skills.length > 3 && (
                      <span className="px-2 py-1 rounded-md bg-white/5 text-xs text-slate-500 border border-transparent">
                        +{skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedCareer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCareer(null)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-2xl bg-[#0F172A] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button 
              onClick={() => setSelectedCareer(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-6 pr-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedCareer.career.title}</h2>
                <div className="flex items-center gap-3">
                  <span className="badge badge-emerald">{selectedCareer.matchScore}% Match</span>
                  <span className="text-sm text-slate-400">{selectedCareer.career.industry}</span>
                </div>
              </div>
            </div>

            <p className="text-slate-300 mb-8 leading-relaxed">
              {selectedCareer.career.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-sm text-slate-500 mb-1">Estimated Salary</div>
                <div className="text-xl font-semibold text-white">
                  ${(selectedCareer.career.salaryMin / 1000).toFixed(0)}k - ${(selectedCareer.career.salaryMax / 1000).toFixed(0)}k
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-sm text-slate-500 mb-1">Market Demand</div>
                <div className="text-xl font-semibold text-emerald-400 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="capitalize">{selectedCareer.career.demandLevel}</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {JSON.parse(selectedCareer.career.requiredSkills || "[]").map((skill: string) => (
                  <span key={skill} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-sm text-indigo-300 border border-indigo-500/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
              <button onClick={() => setSelectedCareer(null)} className="btn-secondary">Close</button>
              <button 
                disabled={generatingPathway}
                onClick={async () => {
                  if (!token || !selectedCareer) return;
                  setGeneratingPathway(true);
                  try {
                    const res = await fetch("/api/careers/pathway", {
                      method: "POST",
                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ careerId: (selectedCareer as any).careerId || null, careerTitle: selectedCareer.career.title })
                    });
                    const data = await res.json();
                    if (data.success) {
                      fetchUser();
                      setSelectedCareer(null);
                      router.push("/pathways");
                    }
                  } catch (e) { console.error(e); }
                  finally { setGeneratingPathway(false); }
                }}
                className="btn-primary"
              >
                {generatingPathway ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <>Generate Pathway <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
