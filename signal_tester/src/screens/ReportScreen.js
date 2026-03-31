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
    Modal,
    FlatList,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { generatePdfHtml } from '../pdfGenerator';

export default function ReportScreen({
    locations,
    setLocations
}) {
    const [locationName, setLocationName] = useState('');
    const [wifiProvider, setWifiProvider] = useState('');
    const [wifiSpeed, setWifiSpeed] = useState('');

    // Dynamic Rooms
    const [roomsList, setRoomsList] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');

    // Dynamic Hardware
    const [showModem, setShowModem] = useState(false);
    const [showRouter, setShowRouter] = useState(false);
    const [showCombo, setShowCombo] = useState(false);

    const [modemName, setModemName] = useState('');
    const [routerName, setRouterName] = useState('');
    const [comboName, setComboName] = useState('');

    const [selectedHistoryLocation, setSelectedHistoryLocation] = useState(null);
    const [previewLocation, setPreviewLocation] = useState(null);

    const handleViewPdf = (location) => {
        setPreviewLocation(location);
    };

    const handleSharePdf = async () => {
        if (!previewLocation) return;
        try {
            const { uri } = await Print.printToFileAsync({ html: generatePdfHtml(previewLocation) });
            await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        } catch (err) {
            console.warn(err);
            Alert.alert('Error', 'Failed to generate or share PDF.');
        }
    };

    const handleSaveLocation = () => {
        if (!locationName) {
            Alert.alert('Missing Name', 'Please enter a Location Name to save this session.');
            return;
        }

        const newId = Date.now().toString();

        const newLocation = {
            id: newId,
            name: locationName,
            rooms: roomsList.length > 0 ? roomsList : ['Living Room'], // Default room if none provided
            history: [],
            reportData: {
                locationName,
                wifiProvider,
                wifiSpeed,
                hardwareType: showCombo ? 'combo' : (showModem || showRouter ? 'separate' : 'unknown'),
                modemName,
                routerName,
                comboName,
                numRooms: roomsList.length > 0 ? roomsList.length.toString() : '1'
            }
        };

        setLocations(prev => [...prev, newLocation]);
        Alert.alert('Location Saved', `${locationName} has been saved. You can now start a session for it on the Speed Test tab!`);

        // Clear form
        setLocationName('');
        setRoomsList([]);
        setNewRoomName('');
        setWifiProvider('');
        setWifiSpeed('');
        setModemName('');
        setRouterName('');
        setComboName('');
        setShowModem(false);
        setShowRouter(false);
        setShowCombo(false);
    };

    const handleAddRoom = () => {
        if (!newRoomName.trim()) return;
        setRoomsList(prev => [...prev, newRoomName.trim()]);
        setNewRoomName('');
    };

    const removeRoom = (index) => {
        setRoomsList(prev => prev.filter((_, i) => i !== index));
    };


    const renderHistoryItem = ({ item }) => (
        <View style={styles.historyItem}>
            <View style={styles.historyHeaderRow}>
                <Text style={styles.historyRoom}>{item.room || 'Generic'}</Text>
                <Text style={[styles.historyTypeBadge, item.type === 'Speedtest' ? styles.pillSpeed : styles.pillSignal]}>
                    {item.type}
                </Text>
            </View>
            <View style={styles.historyBody}>
                {item.type === 'Speedtest' ? (
                    <Text style={styles.historyDetails}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.speed}</Text>
                        {item.extras?.length > 0 ? `\n${item.extras.join('  ·  ')}` : ''}
                        {item.provider ? `\nvia ${item.provider}` : ''}
                    </Text>
                ) : (
                    <Text style={styles.historyDetails}>
                        {item.bands ? Object.entries(item.bands).map(([b, v]) => `${b}: ${v}`).join('\n') : 'N/A'}
                    </Text>
                )}
            </View>
            <Text style={styles.historyTime}>{item.timestamp}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <Modal visible={!!selectedHistoryLocation} animationType="slide" presentationStyle="pageSheet">
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{selectedHistoryLocation?.name}</Text>
                        <TouchableOpacity onPress={() => setSelectedHistoryLocation(null)}>
                            <Ionicons name="close-circle" size={28} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={selectedHistoryLocation?.history || []}
                        keyExtractor={(it, idx) => it.id || idx.toString()}
                        renderItem={renderHistoryItem}
                        contentContainerStyle={{ padding: 20 }}
                        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#666', marginTop: 40 }}>No test history recorded.</Text>}
                    />
                </View>
            </Modal>

            {/* HTML PDF Preview Modal */}
            <Modal visible={!!previewLocation} animationType="slide" presentationStyle="pageSheet">
                <View style={[styles.modalContainer, { paddingTop: Platform.OS === 'ios' ? 40 : 10 }]}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setPreviewLocation(null)} style={{ padding: 4 }}>
                            <Text style={{ color: '#007BFF', fontSize: 16, fontWeight: 'bold' }}>Close</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Report Preview</Text>
                        <TouchableOpacity onPress={handleSharePdf} style={{ padding: 4, flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="share-outline" size={20} color="#007BFF" style={{ marginRight: 6 }} />
                            <Text style={{ color: '#007BFF', fontSize: 16, fontWeight: 'bold' }}>Send</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, backgroundColor: '#fff' }}>
                        {previewLocation && (
                            <WebView
                                source={{ html: generatePdfHtml(previewLocation) }}
                                originWhitelist={['*']}
                                scalesPageToFit={true}
                                bounces={false}
                            />
                        )}
                    </View>
                </View>
            </Modal>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Locations</Text>
                    <Text style={styles.subtitle}>Manage your saved testing properties.</Text>
                </View>

                {locations && locations.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.label}>Saved Locations</Text>
                        {locations.map(loc => (
                            <View key={loc.id} style={styles.savedLocationItem}>
                                <View style={styles.locHeaderRow}>
                                    <Text style={styles.savedLocationName}>{loc.name}</Text>
                                    <Text style={styles.savedLocationRooms}>{loc.rooms?.length || 0} rooms</Text>
                                </View>
                                <View style={styles.locActionRow}>
                                    <TouchableOpacity style={styles.locActionBtn} onPress={() => setSelectedHistoryLocation(loc)}>
                                        <Ionicons name="list" size={16} color="#007BFF" />
                                        <Text style={styles.locActionBtnText}>View Tests</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.locActionBtn} onPress={() => handleViewPdf(loc)}>
                                        <Ionicons name="document-text" size={16} color="#28A745" />
                                        <Text style={[styles.locActionBtnText, { color: '#28A745' }]}>View PDF</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                <View style={styles.card}>
                    <Text style={styles.formTitle}>Add New Location</Text>
                    <Text style={styles.label}>Location Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Smith Residence / HQ Office"
                        value={locationName}
                        onChangeText={setLocationName}
                    />

                    <Text style={styles.label}>Rooms</Text>
                    <View style={styles.addInputRow}>
                        <TextInput
                            style={[styles.input, { flex: 1, marginBottom: 0 }]}
                            placeholder="e.g. Living Room"
                            value={newRoomName}
                            onChangeText={setNewRoomName}
                            onSubmitEditing={handleAddRoom}
                        />
                        <TouchableOpacity style={styles.addBtn} onPress={handleAddRoom}>
                            <Ionicons name="add" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {roomsList.length > 0 && (
                        <View style={styles.roomChipsContainer}>
                            {roomsList.map((rm, idx) => (
                                <View key={idx} style={styles.roomChip}>
                                    <Text style={styles.roomChipText}>{rm}</Text>
                                    <TouchableOpacity onPress={() => removeRoom(idx)}>
                                        <Ionicons name="close-circle" size={16} color="#888" style={{ marginLeft: 6 }} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}

                    <Text style={styles.label}>WiFi Provider</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Xfinity"
                        value={wifiProvider}
                        onChangeText={setWifiProvider}
                    />

                    <Text style={styles.label}>WiFi Speed Tier</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 1.2 Gbps"
                        value={wifiSpeed}
                        onChangeText={setWifiSpeed}
                    />

                    <Text style={styles.label}>Hardware Configuration</Text>
                    <View style={styles.hardwareOptionsRow}>
                        {!showModem && (
                            <TouchableOpacity style={styles.addHardwareBtn} onPress={() => setShowModem(true)}>
                                <Ionicons name="add-circle-outline" size={18} color="#007BFF" />
                                <Text style={styles.addHardwareBtnText}>Add Modem</Text>
                            </TouchableOpacity>
                        )}
                        {!showRouter && (
                            <TouchableOpacity style={styles.addHardwareBtn} onPress={() => setShowRouter(true)}>
                                <Ionicons name="add-circle-outline" size={18} color="#007BFF" />
                                <Text style={styles.addHardwareBtnText}>Add Router</Text>
                            </TouchableOpacity>
                        )}
                        {!showCombo && (
                            <TouchableOpacity style={styles.addHardwareBtn} onPress={() => setShowCombo(true)}>
                                <Ionicons name="add-circle-outline" size={18} color="#007BFF" />
                                <Text style={styles.addHardwareBtnText}>Add Combo</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {showModem && (
                        <View style={styles.hardwareInputBlock}>
                            <Text style={styles.subLabel}>Modem Name</Text>
                            <TextInput
                                style={styles.inputSmall}
                                placeholder="e.g. Arris SB8200"
                                value={modemName}
                                onChangeText={setModemName}
                            />
                        </View>
                    )}

                    {showRouter && (
                        <View style={styles.hardwareInputBlock}>
                            <Text style={styles.subLabel}>Router Name</Text>
                            <TextInput
                                style={styles.inputSmall}
                                placeholder="e.g. Eero Pro 6"
                                value={routerName}
                                onChangeText={setRouterName}
                            />
                        </View>
                    )}

                    {showCombo && (
                        <View style={styles.hardwareInputBlock}>
                            <Text style={styles.subLabel}>Modem/Router Combo Name</Text>
                            <TextInput
                                style={styles.inputSmall}
                                placeholder="e.g. Netgear Nighthawk C7000"
                                value={comboName}
                                onChangeText={setComboName}
                            />
                        </View>
                    )}
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveLocation}>
                    <Ionicons name="location" size={20} color="#FFF" />
                    <Text style={styles.saveBtnText}>Save Location</Text>
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
    locationSelector: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    locPill: {
        backgroundColor: '#E9ECEF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#CED4DA',
        justifyContent: 'center',
    },
    locPillActive: {
        backgroundColor: '#007BFF',
        borderColor: '#0056b3',
    },
    locPillText: {
        color: '#495057',
        fontWeight: 'bold',
        fontSize: 14,
    },
    locPillTextActive: {
        color: '#FFF',
    },
    locPillAdd: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderColor: '#007BFF',
        borderStyle: 'dashed',
    },
    locPillTextAdd: {
        color: '#007BFF',
        fontWeight: 'bold',
        marginLeft: 4,
        fontSize: 14,
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
    saveBtn: {
        backgroundColor: '#6f42c1',
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        gap: 8,
    },
    saveBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
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
    savedLocationItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    locHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    locActionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    locActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f3f5',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        gap: 4,
    },
    locActionBtnText: {
        color: '#007BFF',
        fontWeight: '600',
        fontSize: 13,
    },
    savedLocationName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    savedLocationRooms: {
        fontSize: 14,
        color: '#666',
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 16,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111',
    },
    historyItem: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    historyHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    historyRoom: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111',
    },
    historyTypeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFF',
        overflow: 'hidden',
    },
    pillSpeed: { backgroundColor: '#28A745' },
    pillSignal: { backgroundColor: '#007BFF' },
    historyBody: {
        marginBottom: 8,
    },
    historyDetails: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },
    historyTime: {
        fontSize: 12,
        color: '#888',
        textAlign: 'right',
    },
    addInputRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 12,
    },
    addBtn: {
        backgroundColor: '#007BFF',
        borderRadius: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    roomChipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    roomChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e2e8f0',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    roomChipText: {
        fontSize: 14,
        color: '#475569',
        fontWeight: '600',
    },
    hardwareOptionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 12,
    },
    addHardwareBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 6,
    },
    addHardwareBtnText: {
        color: '#007BFF',
        fontWeight: '600',
        fontSize: 14,
    },
    hardwareInputBlock: {
        marginBottom: 12,
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
});
