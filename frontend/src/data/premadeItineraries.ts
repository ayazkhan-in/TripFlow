import { TripItinerary, ItineraryDay, ItineraryItem, CatalogItem } from '../types/itinerary';
import { BookedTrip } from '../types/travel';
import { VaultDocument } from '../types/vault';
import { calculateTripPricing } from '../utils/pricing';

// ============================================================================
// 1. PREMADE ITINERARIES (Curated Ready-to-Book Packages)
// ============================================================================

export const PREMADE_KERALA_ITINERARY: TripItinerary = {
  id: 'trip-kerala-luxury',
  title: 'Kerala Monsoon Whispers & Backwaters',
  destination: 'Kerala',
  country: 'India',
  dates: 'Oct 14 – 19, 2025',
  startDate: '2025-10-14',
  travelers: 2,
  currency: 'INR',
  heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPNN2qoyEfvyOtZqIr504qTiJEZNQBFvkTNvnO1WbRHP3yVW547MfCw_uDAhSKK1GiCdNjUe-aRn8-L_63RS7R5Mwy4YqnpRnqP57KQq_CU-YFBVffy0PLU7ZdcbMNrxFCo6iB6Avjx862fxPTlkaaqd3BGyUp-55-M5LzxAfFv7qHZZE61cBMvjceJO4nQcz_Dorwpv3LBbNmV9TuAEfTYveWHC3LBVHpfXmUBrAgH70wL-s9i3orMA',
  routeStops: [
    { id: 'rs-1', city: 'Cochin', weather: '28°C Tropical', hotel: 'Brunton Boatyard', transitMode: 'flight' },
    { id: 'rs-2', city: 'Munnar', weather: '21°C Mist', hotel: 'Windermere Estate', transitMode: 'car' },
    { id: 'rs-3', city: 'Alleppey', weather: '27°C Lakes', hotel: 'Private Teak Houseboat', transitMode: 'car' },
  ],
  days: [
    {
      id: 'day-kl-1',
      dayNumber: 1,
      date: 'Tue, Oct 14',
      title: 'Arrival in Kochi & Colonial Heritage Walk',
      subtitle: 'Air India Flight • Chauffeur Pickup • Fort Kochi Sunset',
      items: [
        {
          id: 'kl-101',
          title: 'Air India AI-682 (BOM ➔ COK Flight)',
          category: 'transport',
          price: 6800,
          time: '11:30 AM',
          duration: '2 hrs',
          location: 'Terminal 2, Mumbai Airport',
          description: 'Non-stop scheduled flight arriving at Cochin International Airport T3. Priority baggage tags.',
          image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
          rating: 4.8,
          tags: ['Flight', 'Included'],
          transitToNext: { mode: 'car', duration: '45 min' },
        },
        {
          id: 'kl-102',
          title: 'Private Executive Chauffeur Airport Pickup (Innova Crysta)',
          category: 'transport',
          price: 2400,
          time: '02:00 PM',
          duration: '1.5 hrs',
          location: 'Cochin Airport T3 Arrival Gate',
          description: 'Chauffeur Arun V. meets with personalized nameboard. Chilled bottled tender coconut water on board.',
          image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
          rating: 4.95,
          tags: ['Chauffeur', 'Private Car'],
          transitToNext: { mode: 'car', duration: '20 min' },
        },
        {
          id: 'kl-103',
          title: 'Brunton Boatyard — CGH Earth Fort Kochi Check-in',
          category: 'hotel',
          price: 14500,
          time: '03:30 PM',
          duration: 'Overnight',
          location: 'Calvathy Road, Fort Kochi',
          description: 'Restored Victorian shipyard heritage suite with direct views of passing harbour boats and dolphin pods.',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          tags: ['Heritage Stay', 'Harbour View'],
          transitToNext: { mode: 'walk', duration: '10 min' },
        },
        {
          id: 'kl-104',
          title: 'Chinese Fishing Nets & Spice Market Sunset Walk',
          category: 'activity',
          price: 1200,
          time: '05:30 PM',
          duration: '2 hrs',
          location: 'Fort Kochi Waterfront',
          description: 'Private local historian walking tour through 14th-century Portuguese streets, Jewish synagogue, and cantilevered nets.',
          image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
          rating: 4.85,
          tags: ['Walking Tour', 'Sunset'],
        },
      ],
    },
    {
      id: 'day-kl-2',
      dayNumber: 2,
      date: 'Wed, Oct 15',
      title: 'Ascending into Munnar Tea Highlands',
      subtitle: 'Scenic Waterfalls Drive • Tea Plantation Walk • Planter’s Dinner',
      items: [
        {
          id: 'kl-201',
          title: 'Scenic Highlands Drive via Cheeyappara Waterfalls',
          category: 'transport',
          price: 3200,
          time: '08:30 AM',
          duration: '3.5 hrs',
          location: 'Kochi ➔ Munnar Highway',
          description: 'Executive drive ascending 1,600m above sea level through rubber estates, misty hairpin turns, and cascades.',
          image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          tags: ['Scenic Drive', 'Innova Crysta'],
          transitToNext: { mode: 'car', duration: '15 min' },
        },
        {
          id: 'kl-202',
          title: 'Windermere Estate Munnar — Planter’s Villa Check-in',
          category: 'hotel',
          price: 13500,
          time: '01:00 PM',
          duration: 'Overnight',
          location: 'Pothamedu, Munnar',
          description: 'Boutique plantation retreat perched on a cliff edge overlooking endless rolling carpets of cardamom and tea.',
          image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
          rating: 4.94,
          tags: ['Mountain View', 'Luxury Estate'],
        },
        {
          id: 'kl-203',
          title: 'Private Estate Tea Tasting & Factory Masterclass',
          category: 'experience',
          price: 1800,
          time: '03:30 PM',
          duration: '2 hrs',
          location: 'Lockhart Estate 1879',
          description: 'Plucking demonstration with estate pickers followed by an orthodox tea brewing tasting with the head master.',
          image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          tags: ['Tea Tasting', 'Artisan'],
        },
      ],
    },
    {
      id: 'day-kl-3',
      dayNumber: 3,
      date: 'Thu, Oct 16',
      title: 'Eravikulam Wildlife Safari & Kundala Lake',
      subtitle: 'Nilgiri Tahr Sanctuary • Speedboat Cruise • Fireplace Dinner',
      items: [
        {
          id: 'kl-301',
          title: 'Eravikulam National Park Nilgiri Tahr VIP Safari',
          category: 'activity',
          price: 2600,
          time: '08:00 AM',
          duration: '3 hrs',
          location: 'Rajamalai Sanctuary, Munnar',
          description: 'Early morning warden-guided access to view the endangered wild mountain ibex among purple Neelakurinji slopes.',
          image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
          rating: 4.92,
          tags: ['Wildlife', 'VIP Permit'],
          transitToNext: { mode: 'car', duration: '30 min' },
        },
        {
          id: 'kl-302',
          title: 'Kundala Dam Lake Private Electric Boat Ride',
          category: 'activity',
          price: 1500,
          time: '03:00 PM',
          duration: '1.5 hrs',
          location: 'Kundala Reservoir, Munnar',
          description: 'Serene electric boat ride amidst pine forests and cherry blossom groves.',
          image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
          rating: 4.8,
          tags: ['Lake Cruise', 'Boating'],
        },
      ],
    },
    {
      id: 'day-kl-4',
      dayNumber: 4,
      date: 'Fri, Oct 17',
      title: 'Alleppey Backwaters & Private Luxury Houseboat',
      subtitle: 'Transfer to Lakes • Kettuvallam Boarding • Karimeen Feast',
      items: [
        {
          id: 'kl-401',
          title: 'Highlands to Backwaters Private Transit (160 km)',
          category: 'transport',
          price: 3800,
          time: '08:30 AM',
          duration: '4 hrs',
          location: 'Munnar ➔ Alleppey Jetty',
          description: 'Comfortable highway descent in your air-conditioned Innova with refreshment breaks in Kottayam.',
          image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          tags: ['Chauffeur Transfer'],
          transitToNext: { mode: 'car', duration: '10 min' },
        },
        {
          id: 'kl-402',
          title: 'Spice Coast Luxury Teak Houseboat Check-in & Cruise',
          category: 'hotel',
          price: 16500,
          time: '01:00 PM',
          duration: 'Overnight',
          location: 'Vembanad Lake, Alleppey',
          description: 'Private 1-bedroom air-conditioned wooden kettuvallam with master chef, captain, and panoramic bow lounge.',
          image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
          rating: 4.96,
          tags: ['Private Houseboat', 'Chef Onboard'],
        },
        {
          id: 'kl-403',
          title: 'Sunset Canoe Drift in Hidden Village Canals',
          category: 'activity',
          price: 1400,
          time: '05:30 PM',
          duration: '1.5 hrs',
          location: 'Kainakary Village Canals',
          description: 'Narrow hand-rowed canoe through secluded inland canals observing duck farmers, toddy tappers, and paddy fields.',
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
          rating: 4.95,
          tags: ['Village Canoe', 'Sunset'],
        },
      ],
    },
    {
      id: 'day-kl-5',
      dayNumber: 5,
      date: 'Sat, Oct 18',
      title: 'Kumarakom Lakeside Relaxation & Ayurveda Spa',
      subtitle: 'Lake Disembarkation • Resort Check-in • Abhyanga Therapy',
      items: [
        {
          id: 'kl-501',
          title: 'Kumarakom Lake Resort Luxury Pavilion Check-in',
          category: 'hotel',
          price: 18000,
          time: '11:30 AM',
          duration: 'Overnight',
          location: 'Vembanad Lake Shore, Kumarakom',
          description: 'Award-winning heritage retreat featuring 250-year-old reconstructed illam homesteads and meandering pool.',
          image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
          rating: 4.98,
          tags: ['5-Star Luxury', 'Private Pool'],
        },
        {
          id: 'kl-502',
          title: 'Ayurmana Authentic Herbal Oil Body Massage (Abhyanga)',
          category: 'experience',
          price: 4500,
          time: '03:30 PM',
          duration: '1.5 hrs',
          location: 'Ayurmana Spa Heritage Wing',
          description: 'Traditional 4-hand synchronized herbal massage followed by medicinal steam chamber and detox tea.',
          image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
          rating: 4.92,
          tags: ['Ayurveda Spa', 'Wellness'],
        },
      ],
    },
    {
      id: 'day-kl-6',
      dayNumber: 6,
      date: 'Sun, Oct 19',
      title: 'Farewell Kerala & Airport Transfer',
      subtitle: 'Kumarakom Morning • Chauffeur Drop-off • IndiGo Flight Home',
      items: [
        {
          id: 'kl-601',
          title: 'Airport Highway Transfer to Cochin T3 (Innova Crysta)',
          category: 'transport',
          price: 2600,
          time: '11:00 AM',
          duration: '2 hrs',
          location: 'Kumarakom ➔ Cochin International Airport',
          description: 'Comfortable transfer with chauffeur Arun V. directly to Departures Gate 3 with luggage porter assistance.',
          image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
          rating: 4.95,
          tags: ['Airport Transfer'],
        },
        {
          id: 'kl-602',
          title: 'IndiGo 6E-512 Return Flight (COK ➔ BOM)',
          category: 'transport',
          price: 6400,
          time: '03:15 PM',
          duration: '2h 10m',
          location: 'Cochin Airport T3 Gate 14',
          description: 'Return domestic flight to Mumbai with priority boarding and extra legroom seats 12B/12C.',
          image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
          rating: 4.85,
          tags: ['Return Flight'],
        },
      ],
    },
  ],
};

