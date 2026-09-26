import { CATALOG_ITEMS } from '../data/itineraryData';
import { CatalogItem, ItineraryDay, ItineraryItem, TripItinerary } from '../types/itinerary';
import { TripFlowApi } from '../services/api';

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
  itinerary: TripItinerary,
  activeDayNumber = 1
): Promise<AIModificationResult> {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return {
      success: false,
      explanation: 'Please enter a request for what you would like to change.',
      updatedDays: itinerary.days,
    };
  }

  // 1. Call Backend Gemini AI Concierge
  try {
    const data = await TripFlowApi.modifyItineraryWithAI({
      prompt: trimmed,
      currentItinerary: itinerary,
      activeDayNumber,
      destination: itinerary.destination || 'Global',
    });

    if (data && data.success && Array.isArray(data.modifiedDays) && data.modifiedDays.length > 0) {
      return {
        success: true,
        explanation: data.explanation || 'Updated your itinerary according to your request.',
        updatedDays: data.modifiedDays,
        highlightDayNumber: data.targetDayNumber || activeDayNumber,
        priceDelta: data.priceDelta,
        highlightItemId: data.highlightItemId,
      };
    }
  } catch (e) {
    console.warn('Backend AI endpoint unavailable, using smart local parser:', e);
  }

  // 2. Intelligent Local Natural Language Rule Engine (Runs offline & instant)
  return applyLocalAIHeuristics(trimmed, itinerary, activeDayNumber);
}

