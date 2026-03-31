import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
  Alert,
  Modal,
  SafeAreaView,
} from 'react-native';
import * as Location from 'expo-location';
import WifiManager from 'react-native-wifi-reborn';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { WebView } from 'react-native-webview';
import { generatePdfHtml } from '../pdfGenerator';
import { PROVIDERS } from '../speedtest/providers';
import SpeedCheckerScreen from './SpeedCheckerScreen';

export default function SignalScreen({ speedtestProviderKey }) {
  const [rooms, setRooms] = useState(['Living Room', 'Garage']);
  const [newRoom, setNewRoom] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState('Running Test...');
  const [activeRoom, setActiveRoom] = useState(null);
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [activeRoomForTest, setActiveRoomForTest] = useState(null);
  const webViewRef = useRef(null);
  const pollIntervalRef = useRef(null);

  const provider = PROVIDERS[speedtestProviderKey] || PROVIDERS.ookla;
  const isNativeProvider = provider.type === 'native';
  const isCustomProvider = provider.id === 'custom';
  const isSilentProvider = provider.id === 'librespeed' || provider.id === 'fastcom';

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to read WiFi signal strength on Android.');
    }
  };

  // ── Speedtest ──────────────────────────────────────────────────────────────

  const startPolling = useCallback(() => {
    if (!provider.pollJs) return; // custom engine posts its own message
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
        setProgressText(data.message);
      } else if (data.status === 'FINISHED' && data.mbps > 0) {
        stopPolling();
        setTestModalVisible(false);
        setLoading(false);
        setHistory((prev) => [
          {
            id: Date.now().toString(),
            room: activeRoomForTest,
            type: 'Speedtest',
            speed: `${data.mbps.toFixed(1)} Mbps`,
            provider: provider.label,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);
      }
    } catch (_) {
      // ignore non-JSON messages from third-party page scripts
    }
  }, [activeRoomForTest, stopPolling, provider]);

  // Handler for SpeedChecker native result
  const onNativeResult = useCallback(({ mbps, ping, upload }) => {
    setTestModalVisible(false);
    setLoading(false);
    const parts = [`${mbps.toFixed(1)} Mbps`];
    if (ping)   parts.push(`Ping: ${ping.toFixed(0)} ms`);
    if (upload) parts.push(`↑ ${upload.toFixed(1)} Mbps`);
    setHistory((prev) => [
      {
        id: Date.now().toString(),
        room: activeRoomForTest,
        type: 'Speedtest',
        speed: parts[0],
        extras: parts.slice(1),
        provider: provider.label,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  }, [activeRoomForTest, provider]);

  const executeSpeedtest = () => {
    if (!activeRoom) {
      Alert.alert('No Room Selected', 'Please select a room from the grid first.');
      return;
    }
    setActiveRoomForTest(activeRoom);
    setProgressText('Running Test...');
    setLoading(true);
    if (!isSilentProvider) {
      setTestModalVisible(true);
    }
  };

  const cancelSpeedtest = () => {
    stopPolling();
    setTestModalVisible(false);
    setLoading(false);
  };

  // ── Signal Scan ────────────────────────────────────────────────────────────

  const executeSignalScan = async () => {
    if (!activeRoom) {
      Alert.alert('No Room Selected', 'Please select a room from the grid first.');
      return;
    }

    setLoading(true);
    const bandData = { '2.4GHz': 'N/A', '5GHz': 'N/A', '6GHz': 'N/A' };

    try {
      if (Platform.OS === 'android') {
        const ssid = await WifiManager.getCurrentWifiSSID();
        const networks = await WifiManager.reScanAndLoadWifiList();
        const bareSsid = ssid.replace(/(^\")|(\"$)/g, '');
        const targets = networks.filter(n => n.SSID.replace(/(^\")|(\"$)/g, '') === bareSsid);

        let s24 = -1000, s5 = -1000, s6 = -1000;
        targets.forEach(({ frequency: f, level }) => {
          if (f >= 2400 && f < 2500)       { if (level > s24) s24 = level; }
          else if (f >= 5100 && f < 5900)  { if (level > s5)  s5  = level; }
          else if (f >= 5900 && f < 7200)  { if (level > s6)  s6  = level; }
        });
        if (s24 !== -1000) bandData['2.4GHz'] = `${s24} dBm`;
        if (s5  !== -1000) bandData['5GHz']   = `${s5} dBm`;
        if (s6  !== -1000) bandData['6GHz']   = `${s6} dBm`;
      }
    } catch (error) {
      console.warn('WiFi scan error:', error);
      Alert.alert('Scan Error', 'Make sure Location is enabled. Android limits scans to 4 times per 2 minutes.');
    }

    setHistory((prev) => [
      {
        id: Date.now().toString(),
        room: activeRoom,
        type: 'Signal',
        bands: bandData,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
    setLoading(false);
  };

  // ── PDF Export ─────────────────────────────────────────────────────────────

  const generateAndSavePDF = async () => {
    try {
      const { uri } = await Print.printToFileAsync({ html: generatePdfHtml(history) });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (err) {
      console.warn(err);
      Alert.alert('Error', 'Failed to generate or share PDF.');
    }
  };

  // ── Render helpers ─────────────────────────────────────────────────────────

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyRoom}>{item.room}</Text>
        <Text style={[styles.historyTypePill, item.type === 'Speedtest' ? styles.pillSpeed : styles.pillSignal]}>
          {item.type}
        </Text>
      </View>
      <View style={styles.historyBody}>
        {item.type === 'Speedtest' ? (
          <View>
            <Text style={styles.historyMetricBlock}>{item.speed}</Text>
            {item.extras && item.extras.length > 0 && (
              <Text style={styles.historyExtras}>{item.extras.join('  ·  ')}</Text>
            )}
            {item.provider && (
              <Text style={styles.historyProviderLabel}>via {item.provider}</Text>
            )}
          </View>
        ) : (
          <View style={styles.bandsContainer}>
            {['2.4GHz', '5GHz', '6GHz'].map(band => (
              <View key={band} style={styles.bandBlock}>
                <Text style={styles.bandLabel}>{band}</Text>
                <Text style={styles.bandValue}>{item.bands[band]}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <Text style={styles.historyTime}>{item.timestamp}</Text>
    </View>
  );

  // ── JSX ────────────────────────────────────────────────────────────────────

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      {/* Background WebView for silent providers */}
      {loading && isSilentProvider && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
          <WebView
            ref={webViewRef}
            source={{ uri: provider.url }}
            onLoad={startPolling}
            onMessage={onWebViewMessage}
            javaScriptEnabled
            domStorageEnabled
          />
        </View>
      )}

      <View style={styles.container}>
        {/* History */}
        <View style={styles.topHalf}>
          <View style={styles.historyHeaderRow}>
          <Text style={styles.sectionTitle}>History Log</Text>
          <TouchableOpacity
            onPress={generateAndSavePDF}
            style={[styles.savePdfButton, history.length === 0 && styles.savePdfButtonDisabled]}
            disabled={history.length === 0}
          >
            <Text style={styles.savePdfText}>Save PDF</Text>
          </TouchableOpacity>
        </View>
        {history.length === 0 ? (
          <Text style={styles.emptyText}>No data yet. Select a room and run a test.</Text>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={renderHistoryItem}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>

      {/* Action bar */}
      <View style={styles.actionArea}>
        <Text style={styles.activeRoomLabel}>
          Active Room:{' '}
          <Text style={styles.activeRoomName}>{activeRoom || 'None Selected'}</Text>
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.btnSignal, (!activeRoom || loading) && styles.btnDisabled]}
            onPress={executeSignalScan}
            disabled={!activeRoom || loading}
          >
            <Text style={styles.actionBtnText}>Scan Signal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.btnSpeed, (!activeRoom || loading) && styles.btnDisabled]}
            onPress={executeSpeedtest}
            disabled={!activeRoom || loading}
          >
            <Text style={styles.actionBtnText}>Speedtest</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Speedtest modal */}
      <Modal visible={testModalVisible} animationType="slide" onRequestClose={cancelSpeedtest}>
        <SafeAreaView style={styles.modalContainer}>
          {isNativeProvider ? (
            <SpeedCheckerScreen
              onResult={onNativeResult}
              onCancel={cancelSpeedtest}
            />
          ) : (
            <>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Speed Test — {activeRoomForTest}</Text>
                  <Text style={styles.modalSubtitle}>{provider.label}</Text>
                </View>
                <TouchableOpacity onPress={cancelSpeedtest} style={styles.modalCloseBtn}>
                  <Text style={styles.modalCloseBtnText}>✕ Cancel</Text>
                </TouchableOpacity>
              </View>
              {isCustomProvider ? (
                <WebView
                  ref={webViewRef}
                  source={{ html: provider.html }}
                  originWhitelist={['*']}
                  onMessage={onWebViewMessage}
                  javaScriptEnabled
                  style={{ flex: 1 }}
                />
              ) : (
                <WebView
                  ref={webViewRef}
                  source={{ uri: provider.url }}
                  onLoad={startPolling}
                  onMessage={onWebViewMessage}
                  javaScriptEnabled
                  domStorageEnabled
                  style={{ flex: 1 }}
                />
              )}
            </>
          )}
        </SafeAreaView>
      </Modal>

      {/* Rooms */}
      <View style={styles.bottomHalf}>
        <Text style={styles.sectionTitle}>Locations</Text>
        <View style={styles.addRoomRow}>
          <TextInput
            style={styles.input}
            placeholder="New Room (e.g. Kitchen)"
            placeholderTextColor="#AAA"
            value={newRoom}
            onChangeText={setNewRoom}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              if (newRoom.trim()) { setRooms([...rooms, newRoom.trim()]); setNewRoom(''); }
            }}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.roomsGrid}>
          {rooms.map((room, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.roomButton, activeRoom === room && styles.roomButtonActive]}
              onPress={() => setActiveRoom(room)}
            >
              <Text style={styles.roomButtonText}>{room}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {loading && (
          <View style={[styles.loadingOverlay, isSilentProvider && { backgroundColor: '#F8F9FA' }]}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={styles.loadingText}>{progressText}</Text>
            {isSilentProvider && (
              <TouchableOpacity onPress={cancelSpeedtest} style={styles.cancelSilentBtn}>
                <Text style={styles.cancelSilentBtnText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#F8F9FA' },
  topHalf:          { flex: 1.2, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  historyHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5, marginBottom: 10 },
  sectionTitle:     { fontSize: 20, fontWeight: 'bold', color: '#333' },
  savePdfButton:    { backgroundColor: '#17A2B8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  savePdfButtonDisabled: { backgroundColor: '#A0A0A0' },
  savePdfText:      { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  emptyText:        { color: '#777', fontStyle: 'italic', marginTop: 20, textAlign: 'center' },
  listContainer:    { paddingBottom: 20 },

  historyItem: {
    backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  historyHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  historyRoom:      { fontSize: 16, fontWeight: '700', color: '#222' },
  historyTypePill:  { fontSize: 12, fontWeight: '600', color: '#FFF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, overflow: 'hidden' },
  pillSpeed:        { backgroundColor: '#28A745' },
  pillSignal:       { backgroundColor: '#6C757D' },
  historyBody:      { marginVertical: 4 },
  historyMetricBlock: { fontSize: 22, fontWeight: 'bold', color: '#28A745' },
  historyExtras:      { fontSize: 12, color: '#555', marginTop: 3 },
  historyProviderLabel: { fontSize: 11, color: '#999', marginTop: 2 },
  bandsContainer:   { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F1F3F5', borderRadius: 6, padding: 8 },
  bandBlock:        { alignItems: 'center' },
  bandLabel:        { fontSize: 11, color: '#555', fontWeight: '600' },
  bandValue:        { fontSize: 14, fontWeight: 'bold', color: '#007BFF', marginTop: 2 },
  historyTime:      { fontSize: 11, color: '#888', marginTop: 6, textAlign: 'right' },

  actionArea:     { backgroundColor: '#E9ECEF', padding: 15, borderBottomWidth: 1, borderBottomColor: '#CCC' },
  activeRoomLabel:{ fontSize: 14, color: '#555', marginBottom: 10, textAlign: 'center' },
  activeRoomName: { fontWeight: 'bold', color: '#000', fontSize: 16 },
  actionButtons:  { flexDirection: 'row', justifyContent: 'space-evenly' },
  actionBtn:      { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, width: '45%', alignItems: 'center' },
  btnSignal:      { backgroundColor: '#007BFF' },
  btnSpeed:       { backgroundColor: '#28A745' },
  btnDisabled:    { backgroundColor: '#A0A0A0' },
  actionBtnText:  { color: '#FFF', fontWeight: 'bold', fontSize: 15 },

  modalContainer: { flex: 1, backgroundColor: '#FFF' },
  modalHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', backgroundColor: '#F8F9FA' },
  modalTitle:     { fontSize: 16, fontWeight: '700', color: '#333' },
  modalSubtitle:  { fontSize: 12, color: '#888', marginTop: 2 },
  modalCloseBtn:  { backgroundColor: '#DC3545', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  modalCloseBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  bottomHalf:     { flex: 1, padding: 15, backgroundColor: '#FFF' },
  addRoomRow:     { flexDirection: 'row', marginBottom: 12 },
  input:          { flex: 1, borderWidth: 1, borderColor: '#CCC', borderRadius: 8, paddingHorizontal: 12, height: 40, backgroundColor: '#FFF', color: '#333' },
  addButton:      { backgroundColor: '#6C757D', justifyContent: 'center', paddingHorizontal: 15, borderRadius: 8, marginLeft: 10 },
  addButtonText:  { color: '#FFF', fontWeight: 'bold' },
  roomsGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  roomButton:     { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#CCC', width: '30%', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  roomButtonActive: { backgroundColor: '#E6F4FE', borderColor: '#007BFF', borderWidth: 2 },
  roomButtonText: { color: '#333', fontSize: 14, fontWeight: '600' },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.85)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  loadingText:    { marginTop: 10, fontSize: 16, fontWeight: '600', color: '#333' },
  cancelSilentBtn:{ marginTop: 20, backgroundColor: '#DC3545', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  cancelSilentBtnText:{ color: '#FFF', fontWeight: 'bold', fontSize: 14 },
});
