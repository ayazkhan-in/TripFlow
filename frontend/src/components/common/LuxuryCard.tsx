import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface CardAmenity {
  icon: string;
  label: string;
}

export interface LuxuryCardProps {
  id?: string;
  index?: number;
  delay?: number;
  title: string;
  description?: string;
  image: string;
  rating?: string | number; // e.g. '4.7/5' or 4.9
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  amenities?: CardAmenity[];
  price?: string | number; // e.g. '₹14,500'
  pricePeriod?: string; // e.g. '/night' or '/trip' or '/person'
  kicker?: string;
  badge?: string;
  badgeColor?: 'blue' | 'emerald' | 'amber' | 'dark';
  isSelected?: boolean;
  onClick?: () => void;
  actionLabel?: string;
  actionVariant?: 'button' | 'link' | 'none';
  onActionClick?: (e: React.MouseEvent) => void;
  secondaryAction?: {
    label: string;
    onClick: (e: React.MouseEvent) => void;
  };
  children?: React.ReactNode;
  className?: string;
  theme?: 'light' | 'dark';
  compact?: boolean;
}

// Default luxury amenities matching reference layout
export const DEFAULT_AMENITIES: CardAmenity[] = [
  { icon: 'wifi', label: 'Free Wi-Fi' },
  { icon: 'restaurant', label: 'Kitchen' },
  { icon: 'king_bed', label: '4 Beds' },
  { icon: 'home', label: 'House' },
  { icon: 'spa', label: 'Spa' },
  { icon: 'location_on', label: 'Central' },
];

