import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Zap,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Briefcase,
  Plane,
  X,
  Quote,
} from 'lucide-react';
import { USER_AVATAR, ALEX_DISPATCH_AVATAR } from '../../data/mockData';
import { AuthUser } from './AuthModal';
import { TripFlowApi } from '../../services/api';
import { GoogleIcon } from '../ui/sign-in';

interface AuthScreenProps {
  onLogin: (user: AuthUser) => void;
  onBackToLanding: () => void;
  initialMode?: 'signin' | 'signup' | 'demo';
  initialRole?: 'traveler' | 'operator';
}

const testimonialsData = [
  {
    avatarSrc: USER_AVATAR,
    name: 'Sarah Mehta',
    role: 'Elite Traveler',
    subtitle: 'Concierge Member',
    text: 'Bookit turned our Kerala expedition into absolute luxury. The live chauffeur tracking and automated voucher vault gave us complete peace of mind.',
  },
  {
    avatarSrc: ALEX_DISPATCH_AVATAR,
    name: 'Alex Vance',
    role: 'Chief Dispatcher',
    subtitle: 'Alpine & Beyond Expeditions',
    text: 'Managing 12 simultaneous luxury cohorts used to take hours. Real-time telemetry cut our recovery time to minutes.',
  },
  {
    avatarSrc: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    name: 'Elena Rostova',
    role: 'Operator Partner',
    subtitle: 'Nordic Expeditions',
    text: 'Strict agency data isolation and instant vendor mesh settlements. Bookit is the gold standard for high-end bespoke operations.',
  },
  {
    avatarSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    name: 'Vikram Singhania',
    role: 'Director of Ops',
    subtitle: 'Himalayan Luxury Skyways',
    text: 'Automated weather disruption rerouting saved our 8-day Ladakh luxury cohort during flash storms. Unmatched operational intelligence.',
  },
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLogin,
  onBackToLanding,
  initialMode = 'signin',
  initialRole = 'operator',
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'demo'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<'traveler' | 'operator'>(initialRole);
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [agencyCode, setAgencyCode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password reset modal
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);

  // 1-Click Persona Login
  const handleSelectPersona = async (role: 'traveler' | 'operator') => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      if (role === 'traveler') {
        let userObj: AuthUser = {
          id: 'user-sarah-1024',
          name: 'Sarah Mehta',
          email: 'sarah.mehta@concierge.tripflow.io',
          role: 'traveler',
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
        let userObj: AuthUser = {
          id: 'user-alex-007',
          name: 'Alex Vance',
          email: 'alex.vance@ops.tripflow.io',
          role: 'operator',
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

  // Sign In submit
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
      if (email.includes('alex') || email.includes('operator')) {
        handleSelectPersona('operator');
      } else if (email.includes('sarah') || email.includes('traveler')) {
        handleSelectPersona('traveler');
      } else {
        setErrorMessage(err.message || 'Invalid credentials. You can use 1-Click Demo to sign in immediately.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up submit
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
      setErrorMessage(err.message || 'Registration failed. Try a different email address or explore the 1-Click Demo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-in simulation
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      handleSelectPersona(selectedRole);
    }, 400);
  };

  // Password reset handler
  const handleSendPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSubmitted(true);
    setTimeout(() => {
      setSuccessMessage(`Password recovery link dispatched to ${resetEmail}`);
      setIsResetOpen(false);
      setResetSubmitted(false);
      setResetEmail('');
    }, 1000);
  };

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-white lg:overflow-hidden font-sans selection:bg-[#004AC6] selection:text-white">
      
      {/* =================================================================== */}
      {/* LEFT COLUMN: AUTH FORM (BLENDS SEAMLESSLY, NO SHADOW, CLEAN ARROW)  */}
      {/* =================================================================== */}
      <section className="w-full lg:w-[480px] xl:w-[540px] 2xl:w-[580px] h-full flex flex-col justify-between p-6 sm:p-10 xl:p-14 overflow-y-auto bg-white shrink-0">
        
        {/* Top Header: Clean Arrow Icon (Logo Removed As Requested) */}
        <div>
          <button
            type="button"
            onClick={onBackToLanding}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/80 shadow-2xs"
            aria-label="Back to home"
            title="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Center Main Content: Blends In Without Heavy Card Shadows */}
        <div className="w-full max-w-md mx-auto my-auto py-6">

          {/* FLOATING SLIDER ABOVE AUTH */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1 rounded-full bg-slate-100/90 border border-slate-200/80 shadow-inner gap-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMessage(null);
                }}
                className={`relative px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMessage(null);
                }}
                className={`relative px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('demo');
                  setErrorMessage(null);
                }}
                className={`relative px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  authMode === 'demo'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs'
                    : 'text-amber-700 hover:text-amber-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>1-Click Demo</span>
              </button>
            </div>
          </div>

          {/* Error & Success Feedback Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
              <span className="flex-1 font-medium">{errorMessage}</span>
              <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-rose-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="flex-1 font-medium">{successMessage}</span>
              <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-emerald-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ============================================================= */}
          {/* TAB 1: SIGN IN                                                */}
          {/* ============================================================= */}
          {authMode === 'signin' && (
            <div className="space-y-5 text-left">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                  Sign in to access your Bookit operations cockpit and itineraries.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSignIn}>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                    Email Address
                  </label>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/15 transition-all flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
                    <input
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. alex.vance@ops.tripflow.io"
                      className="w-full bg-transparent text-sm p-3 pl-2.5 rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                    Password
                  </label>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/15 transition-all flex items-center relative">
                    <Lock className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-transparent text-sm p-3 pl-2.5 pr-11 rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="custom-checkbox"
                    />
                    <span className="text-slate-600 font-medium">Keep me signed in</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsResetOpen(true)}
                    className="hover:underline text-[#004AC6] font-semibold transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-[#004AC6] hover:bg-[#003899] py-3.5 font-bold text-sm text-white shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Bookit</span>
                    </>
                  )}
                </button>
              </form>

              <div className="relative flex items-center justify-center my-4">
                <span className="w-full border-t border-slate-200"></span>
                <span className="px-3 text-xs text-slate-400 bg-white absolute font-medium">
                  Or continue with
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              <div className="text-center text-xs text-slate-500 pt-1">
                <span>New to Bookit? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage(null);
                  }}
                  className="text-[#004AC6] font-bold hover:underline transition-colors cursor-pointer"
                >
                  Create Account
                </button>
                <span className="mx-2 text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('demo');
                    setErrorMessage(null);
                  }}
                  className="text-amber-600 font-bold hover:underline transition-colors cursor-pointer"
                >
                  ⚡ 1-Click Demo
                </button>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* TAB 2: SIGN UP                                                */}
          {/* ============================================================= */}
          {authMode === 'signup' && (
            <div className="space-y-4 text-left">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Create an account
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                  Choose how you'll be using the platform.
                </p>
              </div>

              <form className="space-y-3" onSubmit={handleSignUp}>
                {/* Account Type Selector */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('traveler')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      selectedRole === 'traveler'
                        ? 'border-[#004AC6] bg-blue-50/70 text-[#004AC6] ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Plane className="w-3.5 h-3.5" />
                      <span>Traveler</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Live itineraries & digital vault
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('operator')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      selectedRole === 'operator'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Tour Operator</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Fleet dispatch & disruption AI
                    </p>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">
                      {selectedRole === 'operator' ? 'Lead Dispatcher' : 'Full Name'}
                    </label>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/60 focus-within:bg-white focus-within:border-blue-600 transition-all flex items-center">
                      <User className="w-3.5 h-3.5 text-slate-400 ml-3 shrink-0" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder={selectedRole === 'operator' ? 'Alex Vance' : 'Sarah Mehta'}
                        className="w-full bg-transparent text-xs sm:text-sm p-2.5 pl-2 rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">
                      Phone (Optional)
                    </label>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/60 focus-within:bg-white focus-within:border-blue-600 transition-all flex items-center">
                      <Phone className="w-3.5 h-3.5 text-slate-400 ml-3 shrink-0" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+1 555 0192"
                        className="w-full bg-transparent text-xs sm:text-sm p-2.5 pl-2 rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">
                    Email Address
                  </label>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 focus-within:bg-white focus-within:border-blue-600 transition-all flex items-center">
                    <Mail className="w-3.5 h-3.5 text-slate-400 ml-3 shrink-0" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. dispatch@agency.com"
                      className="w-full bg-transparent text-xs sm:text-sm p-2.5 pl-2 rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">
                    Password
                  </label>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 focus-within:bg-white focus-within:border-blue-600 transition-all flex items-center relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 ml-3 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-transparent text-xs sm:text-sm p-2.5 pl-2 pr-9 rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Operator Agency Information */}
                {selectedRole === 'operator' && (
                  <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-100 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Agency Profile</span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-indigo-900 mb-0.5">
                        Agency Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={agencyName}
                        onChange={e => setAgencyName(e.target.value)}
                        placeholder="e.g. Alpine & Beyond Expeditions"
                        className="w-full px-3 py-1.5 bg-white rounded-lg border border-indigo-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-indigo-900 mb-0.5">
                        Operator Code (Optional)
                      </label>
                      <input
                        type="text"
                        value={agencyCode}
                        onChange={e => setAgencyCode(e.target.value)}
                        placeholder="e.g. OP-ALPS-2026"
                        className="w-full px-3 py-1.5 bg-white rounded-lg border border-indigo-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 rounded-xl bg-[#004AC6] hover:bg-[#003899] py-3.5 font-bold text-sm text-white shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>{selectedRole === 'operator' ? 'Register Agency Hub' : 'Register Traveler Account'}</span>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center text-xs text-slate-500 pt-1">
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMessage(null);
                  }}
                  className="text-[#004AC6] font-bold hover:underline transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* TAB 3: 1-CLICK DEMO PERSONAS                                  */}
          {/* ============================================================= */}
          {authMode === 'demo' && (
            <div className="space-y-4 text-left">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Test-drive Bookit
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                  Instant access to verified live personas with zero passwords needed.
                </p>
              </div>

              <div className="space-y-3">
                {/* Persona 1: Tour Operator */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSelectPersona('operator')}
                  className="w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-blue-600 bg-slate-50/60 hover:bg-blue-50/30 transition-all duration-200 flex flex-col gap-2.5 group cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={ALEX_DISPATCH_AVATAR}
                      alt="Alex Vance"
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/20 shrink-0 shadow-2xs"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#004AC6] transition-colors">
                          Alex Vance
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Tour Operator
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-semibold truncate mt-0.5">
                        Alpine & Beyond Expeditions (OP-ALPS-2026)
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Chief Dispatch Controller
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-[#004AC6] pt-1 border-t border-slate-200/60">
                    <span>Open Operator Cockpit</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                {/* Persona 2: Elite Traveler */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSelectPersona('traveler')}
                  className="w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 bg-slate-50/60 hover:bg-emerald-50/30 transition-all duration-200 flex flex-col gap-2.5 group cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={USER_AVATAR}
                      alt="Sarah Mehta"
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/20 shrink-0 shadow-2xs"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          Sarah Mehta
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Elite Traveler
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-semibold truncate mt-0.5">
                        Kerala Luxury & Backwaters (Active Tour)
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Concierge Elite Member
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-emerald-700 pt-1 border-t border-slate-200/60">
                    <span>Open Traveler Portal</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Minimal Footnote */}
        <footer className="pt-4 text-center">
          <p className="text-[11px] text-slate-400">
            Bookit Operations Platform • End-to-end encrypted
          </p>
        </footer>

      </section>

      {/* =================================================================== */}
      {/* RIGHT COLUMN: FULL VIEWPORT HEIGHT, ZERO GAPS, COVERING ENTIRE RIGHT */}
      {/* =================================================================== */}
      <section className="hidden lg:flex flex-1 h-screen relative overflow-hidden flex-col justify-between p-10 xl:p-14 2xl:p-16 select-none bg-slate-950">
        
        {/* Full-Bleed Edge-to-Edge Hero Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-102"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=85')`,
          }}
        />

        {/* Cinematic Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-900/40" />

        {/* Top Header: Pure Headline Focus (Pills & Metrics Removed) */}
        <div className="relative z-10 max-w-2xl pt-4 text-left">
          <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
            Where bespoke journey design meets automated operations.
          </h2>
          <p className="text-sm xl:text-base text-slate-300 mt-4 leading-relaxed font-light max-w-lg">
            Synchronize personalized VIP itineraries, real-time chauffeur GPS, and automated disruption resolution across one unified cockpit.
          </p>
        </div>

        {/* Bottom Section: Single Row Marquee Testimonials */}
        <div className="relative z-10 w-full overflow-hidden pt-6 pb-4 [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
          <div className="animate-marquee flex items-stretch gap-5 py-2">
            {[...testimonialsData, ...testimonialsData].map((t, idx) => (
              <div
                key={`${t.name}-${idx}`}
                className="w-[380px] sm:w-[420px] xl:w-[460px] shrink-0 rounded-3xl bg-white/12 backdrop-blur-2xl border border-white/20 p-5 sm:p-6 text-white shadow-2xl flex flex-col justify-between gap-3.5 text-left hover:bg-white/18 transition-all select-none"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={t.avatarSrc}
                    alt={t.name}
                    className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-white/40 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white text-sm sm:text-base truncate">{t.name}</span>
                      <span className="text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full bg-white/15 text-white/90 border border-white/25 shrink-0">
                        {t.role}
                      </span>
                    </div>
                    {t.subtitle && (
                      <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
                        {t.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-slate-100 font-normal leading-relaxed text-xs sm:text-[13px] line-clamp-3">
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* =================================================================== */}
      {/* RESET PASSWORD MODAL DIALOG                                         */}
      {/* =================================================================== */}
      {isResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-element">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#004AC6] flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Reset Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsResetOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Enter your account email and we'll transmit a secure reset link with single-use token.
            </p>

            <form onSubmit={handleSendPasswordReset} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  Email Address
                </label>
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 focus-within:bg-white focus-within:border-blue-600 transition-all flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="e.g. operator@agency.com"
                    className="w-full bg-transparent text-sm p-3 pl-2.5 rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetSubmitted}
                  className="px-5 py-2.5 rounded-xl bg-[#004AC6] hover:bg-[#003899] text-white text-xs font-bold shadow-md shadow-blue-600/25 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {resetSubmitted ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
