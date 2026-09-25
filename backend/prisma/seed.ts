import process from 'node:process';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';


const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding TripFlow Neon PostgreSQL Database...');

  // 1. Seed Users
  const passwordHash = await bcrypt.hash('password123', 10);

  const sarah = await prisma.user.upsert({
    where: { email: 'sarah.mehta@concierge.tripflow.io' },
    update: {},
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
    update: {},
    create: {
      id: 'user-alex-007',
      email: 'alex.vance@ops.tripflow.io',
      name: 'Alex Vance',
      passwordHash,
      role: 'OPERATOR',
      phone: '+91 98110 55210',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      membershipTier: 'Chief Dispatch Controller',
    },
  });

  console.log(`✅ Seeded users: ${sarah.name}, ${alex.name}`);

  // 2. Seed Curated Premade Itineraries (Kerala, Rajasthan, Goa)
  const keralaItinerary = await prisma.tripItinerary.upsert({
    where: { id: 'trip-kerala-luxury' },
    update: {},
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
                  description: 'Colonial boutique hotel built on 19th century Victorian shipyards. High tea on private veranda.',
                  imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
                  rating: 4.92,
                  tags: ['Heritage Hotel', '5-Star'],
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`✅ Seeded premade circuit: ${keralaItinerary.title}`);

  // 3. Seed Confirmed Booked Trip for Sarah Mehta
  await prisma.bookedTrip.upsert({
    where: { id: 'trip-kerala-escape' },
    update: {},
    create: {
      id: 'trip-kerala-escape',
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
        ],
      },
    },
  });

  console.log(`✅ Seeded active booked trip for Sarah Mehta`);

  // 4. Seed Emergency Contacts
  const contacts = [
    { role: 'Priority Concierge Lead', name: 'Arun V.', phone: '+91 98470 12345', badge: 'WhatsApp & Voice', notes: 'Direct concierge line' },
    { role: 'Kerala Medical Director', name: 'Dr. Radhakrishnan', phone: '+91 94471 99882', badge: '24/7 On Duty', notes: 'Emergency medical line' },
    { role: 'Fleet Chauffeur Dispatch', name: 'Cochin Dispatch Ops', phone: '+91 484 261 0000', badge: 'Fast-Dial', notes: 'Fleet dispatch headquarters' },
  ];

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

  // 5. Seed Operator Cohort & Alerts
  const guide = await prisma.tourGuide.create({
    data: {
      name: 'Rohan Deshmukh',
      role: 'Master Guide',
      languages: ['English', 'Malayalam', 'Hindi'],
      rating: 4.96,
      totalTours: 140,
      status: 'On Tour',
      location: 'Munnar Highlands',
      phone: '+91 98200 11223',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      certifications: ['Govt Certified Naturalist', 'Wilderness First Aid'],
    },
  });

  const cohort = await prisma.tourCohort.create({
    data: {
      name: 'Kerala Highlands Monsoon Tour',
      circuit: 'Kochi ➔ Munnar ➔ Alleppey',
      dates: 'Oct 14 – 19, 2025',
      leadGuideId: guide.id,
      paxCount: 14,
      maxPax: 16,
      progressPercent: 45,
      currentStop: 'Munnar Tea Sanctuary',
      nextMilestone: 'Kumarakom Luxury Bird Sanctuary Check-in',
      status: 'In Progress',
      vipCount: 4,
    },
  });

  await prisma.disruptionAlert.create({
    data: {
      cohortId: cohort.id,
      tourTitle: 'Kerala Highlands Monsoon Tour',
      severity: 'moderate',
      title: 'Munnar Valley Gap Road Maintenance',
      description: 'Scenic bypass through Suryanelli tea slopes assigned; 15 min panoramic scenic detour with tea tasting stopover.',
      affectedTravelers: 14,
      category: 'transport',
      actionSuggested: 'Alternative tea plantation route assigned with zero arrival delay.',
      isResolved: true,
    },
  });

  console.log(`✅ Seeded operator tour cohort and disruption alert`);
  console.log('🎉 Database seeding complete!');
}

main()
  .catch(e => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
