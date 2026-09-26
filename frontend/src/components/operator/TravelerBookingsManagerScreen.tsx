import React, { useState, useMemo, useEffect } from 'react';
import {
  OperatorFlightTicket,
  OperatorStayBooking,
  OperatorTransferBooking,
  OperatorActivityBooking,
  OPERATOR_FLIGHT_TICKETS,
  OPERATOR_STAY_BOOKINGS,
  OPERATOR_TRANSFER_BOOKINGS,
} from '../../data/operatorBookingsData';
import { OperatorTab } from '../../types/travel';
import { formatCurrency } from '../../utils/pricing';
import { TripFlowApi } from '../../services/api';
import { useOperator } from '../../context/OperatorContext';

interface TravelerBookingsManagerScreenProps {
  activeTab: OperatorTab;
  onTabChange: (tab: OperatorTab) => void;
  showToast: (msg: string) => void;
}

export const TravelerBookingsManagerScreen: React.FC<TravelerBookingsManagerScreenProps> = ({
  activeTab,
  onTabChange,
  showToast,
}) => {
  const { flightTickets, stayBookings, transferBookings, activityBookings } = useOperator();

  const currentSection =
    activeTab === 'stay_bookings'
      ? 'stays'
      : activeTab === 'transfer_bookings'
      ? 'transfers'
      : activeTab === 'activity_bookings'
      ? 'activities'
      : 'flights';

  const [flights, setFlights] = useState<OperatorFlightTicket[]>(OPERATOR_FLIGHT_TICKETS);
  const [stays, setStays] = useState<OperatorStayBooking[]>(OPERATOR_STAY_BOOKINGS);
  const [transfers, setTransfers] = useState<OperatorTransferBooking[]>(OPERATOR_TRANSFER_BOOKINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedTicket, setSelectedTicket] = useState<OperatorFlightTicket | null>(null);
  const [selectedStay, setSelectedStay] = useState<OperatorStayBooking | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    TripFlowApi.getOperatorBookings().then(bookings => {
      if (bookings && bookings.length > 0) {
        const dynamicFlights: OperatorFlightTicket[] = bookings.map((b: any) => ({
          id: `fl-${b.id}`,
          ticketNumber: `098-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          pnr: b.flightDetails?.pnr || 'KOK682',
          airline: b.flightDetails?.airline || 'Air India',
          airlineCode: (b.flightDetails?.flightNumber || 'AI-682').split('-')[0] || 'AI',
          flightNumber: b.flightDetails?.flightNumber || 'AI-682',
          route: b.flightDetails?.route || 'BOM ➔ COK',
          origin: (b.flightDetails?.route || 'BOM ➔ COK').split('➔')[0]?.trim() || 'BOM',
          destination: (b.flightDetails?.route || 'BOM ➔ COK').split('➔')[1]?.trim() || 'COK',
          departureTime: b.flightDetails?.departureTime || '11:30 AM',
          arrivalTime: b.flightDetails?.arrivalTime || '01:30 PM',
          seat: b.flightDetails?.seat || '14A & 14B',
          travelerName: b.user?.name || 'Sarah Mehta',
          tourTitle: b.title || 'Kerala Mist & Spice Route',
          terminal: b.flightDetails?.terminal || 'Terminal 2',
          baggage: '2 x 30kg Priority Tagged',
          classType: 'Premium Economy',
          status: 'Confirmed',
          type: 'flight',
          amount: 280,
        }));
        setFlights(dynamicFlights);

        const dynamicStays: OperatorStayBooking[] = bookings.map((b: any) => ({
          id: `stay-${b.id}`,
          voucherRef: b.hotelCheckIn?.voucherRef || 'VCHR-BB-8812',
          hotelName: b.hotelCheckIn?.hotelName || 'Brunton Boatyard — CGH Earth',
          roomType: b.hotelCheckIn?.roomType || 'Sea Facing Heritage Suite',
          destination: b.destination,
          checkIn: b.hotelCheckIn?.checkInDate || 'Oct 14, 2025',
          checkOut: b.hotelCheckIn?.checkOutDate || 'Oct 17, 2025',
          nights: b.hotelCheckIn?.nights || 3,
          travelerName: b.user?.name || 'Sarah Mehta',
          guestsCount: b.travelers || 2,
          inclusions: b.hotelCheckIn?.inclusions || ['Breakfast Buffet', 'High Tea', 'Sunset Harbour Cruise'],
          confirmationCode: `CONF-${b.bookingRef?.split('-')[2] || '4901'}`,
          status: 'Confirmed',
          nightlyRate: 450,
          totalAmount: 1350,
        }));
        setStays(dynamicStays);

        const dynamicTransfers: OperatorTransferBooking[] = bookings.map((b: any) => ({
          id: `tr-${b.id}`,
          bookingRef: b.bookingRef,
          vehicle: b.carDetails?.vehicleModel || 'Toyota Innova Crysta (Dual AC)',
          vehicleType: b.carDetails?.vehicleType || 'Executive MPV',
          chauffeur: b.carDetails?.chauffeurName || 'Arun V.',
          chauffeurPhone: b.carDetails?.chauffeurPhone || '+91 98470 12345',
          travelerName: b.user?.name || 'Sarah Mehta',
          pickup: b.carDetails?.pickupLocation || 'Cochin International Airport T3 (Arrival Gate 4)',
          dropoff: b.hotelCheckIn?.hotelName || 'Brunton Boatyard, Fort Kochi',
          dateTime: 'Oct 14, 2025 · 01:45 PM',
          status: 'Dispatched',
          flightTracked: b.flightDetails?.flightNumber || 'AI-682',
        }));
        setTransfers(dynamicTransfers);
      }
    });
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(text);
    showToast(`Copied ${label}: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFlights = useMemo(() => {
    return flights.filter(t => {
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        t.travelerName.toLowerCase().includes(q) ||
        t.flightNumber.toLowerCase().includes(q) ||
        t.pnr.toLowerCase().includes(q) ||
        t.ticketNumber.toLowerCase().includes(q) ||
        t.airline.toLowerCase().includes(q) ||
        t.origin.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        t.tourTitle.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [flights, searchQuery, statusFilter]);

  const filteredStays = useMemo(() => {
    return stays.filter(s => {
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        s.travelerName.toLowerCase().includes(q) ||
        s.hotelName.toLowerCase().includes(q) ||
        s.voucherRef.toLowerCase().includes(q) ||
        s.confirmationCode.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q) ||
        s.roomType.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [stays, searchQuery, statusFilter]);

  const filteredTransfers = useMemo(() => {
    return transfers.filter(tr => {
      const matchesStatus = statusFilter === 'All' || tr.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        tr.travelerName.toLowerCase().includes(q) ||
        tr.vehicle.toLowerCase().includes(q) ||
        tr.chauffeur.toLowerCase().includes(q) ||
        tr.bookingRef.toLowerCase().includes(q) ||
        tr.pickup.toLowerCase().includes(q) ||
        tr.dropoff.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [transfers, searchQuery, statusFilter]);

  const filteredActivities = useMemo(() => {
    return activityBookings.filter(a => {
      const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        a.travelerName.toLowerCase().includes(q) ||
        a.activityName.toLowerCase().includes(q) ||
        a.passRef.toLowerCase().includes(q) ||
        a.venue.toLowerCase().includes(q) ||
        a.leadGuide.toLowerCase().includes(q) ||
        a.destination.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [activityBookings, searchQuery, statusFilter]);

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 min-h-screen">
      {/* Top Header - Clean, unpill-cluttered */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                {currentSection === 'flights'
                  ? 'Flight & Rail Tickets'
                  : currentSection === 'stays'
                  ? 'Hotel & Stay Bookings'
                  : currentSection === 'transfers'
                  ? 'Transfers & Chauffeurs'
                  : 'Tours & Activities'}
              </h1>
              <span className="text-xs text-slate-400 font-normal">
                ({currentSection === 'flights'
                  ? filteredFlights.length
                  : currentSection === 'stays'
                  ? filteredStays.length
                  : currentSection === 'transfers'
                  ? filteredTransfers.length
                  : filteredActivities.length})
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentSection === 'flights'
                ? 'All flight tickets and train passes booked for travelers.'
                : currentSection === 'stays'
                ? 'Hotel vouchers, room reservations, and check-in clearances.'
                : currentSection === 'transfers'
                ? 'Chauffeur dispatches and luxury private vehicle connections.'
                : 'Activity permits, curator access, and guided excursions.'}
            </p>
          </div>

          {/* Clean Segmented Tab Switcher */}
          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => onTabChange('flight_bookings')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentSection === 'flights'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Flights & Rail
            </button>
            <button
              type="button"
              onClick={() => onTabChange('stay_bookings')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentSection === 'stays'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hotels & Stays
            </button>
            <button
              type="button"
              onClick={() => onTabChange('transfer_bookings')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentSection === 'transfers'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Transfers
            </button>
            <button
              type="button"
              onClick={() => onTabChange('activity_bookings')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentSection === 'activities'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Activities
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter by traveler, PNR, flight #, hotel..."
              className="w-full pl-9 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:border-slate-400"
              >
                <option value="All">All</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Delayed">Delayed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => showToast('Synced with GDS (Amadeus & Sabre)')}
              className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px] text-slate-400">sync</span>
              <span>Sync</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Exported manifest to CSV')}
              className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px] text-slate-400">download</span>
              <span>Export</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-6 max-w-7xl w-full mx-auto space-y-4">
        {/* ========================================================= */}
        {/* SECTION 1: FLIGHTS & RAIL TICKETS                         */}
        {/* ========================================================= */}
        {currentSection === 'flights' && (
          <div className="space-y-4">
            {/* Minimal Metric Summary Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Total Tickets
                </span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  {flightTickets.length}
                </div>
                <div className="text-[11px] text-slate-400">5 Flights · 1 Rail</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  PNRs Confirmed
                </span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">100%</div>
                <div className="text-[11px] text-slate-400">All seats cleared</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Premium Cabins
                </span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">6 of 6</div>
                <div className="text-[11px] text-slate-400">Suites & Gran Class</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Air & Rail Spend
                </span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  {formatCurrency(
                    flightTickets.reduce((acc: number, t) => acc + t.amount, 0)
                  )}
                </div>
                <div className="text-[11px] text-slate-400">Operator wholesale</div>
              </div>
            </div>

            {/* Flight Tickets List */}
            <div className="space-y-2.5">
              {filteredFlights.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <h3 className="text-sm font-medium text-slate-700">No flight tickets found</h3>
                  <p className="text-xs text-slate-400 mt-1">Try clearing your search query.</p>
                </div>
              ) : (
                filteredFlights.map(ticket => (
                  <div
                    key={ticket.id}
                    className="bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors p-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Airline, Route, Flight info */}
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        {/* Minimalist Airline Badge */}
                        <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex flex-col items-center justify-center shrink-0 border border-slate-200/60">
                          <span className="material-symbols-outlined text-lg">
                            {ticket.type === 'train' ? 'train' : 'flight'}
                          </span>
                          <span className="text-[8px] font-bold tracking-tight leading-none mt-0.5">
                            {ticket.airlineCode}
                          </span>
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">
                              {ticket.flightNumber}
                            </span>
                            <span className="text-xs text-slate-300">/</span>
                            <span className="text-xs font-semibold text-slate-700">
                              {ticket.route}
                            </span>
                            <div className="flex items-center gap-1.5 ml-1 text-xs text-slate-600">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  ticket.status === 'Confirmed'
                                    ? 'bg-emerald-500'
                                    : 'bg-amber-500'
                                }`}
                              />
                              <span className="text-[11px] font-medium">{ticket.status}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500 mt-1">
                            <span>{ticket.departureTime} ➔ {ticket.arrivalTime}</span>
                            <span className="text-slate-300">·</span>
                            <span>{ticket.terminal}</span>
                          </div>
                        </div>
                      </div>

                      {/* Center: Traveler & Cabin details */}
                      <div className="lg:border-l lg:border-r lg:border-slate-100 lg:px-6 flex flex-col justify-center min-w-[220px]">
                        <div className="text-xs font-semibold text-slate-900">
                          {ticket.travelerName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {ticket.tourTitle}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1">
                          <span>{ticket.seat}</span>
                          <span className="text-slate-300 mx-1.5">·</span>
                          <span>{ticket.classType}</span>
                        </div>
                      </div>

                      {/* Right: PNR, Fare & Actions */}
                      <div className="flex flex-row sm:flex-col lg:flex-row items-center justify-between sm:items-end lg:items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <div className="flex items-center gap-1 sm:justify-end">
                            <span className="text-[11px] text-slate-400">PNR:</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(ticket.pnr, 'PNR')}
                              className="font-mono text-xs font-semibold text-slate-800 hover:text-blue-600 flex items-center gap-0.5"
                              title="Click to copy PNR"
                            >
                              {ticket.pnr}
                              <span className="material-symbols-outlined text-[12px] text-slate-400">
                                {copiedId === ticket.pnr ? 'check' : 'content_copy'}
                              </span>
                            </button>
                          </div>
                          <div className="text-xs font-bold text-slate-900 mt-0.5">
                            {formatCurrency(ticket.amount)}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedTicket(ticket)}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <span>View Ticket</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              showToast(`Sent boarding pass to ${ticket.travelerName}`)
                            }
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Email to Traveler"
                          >
                            <span className="material-symbols-outlined text-[16px]">mail</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 2: HOTELS & STAY BOOKINGS                         */}
        {/* ========================================================= */}
        {currentSection === 'stays' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Hotel Vouchers
                </span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  {stayBookings.length}
                </div>
                <div className="text-[11px] text-slate-400">5 Luxury Properties</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Room Nights
                </span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  {stayBookings.reduce((acc: number, s) => acc + s.nights, 0)} Nights
                </div>
                <div className="text-[11px] text-slate-400">Tokyo, Kyoto, Paris</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Confirmed
                </span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">100%</div>
                <div className="text-[11px] text-slate-400">All vouchers ready</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Stays Value
                </span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  {formatCurrency(
                    stayBookings.reduce((acc: number, s) => acc + s.totalAmount, 0)
                  )}
                </div>
                <div className="text-[11px] text-slate-400">Net partner spend</div>
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredStays.map(stay => (
                <div
                  key={stay.id}
                  className="bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors p-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/60">
                        <span className="material-symbols-outlined text-lg">apartment</span>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{stay.hotelName}</h3>
                          <span className="text-xs text-slate-300">·</span>
                          <span className="text-xs text-slate-500">{stay.destination}</span>
                          <div className="flex items-center gap-1.5 ml-1 text-xs text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[11px] font-medium">{stay.status}</span>
                          </div>
                        </div>

                        <div className="text-xs text-slate-600 mt-0.5">
                          {stay.roomType}
                        </div>

                        <div className="text-[11px] text-slate-400 mt-1">
                          Inclusions: {stay.inclusions.slice(0, 2).join(' · ')}
                        </div>
                      </div>
                    </div>

                    <div className="lg:border-l lg:border-r lg:border-slate-100 lg:px-6 flex flex-col justify-center min-w-[200px]">
                      <div className="text-xs font-semibold text-slate-900">
                        {stay.travelerName}
                        <span className="text-slate-400 font-normal ml-1">({stay.guestsCount} Pax)</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {stay.checkIn} – {stay.checkOut} ({stay.nights} Nights)
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col lg:flex-row items-center justify-between sm:items-end lg:items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <div className="flex items-center gap-1 sm:justify-end">
                          <span className="text-[11px] text-slate-400">Ref:</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(stay.voucherRef, 'Voucher Ref')}
                            className="font-mono text-xs font-semibold text-slate-800 hover:text-blue-600 flex items-center gap-0.5"
                          >
                            {stay.voucherRef}
                            <span className="material-symbols-outlined text-[12px] text-slate-400">
                              {copiedId === stay.voucherRef ? 'check' : 'content_copy'}
                            </span>
                          </button>
                        </div>
                        <div className="text-xs font-bold text-slate-900 mt-0.5">
                          {formatCurrency(stay.totalAmount)}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedStay(stay)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          View Voucher
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 3: TRANSFERS & CHAUFFEURS                         */}
        {/* ========================================================= */}
        {currentSection === 'transfers' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Active Dispatches
                </span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  {transferBookings.length}
                </div>
                <div className="text-[11px] text-slate-400">Chauffeur Rosters</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  On-Time Rate
                </span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">100%</div>
                <div className="text-[11px] text-slate-400">Flights live-tracked</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Fleet Standard
                </span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">Luxury Fleet</div>
                <div className="text-[11px] text-slate-400">Sedans & Executive Vans</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Airport Meets
                </span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">4 Scheduled</div>
                <div className="text-[11px] text-slate-400">Tarmac Meet & Greet</div>
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredTransfers.map(tr => (
                <div
                  key={tr.id}
                  className="bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors p-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/60">
                        <span className="material-symbols-outlined text-lg">directions_car</span>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{tr.vehicle}</h3>
                          <span className="text-xs text-slate-300">·</span>
                          <span className="text-xs text-slate-500">{tr.vehicleType}</span>
                          <div className="flex items-center gap-1.5 ml-1 text-xs text-slate-600">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                tr.status === 'Dispatched' ? 'bg-blue-500' : 'bg-emerald-500'
                              }`}
                            />
                            <span className="text-[11px] font-medium">{tr.status}</span>
                          </div>
                        </div>

                        <div className="text-xs text-slate-600 mt-0.5">
                          Chauffeur: {tr.chauffeur} ({tr.chauffeurPhone})
                        </div>

                        <div className="text-xs text-slate-400 mt-1">
                          {tr.pickup} ➔ {tr.dropoff}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col lg:flex-row items-center justify-between sm:items-end lg:items-center gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div>
                        <div className="text-xs font-semibold text-slate-800">
                          {tr.travelerName}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{tr.dateTime}</div>
                        {tr.flightTracked && (
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Tracking: {tr.flightTracked}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => showToast(`Calling Chauffeur ${tr.chauffeur}`)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        <span>Call</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 4: TOURS & ACTIVITIES                             */}
        {/* ========================================================= */}
        {currentSection === 'activities' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Booked Passes
                </span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  {activityBookings.length}
                </div>
                <div className="text-[11px] text-slate-400">Cultural & Nature Tours</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Lead Guides
                </span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">4 Curators</div>
                <div className="text-[11px] text-slate-400">Master Guides</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Permits Status
                </span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">Pre-Cleared</div>
                <div className="text-[11px] text-slate-400">VIP entry</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Total Guests
                </span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">
                  {activityBookings.reduce((acc: number, a) => acc + a.guestsCount, 0)} Pax
                </div>
                <div className="text-[11px] text-slate-400">Private parties</div>
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredActivities.map(act => (
                <div
                  key={act.id}
                  className="bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors p-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/60">
                        <span className="material-symbols-outlined text-lg">explore</span>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{act.activityName}</h3>
                          <div className="flex items-center gap-1.5 ml-1 text-xs text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[11px] font-medium">{act.status}</span>
                          </div>
                        </div>

                        <div className="text-xs text-slate-600 mt-0.5">
                          Guide: {act.leadGuide} · {act.venue}
                        </div>

                        <div className="text-[11px] text-slate-400 mt-1">
                          {act.permits}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col lg:flex-row items-center justify-between sm:items-end lg:items-center gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <div className="text-xs font-semibold text-slate-800">
                          {act.travelerName} ({act.guestsCount} Guests)
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{act.dateTime}</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => showToast(`Downloaded Activity Pass: ${act.passRef}`)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Permit Pass
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: FLIGHT BOARDING PASS / E-TICKET VIEWER */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-xl border border-slate-200">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-tight">Electronic Ticket</h3>
                <p className="text-[11px] text-slate-400">
                  {selectedTicket.airline} · {selectedTicket.ticketNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase block">Origin</span>
                  <div className="text-base font-bold text-slate-900">{selectedTicket.origin}</div>
                  <div className="text-slate-500 mt-0.5">{selectedTicket.departureTime}</div>
                </div>
                <span className="material-symbols-outlined text-slate-300 text-xl">arrow_forward</span>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-medium uppercase block">Destination</span>
                  <div className="text-base font-bold text-slate-900">{selectedTicket.destination}</div>
                  <div className="text-slate-500 mt-0.5">{selectedTicket.arrivalTime}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">PASSENGER</span>
                  <span className="font-semibold text-slate-900">{selectedTicket.travelerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">PNR</span>
                  <span className="font-mono font-semibold text-slate-900">{selectedTicket.pnr}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">SEAT / CABIN</span>
                  <span className="text-slate-800">{selectedTicket.seat}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">TERMINAL</span>
                  <span className="text-slate-800">{selectedTicket.terminal}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800">
                Fare: {formatCurrency(selectedTicket.amount)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Boarding pass sent to ${selectedTicket.travelerName}`);
                    setSelectedTicket(null);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Downloaded ticket ${selectedTicket.ticketNumber}`);
                    setSelectedTicket(null);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: HOTEL VOUCHER VIEWER */}
      {selectedStay && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-xl border border-slate-200">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold tracking-tight">{selectedStay.hotelName}</h3>
                <p className="text-[11px] text-slate-400">Voucher Ref: {selectedStay.voucherRef}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStay(null)}
                className="text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="text-slate-900 font-semibold">{selectedStay.roomType}</div>
                <div className="text-slate-500 mt-0.5">{selectedStay.destination}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">GUEST</span>
                  <span className="font-semibold text-slate-800">{selectedStay.travelerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">CONFIRMATION</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedStay.confirmationCode}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">DATES</span>
                  <span>{selectedStay.checkIn} – {selectedStay.checkOut}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">DURATION</span>
                  <span>{selectedStay.nights} Nights ({selectedStay.guestsCount} Pax)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium uppercase block mb-1">Inclusions</span>
                <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                  {selectedStay.inclusions.map((inc, i) => (
                    <li key={i}>{inc}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800">
                Total: {formatCurrency(selectedStay.totalAmount)}
              </span>
              <button
                type="button"
                onClick={() => {
                  showToast(`Downloaded voucher ${selectedStay.voucherRef}`);
                  setSelectedStay(null);
                }}
                className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
              >
                Download Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
