import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { riderApi } from '../api/apiClient';
import {
  CarCategory,
  ChauffeurPackage,
  ChauffeurPackageTier,
  FareEstimate,
  PaymentMethod,
  ServiceMode,
  TransmissionType,
  VehicleTier
} from '../types';
import { useRiderStore } from '../store/useRiderStore';

export const CHAUFFEUR_PACKAGES: ChauffeurPackageTier[] = [
  {
    id: 'HOURLY_2H',
    name: '2 Hours Local Duty',
    hoursIncluded: 2,
    baseFare: 699,
    overtimeRatePerHour: 149,
    description: 'Quick city errands, doctor appointments, or shopping.',
    tag: 'Quick Run'
  },
  {
    id: 'HOURLY_4H',
    name: '4 Hours Half Day',
    hoursIncluded: 4,
    baseFare: 1199,
    overtimeRatePerHour: 149,
    description: 'Business meetings, client visits, or dining out.',
    tag: 'Most Popular'
  },
  {
    id: 'HOURLY_8H',
    name: '8 Hours Full Day',
    hoursIncluded: 8,
    baseFare: 2199,
    overtimeRatePerHour: 149,
    description: 'Full day city travel, multiple meetings, or family shopping.',
    tag: 'Best Value'
  },
  {
    id: 'SPECIAL_EVENT',
    name: 'Event / Wedding Chauffeur',
    hoursIncluded: 8,
    baseFare: 3499,
    overtimeRatePerHour: 199,
    description: 'Formal dressed elite chauffeur for weddings and luxury events.',
    tag: 'White Glove'
  },
  {
    id: 'OUTSTATION_1DAY',
    name: 'Outstation Road Trip (1 Day)',
    hoursIncluded: 14,
    baseFare: 2999,
    overtimeRatePerHour: 199,
    description: 'Highway certified driver for outstation trips and back.',
    tag: 'Highway Certified'
  },
  {
    id: 'OUTSTATION_2DAY',
    name: 'Outstation Road Trip (2 Days)',
    hoursIncluded: 28,
    baseFare: 4999,
    overtimeRatePerHour: 199,
    description: 'Multi-day outstation driver with overnight allowance included.',
    tag: 'Overnight Trip'
  }
];

