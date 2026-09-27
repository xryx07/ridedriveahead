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
import { useDriverStore } from './src/store/useDriverStore';
import { DriverHomeScreen } from './src/screens/DriverHomeScreen';
import { KycUploadScreen } from './src/screens/KycUploadScreen';
import { ScheduledRidesScreen } from './src/screens/ScheduledRidesScreen';
import { ActiveTripScreen } from './src/screens/ActiveTripScreen';
import { EarningsScreen } from './src/screens/EarningsScreen';
import { TripHistoryScreen } from './src/screens/TripHistoryScreen';
import { DriverProfileScreen } from './src/screens/DriverProfileScreen';
import { DriverLoginScreen } from './src/screens/DriverLoginScreen';

export default function App() {
  const { currentScreen, isAuthenticated } = useDriverStore();

  const renderScreen = () => {
    if (!isAuthenticated || currentScreen === 'LOGIN') {
      return <DriverLoginScreen />;
    }

    switch (currentScreen) {
      case 'HOME':
        return <DriverHomeScreen />;
      case 'KYC_UPLOAD':
        return <KycUploadScreen />;
      case 'SCHEDULED_RIDES':
        return <ScheduledRidesScreen />;
      case 'ACTIVE_TRIP':
        return <ActiveTripScreen />;
      case 'EARNINGS':
        return <EarningsScreen />;
      case 'TRIP_HISTORY':
        return <TripHistoryScreen />;
      case 'PROFILE':
        return <DriverProfileScreen />;
      default:
        return <DriverHomeScreen />;
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
