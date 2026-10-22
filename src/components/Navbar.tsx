import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Trophy, History, BookOpen, ShieldAlert, LogOut, LogIn, UserPlus, ChefHat, User } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: (initialTab: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenAuth }) => {
  const { currentUser, isAuthenticated, isTeacher, logout, switchUserRole } = useAuth();

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

        {/* Right side user / auth actions */}
        <div className="flex items-center gap-2.5">
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2">
              {/* User badge with role */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-800/90 border border-slate-700/80">
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

              {/* Fast test role switcher for Phase 1 verification */}
              <button
                onClick={() => switchUserRole(currentUser.role === 'teacher' ? 'player' : 'teacher')}
                title="Switch test role between Player & Teacher"
                className="hidden sm:inline-flex text-[11px] font-semibold px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
              >
                Role: {currentUser.role === 'teacher' ? 'Switch to Player' : 'Switch to Teacher'}
              </button>

              {/* Log out */}
              <button
                onClick={logout}
                title="Log out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-sky-400 to-pink-300 hover:opacity-95 shadow-sm transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          )}
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
