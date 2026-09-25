import React, { useState } from 'react';
import { USER_AVATAR, ALEX_DISPATCH_AVATAR } from '../../data/mockData';
import { AuthUser } from './AuthModal';

interface AuthScreenProps {
  onLogin: (user: AuthUser) => void;
  onBackToLanding: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLogin,
  onBackToLanding,
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'custom'>('quick');
  const [customRole, setCustomRole] = useState<'traveler' | 'operator'>('traveler');
  const [customName, setCustomName] = useState('Sarah Mehta');
  const [customEmail, setCustomEmail] = useState('sarah.mehta@concierge.tripflow.io');
  const [customPassword, setCustomPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPersona = (role: 'traveler' | 'operator') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'traveler') {
        onLogin({
          id: 'user-sarah-1024',
          name: 'Sarah Mehta',
          email: 'sarah.mehta@concierge.tripflow.io',
          role: 'traveler',
          avatar: USER_AVATAR,
          membership: 'Concierge Elite Member',
        });
      } else {
        onLogin({
          id: 'user-alex-007',
          name: 'Alex Vance',
          email: 'alex.vance@ops.tripflow.io',
          role: 'operator',
          avatar: ALEX_DISPATCH_AVATAR,
          membership: 'Chief Dispatch Controller',
        });
      }
    }, 350);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (customRole === 'traveler') {
        onLogin({
          id: `user-${Date.now()}`,
          name: customName || 'Sarah Mehta',
          email: customEmail,
          role: 'traveler',
          avatar: USER_AVATAR,
          membership: 'Concierge Member',
        });
      } else {
        onLogin({
          id: `user-${Date.now()}`,
          name: customName || 'Alex Vance',
          email: customEmail,
          role: 'operator',
          avatar: ALEX_DISPATCH_AVATAR,
          membership: 'Operations Hub Controller',
        });
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F0F3FF] via-[#F7F8FA] to-white flex flex-col font-sans selection:bg-[#2563EB] selection:text-white">
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2.5 text-left cursor-pointer group focus:outline-none"
        >
          <span className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1D4ED8] transition-colors">
            <span className="material-symbols-outlined text-lg">flight_takeoff</span>
          </span>
          <div className="flex flex-col">
            <span className="text-[17px] font-bold text-[#004AC6] tracking-tight leading-none">
              TripFlow
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
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl space-y-8 animate-in fade-in zoom-in-95 duration-200">
          {/* Headline */}
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#004AC6] text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>Encrypted Workspace Sign In</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              Sign In to TripFlow
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              Select whether you want to log in as a <strong className="text-[#111827]">Traveller</strong> to access
              your living itinerary and Travel Vault, or as an <strong className="text-[#111827]">Operator</strong> to
              command the fleet dispatch radar.
            </p>
          </div>

          {/* Tab Selector: Quick Persona vs Custom Login */}
          <div className="flex justify-center">
            <div className="bg-gray-100 p-1 rounded-full flex items-center gap-1 max-w-xs w-full">
              <button
                type="button"
                onClick={() => setActiveTab('quick')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  activeTab === 'quick'
                    ? 'bg-white text-[#004AC6] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                1-Click Role Login
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  activeTab === 'custom'
                    ? 'bg-white text-[#004AC6] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Custom Credentials
              </button>
            </div>
          </div>

          {/* Option Cards for Quick Role Login */}
          {activeTab === 'quick' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Option 1: Traveller Persona */}
              <div
                onClick={() => !isLoading && handleSelectPersona('traveler')}
                className="group relative bg-white rounded-3xl p-7 border-2 border-[#E5E7EB] hover:border-[#2563EB] shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#004AC6] text-xs font-bold border border-blue-200">
                      Option 1 · Consumer Experience
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Active Tour Loaded
                    </span>
                  </div>

                  {/* Profile Header */}
                  <div className="flex items-center gap-4">
                    <img
                      src={USER_AVATAR}
                      alt="Sarah Mehta"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-100 shadow-xs shrink-0"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-[#111827] group-hover:text-[#004AC6] transition-colors">
                        Sarah Mehta
                      </h2>
                      <div className="text-xs text-[#6B7280]">
                        sarah.mehta@concierge.tripflow.io
                      </div>
                      <div className="text-[11px] font-semibold text-[#004AC6] mt-0.5">
                        Concierge Elite Member
                      </div>
                    </div>
                  </div>

                  {/* Feature bullet list */}
                  <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-[#374151]">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-base shrink-0 mt-0.5">
                        luggage
                      </span>
                      <span>
                        <strong>Living Itinerary:</strong> Kerala 6-Day Luxury Circuit (Kochi, Munnar, Alleppey)
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-base shrink-0 mt-0.5">
                        lock
                      </span>
                      <span>
                        <strong>Travel Vault:</strong> 12 offline encrypted passes (Passports, Visas, Flight AI-682, Hotel Vouchers)
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-amber-600 text-base shrink-0 mt-0.5">
                        airline_stops
                      </span>
                      <span>
                        <strong>Live Telemetry:</strong> Autonomous flight delay cascade with Chauffeur Rajesh K.
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-purple-600 text-base shrink-0 mt-0.5">
                        support_agent
                      </span>
                      <span>
                        <strong>24/7 Concierge:</strong> Instant WhatsApp access to regional master Arun V.
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md group-hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Opening Portal...</span>
                    </>
                  ) : (
                    <>
                      <span>Log In as Traveller</span>
                      <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Option 2: Operator Persona */}
              <div
                onClick={() => !isLoading && handleSelectPersona('operator')}
                className="group relative bg-white rounded-3xl p-7 border-2 border-[#E5E7EB] hover:border-emerald-600 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                      Option 2 · Operations Command
                    </span>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      Radar Controller
                    </span>
                  </div>

                  {/* Profile Header */}
                  <div className="flex items-center gap-4">
                    <img
                      src={ALEX_DISPATCH_AVATAR}
                      alt="Alex Vance"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-100 shadow-xs shrink-0"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-[#111827] group-hover:text-emerald-700 transition-colors">
                        Alex Vance
                      </h2>
                      <div className="text-xs text-[#6B7280]">
                        alex.vance@ops.tripflow.io
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                        Chief Dispatch Controller
                      </div>
                    </div>
                  </div>

                  {/* Feature bullet list */}
                  <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-[#374151]">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-base shrink-0 mt-0.5">
                        radar
                      </span>
                      <span>
                        <strong>Fleet Radar:</strong> 7 active vehicles tracked live in Kerala, Rajasthan & Delhi
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-rose-600 text-base shrink-0 mt-0.5">
                        bolt
                      </span>
                      <span>
                        <strong>Cascade Solver:</strong> AI-assisted ripple effect solver for flight & weather delays
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-base shrink-0 mt-0.5">
                        verified
                      </span>
                      <span>
                        <strong>Traveler Manifest:</strong> Guest vault compliance & document verification audit
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-amber-600 text-base shrink-0 mt-0.5">
                        hub
                      </span>
                      <span>
                        <strong>Live Dispatch:</strong> 1-click chauffeur re-routing and hotel arrival re-sequencing
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-full bg-[#111827] hover:bg-[#1F2937] text-white text-xs font-bold transition-all shadow-md group-hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Launching Ops Hub...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm text-emerald-400">
                        hub
                      </span>
                      <span>Log In as Operator</span>
                      <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Custom Credentials Form */
            <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-[#E5E7EB] shadow-xl">
              <form onSubmit={handleCustomSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1.5">
                    Select Role Option
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setCustomRole('traveler');
                        setCustomName('Sarah Mehta');
                        setCustomEmail('sarah.mehta@concierge.tripflow.io');
                      }}
                      className={`p-3 rounded-full border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        customRole === 'traveler'
                          ? 'border-[#2563EB] bg-[#F0F3FF] text-[#004AC6]'
                          : 'border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">person</span>
                      <span className="text-xs font-bold">Traveller</span>
                      <span className="text-[10px] text-[#6B7280]">Guest Portal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCustomRole('operator');
                        setCustomName('Alex Vance');
                        setCustomEmail('alex.vance@ops.tripflow.io');
                      }}
                      className={`p-3 rounded-full border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        customRole === 'operator'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">hub</span>
                      <span className="text-xs font-bold">Operator</span>
                      <span className="text-[10px] text-[#6B7280]">Dispatch Hub</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-[#F9FAFB] text-[#111827]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={e => setCustomEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-[#F9FAFB] text-[#111827]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={customPassword}
                    onChange={e => setCustomPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-[#F9FAFB] text-[#111827]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue as {customRole === 'traveler' ? 'Traveller' : 'Operator'}</span>
                        <span className="material-symbols-outlined text-sm">login</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Secure Guarantee Note */}
          <div className="text-center text-xs text-[#6B7280]">
            🔒 All dummy credentials are pre-configured. No real authentication credentials needed.
          </div>
        </div>
      </main>
    </div>
  );
};
