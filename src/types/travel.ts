export type ViewMode = 'consumer' | 'operator';

export type ConsumerTab = 'home' | 'trips' | 'vault' | 'discover' | 'bookings' | 'profile';

export type OperatorTab = 'overview' | 'tours' | 'operations' | 'customers' | 'vendors';

export interface TimelineEvent {
  id: string;
  day: number;
  time: string;
  originalTime?: string;
  category: 'flight' | 'transfer' | 'hotel' | 'lunch' | 'dinner' | 'activity';
  title: string;
  description: string;
  badge?: string;
  badgeColor?: 'emerald' | 'amber' | 'blue' | 'red' | 'gray';
  subBadge?: string;
  isDelayed?: boolean;
  delayText?: string;
  icon: string;
  pnr?: string;
  vehicle?: string;
  chauffeur?: string;
  bookingRef?: string;
  seats?: string;
  locationDetails?: string;
}

export interface DayItinerary {
  dayNumber: number;
  title: string;
  date: string;
  subtitle: string;
  eventsCount: number;
  events: TimelineEvent[];
}

export interface SavedJourney {
  id: string;
  title: string;
  origin: string;
  destination: string;
  dates: string;
  duration: string;
  travelers: number;
  price: string;
  image: string;
  description: string;
  category: 'domestic' | 'international';
  isBookmarked?: boolean;
  rating?: string;
  amenities?: Array<{ icon: string; label: string }>;
}

export interface CuratedDestination {
  id: string;
  title: string;
  country: string;
  region: string;
  description: string;
  startsFrom: string;
  image: string;
  isActivePreset?: boolean;
  rating?: string;
  amenities?: Array<{ icon: string; label: string }>;
  presetParams?: {
    destination: string;
    subLocations: string;
    days: number;
    dates: string;
    budget: number;
    travelers: number;
    travelStyle: string;
    interests: string[];
  };
}

export interface RippleStep {
  id: string;
  category: string;
  title: string;
  status: string;
  timeInfo: string;
  state: 'source' | 'shifted' | 'adjusted' | 'hold';
}

export interface DisruptionIssue {
  id: string;
  tourId: string;
  tourName: string;
  pnr: string;
  severity: 'critical' | 'high' | 'moderate';
  severityLabel: string;
  tMinus: string;
  impactedGroup: string;
  tier: string;
  rootCauseTitle: string;
  rootCauseDetail: string;
  downstreamConflictTitle: string;
  downstreamConflictDetail: string;
  aiRecommendation: string;
  chauffeurInfo: string;
  status: 'open' | 'resolved';
  deltaBudget?: string;
  actionText: string;
  rippleSteps: RippleStep[];
}

export interface DispatchTransfer {
  tourId: string;
  leadTraveler: string;
  pax: number;
  leg: string;
  vehicle: string;
  chauffeur: string;
  scheduledTime: string;
  isDelayed?: boolean;
  delayNote?: string;
  status: 'Rescheduling' | 'Driver Reassigned' | 'On Track' | 'Completed';
  statusColor: 'red' | 'blue' | 'emerald';
}

export interface RealtimeFeedEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  category: 'flight' | 'hotel' | 'driver' | 'tour';
  icon: string;
  iconBg: string;
  iconColor: string;
}
