import React, { useState } from 'react';

export interface CardAmenity {
  icon: string;
  label: string;
}

export interface LuxuryCardProps {
  id?: string;
  title: string;
  description?: string;
  image: string;
  rating?: string | number; // e.g. '4.7/5' or 4.9
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  amenities?: CardAmenity[];
  price?: string | number; // e.g. '₹14,500' or '$180'
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

  return (
    <article
      onClick={onClick}
      className={`group relative w-[270px] sm:w-[285px] shrink-0 aspect-[1/1.54] rounded-[26px] sm:rounded-[28px] bg-[#1e242b] p-1.5 transition-all duration-300 select-none cursor-pointer border shadow-none ${
        isSelected
          ? 'border-[#2563EB] ring-2 ring-[#2563EB]/60'
          : 'border-black/40 hover:border-white/20'
      } ${className}`}
    >
      {/* ------------------------------------------------------------- */}
      {/* INNER INSET CONTAINER (Creates exact inner stroke effect)     */}
      {/* No shadow behind the cards                                    */}
      {/* ------------------------------------------------------------- */}
      <div className="relative w-full h-full rounded-[20px] sm:rounded-[22px] overflow-hidden flex flex-col justify-between bg-[#222830]">
        {/* Top Image: Full-bleed background */}
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* ------------------------------------------------------------- */}
        {/* PROGRESSIVE BLUR & GRADIENT OVERLAY                           */}
        {/* Starts at the bottom and ends about halfway in the card       */}
        {/* Smooth progressive easing curve with zero harsh lines         */}
        {/* ------------------------------------------------------------- */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none backdrop-blur-md"
          style={{
            WebkitMaskImage:
              'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.55) 52%, rgba(0,0,0,0.2) 78%, rgba(0,0,0,0.04) 92%, transparent 100%)',
            maskImage:
              'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.55) 52%, rgba(0,0,0,0.2) 78%, rgba(0,0,0,0.04) 92%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, #1e242b 0%, rgba(30,36,43,0.96) 22%, rgba(30,36,43,0.82) 46%, rgba(30,36,43,0.45) 72%, rgba(30,36,43,0.12) 88%, transparent 100%)',
          }}
        />

        {/* ------------------------------------------------------------- */}
        {/* TOP CONTROLS: Rating Pill (Left) & Heart Button (Right)       */}
        {/* Scaled down, refined and smaller per user request             */}
        {/* ------------------------------------------------------------- */}
        <div className="relative z-10 p-2.5 sm:p-3 flex items-center justify-between gap-2">
          {rating ? (
            <div className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1 border border-white/15">
              <span
                className="material-symbols-outlined text-white text-[11px]"
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
            {/* Heart Button */}
            <button
              type="button"
              onClick={handleFavoriteClick}
              className="w-6.5 h-6.5 rounded-full bg-black/40 hover:bg-white backdrop-blur-md flex items-center justify-center text-white hover:text-rose-600 hover:scale-105 active:scale-95 border border-white/15 transition-all cursor-pointer"
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
        {/* Smaller refined elements, NO horizontal line separators       */}
        {/* ------------------------------------------------------------- */}
        <div className="relative z-10 p-3 sm:p-3.5 space-y-1.5 mt-auto flex flex-col justify-end text-left">
          {/* Title & Description */}
          <div className="space-y-0.5">
            <h3 className="text-[13.5px] sm:text-[14.5px] font-bold text-white tracking-tight leading-snug group-hover:text-blue-100 transition-colors line-clamp-1">
              {title}
            </h3>

            {description && (
              <p className="text-[10px] text-white/75 line-clamp-2 leading-relaxed font-normal">
                {description}
              </p>
            )}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* 3x2 AMENITY PILLS GRID                                        */}
          {/* Scaled down to smaller refined size; no text clipping         */}
          {/* ------------------------------------------------------------- */}
          {safeAmenities.length > 0 && (
            <div className="grid grid-cols-3 gap-1 pt-0.5">
              {safeAmenities.slice(0, 6).map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-full px-1.5 py-0.5 bg-white/10 text-white/90 text-[9px] font-medium flex items-center justify-center gap-1 border border-white/10 whitespace-nowrap overflow-hidden"
                  title={item.label}
                >
                  <span className="material-symbols-outlined text-[10px] text-white/80 shrink-0">
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {children}

          {/* ------------------------------------------------------------- */}
          {/* BOTTOM ROW: Price (Zero horizontal line separators)           */}
          {/* ------------------------------------------------------------- */}
          <div className="pt-0.5 flex items-baseline justify-between">
            {price ? (
              <div className="flex items-baseline">
                <span className="text-[16px] sm:text-[17px] font-bold text-white tracking-tight">
                  {price}
                </span>
                {pricePeriod && (
                  <span className="text-[10px] font-normal text-white/60 ml-1">
                    {pricePeriod}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-[10px] font-semibold text-blue-300">Curated Journey</div>
            )}

            {/* Optional explicit action button if requested */}
            {actionVariant === 'button' && actionLabel && (
              <button
                type="button"
                onClick={onActionClick || onClick}
                className="px-2.5 py-0.5 rounded-full bg-white hover:bg-blue-50 text-gray-950 text-[10px] font-bold flex items-center gap-0.5 transition-all cursor-pointer shrink-0"
              >
                <span>{actionLabel}</span>
                <span className="material-symbols-outlined text-[11px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
