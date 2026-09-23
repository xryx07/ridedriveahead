import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../components/Header';
import { riderApi } from '../api/apiClient';
import { useRiderStore } from '../store/useRiderStore';

export const SosScreen: React.FC = () => {
  const { user, activeBooking, navigate } = useRiderStore();
  const [triggered, setTriggered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTriggerSos = async () => {
    setLoading(true);
    try {
      await riderApi.triggerSos(
        user?.id || 'a1000000-0000-0000-0000-000000000001',
        activeBooking?.pickupLat || 28.5562,
        activeBooking?.pickupLng || 77.1000
      );
      setTriggered(true);
    } catch (e: any) {
      alert(e.message || 'Failed to trigger SOS');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Emergency SOS" showBack backTo="HOME" />

      <View style={styles.content}>
        <View style={styles.warningCircle}>
          <Text style={styles.warningIconText}>SOS</Text>
        </View>

        <Text style={styles.title}>Emergency Response Network</Text>
        <Text style={styles.subtitle}>
          Pressing the SOS button below will immediately share your real-time GPS coordinates, vehicle details,
          and trip details with your Emergency Contacts and our 24x7 Safety Response Team.
        </Text>

        {activeBooking && (
          <View style={styles.rideDetailBox}>
            <Text style={styles.rideDetailHeader}>Current Ride Information</Text>
            <Text style={styles.rideDetailItem}>Driver: {activeBooking.driverName || 'Rajesh Kumar'}</Text>
            <Text style={styles.rideDetailItem}>
              Vehicle: {activeBooking.vehicleModel} ({activeBooking.vehiclePlate})
            </Text>
            <Text style={styles.rideDetailItem}>Destination: {activeBooking.dropAddress}</Text>
          </View>
        )}

        {triggered ? (
          <View style={styles.alertSuccessBox}>
            <Text style={styles.alertSuccessTitle}>Emergency Alert Dispatched</Text>
            <Text style={styles.alertSuccessSub}>
              Safety Team has been alerted. Your emergency contacts have received SMS with live tracking link.
            </Text>
            <TouchableOpacity style={styles.callPoliceBtn} onPress={() => alert('Dialing 112 / Police Emergency')}>
              <Text style={styles.callPoliceBtnText}>Dial 112 (Police Emergency)</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.bigSosButton, loading && { opacity: 0.6 }]}
            onPress={handleTriggerSos}
            disabled={loading}
          >
            <Text style={styles.bigSosText}>{loading ? 'Broadcasting...' : 'ACTIVATE SOS'}</Text>
            <Text style={styles.sosSub}>Tap to dispatch live emergency broadcast</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigate('HOME')}>
          <Text style={styles.cancelBtnText}>Back to Safety</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  warningCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#EF4444',
    marginBottom: 16
  },
  warningIconText: {
    color: '#DC2626',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1
  },
  title: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center'
  },
  subtitle: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 18
  },
  rideDetailBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2
  },
  rideDetailHeader: {
    color: '#0284C7',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 6
  },
  rideDetailItem: {
    color: '#0F172A',
    fontSize: 12,
    marginTop: 2
  },
  bigSosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#F87171',
    shadowColor: '#DC2626',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    marginBottom: 24
  },
  bigSosText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1
  },
  sosSub: {
    color: '#FEE2E2',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 24
  },
  alertSuccessBox: {
    width: '100%',
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    alignItems: 'center',
    marginBottom: 24
  },
  alertSuccessTitle: {
    color: '#166534',
    fontSize: 16,
    fontWeight: '800'
  },
  alertSuccessSub: {
    color: '#15803D',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16
  },
  callPoliceBtn: {
    backgroundColor: '#DC2626',
    marginTop: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },
  callPoliceBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  cancelBtn: {
    paddingVertical: 10
  },
  cancelBtnText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600'
  }
});
