export interface OperatorFlightTicket {
  id: string;
  ticketNumber: string;
  pnr: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  route: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  seat: string;
  travelerName: string;
  tourTitle: string;
  terminal: string;
  baggage: string;
  classType: string;
  status: 'Confirmed' | 'Scheduled' | 'Delayed' | 'Completed';
  type: 'flight' | 'train';
  amount: number;
}

export interface OperatorStayBooking {
  id: string;
  voucherRef: string;
  hotelName: string;
  roomType: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  travelerName: string;
  guestsCount: number;
  inclusions: string[];
  confirmationCode: string;
  status: 'Confirmed' | 'Checked-In' | 'Pending' | 'Waitlist';
  nightlyRate: number;
  totalAmount: number;
}

export interface OperatorTransferBooking {
  id: string;
  bookingRef: string;
  vehicle: string;
  vehicleType: string;
  chauffeur: string;
  chauffeurPhone: string;
  travelerName: string;
  pickup: string;
  dropoff: string;
  dateTime: string;
  status: 'Dispatched' | 'Scheduled' | 'Confirmed' | 'Completed';
  flightTracked?: string;
}

export interface OperatorActivityBooking {
  id: string;
  passRef: string;
  activityName: string;
  venue: string;
  destination: string;
  dateTime: string;
  travelerName: string;
  leadGuide: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
  permits: string;
  guestsCount: number;
}

