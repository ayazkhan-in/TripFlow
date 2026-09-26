import React, { useState, useRef, useMemo } from 'react';
import { CatalogItem, ItineraryDay, ItineraryItem, PriceBreakdown, TripItinerary } from '../../types/itinerary';
import { clearDragPayload, getDragPayload, setDragPayload } from '../../utils/dragDropState';
import { formatCurrency } from '../../utils/pricing';
import { ItineraryCard } from './ItineraryCard';
import { TripHeroHeader } from './TripHeroHeader';

interface ItineraryBoardProps {
  itinerary: TripItinerary;
  pricing: PriceBreakdown;
  onUpdateItinerary: (updated: TripItinerary) => void;
  onAddItemToDay: (item: CatalogItem, dayNumber: number) => void;
  onRemoveItem: (dayNumber: number, itemId: string) => void;
  onMoveItem: (fromDayNumber: number, toDayNumber: number, itemId: string) => void;
  onReorderItems: (dayNumber: number, reorderedItems: ItineraryItem[]) => void;
  onAddDay: () => void;
  onDeleteDay: (dayNumber: number) => void;
  onDuplicateDay: (dayNumber: number) => void;
  onClearDay: (dayNumber: number) => void;
  onOpenAddModalForDay?: (dayNumber: number) => void;
  onSelectItemForDetail: (item: ItineraryItem, dayNumber: number) => void;
  activeDayNumber: number;
  setActiveDayNumber: (dayNumber: number) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onResetToDefault?: () => void;
  onShareItinerary?: () => void;
  onOpenBookingModal: () => void;
  onOpenAISuggestions?: () => void;
  onExportPDF?: () => void;
  onExportCSV?: () => void;
  onViewRouteMap?: () => void;
  onOpenAddDrawer?: () => void;
}

