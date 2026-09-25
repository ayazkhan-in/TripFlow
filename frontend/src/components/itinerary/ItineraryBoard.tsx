import React, { useState, useRef } from 'react';
import { CatalogItem, ItineraryItem, PriceBreakdown, TripItinerary } from '../../types/itinerary';
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
}

export const ItineraryBoard: React.FC<ItineraryBoardProps> = ({
  itinerary,
  pricing,
  onUpdateItinerary,
  onAddItemToDay,
  onRemoveItem,
  onMoveItem,
  onReorderItems,
  onAddDay,
  onDeleteDay,
  onDuplicateDay,
  onClearDay,
  onOpenAddModalForDay,
  onSelectItemForDetail,
  activeDayNumber,
  setActiveDayNumber,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onResetToDefault,
  onShareItinerary,
  onOpenBookingModal,
  onOpenAISuggestions,
  onExportPDF,
  onExportCSV,
  onViewRouteMap,
}) => {
  const [dragOverDayNumber, setDragOverDayNumber] = useState<number | null>(null);
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const dragCounters = useRef<Record<number, number>>({});

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

  const handleDrop = (e: React.DragEvent, targetDayNumber: number) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounters.current[targetDayNumber] = 0;
    setDragOverDayNumber(null);

    let payload = getDragPayload();
    if (!payload) {
      try {
        const raw = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('application/json');
        if (raw) {
          payload = JSON.parse(raw);
        }
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

  const handleCardDragStart = (e: React.DragEvent, itemId: string, fromDayNumber: number) => {
    setDraggingItemId(itemId);
    const payload = {
      type: 'itinerary-item' as const,
      itemId,
      fromDayNumber,
    };
    setDragPayload(payload);
    e.dataTransfer.setData('text/plain', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full max-h-full overflow-hidden bg-[#FBFBFA]">
      {/* Top Hero Header Card with Background Image, Dark Overlay, Route & Logistics, Budget & Actions */}
      <TripHeroHeader
        itinerary={itinerary}
        onUpdateItinerary={onUpdateItinerary}
        onExportPDF={onExportPDF}
        onExportCSV={onExportCSV}
        onViewRouteMap={onViewRouteMap}
      />

      {/* Board Columns Area */}
      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden px-4 py-3 custom-scrollbar">
        <div className="flex items-stretch gap-3 h-full max-h-full min-h-0 pb-2 min-w-max">
          {itinerary.days.map(day => {
            const daySubtotal = day.items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
            const isDragOver = dragOverDayNumber === day.dayNumber;

            return (
              <div
                key={day.id || `day-${day.dayNumber}`}
                onDragEnter={e => handleDragEnter(e, day.dayNumber)}
                onDragOver={e => handleDragOver(e, day.dayNumber)}
                onDragLeave={e => handleDragLeave(e, day.dayNumber)}
                onDrop={e => handleDrop(e, day.dayNumber)}
                onClick={() => setActiveDayNumber(day.dayNumber)}
                className={`w-68 sm:w-72 flex flex-col h-full max-h-full min-h-0 bg-[#F7F6F3]/90 border rounded-2xl transition-all duration-150 select-none ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-300'
                    : 'border-neutral-200/80 hover:border-neutral-300'
                }`}
              >
                {/* Column Header */}
                <div className="px-3 py-2 flex items-center justify-between border-b border-neutral-200/70 shrink-0 bg-neutral-100/60 rounded-t-2xl">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-neutral-200 text-neutral-800 text-xs font-bold">
                      Day {day.dayNumber}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-medium">{day.date}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-neutral-800">
                      {formatCurrency(daySubtotal)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenAddModalForDay && onOpenAddModalForDay(day.dayNumber)}
                      className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded cursor-pointer"
                      title="Add item to this day"
                    >
                      <span className="material-symbols-outlined text-xs">add</span>
                    </button>
                    {itinerary.days.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete Day ${day.dayNumber}?`)) {
                            onDeleteDay(day.dayNumber);
                          }
                        }}
                        className="w-5 h-5 flex items-center justify-center text-neutral-300 hover:text-rose-500 rounded cursor-pointer"
                        title="Delete Day"
                      >
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Cards List in this Day Column */}
                <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-2 custom-scrollbar">
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

                  {/* Empty state or "+ New item" button */}
                  <button
                    type="button"
                    onClick={() => onOpenAddModalForDay && onOpenAddModalForDay(day.dayNumber)}
                    className="w-full py-2 text-left px-2.5 text-xs text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-dashed border-transparent hover:border-neutral-300"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>Add item or drop card here</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* "+ Add day" Column placeholder */}
          <button
            type="button"
            onClick={onAddDay}
            className="w-52 shrink-0 h-11 border border-dashed border-neutral-300 hover:border-blue-400 hover:bg-blue-50/20 rounded-2xl text-xs font-semibold text-neutral-500 hover:text-blue-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start mt-1"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Add Day</span>
          </button>
        </div>
      </div>
    </div>
  );
};
