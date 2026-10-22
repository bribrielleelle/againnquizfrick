import React, { useState } from 'react';
import { useAuth, TEACHER_INVITE_CODE } from '../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, Key, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (tab === 'login') {
      const res = login(email || username, password);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Failed to login');
      }
    } else {
      const res = register(username, email, password, inviteCode);
      if (res.success) {
        setSuccessMsg('Account created successfully! You are now logged in.');
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setError(res.error || 'Registration failed');
      }
    }
  };

  const handleQuickLogin = (role: 'teacher' | 'player') => {
    if (role === 'teacher') {
      login('brielle@baking.quiz', 'baker123');
    } else {
      login('pupil@baking.quiz', 'cookie123');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Top subtle sky-to-pink gradient line */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-sky-300 border border-slate-700 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Brielle&apos;s Quiz Hub</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">
            {tab === 'login' ? 'Welcome Back!' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {tab === 'login'
              ? 'Sign in to record your quiz attempts and rank on leaderboards.'
              : 'Join as a player or enter an invite code to access teacher tools.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-800/80 p-1 rounded-2xl mb-6 border border-slate-700/60">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === 'login'
                ? 'bg-gradient-to-r from-sky-400 to-pink-300 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === 'register'
                ? 'bg-gradient-to-r from-sky-400 to-pink-300 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. MasterBaker"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {tab === 'login' ? 'Username or Email' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={tab === 'register' ? 'email' : 'text'}
                required
                placeholder={tab === 'login' ? 'e.g. brielle@baking.quiz' : 'yourname@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-pink-400" />
                  <span>Teacher Invite Code (Optional)</span>
                </label>
              </div>
              <input
                type="text"
                placeholder="Enter secret code for teacher role"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-pink-400 transition-colors uppercase tracking-widest font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <span>Tip: Use code <strong className="text-pink-300 font-mono">{TEACHER_INVITE_CODE}</strong> for teacher access.</span>
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300 hover:opacity-95 shadow-md shadow-pink-500/10 transition-transform active:scale-95 cursor-pointer"
          >
            {tab === 'login' ? 'Sign In to Quiz' : 'Create Free Account'}
          </button>
        </form>

        {/* Quick 1-click test logins */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-2.5">
            Quick 1-Click Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('teacher')}
              className="px-3 py-2 rounded-xl bg-slate-800/70 border border-slate-700/80 hover:bg-slate-800 hover:border-pink-400/40 text-left transition-colors group"
            >
              <div className="text-xs font-bold text-pink-300 group-hover:text-pink-200">
                ChefBrielle
              </div>
              <div className="text-[10px] text-slate-400">Teacher Role</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('player')}
              className="px-3 py-2 rounded-xl bg-slate-800/70 border border-slate-700/80 hover:bg-slate-800 hover:border-sky-400/40 text-left transition-colors group"
            >
              <div className="text-xs font-bold text-sky-300 group-hover:text-sky-200">
                PastryPupil
              </div>
              <div className="text-[10px] text-slate-400">Player Role</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
