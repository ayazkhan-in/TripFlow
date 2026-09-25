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
    <div className="flex-1 bg-slate-50/50 min-h-screen p-6 sm:p-8 space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Global Operations Calendar
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Flight departures, private chauffeur dispatches, and hotel check-in synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'month'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'day'
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Day Schedule
            </button>
          </div>

          <button
            type="button"
            onClick={() => showToast('Calendar synchronized with live dispatch feeds')}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">sync</span>
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Main Calendar & Daily Drilldown Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Month Calendar Grid */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">October 2026</h2>
              <span className="text-xs text-slate-400">({events.length} Telemetry Events)</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => showToast('Previous month')}
                className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate('2026-10-14')}
                className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => showToast('Next month')}
                className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
              >
                ›
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center text-[11px] font-medium text-slate-400 uppercase tracking-wider py-1">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((item, index) => {
              if (!item.day) {
                return <div key={`empty-${index}`} className="h-16 sm:h-20 rounded-lg bg-slate-50/40" />;
              }

              const isSelected = item.dateStr === selectedDate;
              const dayEvents = events.filter(e => e.date === item.dateStr);

              return (
                <div
                  key={item.dateStr}
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={`h-16 sm:h-20 p-2 rounded-lg border transition-colors cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50'
                      : dayEvents.length > 0
                      ? 'border-slate-200 bg-white hover:border-slate-300'
                      : 'border-slate-100 bg-slate-50/30 hover:bg-white text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-slate-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      {item.day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                  </div>

                  {/* Clean text entries for events */}
                  <div className="space-y-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map(ev => (
                      <div
                        key={ev.id}
                        className="text-[10px] truncate text-slate-600 leading-tight"
                      >
                        <span className="font-medium">{ev.time}</span> {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-slate-400 block">
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
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Day Schedule</h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedDate}</p>
            </div>

            <select
              value={filterCohort}
              onChange={e => setFilterCohort(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:border-slate-400"
            >
              <option value="all">All Cohorts</option>
              <option value="Japan Cherry Blossom Circuit">Japan Circuit</option>
              <option value="Kerala Spice Trail">Kerala Trail</option>
              <option value="European Grand Tour">European Tour</option>
            </select>
          </div>

          {/* Schedule list */}
          <div className="space-y-2.5">
            {selectedDayEvents.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No events scheduled for this date.
              </div>
            ) : (
              selectedDayEvents.map(ev => (
                <div
                  key={ev.id}
                  className="p-3 bg-slate-50/70 border border-slate-100 rounded-lg space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">{ev.time}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{ev.tourId}</span>
                  </div>

                  <div className="text-xs font-medium text-slate-800">{ev.title}</div>
                  <div className="text-[11px] text-slate-500">{ev.location}</div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{ev.cohort}</span>
                    <button
                      type="button"
                      onClick={() => onInspectTour(ev.tourId)}
                      className="text-slate-900 hover:underline font-medium"
                    >
                      Inspect
                    </button>
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
