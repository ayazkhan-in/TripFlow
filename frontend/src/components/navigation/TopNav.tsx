import React, { useState, useRef, useEffect } from 'react';
import { ConsumerTab } from '../../types/travel';
import { USER_AVATAR } from '../../data/mockData';
import { AuthUser } from '../auth/AuthModal';

interface TopNavProps {
  activeTab: ConsumerTab;
  onTabChange: (tab: ConsumerTab) => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
  user?: AuthUser | null;
  onOpenProfile?: () => void;
  onSignOut?: () => void;
  onGoToLanding?: () => void;
  vaultCount?: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onTabChange,
  onOpenNotifications,
  unreadCount = 1,
  user,
  onOpenProfile,
  onSignOut,
  onGoToLanding,
  vaultCount = 0,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = user?.name || 'Traveler';
  const userAvatar = user?.avatar || USER_AVATAR;
  const userMembership = user?.membership || 'Concierge Member';

  const handleProfileClick = () => {
    setIsProfileMenuOpen(false);
    if (onOpenProfile) {
      onOpenProfile();
    } else {
      onTabChange('profile');
    }
  };

  return (
    <header className="relative bg-white border-b border-[#E5E7EB] shadow-xs flex justify-between items-center w-full px-4 sm:px-6 h-14 sticky top-0 z-40 max-w-full">
      {/* Brand Anchor on Left */}
      <div className="flex items-center shrink-0">
        <a
          href="/"
          onClick={e => {
            e.preventDefault();
            if (onGoToLanding) {
              onGoToLanding();
            } else {
              onTabChange('home');
            }
          }}
          className="flex items-center gap-2.5 text-left cursor-pointer group focus:outline-none"
          title="Bookit — Click to view Landing / Home"
        >
          <img
            src="/bookit.png"
            alt="Bookit"
            className="w-8 h-8 rounded-lg object-contain shadow-xs group-hover:scale-105 transition-transform"
          />
          <span className="text-[18px] font-bold text-[#004AC6] tracking-tight">
            Bookit
          </span>
        </a>
      </div>

      {/* Navigation Tabs Centered in Topbar (Flow: Home -> Discover -> Builder -> Trips & Bookings -> Vault) */}
      <nav className="hidden md:flex items-center gap-4 lg:gap-6 absolute left-1/2 -translate-x-1/2">
        <a
          href="/home"
          onClick={e => {
            e.preventDefault();
            onTabChange('home');
          }}
          className={`font-medium text-xs py-2 transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none active:outline-none ${
            activeTab === 'home'
              ? 'text-[#004AC6] font-semibold'
              : 'text-[#434655] hover:text-[#151c27]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">home</span>
          <span>Home</span>
        </a>

        <a
          href="/discover"
          onClick={e => {
            e.preventDefault();
            onTabChange('discover');
          }}
          className={`font-medium text-xs py-2 transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none active:outline-none ${
            activeTab === 'discover'
              ? 'text-[#004AC6] font-semibold'
              : 'text-[#434655] hover:text-[#151c27]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">explore</span>
          <span>Discover</span>
        </a>

        <a
          href="/story"
          onClick={e => {
            e.preventDefault();
            onTabChange('story');
          }}
          className={`font-medium text-xs py-2 transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none active:outline-none ${
            activeTab === 'story'
              ? 'text-[#004AC6] font-semibold'
              : 'text-[#434655] hover:text-[#151c27]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">play_circle</span>
          <span>Story</span>
        </a>

        <a
          href="/assistant"
          onClick={e => {
            e.preventDefault();
            onTabChange('assistant');
          }}
          className={`font-medium text-xs py-2 transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none active:outline-none ${
            activeTab === 'assistant'
              ? 'text-[#004AC6] font-semibold'
              : 'text-[#434655] hover:text-[#151c27]'
          }`}
        >
          <span className="material-symbols-outlined text-sm text-indigo-600">auto_awesome</span>
          <span>AI Assistant</span>
        </a>

        <a
          href="/builder"
          onClick={e => {
            e.preventDefault();
            onTabChange('builder');
          }}
          className={`font-medium text-xs py-2 transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none active:outline-none ${
            activeTab === 'builder'
              ? 'text-[#004AC6] font-semibold'
              : 'text-[#434655] hover:text-[#151c27]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">dashboard_customize</span>
          <span>Itinerary Builder</span>
        </a>

        <a
          href="/trips"
          onClick={e => {
            e.preventDefault();
            onTabChange('trips');
          }}
          className={`font-medium text-xs py-2 transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none active:outline-none ${
            activeTab === 'trips' || activeTab === 'bookings'
              ? 'text-[#004AC6] font-semibold'
              : 'text-[#434655] hover:text-[#151c27]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">luggage</span>
          <span>Trips & Bookings</span>
        </a>

        <a
          href="/vault"
          onClick={e => {
            e.preventDefault();
            onTabChange('vault');
          }}
          className={`font-medium text-xs py-2 transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none active:outline-none ${
            activeTab === 'vault'
              ? 'text-[#004AC6] font-semibold'
              : 'text-[#434655] hover:text-[#151c27]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">lock</span>
          <span>Vault</span>
        </a>
      </nav>

      {/* Trailing Cluster: Notifications + Profile Icon & Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Action Utility Icons */}
        <div className="flex items-center gap-1 pr-1">
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full text-[#434655] hover:bg-[#F0F3FF] transition-colors cursor-pointer"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-lg">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#2563EB] rounded-full ring-2 ring-white"></span>
            )}
          </button>
        </div>

        {/* User Profile Avatar Pill & Dropdown (Direct Access to Profile) */}
        <div className="relative" ref={menuRef}>
          <div
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 pl-2 border-l border-[#E5E7EB] cursor-pointer group"
            title="Click to view Traveler Profile"
          >
            <div className="relative">
              <img
                alt={userName}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#C3C6D7]/60 group-hover:ring-[#2563EB] transition-all"
                src={userAvatar}
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs text-[#151c27] font-semibold leading-tight">
                {userName}
              </span>
              <span className="text-[10px] text-[#737686] leading-none mt-0.5">
                {userMembership}
              </span>
            </div>
            <span className="material-symbols-outlined text-[#737686] text-sm hidden sm:block">
              expand_more
            </span>
          </div>

          {/* Profile Menu Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
              <div
                onClick={handleProfileClick}
                className="px-4 py-2.5 border-b border-gray-100 hover:bg-[#F8FAFF] cursor-pointer transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-[#111827]">{userName}</div>
                  <div className="text-[11px] text-[#6B7280] truncate">
                    {user?.email || 'traveler@tripflow.io'}
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#004AC6] border border-blue-200">
                  Profile
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={handleProfileClick}
                  className="w-full px-4 py-2 text-left text-xs text-[#374151] hover:bg-[#F0F3FF] hover:text-[#004AC6] flex items-center gap-2.5 cursor-pointer font-medium"
                >
                  <span className="material-symbols-outlined text-base text-[#2563EB]">account_circle</span>
                  <span>Open Full Traveler Profile</span>
                </button>

                <a
                  href="/trips"
                  onClick={e => {
                    e.preventDefault();
                    setIsProfileMenuOpen(false);
                    onTabChange('trips');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-[#374151] hover:bg-[#F0F3FF] hover:text-[#004AC6] flex items-center gap-2.5 cursor-pointer font-medium"
                >
                  <span className="material-symbols-outlined text-base text-[#737686]">luggage</span>
                  <span>Active Circuit & Bookings</span>
                </a>

                <a
                  href="/vault"
                  onClick={e => {
                    e.preventDefault();
                    setIsProfileMenuOpen(false);
                    onTabChange('vault');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-[#374151] hover:bg-[#F0F3FF] hover:text-[#004AC6] flex items-center gap-2.5 cursor-pointer font-medium"
                >
                  <span className="material-symbols-outlined text-base text-[#737686]">lock</span>
                  <span>Travel Vault ({vaultCount} Document{vaultCount === 1 ? '' : 's'})</span>
                </a>

                {onGoToLanding && (
                  <a
                    href="/"
                    onClick={e => {
                      e.preventDefault();
                      setIsProfileMenuOpen(false);
                      onGoToLanding();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-[#374151] hover:bg-[#F0F3FF] hover:text-[#004AC6] flex items-center gap-2.5 cursor-pointer font-medium"
                  >
                    <span className="material-symbols-outlined text-base text-[#737686]">home</span>
                    <span>Bookit Landing Page</span>
                  </a>
                )}
              </div>

              {onSignOut && (
                <div className="border-t border-gray-100 pt-1 mt-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onSignOut();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer font-medium"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
