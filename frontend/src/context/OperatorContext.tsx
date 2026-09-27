import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BookingItem,
  BookingCustomizationDetail,
  BookedTrip,
  VendorSupplyItem,
  TourCohortItem,
  TourGuideStaffItem,
  PaymentLedgerItem,
  CalendarTourEvent,
} from '../types/travel';
import {
  OPERATOR_FLIGHT_TICKETS,
  OPERATOR_STAY_BOOKINGS,
  OPERATOR_TRANSFER_BOOKINGS,
  OPERATOR_ACTIVITY_BOOKINGS,
  OperatorFlightTicket,
  OperatorStayBooking,
  OperatorTransferBooking,
  OperatorActivityBooking,
} from '../data/operatorBookingsData';
import {
  OPERATOR_BOOKINGS,
  OPERATOR_VENDORS,
  OPERATOR_COHORTS,
  OPERATOR_GUIDES,
  OPERATOR_PAYMENTS,
  OPERATOR_CALENDAR_EVENTS,
} from '../data/operatorSuiteData';
import {
  INITIAL_OPERATOR_PACKAGES,
  OperatorCuratedPackage,
  createCuratedPackageFromOperator,
} from '../data/operatorPackagesData';
import { TripFlowApi } from '../services/api';

interface OperatorContextType {
  // Packages (Created by operator, visible to travelers in Discover)
  packages: OperatorCuratedPackage[];
  createPackage: (data: {
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
  }) => OperatorCuratedPackage;

  // Package Bookings manifest
  packageBookings: BookingItem[];
  addTravelerBooking: (
    trip: BookedTrip,
    customization?: BookingCustomizationDetail
  ) => void;
  fulfillBooking: (bookingId: string) => {
    flight: OperatorFlightTicket;
    stay: OperatorStayBooking;
    transfer: OperatorTransferBooking;
    activities: OperatorActivityBooking[];
  };
  fulfillSingleComponent: (
    bookingId: string,
    component: 'stay' | 'flight' | 'transfer' | 'activity' | 'guide'
  ) => void;

  // Respective Tabs Data
  flightTickets: OperatorFlightTicket[];
  stayBookings: OperatorStayBooking[];
  transferBookings: OperatorTransferBooking[];
  activityBookings: OperatorActivityBooking[];
  vendors: VendorSupplyItem[];
  addVendor: (vendor: VendorSupplyItem) => void;
  cohorts: TourCohortItem[];
  guides: TourGuideStaffItem[];
  payments: PaymentLedgerItem[];
  calendarEvents: CalendarTourEvent[];

  // Counters
  pendingCustomizedCount: number;
  highlightedBookingId: string | null;
  setHighlightedBookingId: (id: string | null) => void;
  isLoadingData: boolean;
}

const OperatorContext = createContext<OperatorContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PACKAGES: 'tripflow_operator_packages_v2',
  BOOKINGS: 'tripflow_operator_bookings_v2',
  FLIGHTS: 'tripflow_operator_flights_v2',
  STAYS: 'tripflow_operator_stays_v2',
  TRANSFERS: 'tripflow_operator_transfers_v2',
  ACTIVITIES: 'tripflow_operator_activities_v2',
  VENDORS: 'tripflow_operator_vendors_v2',
  COHORTS: 'tripflow_operator_cohorts_v2',
  GUIDES: 'tripflow_operator_guides_v2',
  PAYMENTS: 'tripflow_operator_payments_v2',
  CALENDAR: 'tripflow_operator_calendar_v2',
};

