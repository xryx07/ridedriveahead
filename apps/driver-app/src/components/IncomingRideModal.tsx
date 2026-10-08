import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IncomingRideModalProps {
  visible: boolean;
  onAccept: () => void;
  onDecline?: () => void;
  onReject?: () => void;
  fareAmount?: number;
  pickup?: string;
  drop?: string;
  riderRating?: number;
}

export const IncomingRideModal: React.FC<IncomingRideModalProps> = ({
  visible,
  onAccept,
  onDecline,
  onReject,
  fareAmount = 350,
  pickup = 'Nearby Pickup Location',
  drop = 'City Destination Corridor',
  riderRating = 5.0
}) => {
  const handleDismiss = onDecline || onReject || (() => {});
  const [countdown, setCountdown] = useState(25);

  useEffect(() => {
    if (visible) {
      setCountdown(25);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleDismiss();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header & Countdown */}
          <View style={styles.topRow}>
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>NEW INSTANT DISPATCH</Text>
            </View>
            <View style={styles.timerCircle}>
              <Text style={styles.timerNumber}>{countdown}s</Text>
            </View>
          </View>

          {/* Fare Highlight */}
          <View style={styles.fareRow}>
            <Text style={styles.fareAmount}>₹{fareAmount}</Text>
            <Text style={styles.fareType}>Instant Trip • Cashless UPI</Text>
          </View>

          {/* Route Details */}
          <View style={styles.routeBox}>
            <View style={styles.routeItem}>
              <View style={styles.pinDot} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.routeLabel}>PICKUP LOCATION</Text>
                <Text style={styles.routeAddress}>{pickup}</Text>
              </View>
            </View>
            <View style={styles.routeDivider} />
            <View style={styles.routeItem}>
              <View style={[styles.pinDot, { backgroundColor: '#059669' }]} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.routeLabel}>DROP DESTINATION</Text>
                <Text style={styles.routeAddress}>{drop}</Text>
              </View>
            </View>
          </View>

          {/* Rider Rating */}
          <View style={styles.riderPill}>
            <Text style={styles.riderRatingText}>★ {riderRating.toFixed(1)} Verified Rider</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.declineBtn} onPress={handleDismiss}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
              <Text style={styles.acceptText}>ACCEPT RIDE (₹{fareAmount})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 32
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  urgentBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  urgentText: {
    color: '#0284C7',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5
  },
  timerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center'
  },
  timerNumber: {
    color: '#DC2626',
    fontWeight: '900',
    fontSize: 14
  },
  fareRow: {
    alignItems: 'center',
    marginBottom: 16
  },
  fareAmount: {
    color: '#059669',
    fontSize: 36,
    fontWeight: '900'
  },
  fareType: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2
  },
  routeBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  pinDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0284C7'
  },
  routeLabel: {
    color: '#0284C7',
    fontSize: 10,
    fontWeight: '800'
  },
  routeAddress: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2
  },
  routeDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginLeft: 20
  },
  riderPill: {
    alignSelf: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 20
  },
  riderRatingText: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: '700'
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12
  },
  declineBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  declineText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700'
  },
  acceptBtn: {
    flex: 2,
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center'
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  }
});