export const PREMADE_RAJASTHAN_ITINERARY: TripItinerary = {
  id: 'trip-rajasthan-heritage',
  title: 'Rajasthan Royal Heritage & Desert Palaces',
  destination: 'Rajasthan',
  country: 'India',
  dates: 'Nov 12 – 18, 2025',
  startDate: '2025-11-12',
  travelers: 2,
  currency: 'INR',
  heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbyI_zJyS4HPjs4Rp8ZrKbvi9uzWuxsx3_ToOq_IZzRHRHkRoACRHWaJuRtARH64i1r5SCUH1PmPDz4D-zXksC-GpkOa0NAcmUkf5ircayPXcX4oqWb4vnshv3fqxw5BlmDJldfMwizWN_7sv0CNV0QGAqpYY8_mIKLmdD1hkeGYL5sfx6pjZ77_KvSFg14dIW2cVfZEDefopiD1-RkebGX63dJyfvw0F6V-MzaH1oD6Ktjz0qEp6-lA',
  routeStops: [
    { id: 'rs-rj-1', city: 'Jaipur', weather: '24°C Sunny', hotel: 'Samode Haveli', transitMode: 'flight' },
    { id: 'rs-rj-2', city: 'Jodhpur', weather: '26°C Clear', hotel: 'Raas Jodhpur', transitMode: 'car' },
    { id: 'rs-rj-3', city: 'Udaipur', weather: '23°C Lake Breeze', hotel: 'Taj Lake Palace', transitMode: 'car' },
  ],
  days: [
    {
      id: 'day-rj-1',
      dayNumber: 1,
      date: 'Wed, Nov 12',
      title: 'Arrival in Pink City Jaipur',
      subtitle: 'SpiceJet Flight • Chauffeur Raghav Singh • Samode Haveli',
      items: [
        {
          id: 'rj-101',
          title: 'SpiceJet SG-8194 Flight (DEL ➔ JAI)',
          category: 'transport',
          price: 5200,
          time: '10:00 AM',
          duration: '1 hr',
          location: 'Delhi Terminal 1B ➔ Jaipur Airport',
          description: 'Morning commuter flight to Jaipur Sanganer Airport. Fast-track baggage check.',
          image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
          rating: 4.8,
          tags: ['Flight'],
          transitToNext: { mode: 'car', duration: '35 min' },
        },
        {
          id: 'rj-102',
          title: 'Samode Haveli Heritage Suite Check-in',
          category: 'hotel',
          price: 18500,
          time: '01:30 PM',
          duration: 'Overnight',
          location: 'Gangapole, Old City Jaipur',
          description: 'A 175-year-old royal townhouse featuring hand-painted fresco courtyards and marble fountains.',
          image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
          rating: 4.95,
          tags: ['Heritage Haveli'],
        },
        {
          id: 'rj-103',
          title: 'Private Chauffeur Toyota Fortuner (7 Days Dedicated)',
          category: 'transport',
          price: 4500,
          time: '03:00 PM',
          duration: 'Full Tour',
          location: 'Rajasthan Circuit Fleet',
          description: 'Dedicated veteran chauffeur Raghav Singh with luxury 4x4 Fortuner, cold towels, and GPS radar tracking.',
          image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
          rating: 4.98,
          tags: ['Private Chauffeur', '4x4 Fortuner'],
        },
        {
          id: 'rj-104',
          title: 'Sunset Panorama at Nahargarh Fort Falcon Deck',
          category: 'activity',
          price: 1600,
          time: '05:30 PM',
          duration: '2.5 hrs',
          location: 'Aravalli Hills, Jaipur',
          description: 'Overlook the illuminated Pink City below with chilled artisanal drinks on the ramparts.',
          image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          tags: ['Sunset View'],
        },
      ],
    },
    {
      id: 'day-rj-2',
      dayNumber: 2,
      date: 'Thu, Nov 13',
      title: 'Amber Fort VIP & Royal Observatory',
      subtitle: 'Amber Palace • Sheesh Mahal Mirror Hall • Jantar Mantar',
      items: [
        {
          id: 'rj-201',
          title: 'Amber Fort & Sheesh Mahal VIP Palace Historian Tour',
          category: 'activity',
          price: 2400,
          time: '09:00 AM',
          duration: '3 hrs',
          location: 'Deoritha, Amer, Jaipur',
          description: 'Private buggy ride up the ramparts, access to private royal chambers and mirror mosaic ceilings.',
          image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
          rating: 4.96,
          tags: ['UNESCO', 'VIP Guide'],
        },
        {
          id: 'rj-202',
          title: 'Royal Thali Degustation at 1135 AD Amber',
          category: 'meal',
          price: 4200,
          time: '01:00 PM',
          duration: '2 hrs',
          location: 'Amer Fort Upper Courtyard',
          description: 'Silver thali banquet featuring Laal Maas, Ker Sangri, and saffron Ghewar served with live sitar music.',
          image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          tags: ['Royal Dining'],
        },
      ],
    },
    {
      id: 'day-rj-3',
      dayNumber: 3,
      date: 'Fri, Nov 14',
      title: 'Transfer to Blue City Jodhpur & Mehrangarh',
      subtitle: 'Highways of Marwar • Raas Boutique Haveli • Mehrangarh Fort',
      items: [
        {
          id: 'rj-301',
          title: 'Jaipur ➔ Jodhpur Highway Transfer (320 km)',
          category: 'transport',
          price: 4800,
          time: '08:00 AM',
          duration: '5 hrs',
          location: 'Jaipur ➔ Jodhpur Express Corridor',
          description: 'Comfortable highway cruising with chauffeur Raghav Singh. Stop at Nimaj village for chai.',
          image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          tags: ['Intercity Transfer'],
        },
        {
          id: 'rj-302',
          title: 'Raas Jodhpur — Luxury Heritage Stepwell Suite',
          category: 'hotel',
          price: 19500,
          time: '02:00 PM',
          duration: 'Overnight',
          location: 'Tunwar ji ka Jhalra, Jodhpur',
          description: 'Contemporary carved rose sandstone architecture framing dramatic direct views of Mehrangarh.',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          rating: 4.97,
          tags: ['Boutique Design', 'Fort View'],
        },
      ],
    },
    {
      id: 'day-rj-4',
      dayNumber: 4,
      date: 'Sat, Nov 15',
      title: 'Ranakpur Marble Temples to City of Lakes Udaipur',
      subtitle: '1,444 Carved Pillars • Aravalli Pass • Taj Lake Palace Check-in',
      items: [
        {
          id: 'rj-401',
          title: 'Ranakpur Jain Temple 1,444 Marble Pillar Guided Walk',
          category: 'activity',
          price: 1800,
          time: '11:00 AM',
          duration: '2 hrs',
          location: 'Ranakpur, Desuri Valley',
          description: 'Marvel at 15th-century carved white marble pillars where no two carvings are identical.',
          image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
          rating: 4.95,
          tags: ['Architecture', 'Temple'],
        },
        {
          id: 'rj-402',
          title: 'Taj Lake Palace Udaipur — Luxury Palace Suite Arrival',
          category: 'hotel',
          price: 32000,
          time: '04:00 PM',
          duration: 'Overnight',
          location: 'Lake Pichola Island, Udaipur',
          description: 'Arrive by private ceremonial boat with rose-petal shower to an 18th-century island marble palace.',
          image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
          rating: 5.0,
          tags: ['Iconic Palace', 'Island Hotel'],
        },
      ],
    },
  ],
};