export const OperatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Packages Store
  const [packages, setPackages] = useState<OperatorCuratedPackage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading packages from storage:', e);
    }
    return INITIAL_OPERATOR_PACKAGES;
  });

  // 2. Package Bookings Store
  const [packageBookings, setPackageBookings] = useState<BookingItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading bookings from storage:', e);
    }
    return OPERATOR_BOOKINGS;
  });

  // 3. Tab Bookings Stores
  const [flightTickets, setFlightTickets] = useState<OperatorFlightTicket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FLIGHTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading flights from storage:', e);
    }
    return OPERATOR_FLIGHT_TICKETS;
  });

  const [stayBookings, setStayBookings] = useState<OperatorStayBooking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAYS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading stays from storage:', e);
    }
    return OPERATOR_STAY_BOOKINGS;
  });

  const [transferBookings, setTransferBookings] = useState<OperatorTransferBooking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSFERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading transfers from storage:', e);
    }
    return OPERATOR_TRANSFER_BOOKINGS;
  });

  const [activityBookings, setActivityBookings] = useState<OperatorActivityBooking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading activities from storage:', e);
    }
    return OPERATOR_ACTIVITY_BOOKINGS;
  });

  // 4. Vendors, Cohorts, Guides, Payments, Calendar Stores
  const [vendors, setVendors] = useState<VendorSupplyItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VENDORS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading vendors from storage:', e);
    }
    return OPERATOR_VENDORS;
  });

  const [cohorts, setCohorts] = useState<TourCohortItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COHORTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading cohorts from storage:', e);
    }
    return OPERATOR_COHORTS;
  });

  const [guides, setGuides] = useState<TourGuideStaffItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GUIDES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading guides from storage:', e);
    }
    return OPERATOR_GUIDES;
  });

  const [payments, setPayments] = useState<PaymentLedgerItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading payments from storage:', e);
    }
    return OPERATOR_PAYMENTS;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarTourEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CALENDAR);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading calendar from storage:', e);
    }
    return OPERATOR_CALENDAR_EVENTS;
  });

  const [highlightedBookingId, setHighlightedBookingId] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Fetch operator-isolated data from backend
  useEffect(() => {
    setIsLoadingData(true);
    TripFlowApi.getMe().then(user => {
      const isOperator = user?.role?.toUpperCase() === 'OPERATOR';
      const isAlexDemo = !user || user.id === 'user-alex-007';

      const pCohorts = TripFlowApi.getTourCohorts().then(backendCohorts => {
        if (backendCohorts) {
          if (backendCohorts.length > 0) {
            setCohorts(backendCohorts.map((c: any) => ({
              id: c.id,
              name: c.name,
              circuit: c.circuit || c.name,
              dates: c.dates,
              leadGuide: c.leadGuide?.name || 'Assigned Guide',
              paxCount: c.paxCount,
              maxPax: c.maxPax,
              progressPercent: c.progressPercent || 0,
              currentStop: c.currentStop,
              nextMilestone: c.nextMilestone,
              status: c.status,
              vipCount: c.vipCount,
              issuesCount: c.alerts?.filter((a: any) => !a.isResolved)?.length || 0,
            })));
          } else if (isOperator && !isAlexDemo) {
            // Newly registered operator starts with their own clean empty state!
            setCohorts([]);
          }
        }
      });

      // Load guides
      const pGuides = TripFlowApi.getTourGuides().then(backendGuides => {
        if (backendGuides) {
          if (backendGuides.length > 0) {
            setGuides(backendGuides.map((g: any) => ({
              id: g.id,
              name: g.name,
              role: g.role,
              languages: Array.isArray(g.languages) ? g.languages : [g.languages],
              rating: Number(g.rating || 4.9),
              totalTours: g.totalTours || 0,
              status: g.status,
              location: g.location,
              phone: g.phone,
              avatar: g.avatarUrl,
              certifications: Array.isArray(g.certifications) ? g.certifications : [g.certifications],
            })));
          } else if (isOperator && !isAlexDemo) {
            setGuides([]);
          }
        }
      });

      // Load vendors
      const pVendors = TripFlowApi.getVendors().then(backendVendors => {
        if (backendVendors) {
          if (backendVendors.length > 0) {
            setVendors(backendVendors.map((v: any) => ({
              ...v,
              rating: Number(v.rating || 4.9),
              slaCompliance: Number(v.slaCompliance || 99),
              contractRenewal: typeof v.contractRenewal === 'string' && v.contractRenewal.includes('T')
                ? new Date(v.contractRenewal).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : v.contractRenewal || 'Dec 2027',
            })));
          } else if (isOperator && !isAlexDemo) {
            setVendors([]);
          }
        }
      });

      // Load payments ledger
      const pPayments = TripFlowApi.getPaymentsLedger().then(backendTransactions => {
        if (backendTransactions) {
          if (backendTransactions.length > 0) {
            setPayments(backendTransactions.map((t: any) => ({
              id: t.id,
              transactionRef: t.transactionRef,
              tourId: t.bookedTripId || '#1024',
              party: t.party,
              type: (t.type === 'outbound' || t.type === 'escrow') ? t.type : 'inbound',
              amount: Number(t.amount || 0),
              currency: t.currency || 'INR',
              status: t.status === 'SETTLED' ? 'Settled' : 'Processing',
              date: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              paymentMethod: t.paymentMethod,
              description: t.description,
            })));
          } else if (isOperator && !isAlexDemo) {
            setPayments([]);
          }
        }
      });

      // Load calendar events
      const pCalendar = TripFlowApi.getCalendarEvents().then(backendEvents => {
        if (backendEvents) {
          if (backendEvents.length > 0) {
            setCalendarEvents(backendEvents.map((e: any) => ({
              id: e.id,
              title: e.title,
              tourId: e.cohortName || '#1024',
              date: typeof e.eventDate === 'string' ? e.eventDate.split('T')[0] : '2026-10-14',
              time: e.timeSlot || '10:00 AM',
              type: e.eventType || 'experience',
              location: e.location || 'Local Circuit',
              cohort: e.cohortName || 'Active Cohort',
              color: e.color || 'bg-blue-600 text-white',
              pax: Number(e.pax || 2),
            })));
          } else if (isOperator && !isAlexDemo) {
            setCalendarEvents([]);
          }
        }
      });

      // If a newly created operator (not Alex demo), clear bookings and tab tickets so they don't inherit demo data!
      if (isOperator && !isAlexDemo) {
        setPackageBookings([]);
        setFlightTickets([]);
        setStayBookings([]);
        setTransferBookings([]);
        setActivityBookings([]);
      }

      Promise.allSettled([pCohorts, pGuides, pVendors, pPayments, pCalendar]).finally(() => {
        setIsLoadingData(false);
      });
    }).catch(() => {
      setIsLoadingData(false);
    });
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
    } catch (e) {
      console.warn('Failed to save packages:', e);
    }
  }, [packages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(packageBookings));
    } catch (e) {
      console.warn('Failed to save bookings:', e);
    }
  }, [packageBookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FLIGHTS, JSON.stringify(flightTickets));
      localStorage.setItem(STORAGE_KEYS.STAYS, JSON.stringify(stayBookings));
      localStorage.setItem(STORAGE_KEYS.TRANSFERS, JSON.stringify(transferBookings));
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activityBookings));
      localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
      localStorage.setItem(STORAGE_KEYS.COHORTS, JSON.stringify(cohorts));
      localStorage.setItem(STORAGE_KEYS.GUIDES, JSON.stringify(guides));
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
      localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(calendarEvents));
    } catch (e) {
      console.warn('Failed to save operator operational stores:', e);
    }
  }, [
    flightTickets,
    stayBookings,
    transferBookings,
    activityBookings,
    vendors,
    cohorts,
    guides,
    payments,
    calendarEvents,
  ]);

  // Count pending customized bookings
  const pendingCustomizedCount = packageBookings.filter(
    b => b.isCustomized && b.needsFulfillment
  ).length;

  /**
   * OPERATOR ACTION 1: Create a tour package
   * It becomes immediately discoverable by travelers in DiscoverScreen!
   */
  const createPackage = (data: {
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
  }) => {
    const newPkg = createCuratedPackageFromOperator(data);
    setPackages(prev => [newPkg, ...prev]);
    return newPkg;
  };

  /**
   * TRAVELER ACTION: After traveler customizes and books in Discover/Builder,
   * it is sent to the operator with all customization telemetry.
   */
  const addTravelerBooking = (
    trip: BookedTrip,
    customization?: BookingCustomizationDetail
  ) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newBookingItem: BookingItem = {
      id: `bkg-${trip.id || Date.now()}`,
      ref: trip.bookingRef || `BK-${(trip.destination || 'TRIP').substring(0, 3).toUpperCase()}-${randomSuffix}`,
      guestName: 'Sarah & David Mehta',
      guestEmail: 'sarah.mehta@concierge.tripflow.io',
      tourTitle: trip.title,
      destination: trip.destination,
      dates: trip.dates,
      guestsCount: trip.travelers || 2,
      status: 'Pending',
      amount: trip.totalPrice || 2450,
      roomsAllocated: trip.hotelCheckIn?.hotelName || 'Luxury Suite Requested',
      flightAllocated: `${trip.flightDetails?.airline || 'Air India'} (Held - Operator Allocation Needed)`,
      vipStatus: true,
      notes: customization?.customRequests || 'Customized circuit with added bespoke experiences & dietary requests.',
      bookedAt: 'Just Now',
      isCustomized: true,
      needsFulfillment: true,
      customization: customization || {
        isCustomized: true,
        basePackageTitle: trip.title,
        basePrice: Math.round(trip.totalPrice * 0.8),
        customPrice: trip.totalPrice,
        deltaPrice: Math.round(trip.totalPrice * 0.2),
        customRequests: 'Vegetarian gourmet meals requested. High floor quiet room. Dedicated English-speaking chauffeur.',
        fulfillmentStatus: {
          hotelBooked: false,
          flightBooked: false,
          transferBooked: false,
          activityBooked: false,
          guideAssigned: false,
        },
      },
      itinerarySnapshot: trip.itinerary,
    };

    setPackageBookings(prev => [newBookingItem, ...prev.filter(b => b.id !== newBookingItem.id)]);
    setHighlightedBookingId(newBookingItem.id);
  };

  /**
   * OPERATOR ACTION 2: Confirm and make all bookings from operator's end according to customizations
   * Automatically populates the respective tabs:
   * 1. Flights & Rail (flight_bookings)
   * 2. Hotels & Stays (stay_bookings)
   * 3. Transfers & Cabs (transfer_bookings)
   * 4. Tours & Activities (activity_bookings)
   * 5. Vendors & Supply (vendors)
   * 6. Guides & Staff (guides)
   * 7. Tour Cohorts (cohorts)
   * 8. Global Calendar (calendar)
   * 9. Payments Ledger (payments)
   */
  const fulfillBooking = (bookingId: string) => {
    const booking = packageBookings.find(b => b.id === bookingId);
    if (!booking) {
      throw new Error(`Booking ${bookingId} not found`);
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const destCode = (booking.destination || 'TRIP').substring(0, 3).toUpperCase();
    const guestName = booking.guestName;
    const tourTitle = booking.tourTitle;

    // 1. Generate Flight Ticket -> Flights & Rail Tab
    const newFlight: OperatorFlightTicket = {
      id: `flt-gen-${Date.now()}`,
      ticketNumber: `TK-${destCode}-${randomSuffix}`,
      pnr: `${destCode}-${randomSuffix}-VIP`,
      airline: booking.itinerarySnapshot?.routeStops?.[0]?.transitMode === 'train' ? 'JR Bullet Rail' : 'Air India VIP Concierge',
      airlineCode: destCode,
      flightNumber: `TF ${Math.floor(100 + Math.random() * 900)}`,
      route: `${booking.destination} Direct Executive Route`,
      origin: 'DEL (Indira Gandhi Int\'l VIP)',
      destination: `${booking.destination} Airport / Hub`,
      departureTime: `${booking.dates.split('–')[0]?.trim() || 'Oct 14'} · 10:30 AM`,
      arrivalTime: `${booking.dates.split('–')[0]?.trim() || 'Oct 14'} · 01:15 PM`,
      seat: '1A, 1B (First Class VIP)',
      travelerName: guestName,
      tourTitle: tourTitle,
      terminal: 'Terminal 3 VIP Salon Gate',
      baggage: '3x 32kg Priority Luggage Tagged',
      classType: 'First Class VIP',
      status: 'Confirmed',
      type: 'flight',
      amount: Math.round(booking.amount * 0.25),
    };

    // 2. Generate Stay Booking -> Hotels & Stays Tab
    const customStayItem = booking.itinerarySnapshot?.days
      ?.flatMap(d => d.items)
      ?.find(it => it.category === 'hotel');

    const newStay: OperatorStayBooking = {
      id: `stay-gen-${Date.now()}`,
      voucherRef: `VCH-${destCode}-${randomSuffix}`,
      hotelName: customStayItem?.title || `${booking.destination} Heritage Grand Palace & Villas`,
      roomType: booking.customization?.roomPreference || 'Royal Heritage Signature Pool Suite',
      destination: booking.destination,
      checkIn: booking.dates.split('–')[0]?.trim() || 'Oct 14, 2026',
      checkOut: booking.dates.split('–')[1]?.trim() || 'Oct 20, 2026',
      nights: 5,
      travelerName: guestName,
      guestsCount: booking.guestsCount || 2,
      inclusions: [
        'Daily Full Gourmet Breakfast served in-suite',
        'VIP Welcome Reserve & Champagne setup on arrival',
        'Private Spa 90-minute bespoke couples treatment',
        booking.customization?.dietaryRestrictions
          ? `Dietary: ${booking.customization.dietaryRestrictions} pre-flagged to Executive Chef`
          : 'Executive Chef private dietary consultation',
      ],
      confirmationCode: `CONF-${destCode}-${randomSuffix}`,
      status: 'Confirmed',
      nightlyRate: Math.round((booking.amount * 0.45) / 5),
      totalAmount: Math.round(booking.amount * 0.45),
    };

    // 3. Generate Transfer Booking -> Transfers & Cabs Tab
    const newTransfer: OperatorTransferBooking = {
      id: `trf-gen-${Date.now()}`,
      bookingRef: `TRF-${destCode}-${randomSuffix}`,
      vehicle: booking.customization?.transferPreference || 'Toyota Vellfire Executive Lounge',
      vehicleType: 'Ultra-Luxury Chauffeur Sedan',
      chauffeur: 'Manoj Kurian / Arun V.',
      chauffeurPhone: '+91 98471-29401',
      travelerName: guestName,
      pickup: `${booking.destination} Airport T3 VIP Gate`,
      dropoff: newStay.hotelName,
      dateTime: `${booking.dates.split('–')[0]?.trim() || 'Oct 14'} · 01:30 PM`,
      status: 'Dispatched',
      flightTracked: `${newFlight.flightNumber} (Tarmac Meet & Luggage Porter)`,
    };

    // 4. Generate Activity Bookings -> Tours & Activities Tab
    const customizedActs = (booking.customization?.customItemsAdded && booking.customization.customItemsAdded.length > 0)
      ? booking.customization.customItemsAdded
      : booking.itinerarySnapshot?.days
          ?.flatMap(d => d.items)
          ?.filter(it => it.category === 'activity' || it.category === 'experience') || [];

    const newActivities: OperatorActivityBooking[] = customizedActs.slice(0, 3).map((act, idx): OperatorActivityBooking => ({
      id: `act-gen-${Date.now()}-${idx}`,
      passRef: `ACT-${destCode}-${randomSuffix + idx}`,
      activityName: act.title || `Private Cultural Access & Experience in ${booking.destination}`,
      venue: act.location || `${booking.destination} Heritage Reserve`,
      destination: booking.destination,
      dateTime: `${booking.dates.split('–')[0]?.trim() || 'Oct 15'} · 04:30 PM`,
      travelerName: guestName,
      leadGuide: 'Sayuri Takahashi / Mahaveer Singh',
      status: 'Confirmed' as const,
      permits: `VIP Fast-Track Clearance #${destCode}-${randomSuffix + idx}`,
      guestsCount: booking.guestsCount || 2,
    }));

    if (newActivities.length === 0) {
      newActivities.push({
        id: `act-gen-${Date.now()}-0`,
        passRef: `ACT-${destCode}-${randomSuffix}`,
        activityName: `VIP Exclusive Guided Tour of ${booking.destination}`,
        venue: `${booking.destination} Private Reserve`,
        destination: booking.destination,
        dateTime: `${booking.dates.split('–')[0]?.trim() || 'Oct 15'} · 03:00 PM`,
        travelerName: guestName,
        leadGuide: 'Senior Cultural Director',
        status: 'Confirmed',
        permits: `VIP Fast-Track Clearance #${destCode}-${randomSuffix}`,
        guestsCount: booking.guestsCount || 2,
      });
    }

    // 5. Payments Ledger Entry -> Payments Ledger Tab
    const newInboundPayment: PaymentLedgerItem = {
      id: `pay-in-${Date.now()}`,
      transactionRef: `TXN-IN-${randomSuffix}`,
      tourId: booking.id,
      party: `${guestName} (${booking.ref})`,
      type: 'inbound',
      amount: booking.amount,
      currency: 'INR',
      status: 'Settled',
      date: 'Today',
      paymentMethod: 'Amex Concierge Escrow',
      description: `Client settlement confirmed for ${tourTitle} with customizations`,
    };

    const newVendorPayout: PaymentLedgerItem = {
      id: `pay-out-${Date.now()}`,
      transactionRef: `DISB-SUP-${randomSuffix}`,
      tourId: booking.id,
      party: newStay.hotelName,
      type: 'outbound',
      amount: newStay.totalAmount,
      currency: 'INR',
      status: 'Settled',
      date: 'Today',
      paymentMethod: 'Direct Supplier Wire',
      description: `Automated escrow disbursement for ${newStay.roomType}`,
    };

    // 6. Global Calendar Entries -> Global Calendar Tab
    const newCalendarEventCheckin: CalendarTourEvent = {
      id: `cal-evt-${Date.now()}-1`,
      title: `${guestName} Check-in (${newStay.roomType})`,
      tourId: booking.id,
      date: '2026-10-14',
      time: '02:30 PM',
      type: 'checkin',
      location: newStay.hotelName,
      cohort: tourTitle,
      color: 'bg-purple-600 text-white',
      pax: booking.guestsCount || 2,
    };

    const newCalendarEventTransfer: CalendarTourEvent = {
      id: `cal-evt-${Date.now()}-2`,
      title: `${guestName} VIP Chauffeur Transfer`,
      tourId: booking.id,
      date: '2026-10-14',
      time: '01:30 PM',
      type: 'transfer',
      location: `${booking.destination} Airport T3`,
      cohort: tourTitle,
      color: 'bg-blue-600 text-white',
      pax: booking.guestsCount || 2,
    };

    // Execute state updates across all respective tabs:
    setFlightTickets(prev => [newFlight, ...prev]);
    setStayBookings(prev => [newStay, ...prev]);
    setTransferBookings(prev => [newTransfer, ...prev]);
    setActivityBookings(prev => [...newActivities, ...prev]);
    setPayments(prev => [newInboundPayment, newVendorPayout, ...prev]);
    setCalendarEvents(prev => [newCalendarEventCheckin, newCalendarEventTransfer, ...prev]);

    // Update Guides & Staff -> mark lead guide on tour
    setGuides(prev =>
      prev.map((g, idx) =>
        idx === 0
          ? { ...g, status: 'On Tour', currentTour: `${tourTitle} (${guestName})` }
          : g
      )
    );

    // Update Cohorts -> increment pax count
    setCohorts(prev =>
      prev.map((c, idx) =>
        idx === 0
          ? {
              ...c,
              paxCount: c.paxCount + (booking.guestsCount || 2),
              vipCount: c.vipCount + 1,
            }
          : c
      )
    );

    // Update Vendor Contracts
    setVendors(prev =>
      prev.map((v, idx) =>
        idx === 0 ? { ...v, activeContracts: v.activeContracts + 1 } : v
      )
    );

    // Update Package Booking status to Confirmed & Fulfilled
    setPackageBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? {
              ...b,
              status: 'Confirmed',
              needsFulfillment: false,
              roomsAllocated: `${newStay.hotelName} (${newStay.roomType}) · Confirmed [${newStay.voucherRef}]`,
              flightAllocated: `${newFlight.airline} ${newFlight.flightNumber} · PNR: ${newFlight.pnr}`,
              customization: b.customization
                ? {
                    ...b.customization,
                    fulfillmentStatus: {
                      hotelBooked: true,
                      flightBooked: true,
                      transferBooked: true,
                      activityBooked: true,
                      guideAssigned: true,
                    },
                  }
                : undefined,
            }
          : b
      )
    );

    return {
      flight: newFlight,
      stay: newStay,
      transfer: newTransfer,
      activities: newActivities,
    };
  };

  /**
   * Fulfill a single component
   */
  const fulfillSingleComponent = (
    bookingId: string,
    component: 'stay' | 'flight' | 'transfer' | 'activity' | 'guide'
  ) => {
    setPackageBookings(prev =>
      prev.map(b => {
        if (b.id !== bookingId) return b;
        const currentCustomization = b.customization || {
          isCustomized: true,
          fulfillmentStatus: {
            hotelBooked: false,
            flightBooked: false,
            transferBooked: false,
            activityBooked: false,
            guideAssigned: false,
          },
        };
        const updatedStatus = {
          ...currentCustomization.fulfillmentStatus,
          hotelBooked: component === 'stay' ? true : currentCustomization.fulfillmentStatus.hotelBooked,
          flightBooked: component === 'flight' ? true : currentCustomization.fulfillmentStatus.flightBooked,
          transferBooked: component === 'transfer' ? true : currentCustomization.fulfillmentStatus.transferBooked,
          activityBooked: component === 'activity' ? true : currentCustomization.fulfillmentStatus.activityBooked,
          guideAssigned: component === 'guide' ? true : currentCustomization.fulfillmentStatus.guideAssigned,
        };
        const allDone =
          updatedStatus.hotelBooked &&
          updatedStatus.flightBooked &&
          updatedStatus.transferBooked &&
          updatedStatus.activityBooked &&
          updatedStatus.guideAssigned;

        return {
          ...b,
          status: allDone ? 'Confirmed' : b.status,
          needsFulfillment: !allDone,
          customization: {
            ...currentCustomization,
            fulfillmentStatus: updatedStatus,
          },
        };
      })
    );
  };

  const addVendor = (newVendor: VendorSupplyItem) => {
    setVendors(prev => [newVendor, ...prev]);
    TripFlowApi.addVendor(newVendor).catch(err => {
      console.warn('Could not persist vendor to backend:', err);
    });
  };

  return (
    <OperatorContext.Provider
      value={{
        packages,
        createPackage,
        packageBookings,
        addTravelerBooking,
        fulfillBooking,
        fulfillSingleComponent,
        flightTickets,
        stayBookings,
        transferBookings,
        activityBookings,
        vendors,
        addVendor,
        cohorts,
        guides,
        payments,
        calendarEvents,
        pendingCustomizedCount,
        highlightedBookingId,
        setHighlightedBookingId,
        isLoadingData,
      }}
    >
      {children}
    </OperatorContext.Provider>
  );
};

export const useOperator = () => {
  const context = useContext(OperatorContext);
  if (!context) {
    throw new Error('useOperator must be used within an OperatorProvider');
  }
  return context;
};
