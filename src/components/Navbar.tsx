import React, { useState, useRef, useEffect } from 'react';
import { useAuth, TEACHER_PASSWORDS } from '../context/AuthContext';
import { 
  Sparkles, 
  Trophy, 
  History, 
  BookOpen, 
  LogOut, 
  LogIn, 
  UserPlus, 
  ChefHat, 
  User, 
  MoreVertical, 
  Settings, 
  Shield, 
  RotateCcw,
  Users
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
    <header className="w-full bg-slate-900/95 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand with the requested sky blue fading ombre into light pink */}
        <div 
          onClick={() => onSelectTab('quizzes')} 
          className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-400/20 to-pink-400/20 border border-sky-400/30 flex items-center justify-center text-pink-300 group-hover:scale-105 transition-transform">
            <ChefHat className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300 bg-clip-text text-transparent">
              brielles quiz
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => onSelectTab('quizzes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentTab === 'quizzes'
                ? 'bg-slate-800 text-sky-300 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Quizzes</span>
          </button>

          <button
            onClick={() => onSelectTab('leaderboards')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentTab === 'leaderboards'
                ? 'bg-slate-800 text-sky-300 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Leaderboards</span>
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentTab === 'history'
                ? 'bg-slate-800 text-sky-300 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>My History</span>
          </button>

          {/* Teacher link strictly hidden from players per spec */}
          {isTeacher && (
            <button
              onClick={() => onSelectTab('teacher')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentTab === 'teacher'
                  ? 'bg-pink-950/40 text-pink-300 border border-pink-500/40 shadow-sm'
                  : 'text-pink-400/90 hover:text-pink-200 hover:bg-pink-950/20'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Teacher Tools</span>
            </button>
          )}
        </nav>

        {/* Right side user & corner more options toggle */}
        <div className="flex items-center gap-2">
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2">
              {/* User badge with role */}
              <div 
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 cursor-pointer hover:border-slate-600 transition-colors"
                title="Click to view player profile"
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                  currentUser.role === 'teacher' 
                    ? 'bg-pink-500/20 text-pink-300' 
                    : 'bg-sky-500/20 text-sky-300'
                }`}>
                  {currentUser.role === 'teacher' ? <ChefHat className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-100 leading-tight">
                    {currentUser.username}
                  </span>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                    currentUser.role === 'teacher' ? 'text-pink-300' : 'text-sky-300'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>

              {/* Log out icon */}
              <button
                onClick={logout}
                title="Log out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-sky-400 to-pink-300 hover:opacity-95 shadow-sm transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
          )}

          {/* Top Corner "More Options" Toggle Menu */}
          <div className="relative" ref={optionsRef}>
            <button
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                isOptionsOpen
                  ? 'bg-slate-800 text-sky-300 border-sky-400/50 shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-400 hover:text-slate-200'
              }`}
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Corner Options Dropdown Card */}
            {isOptionsOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2 border-b border-slate-800 mb-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Settings className="w-3 h-3 text-sky-400" />
                    <span>More Options</span>
                  </div>
                  {currentUser && (
                    <div className="mt-1 text-xs text-slate-300 font-semibold truncate">
                      {currentUser.username} <span className="text-slate-500 font-normal">({currentUser.role})</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  {/* Role Switch Toggle housed cleanly inside More Options */}
                  {currentUser && (
                    <button
                      onClick={() => {
                        switchUserRole(currentUser.role === 'teacher' ? 'player' : 'teacher');
                        setIsOptionsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center justify-between text-slate-200 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-3.5 h-3.5 text-pink-400 group-hover:rotate-180 transition-transform duration-300" />
                        <span>
                          Switch to <strong className={currentUser.role === 'teacher' ? 'text-sky-300' : 'text-pink-300'}>{currentUser.role === 'teacher' ? 'Player' : 'Teacher'}</strong>
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">Toggle</span>
                    </button>
                  )}

                  {/* Switch Account */}
                  <button
                    onClick={() => {
                      onOpenAuth('login');
                      setIsOptionsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-slate-200 transition-colors cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    <span>Switch Player Account</span>
                  </button>

                  {/* Teacher Access Password Note */}
                  <div className="px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-800 text-[11px] text-slate-400 leading-snug">
                    <span className="text-pink-300 font-semibold">Teacher Access:</span> Teachers get access automatically by entering teacher password <code className="text-slate-200 font-mono font-bold">baker123</code>.
                  </div>

                  {/* Logout if authenticated */}
                  {currentUser && (
                    <button
                      onClick={() => {
                        logout();
                        setIsOptionsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-950/30 text-rose-300 flex items-center gap-2 transition-colors cursor-pointer pt-2 border-t border-slate-800"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 px-2 py-1.5 bg-slate-900/90 text-xs">
        <button
          onClick={() => onSelectTab('quizzes')}
          className={`px-3 py-1 rounded-lg font-bold ${currentTab === 'quizzes' ? 'text-sky-300 bg-slate-800' : 'text-slate-400'}`}
        >
          Quizzes
        </button>
        <button
          onClick={() => onSelectTab('leaderboards')}
          className={`px-3 py-1 rounded-lg font-bold ${currentTab === 'leaderboards' ? 'text-sky-300 bg-slate-800' : 'text-slate-400'}`}
        >
          Leaderboards
        </button>
        <button
          onClick={() => onSelectTab('history')}
          className={`px-3 py-1 rounded-lg font-bold ${currentTab === 'history' ? 'text-sky-300 bg-slate-800' : 'text-slate-400'}`}
        >
          History
        </button>
        {isTeacher && (
          <button
            onClick={() => onSelectTab('teacher')}
            className={`px-3 py-1 rounded-lg font-bold ${currentTab === 'teacher' ? 'text-pink-300 bg-pink-950/30' : 'text-pink-400'}`}
          >
            Teacher
          </button>
        )}
      </div>
    </header>
  );
};
