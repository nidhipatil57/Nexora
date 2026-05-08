"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, AlertCircle, Plus, MessageSquare, Edit2, Trash2, Check, X, MoreVertical } from "lucide-react";
import { useAuthStore } from "@/store";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Session {
  id: string;
  title: string;
  updatedAt: string;
}

export default function MentorPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Hi there! I'm your Nexora AI mentor. I'm here to help you navigate your career, prepare for interviews, or just talk through your options. What's on your mind today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [dropdownOpenForId, setDropdownOpenForId] = useState<string | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);
  
  const { token, user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  useEffect(() => {
    async function fetchSessions() {
      if (!token) return;
      try {
        const res = await fetch("/api/chat", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success && data.sessions.length > 0) {
          setSessions(data.sessions);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchSessions();
  }, [token]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !token) return;

    const userMessage = { id: Date.now().toString(), role: "user" as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: userMessage.content, sessionId: activeSessionId })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { id: data.message.id, role: "assistant", content: data.message.content }]);
        if (!activeSessionId) {
          setActiveSessionId(data.sessionId);
          // Refresh sessions list
          const sessionsRes = await fetch("/api/chat", { headers: { Authorization: `Bearer ${token}` } });
          const sessionsData = await sessionsRes.json();
          if (sessionsData.success) setSessions(sessionsData.sessions);
        }
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  const loadSession = async (sessionId: string) => {
    if (!token) return;
    setActiveSessionId(sessionId);
    setLoading(true);
    try {
      const res = await fetch(`/api/chat?sessionId=${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startNewSession = () => {
    setActiveSessionId(null);
    setMessages([{ id: Date.now().toString(), role: "assistant", content: "Hi! I'm ready to start a new conversation. What would you like to discuss?" }]);
  };

  const confirmDeleteSession = (e: React.MouseEvent, session: Session) => {
    e.stopPropagation();
    setDropdownOpenForId(null);
    setSessionToDelete(session);
  };

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;
    const sessionId = sessionToDelete.id;
    setSessionToDelete(null);
    try {
      const res = await fetch(`/api/chat?sessionId=${sessionId}`, { 
        method: "DELETE", 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      if (data.success) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        if (activeSessionId === sessionId) startNewSession();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const startRenameSession = (e: React.MouseEvent, session: Session) => {
    e.stopPropagation();
    setDropdownOpenForId(null);
    setEditingSessionId(session.id);
    setEditTitle(session.title);
  };

  const submitRenameSession = async (e: React.MouseEvent | React.FormEvent, sessionId: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!editTitle.trim()) {
      setEditingSessionId(null);
      return;
    }
    try {
      const res = await fetch(`/api/chat/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: editTitle.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: editTitle.trim() } : s));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEditingSessionId(null);
    }
  };


  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      {/* Sidebar for chat history */}
      <div className="w-64 flex-shrink-0 glass-card-static hidden md:flex flex-col z-10">
        <div className="p-4 border-b border-white/5">
          <button onClick={startNewSession} className="btn-primary w-full !py-2.5 text-sm">
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sessions.map(s => (
            <div key={s.id} className={`group relative w-full rounded-lg transition-colors flex items-center ${activeSessionId === s.id ? "bg-indigo-500/20 text-indigo-300" : "text-slate-400 hover:bg-white/5 hover:text-slate-300"}`}>
              {editingSessionId === s.id ? (
                <form onSubmit={(e) => submitRenameSession(e, s.id)} className="flex items-center w-full px-3 py-2.5 gap-2">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <input 
                    autoFocus
                    type="text" 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 bg-slate-800 border border-white/20 rounded px-2 py-0.5 text-sm text-white focus:outline-none focus:border-indigo-500 min-w-0"
                  />
                  <button type="submit" className="p-1 hover:text-emerald-400 shrink-0"><Check className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setEditingSessionId(null); }} className="p-1 hover:text-rose-400 shrink-0"><X className="w-3.5 h-3.5" /></button>
                </form>
              ) : (
                <>
                  <button onClick={() => loadSession(s.id)} className="flex-1 text-left px-3 py-2.5 text-sm flex items-center gap-2 truncate pr-10">
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span className="truncate">{s.title}</span>
                  </button>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpenForId(dropdownOpenForId === s.id ? null : s.id);
                      }} 
                      className={`p-1.5 rounded-md transition-colors ${dropdownOpenForId === s.id ? "bg-white/10 text-white" : "opacity-0 group-hover:opacity-100 hover:bg-white/10 text-slate-400 hover:text-white"}`}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {dropdownOpenForId === s.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpenForId(null);
                          }} 
                        />
                        <div className="absolute right-0 top-full mt-2 w-32 bg-slate-800 border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden py-1">
                          <button 
                            onClick={(e) => startRenameSession(e, s)} 
                            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Rename
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); confirmDeleteSession(e, s); }} 
                            className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 glass-card-static flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Nexora AI Mentor</h2>
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Online
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 max-w-[85%] ${m.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-slate-700" : "bg-gradient-to-br from-indigo-500 to-purple-600"}`}>
                  {m.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`chat-bubble ${m.role}`}>
                  {/* Basic markdown parsing for bold text and lists */}
                  {m.content.split('\n').map((line, i) => {
                    if (line.startsWith('- ') || line.startsWith('* ')) {
                      return <li key={i} className="ml-4 list-disc my-1">{line.substring(2)}</li>;
                    }
                    if (line.match(/^\d+\.\s/)) {
                      return <li key={i} className="ml-4 list-decimal my-1">{line.replace(/^\d+\.\s/, '')}</li>;
                    }
                    return <p key={i} className="my-1">{line}</p>;
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 max-w-[85%]">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="chat-bubble assistant">
                <div className="typing-dots"><span /><span /><span /></div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/5 bg-[#0A0A19]">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your career, interviews, or skills..." 
              className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              className="absolute right-2 p-2 rounded-lg bg-indigo-500 text-white disabled:opacity-50 disabled:bg-slate-700 hover:bg-indigo-600 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center gap-2 justify-center mt-3 text-xs text-slate-500">
            <AlertCircle className="w-3 h-3" />
            <span>AI can make mistakes. Always verify important career decisions.</span>
          </div>
        </div>
      </div>
      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {sessionToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Delete Chat?</h3>
              <p className="text-slate-400 text-sm mb-6">
                Are you sure you want to delete <span className="text-white font-medium">"{sessionToDelete.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setSessionToDelete(null)} 
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteSession} 
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
