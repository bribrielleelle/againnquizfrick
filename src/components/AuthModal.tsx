import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, Sparkles, CheckCircle2, ArrowRight, Trash2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginOrRegister, usersList, currentUser, deleteSavedUser } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) return;

    const res = loginOrRegister(username, email, password);
    if (res.success) {
      setSavedSuccess(`Welcome, ${res.user.username}! Your profile (${res.user.email}) has been saved.`);
      setTimeout(() => {
        setSavedSuccess(null);
        onClose();
      }, 700);
    }
  };

  const handleSelectSavedUser = (savedUser: { username: string; email: string }) => {
    loginOrRegister(savedUser.username, savedUser.email, 'saved-password');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Top sky blue fading ombre into light pink bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-sky-300 border border-slate-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            <span>Player Sign-In</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Log In or Sign Up
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Enter your name, email, and any password you desire. Your player profile and score history are automatically saved!
          </p>
        </div>

        {savedSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{savedSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username / Player Name (Required) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Your Name or Username</span>
              <span className="text-[10px] text-pink-400 font-semibold">*Required</span>
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
              <input
                type="text"
                required
                placeholder="e.g. Brielle or PastryPro"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
                autoFocus
              />
            </div>
          </div>

          {/* Email Address (Required) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Email Address</span>
              <span className="text-[10px] text-pink-400 font-semibold">*Required</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
              <input
                type="email"
                required
                placeholder="e.g. brielle@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>
          </div>

          {/* Any Password they desire (Required) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <span className="text-[10px] text-pink-300 font-medium">
                (Any password you desire)
              </span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
              <input
                type="text"
                required
                placeholder="Enter any password (e.g. 123, cake, baker)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-pink-400 transition-colors"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 px-0.5">
              <span>Players: Use any password</span>
              <span className="text-[10px] text-pink-300 bg-pink-950/40 border border-pink-500/30 px-1.5 py-0.5 rounded-md font-mono">
                Teacher password: baker123
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-sky-400 via-sky-300 to-pink-300 hover:opacity-95 shadow-md shadow-pink-500/10 transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Log In &amp; Save Player</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Saved Players on this Device */}
        {usersList.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Saved Players on this Device ({usersList.length})
              </span>
              <span className="text-[10px] text-sky-400">1-Tap Switch</span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {usersList.map((u) => {
                const isCurrent = currentUser?.id === u.id;

                return (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
                      isCurrent
                        ? 'bg-slate-800 border-sky-400/50 text-slate-100'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectSavedUser(u)}
                      className="flex items-center gap-2 text-left flex-1 cursor-pointer truncate"
                    >
                      <div className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center font-bold text-[11px] text-pink-300 flex-shrink-0">
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <div className="font-bold flex items-center gap-1.5 truncate">
                          <span className="truncate">{u.username}</span>
                          {isCurrent && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-semibold flex-shrink-0">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          {u.email}
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSavedUser(u.id);
                      }}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors ml-2 flex-shrink-0"
                      title="Remove saved profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
