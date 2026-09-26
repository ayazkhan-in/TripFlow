import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CATALOG_ITEMS } from '../../data/itineraryData';
import { CatalogItem, ItineraryCategory } from '../../types/itinerary';
import { CATEGORY_CONFIG, formatCurrency } from '../../utils/pricing';
import { TripFlowApi } from '../../services/api';

interface AddBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: CatalogItem, targetDayNumber: number) => void;
  activeDayNumber: number;
  totalDays: number;
  onOpenCustomItemModal: () => void;
}

export const AddBottomSheet: React.FC<AddBottomSheetProps> = ({
  isOpen,
  onClose,
  onAddItem,
  activeDayNumber,
  totalDays,
  onOpenCustomItemModal,
}) => {
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(CATALOG_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<ItineraryCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [targetDay, setTargetDay] = useState(activeDayNumber || 1);

  useEffect(() => {
    TripFlowApi.getCatalogItems().then(items => {
      if (items && items.length > 0) {
        setCatalogItems(items.map((it: any) => ({
          ...it,
          price: Number(it.price || 0),
          rating: Number(it.rating || 4.9),
        })));
      }
    });
  }, []);

  React.useEffect(() => {
    if (activeDayNumber) {
      setTargetDay(activeDayNumber);
    }
  }, [activeDayNumber]);

  const categories: Array<{ id: ItineraryCategory | 'all'; label: string; icon: string }> = [
    { id: 'all', label: 'All', icon: 'grid_view' },
    { id: 'activity', label: 'Activities', icon: 'attractions' },
    { id: 'hotel', label: 'Hotels', icon: 'hotel' },
    { id: 'transport', label: 'Transport', icon: 'directions_transit' },
    { id: 'meal', label: 'Meals', icon: 'restaurant' },
    { id: 'experience', label: 'Experiences', icon: 'magic_button' },
  ];

  const filteredItems = useMemo(() => {
    return catalogItems.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [catalogItems, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop tap to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Sheet Container */}
      <motion.div
        initial={{ y: '100%', opacity: 0, filter: 'blur(8px)' }}
        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl border-t border-slate-200"
      >
        {/* Drag handle pill */}
        <div className="pt-3 pb-2 flex justify-center cursor-grab" onClick={onClose}>
          <div className="w-12 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Sheet Header */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-base">add_circle</span>
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Add to Itinerary</h3>
              <p className="text-[11px] text-slate-400">Tap + to add instantly</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCustomItemModal();
              }}
              className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg cursor-pointer"
            >
              + Custom
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        {/* Target Day Selector */}
        <div className="px-4 py-2 bg-slate-50 flex items-center justify-between border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-600">Add directly to:</span>
          <select
            value={targetDay}
            onChange={e => setTargetDay(Number(e.target.value))}
            className="text-xs font-bold text-blue-600 bg-white border border-slate-200 rounded-lg px-3 py-1 shadow-2xs focus:outline-none"
          >
            {Array.from({ length: totalDays }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>
                Day {num}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-100">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-sm">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search experiences..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 focus:outline-none focus:bg-white focus:border-blue-500"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <span className="material-symbols-outlined text-xs">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.35,
                delay: idx * 0.04,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="bg-white border border-neutral-200/80 hover:bg-neutral-50/50 rounded-lg p-2.5 flex items-center justify-between gap-2.5"
            >
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-medium text-neutral-800 truncate">{item.title}</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mt-0.5">
                  <span className="capitalize">{item.category}</span>
                  <span>•</span>
                  <span>{item.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-neutral-800">
                  {formatCurrency(item.price)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onAddItem(item, targetDay);
                    onClose();
                  }}
                  className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                  title={`Add to Day ${targetDay}`}
                >
                  <span className="material-symbols-outlined text-xs">add</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
