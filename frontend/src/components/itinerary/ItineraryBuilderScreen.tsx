import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_TRIP_ITINERARY } from '../../data/itineraryData';
import { CatalogItem, ItineraryDay, ItineraryItem, TripItinerary } from '../../types/itinerary';
import { processNaturalLanguageChange } from '../../utils/itineraryAI';
import { calculateTripPricing } from '../../utils/pricing';
import { AddBottomSheet } from './AddBottomSheet';
import { AddSidebar } from './AddSidebar';
import { AIAssistantInput } from './AIAssistantInput';
import { BookingSummaryModal } from './BookingSummaryModal';
import { CardDetailOverlay } from './CardDetailOverlay';
import { CustomItemModal } from './CustomItemModal';
import { FloatingTripTotal } from './FloatingTripTotal';
import { ItineraryBoard } from './ItineraryBoard';
import { MobileTimelineView } from './MobileTimelineView';

interface ItineraryBuilderScreenProps {
  initialItinerary?: TripItinerary;
  onBackToHome?: () => void;
  showToast: (msg: string) => void;
  isModifyingBookedTrip?: boolean;
  originalBookedPrice?: number;
  onProceedToBooking?: (itinerary: TripItinerary, total: number, customizations?: any) => void;
  onSaveModifications?: (itinerary: TripItinerary, total: number) => void;
  onOpenPayment?: (itinerary: TripItinerary, total: number, customizations?: any) => void;
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
}) => {
  // Itinerary Core State
  const [itinerary, setItinerary] = useState<TripItinerary>(() => {
    if (initialItinerary) return initialItinerary;
    const saved = localStorage.getItem('tripflow_itinerary_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse cached itinerary, using initial:', e);
      }
    }
    return INITIAL_TRIP_ITINERARY;
  });

  // Re-sync if initialItinerary changes from outside (e.g. user selected another premade trip or clicked modify)
  useEffect(() => {
    if (initialItinerary) {
      setItinerary(initialItinerary);
      setHistory([initialItinerary]);
      setHistoryIndex(0);
      setActiveDayNumber(1);
    }
  }, [initialItinerary?.id]);

  // History stack for Undo / Redo
  const [history, setHistory] = useState<TripItinerary[]>([itinerary]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Active day selection
  const [activeDayNumber, setActiveDayNumber] = useState<number>(1);

  // Responsive state
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Modals state
  const [isAddBottomSheetOpen, setIsAddBottomSheetOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customModalTargetDay, setCustomModalTargetDay] = useState(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Card Detail Modal State
  const [selectedDetailItem, setSelectedDetailItem] = useState<{
    item: CatalogItem | ItineraryItem;
    source: 'sidebar' | 'board';
    dayNumber?: number;
  } | null>(null);

  // AI Assistant state
  const [isAILoading, setIsAILoading] = useState(false);
  const [lastAIFeedback, setLastAIFeedback] = useState<string | null>(null);
  const [priceDelta, setPriceDelta] = useState<number | null>(null);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tripflow_itinerary_v1', JSON.stringify(itinerary));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [itinerary]);

  // Pricing calculation
  const pricing = useMemo(() => calculateTripPricing(itinerary), [itinerary]);

  // Push new state to history
  const pushState = useCallback((newItinerary: TripItinerary, delta?: number) => {
    setItinerary(newItinerary);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newItinerary]);
    setHistoryIndex(prev => prev + 1);
    if (delta !== undefined) {
      setPriceDelta(delta);
      setTimeout(() => setPriceDelta(null), 3000);
    }
  }, [historyIndex]);

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setItinerary(prev);
      showToast('Undid last change');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setItinerary(next);
      showToast('Redid change');
    }
  };

  // Keyboard shortcut listener for Ctrl+Z, Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // Add Item from Catalog to Day
  const handleAddItemToDay = (catalogItem: CatalogItem, targetDayNumber: number) => {
    const newItem: ItineraryItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      catalogId: catalogItem.id,
      title: catalogItem.title,
      category: catalogItem.category,
      price: catalogItem.price,
      time: catalogItem.timeSlotDefault,
      duration: catalogItem.duration,
      location: catalogItem.location,
      description: catalogItem.description,
      image: catalogItem.image,
      rating: catalogItem.rating,
      reviewsCount: catalogItem.reviewsCount,
      tags: catalogItem.tags,
      transitToNext: { mode: 'car', duration: '15 min' },
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

    const updatedItinerary = {
      ...itinerary,
      days: updatedDays,
    };

    pushState(updatedItinerary, newItem.price);
    showToast(`Added "${newItem.title}" to Day ${targetDayNumber} (+$${newItem.price})`);
  };

  // Remove Item from Day
  const handleRemoveItem = (dayNumber: number, itemId: string) => {
    let removedPrice = 0;
    let itemTitle = 'Item';

    const updatedDays = itinerary.days.map(day => {
      if (day.dayNumber === dayNumber) {
        const found = day.items.find(i => i.id === itemId);
        if (found) {
          removedPrice = found.price;
          itemTitle = found.title;
        }
        return {
          ...day,
          items: day.items.filter(i => i.id !== itemId),
        };
      }
      return day;
    });

    const updatedItinerary = {
      ...itinerary,
      days: updatedDays,
    };

    pushState(updatedItinerary, -removedPrice);
    showToast(`Removed "${itemTitle}" from Day ${dayNumber}`);
  };

  // Move Item Between Days
  const handleMoveItem = (fromDayNumber: number, toDayNumber: number, itemId: string) => {
    if (fromDayNumber === toDayNumber) return;

    let movedItem: ItineraryItem | null = null;

    // Step 1: Remove from source day
    const afterRemoval = itinerary.days.map(day => {
      if (day.dayNumber === fromDayNumber) {
        const found = day.items.find(i => i.id === itemId);
        if (found) movedItem = found;
        return {
          ...day,
          items: day.items.filter(i => i.id !== itemId),
        };
      }
      return day;
    });

    if (!movedItem) return;

    // Step 2: Add to destination day
    const finalDays = afterRemoval.map(day => {
      if (day.dayNumber === toDayNumber) {
        return {
          ...day,
          items: [...day.items, movedItem!],
        };
      }
      return day;
    });

    pushState({ ...itinerary, days: finalDays });
    showToast(`Moved "${(movedItem as ItineraryItem).title}" to Day ${toDayNumber}`);
  };

  // Reorder Items within a Day
  const handleReorderItems = (dayNumber: number, reorderedItems: ItineraryItem[]) => {
    const updatedDays = itinerary.days.map(day => {
      if (day.dayNumber === dayNumber) {
        return {
          ...day,
          items: reorderedItems,
        };
      }
      return day;
    });

    pushState({ ...itinerary, days: updatedDays });
  };

  // Add New Day
  const handleAddDay = () => {
    const nextDayNumber = itinerary.days.length + 1;
    const newDay: ItineraryDay = {
      id: `day-${nextDayNumber}-${Date.now()}`,
      dayNumber: nextDayNumber,
      date: `Day ${nextDayNumber}`,
      title: `Day ${nextDayNumber} Exploration`,
      subtitle: 'Free Exploration & Leisurely Discovery',
      items: [],
    };

    const updatedItinerary = {
      ...itinerary,
      days: [...itinerary.days, newDay],
    };

    pushState(updatedItinerary);
    setActiveDayNumber(nextDayNumber);
    showToast(`Added Day ${nextDayNumber} to itinerary`);
  };

  // Delete Day
  const handleDeleteDay = (dayNumber: number) => {
    if (itinerary.days.length <= 1) {
      showToast('Itinerary must have at least one day.');
      return;
    }

    const filtered = itinerary.days.filter(d => d.dayNumber !== dayNumber);
    const reindexedDays = filtered.map((d, index) => ({
      ...d,
      dayNumber: index + 1,
      date: d.date.startsWith('Day ') ? `Day ${index + 1}` : d.date,
    }));

    pushState({ ...itinerary, days: reindexedDays });
    setActiveDayNumber(Math.max(1, Math.min(dayNumber, reindexedDays.length)));
    showToast(`Deleted Day ${dayNumber}`);
  };

  // Duplicate Day
  const handleDuplicateDay = (dayNumber: number) => {
    const sourceDay = itinerary.days.find(d => d.dayNumber === dayNumber);
    if (!sourceDay) return;

    const nextDayNum = itinerary.days.length + 1;
    const duplicatedItems: ItineraryItem[] = sourceDay.items.map(it => ({
      ...it,
      id: `dup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    }));

    const newDay: ItineraryDay = {
      id: `day-${nextDayNum}-${Date.now()}`,
      dayNumber: nextDayNum,
      date: `Day ${nextDayNum}`,
      title: `${sourceDay.title} (Copy)`,
      subtitle: sourceDay.subtitle,
      items: duplicatedItems,
    };

    pushState({ ...itinerary, days: [...itinerary.days, newDay] });
    setActiveDayNumber(nextDayNum);
    showToast(`Duplicated Day ${dayNumber} into Day ${nextDayNum}`);
  };

  // Clear Day items
  const handleClearDay = (dayNumber: number) => {
    const updatedDays = itinerary.days.map(d => {
      if (d.dayNumber === dayNumber) {
        return { ...d, items: [] };
      }
      return d;
    });

    pushState({ ...itinerary, days: updatedDays });
    showToast(`Cleared all items from Day ${dayNumber}`);
  };

  // Natural Language AI Modification Handler
  const handleNaturalLanguageChange = async (prompt: string) => {
    setIsAILoading(true);
    setLastAIFeedback(null);

    try {
      const result = await processNaturalLanguageChange(prompt, itinerary, activeDayNumber);

      if (result.success && result.updatedDays) {

        const updatedItinerary = {
          ...itinerary,
          days: result.updatedDays,
        };
        pushState(updatedItinerary, result.priceDelta);
        setLastAIFeedback(result.explanation);
        setTimeout(() => {
          setLastAIFeedback(null);
        }, 5500);
        if (result.highlightDayNumber) {
          setActiveDayNumber(result.highlightDayNumber);
        }
        showToast(result.explanation);
      } else {
        showToast(result.explanation || 'Could not understand that request.');
      }
    } catch (err: any) {
      console.error('Error applying AI change:', err);
      showToast('An error occurred while modifying the itinerary.');
    } finally {
      setIsAILoading(false);
    }
  };

  // Reset to default sample
  const handleResetToDefault = () => {
    if (confirm('Reset itinerary back to the curated Tokyo & Kyoto 7-day trip?')) {
      pushState(INITIAL_TRIP_ITINERARY);
      setActiveDayNumber(1);
      showToast('Reset itinerary to default Tokyo & Kyoto showcase');
    }
  };

  // Share itinerary
  const handleShareItinerary = () => {
    const shareText = `Check out my TripFlow Itinerary: "${itinerary.title}" — ${itinerary.days.length} Days in ${itinerary.destination} with ${pricing.itemCount} curated experiences! Total: $${pricing.total.toLocaleString()} ($${pricing.perPerson.toLocaleString()}/person).`;
    navigator.clipboard?.writeText(shareText);
    showToast('Itinerary summary copied to clipboard! Ready to share.');
  };

  // Export CSV
  const handleExportCSV = () => {
    const rows = [
      ['Day', 'Date', 'Time', 'Category', 'Title', 'Location', 'Price ($)'],
    ];
    itinerary.days.forEach(day => {
      day.items.forEach(it => {
        rows.push([
          `Day ${day.dayNumber}`,
          `"${day.date}"`,
          `"${it.time}"`,
          `"${it.category}"`,
          `"${it.title.replace(/"/g, '""')}"`,
          `"${it.location.replace(/"/g, '""')}"`,
          it.price.toString(),
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
      `${itinerary.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_itinerary.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV guide successfully!');
  };

  // Export PDF Guide
  const handleExportPDF = () => {
    window.print();
    showToast('Opening print dialog to save or print as PDF...');
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full max-h-full bg-[#FBFBFA] relative overflow-hidden select-none">
      {/* Modification Banner if user is modifying an existing booked trip */}
      {isModifyingBookedTrip && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 z-30 shrink-0 shadow-2xs">
          <div className="flex items-center gap-2.5 text-xs text-left">
            <span className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-base">edit</span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-amber-950">
                  Modifying Confirmed Booking: {itinerary.title}
                </span>
                <span className="px-2 py-0.2 rounded-full bg-amber-200/80 text-amber-900 font-mono text-[10px] font-bold">
                  Live Pricing Active
                </span>
              </div>
              <div className="flex items-center gap-2 text-amber-800 text-[11px] mt-0.5 font-medium">
                <span>Original Paid: ₹{originalBookedPrice?.toLocaleString('en-IN') || pricing.total.toLocaleString('en-IN')}</span>
                <span>·</span>
                <span>Current Price: ₹{pricing.total.toLocaleString('en-IN')}</span>
                {originalBookedPrice !== undefined && pricing.total !== originalBookedPrice && (
                  <span className={`px-2 py-0.5 rounded-full font-bold font-mono text-[10px] ${
                    pricing.total > originalBookedPrice
                      ? 'bg-amber-200 text-amber-900 border border-amber-300'
                      : 'bg-emerald-200 text-emerald-900 border border-emerald-300'
                  }`}>
                    {pricing.total > originalBookedPrice
                      ? `+₹${(pricing.total - originalBookedPrice).toLocaleString('en-IN')} Difference`
                      : `-₹${(originalBookedPrice - pricing.total).toLocaleString('en-IN')} Refund Credit`}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsBookingModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>Review & Save Modifications</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace: Desktop (Sidebar + Board) vs Mobile (Timeline) */}
      <div className="flex-1 min-h-0 flex flex-row h-full max-h-full overflow-hidden">
        {/* Desktop Left Sidebar: "Add to Trip" */}
        {!isMobile && (
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
          />
        )}

        {/* Center Itinerary: Board (Desktop) or Vertical Timeline (Mobile) */}
        {isMobile ? (
          <MobileTimelineView
            itinerary={itinerary}
            activeDayNumber={activeDayNumber}
            setActiveDayNumber={setActiveDayNumber}
            onOpenAddBottomSheet={() => setIsAddBottomSheetOpen(true)}
            onRemoveItem={handleRemoveItem}
            onMoveItem={handleMoveItem}
            onReorderItems={handleReorderItems}
            onAddDay={handleAddDay}
            onDeleteDay={handleDeleteDay}
            onDuplicateDay={handleDuplicateDay}
            onClearDay={handleClearDay}
          />
        ) : (
          <ItineraryBoard
            itinerary={itinerary}
            pricing={pricing}
            onUpdateItinerary={updated => pushState(updated)}
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
            onResetToDefault={handleResetToDefault}
            onShareItinerary={handleShareItinerary}
            onOpenBookingModal={() => setIsBookingModalOpen(true)}
            onOpenAISuggestions={() => {
              const el = document.getElementById('ai-assistant-input');
              if (el) el.focus();
              showToast('Type a modification in the AI prompt below!');
            }}
            onExportPDF={handleExportPDF}
            onExportCSV={handleExportCSV}
            onViewRouteMap={() => {
              showToast(
                `Current Route: ${itinerary.routeStops?.map(s => s.city).join(' → ') || itinerary.destination}`
              );
            }}
          />
        )}
      </div>

      {/* Mobile "+ Add" Bottom Sheet */}
      {isMobile && (
        <AddBottomSheet
          isOpen={isAddBottomSheetOpen}
          onClose={() => setIsAddBottomSheetOpen(false)}
          onAddItem={handleAddItemToDay}
          activeDayNumber={activeDayNumber}
          totalDays={itinerary.days.length}
          onOpenCustomItemModal={() => {
            setCustomModalTargetDay(activeDayNumber);
            setIsCustomModalOpen(true);
          }}
        />
      )}

      {/* Custom Item Modal */}
      <CustomItemModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddCustomItem={handleAddItemToDay}
        targetDayNumber={customModalTargetDay}
        totalDays={itinerary.days.length}
      />

      {/* Booking Summary Modal */}
      <BookingSummaryModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        itinerary={itinerary}
        pricing={pricing}
        isModifying={isModifyingBookedTrip}
        originalPrice={originalBookedPrice}
        onConfirmBooking={customPref => {
          const customItems = itinerary.days
            .flatMap(d => d.items.map(it => ({ ...it, dayNumber: d.dayNumber })))
            .filter(it => it.tags?.includes('Custom') || it.price > 0 || it.category === 'activity')
            .map(it => ({
              id: it.id,
              title: it.title,
              category: it.category,
              dayNumber: it.dayNumber,
              price: it.price,
              description: it.description,
              location: it.location,
            }));

          const customizationDetails = {
            isCustomized: true,
            basePackageTitle: itinerary.title,
            basePrice: originalBookedPrice || Math.round(pricing.total * 0.8),
            customPrice: pricing.total,
            deltaPrice: Math.round(pricing.total - (originalBookedPrice || pricing.total * 0.8)),
            customRequests: customPref?.customRequests || 'Customized circuit with added experiences & preferences.',
            dietaryRestrictions: customPref?.dietaryRestrictions || 'Strict Vegetarian',
            transferPreference: customPref?.transferPreference || 'Toyota Vellfire Executive Lounge',
            customItemsAdded: customItems,
            fulfillmentStatus: {
              hotelBooked: false,
              flightBooked: false,
              transferBooked: false,
              activityBooked: false,
              guideAssigned: false,
            },
          };

          if (isModifyingBookedTrip && onSaveModifications) {
            onSaveModifications(itinerary, pricing.total);
          } else if (onOpenPayment) {
            onOpenPayment(itinerary, pricing.total, customizationDetails);
          } else if (onProceedToBooking) {
            onProceedToBooking(itinerary, pricing.total, customizationDetails);
          } else {
            showToast(`Trip booked! All ${pricing.itemCount} reservations held with 24/7 concierge.`);
          }
        }}
      />

      {/* Card Detail Overlay (View & Edit item when clicking cards in board or sidebar) */}
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
        onMoveToDay={(itemId, targetDay) => {
          if (selectedDetailItem?.dayNumber) {
            handleMoveItem(selectedDetailItem.dayNumber, targetDay, itemId);
          }
          setSelectedDetailItem(null);
        }}
        onRemoveItem={itemId => {
          if (selectedDetailItem?.dayNumber) {
            handleRemoveItem(selectedDetailItem.dayNumber, itemId);
          }
          setSelectedDetailItem(null);
        }}
        onUpdateItem={updated => {
          if (selectedDetailItem?.dayNumber) {
            const day = itinerary.days.find(d => d.dayNumber === selectedDetailItem.dayNumber);
            if (day) {
              const newItems = day.items.map(it => (it.id === updated.id ? updated : it));
              handleReorderItems(selectedDetailItem.dayNumber, newItems);
            }
          }
          setSelectedDetailItem(null);
        }}
      />

      {/* Floating Budget Card in Right Bottom Corner */}
      <FloatingTripTotal
        pricing={pricing}
        itinerary={itinerary}
        onOpenBookingModal={() => setIsBookingModalOpen(true)}
        onShareItinerary={handleShareItinerary}
        priceDelta={priceDelta}
      />

      {/* Bottom "✨ What would you like to change?" AI Input */}
      <AIAssistantInput
        onSubmitPrompt={handleNaturalLanguageChange}
        isLoading={isAILoading}
        lastFeedback={lastAIFeedback}
        activeDayNumber={activeDayNumber}
        destination={itinerary.destination}
      />

    </div>
  );
};
