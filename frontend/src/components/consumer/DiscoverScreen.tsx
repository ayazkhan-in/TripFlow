import React, { useState, useRef, useMemo, useEffect } from 'react';
import { ConsumerTab } from '../../types/travel';
import { TripItinerary } from '../../types/itinerary';
import {
  PREMADE_KERALA_ITINERARY,
  PREMADE_RAJASTHAN_ITINERARY,
  PREMADE_GOA_ITINERARY,
  AIGenerateParams,
} from '../../data/premadeItineraries';
import { TripFlowApi } from '../../services/api';
import { useOperator } from '../../context/OperatorContext';

interface DiscoverScreenProps {
  onNavigateTab: (tab: ConsumerTab) => void;
  onSelectPremadeTrip: (itinerary: TripItinerary) => void;
  onGenerateAITrip: (params: AIGenerateParams) => void;
}

interface OrbitCard {
  id: string;
  name: string;
  country: string;
  flagUrl: string;
  image: string;
  desktopPosition: string;
  animationClass: string;
  extraStyle?: string;
  defaultPrompt: string;
  destination: string;
}

// 6 Non-clickable atmospheric floating destination cards surrounding the hero search
const ORBIT_CARDS: OrbitCard[] = [
  {
    id: 'dest-riyadh',
    name: 'Riyadh',
    country: 'Saudi Arabia',
    flagUrl: 'https://flagcdn.com/w80/sa.png',
    image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=500&q=80',
    desktopPosition: 'top-1 sm:top-2 left-1/2 -translate-x-1/2',
    animationClass: 'animate-float-1',
    defaultPrompt: '5 days luxury desert escape and modern architecture in Riyadh',
    destination: 'Riyadh',
  },
  {
    id: 'dest-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    flagUrl: 'https://flagcdn.com/w80/jp.png',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80',
    desktopPosition: 'top-6 sm:top-8 right-2 sm:right-6 md:right-8 lg:right-12',
    animationClass: 'animate-float-2',
    defaultPrompt: '7 days historic temples, bullet train excursions, and omakase in Tokyo',
    destination: 'Tokyo',
  },
  {
    id: 'dest-ny',
    name: 'New York',
    country: 'United States',
    flagUrl: 'https://flagcdn.com/w80/us.png',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=500&q=80',
    desktopPosition: 'top-20 sm:top-24 left-2 sm:left-6 md:left-8 lg:left-12',
    animationClass: 'animate-float-3',
    extraStyle: 'filter blur-[0.4px] opacity-90',
    defaultPrompt: '4 days skyline penthouses, Broadway, and Michelin dining in New York',
    destination: 'New York',
  },
  {
    id: 'dest-seoul',
    name: 'Seoul',
    country: 'South Korea',
    flagUrl: 'https://flagcdn.com/w80/kr.png',
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=500&q=80',
    desktopPosition: 'bottom-6 sm:bottom-8 left-4 sm:left-8 md:left-12 lg:left-16',
    animationClass: 'animate-float-4',
    defaultPrompt: '5 days royal palaces, night street food, and K-culture in Seoul',
    destination: 'Seoul',
  },
  {
    id: 'dest-beijing',
    name: 'Beijing',
    country: 'China',
    flagUrl: 'https://flagcdn.com/w80/cn.png',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=500&q=80',
    desktopPosition: 'bottom-0 left-1/2 -translate-x-1/2',
    animationClass: 'animate-float-5',
    defaultPrompt: '6 days Great Wall private trek and Forbidden City in Beijing',
    destination: 'Beijing',
  },
  {
    id: 'dest-delhi',
    name: 'Delhi',
    country: 'India',
    flagUrl: 'https://flagcdn.com/w80/in.png',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=500&q=80',
    desktopPosition: 'bottom-6 sm:bottom-8 right-4 sm:right-8 md:right-12 lg:right-16',
    animationClass: 'animate-float-6',
    defaultPrompt: '6 days Taj Mahal heritage, royal palaces, and luxury stays in Delhi',
    destination: 'Delhi',
  },
];

// Quick suggestions
const QUICK_SUGGESTIONS = [
  {
    label: 'Inspire me where to go',
    prompt: 'Inspire me where to go: Spontaneous 5-day luxury getaway with private chauffeur and boutique villa in Kerala',
  },
  {
    label: 'Create a new Trip',
    prompt: 'Create a new Trip: 7-day personalized heritage adventure across Rajasthan with palace stays and private car',
  },
  {
    label: 'Find family hotels in Dubai',
    prompt: 'Find family hotels in Dubai: 5 days luxury family beach resort with desert safari and Burj Khalifa views',
  },
];

