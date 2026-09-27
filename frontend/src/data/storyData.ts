export interface TravelStoryTip {
  id: string;
  author: string;
  avatar: string;
  comment: string;
  timeAgo: string;
  likes: number;
}

export interface TravelStory {
  id: string;
  filename: string;
  title: string;
  destination: string;
  region: 'kashmir' | 'himachal' | 'kerala' | 'karnataka';
  locationBadge: string;
  duration: string;
  daysCount: number;
  budgetEstimate: string;
  budgetINR: number;
  budgetUSD: number;
  rating: number;
  reviewsCount: number;
  creator: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  caption: string;
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  tips: TravelStoryTip[];
  itinerarySummary: {
    title: string;
    highlights: string[];
    priceUSD: number;
    priceINR: number;
  };
}

export function getStoryVideoUrl(filename: string): string {
  return `/story/${encodeURIComponent(filename)}`;
}

export const TRAVEL_STORIES: TravelStory[] = [
  {
    id: 'story-himachal-4d',
    filename: 'himachal-4d.mp4',
    title: '4-Day Himachal Tour Plan 2025: Shimla & Manali',
    destination: 'Himachal Pradesh',
    region: 'himachal',
    locationBadge: 'Shimla & Manali, Himachal',
    duration: '4 Days / 3 Nights',
    daysCount: 4,
    budgetEstimate: '₹22,999',
    budgetINR: 22999,
    budgetUSD: 275,
    rating: 4.9,
    reviewsCount: 1420,
    creator: {
      name: 'Aarav Sharma',
      handle: '@himalayan_escapes',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      verified: true,
    },
    caption: 'The ultimate 4-day snow & mountain itinerary covering Mall Road, Solang Valley snow sports, Rohtang Pass, and the iconic Kalka-Shimla heritage toy train! 🏔️✨',
    hashtags: ['#Himachal', '#ShimlaManali', '#SnowTrip', '#Travel2025', '#Bookit'],
    likesCount: 14200,
    commentsCount: 382,
    sharesCount: 1250,
    tips: [
      {
        id: 'tip-h1',
        author: 'Rohit K.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        comment: 'Definitely book the morning Solang ski pass before 9 AM to skip the heavy crowds!',
        timeAgo: '2h ago',
        likes: 45,
      },
      {
        id: 'tip-h2',
        author: 'Priya M.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        comment: 'The Atal Tunnel view opening into Lahaul valley is unmatched! Keep a warm jacket handy.',
        timeAgo: '5h ago',
        likes: 89,
      },
    ],
    itinerarySummary: {
      title: 'Himachal Alpine Gateway (Shimla & Manali)',
      highlights: ['Mall Road & Heritage Ridge', 'Solang Snow Sports', 'Atal Tunnel into Lahaul', 'Old Manali Pine Cafes'],
      priceUSD: 275,
      priceINR: 22999,
    },
  },
  {
    id: 'story-kashmir-family-5d',
    filename: 'kashmir-family-5d.mp4',
    title: '5 Days Kashmir Family Haven: Dal Lake & Gulmarg',
    destination: 'Kashmir',
    region: 'kashmir',
    locationBadge: 'Srinagar & Gulmarg, Kashmir',
    duration: '5 Days / 4 Nights',
    daysCount: 5,
    budgetEstimate: '₹27,500',
    budgetINR: 27500,
    budgetUSD: 330,
    rating: 4.95,
    reviewsCount: 2180,
    creator: {
      name: 'Zoya Khan',
      handle: '@kashmir_wanderlust',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      verified: true,
    },
    caption: 'Dreaming of taking your family to paradise on earth? Here is a complete 5-day family-friendly guide through Shikara sunsets, Mughal blossom gardens, and the Gulmarg snow gondola! 🛶🌸',
    hashtags: ['#Kashmir', '#FamilyTravel', '#GulmargGondola', '#DalLake', '#LuxuryTravel'],
    likesCount: 28900,
    commentsCount: 640,
    sharesCount: 3410,
    tips: [
      {
        id: 'tip-k1',
        author: 'Vikram S.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        comment: 'Stay at least 1 night on a cedarwood houseboat on Nigeen Lake for tranquil water reflections!',
        timeAgo: '1d ago',
        likes: 124,
      },
      {
        id: 'tip-k2',
        author: 'Ananya D.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        comment: 'Gulmarg Phase 2 tickets sell out fast, book 2 weeks ahead on the official portal.',
        timeAgo: '2d ago',
        likes: 210,
      },
    ],
    itinerarySummary: {
      title: 'Kashmir Family Paradise Circuit',
      highlights: ['Dal Lake Sunset Shikara', 'Nishat & Shalimar Gardens', 'Gulmarg Cable Car Phase 1 & 2', 'Pahalgam Pine Valley'],
      priceUSD: 330,
      priceINR: 27500,
    },
  },
  {
    id: 'story-kashmir-budget-6d',
    filename: 'kashmir-budget-6d.mp4',
    title: '6D 5N Kashmir Circuit in Just ₹20,750',
    destination: 'Kashmir',
    region: 'kashmir',
    locationBadge: 'Srinagar, Sonmarg & Pahalgam',
    duration: '6 Days / 5 Nights',
    daysCount: 6,
    budgetEstimate: '₹20,750',
    budgetINR: 20750,
    budgetUSD: 250,
    rating: 4.88,
    reviewsCount: 3890,
    creator: {
      name: 'Tariq Mir',
      handle: '@valley_nomad',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      verified: true,
    },
    caption: 'Yes, you can do luxury & scenic Kashmir in under ₹21k! Full breakdown of stays, private cabs, Betaab valley entry, and authentic local food spots! ❄️✨',
    hashtags: ['#KashmirTrip', '#BudgetLuxury', '#BetaabValley', '#Sonmarg', '#Wanderlust'],
    likesCount: 54100,
    commentsCount: 1120,
    sharesCount: 8900,
    tips: [
      {
        id: 'tip-kb1',
        author: 'Sameer T.',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
        comment: 'Betaab Valley early in the morning with tea feels like the Swiss Alps without the visa hassle!',
        timeAgo: '4h ago',
        likes: 312,
      },
      {
        id: 'tip-kb2',
        author: 'Natasha R.',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        comment: "Don't miss the saffron Kahwa at Char Chinar during sunset.",
        timeAgo: '1d ago',
        likes: 198,
      },
    ],
    itinerarySummary: {
      title: '6-Day Kashmir Alpine Explorer',
      highlights: ['Srinagar Houseboat Stay', 'Sonmarg Thajiwas Glacier', 'Betaab & Aru Valley', 'Baisaran Valley Mini Switzerland'],
      priceUSD: 250,
      priceINR: 20750,
    },
  },
  {
    id: 'story-kerala-5d',
    filename: 'kerala-5d.mp4',
    title: "Kerala: 5 Days in God's Own Country",
    destination: 'Kerala',
    region: 'kerala',
    locationBadge: 'Munnar, Thekkady & Alleppey',
    duration: '5 Days / 4 Nights',
    daysCount: 5,
    budgetEstimate: '₹24,000',
    budgetINR: 24000,
    budgetUSD: 290,
    rating: 4.92,
    reviewsCount: 2840,
    creator: {
      name: 'Anjali Menon',
      handle: '@coastal_tales',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      verified: true,
    },
    caption: 'From emerald tea plantations rolling into the clouds in Munnar, to serene spice gardens and tranquil sunset cruises in Alleppey backwaters! 🌴🛶',
    hashtags: ['#Kerala', '#GodsOwnCountry', '#Backwaters', '#MunnarTea', '#Alleppey'],
    likesCount: 39500,
    commentsCount: 780,
    sharesCount: 4200,
    tips: [
      {
        id: 'tip-kl1',
        author: 'Harish G.',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
        comment: 'The spice plantation walk in Thekkady is so fragrant and eye-opening! Try fresh green cardamom.',
        timeAgo: '3d ago',
        likes: 85,
      },
      {
        id: 'tip-kl2',
        author: 'Maya V.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        comment: 'Fresh Karimeen Pollichathu cooked inside banana leaves on the houseboat is 10/10!',
        timeAgo: '5d ago',
        likes: 167,
      },
    ],
    itinerarySummary: {
      title: 'Kerala Backwaters & High Mist Hills',
      highlights: ['Fort Kochi Chinese Nets', 'Munnar Tea Estates & Museum', 'Periyar Wildlife Sanctuary', 'Alleppey Private Teak Houseboat'],
      priceUSD: 290,
      priceINR: 24000,
    },
  },
  {
    id: 'story-karnataka-nature',
    filename: 'karnataka-nature-5d.mp4',
    title: 'Most Beautiful Places in Karnataka: Western Ghats',
    destination: 'Karnataka',
    region: 'karnataka',
    locationBadge: 'Coorg, Chikmagalur & Western Ghats',
    duration: '5 Days / 4 Nights',
    daysCount: 5,
    budgetEstimate: '₹21,500',
    budgetINR: 21500,
    budgetUSD: 260,
    rating: 4.86,
    reviewsCount: 1650,
    creator: {
      name: 'Chetan Gowda',
      handle: '@wild_karnataka',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      verified: true,
    },
    caption: "Deep inside Karnataka's lush Western Ghats! Roaring Abbey Falls, mist-covered coffee estates in Chikmagalur, and sunrise treks to Mullayanagiri Peak! 🌿☕",
    hashtags: ['#Karnataka', '#WesternGhats', '#Chikmagalur', '#CoorgDiaries', '#NatureLovers'],
    likesCount: 19800,
    commentsCount: 410,
    sharesCount: 2150,
    tips: [
      {
        id: 'tip-kn1',
        author: 'Divya P.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        comment: 'Coffee harvest season in November-January is the best time for plantation homestays.',
        timeAgo: '1d ago',
        likes: 92,
      },
      {
        id: 'tip-kn2',
        author: 'Siddharth N.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        comment: 'Drive through Charmadi Ghat is pure cinematic bliss during late afternoon mist!',
        timeAgo: '2d ago',
        likes: 140,
      },
    ],
    itinerarySummary: {
      title: 'Karnataka Western Ghats & Coffee Highlands',
      highlights: ['Mullayanagiri Sunrise Peak', 'Abbey Falls & Coffee Walks', 'Dubare Elephant Sanctuary', 'Chikmagalur Coffee Roasting'],
      priceUSD: 260,
      priceINR: 21500,
    },
  },
  {
    id: 'story-kashmir-wazwan',
    filename: 'kashmir-wazwan-3d.mp4',
    title: 'Kashmir Through Local Eyes: Hospitality & Wazwan',
    destination: 'Kashmir',
    region: 'kashmir',
    locationBadge: 'Old Srinagar & Downtown Heritage',
    duration: '3 Days / 2 Nights',
    daysCount: 3,
    budgetEstimate: '₹15,500',
    budgetINR: 15500,
    budgetUSD: 190,
    rating: 4.97,
    reviewsCount: 3100,
    creator: {
      name: 'Tuba Batool',
      handle: '@tuba_explores',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      verified: true,
    },
    caption: 'Experiencing authentic Kashmiri hospitality as a personal guest! Sitting down for a traditional royal Wazwan feast, sipping piping hot saffron Kahwa, and wandering historic copper bazaars! 🍁🍲',
    hashtags: ['#KashmiriCulture', '#Wazwan', '#SrinagarDowntown', '#KashmirFood', '#CulinaryTravel'],
    likesCount: 46200,
    commentsCount: 920,
    sharesCount: 5600,
    tips: [
      {
        id: 'tip-kw1',
        author: 'Farooq A.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        comment: 'The Rogan Josh and Gushtaba prepared by a traditional master Waza cannot be matched anywhere.',
        timeAgo: '6h ago',
        likes: 278,
      },
      {
        id: 'tip-kw2',
        author: 'Neha S.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        comment: 'Walk through the 7 historic wooden bridges of the Jhelum in the golden hour for stunning photography.',
        timeAgo: '1d ago',
        likes: 185,
      },
    ],
    itinerarySummary: {
      title: 'Kashmiri Culinary & Heritage Immersion',
      highlights: ['Old Srinagar Heritage Walking Tour', 'Authentic 36-Dish Wazwan Feast', 'Pashmina Weaving Artisans', 'Jhelum River Sunset Walk'],
      priceUSD: 190,
      priceINR: 15500,
    },
  },
  {
    id: 'story-kashmir-7d-perfect',
    filename: 'kashmir-grand-7d.mp4',
    title: 'Perfect 7 Days Itinerary for Kashmir: The Grand Circuit',
    destination: 'Kashmir',
    region: 'kashmir',
    locationBadge: 'Srinagar, Gulmarg, Pahalgam & Doodhpathri',
    duration: '7 Days / 6 Nights',
    daysCount: 7,
    budgetEstimate: '₹34,500',
    budgetINR: 34500,
    budgetUSD: 420,
    rating: 4.96,
    reviewsCount: 4500,
    creator: {
      name: 'Meera & Kabir',
      handle: '@royal_kashmir',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      verified: true,
    },
    caption: 'The ultimate 7-day blueprint for Kashmir! Covers hidden gems like Doodhpathri meadows, sunset Shikara, skiing in Gulmarg, and river rafting in Lidder river! 💕🏔️',
    hashtags: ['#Kashmir7Days', '#Doodhpathri', '#GulmargSnow', '#PahalgamValley', '#IncredibleIndia'],
    likesCount: 68300,
    commentsCount: 1450,
    sharesCount: 9800,
    tips: [
      {
        id: 'tip-kp1',
        author: 'Kunal B.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        comment: 'Doodhpathri is way less crowded than Gulmarg, absolutely magical pine meadows with grazing herds!',
        timeAgo: '1d ago',
        likes: 420,
      },
      {
        id: 'tip-kp2',
        author: 'Shweta R.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        comment: 'Book pony rides only through the registered prepaid counters at Pahalgam to avoid haggling.',
        timeAgo: '3d ago',
        likes: 310,
      },
    ],
    itinerarySummary: {
      title: 'The Grand Kashmir 7-Day Royal Odyssey',
      highlights: ['Srinagar Lake Houseboat & Shikara', 'Gulmarg Gondola Phase 2 Snow Peaks', 'Pahalgam Baisaran Meadow', 'Doodhpathri Alpine Valley'],
      priceUSD: 420,
      priceINR: 34500,
    },
  },
  {
    id: 'story-shimla-tips',
    filename: 'shimla-guide-3d.mp4',
    title: 'Shimla Travel Guide & Solo Explorer Secrets',
    destination: 'Himachal Pradesh',
    region: 'himachal',
    locationBadge: 'Shimla & Kufri, Himachal',
    duration: '3 Days / 2 Nights',
    daysCount: 3,
    budgetEstimate: '₹14,000',
    budgetINR: 14000,
    budgetUSD: 170,
    rating: 4.84,
    reviewsCount: 1100,
    creator: {
      name: 'Rohan Verma',
      handle: '@solo_himalayas',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      verified: true,
    },
    caption: 'Visiting Queen of Hills Shimla? Crucial insider tips on walking The Ridge, avoiding traffic jams, best sunset spots at Jakhoo Temple, and cozy wooden heritage cafes! ❤️☕',
    hashtags: ['#Shimla', '#SoloTravel', '#HimachalTourism', '#TravelTips', '#MountainLife'],
    likesCount: 16700,
    commentsCount: 310,
    sharesCount: 1400,
    tips: [
      {
        id: 'tip-st1',
        author: 'Amit P.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        comment: 'Take the ropeway to Jakhoo temple instead of driving up the steep slope! Great aerial views.',
        timeAgo: '2d ago',
        likes: 115,
      },
      {
        id: 'tip-st2',
        author: 'Tanvi K.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        comment: 'Wake & Bake cafe on Mall Road has the finest apple crumble and mountain sunset view.',
        timeAgo: '4d ago',
        likes: 94,
      },
    ],
    itinerarySummary: {
      title: 'Shimla Heritage & Solo Explorer Getaway',
      highlights: ['The Ridge & Historic Christ Church', 'Jakhoo Hill Ropeway Ride', 'Viceregal Lodge Architecture', 'Kufri Panoramic Point'],
      priceUSD: 170,
      priceINR: 14000,
    },
  },
  {
    id: 'story-karnataka-top10',
    filename: 'karnataka-top10-6d.mp4',
    title: 'Top 10 Places to Visit in Karnataka: Palaces to Beaches',
    destination: 'Karnataka',
    region: 'karnataka',
    locationBadge: 'Hampi, Mysore, Gokarna & Jog Falls',
    duration: '6 Days / 5 Nights',
    daysCount: 6,
    budgetEstimate: '₹25,500',
    budgetINR: 25500,
    budgetUSD: 310,
    rating: 4.91,
    reviewsCount: 2420,
    creator: {
      name: 'Kavya Rao',
      handle: '@incredible_karnataka',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      verified: true,
    },
    caption: 'From the royal illuminated Mysore Palace and ancient stone chariot of UNESCO Hampi, to pristine Om Beach in Gokarna and cascading Jog Falls! Karnataka has it all! 🏛️🌊',
    hashtags: ['#KarnatakaTourism', '#HampiUNESCO', '#MysorePalace', '#GokarnaBeach', '#HeritageIndia'],
    likesCount: 32400,
    commentsCount: 590,
    sharesCount: 3800,
    tips: [
      {
        id: 'tip-kt1',
        author: 'Bharat M.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        comment: 'Mysore Palace Sunday evening illumination at 7 PM with 100,000 golden bulbs is breathtaking.',
        timeAgo: '1d ago',
        likes: 310,
      },
      {
        id: 'tip-kt2',
        author: 'Sneha R.',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        comment: 'Sunset from Matanga Hill in Hampi overlooks the entire boulder kingdom and Tungabhadra river.',
        timeAgo: '3d ago',
        likes: 240,
      },
    ],
    itinerarySummary: {
      title: 'Grand Karnataka Heritage & Coastal Odyssey',
      highlights: ['Mysore Palace Royal Architecture', 'Hampi UNESCO Stone Chariot & Ruins', 'Jog Falls Monsoonal Cascades', 'Gokarna Om Beach & Cliff Hikes'],
      priceUSD: 310,
      priceINR: 25500,
    },
  },
];
