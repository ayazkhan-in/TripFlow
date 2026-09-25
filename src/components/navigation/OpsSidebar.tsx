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

export const OpsSidebar: React.FC<OpsSidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenNewDispatch,
  onSwitchMode,
  openIssuesCount = 7,
  onGoToLanding,
  onSignOut,
}) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col justify-between p-4 z-40 bg-white border-r border-[#E5E7EB] shadow-xs select-none">
      <div className="flex flex-col gap-5">
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
                ></span>
              </div>
              <p className="text-[11px] text-[#575e70] leading-none mt-0.5 font-medium">
                Dispatch Controller
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action CTA */}
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

        {/* Primary Navigation Tabs */}
        <nav className="flex flex-col gap-1">
          <p className="px-2 text-[10px] text-[#737686] uppercase tracking-wider font-semibold mb-1">
            Ecosystem
          </p>

          {/* Overview */}
          <button
            onClick={() => onTabChange('overview')}
            className={`flex items-center justify-between px-3.5 py-2 rounded-full font-medium text-xs transition-colors duration-150 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#F0F3FF] text-[#004AC6] font-semibold'
                : 'text-[#434655] hover:bg-[#F3F4F6] hover:text-[#111827]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px]">
                dashboard
              </span>
              <span>Overview</span>
            </div>
            {openIssuesCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[#BA1A1A] text-white font-bold font-mono">
                {openIssuesCount}
              </span>
            )}
          </button>

          {/* Tours */}
          <button
            onClick={() => onTabChange('tours')}
            className={`flex items-center justify-between px-3.5 py-2 rounded-full font-medium text-xs transition-colors duration-150 cursor-pointer ${
              activeTab === 'tours'
                ? 'bg-[#F0F3FF] text-[#004AC6] font-semibold'
                : 'text-[#434655] hover:bg-[#F3F4F6] hover:text-[#111827]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px]">
                flight_takeoff
              </span>
              <span>Tours</span>
            </div>
            <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[#E5E7EB] text-[#111827] font-mono font-medium">
              128
            </span>
          </button>

          {/* Operations */}
          <button
            onClick={() => onTabChange('operations')}
            className={`flex items-center gap-3 px-3.5 py-2 rounded-full font-medium text-xs transition-colors duration-150 cursor-pointer ${
              activeTab === 'operations'
                ? 'bg-[#F0F3FF] text-[#004AC6] font-semibold'
                : 'text-[#434655] hover:bg-[#F3F4F6] hover:text-[#111827]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">hub</span>
            <span>Operations</span>
          </button>

          {/* Customers */}
          <button
            onClick={() => onTabChange('customers')}
            className={`flex items-center gap-3 px-3.5 py-2 rounded-full font-medium text-xs transition-colors duration-150 cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-[#F0F3FF] text-[#004AC6] font-semibold'
                : 'text-[#434655] hover:bg-[#F3F4F6] hover:text-[#111827]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">groups</span>
            <span>Customers</span>
          </button>

          {/* Vendors */}
          <button
            onClick={() => onTabChange('vendors')}
            className={`flex items-center gap-3 px-3.5 py-2 rounded-full font-medium text-xs transition-colors duration-150 cursor-pointer ${
              activeTab === 'vendors'
                ? 'bg-[#F0F3FF] text-[#004AC6] font-semibold'
                : 'text-[#434655] hover:bg-[#F3F4F6] hover:text-[#111827]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">handshake</span>
            <span>Vendors</span>
          </button>
        </nav>
      </div>

      {/* Sidebar Footer / Diagnostics & Profile */}
      <div className="flex flex-col gap-2.5 pt-3 border-t border-[#E5E7EB]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg text-[#434655] text-xs">
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

          <button
            onClick={() => onTabChange('operations')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[#434655] hover:bg-[#F3F4F6] text-xs transition-colors cursor-pointer text-left"
          >
            <span className="material-symbols-outlined text-[16px]">settings</span>
            <span>Settings</span>
          </button>
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
            className="w-full text-center text-[11px] text-[#434655] hover:text-[#004AC6] font-medium py-1 transition-colors cursor-pointer"
          >
            ← Back to Landing Page
          </button>
        )}
      </div>
    </aside>
  );
};