// Curated operator packages with full operator attribution and INR pricing
interface OperatorCuratedPackage {
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

const OPERATOR_PACKAGES: OperatorCuratedPackage[] = [
  {
    id: 'pkg-kerala',
    title: 'Kerala Monsoon Whispers & Backwaters',
    destination: 'Kerala',
    country: 'India',
    isDomestic: true,
    dates: 'Oct 14 – 19, 2025',
    days: 6,
    travelers: 2,
    totalPriceINR: 185000,
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPNN2qoyEfvyOtZqIr504qTiJEZNQBFvkTNvnO1WbRHP3yVW547MfCw_uDAhSKK1GiCdNjUe-aRn8-L_63RS7R5Mwy4YqnpRnqP57KQq_CU-YFBVffy0PLU7ZdcbMNrxFCo6iB6Avjx862fxPTlkaaqd3BGyUp-55-M5LzxAfFv7qHZZE61cBMvjceJO4nQcz_Dorwpv3LBbNmV9TuAEfTYveWHC3LBVHpfXmUBrAgH70wL-s9i3orMA',
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
    dates: 'Nov 10 – 16, 2025',
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
    dates: 'Nov 22 – 26, 2025',
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
    dates: 'Oct 14 – 20, 2025',
    days: 7,
    travelers: 2,
    totalPriceINR: 385000,
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    tag: '⛩️ Shinkansen & Heritage',
    badgeText: 'International VIP',
    badgeBg: 'bg-rose-600',
    routeStops: [{ city: 'Tokyo' }, { city: 'Hakone' }, { city: 'Kyoto' }],
    inclusions: [
      { icon: 'flight', text: 'ANA Premium Flight & Shinkansen Bullet Train' },
      { icon: 'hotel', text: 'Aman Tokyo & Hoshinoya Kyoto' },
      { icon: 'restaurant', text: 'Private Omakase & Gion Ochaya Tea Ceremony' },
    ],
    operator: {
      name: 'Nippon High-Touch Expeditions',
      leadDirector: 'Kenzo Morimoto',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      license: 'LIC-OP-JP-774',
      rating: 4.99,
      toursCount: 210,
      dispatchHub: 'Tokyo Ginza Ops Hub',
      badge: 'Verified Global Operator',
    },
    itineraryTemplate: PREMADE_KERALA_ITINERARY,
  },
  {
    id: 'pkg-dubai',
    title: 'Dubai Skyline & Desert Oasis Retreat',
    destination: 'Dubai',
    country: 'United Arab Emirates',
    isDomestic: false,
    dates: 'Dec 02 – 06, 2025',
    days: 5,
    travelers: 2,
    totalPriceINR: 295000,
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    tag: '🏙️ Skyline & Desert Oasis',
    badgeText: 'Luxury Escapade',
    badgeBg: 'bg-amber-600',
    routeStops: [{ city: 'Dubai Marina' }, { city: 'Palm Jumeirah' }, { city: 'Bab Al Shams' }],
    inclusions: [
      { icon: 'flight', text: 'Emirates BOM ➔ DXB Business Class Included' },
      { icon: 'hotel', text: 'Atlantis The Royal & Bab Al Shams Desert Resort' },
      { icon: 'directions_car', text: 'Private Rolls-Royce Chauffeur & Sunset Falconry' },
    ],
    operator: {
      name: 'Emirates Luxury Concierge',
      leadDirector: 'Tariq Al-Mansoor',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      license: 'LIC-OP-DXB-553',
      rating: 4.97,
      toursCount: 164,
      dispatchHub: 'Dubai Downtown Ops Hub',
      badge: 'Verified Concierge Operator',
    },
    itineraryTemplate: PREMADE_GOA_ITINERARY,
  },
];

// Helper to format Indian Rupee currency (₹)
const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Typewriter prefixes and rotating suggestions for empty state
const TYPEWRITER_PREFIX = "I'm planning a trip to";
const TYPEWRITER_SUFFIXES = [
  '...',
  ' Tokyo for 7 days with bullet trains...',
  ' Kerala backwaters & Ayurvedic retreat...',
  ' the Swiss Alps for scenic rail journeys...',
  ' Rajasthan royal palaces & desert safari...',
  ' Amalfi Coast with a private boat tour...',
  ' Dubai luxury skyline & desert dunes...',
  ' Bali boutique pool villas & wellness...',
];

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  onSelectPremadeTrip,
  onGenerateAITrip,
}) => {
  const { packages: operatorPackages } = useOperator();

  // Main natural language input state
  const [naturalLanguageInput, setNaturalLanguageInput] = useState<string>('');
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const curatedSectionRef = useRef<HTMLDivElement>(null);

  // Typewriter effect state for input placeholder
  const [typewriterSuffixIndex, setTypewriterSuffixIndex] = useState<number>(0);
  const [typewriterText, setTypewriterText] = useState<string>('...');
  const [isTypewriterDeleting, setIsTypewriterDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (naturalLanguageInput) return;

    const fullTarget = TYPEWRITER_SUFFIXES[typewriterSuffixIndex];
    let timeoutId: any;

    if (!isTypewriterDeleting) {
      if (typewriterText !== fullTarget) {
        timeoutId = setTimeout(() => {
          setTypewriterText(fullTarget.slice(0, typewriterText.length + 1));
        }, 45);
      } else {
        // Hold full phrase for 2 seconds (2000ms) before deleting
        timeoutId = setTimeout(() => {
          setIsTypewriterDeleting(true);
        }, 2000);
      }
    } else {
      if (typewriterText.length > 0) {
        timeoutId = setTimeout(() => {
          setTypewriterText(typewriterText.slice(0, -1));
        }, 22);
      } else {
        setIsTypewriterDeleting(false);
        setTypewriterSuffixIndex(prev => (prev + 1) % TYPEWRITER_SUFFIXES.length);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [typewriterText, isTypewriterDeleting, typewriterSuffixIndex, naturalLanguageInput]);

  // --------------------------------------------------------------------------
  // CURATED SEARCH PARAMETERS (User must enter details to find packages)
  // --------------------------------------------------------------------------
  const [maxBudgetINR, setMaxBudgetINR] = useState<number>(350000);
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [travelDate, setTravelDate] = useState<string>('2025-10-14');
  const [selectedDays, setSelectedDays] = useState<string>('all');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'domestic' | 'international'>('all');
  const [curatedSearchQuery, setCuratedSearchQuery] = useState<string>('');

  // Custom Dropdown & Calendar Popover States
  const [isTravelersOpen, setIsTravelersOpen] = useState(false);
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [calMonth, setCalMonth] = useState<number>(9); // 0-indexed, 9 = October
  const [calYear, setCalYear] = useState<number>(2025);

  const travelersRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (travelersRef.current && !travelersRef.current.contains(e.target as Node)) {
        setIsTravelersOpen(false);
      }
      if (durationRef.current && !durationRef.current.contains(e.target as Node)) {
        setIsDurationOpen(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format date for display
  const formatDisplayDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        const date = new Date(y, m, d);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const CALENDAR_MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const TRAVELER_OPTIONS = [
    { value: 1, label: '1 Traveler', subtitle: 'Solo Journey', icon: 'person' },
    { value: 2, label: '2 Travelers', subtitle: 'Couple / Duo', icon: 'group' },
    { value: 4, label: '4 Travelers', subtitle: 'Family Package', icon: 'family_restroom' },
    { value: 6, label: '6+ Travelers', subtitle: 'Private Group', icon: 'groups' },
  ];

  const DURATION_OPTIONS = [
    { value: 'all', label: 'Any Duration', subtitle: 'Flexible', icon: 'all_inclusive' },
    { value: '5', label: '5 Days', subtitle: 'Short Escape', icon: 'calendar_view_week' },
    { value: '6', label: '6 Days', subtitle: 'Signature Circuit', icon: 'date_range' },
    { value: '7', label: '7 Days', subtitle: 'Extended Tour', icon: 'event_available' },
  ];

  // Helper when clicking a prompt suggestion chip
  const handleSelectSuggestion = (promptText: string) => {
    setNaturalLanguageInput(promptText);
    inputRef.current?.focus();
  };

  // Helper to extract basic parameters from natural language
  const parseNaturalLanguage = (text: string): AIGenerateParams => {
    const lower = text.toLowerCase();
    
    // Check for days
    const daysMatch = lower.match(/(\d+)\s*(?:day|days)/);
    const parsedDays = daysMatch ? parseInt(daysMatch[1], 10) : 5;

    // Check for known destinations
    let destination = 'Kerala';
    if (lower.includes('tokyo') || lower.includes('japan')) destination = 'Tokyo';
    else if (lower.includes('riyadh') || lower.includes('saudi')) destination = 'Riyadh';
    else if (lower.includes('new york') || lower.includes('nyc')) destination = 'New York';
    else if (lower.includes('seoul') || lower.includes('korea')) destination = 'Seoul';
    else if (lower.includes('beijing') || lower.includes('china')) destination = 'Beijing';
    else if (lower.includes('delhi') || lower.includes('india') || lower.includes('kerala')) destination = 'Kerala';
    else if (lower.includes('dubai')) destination = 'Dubai';
    else if (lower.includes('rajasthan')) destination = 'Rajasthan';
    else if (lower.includes('goa')) destination = 'Goa';
    else {
      const toMatch = text.match(/(?:to|in)\s+([A-Za-z]+)/i);
      if (toMatch && toMatch[1]) {
        destination = toMatch[1];
      }
    }

    return {
      destination,
      days: Math.min(10, Math.max(2, parsedDays)),
      dates: `${new Date().toISOString().split('T')[0]} (${parsedDays} Days)`,
      travelers: lower.includes('family') ? 4 : lower.includes('solo') ? 1 : 2,
      budget: maxBudgetINR,
      travelStyle: lower.includes('luxury') ? 'Luxury Concierge' : 'Cultural Heritage',
      interests: ['Local Heritage', 'Fine Dining', 'Private Chauffeur'],
    };
  };

  // Trigger natural language generation
  const handleGenerate = () => {
    const trimmed = naturalLanguageInput.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }

    setIsBuilding(true);
    setTimeout(() => {
      setIsBuilding(false);
      const params = parseNaturalLanguage(trimmed);
      onGenerateAITrip(params);
    }, 550);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGenerate();
    }
  };

  // Dynamic Packages loaded from live PostgreSQL backend
  const [packages, setPackages] = useState<OperatorCuratedPackage[]>(OPERATOR_PACKAGES);

  useEffect(() => {
    TripFlowApi.getPremadeTrips().then(trips => {
      if (trips && trips.length > 0) {
        const mapped: OperatorCuratedPackage[] = trips.map(t => {
          const isDomestic = t.country === 'India';
          const inr = Math.round(Number(t.totalPrice || 2450) * 83);
          const matched = OPERATOR_PACKAGES.find(p => p.destination.toLowerCase().includes(t.destination.toLowerCase()));
          return {
            id: t.id,
            title: t.title,
            destination: t.destination,
            country: t.country,
            isDomestic,
            dates: t.dates || 'Personalized Dates',
            days: t.days?.length || 5,
            travelers: t.travelers || 2,
            totalPriceINR: inr,
            heroImage: t.heroImageUrl || matched?.heroImage || 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
            tag: matched?.tag || `✨ ${t.destination} Curated`,
            badgeText: matched?.badgeText || 'Ready to Book',
            badgeBg: matched?.badgeBg || 'bg-blue-600',
            routeStops: t.routeStops?.map((s: any) => ({ city: s.city })) || [{ city: t.destination }],
            inclusions: matched?.inclusions || [
              { icon: 'flight', text: `${t.destination} Scheduled Flight Included` },
              { icon: 'hotel', text: '5-Star Curated Luxury Suite' },
              { icon: 'directions_car', text: 'Private Dedicated Chauffeur Service' },
            ],
            operator: matched?.operator || {
              name: `${t.destination} Elite Concierge`,
              leadDirector: 'Concierge Dispatch Desk',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
              license: `LIC-OP-${t.destination.substring(0, 2).toUpperCase()}-101`,
              rating: 4.96,
              toursCount: 120,
              dispatchHub: `${t.destination} Operations Hub`,
              badge: 'Verified Concierge Partner',
            },
            itineraryTemplate: t,
          };
        });
        setPackages(mapped);
      }
    });
  }, []);

  // Filter curated packages based on entered criteria, scope (domestic/international), and search query
  const filteredPackages = useMemo(() => {
    const combined = [
      ...packages,
      ...(operatorPackages ? operatorPackages.filter(op => !packages.some(p => p.id === op.id)) : []),
    ];
    const sourcePackages = combined.length > 0 ? combined : OPERATOR_PACKAGES;

    const filtered = sourcePackages.filter(pkg => {
      // 1. Domestic vs International scope check
      if (scopeFilter === 'domestic' && !pkg.isDomestic) return false;
      if (scopeFilter === 'international' && pkg.isDomestic) return false;

      // 2. Budget check (in INR) - skip budget check for newly created tours so they are always visible
      if (!pkg.isNewlyCreated && pkg.totalPriceINR > maxBudgetINR) return false;

      // 3. Duration check
      if (selectedDays !== 'all') {
        const requiredDays = parseInt(selectedDays, 10);
        if (pkg.days !== requiredDays) return false;
      }

      // 4. Search bar query check
      if (curatedSearchQuery.trim()) {
        const q = curatedSearchQuery.toLowerCase().trim();
        const inDest = pkg.destination.toLowerCase().includes(q);
        const inCountry = pkg.country.toLowerCase().includes(q);
        const inTitle = pkg.title.toLowerCase().includes(q);
        const inOperator = pkg.operator.name.toLowerCase().includes(q) || pkg.operator.leadDirector.toLowerCase().includes(q);
        const inStops = pkg.routeStops.some(s => s.city.toLowerCase().includes(q));
        const inInclusions = pkg.inclusions.some(inc => inc.text.toLowerCase().includes(q));
        if (!inDest && !inCountry && !inTitle && !inOperator && !inStops && !inInclusions) {
          return false;
        }
      }

      return true;
    });

    // Newly created operator tours appear first
    return [...filtered].sort((a, b) => {
      if (a.isNewlyCreated && !b.isNewlyCreated) return -1;
      if (!a.isNewlyCreated && b.isNewlyCreated) return 1;
      return 0;
    });
  }, [packages, operatorPackages, maxBudgetINR, scopeFilter, selectedDays, curatedSearchQuery]);

  const handleCuratedSearch = (e: React.FormEvent) => {
    e.preventDefault();
    curatedSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-[#FAFAFD] text-[#0F172A] relative flex flex-col overflow-y-auto selection:bg-[#2563EB] selection:text-white">
      {/* ============================================================= */}
      {/* HERO SECTION: FLOATING ORBIT CANVAS & EXPANDED INPUT BAR       */}
      {/* ============================================================= */}
      <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-14 flex flex-col items-center">
        {/* Ambient subtle central glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_75%_55%_at_50%_40%,rgba(241,245,249,0.9),transparent)]" />

        {/* Clean Headline (No branding, no pill) */}
        <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-[#111827] tracking-tight text-center mb-8 sm:mb-10 select-none z-20">
          Where is your next destination?
        </h1>

        {/* Orbit Canvas with Floating Cards and Center Search Form */}
        <div className="relative w-full min-h-[480px] sm:min-h-[540px] flex items-center justify-center">
          {/* --------------------------------------------------------- */}
          {/* FLOATING DESTINATION CARDS (Non-clickable ambient orbit)  */}
          {/* --------------------------------------------------------- */}
          <div className="hidden md:block absolute inset-0 pointer-events-none select-none">
            {ORBIT_CARDS.map(dest => (
              <div
                key={dest.id}
                className={`absolute ${dest.desktopPosition} ${dest.animationClass} ${dest.extraStyle || ''}`}
              >
                {/* Floating Card Frame */}
                <div className="bg-white p-1.5 rounded-2xl border border-slate-100/90 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08),0_4px_10px_rgba(0,0,0,0.03)] flex flex-col items-start backdrop-blur-xs">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-28 sm:w-32 lg:w-36 h-18 sm:h-20 lg:h-22 object-cover rounded-xl"
                    loading="lazy"
                  />
                  <div className="w-full text-left px-1.5 pt-1 pb-0.5 text-xs sm:text-[13px] font-bold text-slate-800 tracking-tight">
                    {dest.name}
                  </div>
                </div>

                {/* Hanging Flag Circular Pin beneath the card */}
                <div className="w-full flex justify-center -mb-3 mt-0.5">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden shadow-md ring-2 ring-white bg-slate-100 flex items-center justify-center">
                    <img
                      src={dest.flagUrl}
                      alt={dest.country}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --------------------------------------------------------- */}
          {/* WIDER NATURAL LANGUAGE INPUT CARD                         */}
          {/* --------------------------------------------------------- */}
          <div className="relative z-20 w-full max-w-3xl lg:max-w-4xl mx-auto bg-white rounded-3xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 text-left">
            {/* Expanded Search Input Pill */}
            <div className="relative flex items-center bg-[#F1F3F6] rounded-full px-5 sm:px-6 py-3 sm:py-3.5 focus-within:ring-2 focus-within:ring-slate-300 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={naturalLanguageInput}
                onChange={e => setNaturalLanguageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`${TYPEWRITER_PREFIX}${typewriterText}`}
                className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 text-sm sm:text-base font-normal focus:outline-none pr-3"
              />

              {naturalLanguageInput && (
                <button
                  type="button"
                  onClick={() => {
                    setNaturalLanguageInput('');
                    inputRef.current?.focus();
                  }}
                  className="mr-2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer p-1"
                  title="Clear input"
                >
                  ✕
                </button>
              )}

              {/* Circular Arrow Submit Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isBuilding}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#2F3542] hover:bg-slate-900 active:scale-95 text-white flex items-center justify-center shrink-0 transition-all shadow-xs cursor-pointer focus:outline-none"
                title="Generate Itinerary"
              >
                {isBuilding ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                )}
              </button>
            </div>

            {/* Prompt Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-3.5">
              {QUICK_SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(sug.prompt)}
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-xs font-medium text-slate-700 hover:text-slate-900 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs active:scale-98"
                >
                  <span className="text-emerald-500 font-bold text-xs">✨</span>
                  <span>{sug.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll link to operator curated section */}
        <div className="mt-8 flex flex-col items-center">
          <button
            type="button"
            onClick={() => curatedSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="text-xs text-slate-400 hover:text-slate-700 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer py-1.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200/80"
          >
            <span>Filter Operator Curated Packages</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
        </div>
      </section>

      {/* ============================================================= */}
      {/* CURATED PACKAGES SECTION: OPERATOR PACKAGES & USER CRITERIA   */}
      {/* ============================================================= */}
      <section
        ref={curatedSectionRef}
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-24 border-t border-slate-200/70 space-y-8"
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Curated Operator Packages
            </h2>
            <p className="text-xs text-slate-500">
              Verified luxury itineraries added directly by regional tour operators.
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-400">
            {filteredPackages.length} packages available
          </div>
        </div>

        {/* COMPACT & MINIMAL TRAVEL CRITERIA BAR */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
          {/* Row 1: Search Bar & Scope Toggle */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 w-full flex items-center bg-slate-50 rounded-xl px-3.5 py-2.5 focus-within:bg-white focus-within:ring-1 focus-within:ring-slate-200 transition-all">
              <span className="material-symbols-outlined text-slate-400 text-lg mr-2 shrink-0">search</span>
              <input
                type="text"
                value={curatedSearchQuery}
                onChange={e => setCuratedSearchQuery(e.target.value)}
                placeholder="Search destination, experience, or operator..."
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              {curatedSearchQuery && (
                <button
                  type="button"
                  onClick={() => setCuratedSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 text-xs ml-1 cursor-pointer"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Scope Toggle (Domestic / International) */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setScopeFilter('all')}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  scopeFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span className={`material-symbols-outlined text-xs ${scopeFilter === 'all' ? 'text-slate-800' : 'text-slate-400'}`}>public</span>
                <span>All</span>
              </button>
              <button
                type="button"
                onClick={() => setScopeFilter('domestic')}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  scopeFilter === 'domestic'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span className={`material-symbols-outlined text-xs ${scopeFilter === 'domestic' ? 'text-slate-800' : 'text-slate-400'}`}>location_on</span>
                <span>Domestic (India)</span>
              </button>
              <button
                type="button"
                onClick={() => setScopeFilter('international')}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  scopeFilter === 'international'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span className={`material-symbols-outlined text-xs ${scopeFilter === 'international' ? 'text-slate-800' : 'text-slate-400'}`}>flight</span>
                <span>International</span>
              </button>
            </div>
          </div>

          {/* Row 2: Compact Parameter Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
            {/* 1. Budget */}
            <div className="bg-slate-50 px-3 py-2 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
                  <span className="material-symbols-outlined text-xs text-slate-400">payments</span>
                  <span>Budget</span>
                </div>
                <span className="text-xs font-bold text-slate-900">{formatINR(maxBudgetINR)}</span>
              </div>
              <input
                type="range"
                min={100000}
                max={500000}
                step={25000}
                value={maxBudgetINR}
                onChange={e => setMaxBudgetINR(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
              />
            </div>

            {/* 2. Custom Travelers Dropdown */}
            <div ref={travelersRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsTravelersOpen(prev => !prev);
                  setIsDurationOpen(false);
                  setIsDatePickerOpen(false);
                }}
                className="w-full bg-slate-50 hover:bg-slate-100/70 rounded-xl px-3 py-2 text-left flex items-center justify-between cursor-pointer transition-all focus:outline-none"
              >
                <div className="flex flex-col min-w-0 pr-1">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
                    <span className="material-symbols-outlined text-xs text-slate-400">group</span>
                    <span>Travelers</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {TRAVELER_OPTIONS.find(o => o.value === travelersCount)?.label || `${travelersCount} Travelers`}
                  </span>
                </div>
                <span className={`material-symbols-outlined text-xs text-slate-400 shrink-0 transition-transform ${isTravelersOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {isTravelersOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-150 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {TRAVELER_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setTravelersCount(opt.value);
                        setIsTravelersOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                        travelersCount === opt.value ? 'bg-slate-50 font-bold' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-slate-400 text-sm">{opt.icon}</span>
                        <div>
                          <div className={`text-xs font-bold ${travelersCount === opt.value ? 'text-slate-900' : 'text-slate-800'}`}>
                            {opt.label}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {opt.subtitle}
                          </div>
                        </div>
                      </div>
                      {travelersCount === opt.value && (
                        <span className="material-symbols-outlined text-sm text-slate-800">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Custom Date Picker Calendar */}
            <div ref={datePickerRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsDatePickerOpen(prev => !prev);
                  setIsTravelersOpen(false);
                  setIsDurationOpen(false);
                }}
                className="w-full bg-slate-50 hover:bg-slate-100/70 rounded-xl px-3 py-2 text-left flex items-center justify-between cursor-pointer transition-all focus:outline-none"
              >
                <div className="flex flex-col min-w-0 pr-1">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
                    <span className="material-symbols-outlined text-xs text-slate-400">calendar_today</span>
                    <span>Start Date</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {formatDisplayDate(travelDate)}
                  </span>
                </div>
                <span className={`material-symbols-outlined text-xs text-slate-400 shrink-0 transition-transform ${isDatePickerOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {isDatePickerOpen && (
                <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-150 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-100 select-none">
                  {/* Month & Year Navigation */}
                  <div className="flex items-center justify-between mb-2.5 px-1">
                    <span className="text-xs font-extrabold text-slate-900">
                      {CALENDAR_MONTHS[calMonth]} {calYear}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          if (calMonth === 0) {
                            setCalMonth(11);
                            setCalYear(prev => prev - 1);
                          } else {
                            setCalMonth(prev => prev - 1);
                          }
                        }}
                        className="w-6 h-6 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                      </button>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          if (calMonth === 11) {
                            setCalMonth(0);
                            setCalYear(prev => prev + 1);
                          } else {
                            setCalMonth(prev => prev + 1);
                          }
                        }}
                        className="w-6 h-6 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </button>
                    </div>
                  </div>

                  {/* Days of Week Header */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-1">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                      <span key={d} className="text-[10px] font-bold text-slate-400">
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: new Date(calYear, calMonth, 1).getDay() }).map((_, i) => (
                      <span key={`blank-${i}`} className="w-8 h-8" />
                    ))}

                    {Array.from({ length: new Date(calYear, calMonth + 1, 0).getDate() }).map((_, i) => {
                      const dayNum = i + 1;
                      const m = String(calMonth + 1).padStart(2, '0');
                      const d = String(dayNum).padStart(2, '0');
                      const dateString = `${calYear}-${m}-${d}`;
                      const isSelected = travelDate === dateString;

                      return (
                        <button
                          key={dayNum}
                          type="button"
                          onClick={() => {
                            setTravelDate(dateString);
                            setIsDatePickerOpen(false);
                          }}
                          className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white font-bold shadow-xs'
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          {dayNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick shortcuts */}
                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        const y = today.getFullYear();
                        const m = String(today.getMonth() + 1).padStart(2, '0');
                        const d = String(today.getDate()).padStart(2, '0');
                        setCalYear(y);
                        setCalMonth(today.getMonth());
                        setTravelDate(`${y}-${m}-${d}`);
                        setIsDatePickerOpen(false);
                      }}
                      className="text-slate-800 hover:underline font-semibold cursor-pointer"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCalYear(2025);
                        setCalMonth(9);
                        setTravelDate('2025-10-14');
                        setIsDatePickerOpen(false);
                      }}
                      className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                    >
                      Oct 14, 2025
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Custom Duration Dropdown */}
            <div ref={durationRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsDurationOpen(prev => !prev);
                  setIsTravelersOpen(false);
                  setIsDatePickerOpen(false);
                }}
                className="w-full bg-slate-50 hover:bg-slate-100/70 rounded-xl px-3 py-2 text-left flex items-center justify-between cursor-pointer transition-all focus:outline-none"
              >
                <div className="flex flex-col min-w-0 pr-1">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400">
                    <span className="material-symbols-outlined text-xs text-slate-400">schedule</span>
                    <span>Duration</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {DURATION_OPTIONS.find(o => o.value === selectedDays)?.label || 'Any Duration'}
                  </span>
                </div>
                <span className={`material-symbols-outlined text-xs text-slate-400 shrink-0 transition-transform ${isDurationOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {isDurationOpen && (
                <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-slate-150 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {DURATION_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSelectedDays(opt.value);
                        setIsDurationOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                        selectedDays === opt.value ? 'bg-slate-50 font-bold' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-slate-400 text-sm">{opt.icon}</span>
                        <div>
                          <div className={`text-xs font-bold ${selectedDays === opt.value ? 'text-slate-900' : 'text-slate-800'}`}>
                            {opt.label}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {opt.subtitle}
                          </div>
                        </div>
                      </div>
                      {selectedDays === opt.value && (
                        <span className="material-symbols-outlined text-sm text-slate-800">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Filter Clear / Count Feedback (Only when filtered) */}
          {(maxBudgetINR < 500000 || selectedDays !== 'all' || scopeFilter !== 'all' || curatedSearchQuery) && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>
                Showing <strong className="text-slate-800">{filteredPackages.length}</strong> matching packages
              </span>
              <button
                type="button"
                onClick={() => {
                  setMaxBudgetINR(500000);
                  setSelectedDays('all');
                  setScopeFilter('all');
                  setCuratedSearchQuery('');
                }}
                className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* ----------------------------------------------------------- */}
        {/* OPERATOR CURATED PACKAGES GRID                              */}
        {/* ----------------------------------------------------------- */}
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPackages.map(pkg => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* OPERATOR ATTRIBUTION BAR (At top of each package) */}
                <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <img
                    src={pkg.operator.avatar}
                    alt={pkg.operator.leadDirector}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-xs shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-extrabold text-slate-900 truncate">
                        {pkg.operator.name}
                      </span>
                      <span className="material-symbols-outlined text-[13px] text-blue-600" title="Verified Operator">
                        verified
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium truncate">
                      Lead: <span className="font-semibold text-slate-700">{pkg.operator.leadDirector}</span> · ★ {pkg.operator.rating} ({pkg.operator.toursCount} tours)
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                    pkg.isDomestic 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}>
                    {pkg.isDomestic ? 'Domestic' : 'International'}
                  </span>
                </div>

                {/* Package Image & Badges */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.heroImage}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap max-w-[70%]">
                    {pkg.isNewlyCreated && (
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <span className="material-symbols-outlined text-[11px]">sparkles</span>
                        <span>Operator Published</span>
                      </span>
                    )}
                    <span className="bg-white/95 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                      {pkg.tag}
                    </span>
                  </div>
                  
                  <div className={`absolute top-3 right-3 ${pkg.badgeBg} text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs`}>
                    {pkg.badgeText}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-[11px] font-bold text-white/80">
                      {pkg.dates} · {pkg.days} Days · {travelersCount} Pax
                    </div>
                    <h3 className="text-base font-extrabold leading-snug line-clamp-1">
                      {pkg.title}
                    </h3>
                  </div>
                </div>

                {/* Package Details & Inclusions */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Route Stops */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {pkg.routeStops.map((stop, i) => (
                        <span
                          key={stop.city}
                          className="inline-flex items-center gap-1 text-[11px] bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-lg text-slate-700 font-semibold"
                        >
                          <span>{stop.city}</span>
                          {i < pkg.routeStops.length - 1 && (
                            <span className="text-slate-300">→</span>
                          )}
                        </span>
                      ))}
                    </div>

                    {/* Key Inclusions */}
                    <div className="space-y-1.5 text-xs text-slate-600">
                      {pkg.inclusions.map((inc, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-blue-600 text-sm shrink-0">
                            {inc.icon}
                          </span>
                          <span className="truncate">{inc.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Operator Dispatch Badge */}
                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Dispatch: {pkg.operator.dispatchHub}</span>
                      <span className="text-emerald-700 font-semibold">Live Monitoring</span>
                    </div>
                  </div>

                  {/* INR Pricing & CTA Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Package Price
                      </div>
                      <div className="text-lg font-black text-slate-900">
                        {formatINR(pkg.totalPriceINR)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {formatINR(Math.round(pkg.totalPriceINR / travelersCount))} / traveler
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectPremadeTrip(pkg.itineraryTemplate)}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span>Select & Customize</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Filter State */
          <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
              <span className="material-symbols-outlined text-2xl">search_off</span>
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No matching operator packages found
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn't find packages matching "{curatedSearchQuery || 'your criteria'}" under {formatINR(maxBudgetINR)} in the {scopeFilter} scope.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setMaxBudgetINR(500000);
                  setSelectedDays('all');
                  setScopeFilter('all');
                  setCuratedSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
