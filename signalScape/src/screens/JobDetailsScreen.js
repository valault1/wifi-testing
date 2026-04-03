import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { generateReport } from '../utils/ReportGenerator';

export default function JobDetailsScreen({ jobDetails, setJobDetails, rooms }) {
  
  const handleUpdate = (key, value) => {
    setJobDetails(prev => ({ ...prev, [key]: value }));
  };

  const handleGeneratePDF = async () => {
    await generateReport(jobDetails, rooms);
  };

  const renderInput = (label, key, placeholder, isMultiline = false, keyboardType = 'default') => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, isMultiline && styles.inputMultiline]}
        value={jobDetails[key]}
        onChangeText={(val) => handleUpdate(key, val)}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        multiline={isMultiline}
        numberOfLines={isMultiline ? 3 : 1}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Job Details</Text>
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-outline" size={20} color="#0066FF" />
            <Text style={styles.cardTitle}>Customer Information</Text>
          </View>
          {renderInput('Customer Name', 'customerName', 'John Doe')}
          {renderInput('Email Address', 'customerEmail', 'john@example.com', false, 'email-address')}
          {renderInput('Installation Address', 'address', '123 Main St...', true)}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="hardware-chip-outline" size={20} color="#0066FF" />
            <Text style={styles.cardTitle}>Hardware</Text>
          </View>
          {renderInput('Modem', 'modem', 'Arris SB8200')}
          {renderInput('Routers / APs', 'routers', 'e.g. Eero Pro 6 (Living Room), Eero Pro 6 (Hallway)', true)}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cellular-outline" size={20} color="#0066FF" />
            <Text style={styles.cardTitle}>Service</Text>
          </View>
          {renderInput('Internet Provider (ISP)', 'isp', 'Comcast Xfinity')}
          {renderInput('Max Plan Speed (Mbps)', 'maxPlanSpeed', '1000', false, 'numeric')}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.generateButton} onPress={handleGeneratePDF} activeOpacity={0.8}>
          <Ionicons name="document-text" size={20} color="#fff" />
          <Text style={styles.generateButtonText}>Generate PDF Report</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  cardTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  bottomBar: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: Platform.OS === 'ios' ? 24 : 20,
  },
  generateButton: {
    backgroundColor: '#0066FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 16,
    shadowColor: '#0066FF',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    gap: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  }
});
