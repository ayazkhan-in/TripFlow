import React, { useState } from 'react';
import { USER_AVATAR, ALEX_DISPATCH_AVATAR } from '../../data/mockData';
import { TripFlowApi } from '../../services/api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'traveler' | 'operator';
  avatar: string;
  membership?: string;
  agencyName?: string;
  agencyCode?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
  defaultRole?: 'traveler' | 'operator';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  defaultRole = 'traveler',
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'quick'>('signin');
  const [selectedRole, setSelectedRole] = useState<'traveler' | 'operator'>(defaultRole);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [agencyCode, setAgencyCode] = useState('');
  const [phone, setPhone] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickLogin = async (role: 'traveler' | 'operator') => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      if (role === 'traveler') {
        let userObj = {
          id: 'user-sarah-1024',
          name: 'Sarah Mehta',
          email: 'sarah.mehta@concierge.tripflow.io',
          role: 'traveler' as const,
          avatar: USER_AVATAR,
          membership: 'Concierge Elite Member',
        };
        try {
          const res = await TripFlowApi.login('sarah.mehta@concierge.tripflow.io', 'password123');
          if (res?.user) {
            userObj = {
              id: res.user.id || userObj.id,
              name: res.user.name || userObj.name,
              email: res.user.email || userObj.email,
              role: 'traveler',
              avatar: res.user.avatarUrl || userObj.avatar,
              membership: res.user.membershipTier || userObj.membership,
            };
          }
        } catch (apiErr) {
          console.warn('Backend login fallback to local persona:', apiErr);
        }
        onLogin(userObj);
      } else {
        let userObj = {
          id: 'user-alex-007',
          name: 'Alex Vance',
          email: 'alex.vance@ops.tripflow.io',
          role: 'operator' as const,
          avatar: ALEX_DISPATCH_AVATAR,
          membership: 'Chief Dispatch Controller',
          agencyName: 'Alpine & Beyond Expeditions',
          agencyCode: 'OP-ALPS-2026',
        };
        try {
          const res = await TripFlowApi.login('alex.vance@ops.tripflow.io', 'password123');
          if (res?.user) {
            userObj = {
              id: res.user.id || userObj.id,
              name: res.user.name || userObj.name,
              email: res.user.email || userObj.email,
              role: 'operator',
              avatar: res.user.avatarUrl || userObj.avatar,
              membership: res.user.membershipTier || userObj.membership,
              agencyName: res.user.agencyName || userObj.agencyName,
              agencyCode: res.user.agencyCode || userObj.agencyCode,
            };
          }
        } catch (apiErr) {
          console.warn('Backend login fallback to local persona:', apiErr);
        }
        onLogin(userObj);
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Quick login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await TripFlowApi.login(email.trim(), password);
      const isOp = res.user.role?.toUpperCase() === 'OPERATOR';
      onLogin({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: isOp ? 'operator' : 'traveler',
        avatar: res.user.avatarUrl || (isOp ? ALEX_DISPATCH_AVATAR : USER_AVATAR),
        membership: res.user.membershipTier || (isOp ? 'Chief Dispatch Controller' : 'Concierge Member'),
        agencyName: res.user.agencyName,
        agencyCode: res.user.agencyCode,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials or user not found');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Please provide your name, email, and password.');
      return;
    }
    if (selectedRole === 'operator' && !agencyName.trim()) {
      setErrorMessage('Please provide your Travel Agency Name.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await TripFlowApi.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: selectedRole === 'operator' ? 'OPERATOR' : 'TRAVELER',
        phone: phone.trim() || undefined,
        agencyName: selectedRole === 'operator' ? agencyName.trim() : undefined,
        agencyCode: selectedRole === 'operator' ? (agencyCode.trim() || `OP-${name.slice(0, 3).toUpperCase()}-2026`) : undefined,
      });

      const isOp = res.user.role?.toUpperCase() === 'OPERATOR';
      onLogin({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: isOp ? 'operator' : 'traveler',
        avatar: res.user.avatarUrl || (isOp ? ALEX_DISPATCH_AVATAR : USER_AVATAR),
        membership: res.user.membershipTier || (isOp ? 'Chief Dispatch Controller' : 'Concierge Member'),
        agencyName: res.user.agencyName,
        agencyCode: res.user.agencyCode,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Try a different email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm border border-white/20">
              <span className="material-symbols-outlined text-2xl">
                {selectedRole === 'operator' ? 'hub' : 'flight_takeoff'}
              </span>
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                TripFlow Portal
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-200">
                  {authMode === 'signup' ? 'New Account' : authMode === 'signin' ? 'Secure Login' : 'Demo Mode'}
                </span>
              </h2>
              <p className="text-xs text-blue-200/80">
                {selectedRole === 'operator'
                  ? 'Access your agency-isolated dispatch command center'
                  : 'Access your hyper-personalized live itineraries'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-white/70 hover:bg-white/10 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setIsLoading(false);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              authMode === 'signin'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setIsLoading(false);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              authMode === 'signup'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create New Account
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('quick');
              setIsLoading(false);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              authMode === 'quick'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            ⚡ Quick Demo
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="p-6">
          {/* QUICK DEMO TAB */}
          {authMode === 'quick' && (
            <div className="space-y-3.5">
              <p className="text-xs text-slate-500 mb-2">
                Click any pre-seeded persona to explore with instant live telemetry:
              </p>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickLogin('operator')}
                className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-600 bg-slate-50 hover:bg-blue-50/50 transition-all flex items-center gap-3.5 group cursor-pointer"
              >
                <img
                  src={ALEX_DISPATCH_AVATAR}
                  alt="Alex Vance"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Alex Vance
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      Tour Operator
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate font-medium">
                    Alpine & Beyond Expeditions (OP-ALPS-2026)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Pre-seeded with 4 active tours, 6 vendors & disruption alerts
                  </p>
                </div>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickLogin('traveler')}
                className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-600 bg-slate-50 hover:bg-blue-50/50 transition-all flex items-center gap-3.5 group cursor-pointer"
              >
                <img
                  src={USER_AVATAR}
                  alt="Sarah Mehta"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/20 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Sarah Mehta
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Traveler
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate font-medium">
                    Concierge Elite Member • sarah.mehta@concierge.tripflow.io
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Kerala Monsoon Whispers booking & active travel vault
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* SIGN IN TAB */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. operator@agency.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">
                        progress_activity
                      </span>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">login</span>
                      Sign In to Account
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-slate-500 pt-2">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  Create New Account
                </button>
              </p>
            </form>
          )}

          {/* SIGN UP TAB (CREATION FLOW) */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              {/* Role Toggle Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('traveler')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedRole === 'traveler'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">person</span>
                    Traveler
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('operator')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedRole === 'operator'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">hub</span>
                    Tour Operator
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {selectedRole === 'operator' ? 'Lead Controller Name' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={selectedRole === 'operator' ? 'e.g. Vikram Singhania' : 'e.g. Sarah Mehta'}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98000 00000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. controller@luxuryexpeditions.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* OPERATOR-SPECIFIC AGENCY FIELDS */}
              {selectedRole === 'operator' && (
                <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                    <span className="material-symbols-outlined text-base text-indigo-600">domain</span>
                    <span>Agency Fleet Configuration</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-indigo-950 mb-1">
                      Agency / Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Himalayan Skyways & Expeditions"
                      value={agencyName}
                      onChange={e => setAgencyName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white rounded-lg border border-indigo-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-indigo-950 mb-1">
                      Agency License / Operator Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. OP-HIM-2026"
                      value={agencyCode}
                      onChange={e => setAgencyCode(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white rounded-lg border border-indigo-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-[10px] text-indigo-600/80 mt-1">
                      Your operational data (cohorts, vendors, ledger, disruptions) will be strictly isolated to this agency.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">
                        progress_activity
                      </span>
                      Setting Up Your Account...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">how_to_reg</span>
                      {selectedRole === 'operator' ? 'Register Operator Agency & Open Hub' : 'Register Traveler Account'}
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-slate-500 pt-1">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
