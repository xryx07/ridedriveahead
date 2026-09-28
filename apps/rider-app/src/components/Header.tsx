import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenName, useRiderStore } from '../store/useRiderStore';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  backTo?: ScreenName;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack = false, backTo = 'HOME' }) => {
  const { navigate, user } = useRiderStore();

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
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
            <Text style={styles.brandTitle} numberOfLines={1}>RideDriveAhead</Text>
            <Text style={styles.brandSubtitle} numberOfLines={1}>Advance-Scheduled & Instant Rides</Text>
          </View>
        )}
      </View>

      <View style={styles.rightContainer}>
        {/* Quick Emergency SOS button */}
        <TouchableOpacity style={styles.sosButton} onPress={() => navigate('SOS')}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>

        {/* Profile Avatar */}
        <TouchableOpacity style={styles.profileButton} onPress={() => navigate('PROFILE')}>
          <Text style={styles.avatarText}>{user?.fullName ? user.fullName.charAt(0) : 'A'}</Text>
        </TouchableOpacity>
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
  leftContainer: {
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
  brandTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  brandSubtitle: {
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
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0
  },
  sosButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6
  },
  sosText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '800'
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800'
  }
});
