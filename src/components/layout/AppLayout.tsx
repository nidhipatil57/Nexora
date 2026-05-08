"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, useAppStore } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, LayoutDashboard, Compass, Target, Route, MessageSquare, FileText, BarChart3, BookOpen, Settings, LogOut, Trophy, Bell, Menu, X, ChevronLeft, Brain, Layers, User } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useEffect } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/careers", icon: Compass, label: "Career Explorer" },
  { href: "/skills", icon: Target, label: "Skill Analysis" },
  { href: "/assessments", icon: Brain, label: "Assessments" },
  { href: "/pathways", icon: Route, label: "Career Pathways" },
  { href: "/mentor", icon: MessageSquare, label: "AI Mentor" },
  { href: "/resume", icon: FileText, label: "Resume Builder" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/learn", icon: BookOpen, label: "Learning Center" },
  { href: "/deep-dive", icon: Layers, label: "Deep Dive" },
];

const adminItems = [
  { href: "/admin", icon: BarChart3, label: "Admin Panel" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isHydrated } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/login");
    }
  }, [user, isHydrated, router]);

  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen bg-[#05050A] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[#05050A]" />
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 10% 40%, rgba(8, 145, 178, 0.2), transparent 60%), radial-gradient(circle at 90% 20%, rgba(124, 58, 237, 0.2), transparent 60%)'
          }}
        />
        <Sparkles className="w-8 h-8 text-indigo-500 animate-pulse relative z-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05050A] relative">
      {/* Premium Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 15% 35%, rgba(8, 145, 178, 0.25), transparent 50%), radial-gradient(circle at 85% 25%, rgba(124, 58, 237, 0.25), transparent 50%), radial-gradient(circle at 50% 90%, rgba(99, 102, 241, 0.15), transparent 50%)'
          }}
        />
        <svg 
          className="absolute inset-0 h-full w-full stroke-white/[0.06]" 
          style={{ maskImage: 'linear-gradient(to bottom, white 10%, rgba(255,255,255,0.5) 50%, white 90%)', WebkitMaskImage: 'linear-gradient(to bottom, white 10%, rgba(255,255,255,0.5) 50%, white 90%)' }} 
        >
          <defs>
            <pattern id="layout-grid" width="100" height="100" x="50%" y="-1" patternUnits="userSpaceOnUse">
              <path d="M.5 100V.5H100" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#layout-grid)" />
        </svg>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm" onClick={toggleSidebar} />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""} lg:translate-x-0 !bg-[#05050A]/80 backdrop-blur-xl`}>
          <div className="flex items-center justify-between mb-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col pt-1">
                <span className="text-lg font-bold text-white tracking-tight leading-none">Nexora</span>
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.15em] font-display mt-0.5">Your Tech Assistant</span>
              </div>
            </Link>
            <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 mb-3">Main</div>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={`sidebar-link ${pathname === item.href ? "active" : ""}`}>
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            ))}

            {user.role === "admin" && (
              <>
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 mt-6 mb-3">Admin</div>
                {adminItems.map((item) => (
                  <Link key={item.href} href={item.href} className={`sidebar-link ${pathname === item.href ? "active" : ""}`}>
                    <item.icon className="w-[18px] h-[18px]" />
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* User section */}
          <div className="border-t border-white/5 pt-4 space-y-1">
            <Link href="/settings" className={`sidebar-link ${pathname === "/settings" ? "active" : ""}`}>
              <Settings className="w-[18px] h-[18px]" /> Settings
            </Link>
            <button onClick={() => { logout(); router.push("/"); }} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <LogOut className="w-[18px] h-[18px]" /> Sign Out
            </button>
            <div className="flex items-center gap-3 px-3 pt-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                {getInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{user.name}</div>
                <div className="text-xs text-slate-500 truncate">{user.email}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="main-content">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4 ml-auto">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-sm text-indigo-300 font-medium">{user.xp} XP</span>
              </div>
              <Link href="/notifications" className="relative text-slate-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-500" />
              </Link>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
