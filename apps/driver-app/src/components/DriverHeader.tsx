import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { DriverScreenName, useDriverStore } from '../store/useDriverStore';

interface DriverHeaderProps {
  title?: string;
  showBack?: boolean;
  backTo?: DriverScreenName;
}

export const DriverHeader: React.FC<DriverHeaderProps> = ({
  title,
  showBack = false,
  backTo = 'HOME'
}) => {
  const { driver, toggleOnline, navigate } = useDriverStore();

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {showBack ? (
          <View style={styles.backRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigate(backTo)}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            {title ? (
              <Text style={styles.headerTitle} numberOfLines={1}>
                {title}
              </Text>
            ) : null}
          </View>
        ) : (
          <View>
            <Text style={styles.driverBrand} numberOfLines={1}>RideDriveAhead</Text>
            <Text style={styles.partnerText} numberOfLines={1}>Driver Partner Portal</Text>
          </View>
        )}
      </View>

      <View style={styles.right}>
        {/* Driving hours fatigue indicator */}
        <TouchableOpacity style={styles.fatiguePill} onPress={() => navigate('PROFILE')}>
          <Text style={styles.fatigueText}>{driver.drivingHoursToday}h / 8h</Text>
        </TouchableOpacity>

        {/* Online / Offline Switch */}
        <View style={styles.onlineSwitchContainer}>
          <Text style={[styles.statusText, driver.isOnline ? styles.onlineText : styles.offlineText]}>
            {driver.isOnline ? 'ON' : 'OFF'}
          </Text>
          <Switch
            value={driver.isOnline}
            onValueChange={toggleOnline}
            trackColor={{ false: '#64748B', true: '#059669' }}
            thumbColor={driver.isOnline ? '#10B981' : '#F1F5F9'}
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    minHeight: 56,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    zIndex: 20
  },
  left: {
    flex: 1,
    marginRight: 8
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    flexShrink: 1
  },
  driverBrand: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  partnerText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '700'
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexShrink: 0
  },
  backText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700'
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0
  },
  fatiguePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  fatigueText: {
    color: '#0F172A',
    fontSize: 10,
    fontWeight: '700'
  },
  onlineSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    marginRight: 4
  },
  onlineText: {
    color: '#059669'
  },
  offlineText: {
    color: '#DC2626'
  }
});
