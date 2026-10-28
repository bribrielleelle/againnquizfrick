import React, { useState } from 'react';
import { Attempt, Quiz } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  Medal,
  Clock,
  Search,
  Users,
  CheckCircle2,
  Award,
  BookOpen,
  Filter
} from 'lucide-react';

interface LeaderboardViewProps {
  attempts: Attempt[];
  quizzes: Quiz[];
}

const QUIZ_ICONS: Record<string, string> = {
  'quiz-pastry-fundamentals': '🥐',
  'quiz-cakes-frostings': '🍰',
  'quiz-artisan-breads': '🥖',
  'quiz-cookies-confections': '🍪',
  'quiz-science-troubleshooting': '🔬',
};

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ attempts, quizzes }) => {
  const { currentUser, usersList } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'overall' | 'progress' | string>('overall');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter only completed attempts (D7 rule: uncompleted attempts never count)
  const completed = attempts.filter((a) => a.completedAt !== null);

  // 1. Overall Leaderboard Calculation (D17 Tie-breaks:
  // Primary: Total completed attempts desc
  // Tie-break 1: More total correct answers desc
  // Tie-break 2: Username A-Z
  const overallUserStats: Record<
    string,
    {
      userId: string;
      username: string;
      completedAttempts: number;
      totalCorrect: number;
      totalQuestions: number;
      quizScores: Record<string, number>; // best score per quiz
    }
  > = {};

  completed.forEach((att) => {
    if (!overallUserStats[att.userId]) {
      overallUserStats[att.userId] = {
        userId: att.userId,
        username: att.username,
        completedAttempts: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        quizScores: {},
      };
    }
    overallUserStats[att.userId].completedAttempts += 1;
    overallUserStats[att.userId].totalCorrect += att.score;
    overallUserStats[att.userId].totalQuestions += att.questionCount;

    // Track best score for this quiz
    const prevBest = overallUserStats[att.userId].quizScores[att.quizId] || 0;
    if (att.score > prevBest) {
      overallUserStats[att.userId].quizScores[att.quizId] = att.score;
    }
  });

  const overallRanked = Object.values(overallUserStats).sort((a, b) => {
    // 1. Completed attempts desc
    if (b.completedAttempts !== a.completedAttempts) {
      return b.completedAttempts - a.completedAttempts;
    }
    // 2. Total correct answers desc
    if (b.totalCorrect !== a.totalCorrect) {
      return b.totalCorrect - a.totalCorrect;
    }
    // 3. Username A-Z
    return a.username.localeCompare(b.username);
  });

  // 2. Per-Quiz Leaderboard Calculation (D16 Tie-breaks:
  // Primary: Highest score desc
  // Tie-break 1: Fewer completed attempts on this quiz asc (more efficient)
  // Tie-break 2: Earliest best-score completion asc
  // Tie-break 3: Username A-Z
  const getQuizLeaderboard = (quizId: string) => {
    const quizAttempts = completed.filter((a) => a.quizId === quizId);
    const userStats: Record<
      string,
      {
        userId: string;
        username: string;
        bestScore: number;
        questionCount: number;
        bestPercentage: number;
        bestCompletionTime: number;
        completedAttempts: number;
      }
    > = {};

    quizAttempts.forEach((att) => {
      const completionTime = new Date(att.completedAt || att.startedAt).getTime();
      if (!userStats[att.userId]) {
        userStats[att.userId] = {
          userId: att.userId,
          username: att.username,
          bestScore: att.score,
          questionCount: att.questionCount,
          bestPercentage: att.percentage,
          bestCompletionTime: completionTime,
          completedAttempts: 1,
        };
      } else {
        userStats[att.userId].completedAttempts += 1;
        if (
          att.score > userStats[att.userId].bestScore ||
          (att.score === userStats[att.userId].bestScore && completionTime < userStats[att.userId].bestCompletionTime)
        ) {
          userStats[att.userId].bestScore = att.score;
          userStats[att.userId].questionCount = att.questionCount;
          userStats[att.userId].bestPercentage = att.percentage;
          userStats[att.userId].bestCompletionTime = completionTime;
        }
      }
    });

    return Object.values(userStats).sort((a, b) => {
      // 1. Highest score desc
      if (b.bestScore !== a.bestScore) {
        return b.bestScore - a.bestScore;
      }
      // 2. Fewer completed attempts asc
      if (a.completedAttempts !== b.completedAttempts) {
        return a.completedAttempts - b.completedAttempts;
      }
      // 3. Earliest best-score completion asc
      if (a.bestCompletionTime !== b.bestCompletionTime) {
        return a.bestCompletionTime - b.bestCompletionTime;
      }
      // 4. Username A-Z
      return a.username.localeCompare(b.username);
    });
  };

  const currentQuizRanked = ['overall', 'progress'].includes(selectedTab) ? [] : getQuizLeaderboard(selectedTab);
  const selectedQuizObj = quizzes.find((q) => q.id === selectedTab);

  // Active user's rank
  const activeUserRankIndex =
    selectedTab === 'overall' || selectedTab === 'progress'
      ? overallRanked.findIndex((u) => u.userId === currentUser?.id)
      : currentQuizRanked.findIndex((u) => u.userId === currentUser?.id);

  // Filtered baker progress list for search
  const filteredProgressBakers = overallRanked.filter((baker) =>
    baker.username.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Leaderboard Header with Cameo & Bow */}
      <div className="rounded-3xl bg-white/95 rococo-frame p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        {/* Top Black Bow */}
        <div className="absolute -top-3 left-6 text-3xl select-none">
          🎀
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-pink-100 border-2 border-neutral-900 flex items-center justify-center text-pink-600 shadow-sm">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <h2 className="font-playfair italic font-black text-2xl sm:text-3xl text-neutral-900 flex items-center gap-2">
                <span>Baking Hall of Fame &amp; Progress</span>
              </h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                Saved for all users · Every completed attempt persists across logins so everyone can see each other's progress.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-300 text-xs font-bold text-pink-900 shadow-xs">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span>{overallRanked.length} Active Bakers Tracked</span>
          </div>
        </div>

        {/* Global Persistence Status Tag */}
        <div className="mt-4 p-2.5 rounded-2xl bg-pink-50 border border-pink-200 flex items-center gap-2 text-xs text-neutral-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            <strong>Global Leaderboard Storage:</strong> Scores and quiz attempts save locally and persist across all user accounts on this device.
          </span>
        </div>

        {/* Tab Selector: Overall + Everyone's Progress + 5 Baking Quizzes */}
        <div className="flex items-center gap-2 mt-5 pt-5 border-t-2 border-pink-100 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedTab('overall')}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              selectedTab === 'overall'
                ? 'bg-neutral-900 text-white shadow-md border border-neutral-900'
                : 'bg-pink-50 text-neutral-700 hover:text-neutral-900 hover:bg-pink-100 border border-pink-200'
            }`}
          >
            <span>👑</span>
            <span>Overall Board</span>
          </button>

          <button
            onClick={() => setSelectedTab('progress')}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              selectedTab === 'progress'
                ? 'bg-neutral-900 text-white shadow-md border border-neutral-900'
                : 'bg-pink-100 text-pink-900 hover:bg-pink-200 border border-pink-300'
            }`}
          >
            <span>🧁</span>
            <span>Everyone's Progress Grid</span>
          </button>

          {quizzes.map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => setSelectedTab(quiz.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedTab === quiz.id
                  ? 'bg-neutral-900 text-white shadow-md border border-neutral-900'
                  : 'bg-pink-50 text-neutral-700 hover:text-neutral-900 hover:bg-pink-100 border border-pink-200'
              }`}
            >
              <span>{QUIZ_ICONS[quiz.id] || '🥐'}</span>
              <span>{quiz.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pinned "Your Rank" Row */}
      <div className="rounded-2xl bg-white/95 border-2 border-pink-300 p-4 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center font-black text-sm text-pink-700 border-2 border-pink-300">
            {activeUserRankIndex >= 0 ? `#${activeUserRankIndex + 1}` : '—'}
          </div>
          <div>
            <div className="text-xs font-black text-neutral-900 flex items-center gap-2">
              <span>Your Ranking: {currentUser ? currentUser.username : 'Guest'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-200 text-pink-900 uppercase font-black">
                Pinned
              </span>
            </div>
            <div className="text-[11px] text-neutral-600 mt-0.5">
              {activeUserRankIndex >= 0 ? (
                selectedTab === 'overall' || selectedTab === 'progress' ? (
                  <span>
                    Ranked #{activeUserRankIndex + 1} with{' '}
                    <strong className="text-pink-700 font-bold">{overallRanked[activeUserRankIndex].completedAttempts}</strong> completed{' '}
                    {overallRanked[activeUserRankIndex].completedAttempts === 1 ? 'attempt' : 'attempts'} and{' '}
                    <strong className="text-pink-700 font-bold">{overallRanked[activeUserRankIndex].totalCorrect}</strong> correct answers!
                  </span>
                ) : (
                  <span>
                    Ranked #{activeUserRankIndex + 1} on {selectedQuizObj?.title} with best score of{' '}
                    <strong className="text-pink-700 font-bold">{currentQuizRanked[activeUserRankIndex].bestScore}/10</strong> in{' '}
                    <strong className="text-pink-700 font-bold">{currentQuizRanked[activeUserRankIndex].completedAttempts}</strong>{' '}
                    {currentQuizRanked[activeUserRankIndex].completedAttempts === 1 ? 'try' : 'tries'}!
                  </span>
                )
              ) : (
                <span className="text-neutral-500">
                  You are not ranked on this board yet. Complete any quiz to save your spot and appear to all users!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TAB CONTENT 1: EVERYONE'S PROGRESS GRID (All users' progress across all quizzes) */}
      {selectedTab === 'progress' && (
        <div className="rounded-3xl bg-white/95 border-2 border-pink-200 p-6 sm:p-8 shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-pink-100">
            <div>
              <h3 className="font-playfair font-black text-xl text-neutral-900 flex items-center gap-2">
                <span>🧁</span>
                <span>Everyone's Baking Progress Overview</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                See every baker's scores across all five categories. Progress updates automatically whenever anyone takes a quiz.
              </p>
            </div>

            {/* Search filter for bakers */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search baker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-pink-50 border border-pink-300 rounded-full text-xs text-neutral-900 font-bold placeholder:text-neutral-400 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {filteredProgressBakers.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              No bakers matching "{searchQuery}" found.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProgressBakers.map((baker, idx) => {
                const isYou = currentUser?.id === baker.userId;
                const quizzesCompletedCount = Object.keys(baker.quizScores).length;
                const masteryPercentage = Math.round((baker.totalCorrect / Math.max(1, baker.totalQuestions)) * 100);

                let levelTag = 'Apprentice Baker 🧁';
                if (baker.totalCorrect >= 35) levelTag = 'Grand Maître Pâtissier 🌟';
                else if (baker.totalCorrect >= 20) levelTag = 'Senior Patissier 🍰';
                else if (baker.totalCorrect >= 10) levelTag = 'Pastry Journeyman 🥐';

                return (
                  <div
                    key={baker.userId}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      idx === 0
                        ? 'bg-pink-100/60 border-neutral-900 shadow-xs'
                        : isYou
                        ? 'bg-pink-50/80 border-pink-400'
                        : 'bg-white border-pink-100 hover:border-pink-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs ${
                          idx === 0 ? 'bg-neutral-900 text-white' : 'bg-pink-200 text-neutral-900'
                        }`}>
                          {idx === 0 ? '👑' : `#${idx + 1}`}
                        </div>

                        <div>
                          <div className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                            <span>{baker.username}</span>
                            {isYou && (
                              <span className="text-[10px] px-2 py-0.2 rounded-full bg-pink-200 text-pink-900 font-black">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-pink-700 font-black uppercase">
                            {levelTag}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <div className="text-right">
                          <div className="text-[11px] font-bold text-neutral-600">Quizzes Attempted</div>
                          <div className="font-black text-neutral-900">{quizzesCompletedCount} / {quizzes.length} Quizzes</div>
                        </div>

                        <div className="text-right">
                          <div className="text-[11px] font-bold text-neutral-600">Total Score</div>
                          <div className="font-serif font-black text-pink-700 text-base">
                            {baker.totalCorrect} pts ({masteryPercentage}%)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quiz Breakdown Chips for this Baker */}
                    <div className="pt-2 border-t border-pink-100 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-[10px] font-bold text-neutral-500 mr-1 uppercase">Best Scores:</span>
                      {quizzes.map((q) => {
                        const score = baker.quizScores[q.id];
                        const icon = QUIZ_ICONS[q.id] || '🥐';

                        return (
                          <div
                            key={q.id}
                            className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 text-[11px] ${
                              score !== undefined
                                ? 'bg-pink-50 border-pink-300 text-neutral-900 font-bold'
                                : 'bg-neutral-50 border-neutral-200 text-neutral-400 opacity-60'
                            }`}
                            title={`${q.title}: ${score !== undefined ? `${score}/10` : 'Not taken yet'}`}
                          >
                            <span>{icon}</span>
                            <span className="hidden sm:inline text-[10px] font-medium truncate max-w-[80px]">
                              {q.subject}:
                            </span>
                            <strong className={score !== undefined ? 'text-pink-700' : 'text-neutral-400'}>
                              {score !== undefined ? `${score}/10` : '—'}
                            </strong>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: OVERALL BOARD & PER-QUIZ LEADERBOARDS */}
      {selectedTab !== 'progress' && (
        <div className="rounded-3xl bg-white/95 border-2 border-pink-200 p-6 sm:p-8 shadow-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-pink-100">
            <div>
              <h3 className="font-playfair font-bold text-xl text-neutral-900 flex items-center gap-2">
                <span>{selectedTab === 'overall' ? 'Overall Pastry Leaderboard' : `${selectedQuizObj?.title} Standings`}</span>
              </h3>
              <p className="text-xs text-neutral-500">
                {selectedTab === 'overall'
                  ? 'Ranked primarily by total completed attempts (D17), ties by total correct answers.'
                  : 'Ranked by highest score (D16), ties by fewer attempts (efficiency).'}
              </p>
            </div>

            <span className="text-xs font-black uppercase text-pink-700 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
              Top 10 Display
            </span>
          </div>

          {selectedTab === 'overall' ? (
            /* OVERALL BOARD */
            overallRanked.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-500">
                No completed attempts on record yet. Complete your first quiz to top the board!
              </div>
            ) : (
              <div className="space-y-2 mt-4">
                {overallRanked.slice(0, 10).map((row, idx) => {
                  const isFirst = idx === 0;
                  const isSecond = idx === 1;
                  const isThird = idx === 2;
                  const isYou = currentUser?.id === row.userId;

                  return (
                    <div
                      key={row.userId}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between text-xs transition-all ${
                        isFirst
                          ? 'bg-pink-100/70 border-neutral-900 shadow-sm'
                          : isYou
                          ? 'bg-pink-50 border-pink-400'
                          : 'bg-white border-pink-100 hover:border-pink-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                            isFirst
                              ? 'bg-neutral-900 text-white shadow-xs'
                              : isSecond
                              ? 'bg-pink-300 text-neutral-900'
                              : isThird
                              ? 'bg-pink-200 text-neutral-900'
                              : 'bg-pink-50 text-neutral-700 border border-pink-200'
                          }`}
                        >
                          {isFirst ? '👑' : `#${idx + 1}`}
                        </div>

                        <div>
                          <div className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                            <span>{row.username}</span>
                            {isYou && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-200 text-pink-900 font-black">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-500 mt-0.5">
                            {row.totalCorrect} total correct answers ({row.totalQuestions > 0 ? Math.round((row.totalCorrect / row.totalQuestions) * 100) : 0}% accuracy)
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-serif font-black text-base text-pink-700">
                          {row.completedAttempts} {row.completedAttempts === 1 ? 'Attempt' : 'Attempts'}
                        </div>
                        <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
                          Completed
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* PER-QUIZ BOARD */
            currentQuizRanked.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-500">
                No completed attempts on this quiz yet. Be the first to set the record!
              </div>
            ) : (
              <div className="space-y-2 mt-4">
                {currentQuizRanked.slice(0, 10).map((row, idx) => {
                  const isFirst = idx === 0;
                  const isSecond = idx === 1;
                  const isThird = idx === 2;
                  const isYou = currentUser?.id === row.userId;

                  return (
                    <div
                      key={row.userId}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between text-xs transition-all ${
                        isFirst
                          ? 'bg-pink-100/70 border-neutral-900 shadow-sm'
                          : isYou
                          ? 'bg-pink-50 border-pink-400'
                          : 'bg-white border-pink-100 hover:border-pink-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                            isFirst
                              ? 'bg-neutral-900 text-white shadow-xs'
                              : isSecond
                              ? 'bg-pink-300 text-neutral-900'
                              : isThird
                              ? 'bg-pink-200 text-neutral-900'
                              : 'bg-pink-50 text-neutral-700 border border-pink-200'
                          }`}
                        >
                          {isFirst ? '👑' : `#${idx + 1}`}
                        </div>

                        <div>
                          <div className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                            <span>{row.username}</span>
                            {isYou && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-200 text-pink-900 font-black">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-500 mt-0.5">
                            Achieved in {row.completedAttempts} {row.completedAttempts === 1 ? 'attempt' : 'attempts'} (efficiency tie-break)
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-serif font-black text-base text-pink-700">
                          {row.bestScore} / {row.questionCount}
                        </div>
                        <div className="text-[10px] text-neutral-600 font-bold">
                          {row.bestPercentage}% Score
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      )}

    </div>
  );
};
