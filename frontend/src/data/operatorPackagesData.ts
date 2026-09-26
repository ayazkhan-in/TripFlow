import { TripItinerary } from '../types/itinerary';
import {
  PREMADE_KERALA_ITINERARY,
  PREMADE_RAJASTHAN_ITINERARY,
  PREMADE_GOA_ITINERARY,
} from './premadeItineraries';

export interface OperatorCuratedPackage {
  id: string;
  title: string;
  destination: string;
  country: string;
  isDomestic: boolean;
  dates: string;
  days: number;
  travelers: number;
  totalPriceINR: number;
  heroImage: string;
  tag: string;
  badgeText: string;
  badgeBg: string;
  routeStops: { city: string }[];
  inclusions: { icon: string; text: string }[];
  operator: {
    name: string;
    leadDirector: string;
    avatar: string;
    license: string;
    rating: number;
    toursCount: number;
    dispatchHub: string;
    badge: string;
  };
  itineraryTemplate: TripItinerary;
  isNewlyCreated?: boolean;
}

export const INITIAL_OPERATOR_PACKAGES: OperatorCuratedPackage[] = [
  {
    id: 'pkg-kerala',
    title: 'Kerala Monsoon Whispers & Backwaters',
    destination: 'Kerala',
    country: 'India',
    isDomestic: true,
    dates: 'Oct 14 – 19, 2026',
    days: 6,
    travelers: 2,
    totalPriceINR: 185000,
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDPNN2qoyEfvyOtZqIr504qTiJEZNQBFvkTNvnO1WbRHP3yVW547MfCw_uDAhSKK1GiCdNjUe-aRn8-L_63RS7R5Mwy4YqnpRnqP57KQq_CU-YFBVffy0PLU7ZdcbMNrxFCo6iB6Avjx862fxPTlkaaqd3BGyUp-55-M5LzxAfFv7qHZZE61cBMvjceJO4nQcz_Dorwpv3LBbNmV9TuAEfTYveWHC3LBVHpfXmUBrAgH70wL-s9i3orMA',
    tag: '🌴 Backwaters & Hills',
    badgeText: 'Ready to Book',
    badgeBg: 'bg-emerald-500',
    routeStops: [{ city: 'Cochin' }, { city: 'Munnar' }, { city: 'Alleppey' }],
    inclusions: [
      { icon: 'flight', text: 'Air India BOM ➔ COK Flight Included' },
      { icon: 'hotel', text: 'Brunton Boatyard & Private Teak Houseboat' },
      { icon: 'directions_car', text: 'Dedicated Private Chauffeur Arun V. (Innova Crysta)' },
    ],
    operator: {
      name: 'Malabar Heritage Concierge',
      leadDirector: 'Arun V.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      license: 'LIC-OP-KL-091',
      rating: 4.98,
      toursCount: 186,
      dispatchHub: 'Cochin & Alleppey Ops Hub',
      badge: 'Verified Elite Operator',
    },
    itineraryTemplate: PREMADE_KERALA_ITINERARY,
  },
  {
    id: 'pkg-rajasthan',
    title: 'Imperial Rajasthan & Royal Palaces',
    destination: 'Rajasthan',
    country: 'India',
    isDomestic: true,
    dates: 'Nov 10 – 16, 2026',
    days: 7,
    travelers: 2,
    totalPriceINR: 265000,
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    tag: '🏰 Royal Palaces',
    badgeText: 'Top Rated Circuit',
    badgeBg: 'bg-amber-500',
    routeStops: [{ city: 'Jaipur' }, { city: 'Jodhpur' }, { city: 'Udaipur' }],
    inclusions: [
      { icon: 'flight', text: 'IndiGo DEL ➔ JAI Flight Included' },
      { icon: 'hotel', text: 'Rambagh Palace & Taj Lake Palace Udaipur' },
      { icon: 'directions_car', text: 'Private Chauffeur & Royal Historian Mahaveer Singh' },
    ],
    operator: {
      name: 'Rajputana Heritage Expeditions',
      leadDirector: 'Mahaveer Singh',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      license: 'LIC-OP-RJ-412',
      rating: 4.95,
      toursCount: 142,
      dispatchHub: 'Jaipur & Udaipur Ops Hub',
      badge: 'Verified Heritage Operator',
    },
    itineraryTemplate: PREMADE_RAJASTHAN_ITINERARY,
  },
  {
    id: 'pkg-goa',
    title: 'Goa Coastal Luxury & Catamaran Charter',
    destination: 'Goa',
    country: 'India',
    isDomestic: true,
    dates: 'Nov 22 – 26, 2026',
    days: 5,
    travelers: 2,
    totalPriceINR: 145000,
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    tag: '🏖️ Coastal Boutique',
    badgeText: 'Private Yacht',
    badgeBg: 'bg-purple-500',
    routeStops: [{ city: 'Panaji' }, { city: 'Morjim' }, { city: 'Candolim' }],
    inclusions: [
      { icon: 'flight', text: 'Vistara BOM ➔ GOI Flight Included' },
      { icon: 'hotel', text: 'Ahilya by the Sea — Dolphin Villa' },
      { icon: 'sailing', text: 'Private 40ft Catamaran Charter (Sunset Champagne Cruise)' },
    ],
    operator: {
      name: 'Konkan Marine & Luxury Charters',
      leadDirector: "Savio D'Souza",
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      license: 'LIC-OP-GA-228',
      rating: 4.92,
      toursCount: 98,
      dispatchHub: 'Panaji & Morjim Ops Hub',
      badge: 'Verified Marine Operator',
    },
    itineraryTemplate: PREMADE_GOA_ITINERARY,
  },
  {
    id: 'pkg-tokyo',
    title: 'Tokyo & Kyoto Cultural Connoisseurs',
    destination: 'Tokyo & Kyoto',
    country: 'Japan',
    isDomestic: false,
    dates: 'Oct 14 – 20, 2026',
    days: 7,
    travelers: 2,
    totalPriceINR: 480000,
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    tag: '⛩️ Temples & High Tech',
    badgeText: 'Curated by Japan Desk',
    badgeBg: 'bg-blue-600',
    routeStops: [{ city: 'Tokyo' }, { city: 'Hakone' }, { city: 'Kyoto' }],
    inclusions: [
      { icon: 'flight', text: 'ANA All Nippon Airways BOM ➔ HND First Class' },
      { icon: 'hotel', text: 'Aman Tokyo & Hoshinoya Kyoto Riverside' },
      { icon: 'train', text: 'JR Shinkansen Gran Class Bullet Train Passes' },
    ],
    operator: {
      name: 'Yamato Concierge Nippon',
      leadDirector: 'Kenji Takahashi',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      license: 'LIC-OP-JP-008',
      rating: 4.99,
      toursCount: 220,
      dispatchHub: 'Tokyo Central Dispatch Hub',
      badge: 'Verified Premier Operator',
    },
    itineraryTemplate: {
      id: 'trip-tokyo-curated',
      title: 'Tokyo & Kyoto Cultural Connoisseurs',
      destination: 'Tokyo & Kyoto',
      country: 'Japan',
      dates: 'Oct 14 – 20, 2026',
      startDate: '2026-10-14',
      travelers: 2,
      currency: 'INR',
      heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      routeStops: [
        { id: 'rs-tyo-1', city: 'Tokyo', hotel: 'Aman Tokyo', transitMode: 'flight' },
        { id: 'rs-tyo-2', city: 'Kyoto', hotel: 'Hoshinoya Kyoto', transitMode: 'train' },
      ],
      days: [
        {
          id: 'day-tyo-1',
          dayNumber: 1,
          date: 'Wed, Oct 14',
          title: 'Arrival in Tokyo Haneda & Aman Skyline Suite Check-in',
          subtitle: 'ANA First Class Flight • Maybach Chauffeur • Otemachi Views',
          items: [
            {
              id: 'tyo-101',
              title: 'ANA NH 11 (BOM ➔ HND First Class)',
              category: 'transport',
              price: 125000,
              time: '10:45 AM',
              duration: '8.5 hrs',
              location: 'Tokyo Haneda Airport (HND)',
              description: 'All Nippon Airways private suite flight with tarmac concierge meet.',
              image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
              tags: ['First Class', 'Tarmac VIP'],
            },
            {
              id: 'tyo-102',
              title: 'Aman Tokyo — Otemachi Skyline Suite Check-in',
              category: 'hotel',
              price: 145000,
              time: '02:00 PM',
              duration: '3 Nights',
              location: 'Otemachi Tower, Tokyo',
              description: 'Corner suite with panoramic views of the Imperial Palace Gardens and Mount Fuji.',
              image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
              tags: ['Luxury Hotel', 'Skyline View'],
            },
            {
              id: 'tyo-103',
              title: 'Ginza Private Omakase with Master Chef Jiro',
              category: 'experience',
              price: 32000,
              time: '07:00 PM',
              duration: '2.5 hrs',
              location: 'Ginza 6-chome, Tokyo',
              description: 'Exclusive 18-course seasonal omakase dining with private sake pairing.',
              image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
              tags: ['Omakase', 'Michelin Star'],
            },
          ],
        },
        {
          id: 'day-tyo-2',
          dayNumber: 2,
          date: 'Thu, Oct 15',
          title: 'Imperial Gardens & Private Modern Art Curator Access',
          subtitle: 'Mori Art Museum • Roppongi Hills • Shinjuku Night Drive',
          items: [
            {
              id: 'tyo-201',
              title: 'Imperial Palace East Gardens Private Historian Tour',
              category: 'activity',
              price: 12000,
              time: '10:00 AM',
              duration: '2.5 hrs',
              location: 'Chiyoda, Tokyo',
              description: 'Access to historical stone walls and private tea house grounds.',
              image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
              tags: ['Culture', 'Historian'],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'pkg-paris',
    title: 'Parisian Haute Couture & Palace of Versailles',
    destination: 'Paris',
    country: 'France',
    isDomestic: false,
    dates: 'Nov 12 – 17, 2026',
    days: 6,
    travelers: 2,
    totalPriceINR: 520000,
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    tag: '🥂 Fashion & Fine Dining',
    badgeText: 'Exclusive Salon Access',
    badgeBg: 'bg-rose-600',
    routeStops: [{ city: 'Paris' }, { city: 'Versailles' }, { city: 'Champagne' }],
    inclusions: [
      { icon: 'flight', text: 'Air France DEL ➔ CDG La Première Suite' },
      { icon: 'hotel', text: 'Hôtel Plaza Athénée — Eiffel Tower View' },
      { icon: 'directions_car', text: 'Rolls-Royce Ghost Chauffeur Jean-Pierre Laurent' },
    ],
    operator: {
      name: 'Étoile Luxury Concierge Paris',
      leadDirector: 'Jean-Pierre Laurent',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      license: 'LIC-OP-FR-119',
      rating: 4.97,
      toursCount: 165,
      dispatchHub: 'Paris 8e Arrondissement Hub',
      badge: 'Verified French Concierge',
    },
    itineraryTemplate: {
      id: 'trip-paris-curated',
      title: 'Parisian Haute Couture & Palace of Versailles',
      destination: 'Paris',
      country: 'France',
      dates: 'Nov 12 – 17, 2026',
      startDate: '2026-11-12',
      travelers: 2,
      currency: 'INR',
      heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      routeStops: [{ id: 'rs-par-1', city: 'Paris', hotel: 'Hôtel Plaza Athénée', transitMode: 'flight' }],
      days: [
        {
          id: 'day-par-1',
          dayNumber: 1,
          date: 'Thu, Nov 12',
          title: 'Arrival in Paris CDG & Plaza Athénée Balcony Welcome',
          subtitle: 'Air France Suite • Rolls-Royce Escort • Dom Pérignon on Arrival',
          items: [
            {
              id: 'par-101',
              title: 'Air France AF 023 (DEL ➔ CDG La Première)',
              category: 'transport',
              price: 185000,
              time: '09:15 AM',
              duration: '9.0 hrs',
              location: 'Paris CDG Terminal 2E',
              description: 'La Première first class with private salon customs clearance.',
              image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
              tags: ['La Première', 'VIP Salon'],
            },
            {
              id: 'par-102',
              title: 'Hôtel Plaza Athénée — Eiffel Signature Suite',
              category: 'hotel',
              price: 195000,
              time: '02:30 PM',
              duration: '3 Nights',
              location: 'Avenue Montaigne, Paris',
              description: 'Balcony suite overlooking Eiffel Tower with Haute Couture salon service.',
              image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
              tags: ['Haute Luxury', 'Eiffel View'],
            },
          ],
        },
      ],
    },
  },
];

/**
 * Helper to generate a new OperatorCuratedPackage with its full ItineraryTemplate
 */
export function createCuratedPackageFromOperator(params: {
  title: string;
  destination: string;
  country: string;
  isDomestic: boolean;
  days: number;
  totalPriceINR: number;
  heroImage?: string;
  tag?: string;
  routeStops: string[];
  inclusions: string[];
  operatorDirector?: string;
}): OperatorCuratedPackage {
  const pkgId = `pkg-op-${Date.now()}`;
  const defaultImage =
    params.heroImage ||
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

  const defaultStops =
    params.routeStops.length > 0
      ? params.routeStops
      : [params.destination, `${params.destination} Heights`, `${params.destination} Valley`];

  const stopsObj = defaultStops.map(s => ({ city: s.trim() }));

  const templateDays = [];
  for (let i = 1; i <= params.days; i++) {
    const isFirst = i === 1;
    const isLast = i === params.days;
    const currentStop = defaultStops[(i - 1) % defaultStops.length];

    templateDays.push({
      id: `day-${pkgId}-${i}`,
      dayNumber: i,
      date: `Day ${i}`,
      title: isFirst
        ? `VIP Arrival & Check-in at ${currentStop}`
        : isLast
        ? `Grand Finale & Dedicated Chauffeur Transfer`
        : `Exclusive Exploration of ${currentStop}`,
      subtitle: isFirst
        ? 'VIP Tarmac Meet • Chauffeur Dispatch • Luxury Check-in'
        : 'Curated Cultural Immersion • Michelin Dining • Master Guide',
      items: [
        ...(isFirst
          ? [
              {
                id: `it-${pkgId}-${i}-flt`,
                title: `Premium Scheduled Flight to ${params.destination}`,
                category: 'transport' as const,
                price: Math.round(params.totalPriceINR * 0.22),
                time: '10:00 AM',
                duration: '2.5 hrs',
                location: `${params.destination} International Airport`,
                description: 'VIP scheduled tickets with priority baggage handling and lounge access.',
                image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
                tags: ['Flight', 'Included'],
              },
              {
                id: `it-${pkgId}-${i}-trf`,
                title: `Executive Chauffeur Transfer to Luxury Hotel`,
                category: 'transport' as const,
                price: Math.round(params.totalPriceINR * 0.08),
                time: '01:00 PM',
                duration: '1 hr',
                location: 'Airport VIP Arrival Gate',
                description: 'Private chauffeur meets with nameboard in dedicated air-conditioned SUV.',
                image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
                tags: ['Chauffeur', 'Private Car'],
              },
              {
                id: `it-${pkgId}-${i}-htl`,
                title: `${currentStop} Heritage Grand Resort Check-in`,
                category: 'hotel' as const,
                price: Math.round(params.totalPriceINR * 0.4),
                time: '02:30 PM',
                duration: `${params.days} Nights`,
                location: currentStop,
                description: 'Panoramic luxury suite with daily gourmet breakfast and spa access.',
                image: defaultImage,
                tags: ['5-Star Stay', 'Panoramic Suite'],
              },
            ]
          : []),
        {
          id: `it-${pkgId}-${i}-act`,
          title: `Curated Heritage & Culinary Immersion in ${currentStop}`,
          category: 'activity' as const,
          price: Math.round(params.totalPriceINR * 0.1),
          time: '04:30 PM',
          duration: '3 hrs',
          location: `${currentStop} Cultural Quarter`,
          description: 'Private master guide walkthrough with VIP fast-track permits and local dining.',
          image: defaultImage,
          tags: ['Private Guide', 'Cultural Permit'],
        },
      ],
    });
  }

  const itineraryTemplate: TripItinerary = {
    id: `itinerary-${pkgId}`,
    title: params.title,
    destination: params.destination,
    country: params.country,
    dates: `${params.days} Days · Bespoke Circuit`,
    startDate: new Date().toISOString().split('T')[0],
    travelers: 2,
    currency: 'INR',
    heroImage: defaultImage,
    routeStops: stopsObj.map((s, idx) => ({
      id: `rs-${pkgId}-${idx}`,
      city: s.city,
      hotel: `${s.city} Grand Villa`,
      transitMode: idx === 0 ? 'flight' : 'car',
    })),
    days: templateDays,
  };

  const inclusionsList =
    params.inclusions.length > 0
      ? params.inclusions.map(inc => ({
          icon: inc.toLowerCase().includes('flight')
            ? 'flight'
            : inc.toLowerCase().includes('hotel') || inc.toLowerCase().includes('stay')
            ? 'hotel'
            : inc.toLowerCase().includes('car') || inc.toLowerCase().includes('chauffeur')
            ? 'directions_car'
            : 'explore',
          text: inc,
        }))
      : [
          { icon: 'flight', text: `Confirmed Scheduled Flight to ${params.destination}` },
          { icon: 'hotel', text: `5-Star Resort & Boutique Stays in ${defaultStops[0]}` },
          { icon: 'directions_car', text: `24/7 Dedicated Chauffeur & Private SUV` },
          { icon: 'explore', text: `Private Guide & VIP Entry Permits Included` },
        ];

  return {
    id: pkgId,
    title: params.title,
    destination: params.destination,
    country: params.country,
    isDomestic: params.isDomestic,
    dates: `${params.days} Days · Flexible Dates`,
    days: params.days,
    travelers: 2,
    totalPriceINR: params.totalPriceINR,
    heroImage: defaultImage,
    tag: params.tag || '✨ Operator Curated Circuit',
    badgeText: 'New Operator Tour',
    badgeBg: 'bg-blue-600',
    routeStops: stopsObj,
    inclusions: inclusionsList,
    operator: {
      name: 'TripFlow Elite Dispatch',
      leadDirector: params.operatorDirector || 'Alex Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      license: 'LIC-OPS-GLOBAL-770',
      rating: 4.99,
      toursCount: 240,
      dispatchHub: `${params.destination} Controller Desk`,
      badge: 'Verified Master Operator',
    },
    itineraryTemplate,
    isNewlyCreated: true,
  };
}

/**
 * Returns formatted 3x2 amenities for LuxuryCard display
 */
export function getPackageAmenities(pkg: OperatorCuratedPackage) {
  const amenities = [
    { icon: 'calendar_today', label: `${pkg.days} Days` },
    { icon: 'group', label: `${pkg.travelers} Guests` },
  ];

  if (pkg.routeStops && pkg.routeStops.length > 0) {
    const routeLabel = pkg.routeStops.map(s => s.city).slice(0, 2).join(' → ');
    amenities.push({ icon: 'route', label: routeLabel });
  }

  pkg.inclusions.forEach(inc => {
    if (amenities.length < 6) {
      let label = inc.text;
      if (label.includes('Flight')) label = 'Flight Inc.';
      else if (label.includes('Chauffeur')) label = 'Chauffeur';
      else if (
        label.includes('Hotel') ||
        label.includes('Villa') ||
        label.includes('Boatyard') ||
        label.includes('Palace') ||
        label.includes('Resort') ||
        label.includes('Aman') ||
        label.includes('Stay')
      )
        label = '5-Star Stay';
      else if (
        label.includes('Catamaran') ||
        label.includes('Cruise') ||
        label.includes('Sailing') ||
        label.includes('Yacht')
      )
        label = 'Private Cruise';
      else if (label.includes('Train') || label.includes('Shinkansen'))
        label = 'Bullet Train';
      else if (label.includes('Guide') || label.includes('Historian'))
        label = 'Private Guide';
      else label = label.split('—')[0].split('&')[0].trim().slice(0, 14);
      amenities.push({ icon: inc.icon || 'verified', label });
    }
  });

  const fallbacks = [
    { icon: 'verified_user', label: 'VIP Pass' },
    { icon: 'support_agent', label: 'Concierge' },
    { icon: 'shield', label: 'Allianz Mesh' },
  ];
  let fallbackIdx = 0;
  while (amenities.length < 6 && fallbackIdx < fallbacks.length) {
    amenities.push(fallbacks[fallbackIdx++]);
  }

  return amenities.slice(0, 6);
}

