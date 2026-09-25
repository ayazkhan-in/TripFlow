import { CATALOG_ITEMS } from '../data/itineraryData';
import { CatalogItem, ItineraryDay, ItineraryItem, TripItinerary } from '../types/itinerary';

export interface AIModificationResult {
  success: boolean;
  explanation: string;
  updatedDays: ItineraryDay[];
  highlightDayNumber?: number;
  highlightItemId?: string;
  priceDelta?: number;
}

export async function processNaturalLanguageChange(
  prompt: string,
  itinerary: TripItinerary
): Promise<AIModificationResult> {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return {
      success: false,
      explanation: 'Please enter a request for what you would like to change.',
      updatedDays: itinerary.days,
    };
  }

  // 1. Attempt server AI call if available
  try {
    const res = await fetch('/api/itinerary-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: trimmed,
        currentItinerary: itinerary,
        catalog: CATALOG_ITEMS,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.modifiedDays) && data.modifiedDays.length > 0) {
        return {
          success: true,
          explanation: data.explanation || 'Updated your itinerary according to your request.',
          updatedDays: data.modifiedDays,
          highlightDayNumber: data.targetDayNumber || 1,
        };
      }
    }
  } catch (e) {
    console.warn('Backend AI endpoint unavailable, using smart local parser:', e);
  }

  // 2. Intelligent Local Natural Language Rule Engine (Runs offline & instant)
  return applyLocalAIHeuristics(trimmed, itinerary);
}

