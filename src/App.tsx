import React, { useState } from 'react';
import { Sparkles, Trophy, RotateCcw, CheckCircle2, XCircle, ArrowRight, BookOpen, Heart, HelpCircle, Plus, Trash2 } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

const DEFAULT_QUIZ: Question[] = [
  {
    id: '1',
    question: 'Which planet is known as the "Red Planet"?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctIndex: 1,
    explanation: 'Mars gets its reddish color from iron oxide (rust) on its surface.',
  },
  {
    id: '2',
    question: 'What is the rarest blood type in humans?',
    options: ['O positive', 'B negative', 'AB negative', 'A positive'],
    correctIndex: 2,
    explanation: 'AB negative is the rarest major human blood type, found in only ~1% of people.',
  },
  {
    id: '3',
    question: 'Which animal is known to hold hands while sleeping so they do not drift apart?',
    options: ['Sea otters', 'Penguins', 'Dolphins', 'Beavers'],
    correctIndex: 0,
    explanation: 'Sea otters often float in kelp forests and hold hands in rafts while sleeping.',
  },
  {
    id: '4',
    question: 'How many hearts does an octopus have?',
    options: ['1', '2', '3', '4'],
    correctIndex: 2,
    explanation: 'An octopus has three hearts: two pump blood to the gills, and one pumps blood to the rest of the body.',
  },
  {
    id: '5',
    question: 'Which color wavelength bends the most when light passes through a glass prism?',
    options: ['Red', 'Yellow', 'Green', 'Violet'],
    correctIndex: 3,
    explanation: 'Violet light has the shortest wavelength and bends (refracts) the most.',
  },
];

