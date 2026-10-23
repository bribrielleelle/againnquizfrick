import React, { useState, useEffect } from 'react';
import { Quiz, Question } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Trophy, 
  BookOpen, 
  ChefHat, 
  Eye, 
  ArrowLeft,
  Flame,
  Award,
  HelpCircle,
  Clock,
  AlertTriangle,
  Timer,
  Play
} from 'lucide-react';

interface QuizRunnerProps {
  quiz: Quiz;
  questions: Question[];
  previousBestScore?: number | null;
  onFinishQuiz: (result: {
    quizId: string;
    quizTitle: string;
    score: number;
    questionCount: number;
    percentage: number;
    answers: { questionId: string; selectedChoice: 'A' | 'B' | 'C' | 'D' | null; isCorrect: boolean; timedOut?: boolean }[];
  }) => void;
  onExit: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  quiz,
  questions,
  previousBestScore = null,
  onFinishQuiz,
  onExit,
}) => {
  const { currentUser } = useAuth();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<
    { questionId: string; selectedChoice: 'A' | 'B' | 'C' | 'D' | null; isCorrect: boolean; timedOut?: boolean }[]
  >([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showFullReview, setShowFullReview] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Feature 1: Timed Mode State (default active per quiz time limit)
  const timeLimit = quiz.timeLimitSeconds || 30;
  const [isTimedMode, setIsTimedMode] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [hasTimedOut, setHasTimedOut] = useState<boolean>(false);

  const currentQ = questions[currentIndex];

  // Reset timer on question change
  useEffect(() => {
    setTimeLeft(timeLimit);
    setHasTimedOut(false);
  }, [currentIndex, timeLimit]);

  // Countdown timer effect
  useEffect(() => {
    if (!isTimedMode || isAnswered || isFinished || showExitConfirm) return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isTimedMode, isAnswered, isFinished, showExitConfirm]);

  // Handle Timeout (D10 & D14: question locks, scored incorrect, correct answer + explanation reveal)
  const handleTimeout = () => {
    if (isAnswered) return;

    setHasTimedOut(true);
    setIsAnswered(true);
    setSelectedChoice(null);

    const timeoutRecord = {
      questionId: currentQ.id,
      selectedChoice: null,
      isCorrect: false,
      timedOut: true,
    };

    setUserAnswers((prev) => [...prev, timeoutRecord]);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    if (isFinished || showExitConfirm) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextQuestion();
        }
        return;
      }

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        handleSelectChoice(key as 'A' | 'B' | 'C' | 'D');
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        const choices: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
        if (choices[idx]) {
          handleSelectChoice(choices[idx]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isAnswered, isFinished, selectedChoice, showExitConfirm]);

  const handleSelectChoice = (choiceLabel: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswered) return;

    const isCorrect = choiceLabel === currentQ.correctChoice;
    setSelectedChoice(choiceLabel);
    setIsAnswered(true);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    const answerRecord = {
      questionId: currentQ.id,
      selectedChoice: choiceLabel,
      isCorrect,
      timedOut: false,
    };

    setUserAnswers((prev) => [...prev, answerRecord]);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoice(null);
      setIsAnswered(false);
      setHasTimedOut(false);
    } else {
      const finalScore = userAnswers.reduce((acc, ans) => acc + (ans.isCorrect ? 1 : 0), 0) + (selectedChoice === currentQ.correctChoice ? 1 : 0);
      const percentage = Math.round((finalScore / questions.length) * 100);
      setIsFinished(true);

      onFinishQuiz({
        quizId: quiz.id,
        quizTitle: quiz.title,
        score: finalScore,
        questionCount: questions.length,
        percentage,
        answers: userAnswers,
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedChoice(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers([]);
    setIsFinished(false);
    setShowFullReview(false);
    setShowExitConfirm(false);
    setHasTimedOut(false);
    setTimeLeft(timeLimit);
  };

  const percentage = Math.round((score / questions.length) * 100);
  const isNewPersonalBest = previousBestScore !== null && score > previousBestScore;
  const isFirstAttempt = previousBestScore === null;
  const isTiedPersonalBest = previousBestScore !== null && score === previousBestScore && score > 0;

  // Results Screen
  if (isFinished) {
    let tierText = 'Keep Practicing!';
    let tierColor = 'text-amber-400 bg-amber-950/40 border-amber-500/40';
    if (percentage === 100) {
      tierText = '🌟 Master Baker! Perfect Score!';
      tierColor = 'text-pink-300 bg-pink-950/40 border-pink-500/40';
    } else if (percentage >= 80) {
      tierText = '🎉 Pastry Chef! Excellent Work!';
      tierColor = 'text-sky-300 bg-sky-950/40 border-sky-500/40';
    } else if (percentage >= 60) {
      tierText = '🧁 Apprentice Baker! Great Effort!';
      tierColor = 'text-emerald-300 bg-emerald-950/40 border-emerald-500/40';
    }

    return (
      <div className="w-full max-w-2xl mx-auto animate-in fade-in duration-300">
        <div className="rounded-3xl bg-slate-900/95 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300" />

          {/* Trophy Header */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-sky-400/20 to-pink-400/20 border border-sky-400/30 flex items-center justify-center mb-5 shadow-inner">
            <Trophy className="w-10 h-10 text-pink-300 animate-bounce" />
          </div>

          {/* Personal Best Badge */}
          {isNewPersonalBest && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400/20 to-pink-400/20 border border-amber-400/40 text-amber-300 shadow-md mb-3">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>New Personal Best! (Beat previous {previousBestScore}/10)</span>
            </div>
          )}

          {isTiedPersonalBest && !isNewPersonalBest && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-sky-400/20 border border-sky-400/40 text-sky-300 shadow-md mb-3">
              <Award className="w-4 h-4 text-sky-400" />
              <span>Tied Your Personal Best! ({previousBestScore}/10)</span>
            </div>
          )}

          {isFirstAttempt && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-800 border border-slate-700 text-slate-300 shadow-md mb-3">
              <Award className="w-4 h-4 text-sky-400" />
              <span>First Completed Attempt Recorded!</span>
            </div>
          )}

          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-bold border mb-2 ${tierColor}`}>
              <Award className="w-3.5 h-3.5" />
              <span>{tierText}</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
            Quiz Completed!
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {quiz.title} · Attempt saved to your history
          </p>

          {/* Score Box */}
          <div className="my-8 p-6 rounded-3xl bg-slate-800/50 border border-slate-700/60 max-w-sm mx-auto shadow-lg">
            <div className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              Final Score
            </div>
            <div className="mt-2 text-5xl sm:text-6xl font-black font-mono bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300 bg-clip-text text-transparent">
              {score} / {questions.length}
            </div>
            <div className="mt-2 text-lg font-bold text-slate-300">
              {percentage}% Accuracy
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300 hover:opacity-95 shadow-md shadow-pink-500/10 transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>

            <button
              onClick={() => setShowFullReview(!showFullReview)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-sky-400" />
              <span>{showFullReview ? 'Hide Review' : 'Review All Answers'}</span>
            </button>

            <button
              onClick={onExit}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quiz Hub</span>
            </button>
          </div>

          {/* Full Question Breakdown Review (Feature 2) */}
          {showFullReview && (
            <div className="mt-10 pt-8 border-t border-slate-800 text-left space-y-5 animate-in fade-in duration-200">
              <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-400" />
                <span>Question Breakdown &amp; Explanations</span>
              </h3>

              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const record = userAnswers.find((a) => a.questionId === q.id);
                  const userChoice = record?.selectedChoice;
                  const isCorrect = record?.isCorrect;
                  const wasTimeout = record?.timedOut;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border text-sm transition-all ${
                        isCorrect
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : 'bg-rose-950/20 border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-400">
                          Question {idx + 1} of {questions.length}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            isCorrect
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : wasTimeout
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {isCorrect ? 'CORRECT!' : wasTimeout ? 'TIMED OUT' : 'MISSED'}
                        </span>
                      </div>

                      <div className="font-bold text-slate-100 mb-3">
                        {q.prompt}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                        {q.choices.map((c) => {
                          const wasSelected = userChoice === c.label;
                          const isTheCorrectOne = c.label === q.correctChoice;

                          let choiceStyle = 'bg-slate-800/50 border-slate-700/60 text-slate-300';
                          if (isTheCorrectOne) {
                            choiceStyle = 'bg-emerald-900/40 border-emerald-500/60 text-emerald-200 font-bold';
                          } else if (wasSelected && !isCorrect) {
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
                              {wasSelected && !isTheCorrectOne && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
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
            </div>
          )}
        </div>
      </div>
    );
  }

  // Active Quiz In-Progress Screen (With Feature 1 Timed Mode Countdown & Timeout Handling)
  const timerPercentage = Math.max(0, (timeLeft / timeLimit) * 100);
  const isUrgent = timeLeft <= 5 && !isAnswered;

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in duration-200">
      <div className="rounded-3xl bg-slate-900/95 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Abandon Quiz</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60">
              {quiz.title}
            </span>

            {/* Timed Mode Toggle */}
            <button
              onClick={() => setIsTimedMode(!isTimedMode)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors cursor-pointer flex items-center gap-1 ${
                isTimedMode
                  ? 'bg-pink-950/50 text-pink-300 border-pink-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title="Toggle Timed Mode on/off"
            >
              <Clock className="w-3 h-3" />
              <span>{isTimedMode ? 'Timed: On' : 'Untimed'}</span>
            </button>
          </div>

          <div className="text-xs font-bold text-sky-300 font-mono">
            Score: {score}
          </div>
        </div>

        {/* Feature 1: Timed Mode Countdown Bar & Seconds Counter */}
        {isTimedMode && (
          <div className="mb-6 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Timer className={`w-3.5 h-3.5 ${isUrgent ? 'text-rose-400 animate-spin' : 'text-sky-400'}`} />
                <span>Time Remaining</span>
              </span>
              <span
                role="timer"
                aria-live="polite"
                className={`text-sm ${
                  isUrgent ? 'text-rose-400 animate-pulse font-black' : 'text-sky-300'
                }`}
              >
                {timeLeft}s
              </span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/40">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  isUrgent
                    ? 'bg-rose-500 animate-pulse'
                    : 'bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300'
                }`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Abandon Quiz Confirmation Modal (Enforcing D7) */}
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-950/50 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Leave Quiz?</h3>
              <p className="text-xs text-slate-400 mt-1 mb-5">
                Per specification rule D7, unfinished attempts are discarded and will <strong>not</strong> count in your history or leaderboards.
              </p>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                >
                  Keep Playing
                </button>
                <button
                  onClick={onExit}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
                >
                  Discard &amp; Exit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Question Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2">
            <span>
              Question <strong className="text-slate-100">{currentIndex + 1}</strong> of{' '}
              {questions.length}
            </span>
            <span className="text-pink-300 font-mono">
              {Math.round(((currentIndex + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="h-2.5 w-full bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Timeout Alert Flash (D14) */}
        {hasTimedOut && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/70 border border-rose-500/60 text-rose-200 text-xs font-bold flex items-center justify-between animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-400 animate-spin" />
              <span>TIME&apos;S UP! Scored as incorrect. Correct answer revealed below.</span>
            </div>
          </div>
        )}

        {/* Question Prompt */}
        <div className="mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-sky-400 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            <span>{currentQ.difficulty || 'Baking'} Question</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 leading-snug">
            {currentQ.prompt}
          </h2>
        </div>

        {/* Choices */}
        <div className="space-y-3 mb-6">
          {currentQ.choices.map((choice) => {
            const isSelected = selectedChoice === choice.label;
            const isCorrect = choice.label === currentQ.correctChoice;

            let btnStyle =
              'bg-slate-800/70 border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-slate-100 hover:scale-[1.01]';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle =
                  'bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400/40';
              } else if (isSelected) {
                btnStyle =
                  'bg-rose-950/60 border-rose-500 text-rose-100 shadow-md shadow-rose-950/40 ring-1 ring-rose-400/40';
              } else {
                btnStyle = 'bg-slate-900/50 border-slate-800/60 text-slate-500 opacity-50';
              }
            }

            return (
              <button
                key={choice.id}
                disabled={isAnswered}
                onClick={() => handleSelectChoice(choice.label)}
                className={`w-full text-left p-4 rounded-2xl border text-sm sm:text-base font-semibold transition-all duration-150 flex items-center justify-between group cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-colors ${
                      isSelected
                        ? 'bg-gradient-to-r from-sky-400 to-pink-300 text-slate-950'
                        : 'bg-slate-750 text-slate-300 group-hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {choice.label}
                  </span>
                  <span>{choice.text}</span>
                </div>

                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-in zoom-in" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 animate-in zoom-in" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feature 2: Instant Educational Explanation Reveal after every question */}
        {isAnswered && (
          <div className="mt-6 pt-5 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2 mb-2">
              {hasTimedOut ? (
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Timed Out — Correct Choice is ({currentQ.correctChoice})</span>
                </span>
              ) : selectedChoice === currentQ.correctChoice ? (
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Correct Answer!</span>
                </span>
              ) : (
                <span className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  <span>Not quite! The correct answer is ({currentQ.correctChoice})</span>
                </span>
              )}
            </div>

            {currentQ.explanation && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 mb-5">
                <strong className="text-sky-300">Why: </strong>
                {currentQ.explanation}
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-slate-300">Enter</kbd> or click next
              </span>

              <button
                onClick={handleNextQuestion}
                className="w-full sm:w-auto ml-auto px-6 py-2.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300 hover:opacity-95 shadow-md shadow-pink-500/10 transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>
                  {currentIndex + 1 === questions.length ? 'View Results' : 'Next Question'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Footer shortcuts helper */}
        {!isAnswered && (
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Tap any option to answer</span>
            <span className="hidden sm:inline font-mono">
              Keys: [A] [B] [C] [D] or [1] [2] [3] [4]
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
