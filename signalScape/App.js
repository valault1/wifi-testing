import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RoomsScreen from './src/screens/RoomsScreen';
import JobDetailsScreen from './src/screens/JobDetailsScreen';
import OptionsScreen from './src/screens/OptionsScreen';

const TABS = [
  { id: 'rooms', label: 'Rooms', icon: 'grid-outline', iconActive: 'grid' },
  { id: 'job', label: 'Report', icon: 'document-text-outline', iconActive: 'document-text' },
  { id: 'options', label: 'Options', icon: 'settings-outline', iconActive: 'settings' },
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
              color={isActive ? '#0066FF' : '#999'}
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
  const [activeTab, setActiveTab] = useState('rooms');
  const [isLoaded, setIsLoaded] = useState(false);

  // Global State
  const [rooms, setRooms] = useState([]);
  const [jobDetails, setJobDetails] = useState({
    customerName: '',
    customerEmail: '',
    address: '',
    routers: '',
    modem: '',
    isp: '',
    maxPlanSpeed: ''
  });
  const [settings, setSettings] = useState({
    provider: 'custom' // 'custom' or 'fast.com'
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedRooms = await AsyncStorage.getItem('@signalscape_rooms');
        if (storedRooms) setRooms(JSON.parse(storedRooms));

        const storedJob = await AsyncStorage.getItem('@signalscape_job');
        if (storedJob) setJobDetails(JSON.parse(storedJob));

        const storedSettings = await AsyncStorage.getItem('@signalscape_settings');
        if (storedSettings) setSettings(JSON.parse(storedSettings));
      } catch (err) {
        console.warn('Failed to load local data', err);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('@signalscape_rooms', JSON.stringify(rooms)).catch(console.warn);
      AsyncStorage.setItem('@signalscape_job', JSON.stringify(jobDetails)).catch(console.warn);
      AsyncStorage.setItem('@signalscape_settings', JSON.stringify(settings)).catch(console.warn);
    }
  }, [rooms, jobDetails, settings, isLoaded]);

  const renderScreen = () => {
    switch (activeTab) {
      case 'rooms':
        return <RoomsScreen rooms={rooms} setRooms={setRooms} settings={settings} />;
      case 'job':
        return <JobDetailsScreen jobDetails={jobDetails} setJobDetails={setJobDetails} rooms={rooms} />;
      case 'options':
        return <OptionsScreen settings={settings} setSettings={setSettings} />;
      default:
        return <RoomsScreen rooms={rooms} setRooms={setRooms} settings={settings} />;
    }
  };

  if (!isLoaded) {
    return null;
  }

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
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'android' ? 24 : 34,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#0066FF',
    fontWeight: '700',
  },
});
