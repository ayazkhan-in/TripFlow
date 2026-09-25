import React from 'react';
import { OperatorTab, ViewMode } from '../../types/travel';
import { ALEX_DISPATCH_AVATAR } from '../../data/mockData';

interface OpsSidebarProps {
  activeTab: OperatorTab;
  onTabChange: (tab: OperatorTab) => void;
  onOpenNewDispatch: () => void;
  onSwitchMode: (mode: ViewMode) => void;
  openIssuesCount?: number;
  onGoToLanding?: () => void;
  onSignOut?: () => void;
}

interface NavItem {
  id: OperatorTab;
  label: string;
  icon: string;
}

const TOUR_OPERATIONS_NAV: NavItem[] = [
  { id: 'hub', label: 'Operator Hub', icon: 'hub' },
  { id: 'bookings', label: 'Bookings & Inventory', icon: 'confirmation_number' },
  { id: 'vendors', label: 'Vendors & Supply', icon: 'domain' },
  { id: 'cohorts', label: 'Tour Cohorts', icon: 'groups' },
  { id: 'guides', label: 'Tour Guides/Staff', icon: 'shield_person' },
  { id: 'alerts', label: 'Itinerary Alerts', icon: 'warning' },
  { id: 'payments', label: 'Payments Ledger', icon: 'credit_card' },
  { id: 'calendar', label: 'Global Calendar', icon: 'calendar_month' },
];

export const OpsSidebar: React.FC<OpsSidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenNewDispatch,
  onSwitchMode,
  onGoToLanding,
  onSignOut,
}) => {
  // Normalize legacy tab aliases
  const currentTab: OperatorTab =
    activeTab === 'overview' || activeTab === 'operations'
      ? 'hub'
      : activeTab === 'tours'
      ? 'cohorts'
      : activeTab === 'customers'
      ? 'bookings'
      : activeTab;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col justify-between p-4 z-40 bg-white border-r border-[#E5E7EB] shadow-xs select-none">
      <div className="flex flex-col gap-4">
        {/* Brand & Hub Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-semibold text-sm shadow-xs">
              <span className="material-symbols-outlined text-[18px]">hub</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#111827] tracking-tight">
                  TripFlow Ops
                </span>
                <span
                  className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                  title="System Live"
                />
              </div>
              <p className="text-[11px] text-[#575e70] leading-none mt-0.5 font-medium">
                Dispatch Controller
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="space-y-1.5">
          <button
            onClick={onOpenNewDispatch}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-[#004AC6] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs active:scale-[0.99] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>New Dispatch</span>
          </button>

          {/* Switch back to Traveler Mode */}
          <button
            onClick={() => onSwitchMode('consumer')}
            className="w-full flex items-center justify-between py-1.5 px-3 rounded-full bg-[#F0F3FF] hover:bg-[#DBE1FF] text-[#004AC6] border border-[#C3C6D7]/60 text-[11px] font-medium transition-colors cursor-pointer"
            title="Switch to Sarah Mehta's Concierge App"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">person</span>
              <span>Traveler View</span>
            </div>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-[#004AC6] font-mono">
              Sarah M.
            </span>
          </button>
        </div>

        {/* TOUR OPERATIONS Navigation Section (Matching User Reference Exactly!) */}
        <nav className="flex flex-col gap-1 pt-1">
          {/* Section Header: 🛍️ TOUR OPERATIONS */}
          <div className="px-3.5 py-1.5 flex items-center gap-2 text-[#7C3AED] font-black text-xs uppercase tracking-wider">
            <span className="text-sm select-none">🛍️</span>
            <span>TOUR OPERATIONS</span>
          </div>

          {/* Navigation Items */}
          <div className="space-y-0.5">
            {TOUR_OPERATIONS_NAV.map(item => {
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full text-left transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-black text-white px-3.5 py-2.5 rounded-full flex items-center justify-between font-semibold text-xs shadow-xs'
                      : 'text-[#434655] hover:text-[#111827] hover:bg-[#F3F4F6] px-3.5 py-2.5 rounded-full text-xs font-medium flex items-center gap-3'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`material-symbols-outlined text-[18px] shrink-0 ${
                        isActive ? 'text-white' : 'text-[#737686]'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {/* Active state white dot indicator (as in user screenshot) */}
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-white shrink-0 mr-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Sidebar Footer / Diagnostics & Profile */}
      <div className="flex flex-col gap-2.5 pt-3 border-t border-[#E5E7EB]">
        <div className="flex items-center justify-between px-2 py-1 text-[#434655] text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">
              pulse_alert
            </span>
            <span>System Health</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-mono font-medium">
            99.98%
          </span>
        </div>

        {/* Alex Controller Profile Row */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
          <div className="flex items-center gap-2.5">
            <img
              alt="Alex Vance"
              className="w-8 h-8 rounded-full object-cover border border-[#D1D5DB]"
              src={ALEX_DISPATCH_AVATAR}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[#111827] leading-tight truncate">
                Alex Vance
              </span>
              <span className="text-[10px] text-[#6B7280] font-mono">
                ID: OP-4092
              </span>
            </div>
          </div>
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="text-[#9CA3AF] hover:text-rose-600 transition-colors p-1 cursor-pointer"
              title="Sign Out"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
            </button>
          )}
        </div>

        {onGoToLanding && (
          <button
            onClick={onGoToLanding}
            className="w-full text-center text-[11px] text-[#434655] hover:text-[#004AC6] font-medium py-0.5 transition-colors cursor-pointer"
          >
            ← Back to Landing Page
          </button>
        )}
      </div>
    </aside>
  );
};
