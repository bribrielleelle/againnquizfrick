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
      setSavedSuccess(`Welcome, ${res.user.username}! Your baker profile (${res.user.email}) has been saved.`);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rococo-frame rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Top Black Ribbon Bow */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-3xl select-none">
          🎀
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-pink-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mt-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-pink-100 text-pink-800 border border-pink-300 mb-2">
            <span>🧁</span>
            <span>Baker Registry</span>
          </div>
          <h2 className="font-playfair italic font-black text-2xl sm:text-3xl text-neutral-900 tracking-tight">
            Log In or Sign Up
          </h2>
          <p className="text-xs text-neutral-600 mt-1 max-w-xs mx-auto leading-relaxed">
            Enter your baker name, email, and any password you desire. Your profile and score history are automatically saved!
          </p>
        </div>

        {savedSuccess && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-700" />
            <span>{savedSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username / Player Name (Required) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center justify-between">
              <span>Your Baker Name</span>
              <span className="text-[10px] text-pink-600 font-bold">*Required</span>
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-600" />
              <input
                type="text"
                required
                placeholder="e.g. Brielle or PastryPupil"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-pink-50/60 border-2 border-pink-200 rounded-2xl text-sm text-neutral-900 font-bold placeholder:text-neutral-400 focus:outline-none focus:border-pink-500 focus:bg-white transition-colors"
                autoFocus
              />
            </div>
          </div>

          {/* Email Address (Required) */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center justify-between">
              <span>Email Address</span>
              <span className="text-[10px] text-pink-600 font-bold">*Required</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-600" />
              <input
                type="email"
                required
                placeholder="e.g. brielle@baking.quiz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-pink-50/60 border-2 border-pink-200 rounded-2xl text-sm text-neutral-900 font-bold placeholder:text-neutral-400 focus:outline-none focus:border-pink-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Any Password they desire (Required) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-neutral-700">
                Password
              </label>
              <span className="text-[10px] text-pink-700 font-bold">
                (Any password you desire)
              </span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-600" />
              <input
                type="text"
                required
                placeholder="Enter any password (e.g. 123, cake, baker)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-pink-50/60 border-2 border-pink-200 rounded-2xl text-sm text-neutral-900 font-bold placeholder:text-neutral-400 focus:outline-none focus:border-pink-500 focus:bg-white transition-colors"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1.5 px-0.5">
              <span>Players: Use any password</span>
              <span className="text-[10px] text-pink-800 bg-pink-100 border border-pink-300 px-2 py-0.5 rounded-full font-mono font-bold">
                Teacher pass: baker123
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-full font-black uppercase tracking-wider text-xs text-white bg-neutral-900 hover:bg-pink-600 shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-pink-200"
          >
            <span>Log In &amp; Save Profile 🥐</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Saved Players on this Device */}
        {usersList.length > 0 && (
          <div className="mt-6 pt-5 border-t-2 border-pink-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-neutral-600">
                Saved Bakers on Device ({usersList.length})
              </span>
              <span className="text-[10px] text-pink-700 font-bold">1-Tap Switch</span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {usersList.map((u) => {
                const isCurrent = currentUser?.id === u.id;

                return (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-colors ${
                      isCurrent
                        ? 'bg-pink-100 border-pink-400 text-neutral-900'
                        : 'bg-white border-pink-200 hover:bg-pink-50 text-neutral-700'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectSavedUser(u)}
                      className="flex items-center gap-2 text-left flex-1 cursor-pointer truncate"
                    >
                      <div className="w-6 h-6 rounded-full bg-neutral-900 flex items-center justify-center font-bold text-[11px] text-pink-200 flex-shrink-0">
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <div className="font-bold flex items-center gap-1.5 truncate text-neutral-900">
                          <span className="truncate">{u.username}</span>
                          {isCurrent && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-neutral-900 text-white font-bold flex-shrink-0">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono truncate">
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
                      className="p-1 text-neutral-400 hover:text-rose-600 transition-colors ml-2 flex-shrink-0 cursor-pointer"
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
