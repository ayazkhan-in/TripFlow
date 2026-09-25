import React, { useEffect, useState } from 'react';
import { ConsumerTab, ViewMode } from '../../types/travel';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateConsumer: (tab: ConsumerTab) => void;
  onNavigateOperator: (tourId?: string) => void;
  onSwitchMode: (mode: ViewMode) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateConsumer,
  onNavigateOperator,
  onSwitchMode,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    {
      id: 'active-trip',
      title: 'Kerala Escape — Active Journey (Day 2 of 6)',
      type: 'Itinerary',
      icon: 'near_me',
      action: () => {
        onSwitchMode('consumer');
        onNavigateConsumer('trips');
        onClose();
      },
    },
    {
      id: 'travel-vault',
      title: 'Travel Vault — Encrypted Passes, Passports, Tickets & Vouchers (12 items)',
      type: 'Security & Wallet',
      icon: 'lock',
      action: () => {
        onSwitchMode('consumer');
        onNavigateConsumer('vault');
        onClose();
      },
    },
    {
      id: 'scan-document',
      title: 'Scan Document with Camera — Optical OCR & AI Classification',
      type: 'AI Vision & Scanner',
      icon: 'document_scanner',
      action: () => {
        onSwitchMode('consumer');
        onNavigateConsumer('vault');
        onClose();
      },
    },
    {
      id: 'ops-hub',
      title: 'Tour Operations Command Hub (3 Alerts)',
      type: 'Operator Workspace',
      icon: 'hub',
      action: () => {
        onSwitchMode('operator');
        onNavigateOperator();
        onClose();
      },
    },
    {
      id: 'tour-1024',
      title: 'Tour #1024 — IndiGo 6E-204 (+5h Disruption & Cascade)',
      type: 'Incident Resolution',
      icon: 'warning',
      action: () => {
        onSwitchMode('operator');
        onNavigateOperator('issue-1024');
        onClose();
      },
    },
    {
      id: 'discover',
      title: 'Discover & Plan — Adaptive Travel Intelligence',
      type: 'Planning',
      icon: 'explore',
      action: () => {
        onSwitchMode('consumer');
        onNavigateConsumer('discover');
        onClose();
      },
    },
    {
      id: 'home',
      title: 'Consumer Home Dashboard (Sarah Mehta)',
      type: 'Dashboard',
      icon: 'home',
      action: () => {
        onSwitchMode('consumer');
        onNavigateConsumer('home');
        onClose();
      },
    },
    {
      id: 'kerala-preset',
      title: 'Kerala Backwaters & Tea Hills — ₹28,000 Preset',
      type: 'Curated Destination',
      icon: 'landscape',
      action: () => {
        onSwitchMode('consumer');
        onNavigateConsumer('discover');
        onClose();
      },
    },
    {
      id: 'rajasthan',
      title: 'Rajasthan Royal Heritage — Jaipur to Udaipur',
      type: 'Saved Journey',
      icon: 'castle',
      action: () => {
        onSwitchMode('consumer');
        onNavigateConsumer('home');
        onClose();
      },
    },
    {
      id: 'bali',
      title: 'Bali Cultural Retreat — Ubud to Seminyak',
      type: 'Saved Journey',
      icon: 'beach_access',
      action: () => {
        onSwitchMode('consumer');
        onNavigateConsumer('home');
        onClose();
      },
    },
  ];

  const filtered = items.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <span className="material-symbols-outlined text-[#737686] text-xl mr-3">
            search
          </span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tours, flights, destinations, or operators..."
            className="w-full bg-transparent border-0 p-0 text-sm text-[#151c27] focus:ring-0 focus:outline-none placeholder-[#737686]"
          />
          <kbd className="px-2 py-0.5 text-[11px] font-mono text-[#737686] bg-white border border-[#E5E7EB] rounded shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 custom-scrollbar space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#737686] text-xs">
              No matching destinations, tours, or commands found for "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center justify-between p-2.5 rounded-full hover:bg-[#F0F3FF] text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E7EEFE] group-hover:bg-[#DBE1FF] text-[#004AC6] flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-base">
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#151c27] group-hover:text-[#004AC6] transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-[#737686]">{item.type}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#C3C6D7] group-hover:text-[#004AC6] text-sm transition-colors">
                  arrow_forward
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#737686]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>TripFlow Linear Command Engine v2.4</span>
        </div>
      </div>
    </div>
  );
};
