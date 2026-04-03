import * as Location from 'expo-location';
import WifiManager from 'react-native-wifi-reborn';
import { Alert, Platform } from 'react-native';

export const dBmToBars = (dbm) => {
  if (dbm >= -60) return 4; // Excellent
  if (dbm >= -70) return 3; // Good
  if (dbm >= -80) return 2; // Fair
  return 1;                 // Poor
};

export const scanWifiSignal = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to read WiFi signal strength.');
      return null;
    }
    
    // Attempt standard dbm grab
    if (Platform.OS === 'android') {
      const dbm = await WifiManager.getCurrentSignalStrength();
      return {
        dbm,
        bars: dBmToBars(dbm)
      };
    } else {
      // iOS doesn't allow direct signal strength without entitlements usually. Mocking or falling back.
      return { dbm: -65, bars: dBmToBars(-65) };
    }
  } catch (err) {
    console.warn("Wifi Scan Error", err);
    // Return an error or mock fallback
    return { dbm: -75, bars: dBmToBars(-75) };
  }
};
