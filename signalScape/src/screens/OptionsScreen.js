import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function OptionsScreen({ settings, setSettings }) {
  
  const handleSelectProvider = (provider) => {
    setSettings((prev) => ({ ...prev, provider }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Speed Test Engine</Text>

        <TouchableOpacity 
          style={[styles.card, settings.provider === 'custom' && styles.cardActive]}
          onPress={() => handleSelectProvider('custom')}
          activeOpacity={0.7}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="flash-outline" size={24} color={settings.provider === 'custom' ? '#fff' : '#0066FF'} />
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, settings.provider === 'custom' && styles.textActive]}>Custom Engine (Recommended)</Text>
            <Text style={[styles.cardDescription, settings.provider === 'custom' && styles.textActiveDimmed]}>
              High-performance XHR peak-tracker tuned for accurate gigabit testing without excess data usage.
            </Text>
          </View>
          {settings.provider === 'custom' && (
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, settings.provider === 'fast.com' && styles.cardActive]}
          onPress={() => handleSelectProvider('fast.com')}
          activeOpacity={0.7}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="logo-netflix" size={24} color={settings.provider === 'fast.com' ? '#fff' : '#E50914'} />
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, settings.provider === 'fast.com' && styles.textActive]}>Fast.com</Text>
            <Text style={[styles.cardDescription, settings.provider === 'fast.com' && styles.textActiveDimmed]}>
              Netflix's engine via WebView. Good alternative but can cap out on higher tier connections.
            </Text>
          </View>
          {settings.provider === 'fast.com' && (
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutText}>signalScape v1.0.0</Text>
          <Text style={styles.aboutSub}>Designed for Pro Technicians</Text>
        </View>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#121212',
    marginBottom: 24,
    marginTop: 10,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardActive: {
    backgroundColor: '#0066FF',
    borderColor: '#0066FF',
    shadowOpacity: 0.1,
    shadowColor: '#0066FF',
    shadowRadius: 12,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#777',
    lineHeight: 18,
  },
  textActive: {
    color: '#fff',
  },
  textActiveDimmed: {
    color: 'rgba(255,255,255,0.8)',
  },
  aboutCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  aboutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  aboutSub: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  }
});
