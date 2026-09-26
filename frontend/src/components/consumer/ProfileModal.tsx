import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { USER_AVATAR, CONCIERGE_AVATAR } from '../../data/mockData';
import { ViewMode } from '../../types/travel';
import { AuthUser } from '../auth/AuthModal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: AuthUser | null;
  onSwitchMode: (mode: ViewMode) => void;
  onOpenPreferences: () => void;
  onOpenVault: () => void;
  onOpenWhatsApp: () => void;
  onSignOut?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSwitchMode,
  onOpenPreferences,
  onOpenVault,
  onOpenWhatsApp,
  onSignOut,
}) => {
  const userName = user?.name || 'Sarah Mehta';
  const userAvatar = user?.avatar || USER_AVATAR;
  const userEmail = user?.email || 'sarah.mehta@concierge.tripflow.io';
  const userMembership = user?.membership || 'Concierge Elite Member';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, y: 16, filter: 'blur(8px)' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl max-w-xl w-full max-h-[90dvh] overflow-y-auto shadow-2xl border border-[#E5E7EB] text-left"
            onClick={e => e.stopPropagation()}
          >
        {/* Header with Close */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-sm font-bold text-[#151c27] uppercase tracking-wider">
              Traveler Profile & Concierge Hub
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0F3FF] hover:bg-[#E2E8F8] text-[#575E70] hover:text-[#151c27] flex items-center justify-center transition-colors cursor-pointer"
            title="Close Profile"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Hero Identity */}
          <div className="bg-gradient-to-br from-[#F8FAFF] via-white to-[#EFF6FF] rounded-2xl border border-[#DBEAFE] p-5 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-[#2563EB]/20 shadow-sm"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-lg font-bold text-[#151c27]">{userName}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#2563EB] text-white text-[10px] font-bold tracking-wide uppercase shadow-2xs">
                    Elite Tier
                  </span>
                </div>
                <p className="text-xs text-[#575E70] mt-0.5">{userMembership}</p>
                <p className="font-mono text-xs text-[#737686] mt-0.5">{userEmail}</p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenPreferences();
              }}
              className="px-3.5 py-1.5 rounded-full border border-[#C3C6D7] text-xs font-semibold hover:bg-white text-[#151c27] transition-all shadow-2xs cursor-pointer shrink-0"
            >
              Edit Preferences
            </button>
          </div>

          {/* Active Status Badge */}
          <div className="p-4 rounded-xl bg-[#F0FDF4] border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-600 text-xl">
                luggage
              </span>
              <div>
                <span className="text-xs font-bold text-emerald-900">
                  Active Circuit: Kerala Escape
                </span>
                <p className="text-[11px] text-emerald-700">
                  Day 2 of 6 · Old Harbour Hotel, Fort Kochi · Ref #KL-9402
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold bg-white text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
              Live Mesh
            </span>
          </div>

          {/* Assigned Dedicated Concierge */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-mono font-bold text-[#737686]">
                Assigned Private Concierge
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                Online & Synced
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={CONCIERGE_AVATAR}
                  alt="Concierge Arun V."
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#004AC6]/20"
                />
                <div>
                  <div className="text-xs font-bold text-[#151c27]">Arun V.</div>
                  <div className="text-[11px] text-[#575E70]">
                    Chief Guest Experience Specialist
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenWhatsApp();
                }}
                className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                <span>Message</span>
              </button>
            </div>
          </div>

          {/* Travel Vault Quick Shortcut */}
          <div className="p-4 rounded-xl bg-[#F0F3FF] border border-[#BFDBFE] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-base">lock</span>
              </span>
              <div>
                <span className="text-xs font-bold text-[#151c27]">Travel Vault</span>
                <p className="text-[11px] text-[#575E70]">
                  12 verified documents & offline flight boarding passes ready.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenVault();
              }}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-[#D1D5DB] text-xs font-bold text-[#151c27] shadow-xs cursor-pointer shrink-0"
            >
              Open Vault
            </button>
          </div>

          {/* Concierge Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-1">
              <span className="material-symbols-outlined text-[#2563EB] text-base">
                flight_takeoff
              </span>
              <div className="text-xs font-bold text-[#151c27]">Live Flight Mesh</div>
              <p className="text-[11px] text-[#6B7280]">
                Zero-delay auto-reconciliation for all airline legs.
              </p>
            </div>
            <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-1">
              <span className="material-symbols-outlined text-[#2563EB] text-base">
                restaurant
              </span>
              <div className="text-xs font-bold text-[#151c27]">Strict Dietary</div>
              <p className="text-[11px] text-[#6B7280]">
                Pure vegetarian menu verified across every property.
              </p>
            </div>
            <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-1">
              <span className="material-symbols-outlined text-[#2563EB] text-base">
                directions_car
              </span>
              <div className="text-xs font-bold text-[#151c27]">Dedicated EV / SUV</div>
              <p className="text-[11px] text-[#6B7280]">
                Uniformed chauffeur with real-time GPS telemetry.
              </p>
            </div>
          </div>

          {/* Action Row: Switch to Dispatch or Sign Out */}
          <div className="pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => {
                onClose();
                onSwitchMode('operator');
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">hub</span>
              <span>Switch to Operations Dispatch</span>
            </button>

            {onSignOut && (
              <button
                onClick={() => {
                  onClose();
                  onSignOut();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
