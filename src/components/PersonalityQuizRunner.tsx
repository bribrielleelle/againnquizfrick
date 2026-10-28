import React, { useState } from 'react';
import { 
  PERSONALITY_QUESTIONS, 
  PASTRY_ARCHETYPES, 
  PastryArchetype, 
  PersonalityQuestion 
} from '../data/personalityQuiz';
import { 
  Sparkles, 
  Heart, 
  RotateCcw, 
  Share2, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Award,
  BookmarkCheck,
  Star
} from 'lucide-react';

interface PersonalityQuizRunnerProps {
  onExit: () => void;
  onSaveToProfile?: (archetype: PastryArchetype) => void;
  savedArchetypeId?: string | null;
}

export const PersonalityQuizRunner: React.FC<PersonalityQuizRunnerProps> = ({
  onExit,
  onSaveToProfile,
  savedArchetypeId,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [resultArchetype, setResultArchetype] = useState<PastryArchetype | null>(() => {
    if (savedArchetypeId && PASTRY_ARCHETYPES[savedArchetypeId]) {
      return PASTRY_ARCHETYPES[savedArchetypeId];
    }
    return null;
  });
  const [copiedToast, setCopiedToast] = useState(false);
  const [isSavedBadge, setIsSavedBadge] = useState(Boolean(savedArchetypeId));

  const currentQ: PersonalityQuestion = PERSONALITY_QUESTIONS[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / PERSONALITY_QUESTIONS.length) * 100);

  const handleSelectChoice = (archetypeId: string) => {
    const updated = { ...selectedAnswers, [currentQ.id]: archetypeId };
    setSelectedAnswers(updated);

    if (currentIndex < PERSONALITY_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 250);
    } else {
      // Finished all questions! Calculate result
      calculateResult(updated);
    }
  };

  const calculateResult = (answers: Record<string, string>) => {
    setIsCalculating(true);

    // Tally archetype votes
    const counts: Record<string, number> = {};
    Object.values(answers).forEach((archId) => {
      counts[archId] = (counts[archId] || 0) + 1;
    });

    let topArchId = 'macaron';
    let maxVotes = -1;

    Object.entries(counts).forEach(([archId, votes]) => {
      if (votes > maxVotes) {
        maxVotes = votes;
        topArchId = archId;
      }
    });

    const winningArchetype = PASTRY_ARCHETYPES[topArchId] || PASTRY_ARCHETYPES.macaron;

    setTimeout(() => {
      setResultArchetype(winningArchetype);
      setIsCalculating(false);
      if (onSaveToProfile) {
        onSaveToProfile(winningArchetype);
        setIsSavedBadge(true);
      }
    }, 900);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setResultArchetype(null);
    setIsSavedBadge(false);
  };

  const handleCopyCard = () => {
    if (!resultArchetype) return;
    const text = `🎀 I took the "What Pastry Are You?" Quiz on EclairWiz! 🥐✨\n\nI am ${resultArchetype.emoji} ${resultArchetype.name}!\n"${resultArchetype.tagline}"\n\n✨ Traits: ${resultArchetype.traits.join(' • ')}\n🧁 Motto: ${resultArchetype.bakingMotto}\n\nFind your pastry soul at EclairWiz! 🍓🍰`;
    
    try {
      navigator.clipboard.writeText(text);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    } catch {
      // Fallback
    }
  };

  // 1. CALCULATING ANIMATION STATE
  if (isCalculating) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-3xl rococo-frame bg-white/95 p-10 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute -top-3 -left-3 text-3xl">🎀</div>
        <div className="absolute -top-3 -right-3 text-3xl">🎀</div>

        <div className="py-12 flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-pink-100 border-4 border-pink-400 flex items-center justify-center text-5xl animate-bounce shadow-lg">
              🧁
            </div>
            <span className="absolute -top-2 -right-2 text-2xl animate-spin">✨</span>
          </div>

          <div className="space-y-2">
            <h3 className="font-playfair italic font-black text-3xl text-neutral-900">
              Folding Your Pastry Soul...
            </h3>
            <p className="text-sm text-pink-700 font-bold max-w-md mx-auto">
              Dusting with powdered sugar, tallying sweet answers, and preheating your custom baking archetype... 🍓
            </p>
          </div>

          <div className="w-48 h-3 bg-pink-100 rounded-full overflow-hidden border border-pink-300">
            <div className="h-full bg-gradient-to-r from-pink-400 via-rose-500 to-pink-400 animate-pulse w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // 2. RESULT REVEAL SCREEN
  if (resultArchetype) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Controls */}
        <div className="flex items-center justify-between px-2">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 hover:bg-pink-100 border-2 border-pink-300 text-neutral-800 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Bakery Hub</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 border border-pink-300 text-pink-900 text-xs font-black uppercase tracking-wider">
            <span>🎀 Personality Revealed</span>
          </div>
        </div>

        {/* Grand Rococo Result Card */}
        <div className="relative">
          {/* Black Ribbon Bow Accent */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 text-4xl sm:text-5xl drop-shadow-md select-none">
            🎀
          </div>

          <div className="bg-white/95 rounded-3xl rococo-frame p-6 sm:p-10 text-center relative overflow-hidden shadow-2xl pt-10">
            
            {/* Filigree corner flourishes */}
            <div className="absolute top-3 left-4 text-pink-300 text-xl font-script select-none">❦</div>
            <div className="absolute top-3 right-4 text-pink-300 text-xl font-script select-none">❦</div>
            <div className="absolute bottom-3 left-4 text-pink-300 text-xl font-script select-none">❦</div>
            <div className="absolute bottom-3 right-4 text-pink-300 text-xl font-script select-none">❦</div>

            {/* Cameo Medallion with Pastry Avatar */}
            <div className="relative inline-block mx-auto mb-4 mt-2">
              <div className="w-28 h-32 sm:w-32 sm:h-36 rounded-[50%] bg-gradient-to-b from-white via-pink-50 to-pink-200 border-4 border-neutral-900 shadow-xl flex flex-col items-center justify-center p-2 relative group">
                <span className="text-6xl sm:text-7xl drop-shadow-md transform group-hover:scale-110 transition-transform">
                  {resultArchetype.emoji}
                </span>
                <span className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-neutral-900 text-pink-200 text-[10px] font-black uppercase tracking-wider border border-pink-300 shadow-sm">
                  Sweet Soul
                </span>
              </div>
            </div>

            {/* Sub-badge */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-pink-100 text-pink-900 border border-pink-300">
                {resultArchetype.badge}
              </span>
            </div>

            {/* Pastry Name Title */}
            <h1 className="font-playfair italic font-black text-3xl sm:text-5xl text-neutral-900 leading-tight">
              You are {resultArchetype.name}!
            </h1>

            {/* Tagline */}
            <p className="font-script text-xl sm:text-2xl text-pink-600 mt-1 max-w-xl mx-auto">
              "{resultArchetype.tagline}"
            </p>

            {/* Trait Pills */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {resultArchetype.traits.map((trait, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-neutral-800 border border-pink-200 shadow-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-pink-500" />
                  <span>{trait}</span>
                </span>
              ))}
            </div>

            {/* Lace divider */}
            <div className="lace-divider w-full my-6" />

            {/* Narrative Description Section */}
            <div className="bg-pink-50/70 rounded-2xl p-5 border border-pink-200 text-left max-w-xl mx-auto space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-pink-900 font-fredoka">
                <span>🥐</span>
                <span>In the Bakery of Life:</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-normal">
                {resultArchetype.description}
              </p>
            </div>

            {/* Bestie Match & Motto Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 max-w-xl mx-auto text-left">
              <div className="p-4 rounded-2xl bg-white border-2 border-pink-200 shadow-xs">
                <div className="text-[11px] font-black uppercase tracking-wider text-neutral-600 flex items-center gap-1 mb-1">
                  <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                  <span>Sweet Companion Pairing:</span>
                </div>
                <p className="text-xs text-neutral-800 font-bold leading-snug">
                  {resultArchetype.sweetPairing}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border-2 border-pink-200 shadow-xs">
                <div className="text-[11px] font-black uppercase tracking-wider text-neutral-600 flex items-center gap-1 mb-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Your Signature Motto:</span>
                </div>
                <p className="text-xs italic text-neutral-800 font-semibold leading-snug">
                  {resultArchetype.bakingMotto}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-4 border-t-2 border-pink-100 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleCopyCard}
                className="px-5 py-2.5 rounded-full font-black uppercase tracking-wider text-xs bg-neutral-900 text-pink-200 hover:bg-pink-600 hover:text-white transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2 border border-pink-200"
              >
                {copiedToast ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedToast ? 'Sweet Card Copied! 🍰' : 'Share Pastry Card 📋'}</span>
              </button>

              <button
                onClick={handleRetake}
                className="px-5 py-2.5 rounded-full font-black uppercase tracking-wider text-xs bg-pink-100 hover:bg-pink-200 text-pink-900 transition-all border border-pink-300 shadow-xs active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-pink-600" />
                <span>Retake Quiz 🔄</span>
              </button>

              <button
                onClick={onExit}
                className="px-5 py-2.5 rounded-full font-black uppercase tracking-wider text-xs bg-white hover:bg-neutral-100 text-neutral-800 border-2 border-neutral-800 transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>Back to All Quizzes 🥐</span>
              </button>
            </div>

            {isSavedBadge && (
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-pink-800 font-bold bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                <BookmarkCheck className="w-3.5 h-3.5 text-pink-600" />
                <span>Saved as your Baker Passport Badge! ✨</span>
              </div>
            )}
          </div>
        </div>

      </div>
    );
  }

  // 3. QUESTION RUNNER STATE
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
      {/* Top Banner Navigation & Progress */}
      <div className="flex items-center justify-between px-2">
        <button
          onClick={onExit}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-pink-100 border-2 border-pink-300 text-neutral-800 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Hub</span>
        </button>

        {/* Question Counter Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 border border-pink-300 text-pink-900 text-xs font-black uppercase tracking-wider shadow-xs">
          <span>Question {currentIndex + 1} of {PERSONALITY_QUESTIONS.length}</span>
          <span>🧁</span>
        </div>
      </div>

      {/* Progress Bar with Cute Pastry Emojis */}
      <div className="w-full bg-white/80 rounded-full p-1 border-2 border-pink-300 shadow-xs relative">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-pink-400 via-rose-500 to-pink-400 transition-all duration-300 relative"
          style={{ width: `${progressPercent}%` }}
        >
          <span className="absolute -right-3 -top-2.5 text-base select-none">
            🥐
          </span>
        </div>
      </div>

      {/* Question Card in Rococo Frame */}
      <div className="relative">
        {/* Ribbon Bow Header */}
        <div className="absolute -top-4 -left-3 sm:-left-4 z-20 text-3xl sm:text-4xl drop-shadow-md select-none transform -rotate-12">
          🎀
        </div>

        {/* Free-Spirited / No-Pressure Seal */}
        <div className="absolute -top-3 -right-2 sm:-right-3 z-20 select-none">
          <div className="px-3 py-1 rounded-full bg-pink-500 text-white border-2 border-neutral-900 text-[10px] font-black uppercase tracking-wider shadow-md transform rotate-3">
            ✨ No Wrong Answers!
          </div>
        </div>

        <div className="bg-white/95 rounded-3xl rococo-frame p-6 sm:p-10 relative overflow-hidden shadow-xl">
          
          {/* Filigree Corner Flourishes */}
          <div className="absolute top-2 left-3 text-pink-300 font-script text-xl select-none">❦</div>
          <div className="absolute top-2 right-3 text-pink-300 font-script text-xl select-none">❦</div>

          {/* Subtitle / Question Category */}
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold bg-pink-50 border border-pink-200 text-pink-800">
              <span>{currentQ.icon}</span>
              <span className="tracking-widest uppercase font-black">Sweet Pastry Persona Quiz</span>
            </span>

            <h2 className="font-playfair italic font-black text-2xl sm:text-4xl text-neutral-900 mt-2 leading-tight">
              {currentQ.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1.5 font-normal">
              {currentQ.subtitle}
            </p>
          </div>

          {/* Lace divider */}
          <div className="lace-divider w-full my-5" />

          {/* 4 Choices Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQ.choices.map((choice, idx) => {
              const isSelected = selectedAnswers[currentQ.id] === choice.archetypeId;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectChoice(choice.archetypeId)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden shadow-xs hover:-translate-y-0.5 active:scale-98 ${
                    isSelected
                      ? 'bg-pink-100/90 border-neutral-900 shadow-md ring-2 ring-pink-400'
                      : 'bg-white hover:bg-pink-50/80 border-pink-200 hover:border-pink-400'
                  }`}
                >
                  {/* Subtle top color strip */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-300 to-rose-300 opacity-60 group-hover:opacity-100" />

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform shadow-xs">
                      {choice.emoji}
                    </div>

                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-neutral-900 font-bold leading-snug group-hover:text-pink-900 transition-colors">
                        {choice.text}
                      </p>
                      
                      <div className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
                        <span>✨</span>
                        <span>{choice.flavorNote}</span>
                      </div>
                    </div>
                  </div>

                  {/* Choice Letter badge */}
                  <div className="mt-3 pt-2 border-t border-pink-100 flex items-center justify-between text-[11px] font-bold text-neutral-500">
                    <span className="font-mono text-pink-600 font-bold">
                      Choice {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-pink-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-black uppercase">
                      <span>Pick this vibe</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls below choices */}
          <div className="mt-6 pt-4 border-t-2 border-pink-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-neutral-400'
                  : 'text-neutral-700 hover:bg-pink-100 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Question</span>
            </button>

            <span className="text-[11px] text-pink-700 font-bold italic">
              🍓 Just pick what speaks to you!
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};
