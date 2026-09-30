import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CallChatModal } from '../components/CallChatModal';
import { Header } from '../components/Header';
import { MapMock } from '../components/MapMock';
import { useRiderStore } from '../store/useRiderStore';

export const LiveTrackingScreen: React.FC = () => {
  const { activeBooking, cancelActiveBooking, completeActiveBooking, navigate } = useRiderStore();
  const [showCallChat, setShowCallChat] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(activeBooking?.serviceMode === 'HIRE_DRIVER' ? 8325 : 0);
  const [dutyStatus, setDutyStatus] = useState<'ASSIGNED' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED'>('IN_PROGRESS');

  useEffect(() => {
    let interval: any = null;
    if (activeBooking?.serviceMode === 'HIRE_DRIVER' && dutyStatus === 'IN_PROGRESS') {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dutyStatus, activeBooking]);

  if (!activeBooking) {
    return (
      <View style={styles.container}>
        <Header title="Active Ride" showBack backTo="HOME" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Active Booking</Text>
          <Text style={styles.emptySub}>You do not currently have a ride or chauffeur duty in progress.</Text>
          <TouchableOpacity style={styles.bookRideBtn} onPress={() => navigate('HOME')}>
            <Text style={styles.bookRideBtnText}>Book Chauffeur or Cab</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isChauffeur = activeBooking.serviceMode === 'HIRE_DRIVER';

  const formatElapsed = (sec: number) => {
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleCancel = () => {
    if (confirm('Do you wish to cancel this booking?')) {
      cancelActiveBooking('User cancelled');
    }
  };

  const handleComplete = () => {
    completeActiveBooking();
  };

  return (
    <View style={styles.container}>
      <Header
        title={isChauffeur ? 'Live Chauffeur Duty' : 'Live Cab Tracking'}
        showBack
        backTo="HOME"
      />

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isChauffeur ? (
          /* ================================================= */
          /* CHAUFFEUR LIVE DUTY HUD                           */
          /* ================================================= */
          <View>
            {/* Live Duty Clock Banner */}
            <View style={styles.dutyTimerCard}>
              <View style={styles.timerHeader}>
                <View style={styles.pulseDot} />
                <Text style={styles.timerLabel}>LIVE DUTY CLOCK RUNNING</Text>
                <View style={styles.activeDutyBadge}>
                  <Text style={styles.activeDutyBadgeText}>INSURED TRIP</Text>
                </View>
              </View>
              <Text style={styles.timerDigits}>{formatElapsed(elapsedSeconds)}</Text>
              <View style={styles.timerSubRow}>
                <Text style={styles.timerSubText}>
                  Package: {activeBooking.dutyHoursIncluded || 4} Hours Duty
                </Text>
                <Text style={styles.timerSubDivider}>•</Text>
                <Text style={styles.timerSubRate}>
                  Overtime: ₹{activeBooking.overtimeRatePerHour || 99}/hr
                </Text>
              </View>
            </View>

            {/* OTP Security Pin Card */}
            <View style={styles.otpCard}>
              <View style={styles.otpHeaderRow}>
                <Text style={styles.otpLabel}>KEY HANDOVER VERIFICATION PIN</Text>
                <View style={styles.securityShieldPill}>
                  <Text style={styles.securityShieldText}>INSURANCE ACTIVATOR</Text>
                </View>
              </View>
              <View style={styles.pinDigitsRow}>
                {(activeBooking.otpCode || '4821').split('').map((char, idx) => (
                  <View key={idx} style={styles.pinBox}>
                    <Text style={styles.pinBoxDigit}>{char}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.otpHint}>
                Share this PIN with your Chauffeur when handing over car keys to activate the official duty clock.
              </Text>
            </View>

            {/* Vehicle Handover Confirmation */}
            <View style={styles.cardBox}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>CUSTOMER VEHICLE INSPECTION CHECKLIST</Text>
                <View style={styles.verifiedChecklistPill}>
                  <Text style={styles.verifiedChecklistText}>VERIFIED OK</Text>
                </View>
              </View>
              <View style={styles.checkItem}>
                <View style={styles.checkCircleGreen}><Text style={styles.checkIcon}>✓</Text></View>
                <Text style={styles.checkText}>
                  Vehicle: <Text style={{ fontWeight: '800', color: '#0F172A' }}>{activeBooking.carModel || 'Honda City'}</Text> ({activeBooking.carTransmission || 'Automatic AT'})
                </Text>
              </View>
              <View style={styles.checkItem}>
                <View style={styles.checkCircleGreen}><Text style={styles.checkIcon}>✓</Text></View>
                <Text style={styles.checkText}>Initial Fuel Level: 80% Full logged</Text>
              </View>
              <View style={styles.checkItem}>
                <View style={styles.checkCircleGreen}><Text style={styles.checkIcon}>✓</Text></View>
                <Text style={styles.checkText}>Initial Odometer: 34,812 km recorded</Text>
              </View>
              <View style={styles.checkItem}>
                <View style={styles.checkCircleGreen}><Text style={styles.checkIcon}>✓</Text></View>
                <Text style={styles.checkText}>Exterior Walkaround: Zero pre-existing damages noted</Text>
              </View>
            </View>

            {/* Assigned Driver Profile Card */}
            <View style={styles.driverCard}>
              <View style={styles.driverTop}>
                <View style={styles.driverAvatar}>
                  <Text style={styles.driverAvatarText}>RK</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.driverNameRow}>
                    <Text style={styles.driverName}>{activeBooking.driverName || 'Rajesh Kumar'}</Text>
                    <View style={styles.driverRatingPill}>
                      <Text style={styles.driverRatingText}>★ 4.92</Text>
                    </View>
                  </View>
                  <Text style={styles.driverDutyCount}>582 Completed Chauffeur Duties</Text>
                  <View style={styles.badgeRow}>
                    <View style={styles.driverBadge}>
                      <Text style={styles.driverBadgeText}>LMV Commercial DL</Text>
                    </View>
                    <View style={styles.driverBadge}>
                      <Text style={styles.driverBadgeText}>AT & MT Certified</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => setShowCallChat(true)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.actionBtnText}>Call / Chat Chauffeur</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.sosActionBtn]}
                  onPress={() => navigate('SOS')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.sosActionText}>Emergency SOS</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* End Duty CTA */}
            <TouchableOpacity
              style={styles.completeBtn}
              onPress={handleComplete}
              activeOpacity={0.88}
            >
              <Text style={styles.completeBtnText}>
                Complete Duty & Settle ₹{activeBooking.fareAmount} →
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBtnText}>Cancel Duty</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ================================================= */
          /* CAB TRACKING FLOW                                 */
          /* ================================================= */
          <View>
            <MapMock
              pickupAddress={activeBooking.pickupAddress}
              dropAddress={activeBooking.dropAddress}
              driverName={activeBooking.driverName}
              vehiclePlate={activeBooking.vehiclePlate}
              isLiveTracking={true}
            />

            <View style={styles.otpCard}>
              <Text style={styles.otpLabel}>TRIP START OTP</Text>
              <View style={styles.pinDigitsRow}>
                {(activeBooking.otpCode || '4821').split('').map((char, idx) => (
                  <View key={idx} style={styles.pinBox}>
                    <Text style={styles.pinBoxDigit}>{char}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.otpHint}>Share with driver before boarding the cab</Text>
            </View>

            <View style={styles.driverCard}>
              <View style={styles.driverTop}>
                <View style={styles.driverAvatar}>
                  <Text style={styles.driverAvatarText}>RK</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverName}>{activeBooking.driverName || 'Rajesh Kumar'}</Text>
                  <Text style={styles.driverRating}>★ 4.88 • White Honda City</Text>
                  <Text style={styles.plateText}>Plate: DL 01 AB 9988</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.completeBtn}
              onPress={handleComplete}
              activeOpacity={0.88}
            >
              <Text style={styles.completeBtnText}>Simulate Destination Arrival →</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <CallChatModal
        visible={showCallChat}
        onClose={() => setShowCallChat(false)}
        driverName={activeBooking.driverName || 'Rajesh Kumar'}
        driverPhone={activeBooking.driverPhone || '+91 98111 56789'}
      />
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
    padding: 16,
    paddingBottom: 40
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16
  },
  bookRideBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12
  },
  bookRideBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },

  /* Duty Chronograph (Dark Obsidian) */
  dutyTimerCard: {
    backgroundColor: '#090D16',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981'
  },
  timerLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.8
  },
  activeDutyBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  activeDutyBadgeText: {
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '800'
  },
  timerDigits: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
    fontFamily: 'monospace',
    marginVertical: 4
  },
  timerSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4
  },
  timerSubText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600'
  },
  timerSubDivider: {
    color: '#475569',
    fontSize: 12
  },
  timerSubRate: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700'
  },

  /* OTP Card (Warm Gold Security Theme) */
  otpCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2
  },
  otpHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10
  },
  otpLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#92400E',
    letterSpacing: 0.5
  },
  securityShieldPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#FCD34D'
  },
  securityShieldText: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#B45309'
  },
  pinDigitsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 6
  },
  pinBox: {
    width: 44,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1
  },
  pinBoxDigit: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    fontFamily: 'monospace'
  },
  otpHint: {
    fontSize: 10.5,
    color: '#78350F',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 14
  },

  /* Card Box */
  cardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.4
  },
  verifiedChecklistPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  verifiedChecklistText: {
    color: '#047857',
    fontSize: 8,
    fontWeight: '900'
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 7
  },
  checkCircleGreen: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkIcon: {
    fontSize: 10,
    fontWeight: '900',
    color: '#047857'
  },
  checkText: {
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '500'
  },

  /* Driver Profile Card */
  driverCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2
  },
  driverTop: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2
  },
  driverAvatarText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: '900'
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  driverName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A'
  },
  driverRatingPill: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#FDE68A'
  },
  driverRatingText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#B45309'
  },
  driverRating: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '700',
    marginTop: 1
  },
  plateText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  driverDutyCount: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6
  },
  driverBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  driverBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#334155'
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    alignItems: 'center'
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A'
  },
  sosActionBtn: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2'
  },
  sosActionText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626'
  },
  completeBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.2
  },
  cancelBtn: {
    paddingVertical: 10,
    alignItems: 'center'
  },
  cancelBtnText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700'
  }
});
