export type VaultCategory =
  | 'passport'
  | 'visa'
  | 'flight'
  | 'hotel'
  | 'insurance'
  | 'id'
  | 'activity'
  | 'transit'
  | 'permit'
  | 'emergency'
  | 'other';

export interface VaultDocument {
  id: string;
  tripId: string;
  tripName: string;
  category: VaultCategory;
  title: string;
  travelerName: string;
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  status: 'verified' | 'valid' | 'expiring-soon' | 'confirmed';
  fileType: 'pdf' | 'png' | 'jpg' | 'qr';
  fileSize: string;
  uploadedAt: string;
  notes?: string;
  verifiedBy?: string;
  offlineReady: boolean;
  fields?: Record<string, string>;
  downloadUrl?: string;
}

export interface EmergencyContact {
  id: string;
  role: string;
  name: string;
  phone: string;
  available: string;
  badge: string;
  location?: string;
  notes?: string;
}