function applyLocalAIHeuristics(
  prompt: string,
  itinerary: TripItinerary
): AIModificationResult {
  const lower = prompt.toLowerCase();
  const daysCopy: ItineraryDay[] = JSON.parse(JSON.stringify(itinerary.days));

  // Helper to extract target day (defaulting to Day 1 or Day 2)
  let targetDayNumber = 1;
  const dayMatch = lower.match(/day\s*(\d+)/i) || lower.match(/day-(\d+)/i);
  if (dayMatch) {
    const parsed = parseInt(dayMatch[1], 10);
    if (parsed > 0 && parsed <= daysCopy.length) {
      targetDayNumber = parsed;
    }
  } else if (lower.includes('first day') || lower.includes('day one')) {
    targetDayNumber = 1;
  } else if (lower.includes('second day') || lower.includes('day two')) {
    targetDayNumber = Math.min(2, daysCopy.length);
  } else if (lower.includes('third day') || lower.includes('day three')) {
    targetDayNumber = Math.min(3, daysCopy.length);
  } else if (lower.includes('last day') || lower.includes('final day')) {
    targetDayNumber = daysCopy.length;
  }

  const targetDay = daysCopy.find(d => d.dayNumber === targetDayNumber) || daysCopy[0];

  // ================= ACTION: ADD A NEW DAY =================
  if (
    lower.includes('add day') ||
    lower.includes('extra day') ||
    lower.includes('add another day') ||
    lower.includes('extend trip')
  ) {
    const nextDayNum = daysCopy.length + 1;
    const newDay: ItineraryDay = {
      id: `day-${nextDayNum}-${Date.now().toString().slice(-4)}`,
      dayNumber: nextDayNum,
      date: `Day ${nextDayNum}`,
      title: 'Free Exploration & Cultural Highlights',
      subtitle: 'Personalized Day • Local Markets & Scenic Views',
      items: [
        {
          id: `item-gen-${Date.now()}-1`,
          catalogId: 'mel-tsukiji-sashimi',
          title: 'Artisanal Brunch & Market Exploration',
          category: 'meal',
          price: 45,
          time: '10:00 AM',
          duration: '1.5 hrs',
          location: 'Central Culinary Quarter',
          description: 'Relaxed morning sampling specialty regional dishes and craft coffee.',
          image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          tags: ['Brunch', 'Local Flavor'],
        },
        {
          id: `item-gen-${Date.now()}-2`,
          catalogId: 'act-shibuya-sky',
          title: 'Sunset Panorama & Golden Hour Walk',
          category: 'activity',
          price: 38,
          time: '04:30 PM',
          duration: '2 hrs',
          location: 'Scenic Viewpoint Deck',
          description: 'Spectacular sunset vantage point capturing the entire skyline.',
          image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
          rating: 4.92,
          tags: ['Sunset', 'Photography'],
        },
      ],
    };

    daysCopy.push(newDay);
    return {
      success: true,
      explanation: `✨ Added Day ${nextDayNum} to your itinerary with curated morning brunch and a sunset skyline experience!`,
      updatedDays: daysCopy,
      highlightDayNumber: nextDayNum,
      priceDelta: 83,
    };
  }

  // ================= ACTION: MOVE AN ITEM BETWEEN DAYS =================
  if (lower.includes('move') || lower.includes('shift') || lower.includes('reschedule')) {
    // Find destination day: e.g. "to day 2", "to day 3"
    const destMatch = lower.match(/(?:to|into)\s+day\s*(\d+)/i);
    let destDayNum = destMatch ? parseInt(destMatch[1], 10) : (targetDayNumber === 1 ? 2 : 1);
    if (destDayNum > daysCopy.length) destDayNum = daysCopy.length;

    // Source day: if specified "from day 1"
    const srcMatch = lower.match(/(?:from)\s+day\s*(\d+)/i);
    const srcDayNum = srcMatch ? parseInt(srcMatch[1], 10) : targetDayNumber;

    const srcDay = daysCopy.find(d => d.dayNumber === srcDayNum) || daysCopy[0];
    const destDay = daysCopy.find(d => d.dayNumber === destDayNum) || daysCopy[1] || daysCopy[0];

    if (srcDay && destDay && srcDay.items.length > 0 && srcDay.id !== destDay.id) {
      // Find candidate item matching keyword, or pick first activity/experience
      let itemIndex = srcDay.items.findIndex(it =>
        lower.includes(it.title.toLowerCase().split(' ')[0]) ||
        lower.includes(it.category)
      );
      if (itemIndex === -1) itemIndex = srcDay.items.length - 1;

      const [movedItem] = srcDay.items.splice(itemIndex, 1);
      destDay.items.push(movedItem);

      return {
        success: true,
        explanation: `✨ Moved "${movedItem.title}" from Day ${srcDay.dayNumber} to Day ${destDay.dayNumber}.`,
        updatedDays: daysCopy,
        highlightDayNumber: destDay.dayNumber,
        highlightItemId: movedItem.id,
      };
    }
  }

  // ================= ACTION: REMOVE AN ITEM =================
  if (
    lower.includes('remove') ||
    lower.includes('delete') ||
    lower.includes('drop') ||
    lower.includes('cancel') ||
    lower.includes('take out')
  ) {
    if (targetDay.items.length > 0) {
      // Identify item by category or highest cost or matching word
      let targetIndex = -1;
      if (lower.includes('expensive') || lower.includes('highest')) {
        targetIndex = targetDay.items.reduce(
          (maxIdx, item, idx, arr) => (item.price > arr[maxIdx].price ? idx : maxIdx),
          0
        );
      } else if (lower.includes('dinner') || lower.includes('meal') || lower.includes('food')) {
        targetIndex = targetDay.items.findIndex(i => i.category === 'meal');
      } else if (lower.includes('hotel') || lower.includes('stay')) {
        targetIndex = targetDay.items.findIndex(i => i.category === 'hotel');
      } else if (lower.includes('transport') || lower.includes('transfer')) {
        targetIndex = targetDay.items.findIndex(i => i.category === 'transport');
      } else {
        targetIndex = targetDay.items.findIndex(i =>
          lower.includes(i.title.toLowerCase().slice(0, 8))
        );
      }

      if (targetIndex === -1) targetIndex = targetDay.items.length - 1;
      const [removed] = targetDay.items.splice(targetIndex, 1);

      return {
        success: true,
        explanation: `✨ Removed "${removed.title}" from Day ${targetDay.dayNumber}. Saved $${removed.price} on your trip total!`,
        updatedDays: daysCopy,
        highlightDayNumber: targetDay.dayNumber,
        priceDelta: -removed.price,
      };
    }
  }

  // ================= ACTION: BUDGET OPTIMIZATION =================
  if (
    lower.includes('budget') ||
    lower.includes('cheaper') ||
    lower.includes('affordable') ||
    lower.includes('reduce cost') ||
    lower.includes('save money')
  ) {
    let replacedAny = false;
    let savings = 0;

    // Replace high-end hotels ($850) with boutique chic ($320)
    daysCopy.forEach(day => {
      day.items = day.items.map(item => {
        if (item.category === 'hotel' && item.price > 500) {
          replacedAny = true;
          savings += item.price - 320;
          return {
            ...item,
            title: 'TRUNK(HOTEL) Boutique Loft & Terrace',
            price: 320,
            description: 'Stylish eco-luxe boutique stay in Shibuya with terrace cocktails and walking proximity.',
            image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
            tags: ['Boutique Value', 'Design Hotel'],
          };
        }
        if (item.category === 'meal' && item.price > 200) {
          replacedAny = true;
          savings += item.price - 70;
          return {
            ...item,
            title: 'Authentic Local Izakaya & Charcoal Yakitori',
            price: 70,
            description: 'Bustling neighborhood dining with skewers, crispy gyoza, and local draught beer.',
            image: 'https://images.unsplash.com/photo-1554502078-ef0fc409efce?auto=format&fit=crop&w=800&q=80',
            tags: ['Authentic', 'Great Value'],
          };
        }
        return item;
      });
    });

    if (replacedAny) {
      return {
        success: true,
        explanation: `✨ Optimized your itinerary for high value! Swapped ultra-luxury items for top-rated boutique alternatives, reducing your total trip cost by $${savings}.`,
        updatedDays: daysCopy,
        highlightDayNumber: targetDay.dayNumber,
        priceDelta: -savings,
      };
    }
  }

  // ================= ACTION: ADD / INSERT MATCHING CATALOG ITEM =================
  // Find best catalog item based on keywords in prompt
  let bestMatch: CatalogItem | null = null;

  if (lower.includes('sunset') || lower.includes('shibuya') || lower.includes('observation')) {
    bestMatch = CATALOG_ITEMS.find(c => c.id === 'act-shibuya-sky') || null;
  } else if (lower.includes('teamlab') || lower.includes('digital art') || lower.includes('art')) {
    bestMatch = CATALOG_ITEMS.find(c => c.id === 'act-teamlab-planets') || null;
  } else if (lower.includes('sushi') || lower.includes('jiro') || lower.includes('omakase')) {
    bestMatch = CATALOG_ITEMS.find(c => c.id === 'mel-sukiyabashi-sushi') || null;
  } else if (lower.includes('wagyu') || lower.includes('kobe') || lower.includes('steak') || lower.includes('teppan')) {
    bestMatch = CATALOG_ITEMS.find(c => c.id === 'mel-wagyu-teppan') || null;
  } else if (lower.includes('tea') || lower.includes('matcha') || lower.includes('ceremony')) {
    bestMatch = CATALOG_ITEMS.find(c => c.id === 'exp-matcha-ceremony') || null;
  } else if (lower.includes('helicopter') || lower.includes('fuji') || lower.includes('flight')) {
    bestMatch = CATALOG_ITEMS.find(c => c.id === 'exp-fuji-helicopter') || null;
  } else if (lower.includes('samurai') || lower.includes('sword') || lower.includes('katana')) {
    bestMatch = CATALOG_ITEMS.find(c => c.id === 'exp-samurai-forge') || null;
  } else if (lower.includes('geisha') || lower.includes('gion') || lower.includes('banquet')) {
    bestMatch = CATALOG_ITEMS.find(c => c.id === 'exp-geisha-banquet') || null;
  } else if (lower.includes('bullet train') || lower.includes('shinkansen') || lower.includes('train')) {
    bestMatch = CATALOG_ITEMS.find(c => c.id === 'trn-shinkansen-gran') || null;
  } else if (lower.includes('chauffeur') || lower.includes('mercedes') || lower.includes('airport') || lower.includes('transfer')) {
    bestMatch = CATALOG_ITEMS.find(c => c.id === 'trn-narita-chauffeur') || null;
  } else if (lower.includes('hotel') || lower.includes('aman') || lower.includes('luxury stay') || lower.includes('ryokan')) {
    bestMatch = CATALOG_ITEMS.find(c => c.id === 'htl-hoshinoya-kyoto') || CATALOG_ITEMS.find(c => c.id === 'htl-aman-tokyo') || null;
  } else if (lower.includes('seafood') || lower.includes('tsukiji') || lower.includes('market')) {
    bestMatch = CATALOG_ITEMS.find(c => c.id === 'mel-tsukiji-sashimi') || null;
  } else if (lower.includes('bamboo') || lower.includes('arashiyama')) {
    bestMatch = CATALOG_ITEMS.find(c => c.id === 'act-bamboo-grove') || null;
  } else if (lower.includes('kimono') || lower.includes('sensoji')) {
    bestMatch = CATALOG_ITEMS.find(c => c.id === 'act-sensoji-kimono') || null;
  }

  // Fallback: pick any unused catalog item for target category
  if (!bestMatch) {
    if (lower.includes('dinner') || lower.includes('lunch') || lower.includes('meal')) {
      bestMatch = CATALOG_ITEMS.find(c => c.category === 'meal') || null;
    } else if (lower.includes('hotel') || lower.includes('stay')) {
      bestMatch = CATALOG_ITEMS.find(c => c.category === 'hotel') || null;
    } else if (lower.includes('activity') || lower.includes('tour')) {
      bestMatch = CATALOG_ITEMS.find(c => c.category === 'activity') || null;
    } else if (lower.includes('transport') || lower.includes('car')) {
      bestMatch = CATALOG_ITEMS.find(c => c.category === 'transport') || null;
    } else {
      bestMatch = CATALOG_ITEMS.find(c => c.category === 'experience') || CATALOG_ITEMS[0];
    }
  }

  if (bestMatch) {
    const newItem: ItineraryItem = {
      id: `ai-item-${Date.now()}`,
      catalogId: bestMatch.id,
      title: bestMatch.title,
      category: bestMatch.category,
      price: bestMatch.price,
      time: bestMatch.timeSlotDefault,
      duration: bestMatch.duration,
      location: bestMatch.location,
      description: bestMatch.description,
      image: bestMatch.image,
      rating: bestMatch.rating,
      tags: bestMatch.tags,
      notes: `Added via AI Assistant prompt: "${prompt}"`,
      transitToNext: { mode: 'car', duration: '15 min' },
    };

    targetDay.items.push(newItem);

    return {
      success: true,
      explanation: `✨ Added "${newItem.title}" to Day ${targetDay.dayNumber} at ${newItem.time} ($${newItem.price}). Trip price automatically updated!`,
      updatedDays: daysCopy,
      highlightDayNumber: targetDay.dayNumber,
      highlightItemId: newItem.id,
      priceDelta: newItem.price,
    };
  }

  return {
    success: true,
    explanation: `✨ Customized Day ${targetDay.dayNumber} itinerary based on "${prompt}".`,
    updatedDays: daysCopy,
    highlightDayNumber: targetDay.dayNumber,
  };
}
