import React from 'react';
import { ItineraryDay, ItineraryItem, TripItinerary } from '../../types/itinerary';
import { formatCurrency } from '../../utils/pricing';
import { ItineraryCard } from './ItineraryCard';

interface MobileTimelineViewProps {
  itinerary: TripItinerary;
  activeDayNumber: number;
  setActiveDayNumber: (dayNumber: number) => void;
  onOpenAddBottomSheet: () => void;
  onRemoveItem: (dayNumber: number, itemId: string) => void;
  onMoveItem: (fromDayNumber: number, toDayNumber: number, itemId: string) => void;
  onReorderItems: (dayNumber: number, reorderedItems: ItineraryItem[]) => void;
  onAddDay: () => void;
  onDeleteDay: (dayNumber: number) => void;
  onDuplicateDay: (dayNumber: number) => void;
  onClearDay: (dayNumber: number) => void;
}

export const MobileTimelineView: React.FC<MobileTimelineViewProps> = ({
  itinerary,
  activeDayNumber,
  setActiveDayNumber,
  onOpenAddBottomSheet,
  onRemoveItem,
  onMoveItem,
  onReorderItems,
  onAddDay,
  onDeleteDay,
  onDuplicateDay,
  onClearDay,
}) => {
  const activeDay: ItineraryDay =
    itinerary.days.find(d => d.dayNumber === activeDayNumber) || itinerary.days[0] || {
      id: 'day-1',
      dayNumber: 1,
      date: 'Day 1',
      title: 'Itinerary Day',
      subtitle: '',
      items: [],
    };

  const daySubtotal = activeDay.items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newItems = [...activeDay.items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    onReorderItems(activeDay.dayNumber, newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index >= activeDay.items.length - 1) return;
    const newItems = [...activeDay.items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    onReorderItems(activeDay.dayNumber, newItems);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FBFBFA] pb-24 overflow-y-auto select-none">
      {/* Notion-style Day Switcher Tabs */}
      <div className="bg-white border-b border-neutral-200/70 sticky top-0 z-20">
        <div className="px-3 py-2 flex items-center justify-between border-b border-neutral-100">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-base">⛩️</span>
            <span className="text-xs font-semibold text-neutral-800 truncate">{itinerary.title}</span>
          </div>
          <span className="text-xs font-bold text-neutral-800 shrink-0">
            {formatCurrency(daySubtotal)}
          </span>
        </div>

        {/* Day Pills Bar */}
        <div className="px-2 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {itinerary.days.map(day => {
            const isSelected = day.dayNumber === activeDayNumber;
            const sub = day.items.reduce((s, it) => s + (Number(it.price) || 0), 0);

            return (
              <button
                key={day.id || day.dayNumber}
                type="button"
                onClick={() => setActiveDayNumber(day.dayNumber)}
                className={`px-2.5 py-1 rounded text-xs font-medium shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-neutral-800 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/60'
                }`}
              >
                <span>Day {day.dayNumber}</span>
                <span className={`text-[10px] ${isSelected ? 'text-neutral-300' : 'text-neutral-400'}`}>
                  {formatCurrency(sub)}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={onAddDay}
            className="px-2 py-1 rounded text-xs font-medium text-neutral-500 bg-neutral-100 hover:bg-neutral-200/60 shrink-0 flex items-center gap-0.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xs">add</span>
            <span>Day</span>
          </button>
        </div>
      </div>

      {/* Active Day Content Header */}
      <div className="px-4 py-2.5 bg-white border-b border-neutral-200/60 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-800">Day {activeDay.dayNumber}</span>
            <span className="text-[11px] text-neutral-400">{activeDay.date}</span>
          </div>
          <p className="text-xs text-neutral-500 truncate mt-0.5">{activeDay.title}</p>
        </div>

        {/* Day Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onDuplicateDay(activeDay.dayNumber)}
            className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-neutral-700 rounded cursor-pointer"
            title="Duplicate Day"
          >
            <span className="material-symbols-outlined text-xs">content_copy</span>
          </button>
          {itinerary.days.length > 1 && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete Day ${activeDay.dayNumber}?`)) {
                  onDeleteDay(activeDay.dayNumber);
                }
              }}
              className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-rose-500 rounded cursor-pointer"
              title="Delete Day"
            >
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Cards List */}
      <div className="p-3 space-y-2">
        {activeDay.items.length === 0 ? (
          <div className="py-12 px-4 bg-white border border-dashed border-neutral-300 rounded-lg text-center text-xs text-neutral-400">
            <p className="font-medium text-neutral-600">Day {activeDay.dayNumber} is empty</p>
            <button
              type="button"
              onClick={onOpenAddBottomSheet}
              className="mt-3 px-3 py-1.5 bg-neutral-800 text-white rounded text-xs font-medium cursor-pointer"
            >
              + Add item
            </button>
          </div>
        ) : (
          activeDay.items.map((item, index) => (
            <ItineraryCard
              key={item.id}
              index={index}
              item={item}
              dayNumber={activeDay.dayNumber}
              totalDays={itinerary.days.length}
              onRemove={itemId => onRemoveItem(activeDay.dayNumber, itemId)}
              onMoveToDay={(itemId, targetDay) =>
                onMoveItem(activeDay.dayNumber, targetDay, itemId)
              }
              onUpdateItem={updated => {
                const newItems = [...activeDay.items];
                newItems[index] = updated;
                onReorderItems(activeDay.dayNumber, newItems);
              }}
              isMobile
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              canMoveUp={index > 0}
              canMoveDown={index < activeDay.items.length - 1}
            />
          ))
        )}
      </div>

      {/* Floating Bottom Add Button (Mobile) */}
      <div className="fixed bottom-14 right-4 z-30">
        <button
          type="button"
          onClick={onOpenAddBottomSheet}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full shadow-lg text-xs font-medium cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Add to Day {activeDay.dayNumber}</span>
        </button>
      </div>
    </div>
  );
};