export const FareEstimateScreen: React.FC = () => {
  const {
    serviceMode,
    chauffeurPackage,
    carTransmission,
    carCategory,
    carModelName,
    pickupAddress,
    dropAddress,
    bookingType,
    scheduledPickupTime,
    setServiceMode,
    setChauffeurDetails,
    setBookingDraft,
    setActiveBooking,
    navigate
  } = useRiderStore();

  const [localMode, setLocalMode] = useState<ServiceMode>(serviceMode || 'BOOK_CAB');
  const [loading, setLoading] = useState(false);
  const [selectedCabType, setSelectedCabType] = useState<'BIKE' | 'AUTO' | 'HATCHBACK' | 'SEDAN' | 'SUV' | 'RENTAL' | 'PARCEL' | 'LUXURY'>('SEDAN');
  const [selectedPkgId, setSelectedPkgId] = useState<ChauffeurPackage>(chauffeurPackage || 'HOURLY_4H');
  const [selectedTransmission, setSelectedTransmission] = useState<TransmissionType>(carTransmission || 'AUTOMATIC');
  const [selectedCarCategory, setSelectedCarCategory] = useState<CarCategory>(carCategory || 'SEDAN');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync mode changes to global store
  const handleModeSwitch = (mode: ServiceMode) => {
    setLocalMode(mode);
    setServiceMode(mode);
  };

  const selectedPkg = CHAUFFEUR_PACKAGES.find((p) => p.id === selectedPkgId) || CHAUFFEUR_PACKAGES[1];

  // Pricing definitions combining Rapido (Bike/Parcel), Ola (Auto/Rentals), Uber (Go/Premier/XL) & RDA (Chauffeur)
  const CAB_TIERS = [
    {
      id: 'BIKE' as const,
      icon: '🛵',
      name: 'Bike Taxi (Rapido Moto)',
      sub: 'Fastest commute through traffic • Helmet provided',
      fare: 49,
      seats: 1,
      eta: '2 min',
      tag: 'FASTEST ⚡',
      isPopular: false
    },
    {
      id: 'AUTO' as const,
      icon: '🛺',
      name: 'Auto Rickshaw (Ola / Rapido)',
      sub: 'Doorstep pickup, meter guaranteed, no haggling',
      fare: 89,
      seats: 3,
      eta: '3 min',
      tag: 'POPULAR 🛺',
      isPopular: false
    },
    {
      id: 'HATCHBACK' as const,
      icon: '🚕',
      name: 'Go Economy / Mini (Uber Go)',
      sub: 'WagonR, Swift • AC affordable everyday rides',
      fare: 189,
      seats: 4,
      eta: '4 min',
      tag: 'BEST VALUE',
      isPopular: false
    },
    {
      id: 'SEDAN' as const,
      icon: '🚘',
      name: 'Premier Sedan (Prime)',
      sub: 'Dzire, Honda City • Top-rated drivers & extra legroom',
      fare: 269,
      seats: 4,
      eta: '5 min',
      tag: 'UPFRONT LOCKED',
      isPopular: true
    },
    {
      id: 'SUV' as const,
      icon: '🚙',
      name: 'Executive SUV XL (Uber XL)',
      sub: 'Innova Crysta, Ertiga • 6 seater for airport luggage',
      fare: 399,
      seats: 6,
      eta: '6 min',
      tag: 'EXTRA ROOM',
      isPopular: false
    },
    {
      id: 'RENTAL' as const,
      icon: '⏱️',
      name: 'Hourly Rentals (Ola Style)',
      sub: 'Keep cab & driver: 2h/20km with multiple stops',
      fare: 449,
      seats: 4,
      eta: 'Instant',
      tag: 'MULTI-STOP',
      isPopular: false
    },
    {
      id: 'PARCEL' as const,
      icon: '📦',
      name: 'Express Parcel Delivery',
      sub: 'Doorstep instant package delivery across city (up to 5kg)',
      fare: 59,
      seats: 1,
      eta: '2 min',
      tag: 'DOORSTEP 📦',
      isPopular: false
    }
  ];

  const currentCabTier = CAB_TIERS.find((t) => t.id === selectedCabType) || CAB_TIERS[0];
  const finalPrice = localMode === 'BOOK_CAB' ? currentCabTier.fare : selectedPkg.baseFare;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      if (localMode === 'HIRE_DRIVER') {
        const newBooking = {
          id: 'CHAUFFEUR-' + Math.floor(1000 + Math.random() * 9000),
          riderId: 'rider-01',
          driverId: 'driver-01',
          driverName: 'Verified Captain',
          driverPhone: '+91 98111 00000',
          driverRating: 4.90,
          serviceMode: 'HIRE_DRIVER' as const,
          chauffeurPackage: selectedPkg.id,
          carTransmission: selectedTransmission,
          carCategory: selectedCarCategory,
          carModel: carModelName || 'Personal Vehicle',
          dutyHoursIncluded: selectedPkg.hoursIncluded,
          overtimeRatePerHour: selectedPkg.overtimeRatePerHour,
          bookingType: 'INSTANT' as const,
          status: 'ASSIGNED' as const,
          scheduledPickupTime: new Date().toISOString(),
          pickupAddress: pickupAddress || 'Current Location',
          dropAddress: dropAddress || 'Destination',
          pickupLat: 12.9352,
          pickupLng: 77.6245,
          dropLat: 13.1986,
          dropLng: 77.7066,
          vehicleType: 'SEDAN' as const,
          fareAmount: selectedPkg.baseFare,
          otpCode: String(Math.floor(1000 + Math.random() * 9000)),
          createdAt: new Date().toISOString()
        };
        setActiveBooking(newBooking as any);
        setChauffeurDetails({
          pkg: selectedPkg.id,
          transmission: selectedTransmission,
          category: selectedCarCategory
        });
        navigate('LIVE_TRACKING');
      } else {
        const newBooking = {
          id: 'CAB-' + Math.floor(1000 + Math.random() * 9000),
          riderId: 'rider-01',
          driverId: 'driver-02',
          driverName: 'Verified Captain',
          driverPhone: '+91 98000 00000',
          driverRating: 5.0,
          vehicleModel: 'Executive Sedan',
          vehiclePlate: 'DL 01 AB 0001',
          serviceMode: 'BOOK_CAB' as const,
          bookingType: 'INSTANT' as const,
          status: 'ASSIGNED' as const,
          scheduledPickupTime: new Date().toISOString(),
          pickupAddress: pickupAddress || 'Current Location',
          dropAddress: dropAddress || 'Destination',
          pickupLat: 12.9352,
          pickupLng: 77.6245,
          dropLat: 13.1986,
          dropLng: 77.7066,
          vehicleType: currentCabTier.id as any,
          fareAmount: currentCabTier.fare,
          otpCode: String(Math.floor(1000 + Math.random() * 9000)),
          createdAt: new Date().toISOString()
        };
        setActiveBooking(newBooking as any);
        navigate('LIVE_TRACKING');
      }
    } catch (e: any) {
      alert(e.message || 'Booking confirmation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top App Bar */}
      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigate('HOME')}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.navTitleCenter}>
          <Text style={styles.navTitle}>Trip Options</Text>
          <Text style={styles.navSubtitle}>
            {pickupAddress && dropAddress ? `${pickupAddress} ➔ ${dropAddress}` : 'Select Route & Options'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => alert('Upfront Fare Guarantee: The price shown is locked. No surge multipliers or unexpected post-trip spikes.')}
          activeOpacity={0.8}
        >
          <Text style={styles.helpButtonText}>ⓘ</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Simulated Map Surface */}
        <View style={styles.mapContainer}>
          {/* Map Grid Background Graphics */}
          <View style={styles.mapGridPattern}>
            <View style={styles.mapRoadH1} />
            <View style={styles.mapRoadH2} />
            <View style={styles.mapRoadV1} />
            <View style={styles.mapRoadV2} />
            {/* Curved Route Visual */}
            <View style={styles.routePathContainer}>
              <View style={styles.routePathCurve} />
            </View>
            {/* Origin Pin */}
            <View style={styles.originMarker}>
              <View style={styles.originPulseRing} />
              <View style={styles.originCoreDot} />
            </View>
            {/* Destination Pin */}
            <View style={styles.destinationMarker}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#EF4444' }} />
            </View>
            {/* Moving Cab Icon */}
            <View style={styles.movingCabMarker}>
              <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#C7FF3D' }} />
            </View>
          </View>

          {/* Floating ETA & Distance Chip */}
          <View style={styles.floatingEtaBadge}>
            <View style={styles.livePulseDot} />
            <Text style={styles.floatingEtaText}>Estimated Route</Text>
          </View>
        </View>

        {/* Floating Route Card */}
        <View style={styles.routeCard}>
          <View style={styles.routeTimelineCol}>
            <View style={styles.pickupDot} />
            <View style={styles.timelineDashedLine} />
            <View style={styles.dropSquare} />
          </View>
          <View style={styles.routeAddressesCol}>
            <View style={styles.addressBlock}>
              <Text style={styles.addressRoleLabel}>PICKUP LOCATION</Text>
              <Text style={styles.addressText} numberOfLines={1}>
                {pickupAddress || 'Current Location'}
              </Text>
            </View>
            <View style={styles.addressDivider} />
            <View style={styles.addressBlock}>
              <Text style={styles.addressRoleLabel}>DESTINATION</Text>
              <Text style={styles.addressText} numberOfLines={1}>
                {dropAddress || 'Enter destination'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.swapButton}
            onPress={() => alert('Addresses swapped')}
            activeOpacity={0.7}
          >
            <Text style={styles.swapButtonText}>⇅</Text>
          </TouchableOpacity>
        </View>

        {/* Dual Service Switcher Pill Tabs */}
        <View style={styles.dualServiceSwitcher}>
          <TouchableOpacity
            style={[
              styles.switchTab,
              localMode === 'BOOK_CAB' && styles.switchTabActiveCab
            ]}
            onPress={() => handleModeSwitch('BOOK_CAB')}
            activeOpacity={0.88}
          >
            <Text style={styles.switchTabIcon}>🚕</Text>
            <Text
              style={[
                styles.switchTabText,
                localMode === 'BOOK_CAB' && styles.switchTabTextActiveCab
              ]}
            >
              Book a Cab
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.switchTab,
              localMode === 'HIRE_DRIVER' && styles.switchTabActiveDriver
            ]}
            onPress={() => handleModeSwitch('HIRE_DRIVER')}
            activeOpacity={0.88}
          >
            <Text style={styles.switchTabIcon}>👨‍✈️</Text>
            <Text
              style={[
                styles.switchTabText,
                localMode === 'HIRE_DRIVER' && styles.switchTabTextActiveDriver
              ]}
            >
              Hire a Driver
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mode-specific content */}
        {localMode === 'BOOK_CAB' ? (
          /* ================================================= */
          /* BOOK A CAB: VEHICLE CATEGORIES                    */
          /* ================================================= */
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>SELECT CAB TIER</Text>
              <View style={styles.lockedBadge}>
                <Text style={styles.lockedBadgeText}>🔒 UPFRONT LOCKED FARE</Text>
              </View>
            </View>

            {CAB_TIERS.map((tier) => {
              const isSelected = selectedCabType === tier.id;
              return (
                <TouchableOpacity
                  key={tier.id}
                  style={[
                    styles.cabTierCard,
                    isSelected && styles.cabTierCardSelected
                  ]}
                  onPress={() => setSelectedCabType(tier.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.cabTierLeft}>
                    <View style={styles.cabTierIconCircle}>
                      <Text style={styles.cabCarEmoji}>{tier.icon}</Text>
                    </View>
                    <View style={styles.cabTierInfo}>
                      <View style={styles.cabTierTitleRow}>
                        <Text style={styles.cabTierName}>{tier.name}</Text>
                        <View style={styles.cabSeatsPill}>
                          <Text style={styles.cabSeatsText}>👤 {tier.seats}</Text>
                        </View>
                        {tier.isPopular && (
                          <View style={styles.popularBadge}>
                            <Text style={styles.popularBadgeText}>POPULAR</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.cabTierSub}>{tier.sub}</Text>
                      <Text style={styles.cabEtaText}>⚡ {tier.eta} away</Text>
                    </View>
                  </View>

                  <View style={styles.cabTierRight}>
                    <Text style={[styles.cabFare, isSelected && styles.cabFareSelected]}>
                      ₹ {tier.fare}
                    </Text>
                    {isSelected ? (
                      <View style={styles.selectedPill}>
                        <Text style={styles.selectedPillText}>✓ LOCKED</Text>
                      </View>
                    ) : (
                      <Text style={styles.selectText}>Select</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          /* ================================================= */
          /* HIRE A DRIVER: PACKAGES & CAR CONFIG              */
          /* ================================================= */
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>SELECT DRIVER PACKAGE</Text>
              <View style={styles.certifiedBadge}>
                <Text style={styles.certifiedBadgeText}>POLICE VERIFIED</Text>
              </View>
            </View>

            {/* Package Type Cards */}
            {CHAUFFEUR_PACKAGES.slice(0, 4).map((pkg) => {
              const isSelected = selectedPkgId === pkg.id;
              return (
                <TouchableOpacity
                  key={pkg.id}
                  style={[
                    styles.pkgCard,
                    isSelected && styles.pkgCardSelected
                  ]}
                  onPress={() => setSelectedPkgId(pkg.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.pkgTopRow}>
                    <View style={styles.pkgTitleWrap}>
                      <Text style={styles.pkgName}>{pkg.name}</Text>
                      <View style={styles.pkgTagPill}>
                        <Text style={styles.pkgTagText}>{pkg.tag}</Text>
                      </View>
                    </View>
                    <Text style={[styles.pkgFare, isSelected && styles.pkgFareSelected]}>
                      ₹ {pkg.baseFare}
                    </Text>
                  </View>
                  <Text style={styles.pkgDesc}>{pkg.description}</Text>
                  <View style={styles.pkgFooterRow}>
                    <Text style={styles.pkgDutyHours}>
                      ⏱️ {pkg.hoursIncluded} hours duty included
                    </Text>
                    <Text style={styles.pkgOvertime}>
                      +₹{pkg.overtimeRatePerHour}/hr extra
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Transmission Preference Selector */}
            <View style={styles.configBlock}>
              <Text style={styles.configLabel}>YOUR CAR TRANSMISSION</Text>
              <View style={styles.transmissionRow}>
                <TouchableOpacity
                  style={[
                    styles.transButton,
                    selectedTransmission === 'AUTOMATIC' && styles.transButtonActive
                  ]}
                  onPress={() => setSelectedTransmission('AUTOMATIC')}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.transButtonText,
                      selectedTransmission === 'AUTOMATIC' && styles.transButtonTextActive
                    ]}
                  >
                    ⚙️ Automatic (AT)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.transButton,
                    selectedTransmission === 'MANUAL' && styles.transButtonActive
                  ]}
                  onPress={() => setSelectedTransmission('MANUAL')}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.transButtonText,
                      selectedTransmission === 'MANUAL' && styles.transButtonTextActive
                    ]}
                  >
                    🕹️ Manual (MT)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Car Category Selector */}
            <View style={styles.configBlock}>
              <Text style={styles.configLabel}>VEHICLE CLASS</Text>
              <View style={styles.carCategoryRow}>
                {(['HATCHBACK', 'SEDAN', 'SUV', 'LUXURY'] as CarCategory[]).map((cat) => {
                  const isActive = selectedCarCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catPill,
                        isActive && styles.catPillActive
                      ]}
                      onPress={() => setSelectedCarCategory(cat)}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.catPillText,
                          isActive && styles.catPillTextActive
                        ]}
                      >
                        {cat === 'HATCHBACK'
                          ? 'Hatchback'
                          : cat === 'SEDAN'
                          ? 'Sedan'
                          : cat === 'SUV'
                          ? 'SUV'
                          : 'Luxury'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Handover & Trust Assurance */}
            <View style={styles.handoverBanner}>
              <Text style={styles.handoverShield}>🛡️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.handoverTitle}>3-Point Vehicle Handover Protection</Text>
                <Text style={styles.handoverSub}>
                  Fuel & odometer logged before duty starts. Comprehensive insurance cover on all personal car rides.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Payment Method Selector */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentHeading}>PAYMENT METHOD</Text>
          <View style={styles.paymentRow}>
            {(['UPI', 'CARD', 'CASH'] as PaymentMethod[]).map((method) => {
              const isSelected = paymentMethod === method;
              return (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.paymentChip,
                    isSelected && styles.paymentChipSelected
                  ]}
                  onPress={() => setPaymentMethod(method)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.paymentIcon}>
                    {method === 'UPI' ? '⚡' : method === 'CARD' ? '💳' : '💵'}
                  </Text>
                  <Text
                    style={[
                      styles.paymentText,
                      isSelected && styles.paymentTextSelected
                    ]}
                  >
                    {method === 'UPI' ? 'UPI AutoPay' : method === 'CARD' ? 'Card' : 'Cash'}
                  </Text>
                  {isSelected && <Text style={styles.paymentCheck}> ✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Fixed Bottom Booking Bar */}
      <View style={styles.fixedBottomBar}>
        <View style={styles.bottomFareSummary}>
          <Text style={styles.bottomFareLabel}>Total Fare (Locked)</Text>
          <Text style={styles.bottomFareValue}>₹ {finalPrice}</Text>
        </View>
        <TouchableOpacity
          style={[styles.continueCtaBtn, isSubmitting && { opacity: 0.7 }]}
          onPress={handleConfirm}
          disabled={isSubmitting}
          activeOpacity={0.88}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#0A1128" />
          ) : (
            <View style={styles.ctaContentRow}>
              <Text style={styles.continueCtaText}>
                {localMode === 'BOOK_CAB'
                  ? `Confirm Cab • ₹ ${finalPrice}`
                  : `Hire Driver • ₹ ${finalPrice}`}
              </Text>
              <Text style={styles.continueCtaArrow}>→</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B'
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 14,
    backgroundColor: '#0B132B'
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700'
  },
  navTitleCenter: {
    alignItems: 'center'
  },
  navTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },
  navSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  helpButtonText: {
    color: '#D2FF00',
    fontSize: 16,
    fontWeight: '700'
  },

  scrollArea: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20
  },

  /* Stylized Map Surface */
  mapContainer: {
    height: 180,
    borderRadius: 24,
    backgroundColor: '#131C38',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16
  },
  mapGridPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0F1A3A'
  },
  mapRoadH1: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: '#16234D',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1D2D63'
  },
  mapRoadH2: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: '#16234D',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1D2D63'
  },
  mapRoadV1: {
    position: 'absolute',
    left: 70,
    top: 0,
    bottom: 0,
    width: 22,
    backgroundColor: '#16234D',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#1D2D63'
  },
  mapRoadV2: {
    position: 'absolute',
    right: 80,
    top: 0,
    bottom: 0,
    width: 26,
    backgroundColor: '#16234D',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#1D2D63'
  },
  routePathContainer: {
    position: 'absolute',
    top: 40,
    left: 40,
    right: 50,
    bottom: 40,
    justifyContent: 'center'
  },
  routePathCurve: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D2FF00',
    shadowColor: '#D2FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6
  },
  originMarker: {
    position: 'absolute',
    left: 36,
    top: 80,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24
  },
  originPulseRing: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(210, 255, 0, 0.3)'
  },
  originCoreDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D2FF00'
  },
  destinationMarker: {
    position: 'absolute',
    right: 44,
    top: 72
  },
  destPinIcon: {
    fontSize: 22
  },
  movingCabMarker: {
    position: 'absolute',
    left: '52%',
    top: 70,
    backgroundColor: '#0A1128',
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D2FF00'
  },
  cabMarkerIcon: {
    fontSize: 16
  },
  floatingEtaBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 17, 40, 0.88)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(210, 255, 0, 0.4)'
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D2FF00',
    marginRight: 6
  },
  floatingEtaText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2
  },

  /* Floating Route Card */
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4
  },
  routeTimelineCol: {
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 4
  },
  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981'
  },
  timelineDashedLine: {
    width: 2,
    height: 24,
    backgroundColor: '#CBD5E1',
    marginVertical: 4
  },
  dropSquare: {
    width: 10,
    height: 10,
    backgroundColor: '#0F172A',
    borderRadius: 2
  },
  routeAddressesCol: {
    flex: 1
  },
  addressBlock: {
    paddingVertical: 2
  },
  addressRoleLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.4
  },
  addressText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1
  },
  addressDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 6
  },
  swapButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8
  },
  swapButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A'
  },

  /* Dual Service Switcher */
  dualServiceSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#131C38',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  switchTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8
  },
  switchTabActiveCab: {
    backgroundColor: '#D2FF00'
  },
  switchTabActiveDriver: {
    backgroundColor: '#FFFFFF'
  },
  switchTabIcon: {
    fontSize: 16
  },
  switchTabText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8'
  },
  switchTabTextActiveCab: {
    color: '#0A1128'
  },
  switchTabTextActiveDriver: {
    color: '#0A1128'
  },

  /* Section Styles */
  sectionContainer: {
    marginBottom: 16
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionHeading: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6
  },
  lockedBadge: {
    backgroundColor: 'rgba(210, 255, 0, 0.12)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(210, 255, 0, 0.3)'
  },
  lockedBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#D2FF00'
  },
  certifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)'
  },
  certifiedBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#34D399'
  },

  /* Cab Tier Cards */
  cabTierCard: {
    backgroundColor: '#131C38',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  cabTierCardSelected: {
    backgroundColor: '#19264D',
    borderColor: '#D2FF00'
  },
  cabTierLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  cabTierIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  cabCarEmoji: {
    fontSize: 22
  },
  cabTierInfo: {
    flex: 1
  },
  cabTierTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  cabTierName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  cabSeatsPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6
  },
  cabSeatsText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600'
  },
  popularBadge: {
    backgroundColor: 'rgba(210, 255, 0, 0.18)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6
  },
  popularBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#D2FF00'
  },
  cabTierSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2
  },
  cabEtaText: {
    fontSize: 10.5,
    color: '#34D399',
    fontWeight: '700',
    marginTop: 2
  },
  cabTierRight: {
    alignItems: 'flex-end',
    marginLeft: 10
  },
  cabFare: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  cabFareSelected: {
    color: '#D2FF00'
  },
  selectedPill: {
    marginTop: 4,
    backgroundColor: '#D2FF00',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12
  },
  selectedPillText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#0A1128'
  },
  selectText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600'
  },

  /* Chauffeur Package Cards */
  pkgCard: {
    backgroundColor: '#131C38',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  pkgCardSelected: {
    backgroundColor: '#19264D',
    borderColor: '#D2FF00'
  },
  pkgTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  pkgTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  pkgName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  pkgTagPill: {
    backgroundColor: 'rgba(210, 255, 0, 0.15)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6
  },
  pkgTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D2FF00'
  },
  pkgFare: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  pkgFareSelected: {
    color: '#D2FF00'
  },
  pkgDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 8
  },
  pkgFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 8
  },
  pkgDutyHours: {
    fontSize: 10.5,
    color: '#34D399',
    fontWeight: '700'
  },
  pkgOvertime: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '600'
  },

  /* Config Blocks for Driver */
  configBlock: {
    marginTop: 12
  },
  configLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 8,
    letterSpacing: 0.4
  },
  transmissionRow: {
    flexDirection: 'row',
    gap: 10
  },
  transButton: {
    flex: 1,
    backgroundColor: '#131C38',
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  transButtonActive: {
    backgroundColor: '#19264D',
    borderColor: '#D2FF00'
  },
  transButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8'
  },
  transButtonTextActive: {
    color: '#D2FF00',
    fontWeight: '800'
  },
  carCategoryRow: {
    flexDirection: 'row',
    gap: 8
  },
  catPill: {
    flex: 1,
    backgroundColor: '#131C38',
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  catPillActive: {
    backgroundColor: '#D2FF00',
    borderColor: '#D2FF00'
  },
  catPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8'
  },
  catPillTextActive: {
    color: '#0A1128',
    fontWeight: '800'
  },
  handoverBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)'
  },
  handoverShield: {
    fontSize: 22,
    marginRight: 10
  },
  handoverTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#34D399'
  },
  handoverSub: {
    fontSize: 10,
    color: '#A7F3D0',
    marginTop: 2
  },

  /* Payment Section */
  paymentSection: {
    marginTop: 8
  },
  paymentHeading: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 8,
    letterSpacing: 0.4
  },
  paymentRow: {
    flexDirection: 'row',
    gap: 8
  },
  paymentChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131C38',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  paymentChipSelected: {
    backgroundColor: '#19264D',
    borderColor: '#D2FF00'
  },
  paymentIcon: {
    fontSize: 14,
    marginRight: 6
  },
  paymentText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#94A3B8'
  },
  paymentTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  paymentCheck: {
    color: '#D2FF00',
    fontWeight: '900',
    fontSize: 12
  },

  /* Fixed Bottom Bar */
  fixedBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0A1128',
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10
  },
  bottomFareSummary: {
    flex: 1
  },
  bottomFareLabel: {
    fontSize: 10.5,
    color: '#94A3B8',
    fontWeight: '700'
  },
  bottomFareValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#D2FF00',
    marginTop: 1
  },
  continueCtaBtn: {
    backgroundColor: '#D2FF00',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 18,
    minWidth: 190,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D2FF00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4
  },
  ctaContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  continueCtaText: {
    color: '#0A1128',
    fontSize: 14,
    fontWeight: '900'
  },
  continueCtaArrow: {
    color: '#0A1128',
    fontSize: 16,
    fontWeight: '900'
  }
});
