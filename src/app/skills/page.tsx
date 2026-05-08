"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, BookOpen, Brain, Loader2, X, Clock, Calendar } from "lucide-react";
import { useAuthStore, useAppStore } from "@/store";
import Link from "next/link";

interface SkillGap {
  name: string;
  currentLevel: number;
  requiredLevel: number;
  priority: string;
  category: string;
}

interface LearningPhase {
  week: string;
  title: string;
  concepts: string[];
  resources: { name: string; type: string; url: string }[];
  hoursEstimate: number;
  goal: string;
}

interface LearningPath {
  totalWeeks: number;
  hoursPerWeek: number;
  phases: LearningPhase[];
  completedPhases: string[];
}

export default function SkillsPage() {
  const { token } = useAuthStore();
  const { learningPlans, saveLearningPlan, togglePhaseCompletion } = useAppStore();
  const [hasAssessments, setHasAssessments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [learningPathSkill, setLearningPathSkill] = useState("");
  const [loadingPath, setLoadingPath] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!token) return;
      try {
        const res = await fetch("/api/assessments", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success && data.assessments.length > 0) {
          setHasAssessments(true);
          // Derive skill gaps from assessment scores
          const scoreMap: Record<string, number> = {};
          for (const a of data.assessments) {
            if (!scoreMap[a.type] || a.score > scoreMap[a.type]) {
              scoreMap[a.type] = a.score;
            }
          }
          const gaps: SkillGap[] = [];
          const strong: string[] = [];
          const mapping: Record<string, { name: string; category: string; required: number }> = {
            cog: { name: "Logical Reasoning", category: "Cognitive", required: 80 },
            tech: { name: "Technical Skills", category: "Technical", required: 85 },
            lead: { name: "Leadership", category: "Management", required: 75 },
            creative: { name: "Creative Thinking", category: "Creative", required: 70 },
            analytical: { name: "Analytical Skills", category: "Technical", required: 80 },
            pers: { name: "Communication", category: "Soft Skills", required: 70 },
          };
          for (const [type, info] of Object.entries(mapping)) {
            const score = scoreMap[type];
            if (score !== undefined) {
              if (score >= info.required) {
                strong.push(info.name);
              } else {
                gaps.push({
                  name: info.name,
                  currentLevel: score,
                  requiredLevel: info.required,
                  priority: score < 40 ? "high" : score < 60 ? "medium" : "low",
                  category: info.category,
                });
              }
            }
          }
          setSkillGaps(gaps.sort((a, b) => a.currentLevel - b.currentLevel));
          setStrengths(strong);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchData();
  }, [token]);

  const handleViewLearningPath = async (skill: SkillGap) => {
    if (!token) return;
    setLearningPathSkill(skill.name);
    
    // Check if we already have this plan
    if (learningPlans[skill.name]) {
      setLearningPath(learningPlans[skill.name]);
      return;
    }

    setLoadingPath(true);
    setLearningPath(null);
    try {
      const res = await fetch("/api/skills/learning-path", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ skillName: skill.name, currentLevel: skill.currentLevel, requiredLevel: skill.requiredLevel }),
      });
      const data = await res.json();
      if (data.success) {
        const planWithCompleted = { ...data.learningPath, completedPhases: [] };
        setLearningPath(planWithCompleted);
        saveLearningPlan(skill.name, planWithCompleted);
      }
    } catch (e) { console.error(e); }
    finally { setLoadingPath(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-cyan-400 animate-spin" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Target className="w-8 h-8 text-cyan-400" /> Skill Analysis
        </h1>
        <p className="text-slate-400">Identify gaps between your current skills and your target career</p>
      </div>

      {!hasAssessments ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Take an Assessment First</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Complete at least one assessment to unlock your personalized skill analysis and identify your strengths and areas for improvement.
          </p>
          <Link href="/assessments" className="btn-primary inline-flex">
            Go to Assessments <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl">
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Identified Skill Gaps</h2>
            </div>
            {skillGaps.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-slate-300 font-medium text-lg">All skills are on track!</p>
                <p className="text-sm text-slate-500">Complete more assessments to discover additional skill areas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillGaps.map((skill, i) => (
                  <motion.div key={skill.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {skill.name}
                      </h3>
                      <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{skill.category}</p>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-white/5">
                      <button onClick={() => handleViewLearningPath(skill)} className="text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-2 transition-all hover:gap-3">
                        {learningPlans[skill.name] ? "View Learning Plan" : "Generate Learning Plan"} <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Learning Path Modal */}
      <AnimatePresence>
        {(loadingPath || learningPath) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setLearningPath(null); setLoadingPath(false); }} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-3xl bg-[#0F172A] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
              <button onClick={() => { setLearningPath(null); setLoadingPath(false); }} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>

              {loadingPath ? (
                <div className="py-16 text-center">
                  <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Generating Learning Path...</h3>
                  <p className="text-slate-400">AI is creating your personalized roadmap for {learningPathSkill}</p>
                </div>
              ) : learningPath && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-2 pr-8">Learning Path: {learningPathSkill}</h2>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="flex items-center gap-1.5 text-sm text-slate-400"><Calendar className="w-4 h-4" /> {learningPath.totalWeeks} weeks</span>
                    <span className="flex items-center gap-1.5 text-sm text-slate-400"><Clock className="w-4 h-4" /> {learningPath.hoursPerWeek} hrs/week</span>
                  </div>
                  <div className="space-y-4">
                    {learningPath.phases.map((phase, i) => {
                      const isDone = learningPlans[learningPathSkill]?.completedPhases?.includes(phase.title);
                      return (
                        <div key={i} className={`p-5 rounded-xl border transition-all ${isDone ? "bg-emerald-500/5 border-emerald-500/20 opacity-80" : "bg-white/[0.03] border-white/5"}`}>
                          <div className="flex items-center gap-3 mb-3">
                            <button 
                              onClick={() => togglePhaseCompletion(learningPathSkill, phase.title)}
                              className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${isDone ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white/5 border-white/10 text-transparent hover:border-cyan-500/50"}`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isDone ? "bg-emerald-500/20 text-emerald-400" : "bg-cyan-500/20 text-cyan-300"}`}>
                              {phase.week}
                            </span>
                            <h4 className={`font-semibold ${isDone ? "text-emerald-200 line-through" : "text-white"}`}>{phase.title}</h4>
                            <span className="ml-auto text-xs text-slate-500">{phase.hoursEstimate}h</span>
                          </div>
                          <p className={`text-sm mb-3 ${isDone ? "text-slate-500" : "text-slate-400"}`}>{phase.goal}</p>
                          <div className="mb-3">
                            <span className="text-xs text-slate-500 uppercase font-semibold">Concepts:</span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {phase.concepts.map(c => (
                                <span key={c} className={`px-2 py-0.5 rounded text-xs border ${isDone ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400/60" : "bg-white/5 border-white/10 text-slate-300"}`}>
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-slate-500 uppercase font-semibold">Resources:</span>
                            <ul className="mt-1.5 space-y-1">
                              {phase.resources.map((r, j) => (
                                <li key={j} className={`text-sm ${isDone ? "text-emerald-500/50" : "text-cyan-400"}`}>
                                  {r.name} <span className="text-slate-600">({r.type})</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