export const PREMADE_GOA_ITINERARY: TripItinerary = {
  id: 'trip-goa-coastal',
  title: 'Goa Coastal Serenity & Private Catamaran',
  destination: 'Goa',
  country: 'India',
  dates: 'Nov 20 – 24, 2025',
  startDate: '2025-11-20',
  travelers: 2,
  currency: 'INR',
  heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVjnfl_mReQbKeM3AbIKOVjC40JYZpReAUogBam_Py_Yb3DmJ5ArHWYnD8VJYhzjfvEFohQMspaXlys52OX7R8mo4hegiK5v9nDLL3uwkpY5nzsMnYi7LL1VLmp73AH6uJtRVZj8ZVCD78W2h_lzC2GuzOhg25tuQVnHg2GC19MT_Wjxq91BCXa8QjVCY4ls-tu7tdN6JTGTiriBCj5_vt_TXzoSNEhaGrasMWgArJikBlCLrZDnsScw',
  routeStops: [
    { id: 'rs-goa-1', city: 'Panaji', weather: '29°C Coastal', hotel: 'Ahilya by the Sea', transitMode: 'flight' },
    { id: 'rs-goa-2', city: 'Palolem', weather: '28°C Beach', hotel: 'Cabo Serai Ocean Villa', transitMode: 'car' },
  ],
  days: [
    {
      id: 'day-goa-1',
      dayNumber: 1,
      date: 'Thu, Nov 20',
      title: 'Arrival in North Goa & Dolphin Bay Villa',
      subtitle: 'IndiGo Flight • Chauffeur Marcus • Ahilya by the Sea',
      items: [
        {
          id: 'goa-101',
          title: 'IndiGo 6E-284 Flight (BOM ➔ GOI)',
          category: 'transport',
          price: 4800,
          time: '11:15 AM',
          duration: '1h 15m',
          location: 'Mumbai T2 ➔ Dabolim Goa Airport',
          description: 'Short coastal flight landing over the Arabian Sea coastline.',
          image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
          rating: 4.8,
          tags: ['Flight'],
        },
        {
          id: 'goa-102',
          title: 'Ahilya by the Sea — Dolphin Villa Check-in',
          category: 'hotel',
          price: 17500,
          time: '02:00 PM',
          duration: 'Overnight',
          location: 'Nerul, Dolphin Bay, Goa',
          description: 'Hidden boutique property with two infinity pools carved into the sea wall facing the estuary.',
          image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
          rating: 4.95,
          tags: ['Oceanfront Boutique'],
        },
        {
          id: 'goa-103',
          title: 'Private Chauffeur Toyota Innova (4-Day Dedicated)',
          category: 'transport',
          price: 3600,
          time: '02:30 PM',
          duration: '4 Days',
          location: 'Goa Coastal Circuit',
          description: 'Private chauffeur Marcus D. available round-the-clock for beach transfers and dining runs.',
          image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          tags: ['Private Car'],
        },
      ],
    },
    {
      id: 'day-goa-2',
      dayNumber: 2,
      date: 'Fri, Nov 21',
      title: 'Private Catamaran Charter & Sunset Dining',
      subtitle: 'Arabian Sea Cruise • Snorkeling Cove • Thalassa Sunset Dinner',
      items: [
        {
          id: 'goa-201',
          title: 'Private 40ft Luxury Catamaran Arabian Sea Cruise',
          category: 'activity',
          price: 8500,
          time: '02:30 PM',
          duration: '3.5 hrs',
          location: 'Grand Island Bay, Goa',
          description: 'Sailing along dramatic red laterite cliffs with paddleboarding, snorkeling gear, and chilled beverages.',
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
          rating: 4.98,
          tags: ['Catamaran', 'Private Yacht'],
        },
        {
          id: 'goa-202',
          title: 'Cliffside Sunset Mediterranean Dinner',
          category: 'meal',
          price: 3800,
          time: '07:30 PM',
          duration: '2.5 hrs',
          location: 'Siolim Waterfront',
          description: 'Fresh seafood mezze and grilled tiger prawns overlooking the backwater sunset.',
          image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
          rating: 4.88,
          tags: ['Sunset Dining'],
        },
      ],
    },
  ],
};

