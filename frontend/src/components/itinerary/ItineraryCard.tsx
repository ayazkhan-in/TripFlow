import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ItineraryCategory, ItineraryItem } from '../../types/itinerary';
import { clearDragPayload, setDragPayload } from '../../utils/dragDropState';
import { formatCurrency } from '../../utils/pricing';

interface ItineraryCardProps {
  item: ItineraryItem;
  index?: number;
  dayNumber: number;
  totalDays: number;
  onRemove: (itemId: string) => void;
  onMoveToDay: (itemId: string, targetDayNumber: number) => void;
  onUpdateItem?: (updatedItem: ItineraryItem) => void;
  onDragStart?: (e: React.DragEvent, itemId: string, fromDayNumber: number) => void;
  onSelectForDetail?: (item: ItineraryItem, dayNumber: number) => void;
  isDragging?: boolean;
  isMobile?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

// Minimal Notion-style category colors & icons
const NOTION_CATEGORY_META: Record<
  ItineraryCategory,
  { label: string; icon: string; iconColor: string; bgBadge: string }
> = {
  activity: {
    label: 'Activity',
    icon: 'attractions',
    iconColor: 'text-emerald-600',
    bgBadge: 'bg-emerald-50 text-emerald-700',
  },
  hotel: {
    label: 'Hotel',
    icon: 'hotel',
    iconColor: 'text-violet-600',
    bgBadge: 'bg-violet-50 text-violet-700',
  },
  transport: {
    label: 'Transport',
    icon: 'directions_transit',
    iconColor: 'text-amber-600',
    bgBadge: 'bg-amber-50 text-amber-700',
  },
  meal: {
    label: 'Meal',
    icon: 'restaurant',
    iconColor: 'text-rose-600',
    bgBadge: 'bg-rose-50 text-rose-700',
  },
  experience: {
    label: 'Experience',
    icon: 'auto_awesome',
    iconColor: 'text-blue-600',
    bgBadge: 'bg-blue-50 text-blue-700',
  },
};

export const ItineraryCard: React.FC<ItineraryCardProps> = ({
  item,
  index = 0,
  dayNumber,
  totalDays,
  onRemove,
  onMoveToDay,
  onUpdateItem,
  onDragStart,
  onSelectForDetail,
  isDragging = false,
  isMobile = false,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
}) => {
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPrice, setEditPrice] = useState(item.price.toString());
  const [editTime, setEditTime] = useState(item.time);

  const meta = NOTION_CATEGORY_META[item.category] || NOTION_CATEGORY_META.activity;

  const handleDragStart = (e: React.DragEvent) => {
    const payload = {
      type: 'itinerary-item' as const,
      itemId: item.id,
      fromDayNumber: dayNumber,
      item,
    };
    setDragPayload(payload);
    e.dataTransfer.setData('text/plain', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'copyMove';

    if (onDragStart) {
      onDragStart(e, item.id, dayNumber);
    }
  };

  const handleDragEnd = () => {
    clearDragPayload();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onUpdateItem) {
      onUpdateItem({
        ...item,
        price: parseFloat(editPrice) || 0,
        time: editTime,
      });
    }
    setIsEditing(false);
  };

