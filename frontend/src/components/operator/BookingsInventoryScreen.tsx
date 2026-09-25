import React, { useState, useMemo } from 'react';
import { OPERATOR_BOOKINGS } from '../../data/operatorSuiteData';
import { BookingItem } from '../../types/travel';
import { formatCurrency } from '../../utils/pricing';

interface BookingsInventoryScreenProps {
  onInspectTour: (tourId: string) => void;
  showToast: (msg: string) => void;
}

export const BookingsInventoryScreen: React.FC<BookingsInventoryScreenProps> = ({
  onInspectTour,
  showToast,
}) => {
  const [bookings, setBookings] = useState<BookingItem[]>(OPERATOR_BOOKINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'Pending' | 'Waitlist'>('All');
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tourTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.destination.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, searchQuery]);

  const handleConfirm = (id: string, ref: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Confirmed' } : b))
    );
    showToast(`Booking ${ref} confirmed! Vouchers issued to guest.`);
  };

  return (
    <div className="flex-1 bg-[#F7F8FA] min-h-screen p-6 sm:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-blue-600">
              confirmation_number
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
              Bookings & Inventory
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time traveler manifest, hotel room block allocations, and flight seat clearance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => showToast('Exporting bookings manifest to CSV...')}
            className="px-3.5 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Export Manifest</span>
          </button>
          <button
            type="button"
            onClick={() => showToast('Room block sync complete with Aman and Hoshinoya.')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-sm">sync</span>
            <span>Sync Inventory</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Total Active Bookings</span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">receipt_long</span>
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">128</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            <span>+12% vs last month</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Capacity Utilization</span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">pie_chart</span>
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">88.4%</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <span>Optimal load across 8 circuits</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Gross Booked Value</span>
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">payments</span>
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">$428,950</div>
          <div className="flex items-center gap-1 text-[11px] text-neutral-400 mt-1">
            <span>Average $3,351 per traveler</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">Waitlist In Queue</span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">hourglass_top</span>
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 mt-2">14</div>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold mt-1">
            <span>Priority auto-clear on cancellations</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-neutral-400 text-sm">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by guest, booking reference, or tour title..."
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['All', 'Confirmed', 'Pending', 'Waitlist'] as const).map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                statusFilter === st
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table Card */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/70 text-neutral-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Lead Guest</th>
                <th className="py-3 px-4">Tour Circuit</th>
                <th className="py-3 px-4">Dates & Pax</th>
                <th className="py-3 px-4">Inventory Allocated</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-400">
                    No bookings found matching filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map(b => (
                  <tr
                    key={b.id}
                    className="hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                    onClick={() => setSelectedBooking(b)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      {b.ref}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                        <span>{b.guestName}</span>
                        {b.vipStatus && (
                          <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black">
                            VIP
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate max-w-[180px]">
                        {b.guestEmail}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-neutral-900">
                      <div className="line-clamp-1">{b.tourTitle}</div>
                      <div className="text-[11px] text-neutral-400">{b.destination}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div>{b.dates}</div>
                      <div className="text-[11px] text-neutral-400">{b.guestsCount} Travelers</div>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-600 max-w-[200px]">
                      <div className="truncate font-medium">{b.roomsAllocated}</div>
                      <div className="text-[10px] text-neutral-400 truncate">{b.flightAllocated}</div>
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-neutral-900 whitespace-nowrap">
                      {formatCurrency(b.amount)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : b.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{b.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => handleConfirm(b.id, b.ref)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs cursor-pointer"
                          >
                            Confirm
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onInspectTour('#1024')}
                          className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200/70 text-neutral-700 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          View Tour
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">
                  {selectedBooking.ref}
                </span>
                <h3 className="text-base font-bold text-neutral-900 mt-0.5">
                  {selectedBooking.guestName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-3 rounded-2xl">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Tour</span>
                  <div className="font-bold text-neutral-800">{selectedBooking.tourTitle}</div>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">Total Price</span>
                  <div className="font-extrabold text-blue-600">{formatCurrency(selectedBooking.amount)}</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Allocated Suites & Rooms</span>
                <p className="font-medium text-neutral-800 mt-0.5">{selectedBooking.roomsAllocated}</p>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Flight Clearances</span>
                <p className="font-medium text-neutral-800 mt-0.5">{selectedBooking.flightAllocated}</p>
              </div>

              {selectedBooking.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-amber-900">
                  <span className="font-bold block mb-0.5">VIP Concierge Notes:</span>
                  <span>{selectedBooking.notes}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onInspectTour('#1024');
                  setSelectedBooking(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer"
              >
                Inspect Live Tour Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
