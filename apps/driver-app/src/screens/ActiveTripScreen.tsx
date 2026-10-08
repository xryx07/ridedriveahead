import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DriverHeader } from '../components/DriverHeader';
import { useDriverStore } from '../store/useDriverStore';

export const ActiveTripScreen: React.FC = () => {
  const { activeTrip, activeTripStatus, updateTripStatus, completeTrip, navigate } = useDriverStore();
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [elapsedSec, setElapsedSec] = useState(0);

  const isChauffeur = activeTrip?.gigType === 'HOURLY_CHAUFFEUR' || activeTrip?.gigType === 'EVENT_CHAUFFEUR' || activeTrip?.gigType === 'OUTSTATION_2DAY' || !!activeTrip?.carModel;

  useEffect(() => {
    let timer: any = null;
    if (activeTripStatus === 'IN_PROGRESS') {
      timer = setInterval(() => {
        setElapsedSec((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeTripStatus]);

  if (!activeTrip) {
    return (
      <View style={styles.container}>
        <DriverHeader title="Active Navigation" showBack backTo="HOME" />
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No Active Trip in Progress</Text>
          <Text style={styles.emptySub}>Select an open gig or wait for a duty dispatch.</Text>
          <TouchableOpacity style={styles.goHomeBtn} onPress={() => navigate('HOME')}>
            <Text style={styles.goHomeBtnText}>Return to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const formatElapsed = (sec: number) => {
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleArriveAtPickup = () => {
    updateTripStatus('ARRIVED_PICKUP');
  };

  const handleVerifyOtpAndStart = () => {
    if (!enteredOtp || enteredOtp.trim().length !== 4) {
      setOtpError('Please enter the 4-digit PIN provided by the customer.');
      return;
    }
    setOtpError('');
    updateTripStatus('IN_PROGRESS');
  };

  const handleFinishTrip = () => {
    completeTrip();
    alert(`Duty Completed! ₹${activeTrip.fareAmount} settled to your earnings ledger.`);
    navigate('HOME');
  };

  return (
    <View style={styles.container}>
      <DriverHeader
        title={isChauffeur ? 'Chauffeur Duty Dashboard' : 'Navigation & Active Trip'}
        showBack
        backTo="HOME"
      />

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {isChauffeur ? (
          /* ================================================= */
          /* CHAUFFEUR DUTY DASHBOARD                          */
          /* ================================================= */
          <View>
            {/* Active Duty Banner */}
            <View style={styles.dutyCard}>
              <View style={styles.dutyHeader}>
                <View style={styles.badgeGreen}>
                  <Text style={styles.badgeGreenText}>CHAUFFEUR DUTY ACTIVE</Text>
                </View>
                <Text style={styles.dutyFare}>₹{activeTrip.fareAmount}</Text>
              </View>

              <Text style={styles.dutyTitle}>
                {activeTrip.carModel || 'Customer\'s Vehicle (Automatic AT)'}
              </Text>
              <Text style={styles.dutySub}>
                Customer: {activeTrip.riderName} ({activeTrip.riderPhone})
              </Text>
            </View>

            {/* Live Duty Clock HUD */}
            <View style={styles.timerCard}>
              <Text style={styles.timerLabel}>ELAPSED CHAUFFEUR DUTY TIME</Text>
              <Text style={styles.timerDigits}>{formatElapsed(elapsedSec)}</Text>
              <Text style={styles.timerNote}>
                Package: {activeTrip.durationHours || 4}h Included • Overtime: ₹
                {activeTrip.overtimeRatePerHour || 99}/hr
              </Text>
            </View>

            {/* Vehicle Handover Checklist */}
            <View style={styles.checklistCard}>
              <Text style={styles.checkTitle}>Customer Vehicle Handover Checklist</Text>
              <View style={styles.checkRow}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.checkText}>Initial Fuel Gauge: 80% Full verified</Text>
              </View>
              <View style={styles.checkRow}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.checkText}>Initial Odometer: 34,812 km logged</Text>
              </View>
              <View style={styles.checkRow}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.checkText}>Exterior Inspection: No scratches noted</Text>
              </View>
            </View>

            {/* OTP Section if not yet started */}
            {activeTripStatus !== 'IN_PROGRESS' && (
              <View style={styles.otpCard}>
                <Text style={styles.otpCardTitle}>Enter Customer PIN to Start Duty</Text>
                <TextInput
                  style={styles.otpInput}
                  value={enteredOtp}
                  onChangeText={setEnteredOtp}
                  keyboardType="numeric"
                  maxLength={4}
                  placeholder="4821"
                  placeholderTextColor="#94A3B8"
                />
                {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
                <TouchableOpacity style={styles.actionBtn} onPress={handleVerifyOtpAndStart}>
                  <Text style={styles.actionBtnText}>Verify PIN & Start Official Duty</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Complete Duty CTA */}
            {activeTripStatus === 'IN_PROGRESS' && (
              <TouchableOpacity style={styles.completeBtn} onPress={handleFinishTrip}>
                <Text style={styles.completeBtnText}>
                  Complete Duty & Settle ₹{activeTrip.fareAmount}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          /* ================================================= */
          /* CAB TRIP NAVIGATION                               */
          /* ================================================= */
          <View>
            <View style={styles.navHud}>
              <Text style={styles.turnIcon}>↱</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.turnInstruction}>In 350 meters, turn right</Text>
                <Text style={styles.streetName}>onto Golf Course Extension Road</Text>
              </View>
              <View style={styles.speedPill}>
                <Text style={styles.speedText}>48</Text>
                <Text style={styles.speedUnit}>km/h</Text>
              </View>
            </View>

            <View style={styles.dutyCard}>
              <Text style={styles.dutyTitle}>Passenger: {activeTrip.riderName}</Text>
              <Text style={styles.dutySub}>Drop: {activeTrip.dropAddress}</Text>
            </View>

            {activeTripStatus === 'EN_ROUTE_PICKUP' && (
              <TouchableOpacity style={styles.actionBtn} onPress={handleArriveAtPickup}>
                <Text style={styles.actionBtnText}>Arrived at Pickup</Text>
              </TouchableOpacity>
            )}

            {activeTripStatus === 'ARRIVED_PICKUP' && (
              <View style={styles.otpCard}>
                <Text style={styles.otpCardTitle}>Enter Passenger PIN</Text>
                <TextInput
                  style={styles.otpInput}
                  value={enteredOtp}
                  onChangeText={setEnteredOtp}
                  keyboardType="numeric"
                  maxLength={4}
                />
                <TouchableOpacity style={styles.actionBtn} onPress={handleVerifyOtpAndStart}>
                  <Text style={styles.actionBtnText}>Start Cab Trip</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeTripStatus === 'IN_PROGRESS' && (
              <TouchableOpacity style={styles.completeBtn} onPress={handleFinishTrip}>
                <Text style={styles.completeBtnText}>Complete Cab Trip (₹{activeTrip.fareAmount})</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
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
    flex: 1,
    padding: 16
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16
  },
  goHomeBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8
  },
  goHomeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  dutyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12
  },
  dutyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  badgeGreen: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  badgeGreenText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857'
  },
  dutyFare: {
    fontSize: 20,
    fontWeight: '900',
    color: '#047857'
  },
  dutyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A'
  },
  dutySub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  timerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 2,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    marginBottom: 12
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
    letterSpacing: 2,
    marginVertical: 4
  },
  timerNote: {
    fontSize: 11,
    color: '#64748B'
  },
  checklistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12
  },
  checkTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8
  },
  checkRow: {
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
  otpCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    marginBottom: 12
  },
  otpCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1D4ED8',
    marginBottom: 8
  },
  otpInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 8,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 6,
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    width: 140,
    color: '#0F172A',
    marginBottom: 10
  },
  errorText: {
    color: '#DC2626',
    fontSize: 11,
    marginBottom: 8
  },
  actionBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
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
    fontSize: 14,
    fontWeight: '800'
  },
  navHud: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12
  },
  turnIcon: {
    fontSize: 24,
    color: '#0F172A',
    fontWeight: '900'
  },
  turnInstruction: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A'
  },
  streetName: {
    fontSize: 10,
    color: '#64748B'
  },
  speedPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center'
  },
  speedText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A'
  },
  speedUnit: {
    fontSize: 8,
    fontWeight: '700',
    color: '#64748B'
  }
});