  const handleCardClick = () => {
    if (!isEditing && onSelectForDetail) {
      onSelectForDetail(item, dayNumber);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        duration: 0.4,
        delay: (index ?? 0) * 0.07,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="w-full"
    >
      <div
        draggable={!isEditing}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleCardClick}
        className={`group relative bg-white border border-neutral-200/80 rounded-lg p-2.5 transition-colors select-none cursor-pointer ${
          isDragging
            ? 'opacity-30 border-dashed border-blue-400 shadow-none'
            : 'shadow-2xs hover:shadow-xs hover:border-neutral-300'
        }`}
      >
      {/* Top Row: Icon + Title + Quiet Actions on Hover */}
      <div className="flex items-start justify-between gap-1.5">
        <div className="flex items-start gap-1.5 min-w-0 flex-1">
          <span
            className={`material-symbols-outlined text-sm shrink-0 mt-0.5 ${meta.iconColor}`}
            title={meta.label}
          >
            {meta.icon}
          </span>

          <h4 className="text-xs font-semibold text-neutral-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h4>
        </div>

        {/* Quiet Actions on Hover (Stop propagation to prevent opening detail modal) */}
        <div
          className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1"
          onClick={e => e.stopPropagation()}
        >
          {/* Move to another day */}
          <div className="relative">
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                setShowMoveMenu(!showMoveMenu);
              }}
              className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded cursor-pointer"
              title="Move to another day"
            >
              <span className="material-symbols-outlined text-xs">swap_horiz</span>
            </button>

            {showMoveMenu && (
              <div
                className="absolute right-0 top-6 z-30 w-36 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 text-xs"
                onClick={e => e.stopPropagation()}
              >
                <div className="px-2.5 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Move to
                </div>
                {Array.from({ length: totalDays }, (_, i) => i + 1).map(targetNum => (
                  <button
                    key={targetNum}
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onMoveToDay(item.id, targetNum);
                      setShowMoveMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1 text-xs flex items-center justify-between hover:bg-neutral-50 cursor-pointer ${
                      targetNum === dayNumber
                        ? 'text-blue-600 font-semibold bg-blue-50/50'
                        : 'text-neutral-700'
                    }`}
                  >
                    <span>Day {targetNum}</span>
                    {targetNum === dayNumber && <span className="text-[10px]">Here</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Edit */}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setIsEditing(!isEditing);
            }}
            className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded cursor-pointer"
            title="Edit price/time"
          >
            <span className="material-symbols-outlined text-xs">edit</span>
          </button>

          {/* Remove */}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onRemove(item.id);
            }}
            className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
            title="Delete"
          >
            <span className="material-symbols-outlined text-xs">close</span>
          </button>
        </div>

        {/* Mobile Reorder controls */}
        {isMobile && (
          <div
            className="flex items-center gap-0.5 ml-1"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onMoveUp && onMoveUp();
              }}
              disabled={!canMoveUp}
              className="w-5 h-5 flex items-center justify-center text-neutral-400 disabled:opacity-20 hover:text-neutral-700"
            >
              <span className="material-symbols-outlined text-xs">arrow_upward</span>
            </button>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onMoveDown && onMoveDown();
              }}
              disabled={!canMoveDown}
              className="w-5 h-5 flex items-center justify-center text-neutral-400 disabled:opacity-20 hover:text-neutral-700"
            >
              <span className="material-symbols-outlined text-xs">arrow_downward</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Row: Metadata (Left) and Price in BOTTOM-RIGHT Corner */}
      <div className="flex items-end justify-between gap-2 mt-2 pt-1 border-t border-neutral-100">
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 min-w-0">
          <span className="font-medium text-neutral-500 shrink-0">{item.time}</span>
          {item.location && (
            <>
              <span className="shrink-0">•</span>
              <span className="truncate text-neutral-400 max-w-[120px]">{item.location}</span>
            </>
          )}
        </div>

        {/* Price strictly in the bottom-right corner */}
        <div className="shrink-0 text-right">
          <span className="text-xs font-bold text-neutral-900 bg-neutral-100/80 px-1.5 py-0.5 rounded">
            {formatCurrency(item.price)}
          </span>
        </div>
      </div>

      {/* Inline Quick Edit (Compact) */}
      {isEditing && (
        <form
          onSubmit={handleSaveEdit}
          onClick={e => e.stopPropagation()}
          className="mt-2 pt-2 border-t border-neutral-100 flex items-center gap-2 text-xs"
        >
          <input
            type="text"
            value={editTime}
            onChange={e => setEditTime(e.target.value)}
            className="w-20 px-1.5 py-0.5 border border-neutral-200 rounded text-xs focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            min="0"
            value={editPrice}
            onChange={e => setEditPrice(e.target.value)}
            className="w-16 px-1.5 py-0.5 border border-neutral-200 rounded text-xs focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-medium cursor-pointer"
          >
            Save
          </button>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setIsEditing(false);
            }}
            className="text-neutral-400 hover:text-neutral-600 text-[11px] cursor-pointer"
          >
            Cancel
          </button>
        </form>
      )}
      </div>
    </motion.div>
  );
};
