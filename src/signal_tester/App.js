import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import SignalScreen from './src/screens/SignalScreen';
import ReportScreen from './src/screens/ReportScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { DEFAULT_PROVIDER } from './src/speedtest/providers';

const TABS = [
  { id: 'signal', label: 'Speed Test', icon: 'speedometer-outline', iconActive: 'speedometer' },
  { id: 'report', label: 'Locations', icon: 'location-outline', iconActive: 'location' },
  { id: 'settings', label: 'Settings', icon: 'settings-outline', iconActive: 'settings' },
];

function TabBar({ activeTab, onSelect }) {
  return (
    <View style={styles.tabBar}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => onSelect(tab.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.icon}
              size={24}
              color={isActive ? '#28A745' : '#999'}
            />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('signal');
  const [speedtestProvider, setSpeedtestProvider] = useState(DEFAULT_PROVIDER);

  // --- Global Locations State ---
  const [locations, setLocations] = useState([
    {
      id: 'default',
      name: 'Default Location',
      rooms: ['Living Room', 'Garage'],
      history: [],
      reportData: {
        locationName: '',
        numRooms: '',
        roomNames: '',
        wifiPlan: '',
        hardwareType: 'separate',
        modemName: '',
        routerName: '',
        comboName: ''
      }
    }
  ]);
  const [activeLocationId, setActiveLocationId] = useState(null);

  const activeLocation = locations.find(loc => loc.id === activeLocationId);

  const updateActiveLocation = (updates) => {
    setLocations(prev => prev.map(loc =>
      loc.id === activeLocationId ? { ...loc, ...updates } : loc
    ));
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'signal':
        return (
          <SignalScreen
            speedtestProviderKey={speedtestProvider}
            activeLocation={activeLocation}
            updateActiveLocation={updateActiveLocation}
            locations={locations}
            setActiveLocationId={setActiveLocationId}
          />
        );
      case 'report':
        return (
          <ReportScreen
            locations={locations}
            setLocations={setLocations}
            activeLocationId={activeLocationId}
            setActiveLocationId={setActiveLocationId}
            activeLocation={activeLocation}
            updateActiveLocation={updateActiveLocation}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            selectedProvider={speedtestProvider}
            onSelectProvider={setSpeedtestProvider}
          />
        );
      default:
        return <SignalScreen speedtestProviderKey={speedtestProvider} />;
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.screenArea}>
        {renderScreen()}
      </View>
      <TabBar activeTab={activeTab} onSelect={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === 'android' ? 36 : 0,
  },
  screenArea: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    // Add extra padding at the bottom for Android navigation and iOS home bar
    paddingBottom: Platform.OS === 'android' ? 24 : 34,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#28A745',
    fontWeight: '700',
  },
});
