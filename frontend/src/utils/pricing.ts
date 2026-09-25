import { ItineraryCategory, PriceBreakdown, TripItinerary } from '../types/itinerary';

export function calculateTripPricing(itinerary: TripItinerary): PriceBreakdown {
  const byCategory: Record<ItineraryCategory, number> = {
    activity: 0,
    hotel: 0,
    transport: 0,
    meal: 0,
    experience: 0,
  };

  let total = 0;
  let itemCount = 0;
  let hotelNights = 0;

  for (const day of itinerary.days) {
    for (const item of day.items) {
      const price = Number(item.price) || 0;
      total += price;
      itemCount += 1;

      if (byCategory[item.category] !== undefined) {
        byCategory[item.category] += price;
      }

      if (item.category === 'hotel') {
        hotelNights += 1;
      }
    }
  }

  const travelers = Math.max(1, itinerary.travelers || 1);
  const perPerson = Math.round(total / travelers);

  return {
    total,
    perPerson,
    byCategory,
    itemCount,
    hotelNights,
  };
}

export function formatCurrency(amount: number, currency: string = '$'): string {
  return `${currency}${amount.toLocaleString('en-US')}`;
}

export const CATEGORY_CONFIG: Record<
  ItineraryCategory,
  {
    label: string;
    icon: string;
    accentColor: string;
    lightBg: string;
    borderColor: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  activity: {
    label: 'Activity',
    icon: 'attractions',
    accentColor: '#059669', // Emerald 600
    lightBg: '#ECFDF5',
    borderColor: '#A7F3D0',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'text-emerald-700',
  },
  hotel: {
    label: 'Hotel',
    icon: 'hotel',
    accentColor: '#7C3AED', // Violet 600
    lightBg: '#F5F3FF',
    borderColor: '#DDD6FE',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    badgeText: 'text-purple-700',
  },
  transport: {
    label: 'Transport',
    icon: 'directions_transit',
    accentColor: '#D97706', // Amber 600
    lightBg: '#FFFBEB',
    borderColor: '#FDE68A',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'text-amber-700',
  },
  meal: {
    label: 'Meal',
    icon: 'restaurant',
    accentColor: '#E11D48', // Rose 600
    lightBg: '#FFF1F2',
    borderColor: '#FECDD3',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeText: 'text-rose-700',
  },
  experience: {
    label: 'Experience',
    icon: 'magic_button',
    accentColor: '#2563EB', // Blue 600 (Primary accent)
    lightBg: '#EFF6FF',
    borderColor: '#BFDBFE',
    badgeBg: 'bg-blue-50 text-[#2563EB] border-blue-200',
    badgeText: 'text-[#2563EB]',
  },
};
