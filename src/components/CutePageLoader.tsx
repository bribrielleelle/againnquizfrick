import React, { useState, useEffect } from 'react';

interface CutePageLoaderProps {
  isLoading: boolean;
  targetTitle?: string;
  targetIcon?: string;
  onFinish?: () => void;
}

const BAKING_PHRASES = [
  'Preheating the patisserie oven... 🥐',
  'Whipping up silky vanilla buttercream... 🍰',
  'Rolling out flaky laminated dough... 🧈',
  'Dusting treats with powdered sugar... ✨',
  'Tying sweet pink ribbon bows... 🎀',
  'Freshly piping choux cream... 🧁',
  'Proofing golden sourdough dough... 🥖',
  'Sprinkling sweet confection & trivia... 🍓',
];

const PASTRIES = ['🥐', '🍰', '🧁', '🍪', '🍓', '🥖', '🥨', '🍫'];

export const CutePageLoader: React.FC<CutePageLoaderProps> = ({
  isLoading,
  targetTitle,
  targetIcon,
}) => {
  const [phrase, setPhrase] = useState(BAKING_PHRASES[0]);
  const [pastryIndex, setPastryIndex] = useState(0);

  useEffect(() => {
    if (isLoading) {
      // Pick random cute baking phrase
      const randomPhrase = BAKING_PHRASES[Math.floor(Math.random() * BAKING_PHRASES.length)];
      setPhrase(randomPhrase);

      // Cycle pastry icon
      const interval = setInterval(() => {
        setPastryIndex((prev) => (prev + 1) % PASTRIES.length);
      }, 150);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-boudoir-stripes animate-in fade-in duration-150 backdrop-blur-xs select-none">
      
      {/* Soft translucent backdrop */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-xs" />

      {/* Main Ornate Rococo Loading Card */}
      <div className="relative z-10 w-full max-w-sm bg-white rococo-frame rounded-3xl p-6 sm:p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Corner Flourishes */}
        <div className="absolute top-2 left-2 text-pink-300 font-script text-xl">❦</div>
        <div className="absolute top-2 right-2 text-pink-300 font-script text-xl">❦</div>
        <div className="absolute bottom-2 left-2 text-pink-300 font-script text-xl">❦</div>
        <div className="absolute bottom-2 right-2 text-pink-300 font-script text-xl">❦</div>

        {/* Top Bouncing Ribbon Bow */}
        <div className="text-3xl sm:text-4xl -mt-2 mb-2 animate-bounce">
          🎀
        </div>

        {/* Cameo Medallion with Cycling Pastry Animation */}
        <div className="w-20 h-24 mx-auto rounded-[50%] bg-gradient-to-b from-white via-pink-50 to-pink-100 border-[3px] border-neutral-900 shadow-md flex flex-col items-center justify-center mb-4 relative overflow-hidden group">
          <div className="absolute top-1 inset-x-0 h-1 bg-pink-300/50" />
          <span className="text-4xl transform transition-transform duration-150 scale-110">
            {targetIcon || PASTRIES[pastryIndex]}
          </span>
        </div>

        {/* Brand / Page Target Title */}
        <div className="font-playfair italic font-black text-2xl text-neutral-900 tracking-tight leading-tight">
          {targetTitle ? targetTitle : 'Baking in Progress...'}
        </div>

        {/* Cute Subtitle / Phrase */}
        <p className="font-script text-xl text-pink-700 mt-1 leading-tight">
          {phrase}
        </p>

        {/* Animated Scalloped Progress Bar */}
        <div className="mt-5 w-full bg-pink-100 rounded-full h-3 p-0.5 border-2 border-pink-300 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-pink-400 via-pink-500 to-neutral-900 rounded-full animate-pulse transition-all duration-500 w-full" />
        </div>

        {/* Cute Pastry Dots */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-neutral-400 font-bold">
          <span>🧁</span>
          <span className="text-[10px] uppercase tracking-widest text-pink-600 font-black">EclairWiz Bakery</span>
          <span>🥐</span>
        </div>

        {/* Scalloped Lace Trim at bottom */}
        <div className="lace-divider w-full mt-3" />
      </div>

    </div>
  );
};
