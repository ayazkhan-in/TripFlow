import { CatalogItem, ItineraryItem } from '../types/itinerary';

export type DragPayload =
  | { type: 'catalog-item'; item: CatalogItem }
  | { type: 'itinerary-item'; itemId: string; fromDayNumber: number; item?: ItineraryItem };

let currentDragPayload: DragPayload | null = null;

export const setDragPayload = (payload: DragPayload | null) => {
  currentDragPayload = payload;
};

export const getDragPayload = (): DragPayload | null => {
  return currentDragPayload;
};

export const clearDragPayload = () => {
  currentDragPayload = null;
};