export const OPERATOR_FLIGHT_TICKETS: OperatorFlightTicket[] = [
  {
    id: 'flt-101',
    ticketNumber: 'TK-NH-902184',
    pnr: 'NH-8421-VIP',
    airline: 'All Nippon Airways (ANA)',
    airlineCode: 'NH',
    flightNumber: 'NH 11',
    route: 'HND (Tokyo Haneda) ➔ CTS (Sapporo Chitose)',
    origin: 'Tokyo Haneda (HND)',
    destination: 'Sapporo Chitose (CTS)',
    departureTime: 'Oct 14, 2026 · 10:45 AM',
    arrivalTime: 'Oct 14, 2026 · 12:20 PM',
    seat: '1A, 1B (First Class Private Suite)',
    travelerName: 'Sarah & David Mehta',
    tourTitle: '7-Day Tokyo & Kyoto Cultural Immersion',
    terminal: 'Terminal 3, Gate 112',
    baggage: '3x 32kg Priority Baggage Allowance',
    classType: 'First Class Suite',
    status: 'Confirmed',
    type: 'flight',
    amount: 2840,
  },
  {
    id: 'flt-102',
    ticketNumber: 'TK-EK-481920',
    pnr: 'EK-4902-BIZ',
    airline: 'Emirates',
    airlineCode: 'EK',
    flightNumber: 'EK 530',
    route: 'DXB (Dubai Int\'l) ➔ COK (Cochin Int\'l)',
    origin: 'Dubai International (DXB)',
    destination: 'Cochin International (COK)',
    departureTime: 'Nov 02, 2026 · 02:45 AM',
    arrivalTime: 'Nov 02, 2026 · 08:05 AM',
    seat: '6A, 6B, 7A, 7B (Business Lie-Flat)',
    travelerName: 'Julian & Claire Sterling (4 Pax)',
    tourTitle: 'Kerala Backwaters & Spice Circuit',
    terminal: 'Terminal 3, Gate B22',
    baggage: '2x 32kg Business Allowance',
    classType: 'Business Class',
    status: 'Confirmed',
    type: 'flight',
    amount: 4920,
  },
  {
    id: 'flt-103',
    ticketNumber: 'TK-AF-391028',
    pnr: 'AF-7731-PREM',
    airline: 'Air France',
    airlineCode: 'AF',
    flightNumber: 'AF 023',
    route: 'CDG (Paris Charles de Gaulle) ➔ FCO (Rome Fiumicino)',
    origin: 'Paris Charles de Gaulle (CDG)',
    destination: 'Rome Fiumicino (FCO)',
    departureTime: 'Oct 10, 2026 · 09:15 AM',
    arrivalTime: 'Oct 10, 2026 · 11:25 AM',
    seat: '1A (La Première Suite)',
    travelerName: 'Elena Rostova',
    tourTitle: 'European Grand Odyssey',
    terminal: 'Terminal 2E, Private Salon',
    baggage: '3x 32kg VIP Allowance',
    classType: 'La Première First Class',
    status: 'Confirmed',
    type: 'flight',
    amount: 3650,
  },
  {
    id: 'flt-104',
    ticketNumber: 'TK-SH-882103',
    pnr: 'JR-EAST-009',
    airline: 'JR East Shinkansen (Bullet Train)',
    airlineCode: 'JR',
    flightNumber: 'Nozomi 23',
    route: 'Tokyo Central ➔ Kyoto Station',
    origin: 'Tokyo Station (Platform 14)',
    destination: 'Kyoto Central Station',
    departureTime: 'Oct 17, 2026 · 01:30 PM',
    arrivalTime: 'Oct 17, 2026 · 03:45 PM',
    seat: 'Gran Class Car 10, Seats 2A, 2B',
    travelerName: 'Sarah & David Mehta',
    tourTitle: '7-Day Tokyo & Kyoto Cultural Immersion',
    terminal: 'Platform 14, Dedicated Gate',
    baggage: 'Special Oversized Baggage Reserved',
    classType: 'Gran Class Luxury Rail',
    status: 'Confirmed',
    type: 'train',
    amount: 420,
  },
  {
    id: 'flt-105',
    ticketNumber: 'TK-AI-772199',
    pnr: 'AI-5104-FST',
    airline: 'Air India',
    airlineCode: 'AI',
    flightNumber: 'AI 441',
    route: 'DEL (Indira Gandhi Int\'l) ➔ JAI (Jaipur Airport)',
    origin: 'Delhi International (DEL)',
    destination: 'Jaipur International (JAI)',
    departureTime: 'Dec 05, 2026 · 01:10 PM',
    arrivalTime: 'Dec 05, 2026 · 02:05 PM',
    seat: '2A, 2C (Executive First)',
    travelerName: 'Arjun & Priya Singhania',
    tourTitle: 'Royal Rajasthan Palace Trail',
    terminal: 'Terminal 3, VIP Lounge West',
    baggage: '2x 30kg Included',
    classType: 'Executive First',
    status: 'Scheduled',
    type: 'flight',
    amount: 880,
  },
  {
    id: 'flt-106',
    ticketNumber: 'TK-JL-550192',
    pnr: 'JL-005-FIRST',
    airline: 'Japan Airlines (JAL)',
    airlineCode: 'JL',
    flightNumber: 'JL 005',
    route: 'JFK (New York JFK) ➔ HND (Tokyo Haneda)',
    origin: 'New York JFK (JFK)',
    destination: 'Tokyo Haneda (HND)',
    departureTime: 'Nov 14, 2026 · 11:30 AM',
    arrivalTime: 'Nov 15, 2026 · 03:25 PM',
    seat: '1K, 2K (A350-1000 First Suite)',
    travelerName: 'Marcus Vance & Family (3 Pax)',
    tourTitle: 'Autumn Hokkaido & Tokyo Gourmet Tour',
    terminal: 'Terminal 8, Chelsea Lounge',
    baggage: '3x 32kg First Class',
    classType: 'JAL First Suite',
    status: 'Confirmed',
    type: 'flight',
    amount: 11200,
  },
];

