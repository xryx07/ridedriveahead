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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigate(backTo)}
              activeOpacity={0.8}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            {title ? (
              <Text style={styles.headerTitle} numberOfLines={1}>
                {title}
              </Text>
            ) : null}
          </View>
        ) : (
          <View style={styles.brandRow}>
            <View style={styles.brandIconBox}>
              <Text style={styles.brandIconText}>◆</Text>
            </View>
            <View>
              <View style={styles.brandTitleRow}>
                <Text style={styles.driverBrand} numberOfLines={1}>RideDriveAhead</Text>
                <View style={styles.proTag}>
                  <Text style={styles.proTagText}>PRO PARTNER</Text>
                </View>
              </View>
              <Text style={styles.partnerText} numberOfLines={1}>Chauffeur & Fleet Cockpit</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.right}>
        {/* Driving hours fatigue indicator */}
        <TouchableOpacity
          style={styles.fatiguePill}
          onPress={() => navigate('PROFILE')}
          activeOpacity={0.8}
        >
          <Text style={styles.fatigueLabel}>SHIFT</Text>
          <Text style={styles.fatigueText}>{driver.drivingHoursToday}h / 8h</Text>
        </TouchableOpacity>

        {/* Online / Offline Switch */}
        <View style={[styles.onlineSwitchContainer, driver.isOnline && styles.onlineSwitchContainerActive]}>
          <View style={[styles.statusDot, driver.isOnline ? styles.dotOnline : styles.dotOffline]} />
          <Text style={[styles.statusText, driver.isOnline ? styles.onlineText : styles.offlineText]}>
            {driver.isOnline ? 'ONLINE' : 'OFFLINE'}
          </Text>
          <Switch
            value={driver.isOnline}
            onValueChange={toggleOnline}
            trackColor={{ false: '#94A3B8', true: '#059669' }}
            thumbColor={driver.isOnline ? '#FFFFFF' : '#F1F5F9'}
            style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    minHeight: 60,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
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
    letterSpacing: -0.2,
    flexShrink: 1
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  brandIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2
  },
  brandIconText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '900'
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  driverBrand: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  proTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#FDE68A'
  },
  proTagText: {
    color: '#92400E',
    fontSize: 7.5,
    fontWeight: '900',
    letterSpacing: 0.3
  },
  partnerText: {
    color: '#059669',
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 1
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
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
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center'
  },
  fatigueLabel: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.4
  },
  fatigueText: {
    color: '#0F172A',
    fontSize: 10,
    fontWeight: '800'
  },
  onlineSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 3
  },
  onlineSwitchContainerActive: {
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5'
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  dotOnline: {
    backgroundColor: '#059669'
  },
  dotOffline: {
    backgroundColor: '#DC2626'
  },
  statusText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4
  },
  onlineText: {
    color: '#047857'
  },
  offlineText: {
    color: '#DC2626'
  }
});
