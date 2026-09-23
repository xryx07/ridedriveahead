import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Header } from '../components/Header';
import { MapMock } from '../components/MapMock';
import { BookingType, CarCategory, ChauffeurPackage, ServiceMode, TransmissionType } from '../types';
import { useRiderStore } from '../store/useRiderStore';

export const CHAUFFEUR_PACKAGES = [
  {
    id: 'HOURLY_2H' as ChauffeurPackage,
    name: '2 Hours Express',
    hoursIncluded: 2,
    baseFare: 299,
    overtimeRatePerHour: 99,
    description: 'Quick local visits, clinic, errands',
    tag: 'QUICK RUN'
  },
  {
    id: 'HOURLY_4H' as ChauffeurPackage,
    name: '4 Hours Half-Day',
    hoursIncluded: 4,
    baseFare: 549,
    overtimeRatePerHour: 99,
    description: 'Shopping, dining, city meetings',
    tag: 'POPULAR'
  },
  {
    id: 'HOURLY_8H' as ChauffeurPackage,
    name: '8 Hours Full-Day',
    hoursIncluded: 8,
    baseFare: 999,
    overtimeRatePerHour: 99,
    description: 'All-day office, client visits & errands',
    tag: 'FULL DAY'
  },
  {
    id: 'SPECIAL_EVENT' as ChauffeurPackage,
    name: 'Party & Wedding Chauffeur',
    hoursIncluded: 6,
    baseFare: 799,
    overtimeRatePerHour: 99,
    description: 'Evening party / wedding, zero DUI risk & safe return',
    tag: 'NIGHT SAFE'
  },
  {
    id: 'OUTSTATION_1DAY' as ChauffeurPackage,
    name: '1-Day Outstation Trip',
    hoursIncluded: 12,
    baseFare: 1499,
    overtimeRatePerHour: 120,
    description: 'Round-trip highway trip (Delhi to Agra / Neemrana)',
    tag: 'HIGHWAY PRO'
  },
  {
    id: 'OUTSTATION_2DAY' as ChauffeurPackage,
    name: '2-Day Weekend Road Trip',
    hoursIncluded: 24,
    baseFare: 2799,
    overtimeRatePerHour: 120,
    description: 'Weekend getaway round-trip (Jaipur, Chandigarh)',
    tag: '1-2 DAYS'
  }
];

