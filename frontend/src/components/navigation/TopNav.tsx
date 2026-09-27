import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Compass,
  PlayCircle,
  Sparkles,
  Route,
  Briefcase,
  ShieldCheck,
  Bell,
  ChevronDown,
  User,
  LogOut,
  ExternalLink,
} from 'lucide-react';
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

interface NavItem {
  id: ConsumerTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'story', label: 'Story', icon: PlayCircle },
  { id: 'assistant', label: 'AI Assistant', icon: Sparkles },
  { id: 'builder', label: 'Itinerary Builder', icon: Route },
  { id: 'trips', label: 'Trips & Bookings', icon: Briefcase },
  { id: 'vault', label: 'Vault', icon: ShieldCheck },
];

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

  const isTabActive = (tabId: ConsumerTab) => {
    if (tabId === 'trips') {
      return activeTab === 'trips' || activeTab === 'bookings';
    }
    return activeTab === tabId;
  };

  return (
    <header className="relative bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-xs flex justify-between items-center w-full px-4 sm:px-6 h-14 pt-[env(safe-area-inset-top,0px)] sticky top-0 z-40 max-w-full select-none">
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

      {/* Navigation Tabs Centered in Topbar with Low-Opacity Blue Rectangle Click Effect */}
      <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100/75 border border-slate-200/80 rounded-xl absolute left-1/2 -translate-x-1/2 shadow-2xs">
        {NAV_ITEMS.map(item => {
          const active = isTabActive(item.id);
          const Icon = item.icon;
          const displayCount = item.id === 'vault' && vaultCount > 0 ? vaultCount : null;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 flex items-center gap-1.5 select-none focus:outline-none cursor-pointer active:scale-95 ${
                active
                  ? 'text-[#004AC6] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {/* Selected Low-Opacity Blue Rectangle following the system theme */}
              {active && (
                <motion.div
                  layoutId="travelerTopNavActive"
                  className="absolute inset-0 bg-[#004AC6]/10 border border-[#004AC6]/20 rounded-lg pointer-events-none"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}

              <Icon
                className={`w-3.5 h-3.5 relative z-10 transition-colors ${
                  active ? 'text-[#004AC6]' : 'text-slate-500'
                }`}
              />
              <span className="relative z-10">{item.label}</span>

              {displayCount !== null && (
                <span
                  className={`relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                    active
                      ? 'bg-[#004AC6]/20 text-[#004AC6]'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {displayCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Trailing Cluster: Notifications + Profile Icon & Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Action Utility Icons */}
        <div className="flex items-center gap-1 pr-1">
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95 focus:outline-none"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2563EB] rounded-full ring-2 ring-white"></span>
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
            <ChevronDown className="w-3.5 h-3.5 text-[#737686] hidden sm:block group-hover:text-slate-900 transition-colors" />
          </div>

          {/* Profile Menu Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-[#E5E7EB] py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
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
                  <User className="w-4 h-4 text-[#2563EB]" />
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
                  <Briefcase className="w-4 h-4 text-[#737686]" />
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
                  <ShieldCheck className="w-4 h-4 text-[#737686]" />
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
                    <ExternalLink className="w-4 h-4 text-[#737686]" />
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
                    <LogOut className="w-4 h-4 text-rose-500" />
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