export const OPERATOR_STAY_BOOKINGS: OperatorStayBooking[] = [
  {
    id: 'stay-101',
    voucherRef: 'VCH-AMAN-402',
    hotelName: 'Aman Tokyo',
    roomType: 'Corner Suite (Imperial Palace Skyline View)',
    destination: 'Otemachi, Tokyo, Japan',
    checkIn: 'Oct 14, 2026',
    checkOut: 'Oct 17, 2026',
    nights: 3,
    travelerName: 'Sarah & David Mehta',
    guestsCount: 2,
    inclusions: [
      'Daily Full Japanese & Continental Breakfast in Pavilion',
      'Aman Spa 90-minute Seasonal Treatment for two',
      'Private Onsen access pre-reserved',
      'Early Check-In (11:00 AM) pre-cleared by concierge',
    ],
    confirmationCode: 'AMN-HND-9921',
    status: 'Confirmed',
    nightlyRate: 1850,
    totalAmount: 5550,
  },
  {
    id: 'stay-102',
    voucherRef: 'VCH-HOSH-811',
    hotelName: 'Hoshinoya Kyoto',
    roomType: 'Tsukihashi Riverside Pavilion',
    destination: 'Arashiyama, Kyoto, Japan',
    checkIn: 'Oct 17, 2026',
    checkOut: 'Oct 20, 2026',
    nights: 3,
    travelerName: 'Sarah & David Mehta',
    guestsCount: 2,
    inclusions: [
      'Private wooden boat transfer on the Oi River upon arrival',
      'Evening seasonal Kaiseki banquet served in-pavilion',
      'Exclusive morning Zen temple meditation with Master monk',
    ],
    confirmationCode: 'HSN-KYO-4021',
    status: 'Confirmed',
    nightlyRate: 1450,
    totalAmount: 4350,
  },
  {
    id: 'stay-103',
    voucherRef: 'VCH-SPICE-550',
    hotelName: 'Spice Village & Luxury Kettuvallam',
    roomType: 'Deluxe Heritage Villa + Private 2-Bedroom Houseboat',
    destination: 'Thekkady & Kumarakom, Kerala',
    checkIn: 'Nov 02, 2026',
    checkOut: 'Nov 08, 2026',
    nights: 6,
    travelerName: 'Julian & Claire Sterling',
    guestsCount: 4,
    inclusions: [
      'Dedicated onboard private chef serving authentic Malabar cuisine',
      'Daily Ayurvedic wellness therapies for all adult guests',
      'Private motorboat safari through Periyar Tiger Reserve',
    ],
    confirmationCode: 'CGH-KER-7721',
    status: 'Confirmed',
    nightlyRate: 1120,
    totalAmount: 6720,
  },
  {
    id: 'stay-104',
    voucherRef: 'VCH-PLAZA-019',
    hotelName: 'Hôtel Plaza Athénée',
    roomType: 'Eiffel Tower Signature Suite (Balcony View)',
    destination: 'Avenue Montaigne, Paris, France',
    checkIn: 'Oct 10, 2026',
    checkOut: 'Oct 15, 2026',
    nights: 5,
    travelerName: 'Elena Rostova',
    guestsCount: 1,
    inclusions: [
      'Dior Institut Spa unlimited VIP access',
      'Round-trip airport limousine escort to tarmac',
      'Dom Pérignon champagne welcome reserve on arrival',
    ],
    confirmationCode: 'PLZ-PAR-0294',
    status: 'Confirmed',
    nightlyRate: 2400,
    totalAmount: 12000,
  },
  {
    id: 'stay-105',
    voucherRef: 'VCH-TAJ-772',
    hotelName: 'Taj Lake Palace',
    roomType: 'Grand Royal Mewar Suite',
    destination: 'Lake Pichola, Udaipur, Rajasthan',
    checkIn: 'Dec 05, 2026',
    checkOut: 'Dec 09, 2026',
    nights: 4,
    travelerName: 'Arjun & Priya Singhania',
    guestsCount: 2,
    inclusions: [
      'Ceremonial heritage boat arrival with rose petal shower',
      'Dedicated 24/7 Royal Butler team and palace historian',
      'Private sunset dinner at Mewar Terrace overlooking city palace',
    ],
    confirmationCode: 'TAJ-UDR-1102',
    status: 'Confirmed',
    nightlyRate: 2950,
    totalAmount: 11800,
  },
];

