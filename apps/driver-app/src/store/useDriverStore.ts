import { create } from 'zustand';
import { DriverProfile, EarningsData, KycDocItem, ScheduledRide } from '../types';
import { initialScheduledPool, mockDriver, sampleEarnings, sampleKycDocs } from '../api/apiClient';

export type DriverScreenName =
  | 'LOGIN'
  | 'HOME'
  | 'KYC_UPLOAD'
  | 'SCHEDULED_RIDES'
  | 'ACTIVE_TRIP'
  | 'EARNINGS'
  | 'TRIP_HISTORY'
  | 'PROFILE';

interface DriverState {
  driver: DriverProfile;
  isAuthenticated: boolean;
  currentScreen: DriverScreenName;
  kycDocs: KycDocItem[];
  scheduledRides: ScheduledRide[];
  earnings: EarningsData;
  activeTrip: ScheduledRide | null;
  activeTripStatus: 'EN_ROUTE_PICKUP' | 'ARRIVED_PICKUP' | 'IN_PROGRESS' | 'COMPLETED';

  // Actions
  login: (driver: DriverProfile) => void;
  signup: (driver: DriverProfile) => void;
  logout: () => void;
  navigate: (screen: DriverScreenName) => void;
  toggleOnline: () => void;
  claimRide: (id: string) => void;
  startActiveTrip: (ride: ScheduledRide) => void;
  updateTripStatus: (status: 'EN_ROUTE_PICKUP' | 'ARRIVED_PICKUP' | 'IN_PROGRESS' | 'COMPLETED') => void;
  completeTrip: () => void;
  addKycDoc: (doc: KycDocItem) => void;
}

export const useDriverStore = create<DriverState>((set) => ({
  driver: mockDriver,
  isAuthenticated: true,
  currentScreen: 'HOME',
  kycDocs: sampleKycDocs,
  scheduledRides: initialScheduledPool,
  earnings: sampleEarnings,
  activeTrip: null,
  activeTripStatus: 'COMPLETED',

  login: (driver) => set({ driver, isAuthenticated: true, currentScreen: 'HOME' }),
  signup: (driver) => set({ driver, isAuthenticated: true, currentScreen: 'HOME' }),
  logout: () => set({ isAuthenticated: false, currentScreen: 'LOGIN' }),

  navigate: (screen) => set({ currentScreen: screen }),

  toggleOnline: () =>
    set((state) => ({
      driver: {
        ...state.driver,
        isOnline: !state.driver.isOnline
      }
    })),

  claimRide: (id) =>
    set((state) => ({
      scheduledRides: state.scheduledRides.map((r) =>
        r.id === id ? { ...r, isClaimed: true } : r
      )
    })),

  startActiveTrip: (ride) =>
    set({
      activeTrip: ride,
      activeTripStatus: 'EN_ROUTE_PICKUP',
      currentScreen: 'ACTIVE_TRIP'
    }),

  updateTripStatus: (status) => set({ activeTripStatus: status }),

  completeTrip: () =>
    set((state) => ({
      activeTripStatus: 'COMPLETED',
      earnings: {
        ...state.earnings,
        todayEarnings: state.earnings.todayEarnings + 750,
        todayCompletedTrips: state.earnings.todayCompletedTrips + 1,
        scheduledTripsCompleted: state.earnings.scheduledTripsCompleted + 1
      },
      currentScreen: 'EARNINGS'
    })),

  addKycDoc: (doc) =>
    set((state) => ({
      kycDocs: [...state.kycDocs.filter((d) => d.type !== doc.type), doc]
    }))
}));
