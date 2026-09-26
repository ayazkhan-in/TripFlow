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

// Tree items under Bookings showing all flight/train, stay, and transfer bookings
const BOOKINGS_TREE_NAV: NavItem[] = [
  { id: 'flight_bookings', label: 'Flights & Rail', icon: 'flight' },
  { id: 'stay_bookings', label: 'Hotels & Stays', icon: 'hotel' },
  { id: 'transfer_bookings', label: 'Transfers & Cabs', icon: 'directions_car' },
  { id: 'activity_bookings', label: 'Tours & Activities', icon: 'explore' },
];

const OTHER_OPERATIONS_NAV: NavItem[] = [
  { id: 'vendors', label: 'Vendors & Supply', icon: 'domain' },
  { id: 'cohorts', label: 'Tour Cohorts', icon: 'groups' },
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
  onSignOut,
}) => {
  const [isBookingsExpanded, setIsBookingsExpanded] = useState<boolean>(true);

  // Normalize legacy tab aliases
  const currentTab: OperatorTab =
    activeTab === 'overview' || activeTab === 'operations'
      ? 'hub'
      : activeTab === 'tours'
      ? 'cohorts'
      : activeTab === 'customers'
      ? 'bookings'
      : activeTab;

  const isBookingsChildActive =
    currentTab === 'flight_bookings' ||
    currentTab === 'stay_bookings' ||
    currentTab === 'transfer_bookings' ||
    currentTab === 'activity_bookings';

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col justify-between p-4 z-40 bg-white border-r border-slate-200 shadow-xs select-none">
      <div className="flex flex-col gap-3">
        {/* Brand & Hub Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-semibold text-sm shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[18px]">hub</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 tracking-tight truncate max-w-[130px]">
                  {user?.agencyName || 'TripFlow Ops'}
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
          </div>
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
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs active:scale-[0.99] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_business</span>
            <span>Create Tour Package</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-0.5 pt-1 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar">
          {/* 1. Operator Hub */}
          <button
            type="button"
            onClick={() => onTabChange('hub')}
            className={`w-full text-left transition-all duration-150 cursor-pointer px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 ${
              currentTab === 'hub'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[18px] shrink-0 ${
                currentTab === 'hub' ? 'text-white' : 'text-slate-400'
              }`}
            >
              hub
            </span>
            <span className="truncate">Operator Hub</span>
          </button>

          {/* 2. Tour Packages & Creator Studio */}
          <button
            type="button"
            onClick={() => onTabChange('packages')}
            className={`w-full text-left transition-all duration-150 cursor-pointer px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
              currentTab === 'packages'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`material-symbols-outlined text-[18px] shrink-0 ${
                  currentTab === 'packages' ? 'text-white' : 'text-blue-600'
                }`}
              >
                card_travel
              </span>
              <span className="truncate">Tour Packages (Creator)</span>
            </div>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                currentTab === 'packages'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700'
              }`}
            >
              Studio
            </span>
          </button>

          {/* 3. Package Bookings (Separate page showing people who booked packages) */}
          <button
            type="button"
            onClick={() => onTabChange('bookings')}
            className={`w-full text-left transition-all duration-150 cursor-pointer px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
              currentTab === 'bookings'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`material-symbols-outlined text-[18px] shrink-0 ${
                  currentTab === 'bookings' ? 'text-white' : 'text-slate-400'
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
          </button>

          {/* 3. Expandable Tree Bookings Section (Component Bookings: Flights, Stays, Transfers, Activities) */}
          <div className="pt-0.5">
            <button
              type="button"
              onClick={() => setIsBookingsExpanded(prev => !prev)}
              className={`w-full text-left transition-all duration-150 cursor-pointer px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                isBookingsChildActive
                  ? 'text-slate-900 font-semibold bg-slate-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`material-symbols-outlined text-[18px] shrink-0 ${
                    isBookingsChildActive ? 'text-blue-600' : 'text-slate-400'
                  }`}
                >
                  calendar_today
                </span>
                <span className="truncate">Bookings</span>
              </div>
              <span
                className={`material-symbols-outlined text-sm text-slate-400 transition-transform duration-200 ${
                  isBookingsExpanded ? 'rotate-0' : '-rotate-90'
                }`}
              >
                expand_less
              </span>
            </button>

            {/* Tree Branch Submenu */}
            {isBookingsExpanded && (
              <div className="pl-6 ml-3.5 space-y-0.5 mt-0.5 relative animate-in fade-in duration-150">
                {BOOKINGS_TREE_NAV.map((subItem, index) => {
                  const isSubActive = currentTab === subItem.id;
                  const isLast = index === BOOKINGS_TREE_NAV.length - 1;

                  return (
                    <div key={subItem.id} className="relative flex items-center">
                      {/* Tree Branch Connector Hook (curved guide line) */}
                      <div className="absolute -left-[17px] top-0 bottom-1/2 w-3.5 border-l border-b border-slate-200 rounded-bl-md pointer-events-none" />
                      
                      {/* Vertical line continuation down to subsequent items */}
                      {!isLast && (
                        <div className="absolute -left-[17px] top-1/2 bottom-0 border-l border-slate-200 pointer-events-none" />
                      )}

                      <button
                        type="button"
                        onClick={() => onTabChange(subItem.id)}
                        className={`w-full text-left transition-all duration-150 cursor-pointer px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2.5 ${
                          isSubActive
                            ? 'bg-slate-900 text-white font-semibold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-[16px] shrink-0 ${
                            isSubActive ? 'text-white' : 'text-slate-400'
                          }`}
                        >
                          {subItem.icon}
                        </span>
                        <span className="truncate">{subItem.label}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Other Operations Navigation Items */}
          {OTHER_OPERATIONS_NAV.map(item => {
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full text-left transition-all duration-150 cursor-pointer px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[18px] shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer / Profile Row */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/60">
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
            {onSwitchMode && (
              <button
                onClick={() => onSwitchMode('consumer')}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
                title="Switch to Traveler View"
              >
                <span className="material-symbols-outlined text-sm">swap_horiz</span>
              </button>
            )}
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
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
