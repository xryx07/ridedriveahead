export type KycDocType = 'AADHAAR' | 'PAN' | 'DRIVING_LICENSE' | 'VEHICLE_REGISTRATION';
export type KycStatus = 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export type DriverRole = 'CHAUFFEUR_ONLY' | 'CAB_DRIVER' | 'ALL_ROUNDER';
export type TransmissionSkill = 'MANUAL' | 'AUTOMATIC' | 'LUXURY';

export type GigDutyType =
  | 'HOURLY_CHAUFFEUR'
  | 'EVENT_CHAUFFEUR'
  | 'OUTSTATION_1DAY'
  | 'OUTSTATION_2DAY'
  | 'AIRPORT_CAB'
  | 'CITY_CAB';

export interface KycDocItem {
  type: KycDocType;
  title: string;
  maskedNumber?: string;
  status: KycStatus;
  rejectionReason?: string;
  uploadedAt?: string;
}

export interface DriverProfile {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  role: DriverRole;
  transmissionSkills: TransmissionSkill[];
  vehicleModel: string;
  vehiclePlate: string;
  vehicleType: 'HATCHBACK' | 'SEDAN' | 'SUV' | 'PREMIER';
  isOnline: boolean;
  rating: number;
  totalTrips: number;
  kycStatus: KycStatus;
  drivingHoursToday: number;
  lastRestTime?: string;
}

export interface ScheduledRide {
  id: string;
  gigType?: GigDutyType;
  riderName: string;
  riderPhone: string;
  pickupAddress: string;
  dropAddress: string;
  scheduledPickupTime: string;
  fareAmount: number;
  durationHours?: number;
  overtimeRatePerHour?: number;
  carModel?: string;
  transmissionRequired?: TransmissionSkill;
  flightNumber?: string;
  riderNotes?: string;
  distanceKm: number;
  isClaimed: boolean;
}

export interface EarningsData {
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  todayCompletedTrips: number;
  scheduledTripsCompleted: number;
  incentivesEarned: number;
  pendingPayoutAmount: number;
}
