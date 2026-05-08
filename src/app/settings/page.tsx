"use client";
import { useState } from "react";
import { Settings, Moon, Sun, Bell, Shield, Eye, Trash2, LogOut, ChevronRight, Check, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, useAuthStore } from "@/store";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { theme, toggleTheme } = useAppStore();
  const { user, token, logout } = useAuthStore();
  const router = useRouter();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    achievements: true,
    mentorship: false
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showExperience: true,
    allowAITraining: true
  });

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/delete", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        logout();
        router.push("/");
      } else {
        setError(data.error || "Failed to delete account");
      }
    } catch (e) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl pb-12">
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setShowDeleteModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md glass-card p-8 border-rose-500/20 shadow-2xl shadow-rose-500/10"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
                  <AlertTriangle className="w-8 h-8 text-rose-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Delete Account?</h2>
                <p className="text-slate-400 mb-6">
                  This action is <span className="text-rose-400 font-bold">permanent</span> and <span className="text-rose-400 font-bold">irreversible</span>. You will lose all your progress, assessments, and profile data.
                </p>

                {error && (
                  <div className="w-full p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm mb-6">
                    {error}
                  </div>
                )}
                
                <div className="flex gap-3 w-full">
                  <button 
                    disabled={isDeleting}
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={isDeleting}
                    onClick={handleDeleteAccount}
                    className="flex-1 px-6 py-3 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Delete Forever"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Settings className="w-8 h-8 text-slate-400" /> Settings
        </h1>
        <p className="text-slate-400">Configure your account, preferences, and security</p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-400" /> Appearance
          </h3>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <div className="font-bold text-white">Theme Mode</div>
              <div className="text-xs text-slate-500">Switch between light and dark visual styles</div>
            </div>
            <div className="flex bg-slate-800 p-1 rounded-lg">
              <button 
                onClick={() => theme === "light" && toggleTheme()}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${theme === "dark" ? "bg-indigo-500 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
              >
                <Moon className="w-4 h-4" /> Dark
              </button>
              <button 
                onClick={() => theme === "dark" && toggleTheme()}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${theme === "light" ? "bg-indigo-500 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
              >
                <Sun className="w-4 h-4" /> Light
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" /> Notifications
          </h3>
          <div className="space-y-3">
            {Object.entries(notifications).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="capitalize font-medium text-slate-300">{key} Notifications</div>
                <button 
                  onClick={() => setNotifications({...notifications, [key]: !val})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${val ? "bg-indigo-500" : "bg-slate-700"}`}
                >
                  <motion.div 
                    animate={{ x: val ? 24 : 2 }}
                    className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Data */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" /> Privacy & Data
          </h3>
          <div className="space-y-3">
            {Object.entries(privacy).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="font-medium text-slate-300">
                  {key === "publicProfile" ? "Public Profile Visibility" : key === "showExperience" ? "Show Work Experience" : "Allow AI Data Training"}
                </div>
                <button 
                  onClick={() => setPrivacy({...privacy, [key]: !val})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${val ? "bg-indigo-500" : "bg-slate-700"}`}
                >
                  <motion.div 
                    animate={{ x: val ? 24 : 2 }}
                    className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Account Actions */}
        <div className="glass-card p-6 border-rose-500/10">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-400" /> Account Actions
          </h3>
          <div className="space-y-3">
            <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all text-slate-300 group">
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-slate-500 group-hover:text-rose-400" />
                <span>Sign Out of Nexora</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {
                setError(null);
                setShowDeleteModal(true);
              }} 
              className="w-full flex items-center justify-between p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all text-rose-400 group"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-rose-500" />
                <span>Delete Account & Data</span>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-rose-800">Irreversible</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
