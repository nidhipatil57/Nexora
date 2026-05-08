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
  { id: "premium", name: "Premium", desc: "Dual-column executive layout", color: "from-slate-800 to-slate-900" },
  { id: "modern", name: "Modern", desc: "Clean lines with accent colors", color: "from-indigo-500 to-blue-600" },
  { id: "minimal", name: "Minimal", desc: "Simple and elegant", color: "from-slate-500 to-slate-700" },
  { id: "creative", name: "Creative", desc: "Bold layout with personality", color: "from-rose-500 to-pink-600" },
  { id: "corporate", name: "Corporate", desc: "Traditional and professional", color: "from-emerald-500 to-teal-600" },
];

export default function ResumePage() {
  const { user, token } = useAuthStore();
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("premium");
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
      body{font-family:system-ui,-apple-system,sans-serif;margin:0;padding:0;color:#1a1a2e;line-height:1.6}
      .premium-container{display:flex;min-height:100vh}
      .premium-sidebar{width:250px;background:#f0f2f5;padding:40px 20px;border-right:1px solid #ddd}
      .premium-main{flex:1;background:white;padding:0}
      .premium-header{background:#2c3e50;color:white;padding:40px 60px;text-align:left}
      .premium-content{padding:40px 60px}
      .section-item{position:relative;padding-left:30px;margin-bottom:30px;border-left:1px solid #ddd}
      .section-dot{position:absolute;left:-6px;top:4px;width:10px;height:10px;background:#2c3e50;border-radius:50%}
      h1{font-size:32px;margin:0;text-transform:uppercase;letter-spacing:2px}
      h2{font-size:14px;text-transform:uppercase;letter-spacing:1.5px;color:#2c3e50;margin-bottom:15px;border-bottom:1.5px solid #2c3e50;display:inline-block;padding-bottom:2px}
      .sidebar-section{margin-bottom:35px}
      .sidebar-title{font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #ccc;margin-bottom:10px;padding-bottom:2px}
      .sidebar-text{font-size:11px;color:#555;margin-bottom:5px}
      ul{margin:4px 0;padding-left:15px}li{font-size:12px;margin:4px 0}
    </style></head><body>${previewRef.current.innerHTML}</body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <FileText className="w-8 h-8 text-rose-400" /> Resume Builder
          </h1>
          <p className="text-slate-400">AI-powered resumes tailored for your target roles</p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${step === s ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : step > s ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-white/5 text-slate-500 border border-white/10"}`}>
              {step > s ? <Check className="w-3 h-3" /> : null} {s === 1 ? "Details" : s === 2 ? "Template" : "Preview"}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 max-w-3xl">
          <h2 className="text-xl font-bold text-white mb-6">Tell us about yourself</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="John Doe" /></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="john@email.com" /></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
              <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="+91 9876543210" /></div>
            <div><label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
              <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input-field" placeholder="City, State" /></div>
          </div>
          <div className="mb-4"><label className="block text-sm font-medium text-slate-300 mb-1">Skills (comma separated)</label>
            <input type="text" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} className="input-field" placeholder="React, Python, Machine Learning" /></div>
          <div className="mb-4"><label className="block text-sm font-medium text-slate-300 mb-1">Languages (comma separated)</label>
            <input type="text" value={form.languages} onChange={e => setForm({ ...form, languages: e.target.value })} className="input-field" placeholder="English, Hindi" /></div>
          <div className="mb-4"><label className="block text-sm font-medium text-slate-300 mb-1">Experience</label>
            <textarea value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className="input-field !min-h-[100px]" placeholder="Work experience..." /></div>
          <div className="mb-4"><label className="block text-sm font-medium text-slate-300 mb-1">Education</label>
            <textarea value={form.education} onChange={e => setForm({ ...form, education: e.target.value })} className="input-field !min-h-[80px]" placeholder="Degree, university, year..." /></div>
          <div className="mb-6"><label className="block text-sm font-medium text-slate-300 mb-1">Projects</label>
            <textarea value={form.projects} onChange={e => setForm({ ...form, projects: e.target.value })} className="input-field !min-h-[80px]" placeholder="Key projects..." /></div>
          <div className="flex justify-end">
            <button onClick={() => setStep(2)} disabled={!form.name || !form.skills} className="btn-primary">Next: Choose Template <ArrowRight className="w-4 h-4" /></button>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-bold text-white mb-6">Choose a Template</h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {templates.map(t => (
              <button key={t.id} onClick={() => setSelectedTemplate(t.id)} className={`p-4 rounded-xl border-2 transition-all text-left ${selectedTemplate === t.id ? "border-indigo-500 bg-indigo-500/10" : "border-white/10 bg-white/5"}`}>
                <div className={`h-24 rounded-lg bg-gradient-to-br ${t.color} mb-3`} />
                <h4 className="font-semibold text-white text-sm">{t.name}</h4>
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Back</button>
            <button onClick={handleGenerate} disabled={generating} className="btn-primary">
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />} Generate
            </button>
          </div>
        </motion.div>
      )}

      {step === 3 && resumeData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between mb-4">
            <button onClick={() => setStep(2)} className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Change Template</button>
            <div className="flex gap-2">
              <button onClick={() => setEditing(!editing)} className="btn-ghost"><Edit3 className="w-4 h-4" /></button>
              <button onClick={handleDownload} className="btn-primary"><Download className="w-4 h-4" /> Download</button>
            </div>
          </div>
          <div className="glass-card p-1 bg-slate-900/50">
            <div ref={previewRef} className="bg-white rounded shadow-2xl text-slate-800 overflow-hidden" contentEditable={editing} suppressContentEditableWarning>
              {selectedTemplate === "premium" ? (
                <div style={{ display: 'flex', minHeight: '800px' }}>
                  <div style={{ width: '250px', background: '#f0f2f5', padding: '40px 20px', borderRight: '1px solid #ddd' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#ddd', margin: '0 auto 30px' }} />
                    <div style={{ marginBottom: '30px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #ccc', marginBottom: '10px' }}>Contact</div>
                      <div style={{ fontSize: '11px' }}>📞 {form.phone}</div>
                      <div style={{ fontSize: '11px' }}>✉️ {form.email}</div>
                      <div style={{ fontSize: '11px' }}>📍 {form.location}</div>
                    </div>
                    {resumeData.languages?.length > 0 && (
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #ccc', marginBottom: '10px' }}>Languages</div>
                        {resumeData.languages.map(l => <div key={l} style={{ fontSize: '11px' }}>• {l}</div>)}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, background: 'white' }}>
                    <div style={{ background: '#2c3e50', color: 'white', padding: '40px 60px' }}>
                      <h1 style={{ fontSize: '28px', margin: 0 }}>{form.name}</h1>
                      <div style={{ fontSize: '14px', opacity: 0.8 }}>Professional Candidate</div>
                    </div>
                    <div style={{ padding: '40px 60px' }}>
                      <div style={{ position: 'relative', paddingLeft: '30px', marginBottom: '30px', borderLeft: '1px solid #ddd' }}>
                        <div style={{ position: 'absolute', left: '-6px', top: '4px', width: '10px', height: '10px', background: '#2c3e50', borderRadius: '50%' }} />
                        <h2 style={{ fontSize: '14px', textTransform: 'uppercase', borderBottom: '1.5px solid #2c3e50', marginBottom: '10px' }}>Objective</h2>
                        <p style={{ fontSize: '12px' }}>{resumeData.summary}</p>
                      </div>
                      <div style={{ position: 'relative', paddingLeft: '30px', marginBottom: '30px', borderLeft: '1px solid #ddd' }}>
                        <div style={{ position: 'absolute', left: '-6px', top: '4px', width: '10px', height: '10px', background: '#2c3e50', borderRadius: '50%' }} />
                        <h2 style={{ fontSize: '14px', textTransform: 'uppercase', borderBottom: '1.5px solid #2c3e50', marginBottom: '10px' }}>Skills</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                          {resumeData.skills.map(s => <span key={s} style={{ background: '#eee', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>{s}</span>)}
                        </div>
                      </div>
                      <div style={{ position: 'relative', paddingLeft: '30px', borderLeft: '1px solid #ddd' }}>
                        <div style={{ position: 'absolute', left: '-6px', top: '4px', width: '10px', height: '10px', background: '#2c3e50', borderRadius: '50%' }} />
                        <h2 style={{ fontSize: '14px', textTransform: 'uppercase', borderBottom: '1.5px solid #2c3e50', marginBottom: '10px' }}>Education</h2>
                        {resumeData.education.map(edu => (
                          <div key={edu.degree} style={{ marginBottom: '10px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{edu.degree}</div>
                            <div style={{ fontSize: '11px', color: '#666' }}>{edu.institution} | {edu.year}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12">
                  <h1 className="text-3xl font-bold mb-4">{form.name}</h1>
                  <p className="text-sm text-slate-600 mb-8">{resumeData.summary}</p>
                  <h2 className="text-lg font-bold border-b-2 mb-4 uppercase">Education</h2>
                  {resumeData.education.map(edu => <div key={edu.degree} className="mb-4"><h3>{edu.degree}</h3><p>{edu.institution}</p></div>)}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
