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
      <button
        onClick={() => onTabChange('home')}
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
      </button>

      <button
        onClick={() => onTabChange('discover')}
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
      </button>

      <button
        onClick={() => onTabChange('builder')}
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
      </button>

      <button
        onClick={() => onTabChange('trips')}
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
      </button>

      <button
        onClick={() => onTabChange('vault')}
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
      </button>
    </nav>
  );
};
