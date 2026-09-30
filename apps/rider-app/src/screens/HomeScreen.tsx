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
          <View style={styles.serviceModeHeaderRow}>
            <Text style={styles.serviceModeHeader}>SELECT MOBILITY SERVICE</Text>
            <View style={styles.guaranteeTag}>
              <Text style={styles.guaranteeTagText}>100% VERIFIED</Text>
            </View>
          </View>

          <View style={styles.serviceModeRow}>
            {/* Chauffeur Option */}
            <TouchableOpacity
              style={[
                styles.serviceModeBtn,
                serviceMode === 'HIRE_DRIVER' ? styles.serviceModeBtnActiveChauffeur : styles.serviceModeBtnInactive
              ]}
              onPress={() => setServiceMode('HIRE_DRIVER')}
              activeOpacity={0.85}
            >
              <View style={styles.serviceBadgeRow}>
                <View
                  style={[
                    styles.chipBadge,
                    serviceMode === 'HIRE_DRIVER' ? styles.chipBadgeChauffeurActive : styles.chipBadgeInactive
                  ]}
                >
                  <Text
                    style={[
                      styles.chipBadgeText,
                      serviceMode === 'HIRE_DRIVER' ? styles.chipBadgeTextChauffeurActive : styles.chipBadgeTextInactive
                    ]}
                  >
                    FOR YOUR CAR
                  </Text>
                </View>
                {serviceMode === 'HIRE_DRIVER' && (
                  <View style={styles.selectedPill}>
                    <Text style={styles.selectedPillText}>✓ ACTIVE</Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.serviceModeTitle,
                  serviceMode === 'HIRE_DRIVER' ? styles.serviceModeTitleActiveDark : styles.serviceModeTitleInactive
                ]}
              >
                Hire Chauffeur
              </Text>
              <Text
                style={[
                  styles.serviceModeSub,
                  serviceMode === 'HIRE_DRIVER' ? styles.serviceModeSubActiveDark : styles.serviceModeSubInactive
                ]}
              >
                Hourly duties, events & road trips
              </Text>
            </TouchableOpacity>

            {/* Cab Option */}
            <TouchableOpacity
              style={[
                styles.serviceModeBtn,
                serviceMode === 'BOOK_CAB' ? styles.serviceModeBtnActiveCab : styles.serviceModeBtnInactive
              ]}
              onPress={() => setServiceMode('BOOK_CAB')}
              activeOpacity={0.85}
            >
              <View style={styles.serviceBadgeRow}>
                <View
                  style={[
                    styles.chipBadge,
                    serviceMode === 'BOOK_CAB' ? styles.chipBadgeCabActive : styles.chipBadgeInactive
                  ]}
                >
                  <Text
                    style={[
                      styles.chipBadgeText,
                      serviceMode === 'BOOK_CAB' ? styles.chipBadgeTextCabActive : styles.chipBadgeTextInactive
                    ]}
                  >
                    CAR + DRIVER
                  </Text>
                </View>
                {serviceMode === 'BOOK_CAB' && (
                  <View style={styles.selectedPillCab}>
                    <Text style={styles.selectedPillTextCab}>✓ ACTIVE</Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.serviceModeTitle,
                  serviceMode === 'BOOK_CAB' ? styles.serviceModeTitleActiveDark : styles.serviceModeTitleInactive
                ]}
              >
                Book a Cab
              </Text>
              <Text
                style={[
                  styles.serviceModeSub,
                  serviceMode === 'BOOK_CAB' ? styles.serviceModeSubActiveDark : styles.serviceModeSubInactive
                ]}
              >
                Instant city cabs & airport advance
              </Text>
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
                <View style={styles.trustBadgeRow}>
                  <Text style={styles.trustDot}>●</Text>
                  <Text style={styles.trustBadge}>POLICE VERIFIED</Text>
                </View>
                <Text style={styles.trustTitle}>Background Checked</Text>
                <Text style={styles.trustDesc}>Commercial LMV verified</Text>
              </View>
              <View style={styles.trustDivider} />
              <View style={styles.trustItem}>
                <View style={styles.trustBadgeRow}>
                  <Text style={styles.trustDotGold}>●</Text>
                  <Text style={styles.trustBadgeGold}>AT & MT PRO</Text>
                </View>
                <Text style={styles.trustTitle}>Gearbox Certified</Text>
                <Text style={styles.trustDesc}>Matched to your car</Text>
              </View>
              <View style={styles.trustDivider} />
              <View style={styles.trustItem}>
                <View style={styles.trustBadgeRow}>
                  <Text style={styles.trustDot}>●</Text>
                  <Text style={styles.trustBadge}>ZERO DUI</Text>
                </View>
                <Text style={styles.trustTitle}>Night Safe Return</Text>
                <Text style={styles.trustDesc}>Relax in your car</Text>
              </View>
            </View>

            {/* Chauffeur Packages List */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <View>
                  <Text style={styles.sectionHeading}>CHAUFFEUR SERVICE TIERS</Text>
                  <Text style={styles.sectionSubHeading}>Fixed base hours • Extra duty ₹99/hr</Text>
                </View>
                <View style={styles.dutyAssurancePill}>
                  <Text style={styles.dutyAssuranceText}>INSURED DUTY</Text>
                </View>
              </View>

              {CHAUFFEUR_PACKAGES.map((pkg) => {
                const isSelected = chauffeurPackage === pkg.id;
                return (
                  <TouchableOpacity
                    key={pkg.id}
                    style={[styles.packageCard, isSelected ? styles.packageCardSelected : styles.packageCardUnselected]}
                    onPress={() => setChauffeurDetails({ pkg: pkg.id })}
                    activeOpacity={0.88}
                  >
                    {/* Left Accent Glow Line */}
                    <View style={[styles.packageAccentLine, isSelected && styles.packageAccentLineActive]} />

                    <View style={styles.packageCardBody}>
                      <View style={styles.packageCardTop}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                          <View style={styles.packageNameRow}>
                            <Text style={[styles.packageName, isSelected && styles.packageNameSelected]}>
                              {pkg.name}
                            </Text>
                            <View style={[styles.packageTagBadge, isSelected && styles.packageTagBadgeActive]}>
                              <Text style={[styles.packageTagText, isSelected && styles.packageTagTextActive]}>
                                {pkg.tag}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.packageDesc}>{pkg.description}</Text>
                        </View>

                        <View style={styles.packagePriceCol}>
                          <Text style={[styles.packagePrice, isSelected && styles.packagePriceSelected]}>
                            ₹{pkg.baseFare}
                          </Text>
                          <Text style={styles.packageHours}>{pkg.hoursIncluded} hrs duty</Text>
                        </View>
                      </View>

                      {/* Card Footer Breakdown */}
                      <View style={styles.packageCardFooter}>
                        <View style={styles.overtimeRatePill}>
                          <Text style={styles.overtimeRateText}>
                            Overtime: ₹{pkg.overtimeRatePerHour}/hr extra
                          </Text>
                        </View>

                        {isSelected ? (
                          <View style={styles.selectedDutyBadge}>
                            <Text style={styles.selectedDutyText}>✓ SELECTED TIER</Text>
                          </View>
                        ) : (
                          <Text style={styles.tapToSelectText}>Tap to select →</Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Customer's Vehicle Details Card */}
            <View style={styles.cardBox}>
              <View style={styles.cardBoxHeaderRow}>
                <View>
                  <Text style={styles.cardBoxTitle}>VEHICLE SPECIFICATIONS</Text>
                  <Text style={styles.cardBoxSub}>
                    We match a chauffeur certified for your exact gearbox
                  </Text>
                </View>
                <View style={styles.proMatchTag}>
                  <Text style={styles.proMatchText}>CERTIFIED MATCH</Text>
                </View>
              </View>

              {/* Transmission Selector */}
              <Text style={styles.subLabel}>TRANSMISSION TYPE</Text>
              <View style={styles.transmissionRow}>
                <TouchableOpacity
                  style={[
                    styles.transmissionBtn,
                    carTransmission === 'AUTOMATIC' ? styles.transmissionBtnActive : styles.transmissionBtnInactive
                  ]}
                  onPress={() => setChauffeurDetails({ transmission: 'AUTOMATIC' })}
                  activeOpacity={0.85}
                >
                  <View style={styles.transTopRow}>
                    <Text
                      style={[
                        styles.transmissionText,
                        carTransmission === 'AUTOMATIC' ? styles.transmissionTextActive : styles.transmissionTextInactive
                      ]}
                    >
                      AUTOMATIC (AT)
                    </Text>
                    {carTransmission === 'AUTOMATIC' && <Text style={styles.transCheckActive}>✓</Text>}
                  </View>
                  <Text
                    style={[
                      styles.transmissionDesc,
                      carTransmission === 'AUTOMATIC' ? styles.transmissionDescActive : styles.transmissionDescInactive
                    ]}
                  >
                    CVT / DCT / AT Specialist
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.transmissionBtn,
                    carTransmission === 'MANUAL' ? styles.transmissionBtnActive : styles.transmissionBtnInactive
                  ]}
                  onPress={() => setChauffeurDetails({ transmission: 'MANUAL' })}
                  activeOpacity={0.85}
                >
                  <View style={styles.transTopRow}>
                    <Text
                      style={[
                        styles.transmissionText,
                        carTransmission === 'MANUAL' ? styles.transmissionTextActive : styles.transmissionTextInactive
                      ]}
                    >
                      MANUAL (MT)
                    </Text>
                    {carTransmission === 'MANUAL' && <Text style={styles.transCheckActive}>✓</Text>}
                  </View>
                  <Text
                    style={[
                      styles.transmissionDesc,
                      carTransmission === 'MANUAL' ? styles.transmissionDescActive : styles.transmissionDescInactive
                    ]}
                  >
                    Stick Shift & Clutch Pro
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Car Presets */}
              <Text style={styles.subLabel}>YOUR VEHICLE MODEL</Text>
              <View style={styles.presetGrid}>
                {carPresets.map((car) => {
                  const isCarActive = carModelName === car.name;
                  return (
                    <TouchableOpacity
                      key={car.name}
                      style={[
                        styles.presetChip,
                        isCarActive ? styles.presetChipActive : styles.presetChipInactive
                      ]}
                      onPress={() =>
                        setChauffeurDetails({ carModel: car.name, category: car.category })
                      }
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.presetChipText,
                          isCarActive ? styles.presetChipTextActive : styles.presetChipTextInactive
                        ]}
                      >
                        {car.name}
                      </Text>
                      <Text
                        style={[
                          styles.presetChipCategory,
                          isCarActive ? styles.presetChipCatActive : styles.presetChipCatInactive
                        ]}
                      >
                        {car.category}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TextInput
                style={styles.modelInput}
                value={carModelName}
                onChangeText={(text) => setChauffeurDetails({ carModel: text })}
                placeholder="Or type car model (e.g. Honda City 2022 ZX)"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Pickup Location Card */}
            <View style={styles.cardBox}>
              <View style={styles.cardBoxHeaderRow}>
                <View>
                  <Text style={styles.cardBoxTitle}>CHAUFFEUR REPORTING LOCATION</Text>
                  <Text style={styles.cardBoxSub}>Driver arrives at your doorstep</Text>
                </View>
                <View style={styles.doorstepTag}>
                  <Text style={styles.doorstepTagText}>DOORSTEP</Text>
                </View>
              </View>

              <View style={styles.locationInputWrap}>
                <View style={styles.locationPinIndicator}>
                  <Text style={styles.pinSymbol}>●</Text>
                </View>
                <TextInput
                  style={styles.locationTextInput}
                  value={pickupAddress}
                  onChangeText={(val) => setBookingDraft({ pickup: val })}
                  placeholder="Enter residence, hotel or office reporting address"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Duty Price Summary & Proceed */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeaderRow}>
                <Text style={styles.summaryHeaderTitle}>DUTY FARE BREAKDOWN</Text>
                <View style={styles.transparentBadge}>
                  <Text style={styles.transparentBadgeText}>GUARANTEED UPFRONT</Text>
                </View>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Package Duty ({currentPkg.hoursIncluded}h)</Text>
                <Text style={styles.summaryValue}>₹{currentPkg.baseFare}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Extra Duty Rate</Text>
                <Text style={styles.summaryNote}>₹{currentPkg.overtimeRatePerHour} / extra hour</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Night Allowance (10 PM - 6 AM)</Text>
                <Text style={styles.summaryNote}>₹150 (if applicable)</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Key Handover Protection & OTP</Text>
                <Text style={[styles.summaryNote, { color: '#059669' }]}>Included Free</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryTotalRow}>
                <View>
                  <Text style={styles.totalTitle}>Total Base Payable</Text>
                  <Text style={styles.totalSub}>Auto-settled at duty completion</Text>
                </View>
                <Text style={styles.totalAmount}>₹{currentPkg.baseFare}</Text>
              </View>

              <TouchableOpacity
                style={styles.primaryCtaBtn}
                onPress={handleProceedToFare}
                activeOpacity={0.88}
              >
                <Text style={styles.primaryCtaText}>
                  Reserve Verified Chauffeur • ₹{currentPkg.baseFare} →
                </Text>
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
              {cabCategories.map((cat) => {
                const isCatActive = selectedCabCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryCard, isCatActive ? styles.categoryCardActive : styles.categoryCardInactive]}
                    onPress={() => setSelectedCabCategory(cat.id)}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.categoryName, isCatActive ? styles.categoryNameActive : styles.categoryNameInactive]}>
                      {cat.name}
                    </Text>
                    <Text style={[styles.categoryTag, isCatActive ? styles.categoryTagActive : styles.categoryTagInactive]}>
                      {cat.tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Mode Selector */}
            <View style={styles.modeToggleContainer}>
              <TouchableOpacity
                style={[styles.modeButton, bookingType === 'INSTANT' ? styles.modeButtonActive : styles.modeButtonInactive]}
                onPress={() => setBookingDraft({ type: 'INSTANT' })}
                activeOpacity={0.85}
              >
                <View style={styles.modeRowBetween}>
                  <Text style={[styles.modeTitle, bookingType === 'INSTANT' ? styles.modeTextActive : styles.modeTextInactive]}>
                    Ride Now
                  </Text>
                  {bookingType === 'INSTANT' && <Text style={styles.checkMini}>✓</Text>}
                </View>
                <Text style={[styles.modeSub, bookingType === 'INSTANT' ? styles.modeSubActive : styles.modeSubInactive]}>
                  Instant 3-5 min pickup
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeButton,
                  bookingType === 'SCHEDULED' ? styles.modeButtonActiveScheduled : styles.modeButtonInactive
                ]}
                onPress={() => setBookingDraft({ type: 'SCHEDULED' })}
                activeOpacity={0.85}
              >
                <View style={styles.modeRowBetween}>
                  <Text
                    style={[
                      styles.modeTitle,
                      bookingType === 'SCHEDULED' ? styles.modeTextActiveScheduled : styles.modeTextInactive
                    ]}
                  >
                    Advance Scheduled
                  </Text>
                  {bookingType === 'SCHEDULED' && <Text style={styles.checkMiniGreen}>✓</Text>}
                </View>
                <Text
                  style={[
                    styles.modeSub,
                    bookingType === 'SCHEDULED' ? styles.modeSubActiveScheduled : styles.modeSubInactive
                  ]}
                >
                  Zero Surge Guaranteed
                </Text>
              </TouchableOpacity>
            </View>

            {/* Advance Picker Card */}
            {bookingType === 'SCHEDULED' && (
              <View style={styles.scheduledConfigCard}>
                <View style={styles.scheduledHeader}>
                  <Text style={styles.scheduledCardTitle}>Select Pickup Date & Time Window</Text>
                  <View style={styles.scheduledGuaranteeBadge}>
                    <Text style={styles.scheduledGuarantee}>UPFRONT FIXED FARE</Text>
                  </View>
                </View>

                <Text style={styles.sectionLabel}>PICKUP DATE</Text>
                <View style={styles.dayRow}>
                  {[
                    { label: 'Today', offset: 0 },
                    { label: 'Tomorrow', offset: 1 },
                    { label: 'Day After', offset: 2 }
                  ].map((day) => {
                    const isDayActive = selectedDayOffset === day.offset;
                    return (
                      <TouchableOpacity
                        key={day.offset}
                        style={[styles.dayPill, isDayActive ? styles.dayPillActive : styles.dayPillInactive]}
                        onPress={() => setSelectedDayOffset(day.offset)}
                        activeOpacity={0.85}
                      >
                        <Text style={[styles.dayPillText, isDayActive ? styles.dayPillTextActive : styles.dayPillTextInactive]}>
                          {day.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.sectionLabel}>TIME WINDOW</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeSlotScroll}>
                  {timeSlots.map((time) => {
                    const isTimeActive = selectedHour === time;
                    return (
                      <TouchableOpacity
                        key={time}
                        style={[styles.timePill, isTimeActive ? styles.timePillActive : styles.timePillInactive]}
                        onPress={() => setSelectedHour(time)}
                        activeOpacity={0.85}
                      >
                        <Text style={[styles.timePillText, isTimeActive ? styles.timePillTextActive : styles.timePillTextInactive]}>
                          {time}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* Location Inputs */}
            <View style={styles.locationCard}>
              <View style={styles.locationRow}>
                <View style={styles.pinCircleBlue}>
                  <Text style={styles.pinTextDot}>●</Text>
                </View>
                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationLabel}>PICKUP LOCATION</Text>
                  <TextInput
                    style={styles.locationInput}
                    value={pickupAddress}
                    onChangeText={(val) => setBookingDraft({ pickup: val })}
                    placeholder="Enter pickup address"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              <View style={styles.dividerLine} />

              <View style={styles.locationRow}>
                <View style={styles.pinCircleGreen}>
                  <Text style={styles.pinTextDot}>●</Text>
                </View>
                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationLabel}>DROP DESTINATION</Text>
                  <TextInput
                    style={styles.locationInput}
                    value={dropAddress}
                    onChangeText={(val) => setBookingDraft({ drop: val })}
                    placeholder="Where to? (e.g. Airport Terminal 3)"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryCtaBtn}
              onPress={handleProceedToFare}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryCtaText}>
                {bookingType === 'SCHEDULED' ? 'Lock Upfront Fare & Schedule →' : 'See Upfront Fare & Book Now →'}
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
    backgroundColor: '#0F172A',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4
  },
  bannerLeft: {
    flex: 1,
    marginRight: 10
  },
  bannerTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  bannerSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2
  },
  bannerBadge: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  bannerBadgeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '800'
  },

  /* Service Mode Switcher */
  serviceModeCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  serviceModeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  serviceModeHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8
  },
  guaranteeTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#A7F3D0'
  },
  guaranteeTagText: {
    color: '#047857',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.3
  },
  serviceModeRow: {
    flexDirection: 'row',
    gap: 8
  },
  serviceModeBtn: {
    flex: 1,
    minWidth: 0,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5
  },
  serviceModeBtnInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0'
  },
  serviceModeBtnActiveChauffeur: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4
  },
  serviceModeBtnActiveCab: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4
  },
  serviceBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  chipBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 4
  },
  chipBadgeText: {
    fontSize: 8,
    fontWeight: '800'
  },
  chipBadgeInactive: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  chipBadgeTextInactive: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748B'
  },
  chipBadgeChauffeurActive: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A'
  },
  chipBadgeTextChauffeurActive: {
    fontSize: 8,
    fontWeight: '900',
    color: '#92400E'
  },
  chipBadgeCabActive: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  chipBadgeTextCabActive: {
    fontSize: 8,
    fontWeight: '900',
    color: '#047857'
  },
  selectedPill: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4
  },
  selectedPillText: {
    color: '#0F172A',
    fontSize: 8,
    fontWeight: '900'
  },
  selectedPillCab: {
    backgroundColor: '#10B981',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4
  },
  selectedPillTextCab: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900'
  },
  serviceModeTitle: {
    fontSize: 14,
    fontWeight: '800'
  },
  serviceModeTitleInactive: {
    color: '#334155'
  },
  serviceModeTitleActiveDark: {
    color: '#FFFFFF'
  },
  serviceModeSub: {
    fontSize: 10,
    marginTop: 4,
    lineHeight: 13
  },
  serviceModeSubInactive: {
    color: '#64748B'
  },
  serviceModeSubActiveDark: {
    color: '#CBD5E1'
  },

  /* Trust Banner */
  trustBanner: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  trustItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  trustBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 3
  },
  trustDot: {
    color: '#059669',
    fontSize: 7
  },
  trustDotGold: {
    color: '#D97706',
    fontSize: 7
  },
  trustBadge: {
    fontSize: 8,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.3
  },
  trustBadgeGold: {
    fontSize: 8,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.3
  },
  trustTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center'
  },
  trustDesc: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 1,
    textAlign: 'center',
    lineHeight: 12
  },
  trustDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 2
  },

  /* Chauffeur Packages */
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 12
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.6
  },
  sectionSubHeading: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '700',
    marginTop: 1
  },
  dutyAssurancePill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#A7F3D0'
  },
  dutyAssuranceText: {
    color: '#047857',
    fontSize: 8,
    fontWeight: '900'
  },
  packageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    overflow: 'hidden',
    flexDirection: 'row'
  },
  packageCardUnselected: {
    borderColor: '#E2E8F0'
  },
  packageCardSelected: {
    borderColor: '#0F172A',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  packageAccentLine: {
    width: 4,
    backgroundColor: 'transparent'
  },
  packageAccentLineActive: {
    backgroundColor: '#D4AF37'
  },
  packageCardBody: {
    flex: 1,
    padding: 14
  },
  packageCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  packageNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 3
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
  packageTagBadgeActive: {
    backgroundColor: '#FEF3C7'
  },
  packageTagText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#475569'
  },
  packageTagTextActive: {
    color: '#92400E',
    fontWeight: '900'
  },
  packageDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 14
  },
  packagePriceCol: {
    alignItems: 'flex-end',
    flexShrink: 0
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A'
  },
  packagePriceSelected: {
    color: '#047857'
  },
  packageHours: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700'
  },
  packageCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  overtimeRatePill: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6
  },
  overtimeRateText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#475569'
  },
  selectedDutyBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  selectedDutyText: {
    color: '#F8FAFC',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.3
  },
  tapToSelectText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700'
  },

  /* Vehicle Card */
  cardBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2
  },
  cardBoxHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  cardBoxTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5
  },
  cardBoxSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  proMatchTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#BFDBFE'
  },
  proMatchText: {
    color: '#1D4ED8',
    fontSize: 8,
    fontWeight: '900'
  },
  doorstepTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#A7F3D0'
  },
  doorstepTagText: {
    color: '#047857',
    fontSize: 8,
    fontWeight: '900'
  },
  subLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 6,
    letterSpacing: 0.4
  },
  transmissionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14
  },
  transmissionBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1.5
  },
  transmissionBtnInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0'
  },
  transmissionBtnActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3
  },
  transTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  transmissionText: {
    fontSize: 12,
    fontWeight: '800'
  },
  transmissionTextInactive: {
    color: '#334155'
  },
  transmissionTextActive: {
    color: '#FFFFFF'
  },
  transCheckActive: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '900'
  },
  transmissionDesc: {
    fontSize: 9,
    marginTop: 2
  },
  transmissionDescInactive: {
    color: '#64748B'
  },
  transmissionDescActive: {
    color: '#94A3B8'
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  presetChipInactive: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0'
  },
  presetChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A'
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '700'
  },
  presetChipTextInactive: {
    color: '#334155'
  },
  presetChipTextActive: {
    color: '#FFFFFF'
  },
  presetChipCategory: {
    fontSize: 8,
    fontWeight: '800',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3
  },
  presetChipCatInactive: {
    backgroundColor: '#E2E8F0',
    color: '#64748B'
  },
  presetChipCatActive: {
    backgroundColor: '#334155',
    color: '#F8FAFC'
  },
  modelInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600'
  },
  locationInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 10
  },
  locationPinIndicator: {
    marginRight: 6
  },
  pinSymbol: {
    color: '#059669',
    fontSize: 12
  },
  locationTextInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600'
  },

  /* Duty Summary Card */
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  summaryHeaderTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5
  },
  transparentBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#A7F3D0'
  },
  transparentBadgeText: {
    color: '#047857',
    fontSize: 8,
    fontWeight: '900'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500'
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
    marginVertical: 12
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  totalTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A'
  },
  totalSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#047857'
  },
  primaryCtaBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2
  },

  /* Cab Mode Styles */
  categoryScroll: {
    paddingHorizontal: 16,
    marginVertical: 12
  },
  categoryCard: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1.5
  },
  categoryCardInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0'
  },
  categoryCardActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A'
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '700'
  },
  categoryNameInactive: {
    color: '#475569'
  },
  categoryNameActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },
  categoryTag: {
    fontSize: 8,
    fontWeight: '900',
    marginTop: 2
  },
  categoryTagInactive: {
    color: '#059669'
  },
  categoryTagActive: {
    color: '#10B981'
  },
  modeToggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 8
  },
  modeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5
  },
  modeButtonInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0'
  },
  modeButtonActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A'
  },
  modeButtonActiveScheduled: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A'
  },
  modeRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  checkMini: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900'
  },
  checkMiniGreen: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '900'
  },
  modeTitle: {
    fontSize: 13,
    fontWeight: '800'
  },
  modeTextInactive: {
    color: '#475569'
  },
  modeTextActive: {
    color: '#FFFFFF'
  },
  modeTextActiveScheduled: {
    color: '#FFFFFF'
  },
  modeSub: {
    fontSize: 10,
    marginTop: 3
  },
  modeSubInactive: {
    color: '#64748B'
  },
  modeSubActive: {
    color: '#94A3B8'
  },
  modeSubActiveScheduled: {
    color: '#A7F3D0'
  },
  scheduledConfigCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  scheduledHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  scheduledCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A'
  },
  scheduledGuaranteeBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  scheduledGuarantee: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#047857'
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 0.4
  },
  dayRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  dayPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center'
  },
  dayPillInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0'
  },
  dayPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A'
  },
  dayPillText: {
    fontSize: 11,
    fontWeight: '700'
  },
  dayPillTextInactive: {
    color: '#475569'
  },
  dayPillTextActive: {
    color: '#FFFFFF'
  },
  timeSlotScroll: {
    marginBottom: 4
  },
  timePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    marginRight: 6
  },
  timePillInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0'
  },
  timePillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A'
  },
  timePillText: {
    fontSize: 11,
    fontWeight: '700'
  },
  timePillTextInactive: {
    color: '#475569'
  },
  timePillTextActive: {
    color: '#FFFFFF'
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  pinCircleBlue: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pinCircleGreen: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pinTextDot: {
    fontSize: 8,
    fontWeight: '900',
    color: '#059669'
  },
  locationTextContainer: {
    flex: 1
  },
  locationLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.4
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
    marginVertical: 10
  }
});
