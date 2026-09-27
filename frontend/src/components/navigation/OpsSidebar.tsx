import React, { useState } from 'react';
import { OperatorTab, ViewMode } from '../../types/travel';
import { ALEX_DISPATCH_AVATAR } from '../../data/mockData';

import { AuthUser } from '../auth/AuthModal';

interface OpsSidebarProps {
  user?: AuthUser | null;
  activeTab: OperatorTab;
  onTabChange: (tab: OperatorTab) => void;
  onOpenNewDispatch: () => void;
  onOpenCreatePackage?: () => void;
  onSwitchMode: (mode: ViewMode) => void;
  openIssuesCount?: number;
  pendingCustomizedCount?: number;
  onGoToLanding?: () => void;
  onSignOut?: () => void;
}

interface NavItem {
  id: OperatorTab;
  label: string;
  icon: string;
}

// Tree items under Bookings showing all flight/train, stay, transfer bookings, and vendors & supply
const BOOKINGS_TREE_NAV: NavItem[] = [
  { id: 'flight_bookings', label: 'Flights & Rail', icon: 'flight' },
  { id: 'stay_bookings', label: 'Hotels & Stays', icon: 'hotel' },
  { id: 'transfer_bookings', label: 'Transfers & Cabs', icon: 'directions_car' },
  { id: 'activity_bookings', label: 'Tours & Activities', icon: 'explore' },
  { id: 'vendors', label: 'Vendors & Supply', icon: 'domain' },
];

const OTHER_OPERATIONS_NAV: NavItem[] = [
  { id: 'guides', label: 'Guides & Staff', icon: 'shield_person' },
  { id: 'alerts', label: 'Itinerary Alerts', icon: 'warning' },
  { id: 'payments', label: 'Payments Ledger', icon: 'credit_card' },
  { id: 'calendar', label: 'Global Calendar', icon: 'calendar_month' },
];

