"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Edit3, Wand2, Eye, ArrowRight, ArrowLeft, Loader2, Check } from "lucide-react";
import { useAuthStore } from "@/store";

interface ResumeData {
  summary: string;
  experience: { title: string; company: string; period: string; bullets: string[] }[];
  education: { degree: string; institution: string; year: string }[];
  skills: string[];
  projects: { name: string; description: string; tech: string[] }[];
  languages: string[];
  certifications: string[];
}

const tones = [
  { id: "corporate", name: "Corporate", desc: "Professional & Metrics-driven", color: "from-slate-800 to-slate-900" },
  { id: "creative", name: "Creative", desc: "Bold, narrative & unique", color: "from-indigo-500 to-blue-600" },
  { id: "minimal", name: "Minimal", desc: "Concise & straight to the point", color: "from-slate-500 to-slate-700" },
  { id: "modern", name: "Modern", desc: "Balanced & trend-aware", color: "from-rose-500 to-pink-600" },
];

export default function ResumePage() {
  const { user, token } = useAuthStore();
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [selectedTone, setSelectedTone] = useState("corporate");
  const [editing, setEditing] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    location: "",
    skills: "",
    languages: "",
    experience: "",
    education: "",
    projects: "",
  });

  const handleGenerate = async () => {
    if (!token) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, template: selectedTone }),
      });
      const data = await res.json();
      if (data.success) {
        setResumeData(data.resumeData);
        setStep(3);
      }
    } catch (e) { console.error(e); }
    finally { setGenerating(false); }
  };

  const handleDownload = () => {
    if (!previewRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`<html><head><title>${form.name} - Resume</title><style>
      @page { size: A4; margin: 0; }
      body{font-family:system-ui,-apple-system,sans-serif;margin:0;padding:0;color:#1a1a2e;line-height:1.4;background:#fff}
      .res-container{display:flex;min-height:297mm;width:210mm;margin:0 auto;box-sizing:border-box;position:relative}
      .res-sidebar{width:260px;min-width:260px;background:#f0f2f5;padding:40px 25px;border-right:1px solid #ddd;box-sizing:border-box}
      .res-main{flex:1;background:white;min-width:0;box-sizing:border-box}
      .res-header{background:#2c3e50;color:white;padding:40px 50px;text-align:left}
      .res-content{padding:40px 50px}
      .res-section{position:relative;padding-left:30px;margin-bottom:30px;border-left:1px solid #ddd}
      .res-dot{position:absolute;left:-6px;top:4px;width:10px;height:10px;background:#2c3e50;border-radius:50%}
      h1{font-size:28px;margin:0;text-transform:uppercase;letter-spacing:1px;line-height:1.2}
      h2{font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#2c3e50;margin-bottom:12px;border-bottom:1.5px solid #2c3e50;display:inline-block;padding-bottom:2px}
      .res-sidebar-title{font-size:11px;font-weight:bold;text-transform:uppercase;border-bottom:1px solid #ccc;margin-bottom:12px;padding-bottom:4px;color:#333}
      .res-text-small{font-size:10.5px;color:#555;margin-bottom:8px;word-break:break-word}
      .res-item-title{font-weight:bold;font-size:13px;color:#1a1a2e}
      .res-item-subtitle{font-size:11px;color:#666;margin-bottom:5px}
      ul{margin:5px 0;padding-left:18px}li{font-size:11.5px;margin:4px 0;color:#444}
    </style></head><body>${previewRef.current.innerHTML}</body></html>`);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <FileText className="w-8 h-8 text-rose-400" /> Premium Resume Builder
          </h1>
          <p className="text-slate-400">Executive design powered by AI intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${step === s ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : step > s ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-white/5 text-slate-500 border border-white/10"}`}>
              {step > s ? <Check className="w-3 h-3" /> : null} {s === 1 ? "Details" : s === 2 ? "Tone" : "Preview"}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Input Form */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 max-w-3xl">
          <h2 className="text-xl font-bold text-white mb-6">Your Professional Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Riya Sharma" /></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="riya@email.com" /></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
              <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="+91 9876543210" /></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
              <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input-field" placeholder="City, State" /></div>
          </div>
          <div className="mb-4"><label className="block text-sm font-medium text-slate-300 mb-1">Skills</label>
            <input type="text" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} className="input-field" placeholder="React, Python, SQL" /></div>
          <div className="mb-4"><label className="block text-sm font-medium text-slate-300 mb-1">Languages</label>
            <input type="text" value={form.languages} onChange={e => setForm({ ...form, languages: e.target.value })} className="input-field" placeholder="English, Hindi" /></div>
          <div className="mb-4"><label className="block text-sm font-medium text-slate-300 mb-1">Work Experience</label>
            <textarea value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className="input-field !min-h-[100px]" placeholder="Briefly describe your roles..." /></div>
          <div className="mb-4"><label className="block text-sm font-medium text-slate-300 mb-1">Education</label>
            <textarea value={form.education} onChange={e => setForm({ ...form, education: e.target.value })} className="input-field !min-h-[80px]" placeholder="Degree, University, Year..." /></div>
          <div className="mb-6"><label className="block text-sm font-medium text-slate-300 mb-1">Projects</label>
            <textarea value={form.projects} onChange={e => setForm({ ...form, projects: e.target.value })} className="input-field !min-h-[80px]" placeholder="Notable projects..." /></div>
          <div className="flex justify-end">
            <button onClick={() => setStep(2)} disabled={!form.name || !form.skills} className="btn-primary">Next: Choose Tone <ArrowRight className="w-4 h-4" /></button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Tone Selection */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-bold text-white mb-6">Select Writing Tone</h2>
          <p className="text-slate-400 mb-8">AI will rewrite your content to match this professional vibe</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {tones.map(t => (
              <button key={t.id} onClick={() => setSelectedTone(t.id)} className={`p-4 rounded-xl border-2 transition-all text-left ${selectedTone === t.id ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
                <div className={`h-24 rounded-lg bg-gradient-to-br ${t.color} mb-3`} />
                <h4 className="font-semibold text-white text-sm">{t.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{t.desc}</p>
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="btn-ghost flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Back</button>
            <button onClick={handleGenerate} disabled={generating} className="btn-primary">
              {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Writing...</> : <><Wand2 className="w-4 h-4" /> Generate Premium Resume</>}
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Preview */}
      {step === 3 && resumeData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setStep(2)} className="btn-ghost flex items-center gap-1 text-slate-400"><ArrowLeft className="w-4 h-4" /> Change Tone</button>
            <div className="flex gap-2">
              <button onClick={() => setEditing(!editing)} className={`p-2 rounded-lg transition-colors ${editing ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-slate-300"}`}><Edit3 className="w-4 h-4" /></button>
              <button onClick={handleDownload} className="btn-primary !py-2"><Download className="w-4 h-4" /> Download PDF</button>
            </div>
          </div>

          <div className="glass-card p-1 bg-slate-900/50 shadow-2xl overflow-x-auto">
            <div ref={previewRef} className="bg-white rounded shadow-2xl text-slate-800 overflow-hidden mx-auto" style={{ width: '210mm', minHeight: '297mm' }} contentEditable={editing} suppressContentEditableWarning>
              <div className="res-container" style={{ display: 'flex', minHeight: '297mm', width: '100%', position: 'relative' }}>
                {/* Sidebar */}
                <div className="res-sidebar" style={{ width: '260px', minWidth: '260px', background: '#f0f2f5', padding: '40px 25px', borderRight: '1px solid #ddd', boxSizing: 'border-box' }}>
                  <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: '#ddd', margin: '0 auto 35px', border: '4px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }} />
                  
                  <div style={{ marginBottom: '35px' }}>
                    <div className="res-sidebar-title" style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #ccc', marginBottom: '12px', paddingBottom: '4px', color: '#333' }}>Contact</div>
                    <div className="res-text-small" style={{ fontSize: '10.5px', marginBottom: '8px', color: '#555' }}>📞 {form.phone}</div>
                    <div className="res-text-small" style={{ fontSize: '10.5px', marginBottom: '8px', color: '#555' }}>✉️ {form.email}</div>
                    <div className="res-text-small" style={{ fontSize: '10.5px', marginBottom: '8px', color: '#555' }}>📍 {form.location}</div>
                  </div>

                  {resumeData.languages?.length > 0 && (
                    <div style={{ marginBottom: '35px' }}>
                      <div className="res-sidebar-title" style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #ccc', marginBottom: '12px', paddingBottom: '4px', color: '#333' }}>Languages</div>
                      {resumeData.languages.map(l => <div key={l} className="res-text-small" style={{ fontSize: '10.5px' }}>• {l}</div>)}
                    </div>
                  )}

                  {resumeData.skills?.length > 0 && (
                    <div style={{ marginBottom: '35px' }}>
                      <div className="res-sidebar-title" style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #ccc', marginBottom: '12px', paddingBottom: '4px', color: '#333' }}>Core Skills</div>
                      {resumeData.skills.map(s => <div key={s} className="res-text-small" style={{ fontSize: '10.5px', marginBottom: '6px' }}>• {s}</div>)}
                    </div>
                  )}
                </div>

                {/* Main Content */}
                <div className="res-main" style={{ flex: 1, background: 'white', minWidth: 0, boxSizing: 'border-box' }}>
                  <div className="res-header" style={{ background: '#2c3e50', color: 'white', padding: '45px 50px' }}>
                    <h1 style={{ fontSize: '30px', margin: 0, textTransform: 'uppercase', letterSpacing: '1.5px', lineHeight: '1.2' }}>{form.name}</h1>
                    <div style={{ fontSize: '14px', textTransform: 'uppercase', opacity: 0.8, marginTop: '8px', letterSpacing: '1px' }}>Professional Candidate</div>
                  </div>

                  <div className="res-content" style={{ padding: '40px 50px' }}>
                    <div className="res-section" style={{ position: 'relative', paddingLeft: '30px', marginBottom: '35px', borderLeft: '1px solid #ddd' }}>
                      <div className="res-dot" style={{ position: 'absolute', left: '-6px', top: '4px', width: '10px', height: '10px', background: '#2c3e50', borderRadius: '50%' }} />
                      <h2 style={{ fontSize: '13px', textTransform: 'uppercase', borderBottom: '1.5px solid #2c3e50', marginBottom: '12px', display: 'inline-block', paddingBottom: '2px' }}>Career Objective</h2>
                      <p style={{ fontSize: '11.5px', color: '#333', lineHeight: '1.6' }}>{resumeData.summary}</p>
                    </div>

                    {resumeData.experience?.length > 0 && (
                      <div className="res-section" style={{ position: 'relative', paddingLeft: '30px', marginBottom: '35px', borderLeft: '1px solid #ddd' }}>
                        <div className="res-dot" style={{ position: 'absolute', left: '-6px', top: '4px', width: '10px', height: '10px', background: '#2c3e50', borderRadius: '50%' }} />
                        <h2 style={{ fontSize: '13px', textTransform: 'uppercase', borderBottom: '1.5px solid #2c3e50', marginBottom: '12px', display: 'inline-block', paddingBottom: '2px' }}>Professional Experience</h2>
                        {resumeData.experience.map((exp, i) => (
                          <div key={i} style={{ marginBottom: '20px' }}>
                            <div className="res-item-title" style={{ fontWeight: 'bold', fontSize: '13px', color: '#1a1a2e' }}>{exp.title} | {exp.company}</div>
                            <div className="res-item-subtitle" style={{ fontSize: '11px', color: '#666', margin: '2px 0 6px' }}>{exp.period}</div>
                            <ul style={{ paddingLeft: '18px' }}>
                              {exp.bullets.map((b, j) => <li key={j} style={{ fontSize: '11.5px', color: '#444', marginBottom: '4px' }}>{b}</li>)}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="res-section" style={{ position: 'relative', paddingLeft: '30px', marginBottom: '35px', borderLeft: '1px solid #ddd' }}>
                      <div className="res-dot" style={{ position: 'absolute', left: '-6px', top: '4px', width: '10px', height: '10px', background: '#2c3e50', borderRadius: '50%' }} />
                      <h2 style={{ fontSize: '13px', textTransform: 'uppercase', borderBottom: '1.5px solid #2c3e50', marginBottom: '12px', display: 'inline-block', paddingBottom: '2px' }}>Education</h2>
                      {resumeData.education.map((edu, i) => (
                        <div key={i} style={{ marginBottom: '12px' }}>
                          <div className="res-item-title" style={{ fontWeight: 'bold', fontSize: '13px', color: '#1a1a2e' }}>{edu.degree}</div>
                          <div className="res-item-subtitle" style={{ fontSize: '11.5px', color: '#666' }}>{edu.institution} | {edu.year}</div>
                        </div>
                      ))}
                    </div>

                    {resumeData.projects?.length > 0 && (
                      <div className="res-section" style={{ position: 'relative', paddingLeft: '30px', borderLeft: '1px solid #ddd' }}>
                        <div className="res-dot" style={{ position: 'absolute', left: '-6px', top: '4px', width: '10px', height: '10px', background: '#2c3e50', borderRadius: '50%' }} />
                        <h2 style={{ fontSize: '13px', textTransform: 'uppercase', borderBottom: '1.5px solid #2c3e50', marginBottom: '12px', display: 'inline-block', paddingBottom: '2px' }}>Academic Projects</h2>
                        {resumeData.projects.map((p, i) => (
                          <div key={i} style={{ marginBottom: '15px' }}>
                            <div className="res-item-title" style={{ fontWeight: 'bold', fontSize: '13px', color: '#1a1a2e' }}>{p.name}</div>
                            <p style={{ fontSize: '11.5px', color: '#555', margin: '4px 0', lineHeight: '1.5' }}>{p.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
