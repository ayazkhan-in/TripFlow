import React, { useState, useMemo } from 'react';
import { BookingItem, OperatorTab } from '../../types/travel';
import { formatCurrency } from '../../utils/pricing';
import { useOperator } from '../../context/OperatorContext';
import { CreateTourPackageModal } from './CreateTourPackageModal';
import { CustomizedBookingFulfillmentModal } from './CustomizedBookingFulfillmentModal';

interface BookingsInventoryScreenProps {
  onInspectTour: (tourId: string) => void;
  showToast: (msg: string) => void;
  activeCategory?: 'all' | 'flights' | 'stays' | 'transfers' | 'activities';
  onNavigateToTab?: (tab: OperatorTab) => void;
}

export const BookingsInventoryScreen: React.FC<BookingsInventoryScreenProps> = ({
  onInspectTour,
  showToast,
  onNavigateToTab,
}) => {
  const { packageBookings, pendingCustomizedCount, highlightedBookingId } = useOperator();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Customized' | 'Confirmed' | 'Pending' | 'Waitlist'>('All');
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [customizedModalBooking, setCustomizedModalBooking] = useState<BookingItem | null>(null);
  const [isCreatePackageOpen, setIsCreatePackageOpen] = useState(false);

  // If there's a highlighted booking, find it
  const highlightedBooking = useMemo(() => {
    if (!highlightedBookingId) return null;
    return packageBookings.find(b => b.id === highlightedBookingId) || null;
  }, [packageBookings, highlightedBookingId]);

  const filteredBookings = useMemo(() => {
    return packageBookings.filter(b => {
      let matchesStatus = true;
      if (statusFilter === 'Customized') {
        matchesStatus = Boolean(b.isCustomized);
      } else if (statusFilter !== 'All') {
        matchesStatus = b.status === statusFilter;
      }

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        b.guestName.toLowerCase().includes(q) ||
        b.ref.toLowerCase().includes(q) ||
        b.tourTitle.toLowerCase().includes(q) ||
        b.destination.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [packageBookings, statusFilter, searchQuery]);

  return (
    <div className="flex-1 bg-slate-50/50 min-h-screen p-6 sm:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Package Bookings & Traveler Manifest
            </h1>
            {pendingCustomizedCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs animate-pulse">
                {pendingCustomizedCount} Needs Fulfillment
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Master manifest tracking travelers who booked tour packages with customizations and operator vendor dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* New Tour Package Button */}
          <button
            type="button"
            onClick={() => setIsCreatePackageOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">add_business</span>
            <span>Create Tour Package</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Exported bookings manifest to CSV')}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-slate-400">download</span>
            <span>Export Manifest</span>
          </button>
        </div>
      </div>

      {/* PENDING CUSTOMIZED BOOKING CALLOUT BANNER */}
      {pendingCustomizedCount > 0 && (
        <div className="p-4 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-blue-500/10 border border-amber-300 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <span className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-xl">edit_notifications</span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  ⚡ Traveler Customized Package Booking Received!
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                A traveler customized and confirmed a tour package with custom experiences, hotel upgrades, and dietary instructions. Review customizations and dispatch bookings to respective tabs.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const pendingOne = packageBookings.find(b => b.isCustomized && b.needsFulfillment);
              if (pendingOne) {
                setCustomizedModalBooking(pendingOne);
              }
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-amber-400">tune</span>
            <span>Review Customizations & Fulfill</span>
          </button>
        </div>
      )}

      {/* KPI Cards Row - Clean and Minimal */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Total Active Bookings
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {packageBookings.length} Bookings
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {packageBookings.filter(b => b.isCustomized).length} customized circuits
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Capacity Utilization
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">91.2%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Optimal load across circuits</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Gross Booked Value
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            ${packageBookings.reduce((acc, b) => acc + (b.amount || 0), 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            100% Escrow Cleared
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Pending Fulfillment
          </span>
          <div className={`text-2xl font-bold mt-1 ${pendingCustomizedCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {pendingCustomizedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {pendingCustomizedCount > 0 ? 'Awaiting operator dispatch' : 'All circuits dispatched'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by guest, ref, or tour title..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
          />
        </div>

        {/* Clean Segmented Status Tabs */}
        <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 overflow-x-auto">
          {(['All', 'Customized', 'Confirmed', 'Pending', 'Waitlist'] as const).map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st} {st === 'Customized' && pendingCustomizedCount > 0 && `(${pendingCustomizedCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-medium text-[11px]">
                <th className="py-3 px-4">Ref</th>
                <th className="py-3 px-4">Lead Guest</th>
                <th className="py-3 px-4">Tour Circuit</th>
                <th className="py-3 px-4">Dates & Pax</th>
                <th className="py-3 px-4">Inventory Allocated</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status & Telemetry</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No bookings found matching filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map(b => (
                  <tr
                    key={b.id}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer group ${
                      b.needsFulfillment ? 'bg-amber-50/30' : ''
                    }`}
                    onClick={() => {
                      if (b.isCustomized) {
                        setCustomizedModalBooking(b);
                      } else {
                        setSelectedBooking(b);
                      }
                    }}
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{b.ref}</span>
                        {b.isCustomized && (
                          <span
                            className="inline-block w-2 h-2 rounded-full bg-amber-500"
                            title="Customized by Traveler"
                          />
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>{b.guestName}</span>
                        {b.vipStatus && (
                          <span className="text-[10px] text-amber-600 font-medium">★ VIP</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {b.guestEmail}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-900">
                      <div className="line-clamp-1 font-semibold">{b.tourTitle}</div>
                      <div className="text-[11px] text-slate-400">{b.destination}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div>{b.dates}</div>
                      <div className="text-[11px] text-slate-400">{b.guestsCount} Travelers</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 max-w-[200px]">
                      <div className="truncate font-medium">{b.roomsAllocated}</div>
                      <div className="text-[10px] text-slate-400 truncate">{b.flightAllocated}</div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {formatCurrency(b.amount)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              b.status === 'Confirmed'
                                ? 'bg-emerald-500'
                                : b.status === 'Pending'
                                ? 'bg-amber-500'
                                : 'bg-indigo-500'
                            }`}
                          />
                          <span className="font-semibold">{b.status}</span>
                        </div>
                        {b.isCustomized && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded w-fit ${
                            b.needsFulfillment
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {b.needsFulfillment ? '⚡ Needs Fulfillment' : '✓ Fulfilled'}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {b.isCustomized ? (
                          <button
                            type="button"
                            onClick={() => setCustomizedModalBooking(b)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer ${
                              b.needsFulfillment
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="material-symbols-outlined text-xs">
                              {b.needsFulfillment ? 'auto_fix_high' : 'visibility'}
                            </span>
                            <span>{b.needsFulfillment ? 'Review & Fulfill' : 'View Customizations'}</span>
                          </button>
                        ) : (
                          <>
                            {b.status === 'Pending' && (
                              <button
                                type="button"
                                onClick={() => showToast(`Booking ${b.ref} confirmed.`)}
                                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors"
                              >
                                Confirm
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => onInspectTour('#1024')}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors"
                            >
                              View Tour
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Create Tour Package Modal */}
      <CreateTourPackageModal
        isOpen={isCreatePackageOpen}
        onClose={() => setIsCreatePackageOpen(false)}
        showToast={showToast}
        onPackageCreated={pkgTitle => {
          showToast(`🚀 "${pkgTitle}" published live to Discover!`);
        }}
      />

      {/* Modal 2: Traveler Customization Review & Fulfillment Modal */}
      <CustomizedBookingFulfillmentModal
        booking={customizedModalBooking}
        isOpen={Boolean(customizedModalBooking)}
        onClose={() => setCustomizedModalBooking(null)}
        showToast={showToast}
        onNavigateToTab={onNavigateToTab}
      />

      {/* Standard Booking Detail Modal */}
      {selectedBooking && !selectedBooking.isCustomized && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs text-slate-400">
                  {selectedBooking.ref}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedBooking.guestName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Tour</span>
                  <div className="font-semibold text-slate-900">{selectedBooking.tourTitle}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Total Price</span>
                  <div className="font-bold text-slate-900">{formatCurrency(selectedBooking.amount)}</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Allocated Suites & Rooms</span>
                <p className="text-slate-800 mt-0.5">{selectedBooking.roomsAllocated}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Flight Clearances</span>
                <p className="text-slate-800 mt-0.5">{selectedBooking.flightAllocated}</p>
              </div>

              {selectedBooking.notes && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                  <span className="font-semibold block mb-0.5">Concierge Notes:</span>
                  <span>{selectedBooking.notes}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onInspectTour('#1024');
                  setSelectedBooking(null);
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                View Live Tour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
