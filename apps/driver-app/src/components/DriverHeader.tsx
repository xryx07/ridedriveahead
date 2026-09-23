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
          <TouchableOpacity style={styles.backButton} onPress={() => navigate(backTo)}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <Text style={styles.driverBrand}>RideDriveAhead</Text>
            <Text style={styles.partnerText}>Driver Partner Portal</Text>
          </View>
        )}
      </View>

      <View style={styles.right}>
        {/* Driving hours fatigue indicator */}
        <TouchableOpacity style={styles.fatiguePill} onPress={() => navigate('PROFILE')}>
          <Text style={styles.fatigueEmoji}>⏱️</Text>
          <Text style={styles.fatigueText}>{driver.drivingHoursToday}h / 8h</Text>
        </TouchableOpacity>

        {/* Online / Offline Switch */}
        <View style={styles.onlineSwitchContainer}>
          <Text style={[styles.statusText, driver.isOnline ? styles.onlineText : styles.offlineText]}>
            {driver.isOnline ? 'ONLINE' : 'OFFLINE'}
          </Text>
          <Switch
            value={driver.isOnline}
            onValueChange={toggleOnline}
            trackColor={{ false: '#334155', true: '#059669' }}
            thumbColor={driver.isOnline ? '#10B981' : '#94A3B8'}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 64,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  left: {
    flex: 1
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
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  backText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700'
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  fatiguePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  fatigueEmoji: {
    fontSize: 11,
    marginRight: 4
  },
  fatigueText: {
    color: '#0F172A',
    fontSize: 10,
    fontWeight: '700'
  },
  onlineSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    marginRight: 6
  },
  onlineText: {
    color: '#059669'
  },
  offlineText: {
    color: '#DC2626'
  }
});
