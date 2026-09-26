import React, { useState, useMemo, useEffect } from 'react';
import { CATALOG_ITEMS } from '../../data/itineraryData';
import { CatalogItem } from '../../types/itinerary';
import { clearDragPayload, setDragPayload } from '../../utils/dragDropState';
import { TripFlowApi } from '../../services/api';

interface AddSidebarProps {
  onAddItem: (item: CatalogItem, targetDayNumber: number) => void;
  activeDayNumber: number;
  totalDays: number;
  onOpenCustomItemModal: () => void;
  onSelectItemForDetail?: (item: CatalogItem) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  aiSuggestions?: CatalogItem[];
}

interface SidebarCategoryConfig {
  id: string;
  label: string;
  icon: string;
  filterKey: 'ai_picks' | 'activity' | 'hotel' | 'transport' | 'meal';
  description: string;
}

const SIDEBAR_CATEGORIES: SidebarCategoryConfig[] = [
  {
    id: 'ai_picks',
    label: 'AI Picks',
    icon: 'auto_awesome',
    filterKey: 'ai_picks',
    description: 'Curated add-ons & hotel switch suggestions',
  },
  {
    id: 'activity',
    label: 'Activities',
    icon: 'confirmation_number',
    filterKey: 'activity',
    description: 'Tours, culture & sightseeing',
  },
  {
    id: 'hotel',
    label: 'Hotels',
    icon: 'bed',
    filterKey: 'hotel',
    description: 'Luxury stays, villas & resorts',
  },
  {
    id: 'transport',
    label: 'Transport',
    icon: 'flight',
    filterKey: 'transport',
    description: 'Flights, airport pickups & trains',
  },
  {
    id: 'meal',
    label: 'Dining & Food',
    icon: 'restaurant',
    filterKey: 'meal',
    description: 'Michelin omakase & fine dining',
  },
];

// Curated AI Picks: recommendations for extra things to add, hotels to switch to, or upgrades
const AI_RECOMMENDATION_ITEMS: (CatalogItem & { catalogId?: string; aiBadge?: string; aiReason?: string })[] = [
  {
    id: 'ai-switch-taj',
    title: 'Switch Hotel: Taj Lake Palace Heritage Suite',
    category: 'hotel',
    price: 680,
    timeSlotDefault: '02:00 PM',
    duration: 'Overnight',
    location: 'Lake Pichola / Waterfront',
    description: 'AI Suggestion: Upgrade to this 5-star floating palace with private boat transfer and royal butler service.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    rating: 4.98,
    reviewsCount: 410,
    tags: ['AI Pick', 'Hotel Switch', '5-Star Luxury'],
    aiBadge: 'Switch Hotel',
    aiReason: 'Popular luxury upgrade alternative with lakefront views',
  },
  {
    id: 'ai-switch-kumarakom',
    title: 'Switch Hotel: Kumarakom Lake Resort Villa',
    category: 'hotel',
    price: 520,
    timeSlotDefault: '02:00 PM',
    duration: 'Overnight',
    location: 'Vembanad Lake, Kumarakom',
    description: 'AI Suggestion: Switch to a heritage private plunge pool villa with traditional Meenachil architecture.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    rating: 4.96,
    reviewsCount: 380,
    tags: ['AI Pick', 'Hotel Switch', 'Private Pool'],
    aiBadge: 'Switch Hotel',
    aiReason: 'Closer to backwaters with private plunge pool',
  },
  {
    id: 'ai-add-houseboat',
    title: 'Add-on: Private Houseboat Twilight Cruise',
    category: 'experience',
    price: 380,
    timeSlotDefault: '04:00 PM',
    duration: '4 hrs',
    location: 'Vembanad Backwaters',
    description: 'AI Suggestion: Handcrafted wooden kettuvalam cruise with private chef, fresh seafood, and sunset dock.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    rating: 4.95,
    reviewsCount: 185,
    tags: ['AI Pick', 'Sunset Cruise', 'Recommended Add-on'],
    aiBadge: 'Recommended Add-on',
    aiReason: 'Top-rated evening experience to complement your schedule',
  },
  {
    id: 'ai-upgrade-flight',
    title: 'Upgrade: Emirates First Class Private Suite',
    category: 'transport',
    price: 850,
    timeSlotDefault: '02:45 PM',
    duration: '3h 45m',
    location: 'DXB → COK Concourse A',
    description: 'AI Suggestion: Upgrade to enclosed zero-gravity suite with Bulgari amenities and Dom Pérignon service.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    rating: 4.99,
    reviewsCount: 310,
    tags: ['AI Pick', 'Flight Upgrade', 'First Class'],
    aiBadge: 'Upgrade Transit',
    aiReason: 'Fly in luxury with private suite and fast-track lounge',
  },
  {
    id: 'ai-add-omakase',
    title: 'Add-on: Michelin Omakase Chef Table Dinner',
    category: 'meal',
    price: 260,
    timeSlotDefault: '07:30 PM',
    duration: '2 hrs',
    location: 'Private 6-Seat Counter',
    description: 'AI Suggestion: 18 courses of pristine Edomae sushi hand-pressed before you by a third-generation master.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    rating: 4.98,
    reviewsCount: 340,
    tags: ['AI Pick', 'Fine Dining', 'Chef Counter'],
    aiBadge: 'Recommended Dining',
    aiReason: 'Exclusive reservation reserved for Bookit guests',
  },
  {
    id: 'ai-add-tea-masterclass',
    title: 'Add-on: Highlands Mist Tea Plantation Walk',
    category: 'activity',
    price: 75,
    timeSlotDefault: '10:00 AM',
    duration: '2.5 hrs',
    location: 'Mountain Terraces',
    description: 'AI Suggestion: Guided morning walk through high-altitude misty tea terraces followed by artisanal tasting.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    rating: 4.88,
    reviewsCount: 310,
    tags: ['AI Pick', 'Tea Estate', 'Scenic Walk'],
    aiBadge: 'Recommended Activity',
    aiReason: 'Pairs perfectly with morning leisure time',
  },
];

