export interface ServiceCategory {
  id: string;
  name: string;
  iconName: string; // Lucide or Material icon name
  description: string;
  startingPrice: number;
  badge?: string;
  imageUrl: string;
  isEmergency?: boolean;
  popularServices: string[];
}

export interface Review {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  serviceName: string;
  verifiedBooking?: boolean;
}

export interface Professional {
  id: string;
  name: string;
  title: string;
  category: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  startingPrice: number;
  isAvailable: boolean;
  isVerified: boolean;
  avatarUrl: string;
  location: string;
  lat?: number;
  lng?: number;
  experienceYears: number;
  completedJobs: number;
  phone: string;
  bio: string;
  topSkills: string[];
  recentReviews: Review[];
}

export interface Booking {
  id: string;
  serviceName: string;
  category: string;
  proId?: string;
  proName?: string;
  proAvatar?: string;
  date: string;
  timeSlot: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  notes?: string;
  status: 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  paymentMethod: 'cash' | 'upi' | 'card';
  createdAt: string;
  isEmergency?: boolean;
}

export interface AIDiagnosis {
  summary: string;
  recommendedCategory: string;
  urgencyLevel: string;
  estimatedCostRangeINR: string;
  estimatedTime: string;
  safetyAdvice: string[];
  possibleCauses: string[];
  recommendedPartsOrServices: string[];
}

export interface UpcomingService {
  id: string;
  title: string;
  category: string;
  launchDate: string;
  expectedStartingPrice: number;
  discountPercentage?: number;
  description: string;
  keyFeatures: string[];
  imageUrl: string;
  badge: string;
  interestedCount: number;
  isPreBookable: boolean;
}

export interface FilterOptions {
  category: string;
  minRating: number;
  priceRange: [number, number];
  availableOnly: boolean;
  searchQuery: string;
  city: string;
  sortBy: 'nearest' | 'rating' | 'price_low' | 'price_high';
}
