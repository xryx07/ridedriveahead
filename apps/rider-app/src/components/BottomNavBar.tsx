import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenName, useRiderStore } from '../store/useRiderStore';

interface BottomNavBarProps {
  currentTab: 'home' | 'trips' | 'wallet' | 'profile';
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab }) => {
  const { navigate } = useRiderStore();

  const handleTabPress = (tab: 'home' | 'trips' | 'wallet' | 'profile') => {
    switch (tab) {
      case 'home':
        navigate('HOME');
        break;
      case 'trips':
        navigate('RIDE_HISTORY');
        break;
      case 'wallet':
        navigate('TRIP_SUMMARY');
        break;
      case 'profile':
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
        <Text style={[styles.navIcon, currentTab === 'home' && styles.navIconActive]}>⌂</Text>
        <Text style={[styles.navLabel, currentTab === 'home' && styles.navLabelActive]}>Home</Text>
        {currentTab === 'home' && <View style={styles.activeDot} />}
      </TouchableOpacity>

      {/* Trips Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress('trips')}
        activeOpacity={0.8}
      >
        <Text style={[styles.navIcon, currentTab === 'trips' && styles.navIconActive]}>☰</Text>
        <Text style={[styles.navLabel, currentTab === 'trips' && styles.navLabelActive]}>Trips</Text>
        {currentTab === 'trips' && <View style={styles.activeDot} />}
      </TouchableOpacity>

      {/* Wallet Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress('wallet')}
        activeOpacity={0.8}
      >
        <Text style={[styles.navIcon, currentTab === 'wallet' && styles.navIconActive]}>⎚</Text>
        <Text style={[styles.navLabel, currentTab === 'wallet' && styles.navLabelActive]}>Wallet</Text>
        {currentTab === 'wallet' && <View style={styles.activeDot} />}
      </TouchableOpacity>

      {/* Profile Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress('profile')}
        activeOpacity={0.8}
      >
        <Text style={[styles.navIcon, currentTab === 'profile' && styles.navIconActive]}>👤</Text>
        <Text style={[styles.navLabel, currentTab === 'profile' && styles.navLabelActive]}>Profile</Text>
        {currentTab === 'profile' && <View style={styles.activeDot} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 30
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    position: 'relative'
  },
  navIcon: {
    fontSize: 20,
    color: '#94A3B8',
    marginBottom: 2
  },
  navIconActive: {
    color: '#0F172A'
  },
  navLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#94A3B8'
  },
  navLabelActive: {
    color: '#0F172A',
    fontWeight: '900'
  },
  activeDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#A3E635'
  }
});