export const ALL_PREMADE_ITINERARIES: TripItinerary[] = [
  PREMADE_KERALA_ITINERARY,
  PREMADE_RAJASTHAN_ITINERARY,
  PREMADE_GOA_ITINERARY,
];

// ============================================================================
// 2. AI ITINERARY GENERATOR
// ============================================================================

export interface AIGenerateParams {
  destination: string;
  subLocations?: string;
  days: number;
  dates: string;
  travelers: number;
  budget: number;
  travelStyle: string;
  interests: string[];
}

export function generateAIItinerary(params: AIGenerateParams): TripItinerary {
  const destLower = params.destination.toLowerCase();
  const travelers = Math.max(1, params.travelers || 2);
  const daysCount = Math.max(2, Math.min(10, params.days || 5));

  // Determine base template or customize dynamically
  let baseTemplate: TripItinerary = PREMADE_KERALA_ITINERARY;
  if (destLower.includes('rajasthan') || destLower.includes('jaipur') || destLower.includes('udaipur')) {
    baseTemplate = PREMADE_RAJASTHAN_ITINERARY;
  } else if (destLower.includes('goa') || destLower.includes('beach')) {
    baseTemplate = PREMADE_GOA_ITINERARY;
  }

  // Generate customized days
  const generatedDays: ItineraryDay[] = [];
  for (let i = 1; i <= daysCount; i++) {
    // If template has this day, adapt it; otherwise build a fresh day
    if (i <= baseTemplate.days.length) {
      const templateDay = baseTemplate.days[i - 1];
      generatedDays.push({
        ...templateDay,
        id: `gen-day-${i}-${Date.now()}`,
        dayNumber: i,
        date: `Day ${i}`,
      });
    } else {
      // Create additional customized day
      generatedDays.push({
        id: `gen-day-${i}-${Date.now()}`,
        dayNumber: i,
        date: `Day ${i}`,
        title: `${params.destination} ${params.travelStyle} Highlight`,
        subtitle: `Local Discoveries • Curated Dining • Private Chauffeur`,
        items: [
          {
            id: `item-${i}-1`,
            title: `Boutique Stay & Breakfast at ${params.destination} Retreat`,
            category: 'hotel',
            price: Math.round(params.budget / (daysCount * 2)),
            time: '09:00 AM',
            duration: 'Overnight',
            location: `${params.destination} Center`,
            description: `Handpicked luxury accommodation matching your ${params.travelStyle.toLowerCase()} preference with breakfast included.`,
            image: baseTemplate.heroImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
            rating: 4.9,
            tags: ['Boutique Stay'],
          },
          {
            id: `item-${i}-2`,
            title: `Curated ${params.interests[0] || 'Cultural'} Experience`,
            category: 'activity',
            price: Math.round(params.budget / (daysCount * 4)),
            time: '11:00 AM',
            duration: '2.5 hrs',
            location: `${params.destination} Landmark`,
            description: `Exclusive guided VIP tour tailored for ${travelers} traveler(s).`,
            image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
            rating: 4.88,
            tags: [params.interests[0] || 'Curated Tour'],
          },
          {
            id: 'item-transit-' + i,
            title: `Dedicated Chauffeur City & Regional Transit`,
            category: 'transport',
            price: 2200,
            time: '03:30 PM',
            duration: 'As needed',
            location: params.destination,
            description: `Executive air-conditioned vehicle with licensed driver at your service.`,
            image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
            rating: 4.95,
            tags: ['Private Chauffeur'],
          },
        ],
      });
    }
  }

  const generatedTrip: TripItinerary = {
    id: `ai-trip-${Date.now()}`,
    title: `${params.destination} ${daysCount}-Day ${params.travelStyle} Odyssey`,
    destination: params.destination,
    country: baseTemplate.country,
    dates: params.dates || 'Upcoming',
    startDate: new Date().toISOString().split('T')[0],
    travelers: travelers,
    currency: 'INR',
    heroImage: baseTemplate.heroImage,
    routeStops: baseTemplate.routeStops,
    days: generatedDays,
  };

  return generatedTrip;
}

