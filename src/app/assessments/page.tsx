"use client";
import { useState, useEffect } from "react";
import { Brain, FileQuestion, ArrowRight, CheckCircle, X, ChevronRight, ChevronLeft, Sparkles, Target, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store";

const questionsDatabase: Record<string, { question: string; options: string[] }[]> = {
  cog: [
    { question: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?", options: ["Yes", "No", "Maybe", "Cannot be determined"] },
    { question: "What comes next: 2, 6, 12, 20, 30, ...?", options: ["40", "42", "44", "48"] },
    { question: "A bat and ball cost $1.10 total. The bat costs $1.00 more than the ball. Ball cost?", options: ["$0.05", "$0.10", "$0.15", "$1.00"] },
    { question: "Which word does not belong?", options: ["Apple", "Banana", "Carrot", "Grape"] },
    { question: "Rearranging 'CIFAIPC' gives the name of a(n):", options: ["Ocean", "Country", "Animal", "City"] },
    { question: "A train travels 60 miles in 1.5 hours. Average speed in mph?", options: ["40", "45", "50", "60"] },
    { question: "5 machines make 5 widgets in 5 min. How long for 100 machines to make 100 widgets?", options: ["1 minute", "5 minutes", "100 minutes", "500 minutes"] },
    { question: "John is twice his sister's age. In 5 years he'll be 5 years older. How old is John?", options: ["5", "10", "15", "20"] },
    { question: "Which shape has 4 equal straight sides?", options: ["Square", "Circle", "Triangle", "Hexagon"] },
    { question: "If some A are B, and all B are C, then:", options: ["All A are C", "Some A are C", "No A are C", "All C are A"] },
  ],
  pers: [
    { question: "When faced with a tight deadline, I tend to:", options: ["Create a detailed schedule", "Dive right in and adapt", "Ask for an extension", "Delegate tasks immediately"] },
    { question: "In group discussions, I usually:", options: ["Listen carefully before speaking", "Lead the conversation", "Mediate conflicts", "Offer creative alternatives"] },
    { question: "I prefer a work environment that is:", options: ["Highly structured", "Fast-paced and dynamic", "Collaborative and social", "Quiet and independent"] },
    { question: "When learning a new skill, I prefer to:", options: ["Read the manual", "Watch a tutorial", "Learn by doing", "Ask an expert"] },
    { question: "Feedback is most useful when:", options: ["Direct and objective", "Gentle and encouraging", "Focused on future goals", "Specific and actionable"] },
    { question: "I feel most energized when:", options: ["Solving a complex puzzle", "Brainstorming with a team", "Checking items off a list", "Presenting my ideas"] },
    { question: "How do you handle unexpected project changes?", options: ["Analyze the impact first", "Embrace immediately", "Seek guidance from peers", "Resist if it compromises quality"] },
    { question: "My ideal weekend involves:", options: ["Organizing my home", "Socializing with large groups", "Reading or solo hobbies", "Outdoor adventures"] },
    { question: "When a conflict arises with a colleague:", options: ["Address it directly", "Let it cool down first", "Seek a mediator", "See it from their perspective first"] },
    { question: "I measure my success primarily by:", options: ["Achieving personal goals", "Recognition from others", "Helping the team succeed", "Continuous learning and growth"] },
  ],
  tech: [
    { question: "Which data structure uses Last-In, First-Out (LIFO)?", options: ["Queue", "Linked List", "Stack", "Tree"] },
    { question: "Time complexity of search in a balanced BST?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"] },
    { question: "Which is NOT a core OOP concept?", options: ["Encapsulation", "Compilation", "Polymorphism", "Inheritance"] },
    { question: "What does API stand for?", options: ["Application Programming Interface", "Advanced Protocol Integration", "Automated Process Interface", "Application Process Integration"] },
    { question: "In Git, which command saves changes to the local repo?", options: ["git push", "git commit", "git save", "git add"] },
    { question: "Which protocol securely transfers web pages?", options: ["HTTP", "FTP", "HTTPS", "SSH"] },
    { question: "Primary purpose of a database index?", options: ["Encrypt data", "Speed up data retrieval", "Compress data", "Establish foreign keys"] },
    { question: "Which pattern restricts a class to one instance?", options: ["Factory", "Observer", "Singleton", "Decorator"] },
    { question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheets"] },
    { question: "What ensures a child record matches a parent in a relational DB?", options: ["Primary Key", "Foreign Key", "Unique Index", "Stored Procedure"] },
  ],
  lead: [
    { question: "When a team member underperforms, the best initial approach is:", options: ["Issue a formal warning", "Have a private 1-on-1 to understand why", "Reassign their tasks", "Publicly correct them"] },
    { question: "A key trait of an effective leader is:", options: ["Micromanagement", "Empathy and active listening", "Taking all credit", "Avoiding difficult decisions"] },
    { question: "When delegating a task, you should:", options: ["Explain the 'why' and provide resources", "Just give the deadline", "Do it yourself if important", "Only delegate menial tasks"] },
    { question: "How should a leader handle a team failure?", options: ["Blame the responsible individual", "Take accountability and conduct a post-mortem", "Ignore it", "Report to upper management immediately"] },
    { question: "In decision making, a leader should primarily rely on:", options: ["Gut instinct", "Data and team input", "What requires least effort", "Past traditions"] },
    { question: "To foster innovation, a leader should:", options: ["Punish mistakes", "Create a safe space for experimentation", "Set rigid rules", "Discourage wild ideas"] },
    { question: "When communicating a major change:", options: ["Send an automated email", "Hold a transparent Q&A session", "Tell only senior staff", "Keep it secret until the last minute"] },
    { question: "A team is stuck on a problem. As a leader, you:", options: ["Solve it for them", "Facilitate a brainstorming session", "Tell them to work harder", "Extend the deadline indefinitely"] },
    { question: "Constructive feedback should:", options: ["Focus on character", "Be vague to spare feelings", "Focus on behavior and impact", "Wait for annual review"] },
    { question: "The ultimate goal of leadership is to:", options: ["Gain personal power", "Ensure everyone agrees", "Empower others to succeed", "Maintain the status quo"] },
  ],
  creative: [
    { question: "What is the most important phase in Design Thinking?", options: ["Ideation", "Empathize", "Prototype", "Test"] },
    { question: "Which creative technique involves random word association?", options: ["Lateral Thinking", "Mind Mapping", "SCAMPER", "Brainstorming"] },
    { question: "The best way to overcome creative block is:", options: ["Force output", "Take a break and change context", "Copy existing work", "Abandon the project"] },
    { question: "In UX design, what does 'affordance' mean?", options: ["Visual appeal", "A design element that suggests its usage", "Loading speed", "Color theory"] },
    { question: "Which color theory concept creates visual tension?", options: ["Complementary colors", "Analogous colors", "Monochromatic", "Neutral palette"] },
    { question: "What distinguishes good typography?", options: ["Using many fonts", "Consistent hierarchy and readability", "Maximum decoration", "Smallest possible size"] },
    { question: "Storytelling in design is most effective when:", options: ["It's complex", "It's visually minimal", "It creates emotional connection", "It uses jargon"] },
    { question: "The 'Rule of Thirds' is used in:", options: ["Typography", "Composition and layout", "Color selection", "Animation timing"] },
    { question: "What is 'white space' in design?", options: ["Empty area that enhances readability", "Wasted space", "Background color", "Margins only"] },
    { question: "Iterative design means:", options: ["Designing once perfectly", "Repeating design-test-refine cycles", "Copying competitors", "Using templates"] },
  ],
  analytical: [
    { question: "In data analysis, what does 'correlation' measure?", options: ["Relationship strength between variables", "Cause and effect", "Data accuracy", "Sample size"] },
    { question: "Which chart best shows trends over time?", options: ["Pie chart", "Bar chart", "Line chart", "Scatter plot"] },
    { question: "What is a 'p-value' in statistics?", options: ["Population size", "Probability of results occurring by chance", "Percentage of data", "Prediction accuracy"] },
    { question: "SQL JOIN is used to:", options: ["Combine rows from multiple tables", "Delete records", "Create indexes", "Sort data"] },
    { question: "In Excel, VLOOKUP is used to:", options: ["Create charts", "Format cells", "Search for values in a table", "Calculate averages"] },
    { question: "What does ETL stand for in data engineering?", options: ["Extract, Transform, Load", "Edit, Test, Launch", "Evaluate, Track, Log", "Export, Transfer, Link"] },
    { question: "A histogram displays:", options: ["Categorical comparisons", "Frequency distribution of data", "Time series trends", "Relationships between variables"] },
    { question: "What is 'data normalization'?", options: ["Deleting outliers", "Organizing data to reduce redundancy", "Increasing data volume", "Encrypting data"] },
    { question: "Which metric measures central tendency?", options: ["Standard deviation", "Variance", "Mean", "Range"] },
    { question: "A/B testing is primarily used to:", options: ["Debug software", "Compare two versions for performance", "Train ML models", "Encrypt data"] },
  ],
};

const testCategories = [
  { id: "cog", title: "Cognitive Aptitude", desc: "Logical reasoning, patterns & problem-solving", duration: "15 min", icon: "🧠", color: "from-violet-500 to-purple-600" },
  { id: "pers", title: "Personality Profiler", desc: "Work style, preferences & ideal environment", duration: "10 min", icon: "🎭", color: "from-pink-500 to-rose-600" },
  { id: "tech", title: "Technical Foundation", desc: "Programming logic, systems & CS fundamentals", duration: "12 min", icon: "💻", color: "from-cyan-500 to-blue-600" },
  { id: "lead", title: "Leadership Potential", desc: "Management, decision-making & team skills", duration: "12 min", icon: "👑", color: "from-amber-500 to-orange-600" },
  { id: "creative", title: "Creative Thinking", desc: "Design thinking, innovation & visual problem solving", duration: "10 min", icon: "🎨", color: "from-emerald-500 to-teal-600" },
  { id: "analytical", title: "Analytical Skills", desc: "Data analysis, statistics & logical deduction", duration: "15 min", icon: "📊", color: "from-indigo-500 to-blue-600" },
];

export default function AssessmentsPage() {
  const { token, fetchUser } = useAuthStore();
  const [completedTests, setCompletedTests] = useState<Record<string, { score: number; date: string }>>({});
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);
  const [correctAnswersMap, setCorrectAnswersMap] = useState<Record<number, number>>({});

  useEffect(() => {
    async function fetchCompleted() {
      if (!token) return;
      try {
        const res = await fetch("/api/assessments", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) {
          const map: Record<string, { score: number; date: string }> = {};
          for (const a of data.assessments) {
            if (!map[a.type] || a.score > map[a.type].score) {
              map[a.type] = { score: a.score, date: new Date(a.completedAt).toLocaleDateString() };
            }
          }
          setCompletedTests(map);
        }
      } catch (e) { console.error(e); }
    }
    fetchCompleted();
  }, [token]);

  const handleStartTest = (testId: string) => {
    setActiveTestId(testId);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setCorrectAnswersMap({});
  };

  const currentQuestions = activeTestId ? questionsDatabase[activeTestId] || [] : [];



  const handleSubmit = async () => {
    if (!activeTestId || !token) return;
    setIsSubmitting(true);
    try {
      const cat = testCategories.find(c => c.id === activeTestId);
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          type: activeTestId,
          title: cat?.title || "Assessment",
          questions: currentQuestions,
          answers
        })
      });
      const data = await res.json();
      if (data.success) {
        setLastScore(data.assessment.score);
        setLastAnalysis(data.assessment.analysis || null);
        setCorrectAnswersMap(data.correctAnswers || {});
        setCompletedTests(prev => ({ ...prev, [activeTestId]: { score: data.assessment.score, date: new Date().toLocaleDateString() } }));
        
        fetchUser(); // Update XP in UI
        setShowResults(true);
      }
    } catch (e) { console.error(e); }
    finally { setIsSubmitting(false); }
  };

  const handleFinish = () => setActiveTestId(null);
  const totalCompleted = Object.keys(completedTests).length;
  const avgScore = totalCompleted > 0 ? Math.round(Object.values(completedTests).reduce((s, t) => s + t.score, 0) / totalCompleted) : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Brain className="w-8 h-8 text-purple-400" /> Assessments
        </h1>
        <p className="text-slate-400">Complete AI-driven tests to improve your career matches</p>
      </div>

      {/* Score Overview */}
      {totalCompleted > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center"><Trophy className="w-6 h-6 text-purple-400" /></div>
            <div><div className="text-2xl font-bold text-white">{totalCompleted}/{testCategories.length}</div><div className="text-xs text-slate-500">Tests Completed</div></div>
          </div>
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center"><Target className="w-6 h-6 text-emerald-400" /></div>
            <div><div className="text-2xl font-bold text-white">{avgScore}%</div><div className="text-xs text-slate-500">Average Score</div></div>
          </div>
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center"><Sparkles className="w-6 h-6 text-amber-400" /></div>
            <div><div className="text-2xl font-bold text-white">{totalCompleted * 10}</div><div className="text-xs text-slate-500">Questions Answered</div></div>
          </div>
        </div>
      )}

      {/* Test Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testCategories.map((cat, i) => {
          const completed = completedTests[cat.id];
          return (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl">{cat.icon}</div>
                {completed && (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    <CheckCircle className="w-3 h-3" /> {completed.score}%
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{cat.title}</h3>
              <p className="text-sm text-slate-400 mb-4 flex-1">{cat.desc}</p>
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="text-xs text-slate-500">{cat.duration} • 10 Questions</div>
                <button onClick={() => handleStartTest(cat.id)} className="text-sm font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1">
                  {completed ? "Go to Tests" : "Start Test"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Active Test Modal */}
      <AnimatePresence>
        {activeTestId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-[#0F172A] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              {!showResults && !isSubmitting && (
                <button onClick={() => setActiveTestId(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              )}

              {isSubmitting ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 animate-pulse"><Brain className="w-8 h-8 text-purple-400" /></div>
                  <h2 className="text-2xl font-bold text-white mb-2">Analyzing your responses...</h2>
                  <p className="text-slate-400">Nexora AI is calculating your aptitude score.</p>
                </div>
              ) : showResults ? (
                <div className="py-10 text-center">
                  {activeTestId === "pers" || activeTestId === "lead" ? (
                    <div className="text-left">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-white">Analysis Complete</h2>
                          <p className="text-slate-400">Nexora AI has profiled your professional style.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="glass-card p-6 border-white/5">
                          <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-4">Key Traits</h3>
                          <div className="flex flex-wrap gap-2">
                            {lastAnalysis?.traits?.map((trait: string) => (
                              <span key={trait} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-sm font-medium">
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="glass-card p-6 border-white/5 flex flex-col items-center justify-center">
                          <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-2 text-center">Pathway Compatibility</h3>
                          <div className="text-4xl font-black text-white">{lastAnalysis?.compatibility || 0}%</div>
                          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Relative to your target career</p>
                        </div>
                      </div>

                      <div className="glass-card p-6 border-white/5 mb-8">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-3">Professional Overview</h3>
                        <p className="text-slate-300 leading-relaxed italic">
                          "{lastAnalysis?.overview || "Your responses suggest a versatile professional approach with significant room for specialized development."}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${lastScore >= 70 ? "bg-emerald-500/20" : lastScore >= 40 ? "bg-amber-500/20" : "bg-rose-500/20"}`}>
                        <Target className={`w-10 h-10 ${lastScore >= 70 ? "text-emerald-400" : lastScore >= 40 ? "text-amber-400" : "text-rose-400"}`} />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2">Test Complete!</h2>
                      <p className="text-slate-400 mb-8">{lastScore >= 70 ? "Excellent performance!" : lastScore >= 40 ? "Good effort! Keep improving." : "Room for growth — keep learning!"}</p>
                      <div className="inline-flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 mb-8 min-w-[200px]">
                        <span className="text-sm text-slate-400 mb-1">Your Score</span>
                        <span className={`text-5xl font-bold ${lastScore >= 70 ? "text-emerald-400" : lastScore >= 40 ? "text-amber-400" : "text-rose-400"}`}>{lastScore}%</span>
                      </div>
                    </>
                  )}
                  <div><button onClick={handleFinish} className="btn-primary !px-8">Back to Assessments</button></div>
                </div>
              ) : currentQuestions.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 mb-8">
                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium text-slate-400 w-12 text-right">{currentQuestionIndex + 1} / {currentQuestions.length}</span>
                  </div>
                  <div className="mb-8 min-h-[80px]"><h2 className="text-xl font-medium text-white leading-relaxed">{currentQuestions[currentQuestionIndex].question}</h2></div>
                  <div className="space-y-3 mb-8">
                    {currentQuestions[currentQuestionIndex].options.map((opt, idx) => (
                      <button key={idx} onClick={() => setAnswers({ ...answers, [currentQuestionIndex]: idx })}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${answers[currentQuestionIndex] === idx ? "bg-purple-500/20 border-purple-500/50 text-white" : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${answers[currentQuestionIndex] === idx ? "border-purple-400" : "border-slate-500"}`}>
                            {answers[currentQuestionIndex] === idx && <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />}
                          </div>
                          {opt}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-white/10">
                    <button onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))} disabled={currentQuestionIndex === 0} className="btn-ghost flex items-center gap-1 disabled:opacity-30">
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                    {currentQuestionIndex === currentQuestions.length - 1 ? (
                      <button onClick={handleSubmit} disabled={answers[currentQuestionIndex] === undefined} className="btn-primary">Submit Test</button>
                    ) : (
                      <button onClick={() => setCurrentQuestionIndex(p => p + 1)} disabled={answers[currentQuestionIndex] === undefined} className="btn-primary">
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
