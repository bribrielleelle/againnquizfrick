import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CutePageLoader } from './CutePageLoader';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ChefHat, 
  Trash2, 
  Users, 
  BookOpen, 
  Trophy, 
  Clock, 
  Heart,
  ShieldCheck
} from 'lucide-react';

interface LoginPageProps {
  onContinueAsGuest?: () => void;
  guestPromptMessage?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onContinueAsGuest,
  guestPromptMessage,
}) => {
  const { loginOrRegister, usersList, deleteSavedUser } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'signin' | 'saved'>('signin');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isEntering, setIsEntering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim()) {
      setErrorMsg('Please enter your baker name or username.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('A valid email address is required (e.g. name@example.com).');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Please enter any password you desire.');
      return;
    }

    setIsEntering(true);
    setTimeout(() => {
      loginOrRegister(username, email, password);
    }, 450);
  };

  const handleSelectSavedBaker = (savedUser: { username: string; email: string }) => {
    setIsEntering(true);
    setTimeout(() => {
      loginOrRegister(savedUser.username, savedUser.email, 'saved-password');
    }, 450);
  };

  const handleQuickDemoLoad = (demoName: string, demoEmail: string, demoPass: string) => {
    setIsEntering(true);
    setTimeout(() => {
      loginOrRegister(demoName, demoEmail, demoPass);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-boudoir-stripes text-neutral-900 flex flex-col font-fredoka items-center justify-center p-4 selection:bg-pink-300 selection:text-neutral-900">
      
      {/* Top Floating Bow Accent */}
      <div className="text-4xl sm:text-5xl drop-shadow-md mb-2 animate-bounce select-none">
        🎀
      </div>

      {/* Main Login Frame */}
      <div className="w-full max-w-xl bg-white/95 rococo-frame rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Filigree Corner Flourishes */}
        <div className="absolute top-3 left-3 text-pink-300 font-script text-2xl select-none">❦</div>
        <div className="absolute top-3 right-3 text-pink-300 font-script text-2xl select-none">❦</div>
        <div className="absolute bottom-3 left-3 text-pink-300 font-script text-2xl select-none">❦</div>
        <div className="absolute bottom-3 right-3 text-pink-300 font-script text-2xl select-none">❦</div>

        {/* Cameo Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-18 mx-auto rounded-[50%] bg-gradient-to-b from-white via-pink-50 to-pink-100 border-[3px] border-neutral-900 shadow-md flex items-center justify-center mb-3">
            <span className="text-3xl">🥐</span>
          </div>

          <h1 className="font-playfair italic font-black text-3xl sm:text-4xl text-neutral-900 tracking-tight flex items-center justify-center gap-2">
            <span>EclairWiz</span>
            <span className="text-2xl not-italic">🍰</span>
          </h1>

          <p className="font-script text-xl sm:text-2xl text-pink-700 leading-tight mt-0.5">
            More than just sweet treats — Patisserie Trivia
          </p>

          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 border border-pink-300 text-[11px] font-black uppercase tracking-wider text-pink-900 shadow-xs">
            <Lock className="w-3.5 h-3.5 text-pink-600" />
            <span>Login Required for Quizzes</span>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-md mx-auto leading-relaxed">
            Baker sign-in is required to take quizzes, save personal high scores, and unveil your pastry personality.
          </p>
        </div>

        {/* Guest Quiz-Click Mandatory Alert */}
        {guestPromptMessage && (
          <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 border-2 border-pink-500 text-neutral-900 shadow-md animate-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0 animate-bounce">🧁</span>
              <div className="flex-1">
                <div className="font-playfair italic font-black text-pink-900 text-base flex items-center gap-1.5">
                  <span>Baker Sign-In Required</span>
                  <span className="text-sm not-italic">🎀</span>
                </div>
                <p className="text-xs text-pink-950 font-bold mt-1 leading-snug">
                  {guestPromptMessage}
                </p>
                <p className="text-[11px] text-neutral-600 mt-1.5">
                  Please sign in, pick a saved baker, or click one of the quick presets below to enter and start baking!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Messages */}
        {successMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-950 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-700 animate-pulse" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-100 border-2 border-rose-400 text-rose-950 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Navigation Tabs between New Login and Saved Accounts */}
        <div className="flex items-center gap-2 mb-6 p-1.5 rounded-full bg-pink-100/70 border border-pink-300">
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'signin'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-700 hover:text-neutral-900'
            }`}
          >
            <span>🎀</span>
            <span>Log In / Sign Up</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-700 hover:text-neutral-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-pink-400" />
            <span>Saved Bakers ({usersList.length})</span>
          </button>
        </div>

        {/* TAB 1: FORM TO LOG IN / REGISTER */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Baker Name / Username */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1.5 flex items-center justify-between">
                <span>Your Name or Username</span>
                <span className="text-[10px] text-pink-700 font-bold">*Required</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-600" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Brielle or PastryPro"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-pink-50/70 border-2 border-pink-200 rounded-2xl text-sm text-neutral-900 font-bold placeholder:text-neutral-400 focus:outline-none focus:border-pink-500 focus:bg-white transition-all shadow-xs"
                  autoFocus
                />
              </div>
            </div>

            {/* Email Address (Required) */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-neutral-800 mb-1.5 flex items-center justify-between">
                <span>Email Address</span>
                <span className="text-[10px] text-pink-700 font-bold">*Required</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-600" />
                <input
                  type="email"
                  required
                  placeholder="e.g. brielle@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-pink-50/70 border-2 border-pink-200 rounded-2xl text-sm text-neutral-900 font-bold placeholder:text-neutral-400 focus:outline-none focus:border-pink-500 focus:bg-white transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Any Password they desire */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-neutral-800">
                  Password
                </label>
                <span className="text-[10px] text-pink-700 font-bold">
                  (Use any password you desire)
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
                  className="w-full pl-10 pr-4 py-2.5 bg-pink-50/70 border-2 border-pink-200 rounded-2xl text-sm text-neutral-900 font-bold placeholder:text-neutral-400 focus:outline-none focus:border-pink-500 focus:bg-white transition-all shadow-xs"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-neutral-500 mt-1.5 px-0.5 gap-1">
                <span>Players: Any password unlocks player role</span>
                <span className="text-[10px] text-pink-800 bg-pink-100 border border-pink-300 px-2 py-0.5 rounded-full font-mono font-bold self-start sm:self-auto">
                  Teacher pass: baker123
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3.5 rounded-full font-black uppercase tracking-wider text-sm text-white bg-neutral-900 hover:bg-pink-600 shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-pink-200"
            >
              <span>Save &amp; Enter Bakery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* TAB 2: SAVED BAKERS ON THIS DEVICE (1-TAP QUICK LOAD) */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            <div className="text-xs text-neutral-600 leading-relaxed">
              Every baker that logs in on this browser is remembered below. Tap any profile to instantly load and start taking quizzes!
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {usersList.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500 bg-pink-50/50 rounded-2xl border border-pink-200">
                  No saved bakers yet. Switch to the Log In tab to register your first profile!
                </div>
              ) : (
                usersList.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 rounded-2xl bg-white border-2 border-pink-200 hover:border-pink-400 flex items-center justify-between gap-3 transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        user.role === 'teacher'
                          ? 'bg-neutral-900 text-pink-200'
                          : 'bg-pink-100 text-pink-800 border border-pink-300'
                      }`}>
                        {user.role === 'teacher' ? <ChefHat className="w-4 h-4" /> : user.username.charAt(0).toUpperCase()}
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-sm text-neutral-900 truncate">
                            {user.username}
                          </span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-full ${
                            user.role === 'teacher'
                              ? 'bg-neutral-900 text-white'
                              : 'bg-pink-100 text-pink-800'
                          }`}>
                            {user.role === 'teacher' ? 'Teacher 👩‍🍳' : 'Baker 🧁'}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-500 font-mono truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSelectSavedBaker(user)}
                        className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-neutral-900 hover:bg-pink-600 transition-all cursor-pointer shadow-xs"
                      >
                        Load &amp; Enter
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteSavedUser(user.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove saved profile from device"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Quick Demo Baker Presets */}
        <div className="mt-6 pt-5 border-t-2 border-pink-100">
          <div className="text-[11px] font-black uppercase tracking-wider text-neutral-600 mb-2.5 flex items-center justify-between">
            <span>Quick-Load Demo Bakers:</span>
            <span className="text-[10px] text-pink-700">1-Tap Load</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemoLoad('ChefBrielle', 'chef@baking.quiz', 'baker123')}
              className="p-2.5 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-300 text-left transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="text-base">👩‍🍳</span>
              <div className="truncate">
                <div className="font-bold text-neutral-900 truncate">ChefBrielle</div>
                <div className="text-[10px] text-pink-700 font-semibold truncate">Teacher (baker123)</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLoad('PastryPupil', 'pupil@baking.quiz', 'cookie123')}
              className="p-2.5 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-300 text-left transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="text-base">🧁</span>
              <div className="truncate">
                <div className="font-bold text-neutral-900 truncate">PastryPupil</div>
                <div className="text-[10px] text-neutral-600 font-semibold truncate">Player (cookie123)</div>
              </div>
            </button>
          </div>
        </div>

        {/* Guest Mode Exploration Option */}
        {onContinueAsGuest && (
          <div className="mt-5 pt-4 border-t-2 border-pink-200 text-center">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-pink-100 hover:bg-pink-200 border-2 border-pink-400 hover:border-neutral-900 text-neutral-900 text-xs font-black uppercase tracking-wider transition-all shadow-sm cursor-pointer group active:scale-95"
            >
              <span>🧁</span>
              <span>Browse Bakery in Guest Mode →</span>
            </button>
            <p className="text-[11px] text-neutral-600 mt-2 font-medium">
              You can explore quizzes, menu, and leaderboards as a guest baker! However, clicking to start any quiz or check your baking history will require signing up or logging in.
            </p>
          </div>
        )}

        {/* Baker policy notice */}
        <div className="mt-4 text-center p-3 rounded-2xl bg-pink-50/80 border border-pink-200 text-xs text-neutral-700">
          <div className="font-bold text-pink-800 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-pink-600" />
            <span>Baker Authentication Policy</span>
          </div>
          <p className="text-[11px] text-neutral-600 mt-0.5">
            Guest mode allows browsing only. To take quizzes, record high scores, or check your baking history, signing up or signing in is mandatory.
          </p>
        </div>

      </div>

      {/* Decorative Scalloped Lace / Pearl Trim under frame */}
      <div className="lace-divider w-full max-w-xl mt-4" />

      {/* Cute Page Loader when entering */}
      <CutePageLoader
        isLoading={isEntering}
        targetTitle="Entering EclairWiz Patisserie..."
        targetIcon="🥐"
      />

    </div>
  );
};
