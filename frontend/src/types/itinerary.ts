export type ItineraryCategory = 'activity' | 'hotel' | 'transport' | 'meal' | 'experience';

export interface CatalogItem {
  id: string;
  title: string;
  category: ItineraryCategory;
  price: number;
  timeSlotDefault: string;
  duration: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  tags: string[];
}

export interface ItineraryItem {
  id: string;
  catalogId?: string;
  title: string;
  category: ItineraryCategory;
  price: number;
  time: string;
  duration?: string;
  location: string;
  description: string;
  image: string;
  rating?: number;
  reviewsCount?: number;
  tags?: string[];
  notes?: string;
  transitToNext?: {
    mode: 'walk' | 'car' | 'train' | 'flight';
    duration: string;
    distance?: string;
  };
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  date: string;
  title: string;
  subtitle: string;
  items: ItineraryItem[];
}

export interface RouteStop {
  id: string;
  city: string;
  weather?: string;
  hotel?: string;
  transitMode?: 'flight' | 'train' | 'car';
}

export interface TripItinerary {
  id: string;
  title: string;
  destination: string;
  country: string;
  dates: string;
  startDate: string;
  travelers: number;
  currency: string;
  heroImage?: string;
  routeStops?: RouteStop[];
  days: ItineraryDay[];
}

export interface PriceBreakdown {
  total: number;
  perPerson: number;
  byCategory: Record<ItineraryCategory, number>;
  itemCount: number;
  hotelNights: number;
}
