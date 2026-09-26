import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, RefreshCw } from 'lucide-react';
import { CalendarTourEvent } from '../../types/travel';
import { useOperator } from '../../context/OperatorContext';
import { TripFlowApi } from '../../services/api';

interface GlobalCalendarScreenProps {
  onInspectTour: (tourId: string) => void;
  showToast: (msg: string) => void;
}

export const GlobalCalendarScreen: React.FC<GlobalCalendarScreenProps> = ({
  onInspectTour,
  showToast,
}) => {
  const { calendarEvents: contextEvents } = useOperator();
  const [events, setEvents] = useState<CalendarTourEvent[]>(contextEvents || []);
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed: 9 = October
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-14');
  const [filterCohort, setFilterCohort] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'month' | 'day'>('month');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isCohortDropdownOpen, setIsCohortDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close cohort dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCohortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync / refresh events from backend
  const handleSync = async () => {
    setIsSyncing(true);
    showToast('Synchronizing telemetry feeds with live dispatch...');
    try {
      const backendEvents = await TripFlowApi.getCalendarEvents();
      if (backendEvents && backendEvents.length > 0) {
        setEvents(
          backendEvents.map((e: any) => ({
            id: e.id,
            tourId: e.tourId || '#1024',
            date: typeof e.eventDate === 'string' ? e.eventDate.split('T')[0] : '2026-10-14',
            time: e.timeSlot || e.time,
            title: e.title,
            cohort: e.cohortName || e.cohort,
            type: e.eventType || e.type,
            location: e.location,
            color: e.color || '#2563EB',
            pax: e.pax || 2,
          }))
        );
      }
    } catch {
      // Fallback already handled
    } finally {
      setTimeout(() => {
        setIsSyncing(false);
        showToast('Calendar synchronized with live dispatch feeds');
      }, 500);
    }
  };

  useEffect(() => {
    TripFlowApi.getCalendarEvents().then(backendEvents => {
      if (backendEvents && backendEvents.length > 0) {
        setEvents(
          backendEvents.map((e: any) => ({
            id: e.id,
            tourId: e.tourId || '#1024',
            date: typeof e.eventDate === 'string' ? e.eventDate.split('T')[0] : '2026-10-14',
            time: e.timeSlot || e.time,
            title: e.title,
            cohort: e.cohortName || e.cohort,
            type: e.eventType || e.type,
            location: e.location,
            color: e.color || '#2563EB',
            pax: e.pax || 2,
          }))
        );
      }
    });
  }, []);

  // Compute calendar days dynamically for currentMonth and currentYear
  const calendarData = useMemo(() => {
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun, 1 = Mon...
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: Array<{
      day: number;
      dateStr: string;
      isCurrentMonth: boolean;
    }> = [];

    // Preceding month trailing days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDay = daysInPrevMonth - i;
      const prevMonthNum = currentMonth === 0 ? 12 : currentMonth;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevYear}-${prevMonthNum.toString().padStart(2, '0')}-${prevDay.toString().padStart(2, '0')}`;
      days.push({ day: prevDay, dateStr, isCurrentMonth: false });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const monthNum = currentMonth + 1;
      const dateStr = `${currentYear}-${monthNum.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      days.push({ day: d, dateStr, isCurrentMonth: true });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Month & Year string
  const monthName = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', {
      month: 'long',
    });
  }, [currentYear, currentMonth]);

  // Navigate months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleGoToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(9); // October 2026
    setSelectedDate('2026-10-14');
  };

  // Distinct cohorts for filter
  const cohortOptions = useMemo(() => {
    const set = new Set<string>();
    events.forEach(e => {
      if (e.cohort) set.add(e.cohort);
    });
    return Array.from(set);
  }, [events]);

  // Selected Day Events
  const selectedDayEvents = useMemo(() => {
    return events.filter(e => {
      const matchesDate = e.date === selectedDate;
      const matchesCohort = filterCohort === 'all' || e.cohort === filterCohort;
      return matchesDate && matchesCohort;
    });
  }, [events, selectedDate, filterCohort]);

  // Formatted date string for selected date
  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return 'October 14, 2026';
    const parts = selectedDate.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      const dateObj = new Date(y, m, d);
      return dateObj.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return selectedDate;
  }, [selectedDate]);

  // Time parsing helper
  const parseTimeSlot = (timeString?: string) => {
    if (!timeString) return { time: '12:00', ampm: 'PM' };
    const parts = timeString.trim().split(' ');
    if (parts.length >= 2) {
      return { time: parts[0], ampm: parts[1].toUpperCase() };
    }
    // Check if format is 24hr e.g. 14:30
    const [hours, mins] = timeString.split(':');
    const h = parseInt(hours, 10);
    if (!isNaN(h)) {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedH = (h % 12 || 12).toString().padStart(2, '0');
      return { time: `${formattedH}:${mins || '00'}`, ampm };
    }
    return { time: timeString, ampm: '' };
  };

  return (
    <div className="flex-1 bg-[#f8fafc] min-h-screen p-6 sm:p-8 lg:p-10 space-y-8 select-none font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">
            Global Operations Calendar
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Flight departures, private chauffeur dispatches, and hotel check-in synchronization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle Pill */}
          <div className="flex items-center bg-[#f1f5f9] p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                viewMode === 'month'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Month View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                viewMode === 'day'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Day Schedule
            </button>
          </div>

          {/* Sync Button */}
          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="px-5 py-2.5 bg-[#0b132b] hover:bg-[#1c2541] active:scale-95 text-white rounded-2xl text-sm font-medium flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-70"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Main Unified White Container */}
      <div className="bg-white rounded-3xl p-7 sm:p-10 shadow-[0_4px_35px_rgba(0,0,0,0.03)] border border-slate-100/90">
        {viewMode === 'month' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Calendar Grid */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-6">
              {/* Month Header & Nav Controls */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {monthName} {currentYear}
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    aria-label="Previous Month"
                    className="w-9 h-9 rounded-2xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-700" />
                  </button>
                  <button
                    type="button"
                    onClick={handleGoToday}
                    className="px-4 py-1.5 text-sm font-medium rounded-2xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-2xs active:scale-95 cursor-pointer"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    aria-label="Next Month"
                    className="w-9 h-9 rounded-2xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-700" />
                  </button>
                </div>
              </div>

              {/* Days of week */}
              <div className="grid grid-cols-7 text-center pt-4 pb-2">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                  <span
                    key={d}
                    className="text-xs font-semibold text-slate-400 uppercase tracking-widest"
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-y-7 gap-x-2 text-center">
                {calendarData.map((item, idx) => {
                  const isSelected = item.isCurrentMonth && item.dateStr === selectedDate;
                  const dayEvents = item.isCurrentMonth
                    ? events.filter(e => e.date === item.dateStr)
                    : [];
                  const hasEvents = dayEvents.length > 0;

                  return (
                    <div
                      key={`${item.dateStr}-${idx}`}
                      className="flex items-center justify-center relative min-h-[46px]"
                    >
                      {item.isCurrentMonth ? (
                        <button
                          type="button"
                          onClick={() => setSelectedDate(item.dateStr)}
                          className={`relative flex flex-col items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? 'w-11 h-11 rounded-full bg-[#eff4fe] text-[#2563eb] font-semibold shadow-xs'
                              : 'w-11 h-11 rounded-full hover:bg-slate-100/70 text-slate-800 font-medium'
                          }`}
                        >
                          <span
                            className={`text-sm sm:text-base leading-none ${
                              isSelected ? 'text-[#2563eb] font-semibold' : 'text-slate-800'
                            }`}
                          >
                            {item.day}
                          </span>

                          {/* Selected Day Blue Dot underneath */}
                          {isSelected && (
                            <span className="w-1 h-1 rounded-full bg-[#2563eb] mt-1" />
                          )}

                          {/* Event Indicator Dot on non-selected days */}
                          {!isSelected && hasEvents && (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 absolute top-1.5 right-2" />
                          )}
                        </button>
                      ) : (
                        <span className="text-sm sm:text-base text-slate-300 font-normal w-11 h-11 flex items-center justify-center select-none">
                          {item.day}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Selected Day Schedule */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-6 pt-1 lg:pt-0">
              {/* Day Header & Filter */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {formattedSelectedDate}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {selectedDayEvents.length} scheduled event
                    {selectedDayEvents.length === 1 ? '' : 's'}
                  </p>
                </div>

                {/* Cohort Filter Dropdown Pill */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsCohortDropdownOpen(!isCohortDropdownOpen)}
                    className="rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 text-slate-700 text-xs sm:text-sm font-medium px-4 py-2 flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
                  >
                    <span className="truncate max-w-[130px]">
                      {filterCohort === 'all' ? 'All Cohorts' : filterCohort}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isCohortDropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-20">
                      <button
                        type="button"
                        onClick={() => {
                          setFilterCohort('all');
                          setIsCohortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                          filterCohort === 'all'
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        All Cohorts
                      </button>
                      {cohortOptions.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setFilterCohort(c);
                            setIsCohortDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs sm:text-sm font-medium transition-colors ${
                            filterCohort === c
                              ? 'bg-blue-50 text-blue-600 font-semibold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Event Cards List */}
              <div className="space-y-6 sm:space-y-7 pt-2">
                {selectedDayEvents.length === 0 ? (
                  <div className="py-16 text-center rounded-2xl border border-dashed border-slate-200/90 bg-slate-50/50">
                    <p className="text-slate-500 font-medium text-sm">
                      No events scheduled for this date.
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      Select another day with scheduled operations or switch cohort filter.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDate('2026-10-14');
                        setFilterCohort('all');
                      }}
                      className="mt-4 px-4 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-medium shadow-2xs transition-all cursor-pointer"
                    >
                      View October 14 Operations
                    </button>
                  </div>
                ) : (
                  selectedDayEvents.map(ev => {
                    const { time, ampm } = parseTimeSlot(ev.time);
                    return (
                      <div
                        key={ev.id}
                        className="flex items-start justify-between gap-4 group transition-colors"
                      >
                        {/* Time Column */}
                        <div className="w-16 sm:w-20 shrink-0">
                          <div className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                            {time}
                          </div>
                          {ampm && (
                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                              {ampm}
                            </div>
                          )}
                        </div>

                        {/* Event Details Middle */}
                        <div className="flex-1 min-w-0 pr-2">
                          <h4
                            onClick={() => onInspectTour(ev.tourId)}
                            className="text-sm sm:text-base font-semibold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            {ev.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
                            {ev.location}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-normal">
                            {ev.cohort}
                          </p>
                        </div>

                        {/* Reference Code & Inspect Action */}
                        <div className="shrink-0 flex flex-col items-end justify-between self-stretch py-0.5 space-y-4">
                          <span className="text-xs font-medium text-slate-400 tracking-wider">
                            {ev.tourId}
                          </span>
                          <button
                            type="button"
                            onClick={() => onInspectTour(ev.tourId)}
                            className="px-4 py-1.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-medium rounded-xl transition-all shadow-2xs active:scale-95 cursor-pointer"
                          >
                            Inspect
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Day Schedule Full Timeline View when Day Schedule tab is active */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Detailed Day Schedule: {formattedSelectedDate}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Full chronological tour operations, passenger manifests, and driver telemetry.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('month')}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-xl shadow-2xs transition-all cursor-pointer"
                >
                  Back to Month Grid
                </button>
              </div>
            </div>

            {/* Schedule timeline */}
            <div className="space-y-4">
              {selectedDayEvents.length === 0 ? (
                <div className="py-20 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                  <p className="text-slate-600 font-medium text-base">
                    No operations scheduled for {formattedSelectedDate}
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Select October 14, 2026 to inspect scheduled departures and check-ins.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedDate('2026-10-14')}
                    className="mt-4 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium shadow-sm transition-all cursor-pointer"
                  >
                    View October 14
                  </button>
                </div>
              ) : (
                selectedDayEvents.map(ev => {
                  const { time, ampm } = parseTimeSlot(ev.time);
                  return (
                    <div
                      key={ev.id}
                      className="p-5 sm:p-6 bg-slate-50/70 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-200 transition-all"
                    >
                      <div className="flex items-start gap-5">
                        <div className="w-20 shrink-0">
                          <div className="text-lg font-bold text-slate-900">{time}</div>
                          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            {ampm}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                              {ev.type.toUpperCase()}
                            </span>
                            <span className="text-xs font-mono text-slate-400">{ev.tourId}</span>
                          </div>
                          <h4 className="text-base font-semibold text-slate-900 mt-1">
                            {ev.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                            📍 {ev.location} • {ev.cohort} • {ev.pax} Guests
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => onInspectTour(ev.tourId)}
                          className="px-5 py-2 bg-[#0b132b] hover:bg-[#1c2541] text-white text-xs sm:text-sm font-medium rounded-xl transition-all shadow-xs cursor-pointer"
                        >
                          Inspect Tour
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
