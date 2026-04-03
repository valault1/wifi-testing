import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { PROVIDERS } from '../engines/providers';
import { scanWifiSignal } from '../engines/WifiEngine';

export default function RoomsScreen({ rooms, setRooms, settings }) {
  const [testingRoomId, setTestingRoomId] = useState(null);
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [testType, setTestType] = useState(null); // 'speed' or 'signal'
  const [testStatus, setTestStatus] = useState('');
  const [currentSpeed, setCurrentSpeed] = useState(0);

  const [addRoomModalVisible, setAddRoomModalVisible] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const webViewRef = useRef(null);
  const pollIntervalRef = useRef(null);

  const provider = PROVIDERS[settings.provider || 'custom'];
  const isCustomProvider = provider?.id === 'custom';

  const handleAddRoom = () => {
    setNewRoomName(`Room ${rooms.length + 1}`);
    setAddRoomModalVisible(true);
  };

  const confirmAddRoom = () => {
    if (!newRoomName.trim()) {
      Alert.alert('Invalid Name', 'Room name cannot be empty.');
      return;
    }
    const newRoom = {
      id: Date.now().toString(),
      name: newRoomName.trim(),
      signal: null,
      speed: null,
    };
    setRooms(prev => [...prev, newRoom]);
    setAddRoomModalVisible(false);
    setNewRoomName('');
  };

  const handleRemoveRoom = (id) => {
    Alert.alert('Remove Room', 'Are you sure you want to delete this room?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setRooms(prev => prev.filter(r => r.id !== id)) }
    ]);
  };

  const handleEditRoomName = (id, newName) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, name: newName } : r));
  };

  const startPolling = useCallback(() => {
    if (!provider.pollJs) return;
    pollIntervalRef.current = setInterval(() => {
      webViewRef.current?.injectJavaScript(provider.pollJs);
    }, 2000);
  }, [provider]);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const onWebViewMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.status === 'PROGRESS') {
        if (data.message) setTestStatus(data.message);
        if (data.mbps !== undefined) setCurrentSpeed(data.mbps);
      } else if (data.status === 'FINISHED') {
        stopPolling();
        completeTest(testingRoomId, 'speed', { value: Math.round(data.mbps) });
      }
    } catch (_) {}
  }, [testingRoomId, stopPolling]);

  const startTest = async (roomId, type) => {
    setTestingRoomId(roomId);
    setTestType(type);
    setCurrentSpeed(0);
    setTestModalVisible(true);
    setTestStatus(`Starting ${type === 'speed' ? 'Speed' : 'Signal'} Test...`);
    
    if (type === 'signal') {
      const result = await scanWifiSignal();
      if (result) {
        completeTest(roomId, 'signal', result);
      } else {
        setTestModalVisible(false); // Permissions denied
      }
    }
    // For speed test, the WebView handles it automatically on load.
  };

  const completeTest = (roomId, type, result) => {
    setRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        if (type === 'speed') return { ...r, speed: { mbps: result.value } };
        if (type === 'signal') return { ...r, signal: { bars: result.bars, dbm: result.dbm } };
      }
      return r;
    }));
    setTestModalVisible(false);
    setTestingRoomId(null);
  };

  const renderRoom = (room) => {
    return (
      <View key={room.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.roomNameContainer}>
            <TextInput
              style={styles.roomNameInput}
              value={room.name}
              onChangeText={(text) => handleEditRoomName(room.id, text)}
              placeholder="Room Name"
              placeholderTextColor="#aaa"
              underlineColorAndroid="transparent"
            />
          </View>
          <TouchableOpacity onPress={() => handleRemoveRoom(room.id)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={20} color="#ff3b30" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Ionicons name="wifi" size={24} color={room.signal ? '#10B981' : '#ccc'} />
            <Text style={[styles.metricText, room.signal && styles.metricTextActive]}>
              {room.signal ? `${room.signal.bars} Bars (${room.signal.dbm} dBm)` : 'No Signal Data'}
            </Text>
          </View>
          <View style={styles.metric}>
            <Ionicons name="speedometer" size={24} color={room.speed ? '#0066FF' : '#ccc'} />
            <Text style={[styles.metricText, room.speed && styles.metricTextActive]}>
              {room.speed ? `${room.speed.mbps} Mbps` : 'No Speed Data'}
            </Text>
          </View>
        </View>
        
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={[styles.actionBtn, room.signal && styles.actionBtnDone]} 
            onPress={() => startTest(room.id, 'signal')}
          >
            <Ionicons name="scan-outline" size={18} color={room.signal ? '#10B981' : '#666'} />
            <Text style={[styles.actionBtnText, room.signal && { color: '#10B981' }]}>
              {room.signal ? 'Rescan Signal' : 'Scan Signal'}
            </Text>
          </TouchableOpacity>
          <View style={styles.actionDivider} />
          <TouchableOpacity 
            style={[styles.actionBtn, room.speed && styles.actionBtnDone]} 
            onPress={() => startTest(room.id, 'speed')}
          >
            <Ionicons name="flash" size={18} color={room.speed ? '#0066FF' : '#666'} />
            <Text style={[styles.actionBtnText, room.speed && { color: '#0066FF' }]}>
              {room.speed ? 'Retest Speed' : 'Test Speed'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Locations</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddRoom}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Add Room</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.list}>
        {rooms.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="home-outline" size={64} color="#e0e0e0" />
            <Text style={styles.emptyText}>No test locations yet.</Text>
            <Text style={styles.emptySubText}>Add a room to begin testing speed and signal coverage.</Text>
          </View>
        ) : (
          rooms.map(renderRoom)
        )}
      </ScrollView>

      <Modal visible={testModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{testType === 'speed' ? 'Live Speed Test' : 'Signal Scan'}</Text>
            
            {testType === 'speed' ? (
              <View style={styles.speedCircle}>
                <Text style={styles.liveSpeedText}>{currentSpeed > 0 ? currentSpeed.toFixed(0) : '--'}</Text>
                <Text style={styles.liveSpeedUnit}>Mbps</Text>
              </View>
            ) : (
              <View style={styles.modalCircle}>
                <ActivityIndicator size="large" color="#0066FF" />
              </View>
            )}

            <Text style={styles.modalStatus}>{testStatus}</Text>
            {settings.provider === 'fast.com' && testType === 'speed' && (
              <Text style={styles.modalProviderLabel}>Powered by Fast.com</Text>
            )}

            <TouchableOpacity 
              style={styles.cancelBtn} 
              onPress={() => {
                stopPolling();
                setTestModalVisible(false);
              }}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={addRoomModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlayCenter}>
          <View style={styles.modalCard}>
            <Text style={styles.modalCardTitle}>Add Room</Text>
            <TextInput
              style={styles.addRoomInput}
              value={newRoomName}
              onChangeText={setNewRoomName}
              placeholder="e.g. Living Room"
              placeholderTextColor="#aaa"
              autoFocus
            />
            <View style={styles.modalCardActions}>
              <TouchableOpacity style={styles.modalCardCancelBtn} onPress={() => setAddRoomModalVisible(false)}>
                <Text style={styles.modalCardCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCardAddBtn} onPress={confirmAddRoom}>
                <Text style={styles.modalCardAddBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Hidden WebView for Speedtest Engine */}
      {testModalVisible && testType === 'speed' && provider && (
        <View style={styles.hiddenWebView} pointerEvents="none">
          {isCustomProvider ? (
            <WebView
              ref={webViewRef}
              source={{ html: provider.html }}
              originWhitelist={['*']}
              onMessage={onWebViewMessage}
              javaScriptEnabled
            />
          ) : (
            <WebView
              ref={webViewRef}
              source={{ uri: provider.url }}
              userAgent="Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
              onLoad={startPolling}
              onMessage={onWebViewMessage}
              javaScriptEnabled
              domStorageEnabled
            />
          )}
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#121212' },
  addBtn: {
    backgroundColor: '#0066FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },
  addBtnText: { color: '#fff', fontWeight: '700', marginLeft: 6, fontSize: 14 },
  list: { padding: 20, paddingBottom: 60 },
  emptyState: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#666', marginTop: 16, textAlign: 'center' },
  emptySubText: { fontSize: 14, color: '#aaa', marginTop: 8, textAlign: 'center', lineHeight: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 0,
    alignItems: 'center',
  },
  roomNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  roomNameInput: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#333', 
    padding: 0, 
    margin: 0, 
    flex: 1 
  },
  editIcon: {
    marginLeft: 8,
  },
  deleteBtn: {
    padding: 4,
  },
  roomName: { fontSize: 18, fontWeight: '700', color: '#333' },
  metricsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  metric: { flex: 1, alignItems: 'center', backgroundColor: '#f9f9f9', padding: 12, borderRadius: 12 },
  metricText: { fontSize: 13, color: '#aaa', fontWeight: '600', marginTop: 8 },
  metricTextActive: { color: '#333' },
  actionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fbfcff',
  },
  actionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, gap: 8 },
  actionBtnText: { fontSize: 14, fontWeight: '600', color: '#666' },
  actionBtnDone: { backgroundColor: '#fff' },
  actionDivider: { width: 1, backgroundColor: '#eee' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 24,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalCardTitle: { fontSize: 20, fontWeight: '800', color: '#333', marginBottom: 16 },
  addRoomInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
    backgroundColor: '#fafafa',
  },
  modalCardActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 12 },
  modalCardCancelBtn: { padding: 10 },
  modalCardCancelBtnText: { color: '#666', fontSize: 16, fontWeight: '600' },
  modalCardAddBtn: { backgroundColor: '#0066FF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  modalCardAddBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#333', marginBottom: 24 },
  modalCircle: {
    width: 120, height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  speedCircle: {
    width: 160, height: 160,
    borderRadius: 80,
    borderWidth: 8,
    borderColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fbfcff',
  },
  liveSpeedText: { fontSize: 42, fontWeight: '900', color: '#0066FF' },
  liveSpeedUnit: { fontSize: 16, fontWeight: '700', color: '#666', marginTop: -4 },
  modalStatus: { fontSize: 16, color: '#666', fontWeight: '600' },
  modalProviderLabel: { fontSize: 12, color: '#aaa', marginTop: 12 },
  cancelBtn: { marginTop: 24, padding: 12 },
  cancelBtnText: { color: '#ff3b30', fontSize: 16, fontWeight: '700' },
  hiddenWebView: { position: 'absolute', width: 0, height: 0, opacity: 0 },
});
