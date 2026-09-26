// TripFlow Comprehensive Database Seeder - Verified Prisma Types
import process from 'node:process';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive TripFlow Neon PostgreSQL Database Seeder...');

  // 1. Seed Core Users (Traveler Sarah Mehta & Dispatch Alex Vance)
  const passwordHash = await bcrypt.hash('password123', 10);

  const sarah = await prisma.user.upsert({
    where: { email: 'sarah.mehta@concierge.tripflow.io' },
    update: {
      name: 'Sarah Mehta',
      phone: '+91 98201 44892',
      membershipTier: 'Concierge Elite Member',
    },
    create: {
      id: 'user-sarah-1024',
      email: 'sarah.mehta@concierge.tripflow.io',
      name: 'Sarah Mehta',
      passwordHash,
      role: 'TRAVELER',
      phone: '+91 98201 44892',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      membershipTier: 'Concierge Elite Member',
    },
  });

  const alex = await prisma.user.upsert({
    where: { email: 'alex.vance@ops.tripflow.io' },
    update: {
      name: 'Alex Vance',
      phone: '+91 98110 55210',
      membershipTier: 'Chief Dispatch Controller',
      agencyName: 'Alpine & Beyond Expeditions',
      agencyCode: 'OP-ALPS-2026',
    },
    create: {
      id: 'user-alex-007',
      email: 'alex.vance@ops.tripflow.io',
      name: 'Alex Vance',
      passwordHash,
      role: 'OPERATOR',
      phone: '+91 98110 55210',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      membershipTier: 'Chief Dispatch Controller',
      agencyName: 'Alpine & Beyond Expeditions',
      agencyCode: 'OP-ALPS-2026',
    },
  });

  console.log(`✅ Users: ${sarah.name}, ${alex.name}`);

  // 2. Seed Tour Guides (for Operator operations)
  const guidesData = [
    {
      id: 'guide-rohan',
      name: 'Rohan Deshmukh',
      role: 'Master Guide',
      languages: ['English', 'Malayalam', 'Hindi'],
      rating: 4.96,
      totalTours: 142,
      status: 'On Tour',
      location: 'Munnar Highlands',
      phone: '+91 98200 11223',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      certifications: ['Govt Certified Naturalist', 'Wilderness First Aid'],
    },
    {
      id: 'guide-mahaveer',
      name: 'Mahaveer Singh',
      role: 'Cultural Specialist',
      languages: ['English', 'Hindi', 'Marwari', 'French'],
      rating: 4.95,
      totalTours: 188,
      status: 'Available',
      location: 'Jaipur & Udaipur',
      phone: '+91 98290 33441',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      certifications: ['Heritage Architecture Fellow', 'Royal Protocol Specialist'],
    },
    {
      id: 'guide-savio',
      name: "Savio D'Souza",
      role: 'Licensed Chauffeur & Skipper',
      languages: ['English', 'Konkani', 'Portuguese'],
      rating: 4.92,
      totalTours: 98,
      status: 'Available',
      location: 'Goa Coastal Hub',
      phone: '+91 98221 77650',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      certifications: ['Yacht Master Offshore', 'Executive Protective Chauffeur'],
    },
    {
      id: 'guide-kenzo',
      name: 'Kenzo Morimoto',
      role: 'Private Concierge',
      languages: ['Japanese', 'English'],
      rating: 4.99,
      totalTours: 210,
      status: 'On Tour',
      location: 'Tokyo & Kyoto',
      phone: '+81 90 1234 5678',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      certifications: ['National Omotenashi Master', 'Gion Tea Connoisseur'],
    },
  ];

  for (const g of guidesData) {
    const dataWithOp = { ...g, operatorId: alex.id };
    await prisma.tourGuide.upsert({
      where: { id: g.id },
      update: dataWithOp,
      create: dataWithOp,
    });
  }
  console.log(`✅ Tour Guides seeded: ${guidesData.length} guides`);

  // 3. Seed Vendors (Hotels, Aviation, Fleets, Diners, Charters)
  const vendorsData = [
    {
      id: 'vnd-brunton',
      name: 'Brunton Boatyard — CGH Earth',
      category: 'hotel',
      region: 'Kerala (Fort Kochi)',
      rating: 4.94,
      slaCompliance: 99,
      activeContracts: 4,
      contactPerson: 'Meera Nambiar (General Manager)',
      phone: '+91 484 221 5461',
      email: 'concierge.brunton@cghearth.com',
      status: 'Active',
      contractRenewal: new Date('2027-12-31'),
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'vnd-rambagh',
      name: 'Rambagh Palace — Taj Luxury',
      category: 'hotel',
      region: 'Rajasthan (Jaipur)',
      rating: 4.98,
      slaCompliance: 100,
      activeContracts: 6,
      contactPerson: 'Digvijay Rathore (Head Concierge)',
      phone: '+91 141 221 1919',
      email: 'rambagh.palace@tajhotels.com',
      status: 'Active',
      contractRenewal: new Date('2028-06-30'),
      imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'vnd-airindia',
      name: 'Air India Premier VIP Wing',
      category: 'flight',
      region: 'India Domestic & Int’l',
      rating: 4.82,
      slaCompliance: 98,
      activeContracts: 12,
      contactPerson: 'Rajiv Chawla (Corporate Desk)',
      phone: '+91 11 2462 4075',
      email: 'prioritydesk@airindia.in',
      status: 'Active',
      contractRenewal: new Date('2026-11-15'),
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'vnd-cochinfleet',
      name: 'Cochin Executive Fleet Services',
      category: 'fleet',
      region: 'Kerala & Tamil Nadu',
      rating: 4.96,
      slaCompliance: 99,
      activeContracts: 8,
      contactPerson: 'Arun V. (Dispatch Fleet Lead)',
      phone: '+91 98470 12345',
      email: 'dispatch@cochinfleet.com',
      status: 'Active',
      contractRenewal: new Date('2027-04-10'),
      imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'vnd-konkanmarine',
      name: 'Konkan Marine Catamaran Charters',
      category: 'experience',
      region: 'Goa Coastal Waters',
      rating: 4.91,
      slaCompliance: 97,
      activeContracts: 3,
      contactPerson: "Savio D'Souza (Fleet Commander)",
      phone: '+91 98221 77650',
      email: 'charters@konkanmarine.com',
      status: 'Active',
      contractRenewal: new Date('2026-10-31'),
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'vnd-aman-tokyo',
      name: 'Aman Tokyo & Otemachi Dining',
      category: 'hotel',
      region: 'Japan (Tokyo)',
      rating: 4.99,
      slaCompliance: 100,
      activeContracts: 5,
      contactPerson: 'Yuki Takahashi (Guest Relations)',
      phone: '+81 3 5224 3333',
      email: 'concierge.tokyo@aman.com',
      status: 'Active',
      contractRenewal: new Date('2028-01-31'),
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    },
  ];

  for (const v of vendorsData) {
    const dataWithOp = { ...v, operatorId: alex.id };
    await prisma.vendor.upsert({
      where: { id: v.id },
      update: dataWithOp,
      create: dataWithOp,
    });
  }
  console.log(`✅ Vendors seeded: ${vendorsData.length} vendors`);

  // 4. Seed Catalog Items for Itinerary Builder
  const catalogData = [
    {
      id: 'cat-brunton',
      title: 'Brunton Boatyard — Sea Facing Suite Check-in',
      category: 'hotel' as const,
      price: 450,
      timeSlotDefault: '02:00 PM',
      duration: 'Overnight',
      location: 'Fort Kochi Waterfront, Kerala',
      description: 'Colonial boutique hotel built on 19th-century Victorian shipyards. High tea on private veranda with harbour views.',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      rating: 4.92,
      reviewsCount: 312,
      tags: ['Heritage Hotel', '5-Star Luxury', 'Harbour View'],
    },
    {
      id: 'cat-innova-pickup',
      title: 'Private Chauffeur Airport Transfer (Innova Crysta)',
      category: 'transport' as const,
      price: 90,
      timeSlotDefault: '11:00 AM',
      duration: '1.5 hrs',
      location: 'Cochin Airport T3 Arrival Gate',
      description: 'Chauffeur Arun V. meets with personalized digital nameboard. Chilled bottled tender coconut water and WiFi on board.',
      imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
      rating: 4.98,
      reviewsCount: 420,
      tags: ['Private Transfer', 'Executive MPV', 'Chauffeur'],
    },
    {
      id: 'cat-houseboat',
      title: 'Private Teak Houseboat Sunset Cruise & Dinner',
      category: 'experience' as const,
      price: 380,
      timeSlotDefault: '04:30 PM',
      duration: '4 hrs',
      location: 'Alleppey Backwaters, Kerala',
      description: 'Glide through palm-fringed lagoons on a handcrafted wooden kettuvallam. Freshly caught Karimeen fish fry prepared onboard by a private chef.',
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      rating: 4.97,
      reviewsCount: 540,
      tags: ['Exclusive Cruise', 'Private Chef', 'Sunset View'],
    },
    {
      id: 'cat-spice-walk',
      title: 'Highlands Mist Tea Estate & Cardamom Walk',
      category: 'activity' as const,
      price: 75,
      timeSlotDefault: '09:00 AM',
      duration: '2.5 hrs',
      location: 'Munnar Highlands, Kerala',
      description: 'Guided plantation trail with botanist Rohan Deshmukh. Sample fresh orthodox whole-leaf tea brewed right at the estate tea bungalow.',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      rating: 4.89,
      reviewsCount: 198,
      tags: ['Nature Trail', 'Tea Tasting', 'Guided Specialist'],
    },
    {
      id: 'cat-taj-lake',
      title: 'Taj Lake Palace — Palace Lake View Room',
      category: 'hotel' as const,
      price: 680,
      timeSlotDefault: '02:00 PM',
      duration: 'Overnight',
      location: 'Lake Pichola, Udaipur, Rajasthan',
      description: 'Iconic 18th-century marble palace floating in the middle of Lake Pichola. Reached only by private royal royal jetty boat.',
      imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      rating: 4.99,
      reviewsCount: 650,
      tags: ['Palace Stay', 'Lake View', 'Royal Heritage'],
    },
    {
      id: 'cat-shinkansen',
      title: 'Shinkansen Gran Class Bullet Train Ticket',
      category: 'transport' as const,
      price: 180,
      timeSlotDefault: '09:30 AM',
      duration: '2 hrs 15 min',
      location: 'Tokyo Station ➔ Kyoto Station',
      description: 'High-speed rail Gran Class cabin with leather reclining seating, dedicated cabin attendant, and seasonal gourmet bento box.',
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      rating: 4.95,
      reviewsCount: 380,
      tags: ['Bullet Train', 'Gran Class', 'Scenic Mount Fuji View'],
    },
    {
      id: 'cat-sukiyabashi-dining',
      title: 'Private Omakase Chef Table Dinner',
      category: 'meal' as const,
      price: 260,
      timeSlotDefault: '07:30 PM',
      duration: '2 hrs',
      location: 'Ginza, Tokyo, Japan',
      description: '18-course seasonal edomae sushi journey featuring wild bluefin tuna, sea urchin, and curated vintage sake pairings.',
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
      rating: 4.98,
      reviewsCount: 290,
      tags: ['Michelin Star Tier', 'Omakase', 'Sake Pairing'],
    },
    {
      id: 'cat-catamaran-sunset',
      title: 'Private 40ft Catamaran Sunset Champagne Cruise',
      category: 'experience' as const,
      price: 320,
      timeSlotDefault: '05:00 PM',
      duration: '3 hrs',
      location: 'Morjim Coast, Goa',
      description: 'Exclusive private sailing charter with Skipper Savio. Chilled French champagne, charcuterie board, and dolphin sighting escort.',
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      rating: 4.94,
      reviewsCount: 215,
      tags: ['Private Yacht', 'Champagne', 'Dolphin Watch'],
    },
  ];

  for (const c of catalogData) {
    await prisma.catalogItem.upsert({
      where: { id: c.id },
      update: c,
      create: c,
    });
  }
  console.log(`✅ Catalog items seeded: ${catalogData.length} items`);

  // 5. Seed Curated Premade Circuit 1: Kerala
  const keralaItinerary = await prisma.tripItinerary.upsert({
    where: { id: 'trip-kerala-luxury' },
    update: {
      totalPrice: 2450.0,
      isPremade: true,
      status: 'CONFIRMED',
    },
    create: {
      id: 'trip-kerala-luxury',
      userId: sarah.id,
      title: 'Kerala Monsoon Whispers & Backwaters',
      destination: 'Kerala',
      country: 'India',
      dates: 'Oct 14 – 19, 2025',
      startDate: new Date('2025-10-14'),
      travelers: 2,
      currency: 'USD',
      totalPrice: 2450.0,
      heroImageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      isPremade: true,
      status: 'CONFIRMED',
      routeStops: {
        create: [
          { stopOrder: 1, city: 'Cochin', weatherInfo: '28°C Tropical', hotelName: 'Brunton Boatyard', transitMode: 'flight' },
          { stopOrder: 2, city: 'Munnar', weatherInfo: '21°C Mist', hotelName: 'Windermere Estate', transitMode: 'car' },
          { stopOrder: 3, city: 'Alleppey', weatherInfo: '27°C Lakes', hotelName: 'Private Teak Houseboat', transitMode: 'car' },
        ],
      },
      days: {
        create: [
          {
            dayNumber: 1,
            dateStr: 'Tue, Oct 14',
            title: 'Arrival in Kochi & Colonial Heritage Walk',
            subtitle: 'Air India Flight • Chauffeur Pickup • Fort Kochi Sunset',
            items: {
              create: [
                {
                  title: 'Air India AI-682 (BOM ➔ COK Flight)',
                  category: 'transport',
                  price: 280,
                  timeSlot: '11:30 AM',
                  duration: '2 hrs',
                  location: 'Terminal 2, Mumbai Airport',
                  description: 'Non-stop scheduled flight arriving at Cochin International Airport T3. Priority baggage tags.',
                  imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
                  rating: 4.8,
                  tags: ['Flight', 'Included'],
                },
                {
                  title: 'Private Executive Chauffeur Airport Pickup (Innova Crysta)',
                  category: 'transport',
                  price: 90,
                  timeSlot: '02:00 PM',
                  duration: '1.5 hrs',
                  location: 'Cochin Airport T3 Arrival Gate',
                  description: 'Chauffeur Arun V. meets with personalized nameboard. Chilled bottled tender coconut water on board.',
                  imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
                  rating: 4.95,
                  tags: ['Chauffeur', 'Private Car'],
                },
                {
                  title: 'Brunton Boatyard — Harbour View Suite Check-in',
                  category: 'hotel',
                  price: 450,
                  timeSlot: '03:30 PM',
                  duration: 'Overnight',
                  location: 'Fort Kochi Waterfront',
                  description: 'Colonial boutique hotel built on 19th-century Victorian shipyards. High tea on private veranda.',
                  imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
                  rating: 4.92,
                  tags: ['Heritage Hotel', '5-Star'],
                },
              ],
            },
          },
          {
            dayNumber: 2,
            dateStr: 'Wed, Oct 15',
            title: 'Munnar Highland Ascend & Tea Plantation Sanctuary',
            subtitle: 'Scenic Gap Road Detour • Tea Factory Tour • Estate Dinner',
            items: {
              create: [
                {
                  title: 'Scenic Western Ghats Ascent with Chauffeur Arun',
                  category: 'transport',
                  price: 110,
                  timeSlot: '09:00 AM',
                  duration: '3.5 hrs',
                  location: 'Kochi ➔ Munnar Gap Road',
                  description: 'Panoramic mountain pass drive with stops at Cheeyappara Waterfalls and viewpoints.',
                  imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
                  rating: 4.9,
                  tags: ['Scenic Drive', 'Chauffeur'],
                },
                {
                  title: 'Orthodox High-Elevation Tea Tasting Experience',
                  category: 'activity',
                  price: 65,
                  timeSlot: '02:30 PM',
                  duration: '2 hrs',
                  location: 'Lockhart Tea Museum, Munnar',
                  description: 'Historical colonial tea plucking and artisanal master tea tasting with resident tea sommelier.',
                  imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
                  rating: 4.88,
                  tags: ['Tea Tasting', 'Cultural'],
                },
              ],
            },
          },
          {
            dayNumber: 3,
            dateStr: 'Thu, Oct 16',
            title: 'Alleppey Backwaters & Private Kettuvallam Cruise',
            subtitle: 'Chauffeur Transfer • Houseboat Boarding • Fresh Pearl Spot Catch',
            items: {
              create: [
                {
                  title: 'Private Teak Houseboat Check-in & Lagoon Cruise',
                  category: 'hotel',
                  price: 420,
                  timeSlot: '01:00 PM',
                  duration: 'Overnight',
                  location: 'Vembanad Lake, Alleppey',
                  description: 'Private handcrafted houseboat with air-conditioned glass bedroom and personal chef serving authentic Malabar cuisine.',
                  imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
                  rating: 4.96,
                  tags: ['Houseboat', 'Private Chef', 'Backwaters'],
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 6. Seed Curated Premade Circuit 2: Rajasthan
  await prisma.tripItinerary.upsert({
    where: { id: 'trip-rajasthan-royal' },
    update: { isPremade: true },
    create: {
      id: 'trip-rajasthan-royal',
      userId: sarah.id,
      title: 'Imperial Rajasthan & Royal Palaces',
      destination: 'Rajasthan',
      country: 'India',
      dates: 'Nov 10 – 16, 2025',
      startDate: new Date('2025-11-10'),
      travelers: 2,
      currency: 'USD',
      totalPrice: 3200.0,
      heroImageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      isPremade: true,
      status: 'CONFIRMED',
      routeStops: {
        create: [
          { stopOrder: 1, city: 'Jaipur', weatherInfo: '26°C Clear', hotelName: 'Rambagh Palace', transitMode: 'flight' },
          { stopOrder: 2, city: 'Jodhpur', weatherInfo: '28°C Sunny', hotelName: 'Umaid Bhawan', transitMode: 'car' },
          { stopOrder: 3, city: 'Udaipur', weatherInfo: '25°C Lakes', hotelName: 'Taj Lake Palace', transitMode: 'car' },
        ],
      },
      days: {
        create: [
          {
            dayNumber: 1,
            dateStr: 'Mon, Nov 10',
            title: 'Pink City Grandeur & Palace Check-in',
            subtitle: 'VIP Arrival • Rambagh Palace High Tea • Royal Amber Fort',
            items: {
              create: [
                {
                  title: 'Rambagh Palace Grand Heritage Suite Check-in',
                  category: 'hotel',
                  price: 750,
                  timeSlot: '02:00 PM',
                  duration: 'Overnight',
                  location: 'Bhawani Singh Rd, Jaipur',
                  description: 'Former residence of the Maharaja of Jaipur. Peacocks roaming the manicured grounds.',
                  imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
                  rating: 4.98,
                  tags: ['Palace Stay', '5-Star Grand Luxury'],
                },
                {
                  title: 'Private Sunset Jeep Excursion to Amer Fort Ramparts',
                  category: 'activity',
                  price: 140,
                  timeSlot: '05:00 PM',
                  duration: '2.5 hrs',
                  location: 'Amer Fort, Jaipur',
                  description: 'Exclusive after-hours access to the Sheesh Mahal (Mirror Palace) with royal historian guide Mahaveer Singh.',
                  imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
                  rating: 4.94,
                  tags: ['Historic Fort', 'Private Access'],
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 7. Seed Curated Premade Circuit 3: Tokyo & Kyoto
  await prisma.tripItinerary.upsert({
    where: { id: 'trip-tokyo-kyoto' },
    update: { isPremade: true },
    create: {
      id: 'trip-tokyo-kyoto',
      userId: sarah.id,
      title: 'Tokyo & Kyoto Cultural Connoisseurs',
      destination: 'Tokyo & Kyoto',
      country: 'Japan',
      dates: 'Oct 14 – 20, 2025',
      startDate: new Date('2025-10-14'),
      travelers: 2,
      currency: 'USD',
      totalPrice: 4600.0,
      heroImageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      isPremade: true,
      status: 'CONFIRMED',
      routeStops: {
        create: [
          { stopOrder: 1, city: 'Tokyo', weatherInfo: '19°C Mild', hotelName: 'Aman Tokyo', transitMode: 'flight' },
          { stopOrder: 2, city: 'Hakone', weatherInfo: '16°C Onsen', hotelName: 'Gora Kadan', transitMode: 'train' },
          { stopOrder: 3, city: 'Kyoto', weatherInfo: '18°C Autumn', hotelName: 'Hoshinoya Kyoto', transitMode: 'train' },
        ],
      },
      days: {
        create: [
          {
            dayNumber: 1,
            dateStr: 'Tue, Oct 14',
            title: 'Tokyo Arrival & Skyline Dining in Otemachi',
            subtitle: 'Private Chauffeur • Aman Tokyo Suite • Ginza Omakase',
            items: {
              create: [
                {
                  title: 'Aman Tokyo Premier Suite Check-in',
                  category: 'hotel',
                  price: 950,
                  timeSlot: '03:00 PM',
                  duration: 'Overnight',
                  location: 'The Otemachi Tower, Chiyoda, Tokyo',
                  description: 'Urban sanctuary above the imperial palace gardens with traditional washi paper lanterns and cedar soaking tub.',
                  imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
                  rating: 4.99,
                  tags: ['5-Star Luxury', 'Skyline View', 'Spa'],
                },
                {
                  title: 'Private Omakase Chef Table at Sukiyabashi Ginza',
                  category: 'meal',
                  price: 360,
                  timeSlot: '07:30 PM',
                  duration: '2 hrs',
                  location: 'Ginza 4-chome, Tokyo',
                  description: 'Exquisite 18-course tasting menu crafted with early morning Toyosu market wild catches.',
                  imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
                  rating: 4.97,
                  tags: ['Michelin Tier', 'Exclusive Reservation'],
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`✅ Seeded premade circuits: Kerala, Rajasthan, Tokyo/Kyoto`);

  // 8. Seed Confirmed Booked Trip for Sarah Mehta (with Full Logistics Bento)
  await prisma.bookedTrip.upsert({
    where: { id: 'trip-kerala-escape' },
    update: {
      totalPrice: 2450.0,
      status: 'CONFIRMED',
      operatorId: alex.id,
    },
    create: {
      id: 'trip-kerala-escape',
      operatorId: alex.id,
      itineraryId: keralaItinerary.id,
      userId: sarah.id,
      bookingRef: 'TF-KL-88392',
      title: 'Kerala Monsoon Whispers & Backwaters',
      destination: 'Kerala',
      dates: 'Oct 14 – 19, 2025',
      duration: '6 Days',
      travelers: 2,
      totalPrice: 2450.0,
      currency: 'USD',
      status: 'CONFIRMED',
      heroImageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      flightDetails: {
        airline: 'Air India',
        flightNumber: 'AI-682',
        pnr: 'KOK682',
        route: 'BOM ➔ COK',
        departureTime: '11:30 AM',
        arrivalTime: '01:30 PM',
        terminal: 'Terminal 2',
        gate: 'Gate 42B',
        seat: '14A & 14B (Premium Economy)',
        baggage: '2 x 30kg Priority Tagged',
        status: 'On Time',
      },
      hotelCheckIn: {
        hotelName: 'Brunton Boatyard — CGH Earth',
        roomType: 'Sea Facing Heritage Suite',
        checkInDate: 'Oct 14, 2025',
        checkInTime: '02:00 PM',
        checkOutDate: 'Oct 17, 2025',
        voucherRef: 'VCHR-BB-8812',
        address: '1/498, Calvathy Road, Fort Kochi, Kerala 682001',
        inclusions: ['Breakfast Buffet', 'High Tea', 'Sunset Harbour Cruise', 'Complimentary WiFi'],
        nights: 3,
      },
      carDetails: {
        vehicleType: 'Executive MPV',
        vehicleModel: 'Toyota Innova Crysta (Dual AC)',
        licensePlate: 'KL-07-CD-4092',
        chauffeurName: 'Arun V.',
        chauffeurPhone: '+91 98470 12345',
        chauffeurRating: '4.98 ★ (420+ tours)',
        pickupLocation: 'Cochin International Airport T3 (Arrival Gate 4)',
        pickupTime: '01:45 PM',
        serviceScope: 'Dedicated 24/7 on standby for entirety of circuit',
        gpsTrackingActive: true,
      },
      vaultDocuments: {
        create: [
          {
            userId: sarah.id,
            category: 'flight',
            title: 'Air India AI-682 Digital Boarding Pass',
            travelerName: 'Sarah Mehta',
            documentNumber: 'KOK682',
            issueDate: 'Oct 14, 2025',
            expiryDate: 'Oct 14, 2025',
            status: 'confirmed',
            fileUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
            filePublicId: 'flight_kok682',
            fileType: 'pdf',
            fileSize: '1.4 MB',
            notes: 'Air India non-stop BOM to COK confirmed.',
          },
          {
            userId: sarah.id,
            category: 'hotel',
            title: 'Brunton Boatyard Suite Reservation Voucher',
            travelerName: 'Sarah Mehta',
            documentNumber: 'VCHR-BB-8812',
            issueDate: 'Oct 12, 2025',
            expiryDate: 'Oct 17, 2025',
            status: 'confirmed',
            fileUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
            filePublicId: 'hotel_brunton',
            fileType: 'pdf',
            fileSize: '2.1 MB',
            notes: 'Sea Facing Heritage Suite with sunset high tea included.',
          },
          {
            userId: sarah.id,
            category: 'transit',
            title: 'Dedicated Chauffeur Manifest — Arun V.',
            travelerName: 'Sarah Mehta',
            documentNumber: 'KL-07-CD-4092',
            issueDate: 'Oct 14, 2025',
            status: 'confirmed',
            fileUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
            filePublicId: 'chauffeur_arun',
            fileType: 'pdf',
            fileSize: '890 KB',
            notes: 'Chauffeur on standby with chilled tender coconuts on arrival.',
          },
          {
            userId: sarah.id,
            category: 'passport',
            title: 'Sarah Mehta — Biometric Passport',
            travelerName: 'Sarah Mehta',
            documentNumber: 'Z8492014',
            issueDate: '14 Jan 2021',
            expiryDate: '13 Jan 2031',
            status: 'verified',
            fileUrl: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=800&q=80',
            filePublicId: 'passport_sarah',
            fileType: 'pdf',
            fileSize: '1.8 MB',
            notes: 'Biometric chip optical zone scanned and validated.',
          },
          {
            userId: sarah.id,
            category: 'insurance',
            title: 'Allianz Global Luxury Trip Protection Policy',
            travelerName: 'Sarah Mehta',
            documentNumber: 'AZ-7729104',
            issueDate: '01 Oct 2025',
            expiryDate: '31 Oct 2025',
            status: 'verified',
            fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&q=80',
            filePublicId: 'insurance_sarah',
            fileType: 'pdf',
            fileSize: '1.1 MB',
            notes: '$1,000,000 comprehensive medical evacuation and zero-deductible cancellation coverage.',
          },
        ],
      },
    },
  });

  console.log(`✅ Seeded active booked trip for Sarah Mehta with Vault documents`);

  // 9. Seed Emergency Contacts
  const contacts = [
    { role: 'Priority Concierge Lead', name: 'Arun V.', phone: '+91 98470 12345', badge: 'WhatsApp & Voice', notes: 'Direct concierge line' },
    { role: 'Kerala Medical Director', name: 'Dr. Radhakrishnan', phone: '+91 94471 99882', badge: '24/7 On Duty', notes: 'Emergency medical line' },
    { role: 'Fleet Chauffeur Dispatch', name: 'Cochin Dispatch Ops', phone: '+91 484 261 0000', badge: 'Fast-Dial', notes: 'Fleet dispatch headquarters' },
  ];

  await prisma.emergencyContact.deleteMany({});
  for (const c of contacts) {
    await prisma.emergencyContact.create({
      data: {
        role: c.role,
        name: c.name,
        phone: c.phone,
        badge: c.badge,
        notes: c.notes,
        isGlobal: true,
      },
    });
  }
  console.log(`✅ Seeded emergency contacts`);

  // 10. Seed Operator Cohorts & Alerts
  const guideRohan = await prisma.tourGuide.findFirst({ where: { id: 'guide-rohan' } });

  const cohort1 = await prisma.tourCohort.upsert({
    where: { id: 'cohort-kerala-1024' },
    update: {
      paxCount: 14,
      status: 'In Progress',
      operatorId: alex.id,
    },
    create: {
      id: 'cohort-kerala-1024',
      operatorId: alex.id,
      name: 'Kerala Highlands Monsoon Tour',
      circuit: 'Kochi ➔ Munnar ➔ Alleppey',
      dates: 'Oct 14 – 19, 2025',
      leadGuideId: guideRohan?.id,
      paxCount: 14,
      maxPax: 16,
      progressPercent: 45,
      currentStop: 'Munnar Tea Sanctuary',
      nextMilestone: 'Kumarakom Luxury Bird Sanctuary Check-in',
      status: 'In Progress',
      vipCount: 4,
    },
  });

  const cohort2 = await prisma.tourCohort.upsert({
    where: { id: 'cohort-rajasthan-2048' },
    update: {
      operatorId: alex.id,
    },
    create: {
      id: 'cohort-rajasthan-2048',
      operatorId: alex.id,
      name: 'Imperial Rajasthan Forts & Palaces',
      circuit: 'Jaipur ➔ Jodhpur ➔ Udaipur',
      dates: 'Nov 10 – 16, 2025',
      leadGuideId: 'guide-mahaveer',
      paxCount: 12,
      maxPax: 14,
      progressPercent: 10,
      currentStop: 'Amer Fort, Jaipur',
      nextMilestone: 'Umaid Bhawan Palace Check-in',
      status: 'Upcoming',
      vipCount: 6,
    },
  });

  await prisma.disruptionAlert.deleteMany({});
  await prisma.disruptionAlert.create({
    data: {
      operatorId: alex.id,
      cohortId: cohort1.id,
      tourTitle: 'Kerala Highlands Monsoon Tour',
      severity: 'moderate',
      title: 'Munnar Valley Gap Road Maintenance',
      description: 'Scenic bypass through Suryanelli tea slopes assigned; 15 min panoramic scenic detour with tea tasting stopover.',
      affectedTravelers: 14,
      category: 'transport',
      actionSuggested: 'Alternative tea plantation route assigned with zero arrival delay.',
      isResolved: true,
      resolvedAt: new Date(),
      resolvedBy: 'Alex Vance (Chief Dispatcher)',
    },
  });

  await prisma.disruptionAlert.create({
    data: {
      operatorId: alex.id,
      cohortId: cohort1.id,
      tourTitle: 'Kerala Highlands Monsoon Tour',
      severity: 'high',
      title: 'Air India Flight AI-682 Baggage Handling Gate Shift',
      description: 'Arrival moved from Gate 40 to Gate 42B. Concierge Arun V. dispatched to Gate 42B exit for direct traveler escort.',
      affectedTravelers: 2,
      category: 'flight',
      actionSuggested: 'Chauffeur Arun positioned at Gate 42B with personalized placard.',
      isResolved: false,
    },
  });

  await prisma.disruptionAlert.create({
    data: {
      operatorId: alex.id,
      cohortId: cohort2.id,
      tourTitle: 'Goa Coastal & Spice Trail',
      severity: 'moderate',
      title: 'South Goa Highway Bridge Resurfacing',
      description: 'Chauffeur reassigned via NH-66 bypass to maintain Fort Aguada arrival schedule.',
      affectedTravelers: 4,
      category: 'transport',
      actionSuggested: 'Swap driver to Ramcharan S. and route via Atal Setu bypass.',
      isResolved: false,
    },
  });

  console.log(`✅ Seeded cohorts and disruption alerts`);

  // 11. Seed Payments Ledger
  await prisma.paymentTransaction.deleteMany({});
  const transactions = [
    {
      operatorId: alex.id,
      transactionRef: 'TXN-998241',
      party: 'Sarah Mehta (Amex Concierge Checkout)',
      type: 'inbound',
      amount: 2450.0,
      currency: 'USD',
      status: 'SETTLED' as const,
      paymentMethod: 'Amex Centurion ••8842',
      description: 'Full booking confirmation for Kerala Monsoon Whispers',
    },
    {
      operatorId: alex.id,
      transactionRef: 'TXN-998242',
      party: 'Brunton Boatyard — CGH Earth',
      type: 'outbound',
      amount: 1350.0,
      currency: 'USD',
      status: 'SETTLED' as const,
      paymentMethod: 'Direct Escrow Wire',
      description: '3 Nights Sea Facing Heritage Suite settlement',
    },
    {
      operatorId: alex.id,
      transactionRef: 'TXN-998243',
      party: 'Cochin Executive Fleet Services',
      type: 'outbound',
      amount: 450.0,
      currency: 'USD',
      status: 'SETTLED' as const,
      paymentMethod: 'Direct Fleet Wire',
      description: 'Dedicated Innova Crysta Chauffeur retainer',
    },
    {
      operatorId: alex.id,
      transactionRef: 'TXN-998244',
      party: 'Allianz Global Protection Escrow',
      type: 'escrow',
      amount: 220.0,
      currency: 'USD',
      status: 'PROCESSING' as const,
      paymentMethod: 'Underwriter Escrow Deposit',
      description: 'Medical and travel insurance premium escrow',
    },
  ];

  for (const t of transactions) {
    await prisma.paymentTransaction.create({ data: t });
  }
  console.log(`✅ Seeded payments ledger: ${transactions.length} transactions`);

  // 12. Seed Calendar Tour Events
  await prisma.calendarTourEvent.deleteMany({});
  const calendarEvents = [
    {
      operatorId: alex.id,
      title: 'Air India AI-682 Departure',
      cohortName: 'Kerala Highlands Monsoon Tour',
      eventDate: new Date('2025-10-14T06:00:00.000Z'),
      timeSlot: '11:30 AM',
      eventType: 'departure',
      location: 'Mumbai T2 (BOM)',
      color: '#2563EB',
      pax: 2,
    },
    {
      operatorId: alex.id,
      title: 'Brunton Boatyard Suite Check-in',
      cohortName: 'Kerala Highlands Monsoon Tour',
      eventDate: new Date('2025-10-14T08:30:00.000Z'),
      timeSlot: '02:00 PM',
      eventType: 'checkin',
      location: 'Fort Kochi, Kerala',
      color: '#059669',
      pax: 2,
    },
    {
      operatorId: alex.id,
      title: 'Gap Road Chauffeur Transfer to Munnar',
      cohortName: 'Kerala Highlands Monsoon Tour',
      eventDate: new Date('2025-10-15T03:30:00.000Z'),
      timeSlot: '09:00 AM',
      eventType: 'transfer',
      location: 'Munnar Highlands',
      color: '#D97706',
      pax: 2,
    },
    {
      operatorId: alex.id,
      title: 'Alleppey Teak Houseboat Private Boarding',
      cohortName: 'Kerala Highlands Monsoon Tour',
      eventDate: new Date('2025-10-16T07:30:00.000Z'),
      timeSlot: '01:00 PM',
      eventType: 'experience',
      location: 'Vembanad Lake, Alleppey',
      color: '#7C3AED',
      pax: 2,
    },
  ];

  for (const e of calendarEvents) {
    await prisma.calendarTourEvent.create({ data: e });
  }
  console.log(`✅ Seeded calendar tour events: ${calendarEvents.length} events`);

  // 13. Seed Saved Journeys for HomeScreen
  await prisma.savedJourney.deleteMany({});
  const savedJourneys = [
    {
      userId: sarah.id,
      title: 'Kerala Backwaters & Mist Highlands',
      origin: 'Mumbai (BOM)',
      destination: 'Cochin & Alleppey (COK)',
      dates: 'Oct 14 – 19, 2025',
      duration: '6 Days',
      travelers: 2,
      price: '$2,450',
      imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      description: 'Private teak kettuvallam cruise, colonial Fort Kochi harbor suite, and mist-covered tea estate trails.',
      category: 'domestic',
      isBookmarked: true,
      rating: '4.98',
      amenities: [
        { icon: 'flight', label: 'Air India Flight' },
        { icon: 'hotel', label: 'Brunton Boatyard' },
        { icon: 'directions_car', label: 'Private Chauffeur' },
      ],
    },
    {
      userId: sarah.id,
      title: 'Imperial Rajasthan Royal Palaces',
      origin: 'Delhi (DEL)',
      destination: 'Jaipur & Udaipur (JAI/UDR)',
      dates: 'Nov 10 – 16, 2025',
      duration: '7 Days',
      travelers: 2,
      price: '$3,200',
      imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      description: 'Maharaja heritage suite at Rambagh Palace and sunset boat ride on Lake Pichola to Taj Lake Palace.',
      category: 'domestic',
      isBookmarked: true,
      rating: '4.96',
      amenities: [
        { icon: 'hotel', label: 'Palace Suite' },
        { icon: 'history_edu', label: 'Historian Escort' },
        { icon: 'directions_car', label: 'Executive MPV' },
      ],
    },
    {
      userId: sarah.id,
      title: 'Tokyo & Kyoto Cultural Connoisseurs',
      origin: 'Mumbai (BOM)',
      destination: 'Tokyo & Kyoto (HND/KIX)',
      dates: 'Oct 14 – 20, 2025',
      duration: '7 Days',
      travelers: 2,
      price: '$4,600',
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      description: 'Aman Tokyo city views, Gran Class Shinkansen bullet train pass, and private tea ceremony in Kyoto.',
      category: 'international',
      isBookmarked: true,
      rating: '4.99',
      amenities: [
        { icon: 'flight', label: 'ANA Premium Flight' },
        { icon: 'train', label: 'Bullet Train' },
        { icon: 'restaurant', label: 'Omakase Dining' },
      ],
    },
  ];

  for (const j of savedJourneys) {
    await prisma.savedJourney.create({ data: j });
  }
  console.log(`✅ Seeded saved journeys: ${savedJourneys.length} journeys`);

  console.log('🎉 Comprehensive database seeding complete!');
}

main()
  .catch(e => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
