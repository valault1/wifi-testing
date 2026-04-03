import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PROVIDERS } from '../speedtest/providers';

const PROVIDER_ORDER = ['fastcom', 'custom'];

const PROVIDER_ICONS = {
  fastcom:      'flash-outline',
  custom:       'construct-outline',
};

export default function SettingsScreen({ selectedProvider, onSelectProvider }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Speedtest Provider</Text>
      <Text style={styles.sectionSubtitle}>
        Select which service runs when you tap Speedtest.
      </Text>

      {PROVIDER_ORDER.map((id) => {
        const provider = PROVIDERS[id];
        const isSelected = selectedProvider === id;
        return (
          <TouchableOpacity
            key={id}
            style={[styles.providerCard, isSelected && styles.providerCardActive]}
            onPress={() => onSelectProvider(id)}
            activeOpacity={0.75}
          >
            <View style={[styles.iconCircle, isSelected && styles.iconCircleActive]}>
              <Ionicons
                name={PROVIDER_ICONS[id]}
                size={24}
                color={isSelected ? '#FFF' : '#555'}
              />
            </View>
            <View style={styles.providerText}>
              <Text style={[styles.providerLabel, isSelected && styles.providerLabelActive]}>
                {provider.label}
              </Text>
              <Text style={styles.providerSubtitle}>{provider.subtitle}</Text>
            </View>
            {isSelected && (
              <Ionicons name="checkmark-circle" size={22} color="#007BFF" />
            )}
          </TouchableOpacity>
        );
      })}

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={18} color="#0077CC" style={{ marginTop: 1 }} />
        <Text style={styles.infoText}>
          Fast.com opens in a full-screen browser. The Custom engine runs silently in-app via parallel CDN connections.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 20,
    lineHeight: 18,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  providerCardActive: {
    borderColor: '#007BFF',
    backgroundColor: '#F0F7FF',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconCircleActive: {
    backgroundColor: '#007BFF',
  },
  providerText: {
    flex: 1,
  },
  providerLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  providerLabelActive: {
    color: '#007BFF',
  },
  providerSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F4FF',
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
    gap: 10,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#444',
    lineHeight: 18,
  },
});