// ============================================================================
// 3. CONVERTER: ITINERARY -> BOOKED TRIP (With Flights, Hotels, Cars & Details)
// ============================================================================

export function convertItineraryToBookedTrip(
  itinerary: TripItinerary,
  pricingTotal?: number
): BookedTrip {
  const calculated = calculateTripPricing(itinerary);
  const total = pricingTotal || calculated.total;
  const dest = itinerary.destination;
  const destUpper = dest.toUpperCase().slice(0, 3);
  const bookingRef = `TF-${destUpper}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Find hotel item if any
  let firstHotel = 'Old Harbour Boutique Hotel';
  for (const day of itinerary.days) {
    const h = day.items.find(it => it.category === 'hotel');
    if (h) {
      firstHotel = h.title;
      break;
    }
  }

  // Find chauffeur / vehicle if any
  let chauffeurName = 'Arun V.';
  let vehicleModel = 'Toyota Innova Crysta (KL-07-CD-8841)';
  if (dest.toLowerCase().includes('rajasthan')) {
    chauffeurName = 'Raghav Singh';
    vehicleModel = 'Toyota Fortuner (RJ-14-EA-7721)';
  } else if (dest.toLowerCase().includes('goa')) {
    chauffeurName = 'Marcus D.';
    vehicleModel = 'Toyota Innova Hycross (GA-03-K-9912)';
  }

  const bookedTrip: BookedTrip = {
    id: `booked-${itinerary.id}`,
    title: itinerary.title,
    destination: itinerary.destination,
    dates: itinerary.dates,
    duration: `${itinerary.days.length} Days · ${Math.max(1, itinerary.days.length - 1)} Nights`,
    travelers: itinerary.travelers,
    totalPrice: total,
    currency: itinerary.currency || 'INR',
    status: 'Confirmed',
    bookingRef: bookingRef,
    bookedAt: 'Just Now',
    heroImage: itinerary.heroImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',

    flightDetails: {
      airline: dest.toLowerCase().includes('rajasthan') ? 'SpiceJet' : 'IndiGo Airlines',
      flightNumber: dest.toLowerCase().includes('rajasthan') ? 'SG-8194' : '6E-204',
      pnr: `${destUpper}${Math.floor(100 + Math.random() * 899)}Q`,
      route: `DEL ➔ ${destUpper}`,
      departureTime: '10:30 AM',
      arrivalTime: '12:45 PM',
      terminal: 'Terminal 2',
      gate: 'Gate 4B',
      seat: '14A, 14B (Premium Extra Legroom)',
      baggage: '25 kg Checked + 7 kg Cabin Per Passenger',
      status: 'Confirmed',
    },

    hotelCheckIn: {
      hotelName: firstHotel,
      roomType: 'Heritage Suite with Scenic Views',
      checkInDate: itinerary.dates.split('–')[0]?.trim() || 'Day 1',
      checkInTime: '02:00 PM (Early Check-In Requested)',
      checkOutDate: itinerary.dates.split('–')[1]?.trim() || `Day ${itinerary.days.length}`,
      voucherRef: `HTL-${Math.floor(10000 + Math.random() * 89999)}`,
      address: `Historic District, ${itinerary.destination}`,
      inclusions: ['Gourmet Breakfast', 'Welcome High Tea', '24/7 Concierge Desk'],
      nights: Math.max(1, itinerary.days.length - 1),
    },

    carDetails: {
      vehicleType: 'Executive SUV',
      vehicleModel: vehicleModel,
      licensePlate: vehicleModel.match(/\((.*?)\)/)?.[1] || 'KL-07-CD-8841',
      chauffeurName: chauffeurName,
      chauffeurPhone: '+91 98401 22841',
      chauffeurRating: '4.98/5 (184 verified tours)',
      pickupLocation: `${itinerary.destination} Airport Arrivals Gate`,
      pickupTime: 'Upon Flight Landing (Real-Time Radar Sync)',
      serviceScope: `Dedicated across all ${itinerary.days.length} days of your itinerary`,
      gpsTrackingActive: true,
    },

    itinerary: itinerary,
  };

  return bookedTrip;
}

// ============================================================================
// 4. VAULT GENERATOR: GENERATE DOCUMENTS FOR A BOOKED TRIP
// ============================================================================

export function generateVaultDocsForTrip(trip: BookedTrip): VaultDocument[] {
  const tripKey = trip.id;
  const tripTitle = trip.title;

  return [
    {
      id: `doc-flight-${tripKey}`,
      tripId: tripKey,
      tripName: tripTitle,
      category: 'flight',
      title: `${trip.flightDetails.airline} ${trip.flightDetails.flightNumber} E-Ticket & Boarding Pass`,
      travelerName: 'Sarah Mehta & Guest',
      documentNumber: `PNR: ${trip.flightDetails.pnr}`,
      issueDate: 'Confirmed Today',
      expiryDate: trip.dates,
      status: 'confirmed',
      fileType: 'pdf',
      fileSize: '3.1 MB',
      uploadedAt: 'Today',
      verifiedBy: 'TripFlow Automated Airline Dispatch',
      offlineReady: true,
      fields: {
        'Route': trip.flightDetails.route,
        'Departure': trip.flightDetails.departureTime,
        'Seats': trip.flightDetails.seat,
        'Gate': `${trip.flightDetails.terminal} · ${trip.flightDetails.gate}`,
        'Baggage Allowance': trip.flightDetails.baggage,
      },
      notes: 'Digital boarding pass verified with live flight telemetry. Chauffeur pickup automatically aligned to landing time.',
    },
    {
      id: `doc-hotel-${tripKey}`,
      tripId: tripKey,
      tripName: tripTitle,
      category: 'hotel',
      title: `${trip.hotelCheckIn.hotelName} — Check-in Confirmation Voucher`,
      travelerName: 'Sarah Mehta',
      documentNumber: `Voucher #${trip.hotelCheckIn.voucherRef}`,
      issueDate: 'Confirmed Today',
      expiryDate: trip.dates,
      status: 'confirmed',
      fileType: 'pdf',
      fileSize: '2.2 MB',
      uploadedAt: 'Today',
      verifiedBy: 'Central Reservations Desk',
      offlineReady: true,
      fields: {
        'Room Category': trip.hotelCheckIn.roomType,
        'Check-In': `${trip.hotelCheckIn.checkInDate} · ${trip.hotelCheckIn.checkInTime}`,
        'Duration': `${trip.hotelCheckIn.nights} Nights`,
        'Inclusions': trip.hotelCheckIn.inclusions.join(', '),
        'Address': trip.hotelCheckIn.address,
      },
      notes: 'Present this digital voucher or QR code upon check-in. Luggage transfer handled by dedicated chauffeur.',
    },
    {
      id: `doc-car-${tripKey}`,
      tripId: tripKey,
      tripName: tripTitle,
      category: 'transit',
      title: `Private Chauffeur & Vehicle Manifest (${trip.carDetails.vehicleModel})`,
      travelerName: 'Sarah Mehta & Guest',
      documentNumber: `Fleet Auth #${trip.carDetails.licensePlate}`,
      issueDate: 'Issued Today',
      expiryDate: trip.dates,
      status: 'verified',
      fileType: 'pdf',
      fileSize: '1.4 MB',
      uploadedAt: 'Today',
      verifiedBy: 'TripFlow Fleet Command',
      offlineReady: true,
      fields: {
        'Assigned Chauffeur': `${trip.carDetails.chauffeurName} (${trip.carDetails.chauffeurPhone})`,
        'Vehicle Model': trip.carDetails.vehicleModel,
        'License Plate': trip.carDetails.licensePlate,
        'Rating': trip.carDetails.chauffeurRating,
        'Pickup Point': trip.carDetails.pickupLocation,
        'GPS Tracking': 'Active & Encrypted Radar Beacon',
      },
      notes: 'Dedicated chauffeur at your service across all itinerary transfers. Fuel, toll taxes, and parking fees fully covered.',
    },
    {
      id: `doc-insurance-${tripKey}`,
      tripId: tripKey,
      tripName: tripTitle,
      category: 'insurance',
      title: `Allianz Global Elite Travel Protection Policy (${trip.destination})`,
      travelerName: 'Sarah Mehta & Guest',
      documentNumber: `Policy #AZ-${trip.bookingRef}`,
      issueDate: 'Issued Today',
      expiryDate: trip.dates,
      status: 'verified',
      fileType: 'pdf',
      fileSize: '3.5 MB',
      uploadedAt: 'Today',
      verifiedBy: 'Allianz Global Assistance',
      offlineReady: true,
      fields: {
        'Emergency Medical': '₹50,00,000 INR (Zero Deductible)',
        'Trip Interruption / Delay': 'Full Reimbursement Guaranteed',
        'Baggage Protection': '₹1,50,000 INR',
        '24/7 SOS Line': '+91 124 434 5000',
      },
      notes: 'Comprehensive coverage for flight delays, medical emergencies, and travel cancellations.',
    },
  ];
}
