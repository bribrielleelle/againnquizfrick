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
  Eye, 
  ArrowLeft,
  Award, 
  Clock, 
  AlertTriangle, 
  Timer
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
    let tierBadge = '🍪 Apprentice Baker';
    if (percentage === 100) {
      tierText = 'Master Baker! Perfect Score!';
      tierBadge = '🌟 Master Chef Pâtissier';
    } else if (percentage >= 80) {
      tierText = 'Pastry Chef! Excellent Work!';
      tierBadge = '🍰 Senior Patissier';
    } else if (percentage >= 60) {
      tierText = 'Journeyman Baker! Great Effort!';
      tierBadge = '🥐 Journeyman Baker';
    }

    return (
      <div className="w-full max-w-2xl mx-auto animate-in fade-in duration-300">
        <div className="rounded-3xl bg-white/95 rococo-frame p-6 sm:p-10 text-center relative overflow-hidden">
          
          {/* Top Black Bow */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-3xl select-none">
            🎀
          </div>

          {/* Trophy Cameo Medallion */}
          <div className="w-24 h-24 mx-auto rounded-full bg-pink-100 border-4 border-neutral-900 flex flex-col items-center justify-center mt-3 mb-4 shadow-md">
            <span className="text-4xl">🏆</span>
          </div>

          {/* Personal Best Badge */}
          {isNewPersonalBest && (
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-pink-500 text-white border-2 border-neutral-900 shadow-sm mb-3">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>New Personal Best! (Beat previous {previousBestScore}/10)</span>
            </div>
          )}

          {isTiedPersonalBest && !isNewPersonalBest && (
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-pink-100 text-pink-900 border border-pink-400 shadow-sm mb-3">
              <Award className="w-4 h-4 text-pink-600" />
              <span>Tied Personal Best! ({previousBestScore}/10)</span>
            </div>
          )}

          {isFirstAttempt && (
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-pink-50 text-neutral-800 border border-pink-300 shadow-xs mb-3">
              <Award className="w-4 h-4 text-pink-600" />
              <span>First Completed Attempt Recorded!</span>
            </div>
          )}

          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-pink-100 text-pink-900 border border-pink-300 mb-2">
              <span>{tierBadge}</span>
            </div>
          </div>

          <h2 className="font-playfair italic font-black text-3xl sm:text-4xl text-neutral-900">
            {tierText}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            {quiz.title} · Attempt saved to your baking history
          </p>

          {/* Score Box */}
          <div className="my-6 p-6 rounded-3xl bg-pink-50/80 border-2 border-pink-200 max-w-sm mx-auto shadow-sm">
            <div className="text-xs uppercase font-black tracking-wider text-neutral-600">
              Final Pastry Score
            </div>
            <div className="mt-1 text-5xl sm:text-6xl font-black font-serif text-pink-600">
              {score} / {questions.length}
            </div>
            <div className="mt-1 text-sm font-black text-neutral-800">
              {percentage}% Accuracy
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-3 rounded-full font-black uppercase tracking-wider text-xs text-white bg-neutral-900 hover:bg-pink-600 shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-pink-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz 🥐</span>
            </button>

            <button
              onClick={() => setShowFullReview(!showFullReview)}
              className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-xs text-neutral-800 bg-white hover:bg-pink-50 border-2 border-pink-300 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Eye className="w-4 h-4 text-pink-600" />
              <span>{showFullReview ? 'Hide Review' : 'Review Explanations'}</span>
            </button>

            <button
              onClick={onExit}
              className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-xs text-neutral-600 hover:text-neutral-900 hover:bg-pink-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quiz Menu</span>
            </button>
          </div>

          {/* Full Question Breakdown Review (Feature 2) */}
          {showFullReview && (
            <div className="mt-8 pt-6 border-t-2 border-pink-100 text-left space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">📜</span>
                <h3 className="font-playfair font-black text-lg text-neutral-900">
                  Question Breakdown &amp; Explanations
                </h3>
              </div>

              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const record = userAnswers.find((a) => a.questionId === q.id);
                  const userChoice = record?.selectedChoice;
                  const isCorrect = record?.isCorrect;
                  const wasTimeout = record?.timedOut;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border-2 text-sm transition-all ${
                        isCorrect
                          ? 'bg-emerald-50/70 border-emerald-300'
                          : 'bg-rose-50/70 border-rose-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-neutral-600">
                          Question {idx + 1} of {questions.length}
                        </span>
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                            isCorrect
                              ? 'bg-emerald-200 text-emerald-900'
                              : wasTimeout
                              ? 'bg-amber-200 text-amber-900'
                              : 'bg-rose-200 text-rose-900'
                          }`}
                        >
                          {isCorrect ? 'CORRECT 🍓' : wasTimeout ? 'TIMED OUT ⏱️' : 'MISSED 🥐'}
                        </span>
                      </div>

                      <div className="font-bold text-neutral-900 mb-3">
                        {q.prompt}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                        {q.choices.map((c) => {
                          const wasSelected = userChoice === c.label;
                          const isTheCorrectOne = c.label === q.correctChoice;

                          let choiceStyle = 'bg-white border-pink-200 text-neutral-700';
                          if (isTheCorrectOne) {
                            choiceStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                          } else if (wasSelected && !isCorrect) {
                            choiceStyle = 'bg-rose-100 border-rose-400 text-rose-900 line-through';
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
                              {wasSelected && !isTheCorrectOne && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                            </div>
                          );
                        })}
                      </div>

                      {q.explanation && (
                        <div className="p-3 rounded-xl bg-white/90 border border-pink-200 text-xs text-neutral-800 leading-relaxed">
                          <strong className="text-pink-700">Explanation: </strong>
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
      <div className="rounded-3xl bg-white/95 rococo-frame p-6 sm:p-10 relative overflow-hidden">
        
        {/* Ribbon bow perched at top right */}
        <div className="absolute top-2 right-4 text-2xl select-none">
          🎀
        </div>

        {/* Top Header Bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Abandon Quiz</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-pink-900 bg-pink-100 px-3 py-1 rounded-full border border-pink-300">
              {quiz.title}
            </span>

            {/* Timed Mode Toggle */}
            <button
              onClick={() => setIsTimedMode(!isTimedMode)}
              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border transition-colors cursor-pointer flex items-center gap-1 ${
                isTimedMode
                  ? 'bg-neutral-900 text-pink-200 border-neutral-900'
                  : 'bg-white text-neutral-600 border-pink-300'
              }`}
              title="Toggle Timed Mode on/off"
            >
              <Clock className="w-3 h-3 text-pink-400" />
              <span>{isTimedMode ? 'Timed: On' : 'Untimed'}</span>
            </button>
          </div>

          <div className="text-xs font-black text-pink-700 font-mono bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200">
            Score: {score}
          </div>
        </div>

        {/* Feature 1: Timed Mode Countdown Bar & Seconds Counter */}
        {isTimedMode && (
          <div className="mb-6 p-3.5 rounded-2xl bg-pink-50/70 border border-pink-200">
            <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
              <span className="flex items-center gap-1.5 text-neutral-700">
                <Timer className={`w-3.5 h-3.5 ${isUrgent ? 'text-rose-600 animate-spin' : 'text-pink-600'}`} />
                <span className="font-sans font-bold">Timer Remaining</span>
              </span>
              <span
                role="timer"
                aria-live="polite"
                className={`text-sm ${
                  isUrgent ? 'text-rose-600 animate-pulse font-black' : 'text-neutral-900 font-bold'
                }`}
              >
                {timeLeft}s
              </span>
            </div>
            <div className="h-2.5 w-full bg-white rounded-full overflow-hidden p-0.5 border border-pink-300">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  isUrgent
                    ? 'bg-rose-500 animate-pulse'
                    : 'bg-gradient-to-r from-pink-400 via-pink-500 to-neutral-900'
                }`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Abandon Quiz Confirmation Modal (Enforcing D7) */}
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white border-4 border-neutral-900 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 border-2 border-rose-400 flex items-center justify-center text-rose-600 mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-playfair font-black text-lg text-neutral-900">Leave Quiz?</h3>
              <p className="text-xs text-neutral-600 mt-1 mb-5 leading-relaxed">
                Per rule D7, unfinished attempts are discarded and will <strong>not</strong> count in your history or leaderboards.
              </p>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-2.5 rounded-full font-bold text-xs bg-pink-100 hover:bg-pink-200 text-neutral-800 cursor-pointer"
                >
                  Keep Baking
                </button>
                <button
                  onClick={onExit}
                  className="flex-1 py-2.5 rounded-full font-bold text-xs bg-neutral-900 hover:bg-rose-600 text-white cursor-pointer"
                >
                  Discard &amp; Exit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Question Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs font-bold text-neutral-600 mb-1.5">
            <span>
              Question <strong className="text-neutral-900 font-black">{currentIndex + 1}</strong> of{' '}
              {questions.length}
            </span>
            <span className="text-pink-600 font-mono font-bold">
              {Math.round(((currentIndex + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="h-2 w-full bg-pink-100 rounded-full overflow-hidden p-0.5 border border-pink-200">
            <div
              className="h-full bg-neutral-900 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Timeout Alert Flash (D14) */}
        {hasTimedOut && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-100 border-2 border-rose-400 text-rose-900 text-xs font-bold flex items-center justify-between animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-600 animate-spin" />
              <span>TIME&apos;S UP! Scored as incorrect. Correct answer revealed below.</span>
            </div>
          </div>
        )}

        {/* Question Prompt */}
        <div className="mb-6">
          <div className="text-[11px] font-black uppercase tracking-wider text-pink-600 mb-1 flex items-center gap-1.5 font-fredoka">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentQ.difficulty || 'Baking'} Question</span>
          </div>
          <h2 className="font-playfair font-bold text-xl sm:text-2xl text-neutral-900 leading-snug">
            {currentQ.prompt}
          </h2>
        </div>

        {/* Choices */}
        <div className="space-y-3 mb-6">
          {currentQ.choices.map((choice) => {
            const isSelected = selectedChoice === choice.label;
            const isCorrect = choice.label === currentQ.correctChoice;

            let btnStyle =
              'bg-white border-2 border-pink-200 hover:border-pink-500 hover:bg-pink-50 text-neutral-800 shadow-xs hover:scale-[1.01]';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle =
                  'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold shadow-md';
              } else if (isSelected) {
                btnStyle =
                  'bg-rose-50 border-2 border-rose-500 text-rose-950 font-bold shadow-md';
              } else {
                btnStyle = 'bg-neutral-50 border border-neutral-200 text-neutral-400 opacity-60';
              }
            }

            return (
              <button
                key={choice.id}
                disabled={isAnswered}
                onClick={() => handleSelectChoice(choice.label)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl text-sm sm:text-base font-semibold transition-all duration-150 flex items-center justify-between group cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                      isSelected
                        ? 'bg-neutral-900 text-white'
                        : 'bg-pink-100 text-neutral-800 group-hover:bg-neutral-900 group-hover:text-white border border-pink-300'
                    }`}
                  >
                    {choice.label}
                  </span>
                  <span>{choice.text}</span>
                </div>

                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 animate-in zoom-in" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 animate-in zoom-in" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feature 2: Instant Educational Explanation Reveal after every question */}
        {isAnswered && (
          <div className="mt-6 pt-5 border-t-2 border-pink-100 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2 mb-2">
              {hasTimedOut ? (
                <span className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Timed Out — Correct Choice is ({currentQ.correctChoice})</span>
                </span>
              ) : selectedChoice === currentQ.correctChoice ? (
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Correct Answer! 🍰</span>
                </span>
              ) : (
                <span className="text-xs font-black uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  <span>Not quite! The correct answer is ({currentQ.correctChoice})</span>
                </span>
              )}
            </div>

            {currentQ.explanation && (
              <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed bg-pink-50/80 p-3.5 rounded-2xl border border-pink-200 mb-5">
                <strong className="text-pink-700">Pastry Fact: </strong>
                {currentQ.explanation}
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-500 hidden sm:inline">
                Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-neutral-300 font-mono text-neutral-700 shadow-xs">Enter</kbd> or click next
              </span>

              <button
                onClick={handleNextQuestion}
                className="w-full sm:w-auto ml-auto px-6 py-2.5 rounded-full font-black uppercase tracking-wider text-xs text-white bg-neutral-900 hover:bg-pink-600 shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-pink-200"
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
          <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between text-[11px] text-neutral-500">
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
