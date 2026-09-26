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
import {
  parseInitialPrompt,
  generateProposalFromDetails,
  compileFinalItinerary,
  AITripDetails,
  AIGeneratedProposal,
  AIFlightOption,
  AIHotelOption,
  AITransferOption,
  AIActivityOption,
} from '../../utils/aiTripPlanner';
import { addCustomCatalogItems } from '../../data/itineraryData';
import { formatCurrency } from '../../utils/pricing';
import { USER_AVATAR } from '../../data/mockData';
import { LuxuryCard } from '../common/LuxuryCard';
import { getPackageAmenities } from '../../data/operatorPackagesData';

interface DiscoverScreenProps {
  onNavigateTab: (tab: ConsumerTab) => void;
  onSelectPremadeTrip: (itinerary: TripItinerary) => void;
  onGenerateAITrip: (params: AIGenerateParams) => void;
  onOpenAssistantWithPrompt?: (prompt: string) => void;
  onOpenPayment?: (itinerary: TripItinerary, totalPrice: number) => void;
  userName?: string;
  userAvatar?: string;
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
  onNavigateTab,
  onSelectPremadeTrip,
  onGenerateAITrip,
  onOpenAssistantWithPrompt,
  onOpenPayment,
  userName = 'Sarah Mehta',
  userAvatar = USER_AVATAR,
}) => {
  const { packages: operatorPackages } = useOperator();

  // Main natural language input state
  const [naturalLanguageInput, setNaturalLanguageInput] = useState<string>('');
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [planningFor, setPlanningFor] = useState<'you' | 'someone_else'>('you');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const curatedSectionRef = useRef<HTMLDivElement>(null);

  // AI Interactive Concierge State
  const [aiStage, setAiStage] = useState<'idle' | 'questions' | 'generating' | 'proposal'>('idle');
  const [aiDetails, setAiDetails] = useState<AITripDetails>({
    destination: 'Tokyo',
    country: 'Japan',
    days: 5,
    startDate: '2025-10-15',
    travelers: 2,
    travelStyle: 'Luxury Concierge',
    interests: ['Historical Heritage', 'Gourmet Dining', 'Wellness & Relaxation'],
  });
  const [aiProposal, setAiProposal] = useState<AIGeneratedProposal | null>(null);
  const [selectedFlightId, setSelectedFlightId] = useState<string>('');
  const [selectedHotelId, setSelectedHotelId] = useState<string>('');
  const [selectedTransferId, setSelectedTransferId] = useState<string>('');
  const [selectedExtraActivityIds, setSelectedExtraActivityIds] = useState<string[]>([]);
  const [activeAlternativeDrawer, setActiveAlternativeDrawer] = useState<'none' | 'flight' | 'hotel' | 'transfer'>('none');

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
    handleStartAI(promptText);
  };

  // AI Concierge Workflow: Open the AI Assistant page immediately with the prompt
  const handleStartAI = (promptText?: string) => {
    const raw = (promptText !== undefined ? promptText : naturalLanguageInput).trim();
    if (!raw) {
      textareaRef.current?.focus();
      return;
    }
    const finalPrompt = planningFor === 'someone_else'
      ? `${raw} (Note: Planning this journey for someone else)`
      : raw;

    // Instantly navigate to the AI Assistant page with the prompt
    if (onOpenAssistantWithPrompt) {
      onOpenAssistantWithPrompt(finalPrompt);
    } else {
      onNavigateTab('assistant');
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

  // AI Concierge Workflow: Generate Proposal from questions
  const handleGenerateProposal = () => {
    setIsBuilding(true);
    setAiStage('generating');
    setTimeout(() => {
      setIsBuilding(false);
      const proposal = generateProposalFromDetails(aiDetails);
      setAiProposal(proposal);
      setSelectedFlightId(proposal.selectedFlightId);
      setSelectedHotelId(proposal.selectedHotelId);
      setSelectedTransferId(proposal.selectedTransferId);
      setSelectedExtraActivityIds([]);
      setActiveAlternativeDrawer('none');
      setAiStage('proposal');
    }, 850);
  };

  // AI Concierge Workflow: Confirm and open in Itinerary Builder
  const handleConfirmAndOpenInBuilder = () => {
    if (!aiProposal) return;
    const finalItinerary = compileFinalItinerary(
      aiProposal,
      selectedFlightId,
      selectedHotelId,
      selectedTransferId,
      selectedExtraActivityIds
    );
    // Register all AI extra activities into the Itinerary Builder catalog
    if (aiProposal.extraActivities && aiProposal.extraActivities.length > 0) {
      addCustomCatalogItems(aiProposal.extraActivities);
    }
    // Launch builder
    onSelectPremadeTrip(finalItinerary);
  };

  // Reset AI flow back to idle
  const handleResetAI = () => {
    setAiStage('idle');
    setAiProposal(null);
    setActiveAlternativeDrawer('none');
  };

  // Key down on textarea / input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleStartAI();
    }
  };

  // Dynamic pricing computation for Proposal stage
  const proposalPricing = useMemo(() => {
    if (!aiProposal) {
      return {
        totalUSD: 0,
        perPersonUSD: 0,
        priceDeltaUSD: 0,
        nights: 1,
        chosenFlight: null,
        chosenHotel: null,
        chosenTransfer: null,
      };
    }

    const chosenFlight = aiProposal.flights.find(f => f.id === selectedFlightId) || aiProposal.flights[0];
    const chosenHotel = aiProposal.hotels.find(h => h.id === selectedHotelId) || aiProposal.hotels[0];
    const chosenTransfer = aiProposal.transfers.find(t => t.id === selectedTransferId) || aiProposal.transfers[0];

    const nights = Math.max(1, aiProposal.days - 1);
    const flightTotal = chosenFlight.priceUSD * aiProposal.travelers;
    const hotelTotal = chosenHotel.pricePerNightUSD * nights;
    const activitiesBase = 180 * aiProposal.days;
    const transferDelta = chosenTransfer.priceDeltaUSD;

    const extrasTotal = aiProposal.extraActivities
      .filter(act => selectedExtraActivityIds.includes(act.id))
      .reduce((sum, act) => sum + act.price, 0);

    const totalUSD = flightTotal + hotelTotal + activitiesBase + transferDelta + extrasTotal;
    const perPersonUSD = Math.round(totalUSD / aiProposal.travelers);
    const priceDeltaUSD = totalUSD - aiProposal.basePriceUSD;

    return {
      totalUSD,
      perPersonUSD,
      priceDeltaUSD,
      nights,
      chosenFlight,
      chosenHotel,
      chosenTransfer,
    };
  }, [aiProposal, selectedFlightId, selectedHotelId, selectedTransferId, selectedExtraActivityIds]);

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
          {/* DYNAMIC EXPANDING AI NATURAL LANGUAGE CARD                */}
          {/* --------------------------------------------------------- */}
          <div className="relative z-20 w-full max-w-3xl lg:max-w-4xl mx-auto bg-white rounded-3xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 text-left transition-all duration-300">
            
            {/* ======================================================= */}
            {/* STAGE 0: IDLE / TYPING (EXPANDING TEXTBOX)             */}
            {/* ======================================================= */}
            {aiStage === 'idle' && (
              <>
                {/* Unified Butter-Smooth Expanding Input Container */}
                <div
                  className={`relative flex flex-col bg-[#F1F3F6] transition-all duration-300 ease-out border border-transparent focus-within:border-slate-300 focus-within:bg-[#EEF1F5] ${
                    naturalLanguageInput.trim().length > 0
                      ? 'rounded-[20px] p-4 sm:p-5 min-h-[125px] shadow-inner'
                      : 'rounded-[28px] px-5 sm:px-6 py-2 sm:py-2.5 min-h-[54px] sm:min-h-[58px]'
                  }`}
                >
                  {/* Textarea & Top/Inline Action */}
                  <div className="flex items-start justify-between gap-3 w-full">
                    <textarea
                      ref={textareaRef}
                      value={naturalLanguageInput}
                      onChange={e => setNaturalLanguageInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={naturalLanguageInput.trim().length > 0 ? 2 : 1}
                      placeholder={
                        naturalLanguageInput.trim().length > 0
                          ? 'Describe your ideal journey (e.g. 5 days in Tokyo with luxury ryokan, temples, and Michelin sushi)...'
                          : `${TYPEWRITER_PREFIX}${typewriterText}`
                      }
                      className={`w-full bg-transparent text-slate-800 placeholder:text-slate-400 text-sm sm:text-base font-normal focus:outline-none resize-none leading-relaxed transition-all duration-200 ${
                        naturalLanguageInput.trim().length > 0
                          ? 'min-h-[54px] pt-0.5'
                          : 'h-[32px] leading-[32px] overflow-hidden'
                      }`}
                      autoFocus={naturalLanguageInput.trim().length > 0}
                    />

                    {/* Idle State: Plan button inside pill row */}
                    {naturalLanguageInput.trim().length === 0 ? (
                      <button
                        type="button"
                        onClick={() => handleStartAI()}
                        disabled={isBuilding}
                        className="px-5 py-2 rounded-full bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer transition-all active:scale-95"
                        title="Plan"
                      >
                        <span>Plan</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    ) : (
                      /* Typing State: Clear button at top right */
                      <button
                        type="button"
                        onClick={() => {
                          setNaturalLanguageInput('');
                          textareaRef.current?.focus();
                        }}
                        className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer p-1 shrink-0 rounded transition-colors"
                        title="Clear input"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Typing State: Bottom Helper Bar with Plan button */}
                  {naturalLanguageInput.trim().length > 0 && (
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 mt-2 animate-in fade-in duration-200">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <span>Press</span>
                        <kbd className="font-mono bg-white px-1.5 py-0.5 rounded text-[10px] text-slate-600 border border-slate-200 shadow-2xs font-semibold">
                          Enter ↵
                        </kbd>
                        <span>to plan</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartAI()}
                        className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
                      >
                        <span>Plan</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* User Identity & For You / For Someone Else Toggle */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 px-1">
                  {/* User Profile Info */}
                  <div className="flex items-center gap-2.5">
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 shadow-2xs"
                    />
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-semibold text-slate-800">{userName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 font-normal">
                        {planningFor === 'you' ? 'Planning for yourself' : 'Planning for someone else'}
                      </span>
                    </div>
                  </div>

                  {/* Toggle: For you / For someone else */}
                  <div className="flex items-center bg-[#F1F3F6] p-1 rounded-full border border-slate-200/70 text-xs">
                    <button
                      type="button"
                      onClick={() => setPlanningFor('you')}
                      className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                        planningFor === 'you'
                          ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800 font-medium'
                      }`}
                    >
                      For you
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlanningFor('someone_else')}
                      className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                        planningFor === 'someone_else'
                          ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800 font-medium'
                      }`}
                    >
                      For someone else
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ======================================================= */}
            {/* STAGE 1: ASK QUESTIONS TO THE USER (REQUIREMENT 1)      */}
            {/* ======================================================= */}
            {aiStage === 'questions' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Header */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-amber-400 flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-lg">auto_awesome</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">TripFlow AI Concierge</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                          Step 1: Clarifying Trip Details
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Tailoring a bespoke journey for{' '}
                        <span className="font-semibold text-slate-800">
                          {aiDetails.destination}, {aiDetails.country}
                        </span>
                        . Select your preferences below:
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetAI}
                    className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                    <span>Exit</span>
                  </button>
                </div>

                {/* Question 1: Duration */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-slate-400">calendar_today</span>
                    Trip Duration
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { days: 3, label: '3 Days', sub: 'Weekend Escape' },
                      { days: 5, label: '5 Days', sub: 'Signature Circuit' },
                      { days: 7, label: '7 Days', sub: 'Immersive Journey' },
                      { days: 10, label: '10 Days', sub: 'Grand Explorer' },
                    ].map(opt => (
                      <button
                        key={opt.days}
                        type="button"
                        onClick={() => setAiDetails(prev => ({ ...prev, days: opt.days }))}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          aiDetails.days === opt.days
                            ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs font-bold">{opt.label}</div>
                        <div
                          className={`text-[10px] ${
                            aiDetails.days === opt.days ? 'text-slate-300' : 'text-slate-400'
                          }`}
                        >
                          {opt.sub}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 2: Who is traveling */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-slate-400">group</span>
                    Travel Party
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { count: 1, label: 'Solo Traveler', icon: 'person' },
                      { count: 2, label: 'Couple / Duo', icon: 'favorite' },
                      { count: 4, label: 'Family (4 Pax)', icon: 'family_restroom' },
                      { count: 6, label: 'Group (6+ Pax)', icon: 'groups' },
                    ].map(opt => (
                      <button
                        key={opt.count}
                        type="button"
                        onClick={() => setAiDetails(prev => ({ ...prev, travelers: opt.count }))}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                          aiDetails.travelers === opt.count
                            ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-base ${
                            aiDetails.travelers === opt.count ? 'text-amber-400' : 'text-slate-400'
                          }`}
                        >
                          {opt.icon}
                        </span>
                        <span className="text-xs font-semibold">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 3: Travel Style */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-slate-400">diamond</span>
                    Travel Tier & Accommodation Style
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      {
                        id: 'Luxury Concierge',
                        label: 'Ultra Luxury 5-Star',
                        sub: 'Palaces, penthouses & private butler service',
                      },
                      {
                        id: 'Boutique Heritage',
                        label: 'Boutique Heritage & Charm',
                        sub: 'Handcrafted villas & authentic culture',
                      },
                      {
                        id: 'Balanced Comfort',
                        label: 'Balanced Luxury Comfort',
                        sub: 'Top-rated stays & relaxed pacing',
                      },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setAiDetails(prev => ({ ...prev, travelStyle: opt.id as any }))}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          aiDetails.travelStyle === opt.id
                            ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs font-bold">{opt.label}</div>
                        <div
                          className={`text-[10px] mt-0.5 ${
                            aiDetails.travelStyle === opt.id ? 'text-slate-300' : 'text-slate-400'
                          }`}
                        >
                          {opt.sub}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 4: Primary Interests */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-slate-400">interests</span>
                    Curated Interests (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Historical Heritage',
                      'Gourmet Dining',
                      'Wellness & Relaxation',
                      'Scenic Nature & Wildlife',
                      'Modern City & Nightlife',
                    ].map(interest => {
                      const isSelected = aiDetails.interests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => {
                            setAiDetails(prev => ({
                              ...prev,
                              interests: isSelected
                                ? prev.interests.filter(i => i !== interest)
                                : [...prev.interests, interest],
                            }));
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleResetAI}
                    className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateProposal}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-xs hover:shadow transition-all cursor-pointer active:scale-98"
                  >
                    <span>Generate Itinerary with Options</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* STAGE 2: GENERATING ANIMATION                           */}
            {/* ======================================================= */}
            {aiStage === 'generating' && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-md animate-bounce">
                  <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Synthesizing Your Bespoke Itinerary</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Matching flight availability, boutique suites & private chauffeurs in{' '}
                    <span className="font-semibold text-slate-700">{aiDetails.destination}</span>...
                  </p>
                </div>
                <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 rounded-full animate-pulse w-3/4" />
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* STAGE 3: ITINERARY PROPOSAL & ALTERNATIVES (REQ 2, 3, 4)*/}
            {/* ======================================================= */}
            {aiStage === 'proposal' && aiProposal && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-3">
                    <img
                      src={aiProposal.heroImage}
                      alt={aiProposal.destination}
                      className="w-16 h-16 rounded-2xl object-cover shadow-xs shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ✨ AI Custom Proposal
                        </span>
                        <span className="text-xs text-slate-400">
                          {aiProposal.days} Days · {aiProposal.travelers} Guests
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                        {aiProposal.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {aiProposal.summary}
                      </p>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="text-right sm:shrink-0 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                    <div className="text-[11px] text-slate-400 font-medium">Estimated Total</div>
                    <div className="text-lg font-black text-slate-900">
                      ${proposalPricing.totalUSD.toLocaleString()}{' '}
                      <span className="text-xs font-normal text-slate-500">
                        (${proposalPricing.perPersonUSD.toLocaleString()}/person)
                      </span>
                    </div>
                    {proposalPricing.priceDeltaUSD !== 0 && (
                      <div
                        className={`text-[10px] font-bold mt-0.5 ${
                          proposalPricing.priceDeltaUSD > 0 ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        {proposalPricing.priceDeltaUSD > 0
                          ? `+$${proposalPricing.priceDeltaUSD.toLocaleString()} (Upgraded Options)`
                          : `-$${Math.abs(proposalPricing.priceDeltaUSD).toLocaleString()} (Cheaper Alternatives)`}
                      </div>
                    )}
                  </div>
                </div>

                {/* --------------------------------------------------- */}
                {/* INTERACTIVE LOGISTICS BENTO: FLIGHT, HOTEL, CAR     */}
                {/* --------------------------------------------------- */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-slate-400">tune</span>
                      1. Select Your Flights, Stays & Chauffeur
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Click any card to switch to alternatives
                    </span>
                  </div>

                  {/* 1. FLIGHT SELECTOR CARD */}
                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                    <div className="p-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm">flight</span>
                        </span>
                        <div>
                          <span className="text-xs font-bold text-slate-800">Flight Selection: </span>
                          <span className="text-xs text-slate-600">
                            {proposalPricing.chosenFlight?.airline} ({proposalPricing.chosenFlight?.flightNumber})
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveAlternativeDrawer(prev => (prev === 'flight' ? 'none' : 'flight'))
                        }
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <span>
                          {activeAlternativeDrawer === 'flight'
                            ? 'Hide Alternatives'
                            : '⇄ Switch Flight (3 Options)'}
                        </span>
                        <span className="material-symbols-outlined text-sm">
                          {activeAlternativeDrawer === 'flight' ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>
                    </div>

                    {/* Active Flight Preview */}
                    <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {proposalPricing.chosenFlight?.originCode} ➔ {proposalPricing.chosenFlight?.destCode}
                          </span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                            {proposalPricing.chosenFlight?.cabinClass}
                          </span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                            {proposalPricing.chosenFlight?.badge}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px]">
                          Departure: {proposalPricing.chosenFlight?.departureTime} · Duration:{' '}
                          {proposalPricing.chosenFlight?.duration} ({proposalPricing.chosenFlight?.stops}) ·{' '}
                          {proposalPricing.chosenFlight?.baggage}
                        </p>
                      </div>

                      <div className="text-right sm:shrink-0">
                        <span className="text-sm font-bold text-slate-900">
                          ${proposalPricing.chosenFlight?.priceUSD}
                        </span>
                        <span className="text-[10px] text-slate-400 block">/ traveler</span>
                      </div>
                    </div>

                    {/* Flight Alternatives Drawer */}
                    {activeAlternativeDrawer === 'flight' && (
                      <div className="p-3.5 bg-slate-50/90 border-t border-slate-100 space-y-2 animate-in fade-in duration-150">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Choose Alternative Flight Option:
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {aiProposal.flights.map(flt => {
                            const isSelected = selectedFlightId === flt.id;
                            return (
                              <div
                                key={flt.id}
                                onClick={() => {
                                  setSelectedFlightId(flt.id);
                                  setActiveAlternativeDrawer('none');
                                }}
                                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                  isSelected
                                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                      isSelected
                                        ? 'border-blue-600 bg-blue-600 text-white'
                                        : 'border-slate-300 bg-white'
                                    }`}
                                  >
                                    {isSelected && <span className="text-[9px] font-bold">✓</span>}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-xs text-slate-900">
                                        {flt.airline} ({flt.flightNumber})
                                      </span>
                                      <span
                                        className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                                          flt.type === 'cheaper'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : flt.type === 'luxury'
                                            ? 'bg-amber-100 text-amber-800'
                                            : 'bg-slate-100 text-slate-700'
                                        }`}
                                      >
                                        {flt.label}
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-slate-500 mt-0.5">
                                      {flt.departureTime} – {flt.arrivalTime} · {flt.duration} ({flt.stops}) ·{' '}
                                      {flt.cabinClass}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <div className="text-xs font-bold text-slate-900">${flt.priceUSD}</div>
                                  <div className="text-[10px] text-slate-400">
                                    {flt.priceDeltaUSD === 0
                                      ? 'Base Rate'
                                      : flt.priceDeltaUSD > 0
                                      ? `+$${flt.priceDeltaUSD}`
                                      : `-$${Math.abs(flt.priceDeltaUSD)}`}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. HOTEL SELECTOR CARD */}
                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                    <div className="p-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm">hotel</span>
                        </span>
                        <div>
                          <span className="text-xs font-bold text-slate-800">Hotel Selection: </span>
                          <span className="text-xs text-slate-600">
                            {proposalPricing.chosenHotel?.name}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveAlternativeDrawer(prev => (prev === 'hotel' ? 'none' : 'hotel'))
                        }
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <span>
                          {activeAlternativeDrawer === 'hotel'
                            ? 'Hide Alternatives'
                            : '⇄ Switch Hotel (3 Options)'}
                        </span>
                        <span className="material-symbols-outlined text-sm">
                          {activeAlternativeDrawer === 'hotel' ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>
                    </div>

                    {/* Active Hotel Preview */}
                    <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-start gap-3">
                        <img
                          src={proposalPricing.chosenHotel?.image}
                          alt={proposalPricing.chosenHotel?.name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-2xs"
                        />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {proposalPricing.chosenHotel?.name}
                            </span>
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700">
                              ★ {proposalPricing.chosenHotel?.rating} ({proposalPricing.chosenHotel?.reviewsCount})
                            </span>
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                              {proposalPricing.chosenHotel?.label}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px]">
                            {proposalPricing.chosenHotel?.roomType} · {proposalPricing.chosenHotel?.location}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {proposalPricing.chosenHotel?.perks.slice(0, 3).map((p, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded"
                              >
                                ✓ {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="text-right sm:shrink-0">
                        <span className="text-sm font-bold text-slate-900">
                          ${proposalPricing.chosenHotel?.pricePerNightUSD}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          / night × {proposalPricing.nights} nights
                        </span>
                      </div>
                    </div>

                    {/* Hotel Alternatives Drawer */}
                    {activeAlternativeDrawer === 'hotel' && (
                      <div className="p-3.5 bg-slate-50/90 border-t border-slate-100 space-y-2 animate-in fade-in duration-150">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Choose Alternative Accommodation:
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {aiProposal.hotels.map(htl => {
                            const isSelected = selectedHotelId === htl.id;
                            return (
                              <div
                                key={htl.id}
                                onClick={() => {
                                  setSelectedHotelId(htl.id);
                                  setActiveAlternativeDrawer('none');
                                }}
                                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                  isSelected
                                    ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                      isSelected
                                        ? 'border-blue-600 bg-blue-600 text-white'
                                        : 'border-slate-300 bg-white'
                                    }`}
                                  >
                                    {isSelected && <span className="text-[9px] font-bold">✓</span>}
                                  </div>
                                  <img
                                    src={htl.image}
                                    alt={htl.name}
                                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                                  />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-xs text-slate-900">{htl.name}</span>
                                      <span
                                        className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                                          htl.type === 'cheaper'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : htl.type === 'luxury'
                                            ? 'bg-amber-100 text-amber-800'
                                            : 'bg-slate-100 text-slate-700'
                                        }`}
                                      >
                                        {htl.label}
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-slate-500 mt-0.5">
                                      {htl.roomType} · ★ {htl.rating} · {htl.perks.slice(0, 2).join(' · ')}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <div className="text-xs font-bold text-slate-900">
                                    ${htl.pricePerNightUSD}/nt
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {htl.priceDeltaPerNightUSD === 0
                                      ? 'Base Choice'
                                      : htl.priceDeltaPerNightUSD > 0
                                      ? `+$${htl.priceDeltaPerNightUSD}/nt`
                                      : `-$${Math.abs(htl.priceDeltaPerNightUSD)}/nt`}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. CHAUFFEUR & FLEET CARD */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-3.5 flex items-center justify-between text-xs shadow-2xs">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-base">directions_car</span>
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">
                            Private Chauffeur: {proposalPricing.chosenTransfer?.vehicle}
                          </span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                            ★ {proposalPricing.chosenTransfer?.rating} Verified
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {proposalPricing.chosenTransfer?.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                        Included
                      </span>
                    </div>
                  </div>
                </div>

                {/* --------------------------------------------------- */}
                {/* DAY-BY-DAY SCHEDULE PREVIEW                         */}
                {/* --------------------------------------------------- */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-slate-400">route</span>
                    2. Daily Flow & Signature Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {aiProposal.schedulePreview.map(day => (
                      <div
                        key={day.dayNumber}
                        className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-1.5 text-xs text-left"
                      >
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-mono">
                            {day.dayNumber}
                          </span>
                          <span className="line-clamp-1">{day.title}</span>
                        </div>
                        <ul className="space-y-1 pl-6 list-disc text-slate-500 text-[11px]">
                          {day.highlights.map((h, i) => (
                            <li key={i} className="line-clamp-1">
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* --------------------------------------------------- */}
                {/* AI-GENERATED EXTRA ACTIVITIES (REQUIREMENT 4)       */}
                {/* --------------------------------------------------- */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="text-amber-500 text-sm">✨</span>
                        3. AI Recommended Extra Experiences
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Select any to add directly to your schedule now, or find them ready in the Itinerary
                        Builder catalog.
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">
                      {selectedExtraActivityIds.length} Added
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {aiProposal.extraActivities.map(act => {
                      const isAdded = selectedExtraActivityIds.includes(act.id);
                      return (
                        <div
                          key={act.id}
                          className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-all ${
                            isAdded
                              ? 'border-emerald-500 bg-emerald-50/30 shadow-xs ring-1 ring-emerald-500'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={act.image}
                              alt={act.title}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-2xs"
                            />
                            <div className="min-w-0">
                              <h5 className="font-bold text-slate-900 text-xs line-clamp-1">
                                {act.title}
                              </h5>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <span className="capitalize">{act.category}</span>
                                <span>•</span>
                                <span>{act.duration}</span>
                                <span>•</span>
                                <span className="text-amber-600 font-semibold">★ {act.rating}</span>
                              </div>
                              <div className="text-xs font-bold text-slate-900 mt-0.5">
                                ${act.price}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedExtraActivityIds(prev =>
                                isAdded ? prev.filter(id => id !== act.id) : [...prev, act.id]
                              );
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                              isAdded
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {isAdded ? '✓ Added' : '+ Add'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* --------------------------------------------------- */}
                {/* BOTTOM CONFIRMATION & LAUNCH IN BUILDER (REQ 3)     */}
                {/* --------------------------------------------------- */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAiStage('questions')}
                      className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_back</span>
                      <span>Edit Preferences</span>
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={handleResetAI}
                      className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      Exit to Discover
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-black text-slate-900">
                        ${proposalPricing.totalUSD.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">Total for all travelers</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!aiProposal) return;
                        const finalItinerary = compileFinalItinerary(
                          aiProposal,
                          selectedFlightId,
                          selectedHotelId,
                          selectedTransferId,
                          selectedExtraActivityIds
                        );
                        if (aiProposal.extraActivities && aiProposal.extraActivities.length > 0) {
                          addCustomCatalogItems(aiProposal.extraActivities);
                        }
                        if (onOpenPayment) {
                          onOpenPayment(finalItinerary, proposalPricing.totalUSD);
                        } else {
                          handleConfirmAndOpenInBuilder();
                        }
                      }}
                      className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
                    >
                      <span className="material-symbols-outlined text-base">lock</span>
                      <span>Reserve Tour</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmAndOpenInBuilder}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-black hover:to-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
                    >
                      <span>Customize in Builder</span>
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {filteredPackages.map(pkg => (
              <LuxuryCard
                key={pkg.id}
                id={pkg.id}
                title={pkg.title}
                description={`${pkg.days} Days · ${pkg.destination} · Curated by ${pkg.operator.name}`}
                image={pkg.heroImage}
                rating={`${pkg.operator.rating}/5`}
                kicker={`${pkg.operator.name} · ${pkg.destination}`}
                badge={pkg.isNewlyCreated ? 'Operator Published' : pkg.badgeText}
                badgeColor={pkg.isDomestic ? 'emerald' : 'dark'}
                amenities={getPackageAmenities(pkg)}
                price={`₹${pkg.totalPriceINR.toLocaleString('en-IN')}`}
                pricePeriod="/package"
                actionVariant="button"
                actionLabel="Reserve Tour"
                theme="light"
                className="w-full max-w-[340px]"
                onActionClick={() => {
                  if (onOpenPayment) {
                    onOpenPayment(pkg.itineraryTemplate, pkg.totalPriceINR);
                  } else {
                    onSelectPremadeTrip(pkg.itineraryTemplate);
                  }
                }}
                onClick={() => onSelectPremadeTrip(pkg.itineraryTemplate)}
              />
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
