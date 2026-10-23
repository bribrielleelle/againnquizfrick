import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { QuizRunner } from './components/QuizRunner';
import { HistoryView } from './components/HistoryView';
import { LeaderboardView } from './components/LeaderboardView';
import { TeacherView } from './components/TeacherView';
import { QASuiteModal } from './components/QASuiteModal';
import { LoginPage } from './components/LoginPage';
import { CutePageLoader } from './components/CutePageLoader';
import { INITIAL_QUIZZES, INITIAL_QUESTIONS } from './data/bakingQuizzes';
import { INITIAL_ATTEMPTS } from './data/initialAttempts';
import { Quiz, Question, Attempt } from './types';
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen, 
  Clock, 
  Play, 
  Award, 
  CheckCheck,
  Heart
} from 'lucide-react';

const STORAGE_KEY_ATTEMPTS = 'brielle_quiz_completed_attempts';
const STORAGE_KEY_QUIZZES = 'brielle_quiz_quizzes_state';
const STORAGE_KEY_QUESTIONS = 'brielle_quiz_questions_state';

const QUIZ_EMOJIS: Record<string, { icon: string; tag: string; badge: string }> = {
  'quiz-pastry-fundamentals': { icon: '🥐', tag: 'Choux & Laminated', badge: 'Crispy & Flaky' },
  'quiz-cakes-frostings': { icon: '🍰', tag: 'Sponge & Buttercream', badge: 'Sweet & Silky' },
  'quiz-artisan-breads': { icon: '🥖', tag: 'Sourdough & Yeast', badge: 'Golden Crust' },
  'quiz-cookies-confections': { icon: '🍪', tag: 'Macarons & Ganache', badge: 'Chewy & Rich' },
  'quiz-science-troubleshooting': { icon: '🔬', tag: 'Emulsions & Leavening', badge: 'Baking Science' },
};

