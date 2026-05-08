"use client";
import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, TrendingDown, Activity, Globe, Cpu, Target, Zap, BookOpen, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store";

const industryTrends = [
  { title: "AI/ML Engineers", growth: "+45%", type: "growing", icon: Cpu, importance: "Critical", benefits: "Highest salaries, remote-first, massive demand across all industries", learn: "Python, TensorFlow, PyTorch, Statistics" },
  { title: "Cloud Architects", growth: "+38%", type: "growing", icon: Globe, importance: "High", benefits: "Enterprise demand, lucrative certifications, leadership path", learn: "AWS, Azure, GCP, Infrastructure as Code" },
  { title: "Cybersecurity Analysts", growth: "+32%", type: "growing", icon: Activity, importance: "Critical", benefits: "Job security, government contracts, constantly evolving field", learn: "Network Security, Ethical Hacking, Compliance" },
  { title: "Full-Stack Developers", growth: "+25%", type: "growing", icon: Zap, importance: "High", benefits: "Versatile role, startup opportunities, freelance potential", learn: "React, Node.js, Databases, DevOps" },
  { title: "Data Privacy Officers", growth: "+28%", type: "growing", icon: Target, importance: "High", benefits: "Regulatory demand, cross-industry, C-suite pathway", learn: "GDPR, CCPA, Risk Management, Legal Tech" },
  { title: "Manual Data Entry", growth: "-65%", type: "declining", icon: TrendingDown, importance: "Low", benefits: "Being automated — transition to data analysis recommended", learn: "Excel Advanced, SQL, Power BI, Python basics" },
];

const skillsDemand = [
  { skill: "Python", demand: 95, category: "Programming" },
  { skill: "React/Next.js", demand: 88, category: "Frontend" },
  { skill: "AWS/Cloud", demand: 85, category: "Infrastructure" },
  { skill: "Machine Learning", demand: 82, category: "AI/ML" },
  { skill: "TypeScript", demand: 80, category: "Programming" },
  { skill: "Docker/K8s", demand: 78, category: "DevOps" },
  { skill: "UI/UX Design", demand: 75, category: "Design" },
  { skill: "Blockchain", demand: 45, category: "Emerging" },
];

export default function AnalyticsPage() {
  const { token } = useAuthStore();
  const [userStats, setUserStats] = useState({ assessments: 0, avgScore: 0, skills: 0, matches: 0 });
  const [selectedTrend, setSelectedTrend] = useState<typeof industryTrends[0] | null>(null);

  useEffect(() => {
    async function fetchStats() {
      if (!token) return;
      try {
        const [statsRes, assessRes] = await Promise.all([
          fetch("/api/dashboard/stats", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/assessments", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const statsData = await statsRes.json();
        const assessData = await assessRes.json();
        if (statsData.success) {
          const assessments = assessData.success ? assessData.assessments : [];
          const avgScore = assessments.length > 0 ? Math.round(assessments.reduce((s: number, a: any) => s + (a.score || 0), 0) / assessments.length) : 0;
          setUserStats({ assessments: assessments.length, avgScore, skills: statsData.stats.skills, matches: statsData.stats.matches });
        }
      } catch (e) { console.error(e); }
    }
    fetchStats();
  }, [token]);

  const userPosition = userStats.avgScore >= 80 ? "Top 10%" : userStats.avgScore >= 60 ? "Top 30%" : userStats.avgScore >= 40 ? "Top 50%" : userStats.assessments > 0 ? "Building Profile" : "Not Assessed";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2"><BarChart3 className="w-8 h-8 text-amber-400" /> Analytics & Market Position</h1>
      </div>

      {/* Industry Trends */}
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-400" /> Industry Trends & What to Learn</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {industryTrends.map((trend, i) => (
          <motion.div key={trend.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            onClick={() => setSelectedTrend(trend)}
            className="glass-card p-5 cursor-pointer hover:border-indigo-500/30 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${trend.type === "growing" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                <trend.icon className="w-5 h-5" />
              </div>
              <span className={`text-sm font-bold ${trend.type === "growing" ? "text-emerald-400" : "text-rose-400"}`}>{trend.growth}</span>
            </div>
            <h3 className="font-semibold text-white mb-1">{trend.title}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${trend.importance === "Critical" ? "bg-rose-500/20 text-rose-300" : trend.importance === "High" ? "bg-amber-500/20 text-amber-300" : "bg-slate-500/20 text-slate-400"}`}>{trend.importance}</span>
              <span className="text-xs text-slate-500">5-yr outlook</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trend Detail */}
      {selectedTrend && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-8 border-indigo-500/20">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><selectedTrend.icon className="w-5 h-5 text-indigo-400" /> {selectedTrend.title}</h3>
            <button onClick={() => setSelectedTrend(null)} className="text-slate-500 hover:text-white text-sm">Close ✕</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5"><div className="text-xs text-slate-500 mb-1 uppercase font-semibold">Benefits</div><p className="text-sm text-slate-300">{selectedTrend.benefits}</p></div>
            <div className="p-4 rounded-xl bg-white/5"><div className="text-xs text-slate-500 mb-1 uppercase font-semibold">What to Learn</div><p className="text-sm text-cyan-300">{selectedTrend.learn}</p></div>
            <div className="p-4 rounded-xl bg-white/5"><div className="text-xs text-slate-500 mb-1 uppercase font-semibold">Importance</div><p className="text-sm text-white">{selectedTrend.importance} — {selectedTrend.growth} growth projected over 5 years</p></div>
          </div>
        </motion.div>
      )}

      {/* Skills Demand */}
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-cyan-400" /> Skills Demand Heatmap</h2>
      <div className="glass-card p-6">
        <div className="space-y-4">
          {skillsDemand.map(item => (
            <div key={item.skill}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">{item.skill} <span className="text-xs text-slate-600 ml-1">{item.category}</span></span>
                <span className="text-slate-500">{item.demand}/100</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${item.demand}%` }} transition={{ duration: 1 }}
                  className={`h-full rounded-full ${item.demand > 80 ? "bg-emerald-500" : item.demand > 60 ? "bg-amber-500" : "bg-rose-500"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