export const ItineraryBoard: React.FC<ItineraryBoardProps> = ({
  itinerary,
  onUpdateItinerary,
  onAddItemToDay,
  onRemoveItem,
  onMoveItem,
  onReorderItems,
  onAddDay,
  onDeleteDay,
  onOpenAddModalForDay,
  onSelectItemForDetail,
  activeDayNumber,
  setActiveDayNumber,
  onOpenBookingModal,
  onExportPDF,
  onExportCSV,
  onViewRouteMap,
  onOpenAddDrawer,
}) => {
  const [viewMode, setViewMode] = useState<'single' | 'board'>('single');
  const [dragOverDayNumber, setDragOverDayNumber] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const dragCounters = useRef<Record<number, number>>({});

  // Active Day object
  const currentDay = useMemo(() => {
    return itinerary.days.find(d => d.dayNumber === activeDayNumber) || itinerary.days[0] || {
      id: 'day-1',
      dayNumber: 1,
      date: 'Day 1',
      title: itinerary.destination || 'Arrival',
      subtitle: 'Personalized Day',
      items: [],
    };
  }, [itinerary.days, activeDayNumber]);

  const currentDayTotal = useMemo(() => {
    return currentDay.items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  }, [currentDay.items]);

  const activityCount = currentDay.items.filter(i => i.category !== 'hotel').length;
  const hotelCount = currentDay.items.filter(i => i.category === 'hotel').length;

  // Day Hero Image helper
  const dayHeroImage = useMemo(() => {
    const text = (currentDay.title + ' ' + (currentDay.subtitle || '') + ' ' + (itinerary.destination || '')).toLowerCase();
    if (text.includes('kerala') || text.includes('houseboat') || text.includes('backwater') || text.includes('cochin') || text.includes('arrival')) {
      return 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80';
    }
    if (text.includes('kyoto')) {
      return 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80';
    }
    if (text.includes('osaka')) {
      return 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1600&q=80';
    }
    return itinerary.heroImage || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80';
  }, [currentDay.title, currentDay.subtitle, itinerary.destination, itinerary.heroImage]);

  // Drag over day column / tab
  const handleDragEnter = (e: React.DragEvent, dayNumber: number) => {
    e.preventDefault();
    dragCounters.current[dayNumber] = (dragCounters.current[dayNumber] || 0) + 1;
    setDragOverDayNumber(dayNumber);
  };

  const handleDragOver = (e: React.DragEvent, dayNumber: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (dragOverDayNumber !== dayNumber) {
      setDragOverDayNumber(dayNumber);
    }
  };

  const handleDragLeave = (e: React.DragEvent, dayNumber: number) => {
    e.preventDefault();
    dragCounters.current[dayNumber] = (dragCounters.current[dayNumber] || 0) - 1;
    if (dragCounters.current[dayNumber] <= 0) {
      dragCounters.current[dayNumber] = 0;
      if (dragOverDayNumber === dayNumber) {
        setDragOverDayNumber(null);
      }
    }
  };

  // Drop onto Day
  const handleDrop = (e: React.DragEvent, targetDayNumber: number) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounters.current[targetDayNumber] = 0;
    setDragOverDayNumber(null);
    setDragOverItemIndex(null);

    let payload = getDragPayload();
    if (!payload) {
      try {
        const raw = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
        if (raw) payload = JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse dropped payload:', err);
      }
    }

    if (payload) {
      if (payload.type === 'catalog-item' && payload.item) {
        onAddItemToDay(payload.item, targetDayNumber);
      } else if (payload.type === 'itinerary-item' && payload.itemId && payload.fromDayNumber) {
        if (payload.fromDayNumber !== targetDayNumber) {
          onMoveItem(payload.fromDayNumber, targetDayNumber, payload.itemId);
        }
      }
    }

    clearDragPayload();
    setDraggingItemId(null);
  };

  // Card start drag
  const handleCardDragStart = (e: React.DragEvent, itemId: string, fromDayNumber: number) => {
    setDraggingItemId(itemId);
    const item = currentDay.items.find(i => i.id === itemId);
    const payload = {
      type: 'itinerary-item' as const,
      itemId,
      fromDayNumber,
      item,
    };
    setDragPayload(payload);
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
    e.dataTransfer.setData('text/plain', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  // Item-level drag over for reordering / insertion
  const handleItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    if (dragOverItemIndex !== index) {
      setDragOverItemIndex(index);
    }
  };

  const handleItemDrop = (e: React.DragEvent, targetIndex: number, targetDayNumber: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverItemIndex(null);
    setDragOverDayNumber(null);

    let payload = getDragPayload();
    if (!payload) {
      try {
        const raw = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
        if (raw) payload = JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse dropped payload:', err);
      }
    }

    if (!payload) return;

    const targetDay = itinerary.days.find(d => d.dayNumber === targetDayNumber);
    if (!targetDay) return;

    if (payload.type === 'catalog-item' && payload.item) {
      const newItem: ItineraryItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        catalogId: payload.item.id,
        title: payload.item.title,
        category: payload.item.category,
        price: Number(payload.item.price) || 0,
        time: payload.item.timeSlotDefault || '11:00 AM',
        duration: payload.item.duration,
        location: payload.item.location,
        description: payload.item.description,
        image: payload.item.image,
        rating: payload.item.rating,
        reviewsCount: payload.item.reviewsCount,
        tags: payload.item.tags,
      };
      const newItems = [...targetDay.items];
      newItems.splice(targetIndex, 0, newItem);
      onReorderItems(targetDayNumber, newItems);
    } else if (payload.type === 'itinerary-item' && payload.itemId && payload.fromDayNumber) {
      if (payload.fromDayNumber === targetDayNumber) {
        const currentIndex = targetDay.items.findIndex(i => i.id === payload.itemId);
        if (currentIndex !== -1 && currentIndex !== targetIndex) {
          const itemToMove = targetDay.items[currentIndex];
          const newItems = targetDay.items.filter(i => i.id !== payload.itemId);
          newItems.splice(targetIndex, 0, itemToMove);
          onReorderItems(targetDayNumber, newItems);
        }
      } else {
        onMoveItem(payload.fromDayNumber, targetDayNumber, payload.itemId);
      }
    }

    clearDragPayload();
    setDraggingItemId(null);
  };

  // Category styling helper
  const getCategoryTheme = (category: string, title: string = '') => {
    const t = title.toLowerCase();
    if (category === 'transport') {
      let icon = 'flight';
      if (t.includes('chauffeur') || t.includes('car') || t.includes('innova') || t.includes('taxi') || t.includes('pickup') || t.includes('transfer')) {
        icon = 'directions_car';
      } else if (t.includes('train') || t.includes('shinkansen') || t.includes('bullet')) {
        icon = 'train';
      } else if (t.includes('boat') || t.includes('ferry') || t.includes('cruise')) {
        icon = 'directions_boat';
      }
      return {
        iconName: icon,
        iconBg: 'bg-[#F5EEFE] text-[#9333EA] border border-purple-200/50',
        badgeBg: 'bg-[#F3E8FF] text-[#7E22CE]',
        label: 'Transport',
        fallbackImg: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80',
      };
    }
    if (category === 'hotel') {
      return {
        iconName: 'hotel',
        iconBg: 'bg-[#EFF6FF] text-[#2563EB] border border-blue-200/50',
        badgeBg: 'bg-[#DBEAFE] text-[#1D4ED8]',
        label: 'Hotel',
        fallbackImg: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
      };
    }
    if (category === 'meal') {
      return {
        iconName: 'restaurant',
        iconBg: 'bg-[#FFFBEB] text-[#D97706] border border-amber-200/50',
        badgeBg: 'bg-[#FEF3C7] text-[#B45309]',
        label: 'Meal',
        fallbackImg: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80',
      };
    }
    if (category === 'experience') {
      let icon = 'auto_awesome';
      if (t.includes('spa') || t.includes('massage')) icon = 'spa';
      else if (t.includes('houseboat') || t.includes('cruise') || t.includes('canoe')) icon = 'directions_boat';
      return {
        iconName: icon,
        iconBg: 'bg-[#F0FDFA] text-[#0D9488] border border-teal-200/50',
        badgeBg: 'bg-[#CCFBF1] text-[#0F766E]',
        label: 'Experience',
        fallbackImg: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80',
      };
    }
    return {
      iconName: 'confirmation_number',
      iconBg: 'bg-[#ECFDF5] text-[#059669] border border-emerald-200/50',
      badgeBg: 'bg-[#D1FAE5] text-[#047857]',
      label: 'Activity',
      fallbackImg: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80',
    };
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full max-h-full overflow-hidden bg-[#FAFBFD]">
      {/* Main Content View Area */}
      {viewMode === 'single' ? (
        <div
          onDragEnter={e => handleDragEnter(e, currentDay.dayNumber)}
          onDragOver={e => handleDragOver(e, currentDay.dayNumber)}
          onDragLeave={e => handleDragLeave(e, currentDay.dayNumber)}
          onDrop={e => handleDrop(e, currentDay.dayNumber)}
          className="flex-1 min-h-0 overflow-y-auto px-4 py-3 custom-scrollbar animate-in fade-in duration-200"
        >
          <div className="w-full max-w-3xl sm:max-w-4xl mx-auto flex flex-col gap-3.5 pb-36 sm:pb-20 select-none">
            {/* 1. SCROLLABLE TOP BANNER (Scrolls naturally with content, identical width to section below) */}
            <TripHeroHeader
              itinerary={itinerary}
              viewMode="single"
              activeDayNumber={activeDayNumber}
              onViewModeChange={setViewMode}
              onUpdateItinerary={onUpdateItinerary}
              onExportPDF={onExportPDF}
              onExportCSV={onExportCSV}
              onViewRouteMap={onViewRouteMap}
            />

            {/* 2. WHITE CARD CONTAINER: DIVIDED CARDS & TIMELINE */}
            <div className={`w-full bg-white rounded-3xl p-5 sm:p-7 shadow-xs border transition-colors flex flex-col gap-3 relative ${
              dragOverDayNumber === currentDay.dayNumber
                ? 'border-blue-500 bg-blue-50/20 ring-2 ring-blue-300'
                : 'border-slate-100'
            }`}>
              {/* Day Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 shrink-0">
                      Day {currentDay.dayNumber}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      {currentDay.title}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    {currentDay.date || 'Scheduled day'} • {currentDay.items.filter(i => i.category !== 'hotel').length} activities • {currentDay.items.filter(i => i.category === 'hotel').length} hotel
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-100 shrink-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Day Total</div>
                  <div className="text-base font-extrabold text-blue-600">
                    {formatCurrency(currentDayTotal)}
                  </div>
                </div>
              </div>

              {/* Divided Items List (Maintains full Drag & Drop while dividing cards) */}
              <div className="flex flex-col">
                {currentDay.items.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs flex flex-col items-center gap-2.5">
                    <span>No scheduled items for Day {currentDay.dayNumber}.</span>
                    {onOpenAddDrawer && (
                      <button
                        type="button"
                        onClick={onOpenAddDrawer}
                        className="px-4 py-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span>Browse Activities & Stays</span>
                      </button>
                    )}
                  </div>
                ) : (
                  currentDay.items.map((item, idx) => {
                    const theme = getCategoryTheme(item.category, item.title);
                    const itemThumbnail = item.image || theme.fallbackImg;
                    const isDragging = draggingItemId === item.id;
                    const isItemHovered = dragOverItemIndex === idx;

                    return (
                      <React.Fragment key={item.id}>
                        {/* The Divided Card */}
                        <div
                          draggable
                          onDragStart={e => handleCardDragStart(e, item.id, currentDay.dayNumber)}
                          onDragOver={e => handleItemDragOver(e, idx)}
                          onDragLeave={() => setDragOverItemIndex(null)}
                          onDrop={e => handleItemDrop(e, idx, currentDay.dayNumber)}
                          className={`flex items-start justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border transition-all cursor-grab active:cursor-grabbing group relative select-none ${
                            isItemHovered
                              ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-300 scale-[1.01]'
                              : isDragging
                              ? 'opacity-40 border-slate-300 bg-slate-50'
                              : 'bg-white hover:bg-slate-50/60 border-slate-200/80 hover:border-blue-300 shadow-2xs hover:shadow-xs'
                          }`}
                        >
                          {/* Left Side: Drag Grip & Category Icon */}
                          <div className="flex items-start gap-2 sm:gap-3.5 min-w-0 flex-1">
                            <div className="flex items-center gap-1 shrink-0 pt-0.5">
                              {/* Grip Indicator */}
                              <span
                                className="hidden sm:inline-flex material-symbols-outlined text-slate-300 group-hover:text-slate-500 text-sm cursor-grab active:cursor-grabbing transition-colors -ml-1"
                                title="Drag to reorder or move to another day"
                              >
                                drag_indicator
                              </span>

                              {/* Circular Icon matching Reference */}
                              <div
                                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-2xs z-10 ${theme.iconBg}`}
                              >
                                <span className="material-symbols-outlined text-base sm:text-lg">
                                  {theme.iconName}
                                </span>
                              </div>
                            </div>

                            {/* Middle Details */}
                            <div className="min-w-0 pt-0.5 flex-1 pr-1">
                              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block tracking-wide uppercase">
                                {item.time || '11:30 AM'}
                              </span>
                              <h3
                                onClick={() => onSelectItemForDetail && onSelectItemForDetail(item, currentDay.dayNumber)}
                                className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 cursor-pointer transition-colors leading-snug line-clamp-2"
                              >
                                {item.title}
                              </h3>
                              <div className="flex items-center gap-1 text-slate-500 text-[11px] sm:text-xs mt-0.5 truncate">
                                <span className="material-symbols-outlined text-xs text-slate-400 shrink-0">
                                  location_on
                                </span>
                                <span className="truncate">{item.location || 'Central Location'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${theme.badgeBg}`}
                                >
                                  {theme.label}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
                                  {item.duration || '2 hrs'}
                                </span>
                                {item.price > 0 && (
                                  <>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-[11px] sm:text-xs font-bold text-slate-800">
                                      {formatCurrency(item.price)}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right Side: Thumbnail Image */}
                          <div className="flex items-center gap-2 shrink-0">
                            <div
                              onClick={() => onSelectItemForDetail && onSelectItemForDetail(item, currentDay.dayNumber)}
                              className="w-20 sm:w-28 h-16 sm:h-20 rounded-xl overflow-hidden shadow-2xs border border-slate-100 shrink-0 cursor-pointer group-hover:scale-105 transition-transform duration-300 relative"
                            >
                              <img
                                src={itemThumbnail}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Quick delete button on hover */}
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                onRemoveItem(currentDay.dayNumber, item.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 flex items-center justify-center text-xs cursor-pointer"
                              title="Remove from day"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Timeline Connecting Stem between consecutive divided cards */}
                        {idx < currentDay.items.length - 1 && (
                          <div className="flex items-center justify-start pl-[34px] sm:pl-[38px] my-1 h-3 z-0 pointer-events-none">
                            <div className="w-[2px] h-full bg-slate-200" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </div>

              {/* Drop Target Invitation Button */}
              <div
                onDragOver={e => handleItemDragOver(e, currentDay.items.length)}
                onDrop={e => handleItemDrop(e, currentDay.items.length, currentDay.dayNumber)}
                onClick={() => onOpenAddModalForDay && onOpenAddModalForDay(currentDay.dayNumber)}
                className={`w-full py-3 px-4 border border-dashed rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer mt-1 ${
                  dragOverItemIndex === currentDay.items.length
                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-300 shadow-sm'
                    : 'border-slate-200 hover:border-blue-400 text-slate-400 hover:text-blue-600 hover:bg-blue-50/20'
                }`}
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                <span>Drop items from catalog here, or click to add custom</span>
              </div>

              {/* ------------------------------------------------------- */}
              {/* DAY TOTAL BANNER (Exact Reference Match)                */}
              {/* ------------------------------------------------------- */}
              <div
                onClick={() => onOpenBookingModal && onOpenBookingModal()}
                className="w-full bg-[#F3F6FD] hover:bg-[#EBF1FD] border border-blue-100/80 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all mt-2 shadow-2xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-[#2563EB] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">auto_awesome</span>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium leading-none">
                      Day total
                    </div>
                    <div className="text-lg font-extrabold text-slate-900 leading-tight mt-0.5">
                      {formatCurrency(currentDayTotal)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------- */}
            {/* BOTTOM CAROUSEL DAY PAGINATION (Exact Reference Match)    */}
            {/* --------------------------------------------------------- */}
            <div className="flex flex-col items-center justify-center py-2 pb-6">
              <div className="flex items-center gap-3">
                {/* Left Arrow Button */}
                <button
                  onClick={() => setActiveDayNumber(Math.max(1, activeDayNumber - 1))}
                  disabled={activeDayNumber === 1}
                  className={`w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center shadow-2xs transition-all ${
                    activeDayNumber === 1
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:bg-slate-50 hover:border-slate-300 cursor-pointer active:scale-95'
                  }`}
                  title="Previous Day"
                >
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>

                {/* Dots Indicator */}
                <div className="flex items-center gap-1.5 px-2">
                  {itinerary.days.map(day => (
                    <button
                      key={day.dayNumber}
                      onClick={() => setActiveDayNumber(day.dayNumber)}
                      className={`transition-all cursor-pointer ${
                        day.dayNumber === activeDayNumber
                          ? 'w-2.5 h-2.5 rounded-full bg-[#2563EB]'
                          : 'w-1.5 h-1.5 rounded-full bg-slate-300 hover:bg-slate-400'
                      }`}
                      title={`Go to Day ${day.dayNumber}`}
                    />
                  ))}
                </div>

                {/* Right Arrow Button */}
                <button
                  onClick={() => setActiveDayNumber(Math.min(itinerary.days.length, activeDayNumber + 1))}
                  disabled={activeDayNumber === itinerary.days.length}
                  className={`w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center shadow-2xs transition-all ${
                    activeDayNumber === itinerary.days.length
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:bg-slate-50 hover:border-slate-300 cursor-pointer active:scale-95'
                  }`}
                  title="Next Day"
                >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 3. ALL DAYS BOARD VIEW (Columns side-by-side with full drag & drop) */
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden animate-in fade-in duration-200">
          {/* Top Banner in All Days View (Full-width trip overview) */}
          <div className="w-full px-3 sm:px-4 pt-2.5 pb-1 shrink-0">
            <TripHeroHeader
              itinerary={itinerary}
              viewMode="board"
              activeDayNumber={activeDayNumber}
              onViewModeChange={setViewMode}
              onUpdateItinerary={onUpdateItinerary}
              onExportPDF={onExportPDF}
              onExportCSV={onExportCSV}
              onViewRouteMap={onViewRouteMap}
            />
          </div>

          {/* Board Toolbar (Days jump bar) */}
          <div className="mx-3 sm:mx-4 mt-1 px-3.5 py-1.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
                Days:
              </span>

              {itinerary.days.map(day => {
                const isActive = day.dayNumber === activeDayNumber;
                const isDragOver = dragOverDayNumber === day.dayNumber;

                return (
                  <button
                    key={day.id || `day-tab-${day.dayNumber}`}
                    type="button"
                    onClick={() => setActiveDayNumber(day.dayNumber)}
                    onDragEnter={e => handleDragEnter(e, day.dayNumber)}
                    onDragOver={e => handleDragOver(e, day.dayNumber)}
                    onDragLeave={e => handleDragLeave(e, day.dayNumber)}
                    onDrop={e => handleDrop(e, day.dayNumber)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      isDragOver
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400 scale-105 shadow-md'
                        : isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                    }`}
                    title={`Click to view Day ${day.dayNumber} or drag & drop items here`}
                  >
                    <span>Day {day.dayNumber}</span>
                    <span className="text-[10px] opacity-75 font-normal">
                      ({day.items.length})
                    </span>
                    {isDragOver && (
                      <span className="text-[10px] bg-white/20 px-1 rounded animate-pulse">Drop!</span>
                    )}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={onAddDay}
                className="px-2 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-dashed border-slate-300 hover:border-blue-300 flex items-center gap-1 transition-all cursor-pointer shrink-0"
                title="Add a new day to this itinerary"
              >
                <span className="material-symbols-outlined text-xs">add</span>
                <span>Day</span>
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden px-4 py-2 custom-scrollbar">
            <div className="flex items-stretch gap-3.5 h-full max-h-full min-h-0 pb-2 min-w-max">
            {itinerary.days.map(day => {
              const daySubtotal = day.items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
              const isDragOver = dragOverDayNumber === day.dayNumber;
              const isCurrentDay = day.dayNumber === activeDayNumber;

              return (
                <div
                  key={day.id || `day-${day.dayNumber}`}
                  onDragEnter={e => handleDragEnter(e, day.dayNumber)}
                  onDragOver={e => handleDragOver(e, day.dayNumber)}
                  onDragLeave={e => handleDragLeave(e, day.dayNumber)}
                  onDrop={e => handleDrop(e, day.dayNumber)}
                  onClick={() => setActiveDayNumber(day.dayNumber)}
                  className={`w-72 sm:w-80 flex flex-col h-full max-h-full min-h-0 bg-white border rounded-2xl transition-all duration-150 select-none shadow-2xs ${
                    isDragOver
                      ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-400 shadow-md scale-[1.01]'
                      : isCurrentDay
                      ? 'border-blue-300 ring-1 ring-blue-100'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  {/* Column Header */}
                  <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-100 shrink-0 bg-slate-50/70 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-100/70 text-blue-800 text-xs font-bold">
                        Day {day.dayNumber}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {day.date || `Day ${day.dayNumber}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-slate-900">
                        {formatCurrency(daySubtotal)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onOpenAddModalForDay && onOpenAddModalForDay(day.dayNumber)}
                        className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                        title="Add item to this day"
                      >
                        <span className="material-symbols-outlined text-sm font-bold">add</span>
                      </button>
                      {itinerary.days.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete Day ${day.dayNumber}?`)) {
                              onDeleteDay(day.dayNumber);
                            }
                          }}
                          className="w-5 h-5 flex items-center justify-center text-slate-300 hover:text-rose-500 rounded cursor-pointer transition-colors"
                          title="Delete Day"
                        >
                          <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cards List in this Day Column */}
                  <div className="flex-1 min-h-0 overflow-y-auto p-2.5 space-y-2 custom-scrollbar bg-slate-50/20">
                    {day.items.map((item, itemIdx) => (
                      <ItineraryCard
                        key={item.id}
                        item={item}
                        dayNumber={day.dayNumber}
                        totalDays={itinerary.days.length}
                        onRemove={itemId => onRemoveItem(day.dayNumber, itemId)}
                        onMoveToDay={(itemId, targetDay) =>
                          onMoveItem(day.dayNumber, targetDay, itemId)
                        }
                        onUpdateItem={updated => {
                          const newItems = [...day.items];
                          newItems[itemIdx] = updated;
                          onReorderItems(day.dayNumber, newItems);
                        }}
                        onDragStart={handleCardDragStart}
                        onSelectForDetail={(selectedItem, dNum) =>
                          onSelectItemForDetail(selectedItem, dNum)
                        }
                        isDragging={draggingItemId === item.id}
                      />
                    ))}

                    {/* Drop target invitation button */}
                    <button
                      type="button"
                      onClick={() => onOpenAddModalForDay && onOpenAddModalForDay(day.dayNumber)}
                      className={`w-full py-2.5 px-3 text-left text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-dashed ${
                        isDragOver
                          ? 'border-blue-400 bg-blue-100/50 text-blue-700 font-bold'
                          : 'border-slate-200 hover:border-blue-300 text-slate-400 hover:text-blue-600 hover:bg-blue-50/30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isDragOver ? 'file_download' : 'add'}
                      </span>
                      <span>{isDragOver ? 'Drop item here' : 'Drop item or click to add'}</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {/* "+ Add day" Column button */}
            <button
              type="button"
              onClick={onAddDay}
              className="w-56 shrink-0 h-12 border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 rounded-2xl text-xs font-bold text-slate-500 hover:text-blue-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start mt-2 shadow-2xs"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>Add Day {itinerary.days.length + 1}</span>
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
