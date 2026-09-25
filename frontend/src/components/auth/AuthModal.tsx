import React, { useState } from 'react';
import { USER_AVATAR, ALEX_DISPATCH_AVATAR } from '../../data/mockData';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'traveler' | 'operator';
  avatar: string;
  membership: string;
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
  const [activeTab, setActiveTab] = useState<'quick' | 'email'>('quick');
  const [email, setEmail] = useState('sarah.mehta@concierge.tripflow.io');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<'traveler' | 'operator'>(defaultRole);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickLogin = (role: 'traveler' | 'operator') => {
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
      onClose();
    }, 400);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === 'traveler') {
        onLogin({
          id: 'user-custom-traveler',
          name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Sarah Mehta',
          email,
          role: 'traveler',
          avatar: USER_AVATAR,
          membership: 'Concierge Member',
        });
      } else {
        onLogin({
          id: 'user-custom-operator',
          name: 'Alex Vance',
          email,
          role: 'operator',
          avatar: ALEX_DISPATCH_AVATAR,
          membership: 'Dispatch Controller',
        });
      }
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#F0F3FF] p-6 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-xl">flight_takeoff</span>
            </span>
            <div>
              <h2 className="text-base font-bold text-[#004AC6] tracking-tight">
                TripFlow Portal
              </h2>
              <p className="text-xs text-[#737686]">
                Access your living travel itinerary or dispatch hub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-[#737686] hover:bg-white/80 hover:text-[#151c27] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E5E7EB] bg-gray-50/70 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === 'quick'
                ? 'bg-white text-[#004AC6] shadow-xs'
                : 'text-[#737686] hover:text-[#151c27]'
            }`}
          >
            ⚡ Quick Demo Access
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === 'email'
                ? 'bg-white text-[#004AC6] shadow-xs'
                : 'text-[#737686] hover:text-[#151c27]'
            }`}
          >
            ✉️ Sign In / Dummy Auth
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'quick' ? (
            <div className="space-y-4">
              <div className="text-xs text-[#737686] mb-1">
                Choose a verified persona to experience TripFlow instantly without setup:
              </div>

              {/* Persona 1: Sarah Mehta (Traveler) */}
              <div
                onClick={() => handleQuickLogin('traveler')}
                className="group p-4 rounded-xl border border-[#E5E7EB] hover:border-[#2563EB] bg-[#F7F8FA] hover:bg-[#F0F3FF] transition-all cursor-pointer flex items-center gap-3.5 shadow-xs"
              >
                <img
                  src={USER_AVATAR}
                  alt="Sarah Mehta"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-2xs shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#151c27] group-hover:text-[#004AC6] transition-colors">
                      Sarah Mehta
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E0E7FF] text-[#3730A3]">
                      Traveler
                    </span>
                  </div>
                  <p className="text-xs text-[#737686] truncate">
                    Active tour: Kerala Escape · Flight AI-682
                  </p>
                  <p className="text-[11px] text-[#2563EB] font-medium mt-0.5 flex items-center gap-1">
                    <span>Enter Concierge Experience</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </p>
                </div>
              </div>

              {/* Persona 2: Alex Vance (Dispatch Operator) */}
              <div
                onClick={() => handleQuickLogin('operator')}
                className="group p-4 rounded-xl border border-[#E5E7EB] hover:border-[#2563EB] bg-[#F7F8FA] hover:bg-[#F0F3FF] transition-all cursor-pointer flex items-center gap-3.5 shadow-xs"
              >
                <img
                  src={ALEX_DISPATCH_AVATAR}
                  alt="Alex Vance"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-2xs shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#151c27] group-hover:text-[#004AC6] transition-colors">
                      Alex Vance
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Operator
                    </span>
                  </div>
                  <p className="text-xs text-[#737686] truncate">
                    Dispatch Controller · 7 Active Fleet Radar
                  </p>
                  <p className="text-[11px] text-[#2563EB] font-medium mt-0.5 flex items-center gap-1">
                    <span>Enter Operations Command Hub</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#151c27] mb-1.5">
                  Select Role Persona
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('traveler');
                      setEmail('sarah.mehta@concierge.tripflow.io');
                    }}
                    className={`py-2 px-3 text-xs font-semibold rounded-full border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedRole === 'traveler'
                        ? 'border-[#2563EB] bg-[#F0F3FF] text-[#004AC6]'
                        : 'border-[#E5E7EB] text-[#737686] hover:bg-gray-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">person</span>
                    <span>Traveler</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('operator');
                      setEmail('alex.vance@ops.tripflow.io');
                    }}
                    className={`py-2 px-3 text-xs font-semibold rounded-full border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedRole === 'operator'
                        ? 'border-[#2563EB] bg-[#F0F3FF] text-[#004AC6]'
                        : 'border-[#E5E7EB] text-[#737686] hover:bg-gray-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">hub</span>
                    <span>Operations Hub</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#151c27] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined text-[#737686] text-base absolute left-3 top-2.5">
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@domain.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-[#151c27] bg-[#F7F8FA]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#151c27] mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined text-[#737686] text-base absolute left-3 top-2.5">
                    lock
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-[#151c27] bg-[#F7F8FA]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#737686]">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#2563EB]" />
                  <span>Remember session</span>
                </label>
                <span className="text-[#2563EB] cursor-pointer hover:underline">
                  Dummy auth active
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to TripFlow</span>
                    <span className="material-symbols-outlined text-sm">login</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info note */}
        <div className="px-6 py-3 bg-[#F7F8FA] border-t border-[#E5E7EB] text-[11px] text-[#737686] text-center">
          <span className="font-semibold text-[#004AC6]">Notice:</span> Dummy credentials enabled. Click any persona or enter mock credentials to proceed.
        </div>
      </div>
    </div>
  );
};
