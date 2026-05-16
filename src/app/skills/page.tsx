"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, BookOpen, Brain, Loader2, X, Clock, Calendar, Sparkles, Zap, FolderOpen } from "lucide-react";
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
  skillsFocus?: string[];
  projects?: string[];
}

interface LearningPath {
  totalWeeks: number;
  hoursPerWeek: number;
  overview?: string;
  phases: LearningPhase[];
  completedPhases: string[];
}

const priorityConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  high: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "Critical" },
  medium: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Important" },
  low: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Minor" },
};

const phaseColors = [
  "from-blue-500 to-cyan-500",
  "from-indigo-500 to-purple-500",
  "from-purple-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-red-500",
];

export default function SkillsPage() {
  const { token } = useAuthStore();
  const { learningPlans, saveLearningPlan, togglePhaseCompletion } = useAppStore();
  const [hasAssessments, setHasAssessments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loadingPath, setLoadingPath] = useState(false);
  const [showPlan, setShowPlan] = useState(false);

  // Key for the combined plan in the store
  const planKey = "combined-skill-gaps";

  useEffect(() => {
    async function fetchData() {
      if (!token) return;
      try {
        const res = await fetch("/api/assessments", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success && data.assessments.length > 0) {
          setHasAssessments(true);
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

  const handleGeneratePlan = async () => {
    if (!token || skillGaps.length === 0) return;

    // Check if we already have this plan saved
    if (learningPlans[planKey]) {
      setLearningPath(learningPlans[planKey]);
      setShowPlan(true);
      return;
    }

    setLoadingPath(true);
    setShowPlan(true);
    setLearningPath(null);
    try {
      // Send top 2-3 skill gaps
      const topGaps = skillGaps.slice(0, 3);
      const res = await fetch("/api/skills/learning-path", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ skillGaps: topGaps }),
      });
      const data = await res.json();
      if (data.success) {
        const planWithCompleted = { ...data.learningPath, completedPhases: [] };
        setLearningPath(planWithCompleted);
        saveLearningPlan(planKey, planWithCompleted);
      }
    } catch (e) { console.error(e); }
    finally { setLoadingPath(false); }
  };

  const handleRegenerate = async () => {
    if (!token || skillGaps.length === 0) return;
    setLoadingPath(true);
    setLearningPath(null);
    try {
      const topGaps = skillGaps.slice(0, 3);
      const res = await fetch("/api/skills/learning-path", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ skillGaps: topGaps }),
      });
      const data = await res.json();
      if (data.success) {
        const planWithCompleted = { ...data.learningPath, completedPhases: [] };
        setLearningPath(planWithCompleted);
        saveLearningPlan(planKey, planWithCompleted);
      }
    } catch (e) { console.error(e); }
    finally { setLoadingPath(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-cyan-400 animate-spin" /></div>;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Target className="w-8 h-8 text-cyan-400" /> Skill Analysis
          </h1>
          <p className="text-slate-400">Identify gaps and generate a personalized learning plan from your assessments</p>
        </div>
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
        <div className="max-w-5xl space-y-8">
          {/* Strengths Section */}
          {strengths.length > 0 && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Your Strengths</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {strengths.map((s) => (
                  <span key={s} className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skill Gaps Section */}
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Identified Skill Gaps</h2>
                <p className="text-sm text-slate-500">Based on your assessment results</p>
              </div>
            </div>

            {skillGaps.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-slate-300 font-medium text-lg">All skills are on track!</p>
                <p className="text-sm text-slate-500">Complete more assessments to discover additional skill areas.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {skillGaps.map((skill, i) => {
                    const pConfig = priorityConfig[skill.priority] || priorityConfig.medium;
                    const gapPercent = skill.requiredLevel - skill.currentLevel;
                    return (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-white">{skill.name}</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{skill.category}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${pConfig.bg} ${pConfig.border} ${pConfig.color} border`}>
                            {pConfig.label}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Current: {skill.currentLevel}%</span>
                            <span>Target: {skill.requiredLevel}%</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                skill.priority === "high" ? "bg-red-500" : skill.priority === "medium" ? "bg-amber-500" : "bg-emerald-500"
                              }`}
                              style={{ width: `${skill.currentLevel}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs">
                          <AlertTriangle className={`w-3.5 h-3.5 ${pConfig.color}`} />
                          <span className="text-slate-400">{gapPercent} point gap to close</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Generate Learning Plan Button */}
                <div className="flex flex-col items-center pt-6 border-t border-white/5">
                  <button
                    onClick={handleGeneratePlan}
                    disabled={loadingPath}
                    className="btn-primary flex items-center gap-3 !py-4 !px-8 text-base disabled:opacity-50"
                  >
                    {loadingPath ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Generating Plan...</>
                    ) : learningPlans[planKey] ? (
                      <><BookOpen className="w-5 h-5" /> View Learning Plan</>
                    ) : (
                      <><Sparkles className="w-5 h-5" /> Generate Learning Plan</>
                    )}
                  </button>
                  <p className="text-xs text-slate-500 mt-2">
                    AI will create a detailed plan addressing your top {Math.min(skillGaps.length, 3)} skill gap{Math.min(skillGaps.length, 3) > 1 ? "s" : ""}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Learning Plan Full-Page Modal */}
      <AnimatePresence>
        {showPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowPlan(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-[#0F172A] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setShowPlan(false)} className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-10">
                <X className="w-5 h-5" />
              </button>

              {loadingPath ? (
                <div className="py-20 text-center">
                  <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Generating Your Learning Plan...</h3>
                  <p className="text-slate-400">AI is creating a detailed, personalized roadmap for your skill gaps</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {skillGaps.slice(0, 3).map((g) => (
                      <span key={g.name} className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs">{g.name}</span>
                    ))}
                  </div>
                </div>
              ) : learningPath && (
                <>
                  {/* Plan Header */}
                  <div className="mb-8 pr-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-cyan-400" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">AI Learning Plan</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">Your Skill Gap Learning Plan</h2>
                    {learningPath.overview && (
                      <p className="text-slate-400 leading-relaxed">{learningPath.overview}</p>
                    )}

                    <div className="flex items-center gap-6 mt-4">
                      <span className="flex items-center gap-1.5 text-sm text-slate-400">
                        <Calendar className="w-4 h-4 text-indigo-400" /> {learningPath.totalWeeks} weeks
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-slate-400">
                        <Clock className="w-4 h-4 text-indigo-400" /> {learningPath.hoursPerWeek} hrs/week
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-slate-400">
                        <Target className="w-4 h-4 text-indigo-400" /> {skillGaps.slice(0, 3).length} skill gaps
                      </span>
                    </div>

                    {/* Skill gap badges */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {skillGaps.slice(0, 3).map((g) => {
                        const pc = priorityConfig[g.priority] || priorityConfig.medium;
                        return (
                          <span key={g.name} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${pc.bg} ${pc.border} ${pc.color} border`}>
                            {g.name} ({g.currentLevel}% → {g.requiredLevel}%)
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Phases Timeline */}
                  <div className="space-y-6">
                    {learningPath.phases.map((phase, i) => {
                      const isDone = learningPlans[planKey]?.completedPhases?.includes(phase.title);
                      const gradientColor = phaseColors[i % phaseColors.length];
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className={`p-6 rounded-2xl border transition-all ${isDone ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/[0.02] border-white/5"}`}
                        >
                          {/* Phase Header */}
                          <div className="flex items-center gap-3 mb-4">
                            <button
                              onClick={() => togglePhaseCompletion(planKey, phase.title)}
                              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all shrink-0 ${isDone ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white/5 border-white/10 text-transparent hover:border-cyan-500/50"}`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${gradientColor} text-white`}>
                              {phase.week}
                            </div>
                            <h4 className={`text-lg font-bold ${isDone ? "text-emerald-200 line-through" : "text-white"}`}>{phase.title}</h4>
                            <span className="ml-auto text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {phase.hoursEstimate}h
                            </span>
                          </div>

                          {/* Goal */}
                          <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Goal</span>
                            <p className={`text-sm mt-1 ${isDone ? "text-slate-500" : "text-slate-300"}`}>{phase.goal}</p>
                          </div>

                          {/* Skill Focus Tags */}
                          {phase.skillsFocus && phase.skillsFocus.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {phase.skillsFocus.map((sf, j) => (
                                <span key={j} className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 uppercase tracking-wider">
                                  {sf}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Concepts */}
                          <div className="mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Concepts to Learn</span>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {phase.concepts.map((c, j) => (
                                <span key={j} className={`px-2.5 py-1 rounded-lg text-xs border ${isDone ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400/60" : "bg-white/5 border-white/10 text-slate-300"}`}>
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Projects */}
                          {phase.projects && phase.projects.length > 0 && (
                            <div className="mb-4">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                                <FolderOpen className="w-3 h-3" /> Hands-on Projects
                              </span>
                              <ul className="mt-2 space-y-1.5">
                                {phase.projects.map((p, j) => (
                                  <li key={j} className="flex items-start gap-2">
                                    <ArrowRight className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isDone ? "text-emerald-500/50" : "text-cyan-400"}`} />
                                    <span className={`text-sm ${isDone ? "text-slate-500" : "text-slate-300"}`}>{typeof p === "string" ? p : (p as any)?.name || JSON.stringify(p)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Resources */}
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" /> Resources
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                              {phase.resources.map((r, j) => (
                                <div key={j} className={`p-2.5 rounded-lg border ${isDone ? "bg-emerald-500/5 border-emerald-500/10" : "bg-white/[0.03] border-white/5"}`}>
                                  <div className={`text-sm font-medium ${isDone ? "text-emerald-400/60" : "text-cyan-400"}`}>{r.name}</div>
                                  <div className="text-xs text-slate-500 capitalize">{r.type}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Regenerate Button */}
                  <div className="flex justify-center pt-8 border-t border-white/5 mt-8">
                    <button
                      onClick={handleRegenerate}
                      disabled={loadingPath}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" /> Regenerate Plan
                    </button>
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
