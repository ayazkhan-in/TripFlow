import React from 'react';
import { ConsumerTab } from '../../types/travel';

interface MobileBottomNavProps {
  activeTab: ConsumerTab;
  onTabChange: (tab: ConsumerTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const isTripsActive = activeTab === 'trips' || activeTab === 'bookings';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-between px-1 sm:px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] border-t border-[#E5E7EB] select-none touch-manipulation">
      <a
        href="/home"
        onClick={e => {
          e.preventDefault();
          onTabChange('home');
        }}
        className={`flex-1 min-w-0 flex flex-col items-center gap-0.5 py-1 px-0.5 transition-transform active:scale-95 cursor-pointer ${
          activeTab === 'home' ? 'text-[#004AC6]' : 'text-[#737686] hover:text-[#151c27]'
        }`}
      >
        <span
          className="material-symbols-outlined text-xl"
          style={activeTab === 'home' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          home
        </span>
        <span className="text-[9px] sm:text-[10px] font-semibold truncate max-w-full">Home</span>
      </a>

      <a
        href="/discover"
        onClick={e => {
          e.preventDefault();
          onTabChange('discover');
        }}
        className={`flex-1 min-w-0 flex flex-col items-center gap-0.5 py-1 px-0.5 transition-transform active:scale-95 cursor-pointer ${
          activeTab === 'discover' ? 'text-[#004AC6]' : 'text-[#737686] hover:text-[#151c27]'
        }`}
      >
        <span
          className="material-symbols-outlined text-xl"
          style={activeTab === 'discover' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          explore
        </span>
        <span className="text-[9px] sm:text-[10px] font-semibold truncate max-w-full">Discover</span>
      </a>

      <a
        href="/story"
        onClick={e => {
          e.preventDefault();
          onTabChange('story');
        }}
        className={`flex-1 min-w-0 flex flex-col items-center gap-0.5 py-1 px-0.5 transition-transform active:scale-95 cursor-pointer ${
          activeTab === 'story' ? 'text-[#004AC6]' : 'text-[#737686] hover:text-[#151c27]'
        }`}
      >
        <span
          className="material-symbols-outlined text-xl"
          style={activeTab === 'story' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          play_circle
        </span>
        <span className="text-[9px] sm:text-[10px] font-semibold truncate max-w-full">Story</span>
      </a>

      <a
        href="/assistant"
        onClick={e => {
          e.preventDefault();
          onTabChange('assistant');
        }}
        className={`flex-1 min-w-0 flex flex-col items-center gap-0.5 py-1 px-0.5 transition-transform active:scale-95 cursor-pointer ${
          activeTab === 'assistant' ? 'text-[#004AC6]' : 'text-[#737686] hover:text-[#151c27]'
        }`}
      >
        <span
          className="material-symbols-outlined text-xl"
          style={activeTab === 'assistant' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          auto_awesome
        </span>
        <span className="text-[9px] sm:text-[10px] font-semibold truncate max-w-full">AI Concierge</span>
      </a>

      <a
        href="/builder"
        onClick={e => {
          e.preventDefault();
          onTabChange('builder');
        }}
        className={`flex-1 min-w-0 flex flex-col items-center gap-0.5 py-1 px-0.5 transition-transform active:scale-95 cursor-pointer ${
          activeTab === 'builder' ? 'text-[#004AC6]' : 'text-[#737686] hover:text-[#151c27]'
        }`}
      >
        <span
          className="material-symbols-outlined text-xl"
          style={activeTab === 'builder' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          dashboard_customize
        </span>
        <span className="text-[9px] sm:text-[10px] font-semibold truncate max-w-full">Builder</span>
      </a>

      <a
        href="/trips"
        onClick={e => {
          e.preventDefault();
          onTabChange('trips');
        }}
        className={`flex-1 min-w-0 flex flex-col items-center gap-0.5 py-1 px-0.5 transition-transform active:scale-95 cursor-pointer ${
          isTripsActive ? 'text-[#004AC6]' : 'text-[#737686] hover:text-[#151c27]'
        }`}
      >
        <span
          className="material-symbols-outlined text-xl"
          style={isTripsActive ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          luggage
        </span>
        <span className="text-[9px] sm:text-[10px] font-semibold truncate max-w-full">Trips</span>
      </a>

      <a
        href="/vault"
        onClick={e => {
          e.preventDefault();
          onTabChange('vault');
        }}
        className={`flex-1 min-w-0 flex flex-col items-center gap-0.5 py-1 px-0.5 transition-transform active:scale-95 cursor-pointer ${
          activeTab === 'vault' ? 'text-[#004AC6]' : 'text-[#737686] hover:text-[#151c27]'
        }`}
      >
        <span
          className="material-symbols-outlined text-xl"
          style={activeTab === 'vault' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          lock
        </span>
        <span className="text-[9px] sm:text-[10px] font-semibold truncate max-w-full">Vault</span>
      </a>
    </nav>
  );
};
