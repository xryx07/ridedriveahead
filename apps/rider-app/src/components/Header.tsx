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
          <View style={styles.brandContainer}>
            <View style={styles.brandIconBox}>
              <Text style={styles.brandIconText}>◆</Text>
            </View>
            <View>
              <View style={styles.brandTitleRow}>
                <Text style={styles.brandTitle} numberOfLines={1}>RideDriveAhead</Text>
                <View style={styles.vipTag}>
                  <Text style={styles.vipTagText}>VIP CONCIERGE</Text>
                </View>
              </View>
              <Text style={styles.brandSubtitle} numberOfLines={1}>
                Personal Chauffeur & Advance Cabs
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.rightContainer}>
        {/* Profile Avatar */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigate('PROFILE')}
          activeOpacity={0.8}
        >
          <Text style={styles.avatarText}>{user?.fullName ? user.fullName.charAt(0) : 'A'}</Text>
        </TouchableOpacity>
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
    letterSpacing: -0.2,
    flexShrink: 1
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
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
    gap: 6
  },
  brandTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  vipTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#FDE68A'
  },
  vipTagText: {
    color: '#92400E',
    fontSize: 7.5,
    fontWeight: '900',
    letterSpacing: 0.3
  },
  brandSubtitle: {
    color: '#059669',
    fontSize: 10,
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
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0
  },
  profileButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  }
});