export const OPERATOR_TRANSFER_BOOKINGS: OperatorTransferBooking[] = [
  {
    id: 'trf-101',
    bookingRef: 'TRF-TYO-001',
    vehicle: 'Mercedes-Maybach S 680',
    vehicleType: 'Ultra-Luxury Sedan',
    chauffeur: 'Takeshi Nomura',
    chauffeurPhone: '+81 90-4821-9920',
    travelerName: 'Sarah & David Mehta',
    pickup: 'Tokyo Haneda Airport (HND) VIP Terminal 3',
    dropoff: 'Aman Tokyo, Otemachi',
    dateTime: 'Oct 14, 2026 · 11:15 AM',
    status: 'Scheduled',
    flightTracked: 'NH 11 (Tarmac Meet & Greet)',
  },
  {
    id: 'trf-102',
    bookingRef: 'TRF-COK-002',
    vehicle: 'Toyota Vellfire Executive Lounge',
    vehicleType: 'VIP Multi-Purpose Van',
    chauffeur: 'Manoj Kurian',
    chauffeurPhone: '+91 98471-29401',
    travelerName: 'Julian & Claire Sterling (4 Pax)',
    pickup: 'Cochin International Airport (COK)',
    dropoff: 'Kumarakom Private Jetty (Houseboat Transfer)',
    dateTime: 'Nov 02, 2026 · 08:30 AM',
    status: 'Confirmed',
    flightTracked: 'EK 530 (Flight Monitored)',
  },
  {
    id: 'trf-103',
    bookingRef: 'TRF-PAR-003',
    vehicle: 'Rolls-Royce Ghost',
    vehicleType: 'Bespoke Chauffeur Sedan',
    chauffeur: 'Jean-Pierre Laurent',
    chauffeurPhone: '+33 6 40 29 11 84',
    travelerName: 'Elena Rostova',
    pickup: 'Paris Charles de Gaulle (CDG) VIP Customs',
    dropoff: 'Hôtel Plaza Athénée, Avenue Montaigne',
    dateTime: 'Oct 10, 2026 · 11:45 AM',
    status: 'Dispatched',
    flightTracked: 'AF 023 (Luggage Porter Pre-Assigned)',
  },
  {
    id: 'trf-104',
    bookingRef: 'TRF-JAI-004',
    vehicle: 'Range Rover Autobiography',
    vehicleType: 'Luxury SUV Chauffeur',
    chauffeur: 'Rana Vikram Singh',
    chauffeurPhone: '+91 94140-55912',
    travelerName: 'Arjun & Priya Singhania',
    pickup: 'Jaipur Airport VIP Gate',
    dropoff: 'Rambagh Palace Jaipur',
    dateTime: 'Dec 05, 2026 · 02:30 PM',
    status: 'Confirmed',
    flightTracked: 'AI 441',
  },
];

export const OPERATOR_ACTIVITY_BOOKINGS: OperatorActivityBooking[] = [
  {
    id: 'act-101',
    passRef: 'ACT-KYO-882',
    activityName: 'Gion Ochaya Private Tea Ceremony & Geisha Cultural Access',
    venue: 'Ichiriki Chaya, Gion Historic Quarter',
    destination: 'Kyoto, Japan',
    dateTime: 'Oct 18, 2026 · 04:00 PM – 06:30 PM',
    travelerName: 'Sarah & David Mehta',
    leadGuide: 'Sayuri Takahashi (Master Tea Connoisseur)',
    status: 'Confirmed',
    permits: 'Private Cultural Heritage License pre-cleared',
    guestsCount: 2,
  },
  {
    id: 'act-102',
    passRef: 'ACT-LVR-019',
    activityName: 'After-Hours Private Curator Tour of the Louvre Reserves',
    venue: 'Musée du Louvre, Cour Napoléon',
    destination: 'Paris, France',
    dateTime: 'Oct 12, 2026 · 07:30 PM – 09:30 PM',
    travelerName: 'Elena Rostova',
    leadGuide: 'Dr. Henri Dubois (Senior Louvre Curator)',
    status: 'Confirmed',
    permits: 'VIP Ministerial Reserve Clearance #LVR-904',
    guestsCount: 1,
  },
  {
    id: 'act-103',
    passRef: 'ACT-KER-551',
    activityName: 'Private Backwaters Sunset Cruise & Organic Spice Tasting',
    venue: 'Vembanad Lake Private Waterways',
    destination: 'Kumarakom, Kerala',
    dateTime: 'Nov 04, 2026 · 04:30 PM – 07:00 PM',
    travelerName: 'Julian & Claire Sterling',
    leadGuide: 'Chef George Joseph',
    status: 'Confirmed',
    permits: 'Alleppey Port Conservancy Permit #904',
    guestsCount: 4,
  },
  {
    id: 'act-104',
    passRef: 'ACT-JAI-302',
    activityName: 'Private Sunrise Hot Air Balloon Excursion over Amber Fort',
    venue: 'Amber Valley Launch Field',
    destination: 'Jaipur, Rajasthan',
    dateTime: 'Dec 07, 2026 · 05:45 AM – 08:30 AM',
    travelerName: 'Arjun & Priya Singhania',
    leadGuide: 'Capt. Aditya Rathore (Senior Aeronaut)',
    status: 'Confirmed',
    permits: 'DGCA Civil Aviation Clearance #BA-391',
    guestsCount: 2,
  },
];
