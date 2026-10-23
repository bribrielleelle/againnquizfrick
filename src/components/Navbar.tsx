import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Trophy, 
  History, 
  BookOpen, 
  LogOut, 
  LogIn, 
  ChefHat, 
  User, 
  MoreVertical, 
  Settings, 
  RotateCcw,
  Users,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: (initialTab: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenAuth }) => {
  const { currentUser, isAuthenticated, isTeacher, logout, switchUserRole } = useAuth();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setIsOptionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full sticky top-0 z-40">
      {/* Top Cute Cameo Bar Header - Vintage Boudoir Boutique */}
      <div className="bg-pink-100/90 border-b border-pink-200 backdrop-blur-sm py-2 px-4 flex items-center justify-between shadow-xs">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          
          {/* Cameo Brand Badge */}
          <div 
            onClick={() => onSelectTab('quizzes')} 
            className="flex items-center gap-3 cursor-pointer group select-none relative"
          >
            {/* Black Bow perched on top of cameo */}
            <div className="relative flex items-center justify-center">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-2xl z-10 transition-transform group-hover:scale-110 drop-shadow-sm">
                🎀
              </span>
              <div className="w-12 h-14 rounded-[50%] bg-gradient-to-b from-white via-pink-50 to-pink-100 border-[2.5px] border-neutral-900 shadow-md flex flex-col items-center justify-center group-hover:border-pink-600 transition-colors pt-2">
                <span className="text-xl">🥐</span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-playfair italic font-black text-2xl sm:text-3xl text-neutral-900 tracking-tight drop-shadow-xs group-hover:text-pink-700 transition-colors">
                  EclairWiz
                </span>
                <span className="text-xs">🍰</span>
              </div>
              <span className="font-script text-base sm:text-lg text-pink-700 leading-none -mt-1 tracking-wide">
                Patisserie &amp; Baking Trivia
              </span>
            </div>
          </div>

          {/* Right side user & corner more options toggle */}
          <div className="flex items-center gap-2">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-2">
                {/* User boutique badge */}
                <div 
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border-2 border-pink-300 shadow-xs cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-all"
                  title="Click to view player profile"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentUser.role === 'teacher' 
                      ? 'bg-neutral-900 text-pink-300' 
                      : 'bg-pink-200 text-neutral-900'
                  }`}>
                    {currentUser.role === 'teacher' ? <ChefHat className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-neutral-900 leading-tight">
                      {currentUser.username}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${
                      currentUser.role === 'teacher' ? 'text-pink-600' : 'text-neutral-600'
                    }`}>
                      {currentUser.role === 'teacher' ? 'Chef / Teacher 👩‍🍳' : 'Baker 🧁'}
                    </span>
                  </div>
                </div>

                {/* Log out icon */}
                <button
                  onClick={logout}
                  title="Log out"
                  className="p-2 rounded-full text-neutral-600 hover:text-rose-600 hover:bg-pink-200/60 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-neutral-900 hover:bg-pink-600 shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer border border-pink-200"
              >
                <span>🎀</span>
                <span>Log In / Sign Up</span>
              </button>
            )}

            {/* Top Corner "More Options" Toggle Menu */}
            <div className="relative" ref={optionsRef}>
              <button
                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                className={`p-2 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                  isOptionsOpen
                    ? 'bg-neutral-900 text-pink-300 border-neutral-900 shadow-sm'
                    : 'bg-white hover:bg-pink-50 border-pink-300 text-neutral-700 hover:text-neutral-900'
                }`}
                title="More options (Role switch & accounts)"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Corner Options Dropdown Card */}
              {isOptionsOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border-2 border-neutral-900 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="pb-2 border-b-2 border-pink-100 mb-3">
                    <div className="text-[11px] font-black uppercase tracking-wider text-pink-600 flex items-center gap-1.5 font-fredoka">
                      <Settings className="w-3.5 h-3.5" />
                      <span>Boutique Options</span>
                    </div>
                    {currentUser && (
                      <div className="mt-1 text-xs text-neutral-800 font-bold truncate">
                        {currentUser.username} <span className="text-pink-600 font-medium">({currentUser.role})</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-xs">
                    {/* Role Switch Toggle housed cleanly inside More Options */}
                    {currentUser && (
                      <button
                        onClick={() => {
                          switchUserRole(currentUser.role === 'teacher' ? 'player' : 'teacher');
                          setIsOptionsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 flex items-center justify-between text-neutral-900 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <RotateCcw className="w-3.5 h-3.5 text-pink-600 group-hover:rotate-180 transition-transform duration-300" />
                          <span>
                            Switch to <strong className="text-pink-700 font-black">{currentUser.role === 'teacher' ? 'Player 🧁' : 'Teacher 👩‍🍳'}</strong>
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-neutral-500">Toggle</span>
                      </button>
                    )}

                    {/* Switch Account */}
                    <button
                      onClick={() => {
                        logout();
                        setIsOptionsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-pink-50 border border-transparent hover:border-pink-200 flex items-center gap-2 text-neutral-800 transition-colors cursor-pointer font-bold"
                    >
                      <Users className="w-3.5 h-3.5 text-pink-600" />
                      <span>Switch Baker (Go to Login Page)</span>
                    </button>

                    {/* Teacher Access Password Note */}
                    <div className="px-3 py-2 rounded-xl bg-neutral-900 text-pink-100 text-[11px] leading-snug shadow-inner">
                      <div className="flex items-center gap-1 font-bold text-pink-300 mb-0.5">
                        <Sparkles className="w-3 h-3" />
                        <span>Teacher Access</span>
                      </div>
                      Teachers unlock instantly by entering teacher password <code className="bg-neutral-800 text-pink-300 px-1 py-0.5 rounded font-mono font-bold">baker123</code>.
                    </div>

                    {/* Logout if authenticated */}
                    {currentUser && (
                      <button
                        onClick={() => {
                          logout();
                          setIsOptionsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-700 flex items-center gap-2 transition-colors cursor-pointer pt-2 border-t border-pink-100 font-bold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dark Boutique Ribbon Navbar with Italic Serif Navigation Links */}
      <nav className="w-full bg-neutral-900 text-white border-y border-neutral-800 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center sm:justify-start gap-1 sm:gap-4 h-12 overflow-x-auto">
          
          <button
            onClick={() => onSelectTab('quizzes')}
            className={`px-3 sm:px-4 py-1.5 rounded-md font-playfair italic tracking-wider text-xs sm:text-sm font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentTab === 'quizzes'
                ? 'bg-pink-500 text-neutral-950 font-black shadow-inner scale-105'
                : 'text-pink-100 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <span>🥐</span>
            <span>QUIZZES</span>
          </button>

          <button
            onClick={() => onSelectTab('leaderboards')}
            className={`px-3 sm:px-4 py-1.5 rounded-md font-playfair italic tracking-wider text-xs sm:text-sm font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentTab === 'leaderboards'
                ? 'bg-pink-500 text-neutral-950 font-black shadow-inner scale-105'
                : 'text-pink-100 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <span>🏆</span>
            <span>LEADERBOARDS</span>
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`px-3 sm:px-4 py-1.5 rounded-md font-playfair italic tracking-wider text-xs sm:text-sm font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentTab === 'history'
                ? 'bg-pink-500 text-neutral-950 font-black shadow-inner scale-105'
                : 'text-pink-100 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <span>📜</span>
            <span>MY HISTORY</span>
          </button>

          {/* Teacher link strictly hidden from players per spec */}
          {isTeacher && (
            <button
              onClick={() => onSelectTab('teacher')}
              className={`px-3 sm:px-4 py-1.5 rounded-md font-playfair italic tracking-wider text-xs sm:text-sm font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentTab === 'teacher'
                  ? 'bg-pink-400 text-neutral-950 font-black shadow-inner scale-105'
                  : 'text-pink-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <span>👩‍🍳</span>
              <span>TEACHER TOOLS</span>
            </button>
          )}
        </div>
      </nav>

      {/* Decorative Scalloped Lace / Pearl Trim under navbar */}
      <div className="lace-divider w-full" />
    </header>
  );
};
