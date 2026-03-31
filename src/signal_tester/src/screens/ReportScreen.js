import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ReportScreen() {
    const [locationName, setLocationName] = useState('');
    const [numRooms, setNumRooms] = useState('');
    const [roomNames, setRoomNames] = useState('');
    const [wifiPlan, setWifiPlan] = useState('');
    const [hardwareType, setHardwareType] = useState('separate'); // 'separate' or 'combo'
    const [modemName, setModemName] = useState('');
    const [routerName, setRouterName] = useState('');
    const [comboName, setComboName] = useState('');

    const handleCreateReport = () => {
        if (!locationName || !numRooms || !roomNames || !wifiPlan) {
            Alert.alert('Missing Information', 'Please fill in all fields before generating the report.');
            return;
        }

        const hardwareData = hardwareType === 'separate'
            ? { type: 'Separate', modem: modemName, router: routerName }
            : { type: 'Combo', name: comboName };

        // placeholder for report generation logic
        console.log('Generating Report with data:', {
            locationName,
            numRooms,
            roomNames,
            wifiPlan,
            hardware: hardwareData,
        });

        const hardwareDisplay = hardwareType === 'separate'
            ? `Modem: ${modemName || 'None'}, Router: ${routerName || 'None'}`
            : `Combo: ${comboName || 'None'}`;

        Alert.alert('Report Data Captured', `Location: ${locationName}\nRooms: ${numRooms}\nPlan: ${wifiPlan}\nHardware: ${hardwareDisplay}`);
    };

    const HardwareToggle = ({ label, isActive, onPress, icon }) => (
        <TouchableOpacity
            style={[styles.hardwareBtn, isActive && styles.hardwareBtnActive]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Ionicons
                name={icon}
                size={24}
                color={isActive ? '#FFF' : '#007BFF'}
                style={styles.hardwareIcon}
            />
            <Text style={[styles.hardwareBtnText, isActive && styles.hardwareBtnTextActive]}>
                {label}
            </Text>
            {isActive && <Ionicons name="checkmark-circle" size={20} color="#FFF" />}
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Report</Text>
                    <Text style={styles.subtitle}>Enter property details for your WiFi assessment.</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Location Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Smith Residence / HQ Office"
                        value={locationName}
                        onChangeText={setLocationName}
                    />

                    <Text style={styles.label}>Number of Rooms</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 5"
                        keyboardType="numeric"
                        value={numRooms}
                        onChangeText={setNumRooms}
                    />

                    <Text style={styles.label}>Room Names</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="e.g. Living Room, Kitchen, Master Bedroom..."
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                        value={roomNames}
                        onChangeText={setRoomNames}
                    />

                    <Text style={styles.label}>Current WiFi Plan</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Xfinity Gig (1200 Mbps)"
                        value={wifiPlan}
                        onChangeText={setWifiPlan}
                    />

                    <Text style={styles.label}>Hardware Configuration</Text>
                    <View style={styles.hardwareRow}>
                        <HardwareToggle
                            label="Separate"
                            icon="git-branch-outline"
                            isActive={hardwareType === 'separate'}
                            onPress={() => setHardwareType('separate')}
                        />
                        <HardwareToggle
                            label="Combo"
                            icon="layers-outline"
                            isActive={hardwareType === 'combo'}
                            onPress={() => setHardwareType('combo')}
                        />
                    </View>

                    {hardwareType === 'separate' ? (
                        <View style={styles.nameInputsRow}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.subLabel}>Modem Name</Text>
                                <TextInput
                                    style={styles.inputSmall}
                                    placeholder="e.g. Arbis SB8200"
                                    value={modemName}
                                    onChangeText={setModemName}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.subLabel}>Router Name</Text>
                                <TextInput
                                    style={styles.inputSmall}
                                    placeholder="e.g. Eero Pro 6"
                                    value={routerName}
                                    onChangeText={setRouterName}
                                />
                            </View>
                        </View>
                    ) : (
                        <View style={{ marginTop: 12 }}>
                            <Text style={styles.subLabel}>Combo Modem/Router Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Netgear Nighthawk C7000"
                                value={comboName}
                                onChangeText={setComboName}
                            />
                        </View>
                    )}
                </View>

                <TouchableOpacity style={styles.submitBtn} onPress={handleCreateReport}>
                    <Text style={styles.submitBtnText}>Generate Report Preview</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#111',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#444',
        marginBottom: 8,
        marginTop: 16,
    },
    subLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
        marginTop: 12,
    },
    input: {
        backgroundColor: '#F1F3F5',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    inputSmall: {
        backgroundColor: '#F1F3F5',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        color: '#333',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    textArea: {
        minHeight: 80,
    },
    nameInputsRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 4,
    },
    hardwareRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    hardwareBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#007BFF',
        borderRadius: 12,
        paddingVertical: 12,
        gap: 8,
    },
    hardwareBtnActive: {
        backgroundColor: '#007BFF',
    },
    hardwareBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#007BFF',
    },
    hardwareBtnTextActive: {
        color: '#FFF',
    },
    hardwareIcon: {
        marginRight: 4,
    },
    submitBtn: {
        backgroundColor: '#28A745',
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#28A745',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    submitBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
    },
});
