import React, { useState } from 'react';
import { CatalogItem, ItineraryCategory, ItineraryItem } from '../../types/itinerary';
import { CATEGORY_CONFIG, formatCurrency } from '../../utils/pricing';

export type DetailCardSource = 'sidebar' | 'board';

interface CardDetailOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  item: CatalogItem | ItineraryItem | null;
  source: DetailCardSource;
  currentDayNumber?: number;
  totalDays: number;
  onAddToDay?: (item: CatalogItem, targetDayNumber: number) => void;
  onMoveToDay?: (itemId: string, targetDayNumber: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onUpdateItem?: (updatedItem: ItineraryItem) => void;
}

export const CardDetailOverlay: React.FC<CardDetailOverlayProps> = ({
  isOpen,
  onClose,
  item,
  source,
  currentDayNumber = 1,
  totalDays,
  onAddToDay,
  onMoveToDay,
  onRemoveItem,
  onUpdateItem,
}) => {
  const [selectedDay, setSelectedDay] = useState(currentDayNumber);
  const [isEditing, setIsEditing] = useState(false);
  const [editPrice, setEditPrice] = useState(item?.price?.toString() || '0');
  const [editTime, setEditTime] = useState(
    (item as ItineraryItem)?.time || (item as CatalogItem)?.timeSlotDefault || '09:00 AM'
  );
  const [editNotes, setEditNotes] = useState((item as ItineraryItem)?.notes || '');

  React.useEffect(() => {
    if (item) {
      setEditPrice(item.price?.toString() || '0');
      setEditTime(
        (item as ItineraryItem)?.time || (item as CatalogItem)?.timeSlotDefault || '09:00 AM'
      );
      setEditNotes((item as ItineraryItem)?.notes || '');
      setSelectedDay(currentDayNumber);
      setIsEditing(false);
    }
  }, [item, currentDayNumber]);

  if (!isOpen || !item) return null;

  const config = CATEGORY_CONFIG[item.category as ItineraryCategory] || CATEGORY_CONFIG.activity;

  const handleSave = () => {
    if (source === 'board' && onUpdateItem && item) {
      onUpdateItem({
        ...(item as ItineraryItem),
        price: parseFloat(editPrice) || 0,
        time: editTime,
        notes: editNotes,
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-neutral-200 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90dvh] flex flex-col">
        {/* Hero Photo Banner */}
        <div className="relative h-48 sm:h-56 w-full bg-neutral-900 overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-colors backdrop-blur-xs"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-white/90 backdrop-blur-xs ${config.badgeText}`}
            >
              <span className="material-symbols-outlined text-xs">{config.icon}</span>
              <span>{config.label}</span>
            </span>

            {source === 'board' && (
              <span className="text-xs font-bold text-white bg-blue-600/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                Day {currentDayNumber}
              </span>
            )}
          </div>

          {/* Title & Price overlay at bottom of image */}
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3 text-white">
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold leading-tight drop-shadow-sm">
                {item.title}
              </h3>
              <p className="flex items-center gap-1 text-xs text-neutral-200 mt-1">
                <span className="material-symbols-outlined text-xs text-neutral-300">location_on</span>
                <span className="truncate">{item.location}</span>
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">
                {formatCurrency(item.price)}
              </span>
              {item.category === 'hotel' && (
                <span className="block text-[11px] text-neutral-300 font-medium">/ night</span>
              )}
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          {/* Key Facts Row */}
          <div className="grid grid-cols-3 gap-2 bg-neutral-50 p-3 rounded-2xl border border-neutral-100 text-xs">
            <div>
              <span className="text-[10px] text-neutral-400 font-medium block">Default Time</span>
              <span className="font-semibold text-neutral-800">
                {(item as ItineraryItem).time || (item as CatalogItem).timeSlotDefault || 'Flexible'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-medium block">Duration</span>
              <span className="font-semibold text-neutral-800">{item.duration || '2 hrs'}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-medium block">Rating</span>
              <span className="font-semibold text-neutral-800">
                ★ {item.rating || 4.9} <span className="text-neutral-400 font-normal">({item.reviewsCount || 120})</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              About this experience
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {item.description || 'No detailed description available.'}
            </p>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 bg-neutral-100 text-neutral-600 text-[11px] font-medium rounded-md"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Inline Edit Form for Board Items */}
          {source === 'board' && isEditing && (
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-2 animate-in fade-in duration-100">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-500 uppercase">
                    Time
                  </label>
                  <input
                    type="text"
                    value={editTime}
                    onChange={e => setEditTime(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-neutral-300 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-500 uppercase">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editPrice}
                    onChange={e => setEditPrice(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-neutral-300 rounded focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-neutral-500 uppercase">
                  Custom Notes
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="e.g. Booking confirmation code or notes"
                  className="w-full px-2 py-1 bg-white border border-neutral-300 rounded focus:outline-none text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-2 shrink-0">
          {source === 'sidebar' ? (
            /* Sidebar Actions: Add to Day X */
            <div className="flex items-center justify-between w-full gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-neutral-500">Target Day:</span>
                <select
                  value={selectedDay}
                  onChange={e => setSelectedDay(Number(e.target.value))}
                  className="text-xs font-semibold text-neutral-800 bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
                >
                  {Array.from({ length: totalDays }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      Day {num}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onAddToDay) {
                    onAddToDay(item as CatalogItem, selectedDay);
                    onClose();
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Add to Day {selectedDay}</span>
              </button>
            </div>
          ) : (
            /* Board Actions: Move to Day, Edit, Delete */
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>{isEditing ? 'Close Edit' : 'Edit'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onRemoveItem) {
                      onRemoveItem(item.id);
                      onClose();
                    }
                  }}
                  className="px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  <span>Remove</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Move to:</span>
                <select
                  value={currentDayNumber}
                  onChange={e => {
                    const target = Number(e.target.value);
                    if (onMoveToDay && target !== currentDayNumber) {
                      onMoveToDay(item.id, target);
                      onClose();
                    }
                  }}
                  className="text-xs font-semibold text-blue-600 bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
                >
                  {Array.from({ length: totalDays }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      Day {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
