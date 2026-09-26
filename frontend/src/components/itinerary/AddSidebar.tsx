import React, { useState, useMemo, useEffect } from 'react';
import { CATALOG_ITEMS } from '../../data/itineraryData';
import { CatalogItem, ItineraryCategory } from '../../types/itinerary';
import { clearDragPayload, setDragPayload } from '../../utils/dragDropState';
import { formatCurrency } from '../../utils/pricing';
import { TripFlowApi } from '../../services/api';

interface AddSidebarProps {
  onAddItem: (item: CatalogItem, targetDayNumber: number) => void;
  activeDayNumber: number;
  totalDays: number;
  onOpenCustomItemModal: () => void;
  onSelectItemForDetail?: (item: CatalogItem) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const CATEGORY_TABS: Array<{ id: ItineraryCategory | 'all'; label: string; icon: string }> = [
  { id: 'all', label: 'All', icon: 'grid_view' },
  { id: 'activity', label: 'Activities', icon: 'attractions' },
  { id: 'hotel', label: 'Hotels', icon: 'hotel' },
  { id: 'transport', label: 'Transport', icon: 'directions_transit' },
  { id: 'meal', label: 'Meals', icon: 'restaurant' },
  { id: 'experience', label: 'Experiences', icon: 'auto_awesome' },
];

export const AddSidebar: React.FC<AddSidebarProps> = ({
  onAddItem,
  activeDayNumber,
  totalDays,
  onOpenCustomItemModal,
  onSelectItemForDetail,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(CATALOG_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<ItineraryCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDayForAdd, setSelectedDayForAdd] = useState<number>(activeDayNumber || 1);

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
      setSelectedDayForAdd(activeDayNumber);
    }
  }, [activeDayNumber]);

  const filteredItems = useMemo(() => {
    return catalogItems.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [catalogItems, selectedCategory, searchQuery]);

  const handleDragStart = (e: React.DragEvent, item: CatalogItem) => {
    const payload = { type: 'catalog-item' as const, item };
    setDragPayload(payload);
    e.dataTransfer.setData('text/plain', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    clearDragPayload();
  };

  if (isCollapsed) {
    return (
      <aside className="w-10 bg-[#FBFBFA] border-r border-neutral-200/80 flex flex-col items-center py-3 shrink-0 select-none">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="w-7 h-7 rounded flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 cursor-pointer"
          title="Expand sidebar"
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-68 lg:w-72 bg-[#FBFBFA] border-r border-neutral-200/80 flex flex-col shrink-0 h-full max-h-full min-h-0 overflow-hidden select-none">
      {/* Top Bar */}
      <div className="px-3 py-2.5 border-b border-neutral-200/70 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-neutral-500 text-sm">library_add</span>
          <span className="text-xs font-semibold text-neutral-700">Add to Trip</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenCustomItemModal}
            className="text-[11px] font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50 px-2 py-0.5 rounded cursor-pointer transition-colors"
          >
            + Custom
          </button>
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-neutral-700 rounded cursor-pointer"
              title="Collapse"
            >
              <span className="material-symbols-outlined text-xs">chevron_left</span>
            </button>
          )}
        </div>
      </div>

      {/* Target Day Selector */}
      <div className="px-3 py-1.5 bg-neutral-100/50 border-b border-neutral-200/60 flex items-center justify-between shrink-0">
        <span className="text-[11px] text-neutral-500 font-medium">Add to:</span>
        <select
          value={selectedDayForAdd}
          onChange={e => setSelectedDayForAdd(Number(e.target.value))}
          className="text-xs font-medium text-neutral-800 bg-white border border-neutral-200 rounded px-2 py-0.5 focus:outline-none cursor-pointer"
        >
          {Array.from({ length: totalDays }, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>
              Day {num}
            </option>
          ))}
        </select>
      </div>

      {/* Search Input */}
      <div className="p-2 border-b border-neutral-200/60 shrink-0">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2 top-1.5 text-neutral-400 text-xs">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full text-xs pl-6 pr-2 py-1 rounded-md bg-white border border-neutral-200 placeholder:text-neutral-400 text-neutral-800 focus:outline-none focus:border-neutral-400"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-2 py-1.5 border-b border-neutral-200/60 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
        {CATEGORY_TABS.map(tab => {
          const isSelected = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium shrink-0 cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Scrollable Items Container */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
        {filteredItems.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-400">No matching items</div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              draggable
              onDragStart={e => handleDragStart(e, item)}
              onDragEnd={handleDragEnd}
              onClick={() => onSelectItemForDetail && onSelectItemForDetail(item)}
              className="group bg-white border border-neutral-200/70 hover:border-neutral-300 hover:bg-neutral-50/60 rounded-lg p-2.5 transition-all cursor-grab active:cursor-grabbing flex flex-col gap-1.5 select-none"
            >
              {/* Top Row: Title + Add Button */}
              <div className="flex items-start justify-between gap-1.5">
                <h5 className="text-xs font-semibold text-neutral-800 leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h5>

                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onAddItem(item, selectedDayForAdd);
                  }}
                  className="w-5 h-5 rounded flex items-center justify-center text-neutral-400 hover:text-white hover:bg-blue-600 opacity-60 group-hover:opacity-100 transition-all cursor-pointer shrink-0"
                  title={`Add to Day ${selectedDayForAdd}`}
                >
                  <span className="material-symbols-outlined text-xs">add</span>
                </button>
              </div>

              {/* Bottom Row: Category & Duration on Left, Price in the BOTTOM-RIGHT Corner */}
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-neutral-100">
                <div className="flex items-center gap-1.5 text-neutral-400 text-[10px]">
                  <span className="capitalize">{item.category}</span>
                  <span>•</span>
                  <span>{item.duration}</span>
                </div>

                {/* Price strictly in the bottom-right corner */}
                <span className="text-xs font-bold text-neutral-900 bg-neutral-100/80 px-1.5 py-0.2 rounded">
                  {formatCurrency(item.price)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};
