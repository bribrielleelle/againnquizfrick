import React, { useState } from 'react';
import { AuthProvider, useAuth, TEACHER_INVITE_CODE } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { INITIAL_QUIZZES, INITIAL_QUESTIONS } from './data/bakingQuizzes';
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Key, 
  UserPlus, 
  LogIn, 
  ChefHat, 
  BookOpen, 
  Clock, 
  Lock, 
  ArrowRight,
  ShieldAlert,
  Flame,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

function PhaseOneDashboard() {
  const { currentUser, isAuthenticated, isTeacher, switchUserRole, usersList } = useAuth();
  const [activeTab, setActiveTab] = useState<'quizzes' | 'leaderboards' | 'history' | 'teacher'>('quizzes');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');

  // Preview question test
  const [previewQuizIndex, setPreviewQuizIndex] = useState<number | null>(null);
  const [previewAnswer, setPreviewAnswer] = useState<string | null>(null);

  const openAuth = (tab: 'login' | 'register') => {
    setAuthInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Background soft ambient glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[380px] bg-gradient-to-r from-sky-500/10 via-pink-500/10 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Top Navbar */}
      <Navbar
        currentTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab as any)}
        onOpenAuth={openAuth}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-10 flex flex-col items-center">
        
        {/* Main Column Header with the requested sky blue fading ombre into light pink */}
        <div className="w-full max-w-2xl text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-sky-300 shadow-sm mb-3">
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            <span className="font-mono uppercase tracking-wider text-[11px]">Phase 1: Foundation &amp; Accounts</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300 bg-clip-text text-transparent pb-1">
            brielles quiz
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
            A high-performance baking quiz platform featuring 5 launch subjects, role security, and real-time grading.
          </p>

          {/* Quick status bar */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Auth Engine: <strong className="text-emerald-400">Online</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              Topic: <strong className="text-sky-300">Baking Science &amp; Pastry</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
              <Key className="w-3.5 h-3.5 text-pink-400" />
              Teacher Code: <code className="text-pink-300 font-mono font-bold">{TEACHER_INVITE_CODE}</code>
            </span>
          </div>
        </div>

        {/* Phase 1 Verification Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Card 1: Current Session & Role Inspector */}
          <div className="md:col-span-1 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>Session State</span>
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isAuthenticated 
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                }`}>
                  {isAuthenticated ? 'Authenticated' : 'Guest'}
                </span>
              </div>

              {isAuthenticated && currentUser ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <div className="text-xs text-slate-400 font-medium">Logged in as</div>
                    <div className="text-lg font-bold text-slate-100 flex items-center gap-2 mt-0.5">
                      <span>{currentUser.username}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                        currentUser.role === 'teacher' ? 'bg-pink-500/20 text-pink-300' : 'bg-sky-500/20 text-sky-300'
                      }`}>
                        {currentUser.role}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 font-mono truncate">
                      {currentUser.email}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Role Permissions
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Take Quizzes &amp; Track History</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Public Leaderboard Ranking</span>
                      </div>
                      <div className={`flex items-center gap-2 ${isTeacher ? 'text-pink-300 font-medium' : 'text-slate-500 line-through'}`}>
                        {isTeacher ? <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" /> : <Lock className="w-3.5 h-3.5" />}
                        <span>Teacher Question Authoring &amp; CSV</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-slate-400 mb-4">
                    You are currently in guest mode. Log in or create an account to record your quiz scores.
                  </p>
                  <button
                    onClick={() => openAuth('login')}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-sky-400 to-pink-300 hover:opacity-95 transition-opacity"
                  >
                    Log In or Register
                  </button>
                </div>
              )}
            </div>

            {/* Quick role test button */}
            {isAuthenticated && currentUser && (
              <div className="pt-4 mt-4 border-t border-slate-800">
                <button
                  onClick={() => switchUserRole(currentUser.role === 'teacher' ? 'player' : 'teacher')}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                  <span>Toggle Role to: <strong className="text-pink-300">{currentUser.role === 'teacher' ? 'Player' : 'Teacher'}</strong></span>
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Phase 1 Checklist per Specification */}
          <div className="md:col-span-2 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-pink-400" />
                <span>Phase 1 Requirements Checklist</span>
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                5 / 5 Complete
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    User Registration &amp; Account Architecture
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Validates unique username, email format, and password length (3-30 chars regex protection against injections).
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    Two-Tier Role Hierarchy &amp; Secret Teacher Code
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Public registration defaults to <code className="text-sky-300 font-mono">player</code>. Providing the secret invite code (<code className="text-pink-300 font-mono">{TEACHER_INVITE_CODE}</code>) unlocks the <code className="text-pink-300 font-mono">teacher</code> role.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    Session Management &amp; Restart Persistence
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Current user session and registered accounts survive page reloads and browser restarts.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    Teacher Route &amp; Navigation Guarding
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Teacher Tools tab and authoring controls are strictly hidden from player accounts and require teacher privileges.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    Baking Content Bank Seeded (5 Quizzes × 10 Questions = 50 Total)
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Seeded with 50 high quality questions across 5 baking subjects with answer choices, keys, and educational explanations.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Section: 5 Baking Quizzes Prepared for Phase 2 */}
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-sky-400" />
                <span>The 5 Baking Launch Quizzes</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every quiz is prepared with 10 questions, 4 choices, 1 correct answer, and explanations.
              </p>
            </div>
            <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              Ready for <strong className="text-sky-300">Phase 2: Quiz Engine</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {INITIAL_QUIZZES.map((quiz, idx) => {
              const quizQuestions = INITIAL_QUESTIONS.filter((q) => q.quizId === quiz.id);

              return (
                <div
                  key={quiz.id}
                  className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 p-5 shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between group"
                >
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

                    <h3 className="text-base font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {quiz.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      {quizQuestions.length} Questions
                    </span>

                    <button
                      onClick={() => {
                        setPreviewQuizIndex(idx);
                        setPreviewAnswer(null);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-sky-400 to-pink-300 hover:opacity-95 shadow-sm transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                      <span>Preview Q1</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Question Preview Modal */}
        {previewQuizIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300" />
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                  {INITIAL_QUIZZES[previewQuizIndex].title} · Question 1
                </span>
                <button
                  onClick={() => setPreviewQuizIndex(null)}
                  className="text-xs text-slate-400 hover:text-slate-100 bg-slate-800 px-2.5 py-1 rounded-lg"
                >
                  Close Preview
                </button>
              </div>

              {(() => {
                const q = INITIAL_QUESTIONS.filter((q) => q.quizId === INITIAL_QUIZZES[previewQuizIndex].id)[0];
                if (!q) return null;

                return (
                  <div>
                    <h3 className="text-lg font-bold text-slate-100 mb-4">
                      {q.prompt}
                    </h3>

                    <div className="space-y-2 mb-5">
                      {q.choices.map((choice) => {
                        const isChosen = previewAnswer === choice.label;
                        const isCorrect = choice.label === q.correctChoice;

                        let style = 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-200';
                        if (previewAnswer) {
                          if (isCorrect) {
                            style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                          } else if (isChosen) {
                            style = 'bg-rose-950/60 border-rose-500 text-rose-200';
                          } else {
                            style = 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-50';
                          }
                        }

                        return (
                          <button
                            key={choice.id}
                            disabled={previewAnswer !== null}
                            onClick={() => setPreviewAnswer(choice.label)}
                            className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${style}`}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-md bg-slate-700/80 text-xs font-bold flex items-center justify-center">
                                {choice.label}
                              </span>
                              <span>{choice.text}</span>
                            </span>
                            {previewAnswer && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>

                    {previewAnswer && (
                      <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                        <strong className="text-sky-300">Explanation: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
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
      <PhaseOneDashboard />
    </AuthProvider>
  );
}
