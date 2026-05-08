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

const templates = [
  { id: "modern", name: "Modern", desc: "Clean lines with accent colors", color: "from-indigo-500 to-blue-600" },
  { id: "minimal", name: "Minimal", desc: "Simple and elegant", color: "from-slate-500 to-slate-700" },
  { id: "creative", name: "Creative", desc: "Bold layout with personality", color: "from-rose-500 to-pink-600" },
  { id: "corporate", name: "Corporate", desc: "Traditional and professional", color: "from-emerald-500 to-teal-600" },
];

export default function ResumePage() {
  const { user, token } = useAuthStore();
  const [step, setStep] = useState(1); // 1=form, 2=template, 3=preview
  const [generating, setGenerating] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
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
        body: JSON.stringify({ ...form, template: selectedTemplate }),
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
      body{font-family:system-ui,-apple-system,sans-serif;margin:0;padding:40px;color:#1a1a2e;line-height:1.6}
      h1{font-size:28px;margin:0 0 4px}h2{font-size:14px;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #1a1a2e;padding-bottom:4px;margin:20px 0 10px}
      h3{font-size:15px;margin:0}p{margin:4px 0;font-size:13px}ul{margin:4px 0;padding-left:20px}li{font-size:13px;margin:2px 0}
      .subtitle{color:#666;font-size:14px}.contact{color:#666;font-size:12px;display:flex;gap:16px;flex-wrap:wrap}
      .skill-tag{display:inline-block;background:#f0f0f5;padding:2px 10px;border-radius:4px;font-size:12px;margin:2px}
      .period{color:#888;font-size:12px;float:right}
    </style></head><body>${previewRef.current.innerHTML}</body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <FileText className="w-8 h-8 text-rose-400" /> Resume Builder
          </h1>
          <p className="text-slate-400">AI-powered resumes tailored for your target roles</p>
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${step === s ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : step > s ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-white/5 text-slate-500 border border-white/10"}`}>
              {step > s ? <Check className="w-3 h-3" /> : null} {s === 1 ? "Details" : s === 2 ? "Template" : "Preview"}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Input Form */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 max-w-3xl">
          <h2 className="text-xl font-bold text-white mb-6">Tell us about yourself</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="John Doe" /></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="john@email.com" /></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
              <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="+1 234 567 8900" /></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
              <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input-field" placeholder="San Francisco, CA" /></div>
          </div>
          <div className="mb-4"><label className="block text-sm font-medium text-slate-300 mb-1">Skills (comma separated)</label>
            <input type="text" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} className="input-field" placeholder="React, Python, Machine Learning, AWS" /></div>
          <div className="mb-4"><label className="block text-sm font-medium text-slate-300 mb-1">Languages (comma separated)</label>
            <input type="text" value={form.languages} onChange={e => setForm({ ...form, languages: e.target.value })} className="input-field" placeholder="English, Hindi, Spanish" /></div>
          <div className="mb-4"><label className="block text-sm font-medium text-slate-300 mb-1">Experience</label>
            <textarea value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className="input-field !min-h-[100px]" placeholder="Describe your work experience, internships, roles..." /></div>
          <div className="mb-4"><label className="block text-sm font-medium text-slate-300 mb-1">Education</label>
            <textarea value={form.education} onChange={e => setForm({ ...form, education: e.target.value })} className="input-field !min-h-[80px]" placeholder="Degree, university, year..." /></div>
          <div className="mb-6"><label className="block text-sm font-medium text-slate-300 mb-1">Projects (optional)</label>
            <textarea value={form.projects} onChange={e => setForm({ ...form, projects: e.target.value })} className="input-field !min-h-[80px]" placeholder="Notable projects, hackathons, open source..." /></div>
          <div className="flex justify-end">
            <button onClick={() => setStep(2)} disabled={!form.name || !form.skills || !form.experience} className="btn-primary disabled:opacity-30">Next: Choose Template <ArrowRight className="w-4 h-4" /></button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Template Selection */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-bold text-white mb-6">Choose a Template</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {templates.map(t => (
              <button key={t.id} onClick={() => setSelectedTemplate(t.id)} className={`p-4 rounded-xl border-2 transition-all text-left ${selectedTemplate === t.id ? "border-indigo-500/60 bg-indigo-500/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}>
                <div className={`h-24 rounded-lg bg-gradient-to-br ${t.color} mb-3 flex items-center justify-center`}>
                  <FileText className="w-8 h-8 text-white/50" />
                </div>
                <h4 className="font-semibold text-white text-sm">{t.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{t.desc}</p>
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="btn-ghost flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Back</button>
            <button onClick={handleGenerate} disabled={generating} className="btn-primary">
              {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Wand2 className="w-4 h-4" /> Generate Resume</>}
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Preview */}
      {step === 3 && resumeData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="btn-ghost flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Change Template</button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(!editing)} className={`p-2 rounded-lg transition-colors ${editing ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}>
                <Edit3 className="w-4 h-4" />
              </button>
              <button onClick={handleDownload} className="btn-primary !py-2"><Download className="w-4 h-4" /> Download PDF</button>
            </div>
          </div>

          <div className="glass-card p-4 bg-slate-900/50">
            <div className="flex items-center gap-2 mb-3"><Eye className="w-4 h-4 text-slate-400" /><span className="text-sm font-medium text-slate-400">Live Preview</span>{editing && <span className="text-xs text-amber-400 ml-2">✏️ Edit mode — click text to edit</span>}</div>
            <div ref={previewRef} className="bg-white rounded-lg p-8 sm:p-12 shadow-2xl text-slate-800 min-h-[600px]" contentEditable={editing} suppressContentEditableWarning>
              {/* Header */}
              <div className={`border-b-2 pb-4 mb-6 ${selectedTemplate === "creative" ? "border-rose-500" : selectedTemplate === "corporate" ? "border-slate-800" : selectedTemplate === "minimal" ? "border-slate-300" : "border-indigo-500"}`}>
                <h1 className="text-3xl font-bold text-slate-900 mb-1">{form.name}</h1>
                <div className="flex gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                  {form.email && <span>{form.email}</span>}
                  {form.phone && <span>{form.phone}</span>}
                  {form.location && <span>{form.location}</span>}
                </div>
              </div>
              {/* Summary */}
              <div className="mb-6">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Summary</h2>
                <p className="text-sm text-slate-700 leading-relaxed">{resumeData.summary}</p>
              </div>
              {/* Experience */}
              {resumeData.experience?.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Experience</h2>
                  {resumeData.experience.map((exp, i) => (
                    <div key={i} className="mb-4">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-slate-800">{exp.title} — {exp.company}</h3>
                        <span className="text-xs text-slate-500 font-medium">{exp.period}</span>
                      </div>
                      <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
                        {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {/* Education */}
              {resumeData.education?.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Education</h2>
                  {resumeData.education.map((edu, i) => (
                    <div key={i} className="flex justify-between mb-1">
                      <span className="text-sm text-slate-800 font-medium">{edu.degree} — {edu.institution}</span>
                      <span className="text-xs text-slate-500">{edu.year}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* Skills */}
              <div className="mb-6">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map(s => <span key={s} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded font-medium">{s}</span>)}
                </div>
              </div>
              {/* Projects */}
              {resumeData.projects?.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Projects</h2>
                  {resumeData.projects.map((p, i) => (
                    <div key={i} className="mb-2">
                      <h3 className="font-bold text-slate-800 text-sm">{p.name}</h3>
                      <p className="text-xs text-slate-600">{p.description}</p>
                    </div>
                  ))}
                </div>
              )}
              {/* Languages */}
              {resumeData.languages?.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Languages</h2>
                  <p className="text-sm text-slate-700">{resumeData.languages.join(", ")}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
