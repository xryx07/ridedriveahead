// Polyfills for Hermes Bridgeless mode
if (typeof (global as any).setImmediate === 'undefined') {
  (global as any).setImmediate = (fn: any, ...args: any[]) => setTimeout(fn, 0, ...args);
}
if (typeof (global as any).clearImmediate === 'undefined') {
  (global as any).clearImmediate = (id: any) => clearTimeout(id);
}
if (typeof (global as any).RN$registerCallableModule === 'undefined') {
  (global as any).RN$registerCallableModule = () => {};
}

import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useRiderStore } from './src/store/useRiderStore';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { FareEstimateScreen } from './src/screens/FareEstimateScreen';
import { LiveTrackingScreen } from './src/screens/LiveTrackingScreen';
import { TripSummaryScreen } from './src/screens/TripSummaryScreen';
import { RideHistoryScreen } from './src/screens/RideHistoryScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SosScreen } from './src/screens/SosScreen';

export default function App() {
  const { currentScreen, isAuthenticated } = useRiderStore();

  const renderScreen = () => {
    if (!isAuthenticated) {
      return <LoginScreen />;
    }

    switch (currentScreen) {
      case 'LOGIN':
        return <LoginScreen />;
      case 'HOME':
        return <HomeScreen />;
      case 'FARE_ESTIMATE':
        return <FareEstimateScreen />;
      case 'LIVE_TRACKING':
        return <LiveTrackingScreen />;
      case 'TRIP_SUMMARY':
        return <TripSummaryScreen />;
      case 'RIDE_HISTORY':
        return <RideHistoryScreen />;
      case 'PROFILE':
        return <ProfileScreen />;
      case 'SOS':
        return <SosScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {renderScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  }
});
