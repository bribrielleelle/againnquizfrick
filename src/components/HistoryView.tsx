import React, { useState } from 'react';
import { Attempt, Question, Quiz } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  History, 
  Trophy, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Eye, 
  BookOpen, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  Filter,
  X
} from 'lucide-react';

interface HistoryViewProps {
  attempts: Attempt[];
  quizzes: Quiz[];
  allQuestions: Question[];
  onRetakeQuiz: (quiz: Quiz) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  attempts,
  quizzes,
  allQuestions,
  onRetakeQuiz,
}) => {
  const { currentUser } = useAuth();
  const [selectedAttemptForReview, setSelectedAttemptForReview] = useState<Attempt | null>(null);
  const [filterQuizId, setFilterQuizId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'oldest'>('newest');

  // Filter attempts for currently logged-in user
  const userAttempts = attempts.filter((att) => 
    currentUser ? att.userId === currentUser.id : true
  );

  // Calculate personal best per quiz for this user
  const bestScoresByQuiz: Record<string, number> = {};
  userAttempts.forEach((att) => {
    if (bestScoresByQuiz[att.quizId] === undefined || att.score > bestScoresByQuiz[att.quizId]) {
      bestScoresByQuiz[att.quizId] = att.score;
    }
  });

  // Filter & sort
  let filtered = userAttempts.filter((att) => 
    filterQuizId === 'all' ? true : att.quizId === filterQuizId
  );

  if (sortBy === 'newest') {
    filtered.sort((a, b) => new Date(b.completedAt || b.startedAt).getTime() - new Date(a.completedAt || a.startedAt).getTime());
  } else if (sortBy === 'oldest') {
    filtered.sort((a, b) => new Date(a.completedAt || a.startedAt).getTime() - new Date(b.completedAt || b.startedAt).getTime());
  } else if (sortBy === 'highest') {
    filtered.sort((a, b) => b.score - a.score);
  }

  // Summary statistics
  const totalCompleted = userAttempts.length;
  const avgPercentage = totalCompleted > 0
    ? Math.round(userAttempts.reduce((sum, a) => sum + a.percentage, 0) / totalCompleted)
    : 0;
  const highestScore = totalCompleted > 0
    ? Math.max(...userAttempts.map((a) => a.score))
    : 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400/20 to-pink-400/20 border border-sky-400/30 flex items-center justify-center text-pink-300">
              <History className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
                <span>My Attempt History</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Logged in as <strong className="text-sky-300">{currentUser?.username || 'Guest Baker'}</strong> · Every completed attempt is saved per Phase 3 specifications.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-300 self-start sm:self-auto">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>Retries Count Separately</span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Attempts</div>
            <div className="text-2xl font-black text-slate-100 font-mono mt-0.5">{totalCompleted}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Score</div>
            <div className="text-2xl font-black text-sky-300 font-mono mt-0.5">{avgPercentage}%</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Best Score</div>
            <div className="text-2xl font-black text-pink-300 font-mono mt-0.5">{highestScore} / 10</div>
          </div>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/70 border border-slate-800/80 p-3 rounded-2xl text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="font-semibold text-slate-400">Filter by Subject:</span>
          <select
            value={filterQuizId}
            onChange={(e) => setFilterQuizId(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-sky-400 cursor-pointer"
          >
            <option value="all">All Quizzes ({userAttempts.length})</option>
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-sky-400 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Score</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Attempts List */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500 mb-4">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-200">No attempts recorded yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            Complete any of the five baking quizzes to start building your personal record!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((att, idx) => {
            const isBest = att.score === bestScoresByQuiz[att.quizId] && att.score > 0;
            const targetQuiz = quizzes.find((q) => q.id === att.quizId);

            return (
              <div
                key={att.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold font-mono ${
                    att.percentage >= 80 
                      ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' 
                      : att.percentage >= 60 
                      ? 'bg-sky-950/60 border border-sky-500/40 text-sky-300' 
                      : 'bg-slate-800 border border-slate-700 text-slate-400'
                  }`}>
                    {att.score}/{att.questionCount}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-slate-100">
                        {att.quizTitle}
                      </h4>
                      {isBest && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-400/15 border border-amber-400/30 text-amber-300 shadow-sm">
                          <Award className="w-3 h-3 text-amber-400" />
                          <span>Personal Best</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="font-semibold text-sky-300 font-mono">{att.percentage}% Accuracy</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>
                          {new Date(att.completedAt || att.startedAt).toLocaleDateString()} at{' '}
                          {new Date(att.completedAt || att.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Per-row Actions: Retake and Review (Phase 3 spec) */}
                <div className="flex items-center gap-2 self-end sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setSelectedAttemptForReview(att)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-400" />
                    <span>Review</span>
                  </button>

                  {targetQuiz && (
                    <button
                      onClick={() => onRetakeQuiz(targetQuiz)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300 hover:opacity-95 shadow-sm transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal for Past Attempt (Feature 2 persistent review) */}
      {selectedAttemptForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col overflow-hidden">
            {/* Top sky blue to pink ombre bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300" />

            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                  Attempt Review · {selectedAttemptForReview.quizTitle}
                </span>
                <div className="text-xs text-slate-400 mt-0.5">
                  Completed score: <strong className="text-slate-100">{selectedAttemptForReview.score}/{selectedAttemptForReview.questionCount}</strong> ({selectedAttemptForReview.percentage}%)
                </div>
              </div>

              <button
                onClick={() => setSelectedAttemptForReview(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Question Breakdown */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {allQuestions
                .filter((q) => q.quizId === selectedAttemptForReview.quizId)
                .map((q, idx) => {
                  const recorded = selectedAttemptForReview.answers.find((a) => a.questionId === q.id);
                  const userChoice = recorded?.selectedChoice;
                  const isCorrect = recorded?.isCorrect;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border text-xs sm:text-sm ${
                        isCorrect
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : 'bg-rose-950/20 border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-400">
                          Question {idx + 1}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            isCorrect
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {isCorrect ? 'CORRECT!' : userChoice ? 'MISSED' : 'UNANSWERED'}
                        </span>
                      </div>

                      <div className="font-bold text-slate-100 mb-3">
                        {q.prompt}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                        {q.choices.map((c) => {
                          const wasChosen = userChoice === c.label;
                          const isTheCorrectOne = c.label === q.correctChoice;

                          let choiceStyle = 'bg-slate-800/50 border-slate-700/60 text-slate-300';
                          if (isTheCorrectOne) {
                            choiceStyle = 'bg-emerald-900/40 border-emerald-500/60 text-emerald-200 font-bold';
                          } else if (wasChosen && !isCorrect) {
                            choiceStyle = 'bg-rose-900/40 border-rose-500/60 text-rose-200 line-through';
                          }

                          return (
                            <div
                              key={c.id}
                              className={`p-2.5 rounded-xl border flex items-center justify-between ${choiceStyle}`}
                            >
                              <span>
                                <strong className="mr-1.5">{c.label})</strong>
                                {c.text}
                              </span>
                              {isTheCorrectOne && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                              {wasChosen && !isTheCorrectOne && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                            </div>
                          );
                        })}
                      </div>

                      {q.explanation && (
                        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300">
                          <strong className="text-sky-300">Explanation: </strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-right flex-shrink-0">
              <button
                onClick={() => setSelectedAttemptForReview(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