export const LuxuryCard: React.FC<LuxuryCardProps> = ({
  id,
  index = 0,
  delay,
  title,
  description,
  image,
  rating = '4.7/5',
  isFavorite: initialFavorite = false,
  onToggleFavorite,
  amenities = DEFAULT_AMENITIES,
  price,
  pricePeriod = '/night',
  kicker,
  badge,
  badgeColor = 'dark',
  isSelected = false,
  onClick,
  actionLabel,
  actionVariant = 'none',
  onActionClick,
  secondaryAction,
  children,
  className = '',
  theme = 'light',
  compact = false,
}) => {
  const [isFav, setIsFav] = useState(initialFavorite);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFav(!isFav);
    if (onToggleFavorite) {
      onToggleFavorite(e);
    }
  };

  const safeAmenities = amenities && amenities.length > 0 ? amenities : DEFAULT_AMENITIES;
  const isDark = theme === 'dark';
  const widthClasses = className && (className.includes('w-') || className.includes('max-w-'))
    ? ''
    : 'w-[320px] sm:w-[340px] shrink-0';

  const calculatedDelay = delay !== undefined ? delay : index * 0.08;

  return (
    <motion.article
      onClick={onClick}
      initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.5,
        delay: calculatedDelay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={`relative ${widthClasses} ${compact ? 'aspect-[1/1.42]' : 'aspect-[1/1.54]'} ${compact ? 'rounded-[22px] sm:rounded-[24px] p-1' : 'rounded-[26px] sm:rounded-[28px] p-1.5'} transition-all duration-300 select-none cursor-pointer border hover:scale-[1.03] hover:-translate-y-1 hover:shadow-xl will-change-transform z-0 hover:z-20 ${
        isDark
          ? isSelected
            ? 'bg-[#1e242b] border-slate-400 ring-2 ring-slate-400/40 shadow-none'
            : 'bg-[#1e242b] border-black/40 hover:border-white/20 shadow-none'
          : isSelected
            ? 'bg-slate-100 border-slate-900 ring-2 ring-slate-900/30 shadow-md'
            : 'bg-slate-100/90 hover:bg-slate-100 border-slate-200 hover:border-slate-300/90 shadow-2xs hover:shadow-lg'
      } ${className}`}
    >
      {/* ------------------------------------------------------------- */}
      {/* INNER INSET CONTAINER (Creates exact inner stroke effect)     */}
      {/* ------------------------------------------------------------- */}
      <div className={`relative w-full h-full rounded-[20px] sm:rounded-[22px] overflow-hidden flex flex-col justify-between ${
        isDark ? 'bg-[#222830]' : 'bg-white border border-slate-100'
      }`}>
        {/* Top Image: Full-bleed background */}
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />

        {/* ------------------------------------------------------------- */}
        {/* PROGRESSIVE BLUR & GRADIENT OVERLAY                           */}
        {/* Smooth progressive easing curve with zero harsh lines         */}
        {/* ------------------------------------------------------------- */}
        <div
          className="absolute inset-x-0 bottom-0 h-[56%] pointer-events-none backdrop-blur-md"
          style={{
            WebkitMaskImage: isDark
              ? 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.55) 52%, rgba(0,0,0,0.2) 78%, rgba(0,0,0,0.04) 92%, transparent 100%)'
              : 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 30%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.2) 80%, transparent 100%)',
            maskImage: isDark
              ? 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.55) 52%, rgba(0,0,0,0.2) 78%, rgba(0,0,0,0.04) 92%, transparent 100%)'
              : 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 30%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.2) 80%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[56%] pointer-events-none"
          style={{
            background: isDark
              ? 'linear-gradient(to top, #1e242b 0%, rgba(30,36,43,0.96) 22%, rgba(30,36,43,0.82) 46%, rgba(30,36,43,0.45) 72%, rgba(30,36,43,0.12) 88%, transparent 100%)'
              : 'linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.98) 28%, rgba(255,255,255,0.90) 52%, rgba(255,255,255,0.60) 74%, rgba(255,255,255,0.15) 90%, transparent 100%)',
          }}
        />

        {/* ------------------------------------------------------------- */}
        {/* TOP CONTROLS: Rating Pill (Left) & Heart Button (Right)       */}
        {/* ------------------------------------------------------------- */}
        <div className="relative z-10 p-2.5 sm:p-3 flex items-center justify-between gap-2">
          {rating ? (
            <div className={`px-2 py-0.5 rounded-full backdrop-blur-md text-[10px] font-semibold flex items-center gap-1 border shadow-xs ${
              isDark
                ? 'bg-black/40 text-white border-white/15'
                : 'bg-white/90 text-slate-800 border-white/80'
            }`}>
              <span
                className={`material-symbols-outlined text-[11px] ${
                  isDark ? 'text-white' : 'text-amber-500'
                }`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span>{rating}</span>
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            {badge && (
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-md border shadow-xs ${
                isDark
                  ? 'border-white/20 text-white bg-black/40'
                  : badgeColor === 'emerald'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : badgeColor === 'amber'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}>
                {badge}
              </span>
            )}
            {/* Heart Button */}
            <button
              type="button"
              onClick={handleFavoriteClick}
              className={`w-6.5 h-6.5 rounded-full backdrop-blur-md flex items-center justify-center hover:scale-105 active:scale-95 border shadow-xs transition-all cursor-pointer ${
                isDark
                  ? 'bg-black/40 hover:bg-white text-white hover:text-rose-600 border-white/15'
                  : 'bg-white/90 hover:bg-white text-slate-600 hover:text-rose-600 border-white/80'
              }`}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <span
                className="material-symbols-outlined text-[13px] transition-colors"
                style={
                  isFav
                    ? { fontVariationSettings: "'FILL' 1", color: '#E11D48' }
                    : {}
                }
              >
                {isFav ? 'favorite' : 'favorite_border'}
              </span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* BOTTOM CONTENT AREA                                           */}
        {/* ------------------------------------------------------------- */}
        <div className="relative z-10 p-3 sm:p-3.5 space-y-1.5 mt-auto flex flex-col justify-end text-left">
          {kicker && (
            <div className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {kicker}
            </div>
          )}

          {/* Title & Description */}
          <div className="space-y-0.5">
            <h3 className={`text-[13.5px] sm:text-[14.5px] font-bold tracking-tight leading-snug line-clamp-1 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {title}
            </h3>

            {description && (
              <p className={`text-[10.5px] line-clamp-2 leading-relaxed font-normal ${
                isDark ? 'text-white/75' : 'text-slate-600'
              }`}>
                {description}
              </p>
            )}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* 3x2 AMENITY PILLS GRID                                        */}
          {/* ------------------------------------------------------------- */}
          {safeAmenities.length > 0 && (
            <div className="grid grid-cols-3 gap-1 pt-0.5">
              {safeAmenities.slice(0, 6).map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium flex items-center justify-center gap-1 border whitespace-nowrap overflow-hidden ${
                    isDark
                      ? 'bg-white/10 text-white/90 border-white/10'
                      : 'bg-slate-100 text-slate-700 border-slate-200/80 font-medium'
                  }`}
                  title={item.label}
                >
                  <span className={`material-symbols-outlined text-[10.5px] shrink-0 ${
                    isDark ? 'text-white/80' : 'text-slate-500'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {children}

          {/* ------------------------------------------------------------- */}
          {/* BOTTOM ROW: Price & Actions                                   */}
          {/* ------------------------------------------------------------- */}
          <div className="pt-0.5 flex items-baseline justify-between">
            {price ? (
              <div className="flex items-baseline">
                <span className={`text-[16px] sm:text-[17px] font-bold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {price}
                </span>
                {pricePeriod && (
                  <span className={`text-[10px] font-normal ml-1 ${
                    isDark ? 'text-white/60' : 'text-slate-500'
                  }`}>
                    {pricePeriod}
                  </span>
                )}
              </div>
            ) : (
              <div className={`text-[10px] font-semibold ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Curated Journey
              </div>
            )}

            {/* Optional explicit action button if requested */}
            {actionVariant === 'button' && actionLabel && (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  if (onActionClick) {
                    onActionClick(e);
                  } else if (onClick) {
                    onClick();
                  }
                }}
                className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-0.5 transition-all cursor-pointer shrink-0 active:scale-95 shadow-2xs ${
                  isDark
                    ? 'bg-white hover:bg-slate-100 text-slate-950'
                    : 'bg-slate-900 hover:bg-black text-white'
                }`}
              >
                <span>{actionLabel}</span>
                <span className="material-symbols-outlined text-[11px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};
