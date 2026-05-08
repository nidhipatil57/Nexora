"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store";
import { Sparkles, TrendingUp, Target, Zap, ArrowRight, Brain, BookOpen, Trophy, Flame, BarChart3 } from "lucide-react";
import Link from "next/link";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

interface DashboardStats {
  careerScore: number;
  matches: number;
  skills: number;
  streak: number;
}

function CareerScoreRing({ score }: { score: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative w-44 h-44 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <motion.circle
          cx="80" cy="80" r={radius} fill="none"
          stroke="url(#scoreGradient)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-4xl font-bold text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          {score}
        </motion.span>
        <span className="text-xs text-slate-500 mt-1">Career Score</span>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, change, color }: { icon: React.ElementType; label: string; value: string; change: string; color: string }) {
  return (
    <motion.div variants={fadeUp} className="stat-card">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-xs text-emerald-400 font-medium">{change}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user, token, isNewUser } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({ careerScore: 0, matches: 0, skills: 0, streak: 0 });
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      if (!token) return;
      try {
        const res = await fetch("/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setStatsLoaded(true);
      }
    }
    fetchStats();
  }, [token]);

  const quickActions = [
    { icon: Brain, title: "Take Assessment", desc: "Discover your strengths", href: "/assessments", color: "from-indigo-500 to-purple-600" },
    { icon: Target, title: "Explore Careers", desc: "Find your best match", href: "/careers", color: "from-cyan-500 to-blue-600" },
    { icon: Sparkles, title: "Chat with AI", desc: "Get personalized advice", href: "/mentor", color: "from-purple-500 to-pink-600" },
    { icon: BookOpen, title: "Start Learning", desc: "Close skill gaps", href: "/learn", color: "from-emerald-500 to-teal-600" },
  ];

  const getScoreMessage = (score: number) => {
    if (score === 0) return "Complete assessments to build your career score";
    if (score < 30) return "You're just getting started — keep going!";
    if (score < 60) return "Making progress on your career readiness";
    if (score < 80) return "Your career readiness is above average";
    return "Excellent! You're highly career-ready";
  };

  return (
    <div>
      {/* Welcome section */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2">
          {isNewUser
            ? <>Welcome, {user?.name?.split(" ")[0]} 👋</>
            : <>Welcome back, {user?.name?.split(" ")[0]} ✨</>
          }
        </h1>
        <p className="text-slate-400">
          {isNewUser
            ? "Let's start building your career intelligence profile"
            : "Here\u0027s your career intelligence overview"
          }
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-stretch">
        {/* Career Score */}
        <motion.div className="glass-card-static p-8 flex flex-col justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Career Readiness</h3>
            {stats.careerScore > 0 && <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">Score Active</span>}
          </div>
          <CareerScoreRing score={stats.careerScore} />
          <p className="text-center text-sm text-slate-400 mt-6 font-medium">{getScoreMessage(stats.careerScore)}</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
            <StatCard icon={Target} label="Career Matches" value={String(stats.matches)} change={stats.matches > 0 ? `${stats.matches} found` : "None yet"} color="from-indigo-500 to-purple-600" />
            <StatCard icon={Flame} label="Day Streak" value={String(stats.streak)} change={stats.streak > 0 ? "Keep going!" : "Start today!"} color="from-amber-500 to-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-lg font-semibold text-white mb-4">
          {isNewUser ? "Get Started" : "Quick Actions"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href} className="glass-card p-5 group">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{action.title}</h3>
              <p className="text-xs text-slate-500">{action.desc}</p>
              <ArrowRight className="w-4 h-4 text-slate-600 mt-3 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </motion.div>

      {/* AI Insights — only show for returning users with activity */}
      {!isNewUser && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-lg font-semibold text-white mb-4">AI Insights</h2>
          <div className="glass-card-static p-1">
            {stats.matches === 0 && stats.skills === 0 ? (
              <div className="flex items-center gap-4 p-6 text-center justify-center">
                <p className="text-sm text-slate-500">Complete assessments and explore careers to see personalized AI insights here.</p>
              </div>
            ) : (
              <>
                {stats.matches > 0 && (
                  <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
                    <p className="text-sm text-slate-300 flex-1">You have {stats.matches} career matches based on your profile</p>
                    <span className="text-xs text-slate-600 shrink-0">Recent</span>
                  </div>
                )}
                {stats.skills > 0 && (
                  <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <Target className="w-5 h-5 text-amber-400 shrink-0" />
                    <p className="text-sm text-slate-300 flex-1">Tracking {stats.skills} skills — keep building your profile</p>
                    <span className="text-xs text-slate-600 shrink-0">Active</span>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* New User CTA */}
      {isNewUser && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="glass-card p-8 text-center bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-500/20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Start Your Career Journey</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Take your first assessment to unlock personalized career recommendations, skill analysis, and AI-powered insights.
            </p>
            <Link href="/assessments" className="btn-primary inline-flex">
              Take First Assessment <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
