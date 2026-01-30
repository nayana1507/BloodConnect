import { BloodType } from './bloodCompatibility';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  bloodType: BloodType;
  role: 'donor' | 'recipient' | 'admin';
  college: string;
  year: string;
  profilePhotoUrl?: string;
  medicalHistory?: string;
  lastDonationDate?: string;
  totalDonations: number;
  isAvailable: boolean;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BloodRequest {
  id: string;
  recipientId: string;
  bloodType: BloodType;
  quantity: number; // in units
  urgency: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
  requiredDate: string;
  status: 'open' | 'matched' | 'completed' | 'cancelled';
  matchedDonors: string[]; // array of donor user IDs
  createdAt: string;
  updatedAt: string;
}

export interface DonationRecord {
  id: string;
  donorId: string;
  recipientId?: string;
  bloodType: BloodType;
  quantity: number;
  donationDate: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  location: string;
  notes?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'match' | 'request' | 'donation' | 'message' | 'system';
  title: string;
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalDonors: number;
  totalRecipients: number;
  totalDonations: number;
  totalBloodRequests: number;
  bloodTypeInventory: Record<BloodType, number>;
  successRate: number;
}
