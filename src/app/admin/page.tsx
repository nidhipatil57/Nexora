"use client";
import { useState, useEffect } from "react";
import { Shield, Users, FileText, Route, Brain, TrendingUp, Search, MoreVertical, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store";

interface AdminStats {
  users: number;
  assessments: number;
  resumes: number;
  pathways: number;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  xp: number;
  level: number;
}

export default function AdminPage() {
  const { user, token } = useAuthStore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAdminData() {
      if (!token) return;
      try {
        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRecentUsers(data.recentUsers);
        } else {
          setError(data.error || "Access Denied");
        }
      } catch (e) {
        setError("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    }
    fetchAdminData();
  }, [token]);

  if (user?.role !== "ADMIN" && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-slate-400">You do not have the required permissions to view this page.</p>
      </div>
    );
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-indigo-400 animate-spin" /></div>;

  return (
    <div className="pb-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Shield className="w-8 h-8 text-indigo-400" /> Admin Dashboard
          </h1>
          <p className="text-slate-400">System overview and user management</p>
        </div>
        <div className="px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-bold">
          Admin Session Active
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-400">+12%</span>
          </div>
          <div className="text-2xl font-black text-white">{stats?.users}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Users</div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-400">+5%</span>
          </div>
          <div className="text-2xl font-black text-white">{stats?.assessments}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Assessments Taken</div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-400">+18%</span>
          </div>
          <div className="text-2xl font-black text-white">{stats?.resumes}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Resumes Generated</div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Route className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-400">+22%</span>
          </div>
          <div className="text-2xl font-black text-white">{stats?.pathways}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Career Pathways</div>
        </div>
      </div>

      {/* User Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Recent Users</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search users..."
              className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-white/5">
                <th className="px-6 py-4 font-black">User</th>
                <th className="px-6 py-4 font-black">Joined</th>
                <th className="px-6 py-4 font-black">Stats</th>
                <th className="px-6 py-4 font-black">Status</th>
                <th className="px-6 py-4 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-300">Lvl {u.level}</span>
                      <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: '40%' }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase border border-emerald-500/20">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
