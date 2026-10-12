import React, { useState } from 'react';
import Icon from './Icon';
import { signInWithEmail, signUpWithEmail, signOutUser } from '../firebase';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  onAuthSuccess 
}) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const user = await signUpWithEmail(email, password, displayName);
        setSuccessMsg(`Welcome, ${displayName || user.email}! Account created.`);
        if (onAuthSuccess) onAuthSuccess(user);
        setTimeout(() => onClose(), 1200);
      } else {
        const user = await signInWithEmail(email, password);
        setSuccessMsg(`Welcome back, ${user.displayName || user.email}!`);
        if (onAuthSuccess) onAuthSuccess(user);
        setTimeout(() => onClose(), 1200);
      }
    } catch (err) {
      console.error('Firebase Auth Error:', err);
      let msg = err.message || 'Authentication failed. Please check credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account already exists with this email. Try Signing In.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      onClose();
    } catch (err) {
      console.error('Sign Out Error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-[440px] frosted-glass bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEEC98]" />
            <h3 className="font-heading text-base font-bold text-slate-900">
              {currentUser ? 'Founder Account' : (isSignUp ? 'Create Founder Account' : 'Sign In to Soup')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          
          {currentUser ? (
            /* Signed In State */
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                  {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'F'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {currentUser.displayName || 'Authenticated Founder'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block truncate">
                    {currentUser.email}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600 leading-relaxed">
                ✓ Connected to Firebase Project: <strong>soup-97c76</strong><br />
                ✓ Firestore syncing active: workspace data persists under <code>founders/{currentUser.uid}</code>.
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full h-10 px-4 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors active:scale-95"
              >
                <Icon name="logout" size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            /* Sign In / Sign Up Form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              
              {isSignUp && (
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Your Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center">
                      <Icon name="person" size={15} />
                    </span>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="e.g. Arjun Vance"
                      className="w-full h-10 pl-9 pr-4 rounded-xl frosted-input text-slate-900 text-xs sm:text-sm outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center">
                    <Icon name="mail" size={15} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="founder@company.com"
                    className="w-full h-10 pl-9 pr-4 rounded-xl frosted-input text-slate-900 text-xs sm:text-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center">
                    <Icon name="lock" size={15} />
                  </span>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 pl-9 pr-4 rounded-xl frosted-input text-slate-900 text-xs sm:text-sm outline-none"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fade-in">
                  <Icon name="error" size={15} className="shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-fade-in">
                  <Icon name="check" size={15} className="shrink-0 text-emerald-500" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-1 rounded-full bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 text-xs font-bold shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating...' : (isSignUp ? 'Create Account' : 'Sign In')}</span>
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                {isSignUp ? (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsSignUp(false); setError(null); }}
                      className="font-bold text-slate-900 hover:underline"
                    >
                      Sign In
                    </button>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsSignUp(true); setError(null); }}
                      className="font-bold text-slate-900 hover:underline"
                    >
                      Sign Up
                    </button>
                  </span>
                )}
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
