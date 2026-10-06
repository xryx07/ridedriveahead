import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRiderStore } from '../store/useRiderStore';

interface BottomNavBarProps {
  currentTab: 'home' | 'rides' | 'activity' | 'wallet' | 'account';
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab }) => {
  const { navigate } = useRiderStore();

  const handleTabPress = (tab: 'home' | 'rides' | 'activity' | 'wallet' | 'account') => {
    switch (tab) {
      case 'home':
        navigate('HOME');
        break;
      case 'rides':
        navigate('FARE_ESTIMATE');
        break;
      case 'activity':
        navigate('RIDE_HISTORY');
        break;
      case 'wallet':
        navigate('TRIP_SUMMARY');
        break;
      case 'account':
        navigate('PROFILE');
        break;
    }
  };

  return (
    <View style={styles.navBar}>
      {/* Home Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress('home')}
        activeOpacity={0.8}
      >
        <Text style={[styles.navIcon, currentTab === 'home' && styles.navIconActive]}>🏠</Text>
        <Text style={[styles.navLabel, currentTab === 'home' && styles.navLabelActive]}>Home</Text>
        {currentTab === 'home' && <View style={styles.activeDot} />}
      </TouchableOpacity>

      {/* Rides Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress('rides')}
        activeOpacity={0.8}
      >
        <Text style={[styles.navIcon, currentTab === 'rides' && styles.navIconActive]}>🚗</Text>
        <Text style={[styles.navLabel, currentTab === 'rides' && styles.navLabelActive]}>Rides</Text>
        {currentTab === 'rides' && <View style={styles.activeDot} />}
      </TouchableOpacity>

      {/* Activity Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress('activity')}
        activeOpacity={0.8}
      >
        <Text style={[styles.navIcon, currentTab === 'activity' && styles.navIconActive]}>📋</Text>
        <Text style={[styles.navLabel, currentTab === 'activity' && styles.navLabelActive]}>Activity</Text>
        {currentTab === 'activity' && <View style={styles.activeDot} />}
      </TouchableOpacity>

      {/* Wallet Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress('wallet')}
        activeOpacity={0.8}
      >
        <Text style={[styles.navIcon, currentTab === 'wallet' && styles.navIconActive]}>💳</Text>
        <Text style={[styles.navLabel, currentTab === 'wallet' && styles.navLabelActive]}>Wallet</Text>
        {currentTab === 'wallet' && <View style={styles.activeDot} />}
      </TouchableOpacity>

      {/* Account Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress('account')}
        activeOpacity={0.8}
      >
        <Text style={[styles.navIcon, currentTab === 'account' && styles.navIconActive]}>👤</Text>
        <Text style={[styles.navLabel, currentTab === 'account' && styles.navLabelActive]}>Account</Text>
        {currentTab === 'account' && <View style={styles.activeDot} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    height: 60,
    backgroundColor: '#121619',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    elevation: 8,
    zIndex: 30
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative'
  },
  navIcon: {
    fontSize: 16,
    color: '#929A96',
    marginBottom: 2
  },
  navIconActive: {
    color: '#C7FF3D'
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#929A96',
    letterSpacing: -0.2
  },
  navLabelActive: {
    color: '#F4F6F3',
    fontWeight: '800'
  },
  activeDot: {
    position: 'absolute',
    bottom: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C7FF3D'
  }
});