export const HomeScreen: React.FC = () => {
  const {
    serviceMode,
    setServiceMode,
    chauffeurPackage,
    carTransmission,
    carCategory,
    carModelName,
    setChauffeurDetails,
    pickupAddress,
    dropAddress,
    bookingType,
    setBookingDraft,
    navigate,
    activeBooking
  } = useRiderStore();

  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(1);
  const [selectedHour, setSelectedHour] = useState<string>('05:00 AM');
  const [selectedCabCategory, setSelectedCabCategory] = useState<string>('AIRPORT');

  const cabCategories = [
    { id: 'AIRPORT', name: 'Airport', tag: 'ZERO SURGE' },
    { id: 'CAB', name: 'Daily Cab', tag: 'PREMIUM' },
    { id: 'AUTO', name: 'Auto Prime', tag: 'ECONOMY' },
    { id: 'BIKE', name: 'Express Bike', tag: 'FASTEST' },
    { id: 'OUTSTATION', name: 'Outstation Cab', tag: 'INTERCITY' }
  ];

  const timeSlots = ['04:30 AM', '05:00 AM', '05:30 AM', '06:00 AM', '07:00 AM', '08:30 PM'];

  const carPresets = [
    { name: 'Honda City', category: 'SEDAN' as CarCategory },
    { name: 'Hyundai Creta', category: 'SUV' as CarCategory },
    { name: 'Maruti Baleno', category: 'HATCHBACK' as CarCategory },
    { name: 'BMW 3 Series', category: 'LUXURY' as CarCategory }
  ];

  const currentPkg = CHAUFFEUR_PACKAGES.find((p) => p.id === chauffeurPackage) || CHAUFFEUR_PACKAGES[1];

  const handleProceedToFare = () => {
    if (bookingType === 'SCHEDULED') {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + selectedDayOffset);
      const isPm = selectedHour.includes('PM');
      const [h, m] = selectedHour.replace(/ AM| PM/, '').split(':');
      let hourNum = parseInt(h, 10);
      if (isPm && hourNum < 12) hourNum += 12;
      if (!isPm && hourNum === 12) hourNum = 0;
      scheduledDate.setHours(hourNum, parseInt(m, 10), 0, 0);
      setBookingDraft({ scheduledTime: scheduledDate });
    } else {
      setBookingDraft({ scheduledTime: null });
    }
    navigate('FARE_ESTIMATE');
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Booking Banner */}
        {activeBooking && (
          <TouchableOpacity
            style={styles.activeRideBanner}
            onPress={() => navigate('LIVE_TRACKING')}
          >
            <View style={styles.bannerLeft}>
              <Text style={styles.bannerTitle}>
                {activeBooking.serviceMode === 'HIRE_DRIVER'
                  ? 'Active Chauffeur Duty'
                  : activeBooking.bookingType === 'SCHEDULED'
                  ? 'Upcoming Scheduled Cab'
                  : 'Active Cab Ride'}
              </Text>
              <Text style={styles.bannerSubtitle} numberOfLines={1}>
                {activeBooking.serviceMode === 'HIRE_DRIVER'
                  ? `Chauffeur Assigned • OTP: ${activeBooking.otpCode} • Personal Car`
                  : activeBooking.bookingType === 'SCHEDULED'
                  ? `Scheduled for ${new Date(activeBooking.scheduledPickupTime || '').toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}`
                  : `Driver en route • OTP: ${activeBooking.otpCode}`}
              </Text>
            </View>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>View Details</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* PRIMARY SERVICE SWITCHER (Dual Platform) */}
        <View style={styles.serviceModeCard}>
          <Text style={styles.serviceModeHeader}>WHAT WOULD YOU LIKE TO BOOK?</Text>
          <View style={styles.serviceModeRow}>
            <TouchableOpacity
              style={[
                styles.serviceModeBtn,
                serviceMode === 'HIRE_DRIVER' && styles.serviceModeBtnActive
              ]}
              onPress={() => setServiceMode('HIRE_DRIVER')}
            >
              <View style={styles.serviceBadgeRow}>
                <Text
                  style={[
                    styles.serviceModeTitle,
                    serviceMode === 'HIRE_DRIVER' && styles.serviceModeTitleActive
                  ]}
                >
                  Hire a Driver
                </Text>
                <View
                  style={[
                    styles.chipBadge,
                    serviceMode === 'HIRE_DRIVER' ? styles.chipBadgeActive : styles.chipBadgeInactive
                  ]}
                >
                  <Text
                    style={[
                      styles.chipBadgeText,
                      serviceMode === 'HIRE_DRIVER' && styles.chipBadgeTextActive
                    ]}
                  >
                    FOR YOUR CAR
                  </Text>
                </View>
              </View>
              <Text style={styles.serviceModeSub}>Hourly gigs, events, 1-2 day road trips</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.serviceModeBtn,
                serviceMode === 'BOOK_CAB' && styles.serviceModeBtnActive
              ]}
              onPress={() => setServiceMode('BOOK_CAB')}
            >
              <View style={styles.serviceBadgeRow}>
                <Text
                  style={[
                    styles.serviceModeTitle,
                    serviceMode === 'BOOK_CAB' && styles.serviceModeTitleActive
                  ]}
                >
                  Book a Cab
                </Text>
                <View style={styles.chipBadgeInactive}>
                  <Text style={styles.chipBadgeText}>CAR + DRIVER</Text>
                </View>
              </View>
              <Text style={styles.serviceModeSub}>Instant city cabs & airport advance</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ====================================================== */}
        {/* MODE A: HIRE A DRIVER (DRIVE MY CAR)                   */}
        {/* ====================================================== */}
        {serviceMode === 'HIRE_DRIVER' ? (
          <View>
            {/* Chauffeur Assurance Strip */}
            <View style={styles.trustBanner}>
              <View style={styles.trustItem}>
                <Text style={styles.trustBadge}>VERIFIED</Text>
                <Text style={styles.trustTitle}>Background Checked</Text>
                <Text style={styles.trustDesc}>LMV & police verified pro</Text>
              </View>
              <View style={styles.trustDivider} />
              <View style={styles.trustItem}>
                <Text style={styles.trustBadge}>FLEXIBLE</Text>
                <Text style={styles.trustTitle}>Hourly to 2-Days</Text>
                <Text style={styles.trustDesc}>No taxi ownership needed</Text>
              </View>
              <View style={styles.trustDivider} />
              <View style={styles.trustItem}>
                <Text style={styles.trustBadge}>ZERO DUI</Text>
                <Text style={styles.trustTitle}>Safe Return</Text>
                <Text style={styles.trustDesc}>Relax & let pro drive</Text>
              </View>
            </View>

            {/* Chauffeur Packages List */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeading}>SELECT CHAUFFEUR PACKAGE</Text>
                <Text style={styles.sectionSubHeading}>Base hours + ₹99/extra hour</Text>
              </View>

              {CHAUFFEUR_PACKAGES.map((pkg) => {
                const isSelected = chauffeurPackage === pkg.id;
                return (
                  <TouchableOpacity
                    key={pkg.id}
                    style={[styles.packageCard, isSelected && styles.packageCardSelected]}
                    onPress={() => setChauffeurDetails({ pkg: pkg.id })}
                  >
                    <View style={styles.packageCardTop}>
                      <View style={{ flex: 1 }}>
                        <View style={styles.packageNameRow}>
                          <Text style={[styles.packageName, isSelected && styles.packageNameSelected]}>
                            {pkg.name}
                          </Text>
                          <View style={styles.packageTagBadge}>
                            <Text style={styles.packageTagText}>{pkg.tag}</Text>
                          </View>
                        </View>
                        <Text style={styles.packageDesc}>{pkg.description}</Text>
                      </View>
                      <View style={styles.packagePriceCol}>
                        <Text style={styles.packagePrice}>₹{pkg.baseFare}</Text>
                        <Text style={styles.packageHours}>{pkg.hoursIncluded} hrs duty</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Customer's Vehicle Details Card */}
            <View style={styles.cardBox}>
              <Text style={styles.cardBoxTitle}>YOUR VEHICLE DETAILS</Text>
              <Text style={styles.cardBoxSub}>
                We match a driver specifically certified for your car's transmission
              </Text>

              {/* Transmission Selector */}
              <Text style={styles.subLabel}>Car Transmission:</Text>
              <View style={styles.transmissionRow}>
                <TouchableOpacity
                  style={[
                    styles.transmissionBtn,
                    carTransmission === 'AUTOMATIC' && styles.transmissionBtnActive
                  ]}
                  onPress={() => setChauffeurDetails({ transmission: 'AUTOMATIC' })}
                >
                  <Text
                    style={[
                      styles.transmissionText,
                      carTransmission === 'AUTOMATIC' && styles.transmissionTextActive
                    ]}
                  >
                    Automatic (AT / CVT / DCT)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.transmissionBtn,
                    carTransmission === 'MANUAL' && styles.transmissionBtnActive
                  ]}
                  onPress={() => setChauffeurDetails({ transmission: 'MANUAL' })}
                >
                  <Text
                    style={[
                      styles.transmissionText,
                      carTransmission === 'MANUAL' && styles.transmissionTextActive
                    ]}
                  >
                    Manual (MT / Stick Shift)
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Car Presets */}
              <Text style={styles.subLabel}>Your Car Model:</Text>
              <View style={styles.presetGrid}>
                {carPresets.map((car) => (
                  <TouchableOpacity
                    key={car.name}
                    style={[
                      styles.presetChip,
                      carModelName === car.name && styles.presetChipActive
                    ]}
                    onPress={() =>
                      setChauffeurDetails({ carModel: car.name, category: car.category })
                    }
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        carModelName === car.name && styles.presetChipTextActive
                      ]}
                    >
                      {car.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.modelInput}
                value={carModelName}
                onChangeText={(text) => setChauffeurDetails({ carModel: text })}
                placeholder="Or type car model (e.g. Honda City 2022)"
                placeholderTextColor="#64748B"
              />
            </View>

            {/* Pickup Location Card */}
            <View style={styles.cardBox}>
              <Text style={styles.cardBoxTitle}>CHAUFFEUR REPORTING LOCATION</Text>
              <TextInput
                style={styles.modelInput}
                value={pickupAddress}
                onChangeText={(val) => setBookingDraft({ pickup: val })}
                placeholder="Enter your residence or office address"
                placeholderTextColor="#64748B"
              />
            </View>

            {/* Duty Price Summary & Proceed */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Package Duty ({currentPkg.hoursIncluded}h)</Text>
                <Text style={styles.summaryValue}>₹{currentPkg.baseFare}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Extra Duty Rate</Text>
                <Text style={styles.summaryNote}>₹{currentPkg.overtimeRatePerHour} / hour</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Night Allowance (10 PM - 6 AM)</Text>
                <Text style={styles.summaryNote}>₹150 (if applicable)</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryTotalRow}>
                <View>
                  <Text style={styles.totalTitle}>Total Base Payable</Text>
                  <Text style={styles.totalSub}>Auto-settled at duty completion</Text>
                </View>
                <Text style={styles.totalAmount}>₹{currentPkg.baseFare}</Text>
              </View>

              <TouchableOpacity style={styles.primaryCtaBtn} onPress={handleProceedToFare}>
                <Text style={styles.primaryCtaText}>Book Verified Chauffeur • ₹{currentPkg.baseFare}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* ====================================================== */
          /* MODE B: BOOK A CAB (CAR + DRIVER - OLA / UBER)         */
          /* ====================================================== */
          <View>
            <MapMock pickupAddress={pickupAddress} dropAddress={dropAddress} />

            {/* Cab Category Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {cabCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryCard, selectedCabCategory === cat.id && styles.categoryCardActive]}
                  onPress={() => setSelectedCabCategory(cat.id)}
                >
                  <Text style={[styles.categoryName, selectedCabCategory === cat.id && styles.categoryNameActive]}>
                    {cat.name}
                  </Text>
                  <Text style={[styles.categoryTag, selectedCabCategory === cat.id && styles.categoryTagActive]}>
                    {cat.tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Mode Selector */}
            <View style={styles.modeToggleContainer}>
              <TouchableOpacity
                style={[styles.modeButton, bookingType === 'INSTANT' && styles.modeButtonActive]}
                onPress={() => setBookingDraft({ type: 'INSTANT' })}
              >
                <Text style={[styles.modeTitle, bookingType === 'INSTANT' && styles.modeTextActive]}>
                  Ride Now
                </Text>
                <Text style={styles.modeSub}>Instant pickup</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeButton, bookingType === 'SCHEDULED' && styles.modeButtonActiveScheduled]}
                onPress={() => setBookingDraft({ type: 'SCHEDULED' })}
              >
                <View style={styles.badgeRow}>
                  <Text style={[styles.modeTitle, bookingType === 'SCHEDULED' && styles.modeTextActive]}>
                    Advance Scheduled
                  </Text>
                </View>
                <Text style={styles.modeSub}>Zero Surge Guaranteed</Text>
              </TouchableOpacity>
            </View>

            {/* Advance Picker Card */}
            {bookingType === 'SCHEDULED' && (
              <View style={styles.scheduledConfigCard}>
                <View style={styles.scheduledHeader}>
                  <Text style={styles.scheduledCardTitle}>Select Pickup Date & Time Slot</Text>
                  <Text style={styles.scheduledGuarantee}>Guaranteed Upfront Fare</Text>
                </View>

                <Text style={styles.sectionLabel}>Date:</Text>
                <View style={styles.dayRow}>
                  {[
                    { label: 'Today', offset: 0 },
                    { label: 'Tomorrow', offset: 1 },
                    { label: 'Day After', offset: 2 }
                  ].map((day) => (
                    <TouchableOpacity
                      key={day.offset}
                      style={[styles.dayPill, selectedDayOffset === day.offset && styles.dayPillActive]}
                      onPress={() => setSelectedDayOffset(day.offset)}
                    >
                      <Text style={[styles.dayPillText, selectedDayOffset === day.offset && styles.dayPillTextActive]}>
                        {day.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.sectionLabel}>Pickup Time Window:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeSlotScroll}>
                  {timeSlots.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[styles.timePill, selectedHour === time && styles.timePillActive]}
                      onPress={() => setSelectedHour(time)}
                    >
                      <Text style={[styles.timePillText, selectedHour === time && styles.timePillTextActive]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Location Inputs */}
            <View style={styles.locationCard}>
              <View style={styles.locationRow}>
                <View style={styles.pinCircleRed} />
                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationLabel}>PICKUP LOCATION</Text>
                  <TextInput
                    style={styles.locationInput}
                    value={pickupAddress}
                    onChangeText={(val) => setBookingDraft({ pickup: val })}
                    placeholder="Enter pickup address"
                    placeholderTextColor="#64748B"
                  />
                </View>
              </View>

              <View style={styles.dividerLine} />

              <View style={styles.locationRow}>
                <View style={styles.pinCircleGreen} />
                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationLabel}>DROP DESTINATION</Text>
                  <TextInput
                    style={styles.locationInput}
                    value={dropAddress}
                    onChangeText={(val) => setBookingDraft({ drop: val })}
                    placeholder="Where to? (e.g. Airport Terminal 3)"
                    placeholderTextColor="#64748B"
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.primaryCtaBtn} onPress={handleProceedToFare}>
              <Text style={styles.primaryCtaText}>
                {bookingType === 'SCHEDULED' ? 'Lock Upfront Fare & Schedule' : 'See Upfront Fare & Book Now'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  scrollArea: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 48
  },
  activeRideBanner: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  bannerLeft: {
    flex: 1,
    marginRight: 10
  },
  bannerTitle: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800'
  },
  bannerSubtitle: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2
  },
  bannerBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  bannerBadgeText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '700'
  },
  serviceModeCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  serviceModeHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 10
  },
  serviceModeRow: {
    flexDirection: 'row',
    gap: 10
  },
  serviceModeBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 12
  },
  serviceModeBtnActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2
  },
  serviceBadgeRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4
  },
  serviceModeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155'
  },
  serviceModeTitleActive: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A'
  },
  chipBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  chipBadgeActive: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  chipBadgeInactive: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  chipBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748B'
  },
  chipBadgeTextActive: {
    color: '#047857'
  },
  serviceModeSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 6
  },
  trustBanner: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  trustItem: {
    flex: 1,
    alignItems: 'center'
  },
  trustBadge: {
    fontSize: 8,
    fontWeight: '800',
    color: '#047857',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4
  },
  trustTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A'
  },
  trustDesc: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 1,
    textAlign: 'center'
  },
  trustDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 12
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3
  },
  sectionSubHeading: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '700'
  },
  packageCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8
  },
  packageCardSelected: {
    borderColor: '#0F172A',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2
  },
  packageCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  packageNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  packageName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155'
  },
  packageNameSelected: {
    color: '#0F172A',
    fontWeight: '800'
  },
  packageTagBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  packageTagText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#475569'
  },
  packageDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4
  },
  packagePriceCol: {
    alignItems: 'flex-end',
    marginLeft: 8
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#047857'
  },
  packageHours: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600'
  },
  cardBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  cardBoxTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3
  },
  cardBoxSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 10
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6
  },
  transmissionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  transmissionBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center'
  },
  transmissionBtnActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A'
  },
  transmissionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155'
  },
  transmissionTextActive: {
    color: '#FFFFFF'
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8
  },
  presetChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  presetChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB'
  },
  presetChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600'
  },
  presetChipTextActive: {
    color: '#1D4ED8',
    fontWeight: '800'
  },
  modelInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600'
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B'
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A'
  },
  summaryNote: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857'
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  totalTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A'
  },
  totalSub: {
    fontSize: 10,
    color: '#64748B'
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#047857'
  },
  primaryCtaBtn: {
    backgroundColor: '#047857',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center'
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },

  // Cab Specific Styles
  categoryScroll: {
    paddingHorizontal: 16,
    marginVertical: 10
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  categoryCardActive: {
    borderColor: '#0F172A',
    backgroundColor: '#FFFFFF'
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569'
  },
  categoryNameActive: {
    color: '#0F172A',
    fontWeight: '800'
  },
  categoryTag: {
    fontSize: 8,
    fontWeight: '800',
    color: '#059669',
    marginTop: 2
  },
  categoryTagActive: {
    color: '#047857'
  },
  modeToggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 10,
    gap: 8
  },
  modeButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  modeButtonActive: {
    borderColor: '#0F172A'
  },
  modeButtonActiveScheduled: {
    borderColor: '#059669'
  },
  modeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569'
  },
  modeTextActive: {
    color: '#0F172A',
    fontWeight: '800'
  },
  modeSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  scheduledConfigCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  scheduledHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  scheduledCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A'
  },
  scheduledGuarantee: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857'
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 6
  },
  dayRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10
  },
  dayPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center'
  },
  dayPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A'
  },
  dayPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569'
  },
  dayPillTextActive: {
    color: '#FFFFFF'
  },
  timeSlotScroll: {
    marginBottom: 6
  },
  timePill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 6
  },
  timePillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A'
  },
  timePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569'
  },
  timePillTextActive: {
    color: '#FFFFFF'
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  pinCircleRed: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB'
  },
  pinCircleGreen: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#059669'
  },
  locationTextContainer: {
    flex: 1
  },
  locationLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8'
  },
  locationInput: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
    paddingVertical: 2
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8
  }
});
