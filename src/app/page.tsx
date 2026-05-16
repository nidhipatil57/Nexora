"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Brain, Target, Sparkles, MessageSquare, FileText, Menu, X, Compass, BarChart, Trophy, Star, Shield } from "lucide-react";
import { useState } from "react";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed top-6 w-full z-50 flex justify-center px-6">
      <nav className="w-full max-w-5xl bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-full px-6 h-14 flex items-center justify-between shadow-2xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex flex-col pt-1">
            <span className="text-lg font-bold text-white tracking-tight leading-none">Nexora</span>
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.15em] font-display mt-0.5">Your Tech Assistant</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {["Features", "How it works", "Stories", "Pricing"].map((t) => (
            <a key={t} href={`#${t.toLowerCase().replace(/ /g, '')}`} className="text-sm text-slate-400 hover:text-white transition-colors">{t}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors">Sign in</Link>
          <Link href="/register" className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] hover:opacity-90 text-white text-sm font-medium py-1.5 px-5 rounded-full transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]">Get started</Link>
        </div>
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </nav>
      {open && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-20 left-6 right-6 md:hidden p-6 bg-[#0A0A14] border border-white/10 rounded-2xl flex flex-col gap-4 shadow-2xl z-40">
          <Link href="/login" className="text-slate-300">Sign in</Link>
          <Link href="/register" className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white py-2 rounded-full text-center">Get started</Link>
        </motion.div>
      )}
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-40 pb-20">
      {/* Deep Obsidian Background & Exact Blue Violet Mix */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: '#05050A',
          backgroundImage: 'radial-gradient(circle at 10% 40%, rgba(8, 145, 178, 0.4), transparent 60%), radial-gradient(circle at 90% 20%, rgba(124, 58, 237, 0.4), transparent 60%)'
        }}
      />

      {/* Absolute Bulletproof Grid */}
      <svg 
        className="absolute inset-0 h-full w-full stroke-white/[0.08] pointer-events-none" 
        style={{ maskImage: 'linear-gradient(to bottom, white 20%, transparent 70%)', WebkitMaskImage: 'linear-gradient(to bottom, white 20%, transparent 70%)' }} 
        aria-hidden="true"
      >
        <defs>
          <pattern id="hero-grid" width="100" height="100" x="50%" y="-1" patternUnits="userSpaceOnUse">
            <path d="M.5 100V.5H100" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth="0" fill="url(#hero-grid)" />
      </svg>
      
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.8 }}>

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 text-slate-300 text-xs sm:text-sm font-medium mb-10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" /> Introducing Nexora AI — your personal Tech Career Assistant
          </div>
        </motion.div>
        
        <motion.h1
          className="text-6xl sm:text-7xl lg:text-[6rem] font-extrabold leading-[1.05] tracking-tighter mb-8 text-white font-display"
          variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.8, delay: 0.1 }}
        >
          Where ambition<br/>meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE]">intelligence</span>
        </motion.h1>
        
        <motion.p
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.8, delay: 0.2 }}
        >
          The AI-powered Tech Assistant that decodes your technical potential, designs your elite roadmap, and guides you toward the top 1% of the industry.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto mb-24"
          variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Link href="/register" className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] hover:opacity-90 text-white font-medium text-base py-3.5 px-8 rounded-full transition-all shadow-[0_0_40px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2 w-full sm:w-auto">
            Start your journey <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#features" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-base py-3.5 px-8 rounded-full transition-all flex items-center justify-center w-full sm:w-auto backdrop-blur-sm">
            Watch the demo
          </a>
        </motion.div>
        
        {/* Floating Dashboard Mockup Wrapper */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-4xl mx-auto"
        >
          <div className="w-full border border-white/10 rounded-t-2xl bg-[#0f1016]/90 backdrop-blur-2xl overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.15)] relative animate-float">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="flex items-center px-4 py-3 border-b border-white/5 bg-white/[0.02]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="text-xs text-slate-500 font-mono tracking-wide">nexora.ai / dashboard</div>
            </div>
            <div className="w-12" /> {/* Spacer to balance the dots on the left */}
          </div>
          <div className="p-8 bg-gradient-to-b from-white/[0.02] to-transparent">
            {/* Inner Dashboard Content to match screenshot */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 text-left">
                <div className="text-xs text-slate-500 mb-2">Career match</div>
                <div className="text-3xl font-bold text-[#22D3EE]">97%</div>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 text-left">
                <div className="text-xs text-slate-500 mb-2">Skills mastered</div>
                <div className="text-3xl font-bold text-[#A78BFA]">24</div>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 text-left">
                <div className="text-xs text-slate-500 mb-2">Growth index</div>
                <div className="text-3xl font-bold text-[#34D399]">+42%</div>
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 text-left">
              <div className="flex justify-between items-center mb-6">
                <div className="text-xs text-slate-500">Your career trajectory</div>
                <div className="text-xs text-[#22D3EE]">5-year forecast</div>
              </div>
              <div className="flex items-end gap-3 h-24">
                {/* 10 bars */}
                {[20, 25, 23, 35, 33, 40, 45, 42, 50, 55].map((height, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-[#8B5CF6] to-[#06B6D4] rounded-sm opacity-80" style={{ height: `${height}%` }} />
                ))}
              </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="py-20 relative z-10 -mt-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] mb-2">2.4M+</div>
              <div className="text-sm text-slate-500">Careers mapped</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">97%</div>
              <div className="text-sm text-slate-500">Match accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">180+</div>
              <div className="text-sm text-slate-500">Countries served</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-white mb-2 flex items-center gap-1">
                4.9<Star className="w-6 h-6 fill-[#8B5CF6] text-[#8B5CF6]" />
              </div>
              <div className="text-sm text-slate-500">User rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: Brain, title: "Cognitive profiling", desc: "Adaptive assessments map your aptitude, personality, and unique strengths.", color: "text-[#A78BFA]" },
    { icon: Compass, title: "Pathway visualizer", desc: "Interactive 1, 3, 5, 10-year roadmaps with branching opportunities.", color: "text-[#22D3EE]" },
    { icon: Target, title: "Skill gap radar", desc: "Pinpoint missing competencies and get a prioritized improvement plan.", color: "text-[#34D399]" },
    { icon: BarChart, title: "Market intelligence", desc: "Real-time demand, salary forecasts, and AI-impact analysis per role.", color: "text-[#60A5FA]" },
    { icon: MessageSquare, title: "AI mentor chat", desc: "24/7 strategist for resumes, interviews, and career-defining decisions.", color: "text-[#C084FC]" },
    { icon: Trophy, title: "Gamified growth", desc: "XP, milestones, and streaks that make progress addictive and visible.", color: "text-[#F472B6]" },
    { icon: FileText, title: "Resume & portfolio", desc: "ATS-optimized, AI-crafted assets tuned for the roles you actually want.", color: "text-[#818CF8]" },
    { icon: Shield, title: "Future-proof careers", desc: "Discover AI-resilient, emerging, and high-leverage paths ahead of the curve.", color: "text-[#34D399]" },
  ];

  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-[#22D3EE] text-xs font-bold tracking-widest uppercase mb-4 block">Specialized Capabilities</span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white font-display">An entire tech career team,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE]">distilled into one AI Assistant.</span></h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">Mentor. Strategist. Analyst. Coach. Nexora unifies the expertise of technical industry specialists into a single, deeply personal interface.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:bg-white/[0.04] transition-colors backdrop-blur-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="mb-6">
                <f.icon className={`w-6 h-6 ${f.color}`} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3 font-display">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "Meet your Tech Assistant", desc: "A cinematic onboarding where Nexora learns your technical story — interests, skills, and professional ambitions." },
    { num: "02", title: "Decode your potential", desc: "Adaptive assessments build a multi-dimensional profile of your cognitive and emotional strengths." },
    { num: "03", title: "Design your future", desc: "Receive personalized roadmaps, skill plans, and opportunities — updated in real time as you grow." },
  ];

  return (
    <section id="howitworks" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8B5CF6]/5 to-transparent -z-10" />
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-[#8B5CF6] text-xs font-bold tracking-widest uppercase mb-4 block">How it works</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white font-display">Three steps to a future <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE]">intelligently<br/>designed.</span></h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.num} className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 backdrop-blur-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] mb-6">{s.num}</div>
              <h3 className="text-xl font-bold text-white mb-4 font-display">{s.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    { name: "Aria Chen", role: "Product Lead, Linear", text: "Nexora rewrote my career story. In six months I went from stuck to leading a product team." },
    { name: "Marcus Okafor", role: "CS Student, MIT", text: "It feels less like a tool and more like a brilliant friend who actually understands the industry." },
    { name: "Priya Sharma", role: "Data Scientist", text: "The skill gap intelligence alone is worth ten career counselors. The roadmap is just magic." },
  ];

  return (
    <section id="stories" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-[#10B981] text-xs font-bold tracking-widest uppercase mb-4 block">Stories</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white font-display">Trusted by ambitious minds <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE]">worldwide.</span></h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name} className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 flex flex-col justify-between backdrop-blur-xl"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            >
              <p className="text-slate-400 mb-10 leading-relaxed text-sm">"{t.text}"</p>
              <div>
                <div className="text-sm font-semibold text-white">{t.name}</div>
                <div className="text-xs text-slate-500">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    { name: "Explorer", price: "Free", desc: "Start your career journey", features: ["AI Career Assessment", "3 Career Recommendations", "Basic Skill Analysis", "Community Access"], cta: "Start Free", popular: false },
    { name: "Professional", price: "$19", desc: "Unlock your full potential", features: ["Unlimited AI Recommendations", "Full Skill Gap Analysis", "AI Mentor Chat", "Resume Builder", "Career Pathways", "Priority Support"], cta: "Go Professional", popular: true },
    { name: "Enterprise", price: "$49", desc: "For teams and organizations", features: ["Everything in Professional", "Team Analytics Dashboard", "Custom Assessments", "API Access", "Dedicated Account Manager", "White-label Options"], cta: "Contact Sales", popular: false },
  ];

  return (
    <section id="pricing" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-[#F472B6] text-xs font-bold tracking-widest uppercase mb-4 block">Pricing</span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white font-display">Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE]">Pricing</span></h2>
          <p className="text-slate-400 text-lg font-light">Start free. Upgrade when you're ready.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              className={`bg-white/[0.02] backdrop-blur-xl border rounded-3xl p-10 relative ${p.popular ? "border-[#8B5CF6]/50 shadow-[0_0_30px_rgba(139,92,246,0.1)]" : "border-white/5"}`}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-xs font-bold text-white">Most Popular</div>
              )}
              <h3 className="text-xl font-bold text-white mb-1 font-display">{p.name}</h3>
              <p className="text-sm text-slate-500 mb-6">{p.desc}</p>
              <div className="mb-8">
                <span className="text-5xl font-bold text-white">{p.price}</span>
                {p.price !== "Free" && <span className="text-slate-500 text-sm">/month</span>}
              </div>
              <ul className="space-y-4 mb-10">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-4 h-4 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className={`w-full py-3 rounded-full flex items-center justify-center text-sm font-medium transition-all ${p.popular ? 'bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white shadow-lg' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
                {p.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-32 relative">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#06B6D4]/10 border border-[#8B5CF6]/20 rounded-3xl p-16 text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 font-display">Ready to Design Your Tech Future?</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto font-light">Join thousands of tech professionals using AI to navigate their career journey with confidence.</p>
            <Link href="/register" className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white font-medium text-base py-4 px-10 rounded-full transition-all shadow-[0_0_30px_rgba(139,92,246,0.4)] inline-flex items-center justify-center gap-2">
              Get Started — It's Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 bg-[#05050A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div className="flex flex-col pt-1">
              <span className="font-bold text-white tracking-tight leading-none">Nexora</span>
              <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.15em] font-display mt-0.5">Your Tech Assistant</span>
            </div>
          </div>
          <div className="flex items-center gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-sm text-slate-600">© 2026 Nexora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main className="bg-[#05050A] min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
