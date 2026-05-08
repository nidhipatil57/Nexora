"use client";
import { useEffect, useState } from "react";
import { Bell, Trophy, Target, Star, AlertCircle, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store";

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const iconMap: Record<string, any> = {
  achievement: Trophy,
  insight: Star,
  alert: AlertCircle,
  reminder: Target,
};

const colorMap: Record<string, string> = {
  achievement: "text-amber-400 bg-amber-400/10",
  insight: "text-indigo-400 bg-indigo-400/10",
  alert: "text-rose-400 bg-rose-400/10",
  reminder: "text-emerald-400 bg-emerald-400/10",
};

export default function NotificationsPage() {
  const { token } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Bell className="w-8 h-8 text-cyan-400" /> Notifications
          </h1>
          <p className="text-slate-400">Updates, insights, and reminders</p>
        </div>
        <button 
          onClick={markAllRead}
          className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-2"
        >
          <Check className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-slate-500">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <Bell className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-1">No notifications yet</h3>
            <p className="text-slate-500">We'll notify you when something important happens.</p>
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((notif, i) => {
              const Icon = iconMap[notif.type] || Bell;
              const colorClass = colorMap[notif.type] || "text-slate-400 bg-white/5";
              
              return (
                <motion.div 
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-card p-5 flex items-start gap-4 transition-all ${notif.read ? 'opacity-70' : 'border-l-2 border-l-indigo-500 bg-white/[0.02]'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-bold ${notif.read ? 'text-slate-300' : 'text-white'}`}>{notif.title}</h3>
                      <span className="text-xs text-slate-500 shrink-0">
                        {formatRelativeTime(new Date(notif.createdAt))} ago
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{notif.message}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
