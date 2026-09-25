import React, { useState, useMemo } from 'react';
import { OPERATOR_CALENDAR_EVENTS } from '../../data/operatorSuiteData';
import { CalendarTourEvent } from '../../types/travel';

interface GlobalCalendarScreenProps {
  onInspectTour: (tourId: string) => void;
  showToast: (msg: string) => void;
}

export const GlobalCalendarScreen: React.FC<GlobalCalendarScreenProps> = ({
  onInspectTour,
  showToast,
}) => {
  const [events] = useState<CalendarTourEvent[]>(OPERATOR_CALENDAR_EVENTS);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-14');
  const [filterCohort, setFilterCohort] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'month' | 'day'>('month');

  // Days in October 2026 (Oct 1 to Oct 31, starting on Thursday = 4 offset)
  const calendarDays = useMemo(() => {
    const days = [];
    // Oct 1, 2026 starts on Thursday (index 4 in 0-indexed Sun-Sat)
    for (let i = 0; i < 4; i++) {
      days.push({ day: null, dateStr: '' });
    }
    for (let d = 1; d <= 31; d++) {
      const dateStr = `2026-10-${d.toString().padStart(2, '0')}`;
      days.push({ day: d, dateStr });
    }
    return days;
  }, []);

  const selectedDayEvents = useMemo(() => {
    return events.filter(e => {
      const matchesDate = e.date === selectedDate;
      const matchesCohort = filterCohort === 'all' || e.cohort === filterCohort;
      return matchesDate && matchesCohort;
    });
  }, [events, selectedDate, filterCohort]);

  return (
    <div className="flex-1 bg-[#F7F8FA] min-h-screen p-6 sm:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-blue-600">
              calendar_month
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
              Global Operations Calendar
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Master flight departures, private chauffeur dispatches, and hotel check-in synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-neutral-200 rounded-xl p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                viewMode === 'month' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Month View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                viewMode === 'day' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Day Schedule
            </button>
          </div>

          <button
            type="button"
            onClick={() => showToast('Syncing calendar dispatch feeds with airline GDS and Amadeus...')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-sm">sync</span>
            <span>Sync Feeds</span>
          </button>
        </div>
      </div>

      {/* Main Calendar & Daily Drilldown Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Month Calendar Grid */}
        <div className="lg:col-span-8 bg-white border border-neutral-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-neutral-900">October 2026</h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                {events.length} Telemetry Events
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => showToast('Previous month')}
                className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 cursor-pointer"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate('2026-10-14')}
                className="px-2.5 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => showToast('Next month')}
                className="w-7 h-7 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 cursor-pointer"
              >
                ›
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center text-[11px] font-bold text-neutral-400 uppercase tracking-wider py-1">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarDays.map((item, index) => {
              if (!item.day) {
                return <div key={`empty-${index}`} className="h-16 sm:h-20 rounded-xl bg-neutral-50/40" />;
              }

              const isSelected = item.dateStr === selectedDate;
              const dayEvents = events.filter(e => e.date === item.dateStr);

              return (
                <div
                  key={item.dateStr}
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={`h-16 sm:h-20 p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-200'
                      : dayEvents.length > 0
                      ? 'border-neutral-200 bg-white hover:border-neutral-300'
                      : 'border-neutral-100 bg-neutral-50/50 hover:bg-white text-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-blue-600' : 'text-neutral-800'
                      }`}
                    >
                      {item.day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                  </div>

                  {/* Tiny pills for events */}
                  <div className="space-y-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map(ev => (
                      <div
                        key={ev.id}
                        className="text-[9px] px-1 py-0.2 rounded truncate font-medium text-white shadow-2xs"
                        style={{ backgroundColor: ev.color }}
                      >
                        {ev.time} {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-neutral-400 font-bold block">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Day Schedule */}
        <div className="lg:col-span-4 bg-white border border-neutral-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                Schedule Drilldown
              </span>
              <h3 className="text-base font-bold text-neutral-900">{selectedDate}</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
              {selectedDayEvents.length} Dispatches
            </span>
          </div>

          <div className="space-y-3">
            {selectedDayEvents.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-400">
                <span className="material-symbols-outlined text-3xl text-neutral-300 block mb-1">
                  event_busy
                </span>
                <span>No dispatches or flights scheduled on this date.</span>
              </div>
            ) : (
              selectedDayEvents.map(ev => (
                <div
                  key={ev.id}
                  onClick={() => onInspectTour(ev.tourId)}
                  className="p-3.5 bg-neutral-50 hover:bg-neutral-100/80 rounded-2xl border border-neutral-200/70 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-neutral-900">
                      {ev.time}
                    </span>
                    <span
                      className="px-2 py-0.2 rounded-md text-[10px] font-bold text-white uppercase"
                      style={{ backgroundColor: ev.color }}
                    >
                      {ev.type}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-neutral-800 mt-1.5 group-hover:text-blue-600 transition-colors">
                    {ev.title}
                  </h4>

                  <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">location_on</span>
                    <span className="truncate">{ev.location}</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[10px] text-neutral-400">
                    <span>{ev.cohort}</span>
                    <span className="font-bold text-neutral-700">{ev.pax} Travelers</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
