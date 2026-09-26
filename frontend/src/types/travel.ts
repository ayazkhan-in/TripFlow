import { TripItinerary } from './itinerary';

export type ViewMode = 'consumer' | 'operator';

export type ConsumerTab = 'home' | 'builder' | 'trips' | 'vault' | 'discover' | 'bookings' | 'profile' | 'assistant';

export interface BookedTrip {
  id: string;
  title: string;
  destination: string;
  dates: string;
  duration: string;
  travelers: number;
  totalPrice: number;
  currency: string;
  status: 'Confirmed' | 'In Progress' | 'Upcoming' | 'Completed';
  bookingRef: string;
  bookedAt: string;
  heroImage: string;
  flightDetails: {
    airline: string;
    flightNumber: string;
    pnr: string;
    route: string;
    departureTime: string;
    arrivalTime: string;
    terminal: string;
    gate?: string;
    seat: string;
    baggage: string;
    status: 'On Time' | 'Confirmed' | 'Delayed';
  };
  hotelCheckIn: {
    hotelName: string;
    roomType: string;
    checkInDate: string;
    checkInTime: string;
    checkOutDate: string;
    voucherRef: string;
    address: string;
    inclusions: string[];
    nights: number;
  };
  carDetails: {
    vehicleType: string;
    vehicleModel: string;
    licensePlate: string;
    chauffeurName: string;
    chauffeurPhone: string;
    chauffeurRating: string;
    pickupLocation: string;
    pickupTime: string;
    serviceScope: string;
    gpsTrackingActive: boolean;
  };
  itinerary: TripItinerary;
}

export type OperatorTab =
  | 'hub'
  | 'packages'
  | 'bookings'
  | 'flight_bookings'
  | 'stay_bookings'
  | 'transfer_bookings'
  | 'activity_bookings'
  | 'vendors'
  | 'cohorts'
  | 'guides'
  | 'alerts'
  | 'payments'
  | 'calendar'
  // Legacy aliases
  | 'overview'
  | 'tours'
  | 'operations'
  | 'customers';

export interface BookingCustomizationDetail {
  isCustomized: boolean;
  basePackageTitle?: string;
  basePrice?: number;
  customPrice?: number;
  deltaPrice?: number;
  customRequests?: string;
  dietaryRestrictions?: string;
  transferPreference?: string;
  roomPreference?: string;
  customItemsAdded?: Array<{
    id: string;
    title: string;
    category: string;
    dayNumber: number;
    price: number;
    description?: string;
    location?: string;
  }>;
  upgrades?: string[];
  fulfillmentStatus: {
    hotelBooked: boolean;
    flightBooked: boolean;
    transferBooked: boolean;
    activityBooked: boolean;
    guideAssigned: boolean;
  };
}

export interface BookingItem {
  id: string;
  ref: string;
  guestName: string;
  guestEmail: string;
  tourTitle: string;
  destination: string;
  dates: string;
  guestsCount: number;
  status: 'Confirmed' | 'Pending' | 'Waitlist' | 'Cancelled';
  amount: number;
  roomsAllocated: string;
  flightAllocated: string;
  vipStatus?: boolean;
  notes?: string;
  bookedAt: string;
  isCustomized?: boolean;
  customization?: BookingCustomizationDetail;
  itinerarySnapshot?: TripItinerary;
  needsFulfillment?: boolean;
}

export interface VendorSupplyItem {
  id: string;
  name: string;
  category: 'hotel' | 'flight' | 'train' | 'fleet' | 'dining' | 'experience';
  region: string;
  rating: number;
  slaCompliance: number;
  activeContracts: number;
  contactPerson: string;
  phone: string;
  email: string;
  status: 'Active' | 'Under Review' | 'Suspended';
  contractRenewal: string;
  image?: string;
}

export interface TourCohortItem {
  id: string;
  name: string;
  circuit: string;
  dates: string;
  leadGuide: string;
  guideAvatar?: string;
  paxCount: number;
  maxPax: number;
  progressPercent: number;
  currentStop: string;
  nextMilestone: string;
  status: 'In Progress' | 'Upcoming' | 'Completed';
  vipCount: number;
}

export interface TourGuideStaffItem {
  id: string;
  name: string;
  role: 'Master Guide' | 'Private Concierge' | 'Licensed Chauffeur' | 'Cultural Specialist';
  languages: string[];
  rating: number;
  totalTours: number;
  status: 'On Tour' | 'Available' | 'Off-Duty';
  currentTour?: string;
  location: string;
  phone: string;
  avatar: string;
  certifications: string[];
}

export interface ItineraryAlertItem {
  id: string;
  tourId: string;
  tourTitle: string;
  severity: 'critical' | 'high' | 'moderate' | 'resolved';
  title: string;
  description: string;
  affectedTravelers: number;
  timeAgo: string;
  category: 'flight' | 'weather' | 'transport' | 'hotel' | 'medical';
  actionSuggested: string;
  isResolved: boolean;
}

export interface PaymentLedgerItem {
  id: string;
  transactionRef: string;
  tourId: string;
  party: string;
  type: 'inbound' | 'outbound' | 'escrow';
  amount: number;
  currency: string;
  status: 'Settled' | 'Processing' | 'Held' | 'Failed';
  date: string;
  paymentMethod: string;
  description: string;
}

export interface CalendarTourEvent {
  id: string;
  title: string;
  tourId: string;
  date: string;
  time: string;
  type: 'departure' | 'checkin' | 'transfer' | 'experience' | 'return';
  location: string;
  cohort: string;
  color: string;
  pax: number;
}

export interface TimelineEvent {
  id: string;
  day: number;
  time: string;
  originalTime?: string;
  category: 'flight' | 'transfer' | 'hotel' | 'lunch' | 'dinner' | 'dining' | 'activity';
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