function applyLocalAIHeuristics(
  prompt: string,
  itinerary: TripItinerary,
  activeDayNumber = 1
): AIModificationResult {
  const lower = prompt.toLowerCase();
  const daysCopy: ItineraryDay[] = JSON.parse(JSON.stringify(itinerary.days));

  // Helper to extract target day (defaulting to activeDayNumber or Day 1)
  let targetDayNumber = activeDayNumber || 1;

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
          price: 3800,
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
          price: 3200,
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
      priceDelta: 7000,
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
        explanation: `✨ Removed "${removed.title}" from Day ${targetDay.dayNumber}. Saved ₹${removed.price.toLocaleString('en-IN')} on your trip total!`,
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

    // Replace high-end hotels with boutique chic
    daysCopy.forEach(day => {
      day.items = day.items.map(item => {
        if (item.category === 'hotel' && item.price > 25000) {
          replacedAny = true;
          savings += item.price - 14500;
          return {
            ...item,
            title: 'Heritage Boutique Loft & Suites',
            price: 14500,
            description: 'Stylish eco-luxe boutique stay with terrace views and central walking proximity.',
            image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
            tags: ['Boutique Value', 'Design Hotel'],
          };
        }
        if (item.category === 'meal' && item.price > 12000) {
          replacedAny = true;
          savings += item.price - 4500;
          return {
            ...item,
            title: 'Authentic Local Specialty Dining',
            price: 4500,
            description: 'Bustling neighborhood culinary experience celebrated by locals.',
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
        explanation: `✨ Optimized your itinerary for high value! Swapped ultra-luxury items for top-rated boutique alternatives, reducing your total trip cost by ₹${savings.toLocaleString('en-IN')}.`,
        updatedDays: daysCopy,
        highlightDayNumber: targetDay.dayNumber,
        priceDelta: -savings,
      };
    }
  }

  // ================= ACTION: ADD / INSERT DYNAMIC OR MATCHING ITEM =================
  if (lower.startsWith('add') || lower.includes(' include ') || lower.includes('insert')) {
    // Determine category
    let category: 'meal' | 'activity' | 'transport' | 'hotel' | 'experience' = 'experience';
    if (lower.includes('dinner') || lower.includes('lunch') || lower.includes('breakfast') || lower.includes('sushi') || lower.includes('restaurant') || lower.includes('food') || lower.includes('coffee') || lower.includes('tasting')) {
      category = 'meal';
    } else if (lower.includes('hotel') || lower.includes('stay') || lower.includes('resort') || lower.includes('suite') || lower.includes('villa')) {
      category = 'hotel';
    } else if (lower.includes('transfer') || lower.includes('flight') || lower.includes('train') || lower.includes('chauffeur') || lower.includes('car')) {
      category = 'transport';
    } else if (lower.includes('tour') || lower.includes('museum') || lower.includes('hike') || lower.includes('walk') || lower.includes('temple') || lower.includes('bath') || lower.includes('hamam')) {
      category = 'activity';
    }

    // Extract price in INR
    let price = category === 'hotel' ? 16500 : (category === 'meal' ? 5500 : (category === 'transport' ? 3500 : 4000));
    const inrMatch = prompt.match(/₹\s*([\d,]+)/) || prompt.match(/(?:rs\.?|inr|rupees?)\s*([\d,]+)/i) || prompt.match(/([\d,]+)\s*(?:inr|rs|rupees?)/i);
    const dollarMatch = prompt.match(/\$([\d,]+)/) || prompt.match(/([\d,]+)\s*(?:usd|dollars)/i);

    if (inrMatch) {
      price = parseInt(inrMatch[1].replace(/,/g, ''), 10);
    } else if (dollarMatch) {
      price = parseInt(dollarMatch[1].replace(/,/g, ''), 10) * 85;
    }

    // Extract time
    let time = '02:30 PM';
    const timeMatch = prompt.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);
    if (timeMatch) {
      time = timeMatch[1].toUpperCase();
    } else if (lower.includes('morning') || lower.includes('breakfast')) {
      time = '09:30 AM';
    } else if (lower.includes('lunch') || lower.includes('afternoon')) {
      time = '01:00 PM';
    } else if (lower.includes('sunset') || lower.includes('evening')) {
      time = '06:00 PM';
    } else if (lower.includes('dinner') || lower.includes('night')) {
      time = '08:00 PM';
    }

    // Extract clean title
    let cleanTitle = prompt
      .replace(/^add\s+/i, '')
      .replace(/\s+on\s+day\s*\d+/i, '')
      .replace(/\s+to\s+day\s*\d+/i, '')
      .replace(/\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?/i, '')
      .replace(/\s+with\s+[₹\$]?\d+.*$/i, '')
      .replace(/\s*\([₹\$]?\d+.*\)/i, '')
      .trim();

    if (cleanTitle && cleanTitle.length > 2) {
      cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);

      const isTurkey = (itinerary.destination || '').toLowerCase().includes('turkey');
      const defaultImg = category === 'meal'
        ? 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
        : category === 'hotel'
        ? (isTurkey ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80')
        : category === 'transport'
        ? 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'
        : (isTurkey ? 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80');

      const newItem: ItineraryItem = {
        id: `ai-item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        catalogId: `custom-ai-${Date.now()}`,
        title: cleanTitle,
        category,
        price,
        time,
        duration: category === 'meal' ? '1.5 hrs' : '2 hrs',
        location: itinerary.destination || 'Global',
        description: `Curated ${category} tailored directly from your request: "${prompt}".`,
        image: defaultImg,
        rating: 4.95,
        tags: ['AI Added', category],
        notes: `Added via AI Assistant prompt: "${prompt}"`,
        transitToNext: { mode: 'car', duration: '15 min' },
      };

      targetDay.items = targetDay.items || [];
      targetDay.items.push(newItem);

      return {
        success: true,
        explanation: `✨ Added "${newItem.title}" to Day ${targetDay.dayNumber} at ${newItem.time} (₹${newItem.price.toLocaleString('en-IN')}). Trip price automatically updated!`,
        updatedDays: daysCopy,
        highlightDayNumber: targetDay.dayNumber,
        highlightItemId: newItem.id,
        priceDelta: newItem.price,
      };
    }
  }

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
      explanation: `✨ Added "${newItem.title}" to Day ${targetDay.dayNumber} at ${newItem.time} (₹${newItem.price.toLocaleString('en-IN')}). Trip price automatically updated!`,
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
