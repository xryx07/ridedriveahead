export type ServiceMode =
  | 'HIRE_DRIVER'
  | 'BOOK_CAB'
  | 'BIKE_TAXI'
  | 'AUTO'
  | 'RENTALS'
  | 'RENT_BIKE'
  | 'RENT_CAR'
  | 'OUTSTATION'
  | 'AIRPORT'
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
  | 'OUTSTATION'
  | 'AIRPORT'
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

export type RentalMode = 'SELF_DRIVE' | 'WITH_DRIVER';
export type RentalPickupType = 'CUSTOMER_PICKUP' | 'DOORSTEP_DELIVERY';

export interface RentalListing {
  id: string;
  type: 'CAR' | 'BIKE';
  title: string;
  brand: string;
  model: string;
  year: number;
  transmission: 'AUTOMATIC' | 'MANUAL';
  fuel: 'PETROL' | 'DIESEL' | 'ELECTRIC';
  seats: number;
  rating: number;
  trips: number;
  dailyRateSelfDrive: number;
  dailyRateWithDriver?: number | null;
  securityDeposit: number;
  pickupType: 'CUSTOMER_PICKUP' | 'DOORSTEP_DELIVERY' | 'BOTH';
  ownerName: string;
  location: string;
  doorstepFee?: number;
  batteryRangeKm?: number;
  rules: string[];
  available: boolean;
}

export interface RentalBooking {
  id: string;
  listingId: string;
  vehicleTitle: string;
  rentalMode: RentalMode;
  deliveryOption: RentalPickupType;
  pickupLocation: string;
  deliveryAddress?: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyRate: number;
  doorstepFee: number;
  securityDeposit: number;
  totalAmount: number;
  status: 'CONFIRMED' | 'HANDOVER_IN_PROGRESS' | 'ACTIVE' | 'RETURNED' | 'COMPLETED' | 'CANCELLED';
  assignedDriver?: string;
}
