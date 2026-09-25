import React from 'react';
import { USER_AVATAR } from '../../data/mockData';
import { ViewMode } from '../../types/travel';

interface ProfileScreenProps {
  onSwitchMode: (mode: ViewMode) => void;
  onOpenPreferences: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onSwitchMode,
  onOpenPreferences,
}) => {
  return (
    <div className="w-full max-w-[900px] mx-auto px-4 sm:px-6 py-8 md:py-10 pb-24 md:pb-12 text-left space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-[#C3C6D7] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={USER_AVATAR}
              alt="Sarah Mehta"
              className="w-16 h-16 rounded-full object-cover ring-4 ring-[#EFF6FF]"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#151c27]">Sarah Mehta</h1>
              <span className="px-2 py-0.5 rounded-full bg-[#DBE1FF] text-[#00174B] text-[11px] font-bold">
                Elite Tier
              </span>
            </div>
            <p className="text-xs text-[#575E70] mt-0.5">
              Concierge Member since 2023 · Mumbai, India
            </p>
            <p className="font-mono text-xs text-[#737686] mt-0.5">
              +91 99203 11840 · sarah.mehta@traveler.com
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPreferences}
            className="px-4 py-2 rounded-full border border-[#C3C6D7] text-xs font-semibold hover:bg-[#F0F3FF] text-[#151c27] transition-colors cursor-pointer"
          >
            Preferences
          </button>
          <button
            onClick={() => onSwitchMode('operator')}
            className="px-4 py-2 rounded-full bg-[#2563EB] hover:bg-[#004AC6] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Switch to Dispatch
          </button>
        </div>
      </div>

      {/* Concierge Perks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-[#C3C6D7] space-y-1">
          <div className="flex items-center gap-2 text-[#004AC6]">
            <span className="material-symbols-outlined text-base">support_agent</span>
            <span className="text-xs font-bold">Dedicated Concierge</span>
          </div>
          <p className="text-xs text-[#575E70]">
            Arun V. is assigned to your account with 24/7 priority dispatch and
            instant WhatsApp access.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#C3C6D7] space-y-1">
          <div className="flex items-center gap-2 text-[#004AC6]">
            <span className="material-symbols-outlined text-base">sync</span>
            <span className="text-xs font-bold">Live Flight Mesh</span>
          </div>
          <p className="text-xs text-[#575E70]">
            Automated schedule reconciliation with zero disruption latency for your
            air travel and transfers.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#C3C6D7] space-y-1">
          <div className="flex items-center gap-2 text-[#004AC6]">
            <span className="material-symbols-outlined text-base">spa</span>
            <span className="text-xs font-bold">Dietary & Luxury Guarantee</span>
          </div>
          <p className="text-xs text-[#575E70]">
            Strict vegetarian culinary curation and pre-verified boutique properties
            across all domestic circuits.
          </p>
        </div>
      </div>
    </div>
  );
};