export const AddSidebar: React.FC<AddSidebarProps> = ({
  onAddItem,
  activeDayNumber,
  totalDays,
  onOpenCustomItemModal,
  onSelectItemForDetail,
  isCollapsed = false,
  onToggleCollapse,
  aiSuggestions = [],
}) => {
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(CATALOG_ITEMS);
  // Default to AI Picks so smart recommendations are immediately visible
  const [expandedCategory, setExpandedCategory] = useState<string | null>('ai_picks');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDayForAdd, setSelectedDayForAdd] = useState<number>(activeDayNumber || 1);

  useEffect(() => {
    TripFlowApi.getCatalogItems().then(items => {
      if (items && items.length > 0) {
        const catalogMap = new Map(CATALOG_ITEMS.map(c => [c.id, c]));
        const merged = items.map((it: any) => {
          const local = catalogMap.get(it.id);
          return {
            ...it,
            price: Number(it.price || local?.price || 0),
            rating: Number(it.rating || local?.rating || 4.9),
            image: it.image || local?.image || '',
            duration: it.duration || local?.duration || '2 hrs',
          };
        });
        const apiIds = new Set(items.map((i: any) => i.id));
        const extraLocal = CATALOG_ITEMS.filter(c => !apiIds.has(c.id));
        setCatalogItems([...merged, ...extraLocal]);
      }
    });
  }, []);

  useEffect(() => {
    if (activeDayNumber) {
      setSelectedDayForAdd(activeDayNumber);
    }
  }, [activeDayNumber]);

  // Handle single-expanded dropdown click (accordion: only one open at a time)
  const handleCategoryClick = (categoryId: string) => {
    setExpandedCategory(prev => (prev === categoryId ? null : categoryId));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transport':
        return 'flight';
      case 'hotel':
        return 'bed';
      case 'meal':
        return 'restaurant';
      case 'experience':
        return 'explore';
      default:
        return 'confirmation_number';
    }
  };

  // Group items into their respective categories
  const categoryItemsMap = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const filterItem = (item: CatalogItem) => {
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.tags?.some(t => t.toLowerCase().includes(q))
      );
    };

    // 1. AI Picks: Curated recommendations (hotel switches, add-ons, upgrades, plus aiSuggestions)
    const baseAI = AI_RECOMMENDATION_ITEMS.filter(filterItem);
    const existingAiIds = new Set(baseAI.map(i => i.id));
    const dynamicAi = aiSuggestions
      .filter(s => !existingAiIds.has(s.id) && filterItem(s))
      .map(s => ({
        ...s,
        aiBadge: s.category === 'hotel' ? 'Switch Hotel' : 'AI Recommendation',
        aiReason: 'Suggested based on your latest prompt',
      }));
    const ai_picks = [...dynamicAi, ...baseAI];

    // 2. Activities: All activity and tour items
    const activity = catalogItems.filter(
      i => (i.category === 'activity' || i.category === 'experience') && filterItem(i)
    );

    // 3. Hotels: All hotel stays, resorts, and villas
    const hotel = catalogItems.filter(i => i.category === 'hotel' && filterItem(i));

    // 4. Transport: Flights, airport transfers, bullet trains, and private chauffeurs
    const transport = catalogItems.filter(i => i.category === 'transport' && filterItem(i));

    // 5. Dining & Food: Fine dining, omakase, and food experiences
    const meal = catalogItems.filter(i => i.category === 'meal' && filterItem(i));

    return {
      ai_picks,
      activity,
      hotel,
      transport,
      meal,
    };
  }, [catalogItems, searchQuery, aiSuggestions]);

  // Drag start handler for catalog cards
  const handleDragStart = (e: React.DragEvent, item: CatalogItem) => {
    const payload = { type: 'catalog-item' as const, item };
    setDragPayload(payload);
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
    e.dataTransfer.setData('text/plain', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    clearDragPayload();
  };

  // Collapsed Sidebar View
  if (isCollapsed) {
    return (
      <aside className="hidden md:flex w-14 bg-white border-r border-slate-200/80 flex-col items-center py-4 shrink-0 select-none shadow-2xs">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
          title="Expand Sidebar"
        >
          <span className="material-symbols-outlined text-xl">chevron_right</span>
        </button>

        <div className="mt-6 flex flex-col items-center gap-3">
          {SIDEBAR_CATEGORIES.map(cat => {
            const isActive = expandedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onToggleCollapse && onToggleCollapse();
                  setExpandedCategory(cat.id);
                }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-2xs font-bold'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title={cat.label}
              >
                <span className="material-symbols-outlined text-lg">{cat.icon}</span>
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 md:hidden animate-in fade-in duration-200"
        onClick={onToggleCollapse}
      />

      <aside className="fixed md:static inset-y-0 left-0 z-50 w-[88vw] max-w-[340px] md:w-72 lg:w-80 bg-white md:border-r border-slate-200/80 flex flex-col shrink-0 h-full max-h-full min-h-0 overflow-hidden select-none shadow-2xl md:shadow-2xs animate-in slide-in-from-left duration-250 md:animate-none">
        {/* 1. Header Toolbar */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-xl font-medium">
              layers
            </span>
            <span className="text-sm font-bold text-slate-900 tracking-tight">Add to Trip</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenCustomItemModal}
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-2.5 py-1 rounded-lg cursor-pointer transition-colors border border-slate-200/70"
              title="Create a custom item for this itinerary"
            >
              + Custom
            </button>
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                title="Close sidebar"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            )}
          </div>
        </div>

      {/* 2. Target Day Selector & Search Filter */}
      <div className="p-3 bg-slate-50/60 border-b border-slate-100/90 flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Add items to:</span>
          <div className="relative">
            <select
              value={selectedDayForAdd}
              onChange={e => setSelectedDayForAdd(Number(e.target.value))}
              className="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1 pr-6 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              {Array.from({ length: totalDays }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>
                  Day {num}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined text-xs text-slate-400 absolute right-1.5 top-1.5 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-sm">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search activities, hotels, flights..."
            className="w-full text-xs pl-8 pr-7 py-1.5 rounded-xl bg-white border border-slate-200/90 placeholder:text-slate-400 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. Category Accordion List (AI Picks, Activities, Hotels, Transport, Dining) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-1.5 custom-scrollbar bg-white">
        {SIDEBAR_CATEGORIES.map(category => {
          const isExpanded = expandedCategory === category.id;
          const items = categoryItemsMap[category.filterKey] || [];
          const count = items.length;

          return (
            <div key={category.id} className="flex flex-col">
              {/* Category Header Row */}
              <button
                type="button"
                onClick={() => handleCategoryClick(category.id)}
                className={`w-full px-3.5 py-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer group text-left ${
                  isExpanded
                    ? 'bg-[#EFF6FF] text-[#2563EB] shadow-2xs font-semibold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium'
                }`}
                title={category.description}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`material-symbols-outlined text-xl transition-colors ${
                      isExpanded ? 'text-[#2563EB]' : 'text-slate-500 group-hover:text-slate-800'
                    }`}
                  >
                    {category.icon}
                  </span>
                  <span className="text-sm truncate">{category.label}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Subtle Count Pill */}
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold transition-colors ${
                      isExpanded
                        ? 'bg-blue-100/90 text-blue-700'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/70 group-hover:text-slate-700'
                    }`}
                  >
                    {count}
                  </span>

                  {/* Dropdown Chevron Indicator */}
                  <span
                    className={`material-symbols-outlined text-base transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    expand_more
                  </span>
                </div>
              </button>

              {/* 4. Dropdown Drawer (Smoothly expands when clicked) */}
              {isExpanded && (
                <div className="pt-2 pb-2 pl-1 pr-1 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {items.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                      No items found in {category.label}
                    </div>
                  ) : (
                    /* Draggable Cards List */
                    items.map((item: any) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={e => handleDragStart(e, item)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onSelectItemForDetail && onSelectItemForDetail(item)}
                        className="group bg-white hover:bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 rounded-xl p-2.5 shadow-2xs hover:shadow-xs transition-all cursor-grab active:cursor-grabbing flex items-center justify-between gap-2.5 select-none relative"
                      >
                        {/* Drag Handle + Thumbnail + Info */}
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span
                            className="material-symbols-outlined text-slate-300 group-hover:text-slate-500 text-base shrink-0 cursor-grab active:cursor-grabbing -ml-0.5"
                            title="Drag onto any day in your itinerary"
                          >
                            drag_indicator
                          </span>

                          {/* Image with fallback icon badge */}
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              onError={e => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                              className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-100 shadow-2xs"
                            />
                          ) : null}
                          <div
                            className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/80"
                            style={{ display: item.image ? 'none' : 'flex' }}
                          >
                            <span className="material-symbols-outlined text-lg">
                              {getCategoryIcon(item.category)}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                              {item.title}
                            </h5>

                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                              <span>{item.duration || '2 hrs'}</span>
                              <span>•</span>
                              <span className="font-extrabold text-slate-900">
                                ₹{item.price.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Add Button */}
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            onAddItem(item, selectedDayForAdd);
                          }}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-500 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                          title={`Add to Day ${selectedDayForAdd}`}
                        >
                          <span className="material-symbols-outlined text-sm font-bold">add</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      </aside>
    </>
  );
};
