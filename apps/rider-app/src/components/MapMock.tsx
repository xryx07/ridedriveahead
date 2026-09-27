import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MapMockProps {
  pickupAddress: string;
  dropAddress: string;
  driverName?: string;
  vehiclePlate?: string;
  isLiveTracking?: boolean;
}

export const MapMock: React.FC<MapMockProps> = ({
  pickupAddress,
  dropAddress,
  driverName,
  vehiclePlate,
  isLiveTracking = false
}) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (isLiveTracking) {
      const interval = setInterval(() => {
        setPulse((prev) => !prev);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isLiveTracking]);

  return (
    <View style={styles.mapContainer}>
      {/* Map Graphic Simulation */}
      <View style={styles.gridOverlay}>
        <View style={[styles.gridLineHorizontal, { top: '25%' }]} />
        <View style={[styles.gridLineHorizontal, { top: '50%' }]} />
        <View style={[styles.gridLineHorizontal, { top: '75%' }]} />
        <View style={[styles.gridLineVertical, { left: '30%' }]} />
        <View style={[styles.gridLineVertical, { left: '60%' }]} />
        <View style={[styles.routePath]} />
      </View>

      {/* Pickup Marker */}
      <View style={styles.pickupPin}>
        <View style={styles.pinDot} />
        <View style={styles.pinCallout}>
          <Text style={styles.calloutText} numberOfLines={1}>PICKUP: {pickupAddress}</Text>
        </View>
      </View>

      {/* Drop Destination Marker */}
      <View style={styles.dropPin}>
        <View style={[styles.pinDot, { backgroundColor: '#059669' }]} />
        <View style={[styles.pinCallout, { borderColor: '#059669' }]}>
          <Text style={styles.calloutText} numberOfLines={1}>DROP: {dropAddress}</Text>
        </View>
      </View>

      {/* Live Moving Vehicle Car Marker */}
      {isLiveTracking && (
        <View style={[styles.carMarker, { transform: [{ scale: pulse ? 1.08 : 1.0 }] }]}>
          <View style={styles.vehicleMarkerPill}>
            <View style={styles.vehicleDot} />
            <Text style={styles.vehicleLabel}>CAB</Text>
          </View>
          <View style={styles.carPlateBadge}>
            <Text style={styles.carPlateText}>{vehiclePlate || 'DL 01 AB 9988'}</Text>
          </View>
        </View>
      )}

      {/* Live Status Pill */}
      <View style={styles.statusPill}>
        <View style={[styles.liveDot, { backgroundColor: isLiveTracking ? '#059669' : '#0284C7' }]} />
        <Text style={styles.statusText}>
          {isLiveTracking ? 'Live Driver GPS Active • ETA 4 mins' : 'Route Preview'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    height: 240,
    width: '100%',
    backgroundColor: '#F1F5F9',
    position: 'relative',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.35
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#CBD5E1'
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#CBD5E1'
  },
  routePath: {
    position: 'absolute',
    top: '35%',
    left: '20%',
    width: '60%',
    height: 60,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#0284C7',
    borderTopRightRadius: 24,
    transform: [{ rotate: '15deg' }]
  },
  pickupPin: {
    position: 'absolute',
    top: '25%',
    left: '12%',
    alignItems: 'center'
  },
  dropPin: {
    position: 'absolute',
    bottom: '22%',
    right: '12%',
    alignItems: 'center'
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2
  },
  pinCallout: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#EF4444',
    maxWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2
  },
  calloutText: {
    color: '#0F172A',
    fontSize: 10,
    fontWeight: '700'
  },
  carMarker: {
    position: 'absolute',
    top: '42%',
    left: '48%',
    alignItems: 'center',
    zIndex: 10
  },
  vehicleMarkerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4
  },
  vehicleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8'
  },
  vehicleLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  carPlateBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  carPlateText: {
    color: '#0F172A',
    fontSize: 9,
    fontWeight: '700'
  },
  statusPill: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8
  },
  statusText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '700'
  }
});
