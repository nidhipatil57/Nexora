"use client";
import { useState, useEffect } from "react";
import { BookOpen, Video, PlayCircle, ExternalLink, Star, Clock, CheckCircle2, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store";

import { curatedCourses, Course } from "./courses";

export default function LearnPage() {
  const { user, token } = useAuthStore();
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<Course[]>(curatedCourses);
  const [filter, setFilter] = useState("all");
  const [continueCourse, setContinueCourse] = useState<Course | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [player, setPlayer] = useState<any>(null);

  // Load progress from localStorage
  useEffect(() => {
    if (!user) return;
    
    const progressKey = `nexora-progress-${user.id}`;
    const saved = localStorage.getItem(progressKey);
    
    if (saved) {
      const progress: Record<string, { percent: number; time: number }> = JSON.parse(saved);
      setCourses(prev => prev.map(c => ({ 
        ...c, 
        progress: progress[c.id]?.percent || 0,
        lastTime: progress[c.id]?.time || 0
      })));
      
      const inProgress = curatedCourses.filter(c => {
        const p = progress[c.id]?.percent || 0;
        return p > 0 && p < 100;
      });
      
      if (inProgress.length > 0) {
        const sorted = inProgress.sort((a, b) => {
          const pA = progress[a.id]?.percent || 0;
          const pB = progress[b.id]?.percent || 0;
          return pB - pA;
        });
        const last = sorted[0];
        setContinueCourse({ 
          ...last, 
          progress: progress[last.id]?.percent || 0,
          lastTime: progress[last.id]?.time || 0
        });
      }
    } else {
      // If no progress for this user, ensure courses are reset to 0
      setCourses(curatedCourses.map(c => ({ ...c, progress: 0 })));
    }
  }, [user]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  const saveProgress = (courseId: string, percent: number, time: number) => {
    if (!user) return;
    const progressKey = `nexora-progress-${user.id}`;
    const saved = JSON.parse(localStorage.getItem(progressKey) || "{}");
    saved[courseId] = { percent, time };
    localStorage.setItem(progressKey, JSON.stringify(saved));
    
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, progress: percent } : c));
    
    if (percent < 100) {
      const course = courses.find(c => c.id === courseId);
      if (course) setContinueCourse({ ...course, progress: percent });
    } else {
      setContinueCourse(null);
    }
  };

  const handleStartWatching = (course: Course) => {
    setSelectedCourse(course);
  };

  const extractVideoId = (url: string) => {
    const match = url.match(/[?&]v=([^&#]+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (selectedCourse && window.YT) {
      const videoId = extractVideoId(selectedCourse.url);
      if (!videoId) return;

      const newPlayer = new window.YT.Player("youtube-player", {
        videoId: videoId,
        playerVars: {
          start: Math.floor(selectedCourse.lastTime || 0),
          autoplay: 1,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              saveProgress(selectedCourse.id, 100, 0);
              setTimeout(() => setSelectedCourse(null), 2000);
            }
            if (event.data === window.YT.PlayerState.PAUSED) {
              const time = event.target.getCurrentTime();
              const duration = event.target.getDuration();
              const percent = Math.floor((time / duration) * 100);
              saveProgress(selectedCourse.id, Math.max(1, percent), time);
            }
          },
        },
      });
      setPlayer(newPlayer);

      return () => {
        if (newPlayer.destroy) newPlayer.destroy();
      };
    }
  }, [selectedCourse]);

  const skills = ["all", "Python", "JavaScript", "React", "AI/ML", "Business", "Finance", "Engineering", "UI/UX Design", "Cyber Security"];
  
  const filtered = courses.filter(c => {
    // If a filter is selected (other than 'all'), match by skill or title
    const matchesFilter = filter === "all" || 
                          c.skill.toLowerCase().includes(filter.toLowerCase()) ||
                          c.title.toLowerCase().includes(filter.toLowerCase());
    
    // Search matches title, channel, or skill
    const matchesSearch = !search || 
                          c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.channel.toLowerCase().includes(search.toLowerCase()) ||
                          c.skill.toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  }).sort((a, b) => b.priority - a.priority);
  const inProgressCount = courses.filter(c => c.progress > 0 && c.progress < 100).length;
  const completedCount = courses.filter(c => c.progress === 100).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2"><BookOpen className="w-8 h-8 text-indigo-400" /> Learning Center</h1>
        <p className="text-slate-400">Curated video courses to close your skill gaps</p>
      </div>



      {/* Search & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-3 relative">
          <PlayCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search 100+ courses (e.g. Docker, Java, Figma, Soft Skills...)"
            className="input-field !pl-12"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (e.target.value) setFilter("all");
            }}
          />
        </div>
        <div className="glass-card p-4 flex items-center justify-center text-xs text-slate-500">
          Showing {filtered.length} courses
        </div>
      </div>

      {/* Filter Topics */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Popular Topics</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map(s => (
            <button key={s} onClick={() => { setFilter(s); setSearch(""); }} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === s ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 border border-indigo-400" : "bg-white/5 text-slate-400 border border-white/10 hover:border-white/20 hover:bg-white/10"}`}>
              {s === "all" ? "Explore All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-4 text-center"><div className="text-2xl font-bold text-white">{courses.length}</div><div className="text-xs text-slate-500">Total Courses</div></div>
        <div className="glass-card p-4 text-center"><div className="text-2xl font-bold text-emerald-400">{completedCount}</div><div className="text-xs text-slate-500">Completed</div></div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course, i) => (
          <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card overflow-hidden group">
            <div className="h-28 bg-gradient-to-br from-indigo-900/60 to-purple-900/60 relative flex items-center justify-center cursor-pointer" onClick={() => handleStartWatching(course)}>
              <span className="text-4xl">{course.thumbnail}</span>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <PlayCircle className="w-10 h-10 text-white/70 group-hover:text-white group-hover:scale-110 transition-all" />
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-slate-300">{course.skill}</span>
                <span className="text-xs text-slate-500">{course.channel}</span>
              </div>
              <h4 className="font-bold text-white mb-3 text-sm line-clamp-2">{course.title}</h4>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</div>
                {course.progress === 100 && (
                  <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div id="youtube-player" className="w-full h-full" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                <h3 className="text-xl font-bold text-white">{selectedCourse.title}</h3>
                <p className="text-slate-400 text-sm">{selectedCourse.channel}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