export default function App() {
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUIZ);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [mode, setMode] = useState<'quiz' | 'editor'>('quiz');

  // Custom question form
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrectIndex, setNewCorrectIndex] = useState(0);

  const currentQ = questions[currentIndex];

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || newOptions.some((opt) => !opt.trim())) return;

    const created: Question = {
      id: Date.now().toString(),
      question: newQuestionText.trim(),
      options: newOptions.map((o) => o.trim()),
      correctIndex: newCorrectIndex,
    };

    setQuestions((prev) => [...prev, created]);
    setNewQuestionText('');
    setNewOptions(['', '', '', '']);
    setNewCorrectIndex(0);
    setMode('quiz');
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    handleRestart();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start py-10 px-4 selection:bg-pink-500/30">
      {/* Background soft ambient glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-sky-500/10 via-pink-500/10 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Main Single Column Container */}
      <div className="w-full max-w-xl flex flex-col items-stretch">
        
        {/* Ombre Header Card / Column Top */}
        <header className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl p-8 mb-6 text-center">
          {/* Sky blue fading ombre into light pink top bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase bg-slate-800/80 border border-slate-700/60 text-slate-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Interactive Quiz</span>
          </div>

          {/* Requested Title: "brielles quiz" in sky blue fading ombre into light pink */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight pb-1 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300 bg-clip-text text-transparent drop-shadow-sm">
            brielles quiz
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-sm mx-auto font-normal">
            A quiz space with a sky blue fading ombre into light pink palette.
          </p>

          {/* Column Navigation Tabs */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setMode('quiz')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                mode === 'quiz'
                  ? 'bg-gradient-to-r from-sky-500/20 to-pink-500/20 text-slate-100 border border-sky-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              Play Quiz
            </button>
            <button
              onClick={() => setMode('editor')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                mode === 'editor'
                  ? 'bg-gradient-to-r from-sky-500/20 to-pink-500/20 text-slate-100 border border-pink-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              Manage Questions ({questions.length})
            </button>
          </div>
        </header>

        {/* Content Column Area */}
        {mode === 'quiz' ? (
          <main className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
            {!isFinished && currentQ ? (
              <div>
                {/* Progress bar with sky blue to light pink ombre */}
                <div className="mb-6">
                  <div className="flex justify-between items-center text-xs font-medium text-slate-400 mb-2">
                    <span>Question {currentIndex + 1} of {questions.length}</span>
                    <span className="font-semibold text-slate-300">Score: {score}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300 transition-all duration-300 rounded-full"
                      style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Text */}
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug">
                    {currentQ.question}
                  </h2>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctIndex;

                    let btnStyle = 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600 text-slate-200';

                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 shadow-sm shadow-emerald-900/20';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-950/40 border-rose-500/60 text-rose-200 shadow-sm shadow-rose-900/20';
                      } else {
                        btnStyle = 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleSelect(idx)}
                        className={`w-full text-left p-4 rounded-2xl border text-sm sm:text-base font-medium transition-all duration-200 flex items-center justify-between group ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                            isSelected
                              ? 'bg-gradient-to-r from-sky-400 to-pink-300 text-slate-950'
                              : 'bg-slate-700/60 text-slate-300 group-hover:bg-slate-700'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>

                        {isAnswered && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation and Next Button */}
                {isAnswered && (
                  <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <p className="text-xs sm:text-sm text-slate-300 italic">
                      {currentQ.explanation ? currentQ.explanation : (selectedOption === currentQ.correctIndex ? 'Correct answer!' : 'Better luck on the next one!')}
                    </p>
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300 hover:opacity-95 shadow-md shadow-pink-500/10 transition-transform active:scale-95 cursor-pointer ml-auto"
                    >
                      <span>{currentIndex + 1 === questions.length ? 'See Results' : 'Next Question'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Finish Screen */
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-sky-400/20 to-pink-400/20 border border-sky-400/30 flex items-center justify-center mb-6">
                  <Trophy className="w-10 h-10 text-pink-300" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                  Quiz Completed!
                </h2>
                <p className="mt-2 text-slate-400 text-sm">
                  You scored <span className="font-bold text-sky-300">{score}</span> out of{' '}
                  <span className="font-bold text-pink-300">{questions.length}</span> (
                  {Math.round((score / questions.length) * 100)}%)
                </p>

                <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                    onClick={handleRestart}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300 hover:opacity-95 shadow-md shadow-pink-500/10 transition-transform active:scale-95 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            )}
          </main>
        ) : (
          /* Editor Mode */
          <main className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-400" />
                <span>Add a New Question</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Expand Brielle&apos;s quiz with custom trivia.</p>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Question
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your question here..."
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              <div className="space-y-2.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Options & Correct Answer
                </label>
                {newOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setNewCorrectIndex(i)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center flex-shrink-0 ${
                        newCorrectIndex === i
                          ? 'bg-gradient-to-r from-sky-400 to-pink-300 text-slate-950 ring-2 ring-pink-400/50'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                      title="Mark as correct answer"
                    >
                      {String.fromCharCode(65 + i)}
                    </button>
                    <input
                      type="text"
                      required
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      value={opt}
                      onChange={(e) => {
                        const next = [...newOptions];
                        next[i] = e.target.value;
                        setNewOptions(next);
                      }}
                      className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-400 transition-colors"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300 hover:opacity-95 shadow-md shadow-pink-500/10 transition-transform active:scale-95 cursor-pointer"
              >
                Save Question to Quiz
              </button>
            </form>

            <div className="pt-6 border-t border-slate-800">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Existing Questions ({questions.length})
              </h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs"
                  >
                    <span className="truncate max-w-[80%] text-slate-300">
                      {idx + 1}. {q.question}
                    </span>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      disabled={questions.length <= 1}
                      className="text-slate-500 hover:text-rose-400 disabled:opacity-30 disabled:pointer-events-none p-1 transition-colors"
                      title="Delete question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* Column footer badge */}
        <footer className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <span>Created for</span>
          <span className="font-semibold bg-gradient-to-r from-sky-400 to-pink-300 bg-clip-text text-transparent">
            Brielle&apos;s Quiz
          </span>
        </footer>

      </div>
    </div>
  );
}
