import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth, TEACHER_INVITE_CODE } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { QuizRunner } from './components/QuizRunner';
import { HistoryView } from './components/HistoryView';
import { LeaderboardView } from './components/LeaderboardView';
import { TeacherView } from './components/TeacherView';
import { INITIAL_QUIZZES, INITIAL_QUESTIONS } from './data/bakingQuizzes';
import { Quiz, Question, Attempt } from './types';
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Key, 
  BookOpen, 
  Clock, 
  Lock, 
  ArrowRight,
  Play,
  RotateCcw,
  Trophy,
  History,
  ChefHat,
  Award,
  Layers,
  Flame,
  FileSpreadsheet
} from 'lucide-react';

const STORAGE_KEY_ATTEMPTS = 'brielle_quiz_completed_attempts';
const STORAGE_KEY_QUIZZES = 'brielle_quiz_quizzes_state';
const STORAGE_KEY_QUESTIONS = 'brielle_quiz_questions_state';

function MainApp() {
  const { currentUser, isAuthenticated, isTeacher } = useAuth();
  const [activeTab, setActiveTab] = useState<'quizzes' | 'leaderboards' | 'history' | 'teacher'>('quizzes');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');

  // Quizzes & Questions state (persisted in localStorage, editable by teachers)
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUIZZES);
      return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
    } catch {
      return INITIAL_QUIZZES;
    }
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUESTIONS);
      return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  });

  // Completed attempts store
  const [completedAttempts, setCompletedAttempts] = useState<Attempt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify(quizzes));
    } catch (err) {
      console.error('Failed to sync quizzes', err);
    }
  }, [quizzes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
    } catch (err) {
      console.error('Failed to sync questions', err);
    }
  }, [questions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(completedAttempts));
    } catch (err) {
      console.error('Failed to sync attempts', err);
    }
  }, [completedAttempts]);

  const openAuth = (tab: 'login' | 'register') => {
    setAuthInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
  };

  // Active quiz runner state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  const handleFinishQuiz = (result: {
    quizId: string;
    quizTitle: string;
    score: number;
    questionCount: number;
    percentage: number;
    answers: { questionId: string; selectedChoice: 'A' | 'B' | 'C' | 'D' | null; isCorrect: boolean }[];
  }) => {
    // Record completed attempt per D7
    const newAttempt: Attempt = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: currentUser?.id || 'guest',
      username: currentUser?.username || 'Guest Baker',
      quizId: result.quizId,
      quizTitle: result.quizTitle,
      score: result.score,
      questionCount: result.questionCount,
      percentage: result.percentage,
      startedAt: new Date(Date.now() - 60000).toISOString(),
      completedAt: new Date().toISOString(),
      answers: result.answers,
    };

    setCompletedAttempts((prev) => [newAttempt, ...prev]);
  };

  const getPreviousBestScore = (quizId: string) => {
    const userRuns = completedAttempts.filter(
      (a) => a.quizId === quizId && (currentUser ? a.userId === currentUser.id : true)
    );
    if (userRuns.length === 0) return null;
    return Math.max(...userRuns.map((r) => r.score));
  };

  // Filter published quizzes for players (all visible to teachers)
  const visibleQuizzes = isTeacher ? quizzes : quizzes.filter((q) => q.published);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Background ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-r from-sky-500/10 via-pink-500/10 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Top Navbar */}
      <Navbar
        currentTab={activeTab}
        onSelectTab={(tab) => {
          setActiveQuiz(null);
          setActiveTab(tab as any);
        }}
        onOpenAuth={openAuth}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-10 flex flex-col items-center">
        
        {/* If a quiz is actively running, show the QuizRunner */}
        {activeQuiz ? (
          <div className="w-full">
            <QuizRunner
              quiz={activeQuiz}
              questions={questions.filter((q) => q.quizId === activeQuiz.id)}
              previousBestScore={getPreviousBestScore(activeQuiz.id)}
              onFinishQuiz={handleFinishQuiz}
              onExit={() => setActiveQuiz(null)}
            />
          </div>
        ) : (
          <>
            {/* Top Column Branding with sky blue fading ombre into light pink */}
            <div className="w-full max-w-2xl text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-sky-300 shadow-sm mb-3">
                <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                <span className="font-mono uppercase tracking-wider text-[11px]">Phase 4: Leaderboards &amp; Admin Tools Active</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300 bg-clip-text text-transparent pb-1">
                EclairWiz
              </h1>
              <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
                Baking quiz engine featuring deterministic Hall of Fame leaderboards, teacher authoring, and validated CSV question uploads.
              </p>

              {/* Status Pills & Player Quick Switch */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => openAuth('login')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-sky-400/50 text-xs text-slate-200 transition-colors cursor-pointer group"
                  title="Click to switch or log in as a different player"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Player:</span>
                  <strong className="text-sky-300 group-hover:text-pink-300 transition-colors">
                    {currentUser?.username || 'Guest (Click to Log In)'}
                  </strong>
                  <span className="text-[10px] text-slate-500 group-hover:text-slate-300 ml-1">
                    [Switch]
                  </span>
                </button>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                  <Award className="w-3.5 h-3.5 text-sky-400" />
                  Total Attempts: <strong className="text-sky-300">{completedAttempts.length}</strong>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-pink-400" />
                  <span>CSV Validator: Ready</span>
                </span>
              </div>
            </div>

            {/* TAB CONTENT: Quizzes */}
            {activeTab === 'quizzes' && (
              <div className="w-full space-y-8">
                
                {/* Baking Quizzes Cards */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-sky-400" />
                      <span>Choose a Quiz</span>
                    </h2>
                    <span className="text-xs text-slate-400">
                      {visibleQuizzes.length} Quizzes Available
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {visibleQuizzes.map((quiz) => {
                      const quizQuestions = questions.filter((q) => q.quizId === quiz.id);
                      const pastRuns = completedAttempts.filter(
                        (a) => a.quizId === quiz.id && (currentUser ? a.userId === currentUser.id : true)
                      );
                      const bestScore = pastRuns.length > 0 ? Math.max(...pastRuns.map((r) => r.score)) : null;

                      return (
                        <div
                          key={quiz.id}
                          className="rounded-3xl bg-slate-900/95 border border-slate-800 hover:border-slate-700 p-6 shadow-xl flex flex-col justify-between group transition-all hover:-translate-y-1 relative overflow-hidden"
                        >
                          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400/40 via-sky-300/40 to-pink-300/40 group-hover:from-sky-400 group-hover:to-pink-300 transition-all" />

                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-300 border border-slate-700/60">
                                {quiz.subject}
                              </span>
                              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                <Clock className="w-3 h-3 text-pink-400" />
                                <span>{quiz.timeLimitSeconds}s / Q</span>
                              </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                              {quiz.title}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                              {quiz.description}
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                            <div>
                              <div className="text-xs font-semibold text-slate-300">
                                {quizQuestions.length} Questions
                              </div>
                              {bestScore !== null ? (
                                <div className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                                  <Award className="w-3 h-3 text-amber-400" />
                                  <span>Best: {bestScore}/{quizQuestions.length} ({pastRuns.length} {pastRuns.length === 1 ? 'try' : 'tries'})</span>
                                </div>
                              ) : (
                                <div className="text-[11px] text-slate-500">
                                  Not taken yet
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => handleStartQuiz(quiz)}
                              className="px-4 py-2 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300 hover:opacity-95 shadow-md shadow-pink-500/10 transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>{bestScore !== null ? 'Retake' : 'Start'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Phase 4 Definition of Done Checklist Box */}
                <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Phase 4 Verification &amp; Acceptance Checklist</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      Phase 4 Complete
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-200">Overall &amp; Per-Quiz Leaderboards</strong>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Enforces D16 (best score → fewer tries) and D17 (completed attempts → correct answers) with pinned &quot;Your Rank&quot;.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-200">Teacher Question Editor (CRUD)</strong>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Full interface to create, edit, and manage questions with educational explanations.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-200">10-Question Gate &amp; History Protection</strong>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Blocks publishing quizzes with &lt;10 questions and protects questions referenced in submitted attempts.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-200">CSV Bulk Upload with Pre-Commit Preview</strong>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Row-by-row validation table blocks invalid imports and displays exact line errors before committing.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: Leaderboards (Phase 4 Full View) */}
            {activeTab === 'leaderboards' && (
              <LeaderboardView
                attempts={completedAttempts}
                quizzes={quizzes}
              />
            )}

            {/* TAB CONTENT: My History */}
            {activeTab === 'history' && (
              <HistoryView
                attempts={completedAttempts}
                quizzes={quizzes}
                allQuestions={questions}
                onRetakeQuiz={(quiz) => handleStartQuiz(quiz)}
              />
            )}

            {/* TAB CONTENT: Teacher Tools (Phase 4 Full Console) */}
            {activeTab === 'teacher' && (
              <TeacherView
                quizzes={quizzes}
                questions={questions}
                attempts={completedAttempts}
                onUpdateQuizzes={(updated) => setQuizzes(updated)}
                onUpdateQuestions={(updated) => setQuestions(updated)}
              />
            )}
          </>
        )}

      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authInitialTab}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
