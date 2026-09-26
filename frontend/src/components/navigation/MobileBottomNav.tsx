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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg flex justify-around items-center px-4 py-2 border-t border-[#E5E7EB]">
      <a
        href="/home"
        onClick={e => {
          e.preventDefault();
          onTabChange('home');
        }}
        className={`flex flex-col items-center gap-0.5 py-1 transition-colors cursor-pointer ${
          activeTab === 'home' ? 'text-[#004AC6]' : 'text-[#737686] hover:text-[#151c27]'
        }`}
      >
        <span
          className="material-symbols-outlined text-xl"
          style={activeTab === 'home' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          home
        </span>
        <span className="text-[10px] font-semibold">Home</span>
      </a>

      <a
        href="/discover"
        onClick={e => {
          e.preventDefault();
          onTabChange('discover');
        }}
        className={`flex flex-col items-center gap-0.5 py-1 transition-colors cursor-pointer ${
          activeTab === 'discover' ? 'text-[#004AC6]' : 'text-[#737686] hover:text-[#151c27]'
        }`}
      >
        <span
          className="material-symbols-outlined text-xl"
          style={activeTab === 'discover' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          explore
        </span>
        <span className="text-[10px] font-semibold">Discover</span>
      </a>

      <a
        href="/story"
        onClick={e => {
          e.preventDefault();
          onTabChange('story');
        }}
        className={`flex flex-col items-center gap-0.5 py-1 transition-colors cursor-pointer ${
          activeTab === 'story' ? 'text-[#004AC6]' : 'text-[#737686] hover:text-[#151c27]'
        }`}
      >
        <span
          className="material-symbols-outlined text-xl"
          style={activeTab === 'story' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          play_circle
        </span>
        <span className="text-[10px] font-semibold">Story</span>
      </a>

      <a
        href="/assistant"
        onClick={e => {
          e.preventDefault();
          onTabChange('assistant');
        }}
        className={`flex flex-col items-center gap-0.5 py-1 transition-colors cursor-pointer ${
          activeTab === 'assistant' ? 'text-[#004AC6]' : 'text-[#737686] hover:text-[#151c27]'
        }`}
      >
        <span
          className="material-symbols-outlined text-xl"
          style={activeTab === 'assistant' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          auto_awesome
        </span>
        <span className="text-[10px] font-semibold">Assistant</span>
      </a>

      <a
        href="/builder"
        onClick={e => {
          e.preventDefault();
          onTabChange('builder');
        }}
        className={`flex flex-col items-center gap-0.5 py-1 transition-colors cursor-pointer ${
          activeTab === 'builder' ? 'text-[#004AC6]' : 'text-[#737686] hover:text-[#151c27]'
        }`}
      >
        <span
          className="material-symbols-outlined text-xl"
          style={activeTab === 'builder' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          dashboard_customize
        </span>
        <span className="text-[10px] font-semibold">Builder</span>
      </a>

      <a
        href="/trips"
        onClick={e => {
          e.preventDefault();
          onTabChange('trips');
        }}
        className={`flex flex-col items-center gap-0.5 py-1 transition-colors cursor-pointer ${
          isTripsActive ? 'text-[#004AC6]' : 'text-[#737686] hover:text-[#151c27]'
        }`}
      >
        <span
          className="material-symbols-outlined text-xl"
          style={isTripsActive ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          luggage
        </span>
        <span className="text-[10px] font-semibold">Trips</span>
      </a>

      <a
        href="/vault"
        onClick={e => {
          e.preventDefault();
          onTabChange('vault');
        }}
        className={`flex flex-col items-center gap-0.5 py-1 transition-colors cursor-pointer ${
          activeTab === 'vault' ? 'text-[#004AC6]' : 'text-[#737686] hover:text-[#151c27]'
        }`}
      >
        <span
          className="material-symbols-outlined text-xl"
          style={activeTab === 'vault' ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          lock
        </span>
        <span className="text-[10px] font-semibold">Vault</span>
      </a>
    </nav>
  );
};
