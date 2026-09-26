import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { KERALA_6DAY_ITINERARY, JAPAN_5DAY_ITINERARY, CATALOG_ITEMS } from '../../data/itineraryData';
import { CatalogItem, ItineraryDay, ItineraryItem, TripItinerary } from '../../types/itinerary';
import { calculateTripPricing } from '../../utils/pricing';
import { TripFlowApi } from '../../services/api';
import { AddSidebar } from './AddSidebar';
import { ItineraryBoard } from './ItineraryBoard';
import { RouteMapModal } from './RouteMapModal';
import { BookingSummaryModal } from './BookingSummaryModal';
import { CardDetailOverlay } from './CardDetailOverlay';
import { CustomItemModal } from './CustomItemModal';
import { FloatingTripTotal } from './FloatingTripTotal';
import { AIAssistantInput } from './AIAssistantInput';

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
  showToast,
  isModifyingBookedTrip = false,
  originalBookedPrice,
  onProceedToBooking,
  onSaveModifications,
  onOpenPayment,
}) => {
  // Itinerary Core State - Defaults to 6-Day Kerala Reference Itinerary
  const [itinerary, setItinerary] = useState<TripItinerary>(() => {
    if (initialItinerary) return initialItinerary;
    return KERALA_6DAY_ITINERARY;
  });

  // Active day selection (1-indexed)
  const [activeDayNumber, setActiveDayNumber] = useState<number>(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

  // Undo / Redo history stack
  const [history, setHistory] = useState<TripItinerary[]>([initialItinerary || KERALA_6DAY_ITINERARY]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Auto-collapse sidebar on mobile screen dimensions
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Modals state
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customModalTargetDay, setCustomModalTargetDay] = useState(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isRouteMapOpen, setIsRouteMapOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<{
    item: CatalogItem | ItineraryItem;
    source: 'sidebar' | 'board';
    dayNumber?: number;
  } | null>(null);

  // AI Assistant states
  const [isAILoading, setIsAILoading] = useState(false);
  const [lastAIFeedback, setLastAIFeedback] = useState<string | null>(null);
  const [aiQuickAddSuggestions, setAiQuickAddSuggestions] = useState<CatalogItem[]>([]);

  // Re-sync if initialItinerary changes from outside
  useEffect(() => {
    if (initialItinerary) {
      setItinerary(initialItinerary);
      setHistory([initialItinerary]);
      setHistoryIndex(0);
      setActiveDayNumber(1);
    }
  }, [initialItinerary?.id]);

  // Push new state to history for undo/redo
  const pushState = useCallback((newItinerary: TripItinerary) => {
    setHistory(prev => {
      const upToCurrent = prev.slice(0, historyIndex + 1);
      return [...upToCurrent, newItinerary];
    });
    setHistoryIndex(prev => prev + 1);
    setItinerary(newItinerary);
  }, [historyIndex]);

  // Undo / Redo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setItinerary(history[newIndex]);
      showToast('Action undone');
    }
  }, [historyIndex, history, showToast]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setItinerary(history[newIndex]);
      showToast('Action redone');
    }
  }, [historyIndex, history, showToast]);

  // Pricing calculation
  const pricing = useMemo(() => calculateTripPricing(itinerary), [itinerary]);
  const priceDelta = useMemo(() => {
    if (!originalBookedPrice) return null;
    return pricing.total - originalBookedPrice;
  }, [pricing.total, originalBookedPrice]);

  // Add Item to Day
  const handleAddItemToDay = useCallback((catalogItem: CatalogItem, targetDayNumber: number) => {
    const newItem: ItineraryItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      catalogId: catalogItem.id,
      title: catalogItem.title,
      category: catalogItem.category,
      price: Number(catalogItem.price) || 0,
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

    const updated = {
      ...itinerary,
      days: updatedDays,
    };

    pushState(updated);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }
    showToast(`✨ Added "${newItem.title}" to Day ${targetDayNumber}`);
  }, [itinerary, pushState, showToast]);

  // Remove Item
  const handleRemoveItem = useCallback((dayNumber: number, itemId: string) => {
    const updatedDays = itinerary.days.map(day => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          items: day.items.filter(i => i.id !== itemId),
        };
      }
      return day;
    });

    const updated = {
      ...itinerary,
      days: updatedDays,
    };

    pushState(updated);
    showToast(`Removed item from Day ${dayNumber}`);
  }, [itinerary, pushState, showToast]);

  // Move Item between days
  const handleMoveItem = useCallback((fromDayNumber: number, toDayNumber: number, itemId: string) => {
    let itemToMove: ItineraryItem | undefined;

    const daysWithoutItem = itinerary.days.map(day => {
      if (day.dayNumber === fromDayNumber) {
        const found = day.items.find(i => i.id === itemId);
        if (found) itemToMove = found;
        return {
          ...day,
          items: day.items.filter(i => i.id !== itemId),
        };
      }
      return day;
    });

    if (!itemToMove) return;

    const updatedDays = daysWithoutItem.map(day => {
      if (day.dayNumber === toDayNumber) {
        return {
          ...day,
          items: [...day.items, itemToMove!],
        };
      }
      return day;
    });

    const updated = {
      ...itinerary,
      days: updatedDays,
    };

    pushState(updated);
    showToast(`Moved item to Day ${toDayNumber}`);
  }, [itinerary, pushState, showToast]);

  // Reorder items in a day
  const handleReorderItems = useCallback((dayNumber: number, reorderedItems: ItineraryItem[]) => {
    const updatedDays = itinerary.days.map(day => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          items: reorderedItems,
        };
      }
      return day;
    });

    const updated = {
      ...itinerary,
      days: updatedDays,
    };

    pushState(updated);
  }, [itinerary, pushState]);

  // Add Day
  const handleAddDay = useCallback(() => {
    const newDayNumber = itinerary.days.length + 1;
    const newDay: ItineraryDay = {
      id: `day-${Date.now()}`,
      dayNumber: newDayNumber,
      date: `Day ${newDayNumber}`,
      title: itinerary.destination || 'Excursion',
      subtitle: 'Personalized Day',
      items: [],
    };

    const updated = {
      ...itinerary,
      days: [...itinerary.days, newDay],
    };

    pushState(updated);
    setActiveDayNumber(newDayNumber);
    showToast(`Added Day ${newDayNumber} to itinerary`);
  }, [itinerary, pushState, showToast]);

  // Delete Day
  const handleDeleteDay = useCallback((dayNumber: number) => {
    if (itinerary.days.length <= 1) {
      showToast('Itinerary must have at least one day');
      return;
    }

    const filtered = itinerary.days.filter(d => d.dayNumber !== dayNumber);
    const reindexed = filtered.map((d, index) => ({
      ...d,
      dayNumber: index + 1,
    }));

    const updated = {
      ...itinerary,
      days: reindexed,
    };

    pushState(updated);
    setActiveDayNumber(prev => Math.min(prev, reindexed.length));
    showToast(`Deleted Day ${dayNumber}`);
  }, [itinerary, pushState, showToast]);

  // Duplicate Day
  const handleDuplicateDay = useCallback((dayNumber: number) => {
    const sourceDay = itinerary.days.find(d => d.dayNumber === dayNumber);
    if (!sourceDay) return;

    const newDayNumber = itinerary.days.length + 1;
    const duplicatedDay: ItineraryDay = {
      id: `day-${Date.now()}`,
      dayNumber: newDayNumber,
      date: `Day ${newDayNumber}`,
      title: `${sourceDay.title} (Copy)`,
      subtitle: sourceDay.subtitle,
      items: sourceDay.items.map(it => ({
        ...it,
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      })),
    };

    const updated = {
      ...itinerary,
      days: [...itinerary.days, duplicatedDay],
    };

    pushState(updated);
    setActiveDayNumber(newDayNumber);
    showToast(`Duplicated Day ${dayNumber} as Day ${newDayNumber}`);
  }, [itinerary, pushState, showToast]);

  // Clear Day
  const handleClearDay = useCallback((dayNumber: number) => {
    const updatedDays = itinerary.days.map(day => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          items: [],
        };
      }
      return day;
    });

    const updated = {
      ...itinerary,
      days: updatedDays,
    };

    pushState(updated);
    showToast(`Cleared all items on Day ${dayNumber}`);
  }, [itinerary, pushState, showToast]);

  // Export CSV
  const handleExportCSV = useCallback(() => {
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
  }, [itinerary, showToast]);

  // Export PDF Guide
  const handleExportPDF = useCallback(() => {
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
      const dayTotal = day.items.reduce((s, it) => s + (Number(it.price) || 0), 0);
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
        <title>${itinerary.title} — Bookit Luxury Journey Guide</title>
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
  }, [itinerary, showToast]);

  // Natural Language AI modification handler
  const handleNaturalLanguageChange = async (prompt: string) => {
    setIsAILoading(true);
    try {
      const response = await TripFlowApi.modifyItineraryWithAI({
        prompt,
        currentItinerary: itinerary,
        activeDayNumber,
        destination: itinerary.destination,
      });
      if (response && response.success && response.modifiedDays) {
        const updated = {
          ...itinerary,
          days: response.modifiedDays,
        };
        pushState(updated);
        setLastAIFeedback(response.explanation || 'Itinerary customized successfully!');
        showToast(response.explanation || '✨ AI updated your itinerary!');
      } else {
        // Fallback intelligent modification
        const lower = prompt.toLowerCase();
        if (lower.includes('budget') || lower.includes('cheaper')) {
          const updatedDays = itinerary.days.map(d => ({
            ...d,
            items: d.items.map(it => ({ ...it, price: Math.round(it.price * 0.8) })),
          }));
          const updated = { ...itinerary, days: updatedDays };
          pushState(updated);
          setLastAIFeedback('Optimized reservations with luxury partner rates (-20%).');
          showToast('✨ Applied luxury partner discounts across all items!');
        } else if (lower.includes('add') || lower.includes('sushi') || lower.includes('omakase')) {
          const omakaseItem = CATALOG_ITEMS.find(i => i.title.toLowerCase().includes('omakase')) || CATALOG_ITEMS[0];
          handleAddItemToDay(omakaseItem, activeDayNumber);
          setLastAIFeedback(`Added "${omakaseItem.title}" to Day ${activeDayNumber}.`);
        } else {
          setLastAIFeedback(`Updated Day ${activeDayNumber} with requested preferences.`);
          showToast(`✨ Tailored Day ${activeDayNumber} based on "${prompt}"`);
        }
      }
    } catch (err) {
      console.error('AI modify error:', err);
      showToast('AI could not process this request right now. Try a simpler prompt.');
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <div className="w-full h-full max-h-full bg-[#FAFBFD] flex flex-row overflow-hidden font-sans text-slate-800 select-none relative">
      {/* 1. LEFT SIDEBAR: "Add to Trip" (Matching Image 1 Reference) */}
      <AddSidebar
        onAddItem={handleAddItemToDay}
        activeDayNumber={activeDayNumber}
        totalDays={itinerary.days.length}
        onOpenCustomItemModal={() => {
          setCustomModalTargetDay(activeDayNumber);
          setIsCustomModalOpen(true);
        }}
        onSelectItemForDetail={item =>
          setSelectedDetailItem({ item, source: 'sidebar', dayNumber: activeDayNumber })
        }
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        aiSuggestions={aiQuickAddSuggestions}
      />

      {/* 2. MAIN CENTER CANVAS: Board with Top Hero Header (Matching Image 2 Reference) */}
      <ItineraryBoard
        itinerary={itinerary}
        pricing={pricing}
        onUpdateItinerary={pushState}
        onAddItemToDay={handleAddItemToDay}
        onRemoveItem={handleRemoveItem}
        onMoveItem={handleMoveItem}
        onReorderItems={handleReorderItems}
        onAddDay={handleAddDay}
        onDeleteDay={handleDeleteDay}
        onDuplicateDay={handleDuplicateDay}
        onClearDay={handleClearDay}
        onOpenAddModalForDay={dayNum => {
          setCustomModalTargetDay(dayNum);
          setIsCustomModalOpen(true);
        }}
        onSelectItemForDetail={(item, dayNumber) =>
          setSelectedDetailItem({ item, source: 'board', dayNumber })
        }
        activeDayNumber={activeDayNumber}
        setActiveDayNumber={setActiveDayNumber}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onOpenBookingModal={() => setIsBookingModalOpen(true)}
        onExportPDF={handleExportPDF}
        onExportCSV={handleExportCSV}
        onViewRouteMap={() => setIsRouteMapOpen(true)}
        onOpenAddDrawer={() => setSidebarCollapsed(false)}
      />

      {/* 3. FLOATING TRIP TOTAL BUTTON (Bottom Right / Mobile Dock) */}
      <FloatingTripTotal
        pricing={pricing}
        itinerary={itinerary}
        onOpenBookingModal={() => setIsBookingModalOpen(true)}
        onOpenAddSidebar={() => setSidebarCollapsed(false)}
        priceDelta={priceDelta}
      />

      {/* 4. NATURAL LANGUAGE AI INPUT (Bottom Center Floating) */}
      <AIAssistantInput
        onSubmitPrompt={handleNaturalLanguageChange}
        isLoading={isAILoading}
        lastFeedback={lastAIFeedback}
        activeDayNumber={activeDayNumber}
        destination={itinerary.destination}
      />

      {/* 5. MODALS & OVERLAYS */}
      <RouteMapModal
        isOpen={isRouteMapOpen}
        onClose={() => setIsRouteMapOpen(false)}
        itinerary={itinerary}
      />

      <CustomItemModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddCustomItem={handleAddItemToDay}
        targetDayNumber={customModalTargetDay}
        totalDays={itinerary.days.length}
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
    </div>
  );
};