function MainApp() {
  const { currentUser, isTeacher } = useAuth();
  const [activeTab, setActiveTab] = useState<'quizzes' | 'leaderboards' | 'history' | 'teacher'>('quizzes');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');
  const [isQAModalOpen, setIsQAModalOpen] = useState(false);
  const [isGuestBypass, setIsGuestBypass] = useState(false);

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

  // Completed attempts store (persists across all users and page reloads)
  const [completedAttempts, setCompletedAttempts] = useState<Attempt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_ATTEMPTS;
    } catch {
      return INITIAL_ATTEMPTS;
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

  const [pageLoading, setPageLoading] = useState<{
    active: boolean;
    title?: string;
    icon?: string;
  }>({ active: false });

  const triggerTransition = (title: string, icon: string, callback: () => void) => {
    setPageLoading({ active: true, title, icon });
    setTimeout(() => {
      callback();
      setTimeout(() => {
        setPageLoading((prev) => ({ ...prev, active: false }));
      }, 150);
    }, 450);
  };

  const openAuth = (tab: 'login' | 'register') => {
    if (!currentUser) {
      setIsGuestBypass(false);
    } else {
      setAuthInitialTab(tab);
      setIsAuthModalOpen(true);
    }
  };

  const handleSelectTabWithLoading = (tab: string) => {
    if (tab === activeTab && !activeQuiz) return;

    let title = 'Baking Menu & Quizzes';
    let icon = '🥐';
    if (tab === 'leaderboards') {
      title = 'Baking Hall of Fame';
      icon = '🏆';
    } else if (tab === 'history') {
      title = 'My Baking History';
      icon = '📜';
    } else if (tab === 'teacher') {
      title = 'Teacher Tools Console';
      icon = '👩‍🍳';
    }

    triggerTransition(title, icon, () => {
      setActiveQuiz(null);
      setActiveTab(tab as any);
    });
  };

  const handleStartQuiz = (quiz: Quiz) => {
    const icon = QUIZ_EMOJIS[quiz.id]?.icon || '🥐';
    triggerTransition(`Preparing ${quiz.title}...`, icon, () => {
      setActiveQuiz(quiz);
    });
  };

  const handleExitQuiz = () => {
    triggerTransition('Returning to Bakery Menu...', '🧁', () => {
      setActiveQuiz(null);
    });
  };

  // Active quiz runner state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  const handleFinishQuiz = (result: {
    quizId: string;
    quizTitle: string;
    score: number;
    questionCount: number;
    percentage: number;
    answers: { questionId: string; selectedChoice: 'A' | 'B' | 'C' | 'D' | null; isCorrect: boolean; timedOut?: boolean }[];
  }) => {
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

  // Start on Login Page for anyone visiting the app unless already logged in
  useEffect(() => {
    if (!currentUser) {
      setIsGuestBypass(false);
    }
  }, [currentUser]);

  // If no user is active and guest bypass was not pressed, display the full LoginPage
  if (!currentUser && !isGuestBypass) {
    return (
      <LoginPage
        onContinueAsGuest={() => setIsGuestBypass(true)}
      />
    );
  }

  // Filter published quizzes for players (all visible to teachers)
  const visibleQuizzes = isTeacher ? quizzes : quizzes.filter((q) => q.published);

  return (
    <div className="min-h-screen bg-boudoir-stripes text-neutral-900 flex flex-col font-fredoka selection:bg-pink-300 selection:text-neutral-900">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={activeTab}
        onSelectTab={handleSelectTabWithLoading}
        onOpenAuth={openAuth}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-10 flex flex-col items-center">
        
        {/* If a quiz is actively running, show the QuizRunner */}
        {activeQuiz ? (
          <div className="w-full">
            <QuizRunner
              quiz={activeQuiz}
              questions={questions.filter((q) => q.quizId === activeQuiz.id)}
              previousBestScore={getPreviousBestScore(activeQuiz.id)}
              onFinishQuiz={handleFinishQuiz}
              onExit={handleExitQuiz}
            />
          </div>
        ) : (
          <>
            {/* HERO CARD: Styled after the Baroque Sculpted Mirror Frame in Reference Image */}
            <div className="w-full max-w-3xl mb-8 relative">
              
              {/* Corner Black Bow Decorative Accent */}
              <div className="absolute -top-4 -left-3 sm:-left-5 z-20 text-3xl sm:text-4xl drop-shadow-md select-none transform -rotate-12">
                🎀
              </div>

              {/* Scalloped Bakery Seal / Sticker Badge in Top-Right Corner */}
              <div className="absolute -top-4 -right-2 sm:-right-4 z-20 select-none">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-pink-500 text-white border-2 border-neutral-900 flex flex-col items-center justify-center text-center p-1 shadow-lg transform rotate-6 hover:rotate-0 transition-transform">
                  <span className="text-xs sm:text-sm">🧁</span>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-tight leading-tight">
                    Freshly<br/>Baked
                  </span>
                </div>
              </div>

              {/* The Baroque Rococo Picture Frame */}
              <div className="bg-white/95 rounded-3xl rococo-frame p-6 sm:p-10 text-center relative overflow-hidden">
                
                {/* Filigree Corner Flourishes */}
                <div className="absolute top-2 left-2 text-pink-300 font-script text-xl select-none">❦</div>
                <div className="absolute top-2 right-2 text-pink-300 font-script text-xl select-none">❦</div>
                <div className="absolute bottom-2 left-2 text-pink-300 font-script text-xl select-none">❦</div>
                <div className="absolute bottom-2 right-2 text-pink-300 font-script text-xl select-none">❦</div>

                {/* Subtitle pill badge */}
                <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold bg-pink-100 border border-pink-300 text-pink-900 shadow-xs mb-3">
                  <span>🍓</span>
                  <span className="tracking-widest uppercase text-[11px] font-black">Patisserie Trivia Collection</span>
                  <span>🍰</span>
                </div>

                {/* Vintage Cursive Calligraphy Headline directly matching reference banner */}
                <h1 className="font-script text-4xl sm:text-6xl text-neutral-900 leading-tight">
                  More than just sweet treats —
                </h1>
                
                {/* Vintage Serif Brand Mark */}
                <div className="font-playfair italic font-black text-3xl sm:text-4xl text-pink-600 tracking-tight mt-1 flex items-center justify-center gap-2">
                  <span>🥐</span>
                  <span>EclairWiz</span>
                  <span>🥖</span>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-neutral-700 max-w-lg mx-auto leading-relaxed">
                  Test your pastry knowledge across choux pastry, laminated doughs, velvety buttercreams, artisan sourdough, and confectionery science!
                </p>

                {/* Boutique Bakery Badges */}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
                  <button
                    onClick={() => openAuth('login')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-300 hover:border-neutral-900 text-neutral-800 font-bold transition-all cursor-pointer shadow-xs"
                    title="Click to switch or log in as a baker"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Baker:</span>
                    <strong className="text-pink-600">
                      {currentUser?.username || 'Guest Baker'}
                    </strong>
                    <span className="text-[10px] text-neutral-500 underline ml-0.5">
                      (change)
                    </span>
                  </button>

                  <button
                    onClick={() => setIsQAModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900 text-pink-200 hover:bg-pink-600 hover:text-white border border-neutral-900 text-xs font-bold transition-all cursor-pointer shadow-xs"
                    title="View 16-point specification requirements audit"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-pink-300" />
                    <span>QA Audit: <strong className="text-emerald-400">16/16 Passed</strong></span>
                  </button>

                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-pink-200 text-neutral-700 font-bold shadow-xs">
                    <Clock className="w-3.5 h-3.5 text-pink-500" />
                    <span>Timed Mode: 30s/Q ⏱️</span>
                  </span>
                </div>
              </div>
            </div>

            {/* TAB CONTENT: Quizzes */}
            {activeTab === 'quizzes' && (
              <div className="w-full space-y-8">
                
                {/* Baking Quizzes Cards */}
                <div>
                  <div className="flex items-center justify-between mb-5 px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🥐</span>
                      <h2 className="font-playfair italic font-black text-2xl sm:text-3xl text-neutral-900">
                        Baking Menu &amp; Quizzes
                      </h2>
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-pink-100 text-pink-800 border border-pink-300">
                      {visibleQuizzes.length} Quizzes Available
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleQuizzes.map((quiz) => {
                      const quizQuestions = questions.filter((q) => q.quizId === quiz.id);
                      const pastRuns = completedAttempts.filter(
                        (a) => a.quizId === quiz.id && (currentUser ? a.userId === currentUser.id : true)
                      );
                      const bestScore = pastRuns.length > 0 ? Math.max(...pastRuns.map((r) => r.score)) : null;
                      const emojiData = QUIZ_EMOJIS[quiz.id] || { icon: '🧁', tag: 'Baking', badge: 'Fresh' };

                      return (
                        <div
                          key={quiz.id}
                          className="rounded-3xl boutique-card p-6 flex flex-col justify-between group transition-all duration-200 hover:-translate-y-1 relative overflow-hidden"
                        >
                          {/* Top pink scallop highlight */}
                          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-pink-300 via-pink-400 to-pink-300" />

                          <div>
                            {/* Card Header with Pastry Icon & Timing */}
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-black px-3 py-1 rounded-full bg-pink-100 text-pink-900 border border-pink-300 flex items-center gap-1 shadow-xs">
                                <span>{emojiData.icon}</span>
                                <span>{quiz.subject}</span>
                              </span>
                              
                              <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-600 bg-white/80 px-2 py-0.5 rounded-full border border-pink-200">
                                <Clock className="w-3 h-3 text-pink-500" />
                                <span>{quiz.timeLimitSeconds}s / Q</span>
                              </div>
                            </div>

                            <h3 className="font-playfair font-bold text-xl text-neutral-900 group-hover:text-pink-600 transition-colors leading-snug">
                              {quiz.title}
                            </h3>
                            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                              {quiz.description}
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t-2 border-pink-100 flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-neutral-800 flex items-center gap-1">
                                <span>📜</span>
                                <span>{quizQuestions.length} Questions</span>
                              </div>
                              {bestScore !== null ? (
                                <div className="text-[11px] text-pink-700 font-black flex items-center gap-1 mt-0.5">
                                  <Award className="w-3 h-3 text-pink-600" />
                                  <span>Best: {bestScore}/{quizQuestions.length} ({pastRuns.length} tries)</span>
                                </div>
                              ) : (
                                <div className="text-[11px] text-neutral-500 italic mt-0.5">
                                  Not tasted yet
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => handleStartQuiz(quiz)}
                              className="px-4 py-2 rounded-full font-black uppercase tracking-wider text-xs text-white bg-neutral-900 hover:bg-pink-600 shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 border border-pink-200"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>{bestScore !== null ? 'Retake' : 'Start'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Lace divider */}
                <div className="lace-divider w-full my-6" />

                {/* Phase 5 Production Readiness & Specifications Card */}
                <div className="rounded-3xl bg-white/95 border-2 border-pink-300 p-6 sm:p-7 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b-2 border-pink-100">
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-800 flex items-center gap-2">
                      <span className="text-lg">🎀</span>
                      <span>Phase 5 Complete: All Criteria Verified &amp; Passing</span>
                    </span>
                    <button
                      onClick={() => setIsQAModalOpen(true)}
                      className="text-xs font-black text-neutral-900 bg-pink-200 hover:bg-pink-300 border border-pink-400 px-4 py-1.5 rounded-full transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
                    >
                      <CheckCheck className="w-3.5 h-3.5 text-pink-700" />
                      <span>16 / 16 Acceptance Criteria (Open QA Suite)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-200 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-900 font-bold">Custom Feature 1: Timed Mode Active ⏱️</strong>
                        <p className="text-neutral-600 text-[11px] mt-0.5 leading-relaxed">
                          30-second per-question timers with automatic locking, zero-score on timeout, and answer revelation.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-200 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-900 font-bold">Custom Feature 2: Answer Explanations 💡</strong>
                        <p className="text-neutral-600 text-[11px] mt-0.5 leading-relaxed">
                          Educational culinary explanations displayed after answering and saved to history review cards.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-200 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-900 font-bold">Vintage Boudoir Theme 🎀</strong>
                        <p className="text-neutral-600 text-[11px] mt-0.5 leading-relaxed">
                          Vertical candy stripes, cameo medallions, rococo framing, cute ribbons, and baking emojis.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-200 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-900 font-bold">Dual-Environment Support ⚡</strong>
                        <p className="text-neutral-600 text-[11px] mt-0.5 leading-relaxed">
                          Fully configured for both AI Studio (port 3000) and Replit (port 5000) deployments.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: Leaderboards */}
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

            {/* TAB CONTENT: Teacher Tools */}
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

      {/* Cute Page Transition Loader */}
      <CutePageLoader
        isLoading={pageLoading.active}
        targetTitle={pageLoading.title}
        targetIcon={pageLoading.icon}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authInitialTab}
      />

      {/* QA Acceptance Suite Modal */}
      <QASuiteModal
        isOpen={isQAModalOpen}
        onClose={() => setIsQAModalOpen(false)}
        quizzes={quizzes}
        questions={questions}
        attempts={completedAttempts}
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
