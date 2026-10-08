import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { CallChatModal } from '../components/CallChatModal';
import { useRiderStore } from '../store/useRiderStore';

type TripStage = 'ASSIGNED' | 'ON_THE_WAY' | 'ARRIVED' | 'TRIP_STARTED';

export const LiveTrackingScreen: React.FC = () => {
  const {
    activeBooking,
    cancelActiveBooking,
    completeActiveBooking,
    navigate
  } = useRiderStore();

  const [showCallChat, setShowCallChat] = useState(false);
  const [tripStage, setTripStage] = useState<TripStage>('ON_THE_WAY');
  const [elapsedSeconds, setElapsedSeconds] = useState(142);

  // Timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Safe fallback if activeBooking is not yet created
  const isChauffeur = activeBooking?.serviceMode === 'HIRE_DRIVER';
  const driverName = activeBooking?.driverName || 'Verified Captain';
  const driverRating = activeBooking?.driverRating || 4.90;
  const vehicleDetails = isChauffeur
    ? `${activeBooking?.carModel || 'Personal Car'} (${activeBooking?.carTransmission || 'Automatic AT'})`
    : activeBooking?.vehicleModel
    ? `${activeBooking.vehicleModel} • ${activeBooking.vehiclePlate || 'KA 01 AB 1234'}`
    : 'White Toyota Etios • KA 01 AB 1234';
  const otpCode = activeBooking?.otpCode || '4792';
  const fare = activeBooking?.fareAmount || (isChauffeur ? 1199 : 1248);
  const pickup = activeBooking?.pickupAddress || 'Koramangala, 6th Block, Bengaluru';
  const drop = activeBooking?.dropAddress || 'Kempegowda International Airport (BLR)';

  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAdvanceStage = () => {
    if (tripStage === 'ASSIGNED') setTripStage('ON_THE_WAY');
    else if (tripStage === 'ON_THE_WAY') setTripStage('ARRIVED');
    else if (tripStage === 'ARRIVED') setTripStage('TRIP_STARTED');
    else {
      completeActiveBooking();
      navigate('TRIP_SUMMARY');
    }
  };

  const handleCancel = () => {
    cancelActiveBooking('User cancelled trip');
    navigate('HOME');
  };

  const handleComplete = () => {
    completeActiveBooking();
    navigate('TRIP_SUMMARY');
  };

  return (
    <View style={styles.container}>
      {/* Top App Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigate('HOME')}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleCenter}>
          <Text style={styles.headerTitle}>
            {isChauffeur ? 'Personal Chauffeur Duty' : 'En Route to BLR Airport'}
          </Text>
          <View style={styles.headerLiveRow}>
            <View style={styles.liveGreenDot} />
            <Text style={styles.headerSubtitle}>
              {tripStage === 'ON_THE_WAY'
                ? 'Driver approaching pickup'
                : tripStage === 'ARRIVED'
                ? 'Driver arrived at location'
                : 'Trip in progress'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.shareTopBtn}
          onPress={() => alert('Live trip tracking link copied to clipboard.')}
          activeOpacity={0.8}
        >
          <Text style={styles.shareTopText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Full-width Stylized Live Map Canvas */}
        <View style={styles.mapSurface}>
          {/* Map Grid Roads */}
          <View style={styles.mapGridLines}>
            <View style={styles.gridRoadH1} />
            <View style={styles.gridRoadH2} />
            <View style={styles.gridRoadV1} />
            <View style={styles.gridRoadV2} />
            <View style={styles.routePolyline} />

            {/* Origin Pin */}
            <View style={styles.originMarker}>
              <View style={styles.originWave} />
              <View style={styles.originDot} />
            </View>

            {/* Destination Pin */}
            <View style={styles.destMarker}>
              <Text style={styles.destPinEmoji}>✈️</Text>
            </View>

            {/* Animated Car Marker */}
            <View
              style={[
                styles.movingCarMarker,
                tripStage === 'ARRIVED' && { left: 45, top: 120 },
                tripStage === 'TRIP_STARTED' && { left: 160, top: 75 }
              ]}
            >
              <View style={styles.carGlowRing} />
              <Text style={styles.carIcon}>🚕</Text>
            </View>
          </View>

          {/* Floating ETA Badge */}
          <View style={styles.floatingEtaPill}>
            <View style={styles.livePulseDot} />
            <Text style={styles.floatingEtaValue}>ETA 18 min</Text>
            <Text style={styles.floatingEtaDivider}>•</Text>
            <Text style={styles.floatingEtaDistance}>12.4 km remaining</Text>
          </View>

          {/* Simulation Stage Controller */}
          <TouchableOpacity
            style={styles.simStagePill}
            onPress={handleAdvanceStage}
            activeOpacity={0.85}
          >
            <Text style={styles.simStageText}>
              Simulate: {tripStage === 'ASSIGNED' ? 'On Way ➔' : tripStage === 'ON_THE_WAY' ? 'Arrived ➔' : tripStage === 'ARRIVED' ? 'Start Trip ➔' : 'Complete ➔'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Curved Bottom Sheet Card */}
        <View style={styles.bottomSheetCard}>
          {/* Sheet Handle */}
          <View style={styles.sheetHandle} />

          {/* Driver Profile Card */}
          <View style={styles.driverProfileRow}>
            <View style={styles.driverAvatarContainer}>
              <View style={styles.driverAvatar}>
                <Text style={styles.avatarInitials}>RK</Text>
              </View>
              <View style={styles.verifiedTickBadge}>
                <Text style={styles.verifiedTickText}>✓</Text>
              </View>
            </View>

            <View style={styles.driverInfoCol}>
              <View style={styles.driverNameRow}>
                <Text style={styles.driverNameText}>{driverName}</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ {driverRating}</Text>
                </View>
              </View>
              <Text style={styles.vehicleDetailsText}>{vehicleDetails}</Text>
              <Text style={styles.driverExpText}>
                {isChauffeur
                  ? 'Police Background Verified • AT/MT Expert'
                  : 'Commercial DL • 1,240 trips • 99% 5-star'}
              </Text>
            </View>

            <View style={styles.driverActionsCol}>
              <TouchableOpacity
                style={styles.driverActionBtn}
                onPress={() => setShowCallChat(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.driverActionIcon}>📞</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.driverActionBtn, styles.chatActionBtn]}
                onPress={() => setShowCallChat(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.driverActionIcon}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Ride Start OTP Card */}
          <View style={styles.otpCard}>
            <View style={styles.otpHeaderRow}>
              <View style={styles.otpLabelRow}>
                <Text style={styles.otpKeyIcon}>🔑</Text>
                <Text style={styles.otpTitle}>
                  {isChauffeur ? 'KEY HANDOVER VERIFICATION PIN' : 'RIDE START OTP'}
                </Text>
              </View>
              <View style={styles.otpShieldBadge}>
                <Text style={styles.otpShieldText}>INSURANCE ACTIVE</Text>
              </View>
            </View>

            <View style={styles.otpBoxesRow}>
              {otpCode.split('').map((digit, idx) => (
                <View key={idx} style={styles.otpBox}>
                  <Text style={styles.otpDigit}>{digit}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.otpInstruction}>
              {isChauffeur
                ? 'Share this PIN when handing over car keys to start the insured duty clock.'
                : 'Share this 4-digit code with the driver before boarding the cab.'}
            </Text>
          </View>

          {/* Trip Progress Stepper Bar */}
          <View style={styles.stepperContainer}>
            <View style={styles.stepperTrack}>
              <View
                style={[
                  styles.stepperFillBar,
                  tripStage === 'ASSIGNED' && { width: '15%' },
                  tripStage === 'ON_THE_WAY' && { width: '45%' },
                  tripStage === 'ARRIVED' && { width: '75%' },
                  tripStage === 'TRIP_STARTED' && { width: '100%' }
                ]}
              />
            </View>

            <View style={styles.stepperStepsRow}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepDot,
                    (tripStage === 'ASSIGNED' || tripStage === 'ON_THE_WAY' || tripStage === 'ARRIVED' || tripStage === 'TRIP_STARTED') && styles.stepDotActive
                  ]}
                />
                <Text style={styles.stepLabel}>Assigned</Text>
              </View>

              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepDot,
                    (tripStage === 'ON_THE_WAY' || tripStage === 'ARRIVED' || tripStage === 'TRIP_STARTED') && styles.stepDotActive
                  ]}
                />
                <Text style={styles.stepLabel}>On Way</Text>
              </View>

              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepDot,
                    (tripStage === 'ARRIVED' || tripStage === 'TRIP_STARTED') && styles.stepDotActive
                  ]}
                />
                <Text style={styles.stepLabel}>Arrived</Text>
              </View>

              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepDot,
                    tripStage === 'TRIP_STARTED' && styles.stepDotActive
                  ]}
                />
                <Text style={styles.stepLabel}>Trip Started</Text>
              </View>
            </View>
          </View>

          {/* Trip Stats Row */}
          <View style={styles.statsCard}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>ESTIMATED TIME</Text>
              <Text style={styles.statValue}>18 min</Text>
              <Text style={styles.statSub}>On schedule</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>DISTANCE</Text>
              <Text style={styles.statValue}>12.4 km</Text>
              <Text style={styles.statSub}>Fastest route</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>LOCKED FARE</Text>
              <Text style={[styles.statValue, { color: '#D2FF00' }]}>₹ {fare}</Text>
              <Text style={styles.statSub}>UPI AutoPay</Text>
            </View>
          </View>

          {/* Action CTAs */}
          <View style={styles.bottomActionsArea}>
            <TouchableOpacity
              style={styles.completeTripBtn}
              onPress={handleComplete}
              activeOpacity={0.88}
            >
              <Text style={styles.completeTripText}>Simulate Destination Arrival →</Text>
            </TouchableOpacity>

            <View style={styles.auxActionsRow}>
              <TouchableOpacity
                style={styles.shareActionBtn}
                onPress={() => alert('Live tracking link shared with emergency contacts.')}
                activeOpacity={0.85}
              >
                <Text style={styles.shareActionText}>↗ Share Live Trip</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelTripBtn}
                onPress={handleCancel}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelTripText}>Cancel Ride</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Call & Chat Modal Component */}
      <CallChatModal
        visible={showCallChat}
        onClose={() => setShowCallChat(false)}
        driverName={driverName}
        driverPhone="+91 98765 43210"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B'
  },
  topHeader: {
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
  headerTitleCenter: {
    alignItems: 'center'
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  headerLiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600'
  },
  shareTopBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  shareTopText: {
    color: '#D2FF00',
    fontSize: 11.5,
    fontWeight: '800'
  },

  scrollArea: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 20
  },

  /* Live Map Canvas */
  mapSurface: {
    height: 230,
    backgroundColor: '#101B39',
    position: 'relative',
    overflow: 'hidden'
  },
  mapGridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  gridRoadH1: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: '#16234D',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1F3068'
  },
  gridRoadH2: {
    position: 'absolute',
    top: 150,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: '#16234D',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1F3068'
  },
  gridRoadV1: {
    position: 'absolute',
    left: 80,
    top: 0,
    bottom: 0,
    width: 28,
    backgroundColor: '#16234D',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#1F3068'
  },
  gridRoadV2: {
    position: 'absolute',
    right: 90,
    top: 0,
    bottom: 0,
    width: 32,
    backgroundColor: '#16234D',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#1F3068'
  },
  routePolyline: {
    position: 'absolute',
    top: 70,
    left: 45,
    right: 70,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D2FF00',
    shadowColor: '#D2FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8
  },
  originMarker: {
    position: 'absolute',
    left: 40,
    top: 130,
    alignItems: 'center',
    justifyContent: 'center',
    width: 26,
    height: 26
  },
  originWave: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(210, 255, 0, 0.25)'
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D2FF00'
  },
  destMarker: {
    position: 'absolute',
    right: 65,
    top: 55
  },
  destPinEmoji: {
    fontSize: 24
  },
  movingCarMarker: {
    position: 'absolute',
    left: 110,
    top: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  carGlowRing: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(210, 255, 0, 0.35)'
  },
  carIcon: {
    fontSize: 20
  },
  floatingEtaPill: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 17, 40, 0.92)',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(210, 255, 0, 0.45)'
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D2FF00',
    marginRight: 8
  },
  floatingEtaValue: {
    color: '#D2FF00',
    fontSize: 12,
    fontWeight: '800'
  },
  floatingEtaDivider: {
    color: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 6,
    fontSize: 12
  },
  floatingEtaDistance: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '600'
  },
  simStagePill: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#1E293B',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  simStageText: {
    color: '#94A3B8',
    fontSize: 10.5,
    fontWeight: '700'
  },

  /* Curved Bottom Sheet */
  bottomSheetCard: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'center',
    marginBottom: 16
  },

  /* Driver Profile */
  driverProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131C38',
    borderRadius: 22,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  driverAvatarContainer: {
    position: 'relative',
    marginRight: 12
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D2FF00'
  },
  avatarInitials: {
    color: '#D2FF00',
    fontSize: 16,
    fontWeight: '900'
  },
  verifiedTickBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#131C38'
  },
  verifiedTickText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900'
  },
  driverInfoCol: {
    flex: 1
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  driverNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  ratingBadge: {
    backgroundColor: 'rgba(210, 255, 0, 0.15)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6
  },
  ratingText: {
    color: '#D2FF00',
    fontSize: 10.5,
    fontWeight: '800'
  },
  vehicleDetailsText: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '700',
    marginTop: 2
  },
  driverExpText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2
  },
  driverActionsCol: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8
  },
  driverActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  chatActionBtn: {
    backgroundColor: 'rgba(210, 255, 0, 0.12)',
    borderColor: 'rgba(210, 255, 0, 0.35)'
  },
  driverActionIcon: {
    fontSize: 16
  },

  /* Ride Start OTP Card */
  otpCard: {
    backgroundColor: '#131C38',
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(210, 255, 0, 0.4)'
  },
  otpHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  otpLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  otpKeyIcon: {
    fontSize: 14
  },
  otpTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D2FF00',
    letterSpacing: 0.6
  },
  otpShieldBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8
  },
  otpShieldText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#34D399'
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 4
  },
  otpBox: {
    width: 50,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#1A2548',
    borderWidth: 1.5,
    borderColor: '#D2FF00',
    alignItems: 'center',
    justifyContent: 'center'
  },
  otpDigit: {
    fontSize: 24,
    fontWeight: '900',
    color: '#D2FF00'
  },
  otpInstruction: {
    fontSize: 10.5,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8
  },

  /* Stepper */
  stepperContainer: {
    backgroundColor: '#131C38',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  stepperTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    position: 'relative',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 10
  },
  stepperFillBar: {
    height: '100%',
    backgroundColor: '#D2FF00',
    borderRadius: 2
  },
  stepperStepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4
  },
  stepItem: {
    alignItems: 'center'
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 4
  },
  stepDotActive: {
    backgroundColor: '#D2FF00'
  },
  stepLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700'
  },

  /* Stats Row */
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#131C38',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  statCol: {
    flex: 1,
    alignItems: 'center'
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
  },
  statLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.4
  },
  statValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 3
  },
  statSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1
  },

  /* CTAs */
  bottomActionsArea: {
    gap: 10
  },
  completeTripBtn: {
    backgroundColor: '#D2FF00',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#D2FF00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3
  },
  completeTripText: {
    color: '#0A1128',
    fontSize: 14,
    fontWeight: '900'
  },
  auxActionsRow: {
    flexDirection: 'row',
    gap: 10
  },
  shareActionBtn: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(210, 255, 0, 0.3)'
  },
  shareActionText: {
    color: '#D2FF00',
    fontSize: 12,
    fontWeight: '800'
  },
  cancelTripBtn: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  cancelTripText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700'
  }
});