export const OpsSidebar: React.FC<OpsSidebarProps> = ({
  user,
  activeTab,
  onTabChange,
  onOpenNewDispatch,
  onOpenCreatePackage,
  onSwitchMode,
  pendingCustomizedCount,
  onGoToLanding,
  onSignOut,
}) => {
  const [isBookingsExpanded, setIsBookingsExpanded] = useState<boolean>(true);

  // Normalize legacy tab aliases
  const currentTab: OperatorTab =
    activeTab === 'overview' || activeTab === 'operations'
      ? 'hub'
      : activeTab === 'tours'
      ? 'hub'
      : activeTab === 'customers'
      ? 'bookings'
      : activeTab;

  const isBookingsChildActive =
    currentTab === 'flight_bookings' ||
    currentTab === 'stay_bookings' ||
    currentTab === 'transfer_bookings' ||
    currentTab === 'activity_bookings' ||
    currentTab === 'vendors';

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col justify-between p-4 z-40 bg-white border-r border-slate-100 shadow-[1px_0_12px_rgba(0,0,0,0.03)] select-none">
      <div className="flex flex-col gap-3 min-h-0">
        {/* Brand & Hub Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 px-1">
          <a
            href="/"
            onClick={e => {
              e.preventDefault();
              if (onGoToLanding) {
                onGoToLanding();
              } else {
                onTabChange('hub');
              }
            }}
            className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer group focus:outline-none"
            title="Bookit Ops Hub — Click to view Landing"
          >
            <img
              src="/bookit.png"
              alt="Bookit Ops"
              className="w-8 h-8 rounded-lg object-contain shadow-xs shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 tracking-tight truncate max-w-[130px]">
                  {user?.agencyName || 'Bookit Ops'}
                </span>
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
                  title="System Live"
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-none mt-0.5 font-medium truncate max-w-[140px]">
                {user?.agencyCode ? `${user.agencyCode} • Controller` : 'Dispatch Controller'}
              </p>
            </div>
          </a>
        </div>

        {/* Primary Action Button */}
        <div>
          <button
            type="button"
            onClick={() => {
              if (onOpenCreatePackage) {
                onOpenCreatePackage();
              }
              onTabChange('packages');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs active:scale-[0.99] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_business</span>
            <span>Create Tour Package</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 pt-1 overflow-y-auto max-h-[calc(100vh-215px)] custom-scrollbar pr-0.5">
          {/* 1. Operator Hub */}
          <a
            href="/operator"
            onClick={e => {
              e.preventDefault();
              onTabChange('hub');
            }}
            className={`w-full text-left transition-all duration-150 cursor-pointer px-3.5 py-2.5 rounded-2xl text-sm flex items-center gap-3 group ${
              currentTab === 'hub'
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] shrink-0 transition-colors ${
                currentTab === 'hub' ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
              }`}
            >
              hub
            </span>
            <span className="truncate">Overview</span>
          </a>

          {/* 1b. Digital Twin & Weather Simulation (HackCelestial Enhancement) */}
          <a
            href="/operator/digital-twin"
            onClick={e => {
              e.preventDefault();
              onTabChange('digital_twin');
            }}
            className={`w-full text-left transition-all duration-150 cursor-pointer px-3.5 py-2.5 rounded-2xl text-sm flex items-center justify-between group ${
              currentTab === 'digital_twin'
                ? 'bg-blue-50 text-blue-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`material-symbols-outlined text-[20px] shrink-0 transition-colors ${
                  currentTab === 'digital_twin' ? 'text-blue-600' : 'text-blue-500 group-hover:text-blue-700'
                }`}
              >
                model_training
              </span>
              <span className="truncate">Digital Twin</span>
            </div>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-colors ${
                currentTab === 'digital_twin'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-700 group-hover:bg-blue-200'
              }`}
            >
              AI Twin
            </span>
          </a>

          {/* 2. Tour Packages & Creator Studio */}
          <a
            href="/operator/packages"
            onClick={e => {
              e.preventDefault();
              onTabChange('packages');
            }}
            className={`w-full text-left transition-all duration-150 cursor-pointer px-3.5 py-2.5 rounded-2xl text-sm flex items-center justify-between group ${
              currentTab === 'packages'
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`material-symbols-outlined text-[20px] shrink-0 transition-colors ${
                  currentTab === 'packages' ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                }`}
              >
                card_travel
              </span>
              <span className="truncate">Tour Packages</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                currentTab === 'packages'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
              }`}
            >
              Studio
            </span>
          </a>

          {/* 3. Package Bookings */}
          <a
            href="/operator/bookings"
            onClick={e => {
              e.preventDefault();
              onTabChange('bookings');
            }}
            className={`w-full text-left transition-all duration-150 cursor-pointer px-3.5 py-2.5 rounded-2xl text-sm flex items-center justify-between group ${
              currentTab === 'bookings'
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`material-symbols-outlined text-[20px] shrink-0 transition-colors ${
                  currentTab === 'bookings' ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                }`}
              >
                receipt_long
              </span>
              <span className="truncate">Package Bookings</span>
            </div>
            {pendingCustomizedCount !== undefined && pendingCustomizedCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shrink-0 animate-pulse">
                {pendingCustomizedCount}
              </span>
            )}
          </a>

          {/* 4. Expandable Tree Bookings Section */}
          <div>
            <button
              type="button"
              onClick={() => setIsBookingsExpanded(prev => !prev)}
              className={`w-full text-left transition-all duration-150 cursor-pointer px-3.5 py-2.5 rounded-2xl text-sm flex items-center justify-between group ${
                isBookingsChildActive
                  ? 'text-blue-600 font-semibold bg-blue-50/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`material-symbols-outlined text-[20px] shrink-0 transition-colors ${
                    isBookingsChildActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                  }`}
                >
                  calendar_today
                </span>
                <span className="truncate">Bookings</span>
              </div>
              <span
                className={`material-symbols-outlined text-base transition-transform duration-200 ${
                  isBookingsChildActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                } ${
                  isBookingsExpanded ? 'rotate-0' : '-rotate-90'
                }`}
              >
                expand_less
              </span>
            </button>

            {/* Tree Branch Submenu */}
            {isBookingsExpanded && (
              <div className="pl-6 ml-4 space-y-1 mt-1 relative animate-in fade-in duration-150">
                {BOOKINGS_TREE_NAV.map((subItem, index) => {
                  const isSubActive = currentTab === subItem.id;
                  const isLast = index === BOOKINGS_TREE_NAV.length - 1;
                  const subHref =
                    subItem.id === 'flight_bookings'
                      ? '/operator/bookings/flights'
                      : subItem.id === 'stay_bookings'
                      ? '/operator/bookings/stays'
                      : subItem.id === 'transfer_bookings'
                      ? '/operator/bookings/transfers'
                      : subItem.id === 'activity_bookings'
                      ? '/operator/bookings/activities'
                      : '/operator/vendors';

                  return (
                    <div key={subItem.id} className="relative flex items-center">
                      {/* Tree Branch Connector Hook (curved guide line) */}
                      <div className="absolute -left-[18px] top-0 bottom-1/2 w-3.5 border-l border-b border-slate-200 rounded-bl-md pointer-events-none" />
                      
                      {/* Vertical line continuation down to subsequent items */}
                      {!isLast && (
                        <div className="absolute -left-[18px] top-1/2 bottom-0 border-l border-slate-200 pointer-events-none" />
                      )}

                      <a
                        href={subHref}
                        onClick={e => {
                          e.preventDefault();
                          onTabChange(subItem.id);
                        }}
                        className={`w-full text-left transition-all duration-150 cursor-pointer px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 group ${
                          isSubActive
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-[17px] shrink-0 transition-colors ${
                            isSubActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        >
                          {subItem.icon}
                        </span>
                        <span className="truncate">{subItem.label}</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. Other Operations Navigation Items (Vendors, Guides, Alerts, Payments, Calendar) */}
          {OTHER_OPERATIONS_NAV.map(item => {
            const isActive = currentTab === item.id;
            const itemHref = `/operator/${item.id}`;

            return (
              <a
                key={item.id}
                href={itemHref}
                onClick={e => {
                  e.preventDefault();
                  onTabChange(item.id);
                }}
                className={`w-full text-left transition-all duration-150 cursor-pointer px-3.5 py-2.5 rounded-2xl text-sm flex items-center gap-3 group ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] shrink-0 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer / Profile Row */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50/80 border border-slate-200/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              alt={user?.name || 'Alex Vance'}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
              src={user?.avatar || ALEX_DISPATCH_AVATAR}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-900 leading-tight truncate">
                {user?.name || 'Alex Vance'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate">
                {user?.agencyName || user?.membership || 'Dispatch Controller'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {onGoToLanding && (
              <a
                href="/"
                onClick={e => {
                  e.preventDefault();
                  onGoToLanding();
                }}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer flex items-center justify-center rounded-lg hover:bg-white"
                title="Bookit Landing Page"
              >
                <span className="material-symbols-outlined text-sm">home</span>
              </a>
            )}
            {onSwitchMode && (
              <button
                onClick={() => onSwitchMode('consumer')}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer rounded-lg hover:bg-white"
                title="Switch to Traveler View"
              >
                <span className="material-symbols-outlined text-sm">swap_horiz</span>
              </button>
            )}
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer rounded-lg hover:bg-white"
                title="Sign Out"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
