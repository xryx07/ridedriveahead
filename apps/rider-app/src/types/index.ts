export type ServiceMode =
  | 'HIRE_DRIVER'
  | 'BOOK_CAB'
  | 'BIKE_TAXI'
  | 'AUTO'
  | 'RENTALS'
  | 'PARCEL';

export type BookingType = 'INSTANT' | 'SCHEDULED';

export type ChauffeurPackage =
  | 'HOURLY_2H'
  | 'HOURLY_4H'
  | 'HOURLY_8H'
  | 'SPECIAL_EVENT'
  | 'OUTSTATION_1DAY'
  | 'OUTSTATION_2DAY';

export type TransmissionType = 'MANUAL' | 'AUTOMATIC';

export type CarCategory = 'HATCHBACK' | 'SEDAN' | 'SUV' | 'LUXURY';

export interface ChauffeurPackageTier {
  id: ChauffeurPackage;
  name: string;
  hoursIncluded: number;
  baseFare: number;
  overtimeRatePerHour: number;
  description: string;
  tag: string;
}

export type BookingStatus =
  | 'DRAFT'
  | 'SCHEDULED_CONFIRMED'
  | 'ASSIGNED'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type VehicleType =
  | 'BIKE'
  | 'AUTO'
  | 'HATCHBACK'
  | 'SEDAN'
  | 'SUV'
  | 'PREMIER'
  | 'RENTAL'
  | 'PARCEL';

export type PaymentMethod = 'UPI' | 'CARD' | 'WALLET' | 'CASH';

export interface UserProfile {
  id: string;
  phoneNumber: string;
  fullName: string;
  email?: string;
  role: 'RIDER' | 'DRIVER' | 'ADMIN';
  rating: number;
}

export interface VehicleTier {
  vehicleType: VehicleType;
  tierName: string;
  description: string;
  capacity: number;
  baseFare: number;
  distanceFare: number;
  advanceReservationFee: number;
  totalFare: number;
  currency: string;
  etaMinutes: number;
}

export interface FareEstimate {
  distanceKm: number;
  estimatedDurationMin: number;
  bookingType: BookingType;
  scheduledPickupTime?: string;
  tiers: VehicleTier[];
}

export interface Booking {
  id: string;
  riderId: string;
  driverId?: string;
  serviceMode?: ServiceMode;
  chauffeurPackage?: ChauffeurPackage;
  carTransmission?: TransmissionType;
  carCategory?: CarCategory;
  carModel?: string;
  dutyHoursIncluded?: number;
  overtimeRatePerHour?: number;
  bookingType: BookingType;
  status: BookingStatus;
  scheduledPickupTime?: string;
  pickupAddress: string;
  dropAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropLat: number;
  dropLng: number;
  vehicleType: VehicleType;
  fareAmount: number;
  otpCode: string;
  driverName?: string;
  driverPhone?: string;
  driverRating?: number;
  vehicleModel?: string;
  vehiclePlate?: string;
  flightNumber?: string;
  riderNotes?: string;
  cancellationReason?: string;
  createdAt: string;
}
