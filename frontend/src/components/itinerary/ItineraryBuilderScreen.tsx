import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { JAPAN_5DAY_ITINERARY, INITIAL_TRIP_ITINERARY, CATALOG_ITEMS } from '../../data/itineraryData';
import { CatalogItem, ItineraryDay, ItineraryItem, TripItinerary } from '../../types/itinerary';
import { calculateTripPricing } from '../../utils/pricing';
import { BookingSummaryModal } from './BookingSummaryModal';
import { CardDetailOverlay } from './CardDetailOverlay';
import { CustomItemModal } from './CustomItemModal';

interface ItineraryBuilderScreenProps {
  initialItinerary?: TripItinerary;
  onBackToHome?: () => void;
  showToast: (msg: string) => void;
  isModifyingBookedTrip?: boolean;
  originalBookedPrice?: number;
  onProceedToBooking?: (itinerary: TripItinerary, total: number, customizations?: any) => void;
  onSaveModifications?: (itinerary: TripItinerary, total: number) => void;
  onOpenPayment?: (itinerary: TripItinerary, total: number, customizations?: any) => void;
  user?: any;
}

export const ItineraryBuilderScreen: React.FC<ItineraryBuilderScreenProps> = ({
  initialItinerary,
  onBackToHome,
  showToast,
  isModifyingBookedTrip = false,
  originalBookedPrice,
  onProceedToBooking,
  onSaveModifications,
  onOpenPayment,
  user,
}) => {
  // Itinerary Core State - Defaults to 5-Day Japan Journey matching screenshot
  const [itinerary, setItinerary] = useState<TripItinerary>(() => {
    if (initialItinerary) return initialItinerary;
    return JAPAN_5DAY_ITINERARY;
  });

  // Re-sync if initialItinerary changes from outside
  useEffect(() => {
    if (initialItinerary) {
      setItinerary(initialItinerary);
      setActiveDayNumber(1);
    }
  }, [initialItinerary?.id]);

  // Active day selection (1-indexed)
  const [activeDayNumber, setActiveDayNumber] = useState<number>(1);
  const [activeSidebarNav, setActiveSidebarNav] = useState<'overview' | 'itinerary' | 'ai_picks' | 'activities' | 'hotels' | 'transport'>('itinerary');

  // Modals state
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customModalTargetDay, setCustomModalTargetDay] = useState(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<{
    item: CatalogItem | ItineraryItem;
    source: 'sidebar' | 'board';
    dayNumber?: number;
  } | null>(null);

  // Touch Swipe Handling
  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (diff > 50) {
      // Swiped Left -> Next Day
      if (activeDayNumber < itinerary.days.length) {
        setActiveDayNumber(prev => prev + 1);
      }
    } else if (diff < -50) {
      // Swiped Right -> Prev Day
      if (activeDayNumber > 1) {
        setActiveDayNumber(prev => prev - 1);
      }
    }
    touchStartXRef.current = null;
  };

  // Keyboard navigation (Arrow Left / Arrow Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveDayNumber(prev => Math.max(1, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveDayNumber(prev => Math.min(itinerary.days.length, prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [itinerary.days.length]);

  // Pricing calculation
  const pricing = useMemo(() => calculateTripPricing(itinerary), [itinerary]);

  // Active Day object
  const currentDay = itinerary.days.find(d => d.dayNumber === activeDayNumber) || itinerary.days[0] || {
    id: 'day-1',
    dayNumber: 1,
    date: 'Day 1',
    title: itinerary.destination || 'Tokyo',
    subtitle: 'Activities & Lodging',
    items: [],
  };

  // Filtered items based on left sidebar selection
  const displayedItems = useMemo(() => {
    if (activeSidebarNav === 'activities') {
      return currentDay.items.filter(i => i.category === 'activity' || i.category === 'experience');
    }
    if (activeSidebarNav === 'hotels') {
      return currentDay.items.filter(i => i.category === 'hotel');
    }
    if (activeSidebarNav === 'transport') {
      return currentDay.items.filter(i => i.category === 'transport');
    }
    return currentDay.items;
  }, [currentDay.items, activeSidebarNav]);

  // Calculate day total
  const currentDayTotal = useMemo(() => {
    return currentDay.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }, [currentDay.items]);

  // Day stats
  const activityCount = currentDay.items.filter(i => i.category !== 'hotel').length;
  const hotelCount = currentDay.items.filter(i => i.category === 'hotel').length;

  // Add Item
  const handleAddItemToDay = (catalogItem: CatalogItem, targetDayNumber: number) => {
    const newItem: ItineraryItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      catalogId: catalogItem.id,
      title: catalogItem.title,
      category: catalogItem.category,
      price: catalogItem.price,
      time: catalogItem.timeSlotDefault || '11:00 AM',
      duration: catalogItem.duration,
      location: catalogItem.location,
      description: catalogItem.description,
      image: catalogItem.image,
      rating: catalogItem.rating,
      reviewsCount: catalogItem.reviewsCount,
      tags: catalogItem.tags,
    };

    const updatedDays = itinerary.days.map(day => {
      if (day.dayNumber === targetDayNumber) {
        return {
          ...day,
          items: [...day.items, newItem],
        };
      }
      return day;
    });

    setItinerary({
      ...itinerary,
      days: updatedDays,
    });
    showToast(`Added "${newItem.title}" to Day ${targetDayNumber}`);
  };

  // Remove Item
  const handleRemoveItem = (dayNumber: number, itemId: string) => {
    const updatedDays = itinerary.days.map(day => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          items: day.items.filter(i => i.id !== itemId),
        };
      }
      return day;
    });

    setItinerary({
      ...itinerary,
      days: updatedDays,
    });
    showToast(`Removed item from Day ${dayNumber}`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const rows = [
      ['Day', 'Date', 'Time', 'Category', 'Title', 'Location', 'Price (INR)'],
    ];
    itinerary.days.forEach(day => {
      day.items.forEach(it => {
        rows.push([
          `Day ${day.dayNumber}`,
          `"${day.date || ''}"`,
          `"${it.time || ''}"`,
          `"${it.category || ''}"`,
          `"${(it.title || '').replace(/"/g, '""')}"`,
          `"${(it.location || '').replace(/"/g, '""')}"`,
          (it.price || 0).toString(),
        ]);
      });
    });
    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${(itinerary.title || 'trip').toLowerCase().replace(/[^a-z0-9]/g, '_')}_itinerary.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV guide successfully!');
  };

  // Export PDF Guide — proper linear journey document
  const handleExportPDF = () => {
    const categoryIcons: Record<string, string> = {
      transport: '✈',
      hotel: '🏨',
      meal: '🍽',
      activity: '⭐',
      experience: '✨',
    };

    const categoryColors: Record<string, string> = {
      transport: '#3b82f6',
      hotel: '#8b5cf6',
      meal: '#f59e0b',
      activity: '#10b981',
      experience: '#ec4899',
    };

    const totalItems = itinerary.days.reduce((acc, d) => acc + d.items.length, 0);
    const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

    const daysHTML = itinerary.days.map(day => {
      const dayTotal = day.items.reduce((s, it) => s + (it.price || 0), 0);
      const itemsHTML = day.items.length === 0
        ? `<p style="color:#94a3b8;font-style:italic;font-size:13px;margin:8px 0 0 0">No activities scheduled for this day</p>`
        : day.items.map((item, idx) => `
          <div style="display:flex;gap:12px;align-items:flex-start;padding:12px 0;${idx < day.items.length - 1 ? 'border-bottom:1px solid #f1f5f9' : ''}">
            <div style="width:36px;height:36px;border-radius:10px;background:${categoryColors[item.category] || '#64748b'}20;color:${categoryColors[item.category] || '#64748b'};display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;border:1px solid ${categoryColors[item.category] || '#64748b'}30">
              ${categoryIcons[item.category] || '📌'}
            </div>
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
                <div>
                  ${item.time ? `<span style="font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:0.05em;text-transform:uppercase">${item.time}</span>` : ''}
                  <h4 style="margin:2px 0 0 0;font-size:14px;font-weight:700;color:#0f172a">${item.title}</h4>
                </div>
                ${item.price > 0 ? `<span style="font-size:13px;font-weight:800;color:#2563eb;white-space:nowrap;font-family:monospace">₹${item.price.toLocaleString('en-IN')}</span>` : '<span style="font-size:12px;color:#10b981;font-weight:600">Included</span>'}
              </div>
              ${item.location ? `<p style="margin:4px 0 0 0;font-size:12px;color:#64748b">📍 ${item.location}</p>` : ''}
              ${item.description ? `<p style="margin:4px 0 0 0;font-size:12px;color:#475569;line-height:1.4">${item.description}</p>` : ''}
            </div>
          </div>
        `).join('');

      return `
        <div style="margin-bottom:28px;background:#fff;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;page-break-inside:avoid">
          <div style="background:#f8fafc;padding:12px 18px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between">
            <div>
              <span style="font-size:11px;font-weight:800;color:#2563eb;letter-spacing:0.05em;text-transform:uppercase">Day ${day.dayNumber}</span>
              <h3 style="margin:2px 0 0 0;font-size:16px;font-weight:800;color:#0f172a">${day.title}</h3>
              ${day.subtitle ? `<span style="font-size:12px;color:#64748b">${day.subtitle}</span>` : ''}
            </div>
            <div style="text-align:right">
              <span style="font-size:11px;color:#64748b;display:block">${day.date || ''}</span>
              <span style="font-size:13px;font-weight:700;color:#0f172a">₹${dayTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div style="padding:4px 18px">
            ${itemsHTML}
          </div>
        </div>
      `;
    }).join('');

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Could not open print window. Please allow popups.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${itinerary.title} — Linear Journey Guide</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; background: #fff; margin: 0; padding: 24px; }
          .header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #e2e8f0; }
          .title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
          .meta { font-size: 13px; color: #64748b; margin-top: 6px; }
          @media print {
            .no-print { display: none !important; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; display: flex; gap: 10px;">
          <button onclick="window.print()" style="background:#2563eb;color:#fff;border:none;padding:8px 16px;border-radius:8px;font-weight:600;cursor:pointer">🖨 Print / Save as PDF</button>
          <button onclick="window.close()" style="background:#f1f5f9;color:#475569;border:none;padding:8px 16px;border-radius:8px;font-weight:600;cursor:pointer">Close</button>
        </div>
        <div class="header">
          <h1 class="title">${itinerary.title}</h1>
          <div class="meta">
            ${itinerary.destination} • ${itinerary.dates || ''} • ${totalItems} Activities • Generated on ${today}
          </div>
        </div>
        ${daysHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    showToast('✅ Itinerary PDF preview opened! Click "Print / Save as PDF" to save.');
  };

  // User presentation data
  const userName = user?.name || 'Umme hani Shaikh';
  const userRole = user?.membership || 'Standard Concierge Member';
  const userAvatar = user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';

  // Day hero image selection (Japan Mount Fuji fallback for Tokyo)
  const dayHeroImage = useMemo(() => {
    const dest = (currentDay.title || itinerary.destination || '').toLowerCase();
    if (dest.includes('tokyo') || dest.includes('japan')) {
      return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80';
    }
    if (dest.includes('kyoto')) {
      return 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80';
    }
    if (dest.includes('kerala')) {
      return 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80';
    }
    return itinerary.heroImage || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80';
  }, [currentDay.title, itinerary.destination, itinerary.heroImage]);

  const currentCityName = useMemo(() => {
    return currentDay.title.split(' ')[0] || itinerary.destination || 'Tokyo';
  }, [currentDay.title, itinerary.destination]);

  return (
    <div className="w-full h-screen max-h-screen bg-[#FAFBFD] flex flex-col md:flex-row overflow-hidden font-sans text-slate-800 select-none">
      {/* ============================================================= */}
      {/* 1. LEFT SIDEBAR                                               */}
      {/* ============================================================= */}
      <aside className="w-full md:w-56 lg:w-60 bg-white border-r border-slate-100 flex flex-col justify-between shrink-0 p-4 lg:p-5 z-20">
        <div>
          {/* Logo Brand */}
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2.5 text-left cursor-pointer group focus:outline-none mb-4"
            title="Return to TripFlow Home"
          >
            <span className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1D4ED8] transition-colors">
              <span className="material-symbols-outlined text-lg">flight_takeoff</span>
            </span>
            <span className="text-[18px] font-bold text-slate-900 tracking-tight">
              TripFlow
            </span>
          </button>

          {/* + Add to Trip Button */}
          <button
            onClick={() => {
              setCustomModalTargetDay(activeDayNumber);
              setIsCustomModalOpen(true);
            }}
            className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#EFF4FF] hover:bg-[#E2EDFF] text-[#2563EB] font-semibold text-xs border border-blue-100/70 transition-all cursor-pointer shadow-2xs active:scale-98"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Add to Trip</span>
          </button>

          {/* Nav Links */}
          <nav className="space-y-1">
            <button
              onClick={() => {
                setActiveSidebarNav('overview');
                if (onBackToHome) onBackToHome();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeSidebarNav === 'overview'
                  ? 'bg-blue-50 text-[#2563EB] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-lg text-slate-500">home</span>
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveSidebarNav('itinerary')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeSidebarNav === 'itinerary'
                  ? 'bg-[#EFF4FF] text-[#2563EB] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-lg text-[#2563EB]">calendar_month</span>
              <span>Itinerary</span>
            </button>

            <button
              onClick={() => {
                setActiveSidebarNav('ai_picks');
                showToast('✨ Showing AI-optimized recommendations for this circuit');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeSidebarNav === 'ai_picks'
                  ? 'bg-[#EFF4FF] text-[#2563EB] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-lg text-slate-500">auto_awesome</span>
              <span>AI Picks</span>
            </button>

            <button
              onClick={() => setActiveSidebarNav('activities')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeSidebarNav === 'activities'
                  ? 'bg-[#EFF4FF] text-[#2563EB] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-lg text-slate-500">confirmation_number</span>
              <span>Activities</span>
            </button>

            <button
              onClick={() => setActiveSidebarNav('hotels')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeSidebarNav === 'hotels'
                  ? 'bg-[#EFF4FF] text-[#2563EB] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-lg text-slate-500">hotel</span>
              <span>Hotels</span>
            </button>

            <button
              onClick={() => setActiveSidebarNav('transport')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeSidebarNav === 'transport'
                  ? 'bg-[#EFF4FF] text-[#2563EB] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-lg text-slate-500">flight</span>
              <span>Transport</span>
            </button>
          </nav>
        </div>

        {/* Bottom Mountain Sketch Illustration & Slogan */}
        <div className="hidden md:block pt-6 pb-2 px-2 border-t border-slate-100/80">
          <svg
            className="w-11 h-8 text-slate-400 stroke-current fill-none stroke-[1.4] mb-1.5"
            viewBox="0 0 44 28"
          >
            <path d="M4 24L17 7L25 18L30 11L40 24H4Z" strokeLinejoin="round" />
            <path d="M13 12L17 7L21 12" />
            <path d="M28 14L30 11L32 14" />
          </svg>
          <div className="text-[11px] font-medium text-slate-400 leading-snug">
            Better trips.
            <br />
            Less planning.
          </div>
        </div>
      </aside>

      {/* ============================================================= */}
      {/* 2. MAIN CONTENT AREA                                          */}
      {/* ============================================================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Top Header */}
        <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-3.5 flex items-center justify-between shrink-0 sticky top-0 z-30">
          {/* Trip Info */}
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight">
              {itinerary.title || '5-Day Japan Journey'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {itinerary.routeStops?.map(s => s.city.replace(/^\d+\.\s*/, '')).join(' → ') || 'Tokyo → Kyoto'} •{' '}
              {itinerary.travelers || 2} Travelers • {itinerary.dates || 'Sep 28 – Oct 2'}
            </p>
          </div>

          {/* Right Header Utility Cluster */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleExportPDF}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
              title="Download / Print PDF Guide"
            >
              <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
            </button>

            <button
              onClick={() => showToast('Search active across activities & reservations')}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
              title="Search"
            >
              <span className="material-symbols-outlined text-lg">search</span>
            </button>

            <button
              onClick={() => showToast('No pending flight delays for this circuit')}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors cursor-pointer relative"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-lg">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
            </button>

            {/* Profile Tag */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
              <img
                src={userAvatar}
                alt={userName}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {userName}
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">
                  {userRole}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Central Card Column & Right Helper Card */}
        <div
          className="flex-1 flex items-start justify-center p-4 sm:p-6 lg:p-8 gap-6 max-w-6xl mx-auto w-full"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Day Card Column */}
          <div className="w-full max-w-[640px] flex flex-col gap-4">
            {/* --------------------------------------------------------- */}
            {/* HERO PANORAMIC DAY BANNER                                 */}
            {/* --------------------------------------------------------- */}
            <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <img
                src={dayHeroImage}
                alt={currentCityName}
                className="w-full h-full object-cover"
              />

              {/* Gradient Overlay for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

              {/* Top-Left Frosted Pill: Day X of Y */}
              <div className="absolute top-3.5 left-3.5 z-10">
                <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-slate-800 text-xs font-semibold shadow-2xs border border-white/40">
                  Day {currentDay.dayNumber} of {itinerary.days.length}
                </span>
              </div>

              {/* Top-Right Frosted Weather Pill */}
              <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/85 backdrop-blur-md shadow-2xs border border-white/50">
                <span className="material-symbols-outlined text-amber-500 text-lg">wb_sunny</span>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 leading-none">24°C</div>
                  <div className="text-[9px] text-slate-500 font-medium leading-none mt-0.5">{currentCityName}</div>
                </div>
              </div>

              {/* Bottom-Left City & Day Details */}
              <div className="absolute bottom-3.5 left-4 z-10 text-white">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {currentCityName}
                </h2>
                <p className="text-xs text-white/90 font-medium mt-0.5 drop-shadow-sm">
                  {currentDay.date || 'Sep 28, 2026'} • {activityCount} activities • {hotelCount} hotel
                </p>
              </div>
            </div>

            {/* --------------------------------------------------------- */}
            {/* TIMELINE ITEMS CONTAINER CARD                             */}
            {/* --------------------------------------------------------- */}
            <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-100 flex flex-col gap-5 relative">
              {/* Connecting Vertical Timeline Line */}
              {displayedItems.length > 1 && (
                <div className="absolute left-[39px] sm:left-[47px] top-9 bottom-28 w-[1.5px] bg-slate-100 pointer-events-none" />
              )}

              {/* Timeline Items List */}
              <div className="flex flex-col gap-6">
                {displayedItems.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No items found for this filter. Tap "+ Add to Trip" to personalize.
                  </div>
                ) : (
                  displayedItems.map((item, idx) => {
                    // Determine category icon and styling
                    let iconName = 'local_activity';
                    let iconBg = 'bg-emerald-50 text-emerald-600';
                    let badgeBg = 'bg-emerald-50 text-emerald-700';

                    if (item.category === 'hotel') {
                      iconName = 'hotel';
                      iconBg = 'bg-blue-50 text-blue-500';
                      badgeBg = 'bg-blue-50 text-blue-600';
                    } else if (item.category === 'meal') {
                      iconName = 'restaurant';
                      iconBg = 'bg-amber-50 text-amber-600';
                      badgeBg = 'bg-amber-50 text-amber-700';
                    } else if (item.category === 'transport') {
                      iconName = 'flight';
                      iconBg = 'bg-purple-50 text-purple-600';
                      badgeBg = 'bg-purple-50 text-purple-700';
                    } else if (item.category === 'experience') {
                      iconName = 'verified';
                      iconBg = 'bg-emerald-50 text-emerald-600';
                      badgeBg = 'bg-emerald-50 text-emerald-700';
                    }

                    const categoryLabel = item.category === 'hotel'
                      ? 'Hotel'
                      : item.category === 'meal'
                      ? 'Dining'
                      : item.category === 'experience'
                      ? 'Experience'
                      : item.category === 'transport'
                      ? 'Transport'
                      : 'Activity';

                    return (
                      <div
                        key={item.id || idx}
                        className="flex items-start justify-between gap-3 sm:gap-4 relative group"
                      >
                        {/* Left Side: Icon & Details */}
                        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                          {/* Category Circle Icon on Timeline */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-2xs z-10 ${iconBg}`}
                          >
                            <span className="material-symbols-outlined text-lg">
                              {iconName}
                            </span>
                          </div>

                          {/* Item Details */}
                          <div className="min-w-0 pt-0.5">
                            <span className="text-[11px] font-semibold text-slate-400 block">
                              {item.time || '10:00 AM'}
                            </span>
                            <h3
                              onClick={() => setSelectedDetailItem({ item, source: 'board', dayNumber: activeDayNumber })}
                              className="font-bold text-sm text-slate-900 hover:text-blue-600 cursor-pointer transition-colors leading-snug line-clamp-1"
                            >
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5 truncate">
                              <span className="material-symbols-outlined text-xs text-slate-400">
                                location_on
                              </span>
                              <span className="truncate">{item.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${badgeBg}`}
                              >
                                {categoryLabel}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-xs text-slate-400 font-medium">
                                {item.duration || '2 hrs'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Side: Thumbnail Image */}
                        {item.image && (
                          <div
                            onClick={() => setSelectedDetailItem({ item, source: 'board', dayNumber: activeDayNumber })}
                            className="w-24 sm:w-28 h-18 sm:h-20 rounded-xl overflow-hidden shadow-2xs border border-slate-100 shrink-0 cursor-pointer hover:opacity-95 transition-opacity"
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* ------------------------------------------------------- */}
              {/* DAY TOTAL CARD AT BOTTOM                                */}
              {/* ------------------------------------------------------- */}
              <div
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full bg-[#F3F6FD] hover:bg-[#EBF1FD] border border-blue-100/70 rounded-2xl p-3.5 px-4 flex items-center justify-between cursor-pointer transition-all mt-2 shadow-2xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100/80 text-[#2563EB] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">auto_awesome</span>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium leading-none">
                      Day total
                    </div>
                    <div className="text-base font-extrabold text-slate-900 leading-tight mt-0.5">
                      ₹{currentDayTotal.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------- */}
            {/* BOTTOM CAROUSEL DAY PAGINATION & ARROWS                   */}
            {/* --------------------------------------------------------- */}
            <div className="flex flex-col items-center justify-center py-2 pb-6">
              <div className="flex items-center gap-3">
                {/* Left Arrow Button */}
                <button
                  onClick={() => setActiveDayNumber(prev => Math.max(1, prev - 1))}
                  disabled={activeDayNumber === 1}
                  className={`w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center shadow-2xs transition-all ${
                    activeDayNumber === 1
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:bg-slate-50 hover:border-slate-300 cursor-pointer active:scale-95'
                  }`}
                  title="Previous Day"
                >
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>

                {/* Dots Indicator */}
                <div className="flex items-center gap-1.5 px-2">
                  {itinerary.days.map(day => (
                    <button
                      key={day.dayNumber}
                      onClick={() => setActiveDayNumber(day.dayNumber)}
                      className={`transition-all cursor-pointer ${
                        day.dayNumber === activeDayNumber
                          ? 'w-2 h-2 rounded-full bg-[#2563EB]'
                          : 'w-1.5 h-1.5 rounded-full bg-slate-300 hover:bg-slate-400'
                      }`}
                      title={`Go to Day ${day.dayNumber}`}
                    />
                  ))}
                </div>

                {/* Right Arrow Button */}
                <button
                  onClick={() => setActiveDayNumber(prev => Math.min(itinerary.days.length, prev + 1))}
                  disabled={activeDayNumber === itinerary.days.length}
                  className={`w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center shadow-2xs transition-all ${
                    activeDayNumber === itinerary.days.length
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:bg-slate-50 hover:border-slate-300 cursor-pointer active:scale-95'
                  }`}
                  title="Next Day"
                >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>

              {/* Swipe Helper Text */}
              <p className="text-[11px] text-slate-400 font-medium mt-2">
                Swipe to view next day
              </p>
            </div>
          </div>

          {/* =========================================================== */}
          {/* 3. RIGHT SIDE FLOATING HELPER CARD                          */}
          {/* =========================================================== */}
          <div
            onClick={() => {
              if (activeDayNumber < itinerary.days.length) {
                setActiveDayNumber(prev => prev + 1);
              } else {
                setActiveDayNumber(1);
              }
            }}
            className="hidden xl:flex flex-col items-center justify-center text-center w-36 lg:w-40 h-44 rounded-2xl bg-white border border-slate-200/70 p-5 shadow-xs gap-2 shrink-0 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
            title="Click to advance to next day"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-xl">calendar_today</span>
            </div>
            <p className="text-xs font-semibold text-slate-700 leading-snug">
              View other days by swiping
            </p>
            <div className="flex items-center justify-center text-slate-400 mt-1">
              <span className="material-symbols-outlined text-2xl">swipe</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 4. MODALS & OVERLAYS                                          */}
      {/* ============================================================= */}
      <CustomItemModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddCustomItem={handleAddItemToDay}
        targetDayNumber={customModalTargetDay}
        totalDays={itinerary.days.length}
      />

      <CardDetailOverlay
        isOpen={!!selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
        item={selectedDetailItem?.item || null}
        source={selectedDetailItem?.source || 'board'}
        currentDayNumber={selectedDetailItem?.dayNumber || activeDayNumber}
        totalDays={itinerary.days.length}
        onAddToDay={(catItem, dayNum) => {
          handleAddItemToDay(catItem, dayNum);
          setSelectedDetailItem(null);
        }}
        onRemoveItem={itemId => {
          if (selectedDetailItem?.dayNumber) {
            handleRemoveItem(selectedDetailItem.dayNumber, itemId);
          }
          setSelectedDetailItem(null);
        }}
      />

      <BookingSummaryModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        itinerary={itinerary}
        pricing={pricing}
        isModifying={isModifyingBookedTrip}
        originalPrice={originalBookedPrice}
        onConfirmBooking={customPref => {
          if (isModifyingBookedTrip && onSaveModifications) {
            onSaveModifications(itinerary, pricing.total);
          } else if (onOpenPayment) {
            onOpenPayment(itinerary, pricing.total, customPref);
          } else if (onProceedToBooking) {
            onProceedToBooking(itinerary, pricing.total, customPref);
          } else {
            showToast(`Trip booked! All reservations held with priority concierge.`);
          }
        }}
      />
    </div>
  );
};
