import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import SignalScreen from './src/screens/SignalScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { DEFAULT_PROVIDER } from './src/speedtest/providers';

const TABS = [
  { id: 'signal',   label: 'Scanner', icon: 'wifi',          iconActive: 'wifi' },
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
              color={isActive ? '#007BFF' : '#999'}
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

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.screenArea}>
        {activeTab === 'signal' ? (
          <SignalScreen speedtestProviderKey={speedtestProvider} />
        ) : (
          <SettingsScreen
            selectedProvider={speedtestProvider}
            onSelectProvider={setSpeedtestProvider}
          />
        )}
      </View>
      <TabBar activeTab={activeTab} onSelect={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: Platform.OS === 'android' ? 36 : 50,
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
    paddingBottom: 12,
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
    color: '#007BFF',
    fontWeight: '700',
  },
});
