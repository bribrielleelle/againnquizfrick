import React, { useState } from 'react';
import { Attempt, Question, Quiz } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  History, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Eye, 
  Clock, 
  Filter, 
  X,
  Sparkles
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
      
      {/* Header Banner - Vintage Patisserie Recipe Ledger */}
      <div className="rounded-3xl bg-white/95 rococo-frame p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        {/* Top ribbon bow */}
        <div className="absolute -top-3 left-6 text-3xl select-none">
          🎀
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-pink-100 border-2 border-neutral-900 flex items-center justify-center text-pink-600 shadow-sm">
              <span className="text-2xl">📜</span>
            </div>
            <div>
              <h2 className="font-playfair italic font-black text-2xl sm:text-3xl text-neutral-900 flex items-center gap-2">
                <span>My Baking History</span>
              </h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                Logged in as <strong className="text-pink-700 font-bold">{currentUser?.username || 'Guest Baker'}</strong> · Every completed attempt is saved per Phase 3 specifications.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-300 text-xs font-bold text-pink-900 self-start sm:self-auto shadow-xs">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span>Retries Count Separately</span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t-2 border-pink-100">
          <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-200 text-center">
            <div className="text-[11px] font-black uppercase tracking-wider text-neutral-600">Total Attempts</div>
            <div className="text-2xl font-black font-serif text-neutral-900 mt-0.5">{totalCompleted}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-200 text-center">
            <div className="text-[11px] font-black uppercase tracking-wider text-neutral-600">Average Score</div>
            <div className="text-2xl font-black font-serif text-pink-600 mt-0.5">{avgPercentage}%</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-pink-50/70 border border-pink-200 text-center">
            <div className="text-[11px] font-black uppercase tracking-wider text-neutral-600">Best Score</div>
            <div className="text-2xl font-black font-serif text-pink-700 mt-0.5">{highestScore} / 10</div>
          </div>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/95 border-2 border-pink-200 p-3 rounded-2xl text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-pink-600 flex-shrink-0" />
          <span className="font-bold text-neutral-700">Filter by Subject:</span>
          <select
            value={filterQuizId}
            onChange={(e) => setFilterQuizId(e.target.value)}
            className="bg-pink-50 border border-pink-300 rounded-xl px-2.5 py-1.5 text-neutral-800 font-bold focus:outline-none focus:border-pink-500 cursor-pointer"
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
          <span className="font-bold text-neutral-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-pink-50 border border-pink-300 rounded-xl px-2.5 py-1.5 text-neutral-800 font-bold focus:outline-none focus:border-pink-500 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Score</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Attempts List */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-white/95 border-2 border-pink-200 p-12 text-center shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-pink-100 border-2 border-pink-300 flex items-center justify-center text-pink-600 mb-4">
            <span className="text-3xl">🧁</span>
          </div>
          <h3 className="font-playfair font-black text-lg text-neutral-900">No attempts recorded yet</h3>
          <p className="text-xs text-neutral-600 max-w-sm mx-auto mt-1 mb-6">
            Complete any of the five baking quizzes to start building your personal recipe ledger!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((att) => {
            const isBest = att.score === bestScoresByQuiz[att.quizId] && att.score > 0;
            const targetQuiz = quizzes.find((q) => q.id === att.quizId);

            return (
              <div
                key={att.id}
                className="rounded-2xl bg-white/95 border-2 border-pink-200 hover:border-pink-400 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm font-black font-serif ${
                    att.percentage >= 80 
                      ? 'bg-pink-100 border-2 border-neutral-900 text-neutral-900' 
                      : att.percentage >= 60 
                      ? 'bg-pink-50 border-2 border-pink-300 text-pink-800' 
                      : 'bg-neutral-100 border border-neutral-300 text-neutral-600'
                  }`}>
                    {att.score}/{att.questionCount}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-playfair font-bold text-base text-neutral-900">
                        {att.quizTitle}
                      </h4>
                      {isBest && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-500 text-white shadow-xs">
                          <Award className="w-3 h-3 text-amber-200" />
                          <span>Personal Best 🌟</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 mt-1">
                      <span className="font-black text-pink-700">{att.percentage}% Accuracy</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-neutral-500">
                        <Clock className="w-3 h-3 text-pink-500" />
                        <span>
                          {new Date(att.completedAt || att.startedAt).toLocaleDateString()} at{' '}
                          {new Date(att.completedAt || att.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Per-row Actions: Retake and Review (Phase 3 spec) */}
                <div className="flex items-center gap-2 self-end sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-pink-100 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setSelectedAttemptForReview(att)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold text-neutral-800 bg-pink-50 hover:bg-pink-100 border border-pink-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-pink-600" />
                    <span>Review</span>
                  </button>

                  {targetQuiz && (
                    <button
                      onClick={() => onRetakeQuiz(targetQuiz)}
                      className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-neutral-900 hover:bg-pink-600 shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer border border-pink-200"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-white border-4 border-neutral-900 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col overflow-hidden">
            
            <div className="flex items-center justify-between mb-4 flex-shrink-0 pb-3 border-b-2 border-pink-100">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-pink-600 flex items-center gap-1">
                  <span>🎀</span>
                  <span>Attempt Review · {selectedAttemptForReview.quizTitle}</span>
                </span>
                <div className="text-xs text-neutral-700 mt-0.5 font-bold">
                  Score: <strong className="text-pink-700">{selectedAttemptForReview.score}/{selectedAttemptForReview.questionCount}</strong> ({selectedAttemptForReview.percentage}%)
                </div>
              </div>

              <button
                onClick={() => setSelectedAttemptForReview(null)}
                className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-pink-100 transition-colors cursor-pointer"
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
                      className={`p-4 rounded-2xl border-2 text-xs sm:text-sm ${
                        isCorrect
                          ? 'bg-emerald-50/70 border-emerald-300'
                          : 'bg-rose-50/70 border-rose-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-neutral-600">
                          Question {idx + 1}
                        </span>
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                            isCorrect
                              ? 'bg-emerald-200 text-emerald-900'
                              : 'bg-rose-200 text-rose-900'
                          }`}
                        >
                          {isCorrect ? 'CORRECT 🍰' : userChoice ? 'MISSED 🥐' : 'UNANSWERED'}
                        </span>
                      </div>

                      <div className="font-bold text-neutral-900 mb-3">
                        {q.prompt}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                        {q.choices.map((c) => {
                          const wasChosen = userChoice === c.label;
                          const isTheCorrectOne = c.label === q.correctChoice;

                          let choiceStyle = 'bg-white border-pink-200 text-neutral-700';
                          if (isTheCorrectOne) {
                            choiceStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                          } else if (wasChosen && !isCorrect) {
                            choiceStyle = 'bg-rose-100 border-rose-400 text-rose-950 line-through';
                          }

                          return (
                            <div
                              key={c.id}
                              className={`p-2.5 rounded-xl border flex items-center justify-between shadow-xs ${choiceStyle}`}
                            >
                              <span>
                                <strong className="mr-1.5">{c.label})</strong>
                                {c.text}
                              </span>
                              {isTheCorrectOne && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                              {wasChosen && !isTheCorrectOne && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                            </div>
                          );
                        })}
                      </div>

                      {q.explanation && (
                        <div className="p-3 rounded-xl bg-white/90 border border-pink-200 text-xs text-neutral-800">
                          <strong className="text-pink-700">Pastry Fact: </strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            <div className="mt-4 pt-3 border-t-2 border-pink-100 text-right flex-shrink-0">
              <button
                onClick={() => setSelectedAttemptForReview(null)}
                className="px-5 py-2 rounded-full text-xs font-bold bg-pink-100 hover:bg-pink-200 text-neutral-900 transition-colors cursor-pointer"
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
