import React, { useState } from 'react';
import { Attempt, Quiz } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  Medal,
  Clock
} from 'lucide-react';

interface LeaderboardViewProps {
  attempts: Attempt[];
  quizzes: Quiz[];
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ attempts, quizzes }) => {
  const { currentUser } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'overall' | string>('overall');

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
      };
    }
    overallUserStats[att.userId].completedAttempts += 1;
    overallUserStats[att.userId].totalCorrect += att.score;
    overallUserStats[att.userId].totalQuestions += att.questionCount;
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

  const currentQuizRanked = selectedTab === 'overall' ? [] : getQuizLeaderboard(selectedTab);
  const selectedQuizObj = quizzes.find((q) => q.id === selectedTab);

  // Active user's rank
  const activeUserRankIndex =
    selectedTab === 'overall'
      ? overallRanked.findIndex((u) => u.userId === currentUser?.id)
      : currentQuizRanked.findIndex((u) => u.userId === currentUser?.id);

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
                <span>Baking Hall of Fame</span>
              </h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                Deterministic rankings per Phase 4 specification · Usernames only for player privacy.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-300 text-xs font-bold text-pink-900 shadow-xs">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span>Top 10 + Pinned Rank</span>
          </div>
        </div>

        {/* Tab Selector: Overall + 5 Baking Quizzes */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t-2 border-pink-100 overflow-x-auto pb-1 scrollbar-none">
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
                selectedTab === 'overall' ? (
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
                  You are not ranked on this board yet. Take a quiz to claim your spot in the bakery!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
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

    </div>
  );
};
