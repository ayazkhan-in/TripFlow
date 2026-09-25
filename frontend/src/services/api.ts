/**
 * TripFlow Backend API Client
 * Connects frontend React client with the Node/Express + Neon PostgreSQL backend.
 */

import { TripItinerary } from '../types/itinerary';
import { BookedTrip } from '../types/travel';
import { VaultDocument } from '../types/vault';
import { AIGenerateParams } from '../data/premadeItineraries';

const API_BASE = '/api/v1';

export class TripFlowApi {
  private static token: string | null = null;

  static setAuthToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('tripflow_jwt_token', token);
    } else {
      localStorage.removeItem('tripflow_jwt_token');
    }
  }

  static getAuthToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('tripflow_jwt_token');
    }
    return this.token;
  }

  private static getHeaders(contentType = 'application/json'): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'x-demo-user-id': 'user-sarah-1024',
    };
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // --------------------------------------------------------------------------
  // 1. DISCOVER & AI TRIP GENERATION
  // --------------------------------------------------------------------------

  static async getPremadeTrips(): Promise<TripItinerary[]> {
    try {
      const res = await fetch(`${API_BASE}/discover/premade`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.trips || [];
    } catch (err) {
      console.warn('API getPremadeTrips fallback to local data:', err);
      return [];
    }
  }

  static async generateAIItinerary(params: AIGenerateParams): Promise<TripItinerary | null> {
    try {
      const res = await fetch(`${API_BASE}/discover/ai-generate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.itinerary || null;
    } catch (err) {
      console.warn('API generateAIItinerary fallback to client generator:', err);
      return null;
    }
  }

  // --------------------------------------------------------------------------
  // 2. BOOKINGS & TRIP MODIFICATIONS
  // --------------------------------------------------------------------------

  static async checkoutBooking(itinerary: TripItinerary, totalPrice: number): Promise<BookedTrip | null> {
    try {
      const res = await fetch(`${API_BASE}/bookings/checkout`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ itinerary, totalPrice }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.bookedTrip || null;
    } catch (err) {
      console.warn('API checkoutBooking fallback:', err);
      return null;
    }
  }

  static async getMyTrips(): Promise<BookedTrip[]> {
    try {
      const res = await fetch(`${API_BASE}/bookings/my-trips`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.trips || [];
    } catch (err) {
      console.warn('API getMyTrips fallback:', err);
      return [];
    }
  }

  static async modifyTrip(
    bookedTripId: string,
    updatedItinerary: TripItinerary,
    newTotalPrice: number
  ): Promise<{ priceDelta: number; updatedBookedTrip: BookedTrip } | null> {
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookedTripId}/modify`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ updatedItinerary, newTotalPrice }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API modifyTrip fallback:', err);
      return null;
    }
  }

  // --------------------------------------------------------------------------
  // 3. TRAVEL VAULT & GEMINI OPTICAL SCANNER
  // --------------------------------------------------------------------------

  static async getVaultDocuments(tripId?: string, category?: string): Promise<VaultDocument[]> {
    try {
      const query = new URLSearchParams();
      if (tripId && tripId !== 'all') query.set('tripId', tripId);
      if (category && category !== 'all') query.set('category', category);

      const res = await fetch(`${API_BASE}/vault/documents?${query.toString()}`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.documents || [];
    } catch (err) {
      console.warn('API getVaultDocuments fallback:', err);
      return [];
    }
  }

  static async classifyDocumentAi(imageBase64: string, hint?: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/vault/classify-ai`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ imageBase64, hint }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API classifyDocumentAi fallback:', err);
      return null;
    }
  }

  static async uploadVaultDocument(docData: Partial<VaultDocument>): Promise<VaultDocument | null> {
    try {
      const res = await fetch(`${API_BASE}/vault/upload`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(docData),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.document || null;
    } catch (err) {
      console.warn('API uploadVaultDocument fallback:', err);
      return null;
    }
  }

  static async deleteVaultDocument(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/vault/documents/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return res.ok;
    } catch (err) {
      console.warn('API deleteVaultDocument error:', err);
      return false;
    }
  }

  // --------------------------------------------------------------------------
  // 4. OPERATOR COMMAND HUB & LIVE DISPATCH
  // --------------------------------------------------------------------------

  static async getOperatorStats(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/operator/stats`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.stats || null;
    } catch (err) {
      console.warn('API getOperatorStats fallback:', err);
      return null;
    }
  }

  static async getTourCohorts(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/operator/cohorts`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.cohorts || [];
    } catch (err) {
      console.warn('API getTourCohorts fallback:', err);
      return [];
    }
  }

  static async getTourGuides(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/operator/guides`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.guides || [];
    } catch (err) {
      console.warn('API getTourGuides fallback:', err);
      return [];
    }
  }

  static async getVendors(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/operator/vendors`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.vendors || [];
    } catch (err) {
      console.warn('API getVendors fallback:', err);
      return [];
    }
  }

  static async getDisruptionAlerts(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/operator/alerts`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.alerts || [];
    } catch (err) {
      console.warn('API getDisruptionAlerts fallback:', err);
      return [];
    }
  }

  static async resolveDisruptionAlert(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/operator/alerts/${id}/resolve`, {
        method: 'PUT',
        headers: this.getHeaders(),
      });
      return res.ok;
    } catch (err) {
      console.warn('API resolveDisruptionAlert fallback:', err);
      return false;
    }
  }
}

