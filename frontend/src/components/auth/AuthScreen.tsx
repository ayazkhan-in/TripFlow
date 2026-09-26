import React, { useState } from 'react';
import { USER_AVATAR, ALEX_DISPATCH_AVATAR } from '../../data/mockData';
import { AuthUser } from './AuthModal';
import { TripFlowApi } from '../../services/api';

interface AuthScreenProps {
  onLogin: (user: AuthUser) => void;
  onBackToLanding: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLogin,
  onBackToLanding,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'quick'>('signin');
  const [selectedRole, setSelectedRole] = useState<'traveler' | 'operator'>('operator');

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [agencyCode, setAgencyCode] = useState('');
  const [phone, setPhone] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectPersona = async (role: 'traveler' | 'operator') => {
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
    } catch (err: any) {
      setErrorMessage(err?.message || 'Demo login failed');
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
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials or account not found');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage('Name, email, and password are required.');
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
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Try a different email address.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F0F3FF] via-[#F7F8FA] to-white flex flex-col font-sans selection:bg-[#2563EB] selection:text-white">
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2.5 text-left cursor-pointer group focus:outline-none"
        >
          <img
            src="/bookit.png"
            alt="Bookit"
            className="w-8 h-8 rounded-lg object-contain shadow-xs group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="text-[17px] font-bold text-[#004AC6] tracking-tight leading-none">
              Bookit
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#737686] font-semibold mt-0.5">
              Secure Access Portal
            </span>
          </div>
        </button>

        <button
          onClick={onBackToLanding}
          className="text-xs font-semibold text-[#4B5563] hover:text-[#004AC6] flex items-center gap-1.5 transition-colors cursor-pointer py-1.5 px-3.5 rounded-full hover:bg-gray-100/70 border border-gray-200"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Back to Landing Page</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Card Top Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20 backdrop-blur-xs">
                <span className="material-symbols-outlined text-2xl">
                  {selectedRole === 'operator' ? 'hub' : 'flight_takeoff'}
                </span>
              </span>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  {authMode === 'signup' ? 'Create New Account' : authMode === 'signin' ? 'Sign In to Bookit' : 'Explore Demo Personas'}
                </h1>
                <p className="text-xs text-blue-200/80">
                  {selectedRole === 'operator'
                    ? 'Strict agency isolation • Live cohort dispatches • Dedicated vendor mesh'
                    : 'Personalized live itineraries • Concierge vault • Real-time telemetry'}
                </p>
              </div>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setIsLoading(false);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
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
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('quick');
                setIsLoading(false);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                authMode === 'quick'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              ⚡ 1-Click Demo
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mx-8 mt-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-base shrink-0">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="p-8">
            {/* 1. QUICK DEMO TAB */}
            {authMode === 'quick' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 mb-2">
                  Select a verified account to test the system immediately:
                </p>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSelectPersona('operator')}
                  className="w-full text-left p-5 rounded-2xl border border-slate-200 hover:border-blue-600 bg-slate-50 hover:bg-blue-50/40 transition-all flex items-center gap-4 group cursor-pointer"
                >
                  <img
                    src={ALEX_DISPATCH_AVATAR}
                    alt="Alex Vance"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500/20 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        Alex Vance
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        Tour Operator
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-semibold mt-0.5 truncate">
                      Alpine & Beyond Expeditions (OP-ALPS-2026)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Chief Dispatcher • Full access to pre-seeded cohorts, supply vendors & disruption cards
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSelectPersona('traveler')}
                  className="w-full text-left p-5 rounded-2xl border border-slate-200 hover:border-blue-600 bg-slate-50 hover:bg-blue-50/40 transition-all flex items-center gap-4 group cursor-pointer"
                >
                  <img
                    src={USER_AVATAR}
                    alt="Sarah Mehta"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500/20 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        Sarah Mehta
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Elite Traveler
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-semibold mt-0.5 truncate">
                      Concierge Elite Member • sarah.mehta@concierge.tripflow.io
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Active Kerala booking • Complete travel vault vouchers • Chauffeur Arun GPS telemetry
                    </p>
                  </div>
                </button>
              </div>
            )}

            {/* 2. SIGN IN TAB */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. operator@agency.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <span className="material-symbols-outlined text-lg animate-spin">
                          progress_activity
                        </span>
                        Verifying Credentials...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">login</span>
                        Sign In to Bookit
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-xs text-slate-500 pt-3">
                  Need a new account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="text-blue-600 hover:underline font-bold cursor-pointer"
                  >
                    Register New Account
                  </button>
                </p>
              </form>
            )}

            {/* 3. SIGN UP TAB */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Choose Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('traveler')}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
                      {selectedRole === 'operator' ? 'Lead Dispatcher Name' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={selectedRole === 'operator' ? 'e.g. Vikram Singhania' : 'e.g. Sarah Mehta'}
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    placeholder="e.g. dispatch@agency.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* OPERATOR AGENCY DETAILS */}
                {selectedRole === 'operator' && (
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
                      <span className="material-symbols-outlined text-base text-indigo-600">domain</span>
                      <span>Agency Data Isolation Profile</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-indigo-950 mb-1">
                        Agency Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Himalayan Skyways & Luxury Expeditions"
                        value={agencyName}
                        onChange={e => setAgencyName(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-indigo-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        className="w-full px-3 py-2 bg-white rounded-xl border border-indigo-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <span className="material-symbols-outlined text-lg animate-spin">
                          progress_activity
                        </span>
                        Configuring Agency Portal...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">how_to_reg</span>
                        {selectedRole === 'operator' ? 'Register Agency & Open Hub' : 'Register Traveler Account'}
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-xs text-slate-500 pt-2">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className="text-blue-600 hover:underline font-bold cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
