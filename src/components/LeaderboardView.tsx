import React, { useState } from 'react';
import { Attempt, Quiz } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Trophy, 
  Award, 
  Medal, 
  Crown, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  User, 
  Clock, 
  TrendingUp,
  Layers
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
      
      {/* Leaderboard Header */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400/20 to-pink-400/20 border border-sky-400/30 flex items-center justify-center text-pink-300">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
                <span>Baking Hall of Fame</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Deterministic rankings per Phase 4 specification · Usernames only for player privacy.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-pink-300" />
            <span>Top 10 + Pinned Your Rank</span>
          </div>
        </div>

        {/* Tab Selector: Overall + 5 Baking Quizzes */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedTab('overall')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              selectedTab === 'overall'
                ? 'bg-gradient-to-r from-sky-400 to-pink-300 text-slate-950 shadow-md shadow-pink-500/10'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-750'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Overall Board</span>
          </button>

          {quizzes.map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => setSelectedTab(quiz.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedTab === quiz.id
                  ? 'bg-gradient-to-r from-sky-400 to-pink-300 text-slate-950 shadow-md shadow-pink-500/10'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-750'
              }`}
            >
              <span>{quiz.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pinned "Your Rank" Row */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-pink-950/40 border border-sky-400/30 p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center font-black text-sm text-sky-300 border border-slate-700">
            {activeUserRankIndex >= 0 ? `#${activeUserRankIndex + 1}` : '—'}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <span>Your Ranking: {currentUser ? currentUser.username : 'Guest'}</span>
              <span className="text-[10px] px-2 py-0.2 rounded bg-sky-500/20 text-sky-300 uppercase font-semibold">
                Pinned
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {activeUserRankIndex >= 0 ? (
                selectedTab === 'overall' ? (
                  <span>
                    Ranked #{activeUserRankIndex + 1} with{' '}
                    <strong className="text-sky-300">{overallRanked[activeUserRankIndex].completedAttempts}</strong> completed{' '}
                    {overallRanked[activeUserRankIndex].completedAttempts === 1 ? 'attempt' : 'attempts'} and{' '}
                    <strong className="text-pink-300">{overallRanked[activeUserRankIndex].totalCorrect}</strong> correct answers!
                  </span>
                ) : (
                  <span>
                    Ranked #{activeUserRankIndex + 1} on {selectedQuizObj?.title} with best score of{' '}
                    <strong className="text-pink-300">{currentQuizRanked[activeUserRankIndex].bestScore}/10</strong> in{' '}
                    <strong className="text-sky-300">{currentQuizRanked[activeUserRankIndex].completedAttempts}</strong>{' '}
                    {currentQuizRanked[activeUserRankIndex].completedAttempts === 1 ? 'try' : 'tries'}!
                  </span>
                )
              ) : (
                <span className="text-slate-400">
                  You are not ranked on this board yet. Take a quiz to claim your spot!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>{selectedTab === 'overall' ? 'Overall Leaderboard' : `${selectedQuizObj?.title} Standings`}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {selectedTab === 'overall'
                ? 'Ranked primarily by total completed attempts (D17), ties by total correct answers.'
                : 'Ranked by highest score (D16), ties by fewer attempts (efficiency).'}
            </p>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Top 10 Display
          </span>
        </div>

        {selectedTab === 'overall' ? (
          /* OVERALL BOARD */
          overallRanked.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
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
                    className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                      isFirst
                        ? 'bg-amber-950/20 border-amber-500/40 shadow-sm'
                        : isYou
                        ? 'bg-sky-950/20 border-sky-400/40'
                        : 'bg-slate-800/50 border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                          isFirst
                            ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                            : isSecond
                            ? 'bg-slate-300 text-slate-900'
                            : isThird
                            ? 'bg-amber-700 text-amber-100'
                            : 'bg-slate-700/80 text-slate-300'
                        }`}
                      >
                        {isFirst ? <Crown className="w-4 h-4" /> : `#${idx + 1}`}
                      </div>

                      <div>
                        <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                          <span>{row.username}</span>
                          {isYou && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {row.totalCorrect} total correct answers ({row.totalQuestions > 0 ? Math.round((row.totalCorrect / row.totalQuestions) * 100) : 0}% accuracy)
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-base bg-gradient-to-r from-sky-400 to-pink-300 bg-clip-text text-transparent">
                        {row.completedAttempts} {row.completedAttempts === 1 ? 'Attempt' : 'Attempts'}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
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
            <div className="py-12 text-center text-xs text-slate-400">
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
                    className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                      isFirst
                        ? 'bg-amber-950/20 border-amber-500/40 shadow-sm'
                        : isYou
                        ? 'bg-sky-950/20 border-sky-400/40'
                        : 'bg-slate-800/50 border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                          isFirst
                            ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                            : isSecond
                            ? 'bg-slate-300 text-slate-900'
                            : isThird
                            ? 'bg-amber-700 text-amber-100'
                            : 'bg-slate-700/80 text-slate-300'
                        }`}
                      >
                        {isFirst ? <Crown className="w-4 h-4" /> : `#${idx + 1}`}
                      </div>

                      <div>
                        <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                          <span>{row.username}</span>
                          {isYou && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Achieved in {row.completedAttempts} {row.completedAttempts === 1 ? 'attempt' : 'attempts'} (efficiency tie-break)
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-base text-pink-300">
                        {row.bestScore} / {row.questionCount}
                      </div>
                      <div className="text-[10px] text-sky-300 font-semibold">
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
