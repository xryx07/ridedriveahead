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
                <Text style={styles.timerLabel}>DUTY CLOCK ACTIVE</Text>
              </View>
              <Text style={styles.timerDigits}>{formatElapsed(elapsedSeconds)}</Text>
              <Text style={styles.timerSub}>
                Package: {activeBooking.dutyHoursIncluded || 4} Hours • Overtime Rate: ₹
                {activeBooking.overtimeRatePerHour || 99}/hr
              </Text>
            </View>

            {/* OTP Security Pin Card */}
            <View style={styles.otpCard}>
              <View>
                <Text style={styles.otpLabel}>DUTY VERIFICATION PIN</Text>
                <Text style={styles.otpCode}>{activeBooking.otpCode || '4821'}</Text>
                <Text style={styles.otpHint}>Share with chauffeur when handing over car keys</Text>
              </View>
            </View>

            {/* Vehicle Handover Confirmation */}
            <View style={styles.cardBox}>
              <Text style={styles.cardTitle}>Customer Vehicle Handover Checklist</Text>
              <View style={styles.checkItem}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.checkText}>
                  Vehicle: <Text style={{ fontWeight: '800' }}>{activeBooking.carModel || 'Honda City'}</Text> ({activeBooking.carTransmission || 'Automatic AT'})
                </Text>
              </View>
              <View style={styles.checkItem}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.checkText}>Initial Fuel Level: 80% Full verified</Text>
              </View>
              <View style={styles.checkItem}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.checkText}>Initial Odometer: 34,812 km logged</Text>
              </View>
              <View style={styles.checkItem}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.checkText}>Exterior Inspection: No new scratches noted</Text>
              </View>
            </View>

            {/* Assigned Driver Profile Card */}
            <View style={styles.driverCard}>
              <View style={styles.driverTop}>
                <View style={styles.driverAvatar}>
                  <Text style={styles.driverAvatarText}>RK</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverName}>{activeBooking.driverName || 'Rajesh Kumar'}</Text>
                  <Text style={styles.driverRating}>★ 4.92 • 582 Completed Duties</Text>
                  <View style={styles.badgeRow}>
                    <View style={styles.driverBadge}>
                      <Text style={styles.driverBadgeText}>LMV Commercial Pro</Text>
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
                >
                  <Text style={styles.actionBtnText}>Call / Chat Driver</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, { borderColor: '#FECACA', backgroundColor: '#FEF2F2' }]}
                  onPress={() => navigate('SOS')}
                >
                  <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>SOS Center</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* End Duty CTA */}
            <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>
              <Text style={styles.completeBtnText}>
                Complete Duty & Settle ₹{activeBooking.fareAmount}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
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
              <Text style={styles.otpCode}>{activeBooking.otpCode || '4821'}</Text>
              <Text style={styles.otpHint}>Share with driver before boarding</Text>
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

            <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>
              <Text style={styles.completeBtnText}>Simulate Destination Arrival</Text>
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
    backgroundColor: '#047857',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10
  },
  bookRideBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  dutyTimerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 2,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    marginBottom: 12
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669'
  },
  timerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.5
  },
  timerDigits: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 2
  },
  timerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  otpCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    marginBottom: 12
  },
  otpLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
    textAlign: 'center'
  },
  otpCode: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 6,
    color: '#0F172A',
    marginVertical: 4,
    textAlign: 'center'
  },
  otpHint: {
    fontSize: 10,
    color: '#475569',
    textAlign: 'center'
  },
  cardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  checkIcon: {
    fontSize: 12,
    fontWeight: '900',
    color: '#047857'
  },
  checkText: {
    fontSize: 11,
    color: '#334155'
  },
  driverCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14
  },
  driverTop: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center'
  },
  driverAvatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  driverName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A'
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
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4
  },
  driverBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  driverBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#047857'
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
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    alignItems: 'center'
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A'
  },
  completeBtn: {
    backgroundColor: '#047857',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
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
