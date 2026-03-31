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

export default function SignalScreen({ speedtestProviderKey, activeLocation, updateActiveLocation, locations, setActiveLocationId }) {
  const isSessionActive = !!activeLocation;
  // Rely on global state for these:
  const rooms = activeLocation?.rooms || [];
  const history = activeLocation?.history || [];

  const [newRoom, setNewRoom] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [sessionModalVisible, setSessionModalVisible] = useState(false);
  const [activeRoomForTest, setActiveRoomForTest] = useState(null);

  // New states for inline progress and active provider
  const [testMode, setTestMode] = useState(null); // 'inline' | 'modal'
  const [activeProviderKey, setActiveProviderKey] = useState('fastcom');
  const [testActive, setTestActive] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [testPhase, setTestPhase] = useState(null); // 'DOWNLOAD', 'UPLOAD', or null

  const webViewRef = useRef(null);
  const pollIntervalRef = useRef(null);

  const provider = PROVIDERS[activeProviderKey];
  const isNativeProvider = provider ? provider.type === 'native' : false;
  const isCustomProvider = provider ? provider.id === 'custom' : false;

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

      if (data.status === 'STARTING') {
        setTestPhase('DOWNLOAD');
      } else if (data.status === 'PROGRESS') {
        setCurrentSpeed(data.mbps);
        if (data.phase) setTestPhase(data.phase);
      } else if (data.status === 'FINISHED' && data.mbps > 0) {
        stopPolling();
        setTestActive(false);
        setTestModalVisible(false);
        setTestPhase(null);
        setCurrentSpeed(0);
        setLoading(false);
        const mode = testMode;
        setTestMode(null);

        const timestamp = new Date().toLocaleTimeString();
        const resultEntry = {
          id: Date.now().toString(),
          room: activeRoomForTest,
          type: 'Speedtest',
          speed: `${data.mbps.toFixed(1)} Mbps`,
          provider: provider.label,
          timestamp,
        };

        if (data.upload) {
          resultEntry.extras = [`↑ ${data.upload.toFixed(1)} Mbps`];
        }

        updateActiveLocation({ history: [resultEntry, ...history] });
        Alert.alert('Test Complete', `Result for ${activeRoomForTest}: ${data.mbps.toFixed(1)} Mbps ${data.upload ? ('(↑ ' + data.upload.toFixed(1) + ')') : ''}`);
      }
    } catch (_) {
      // ignore
    }
  }, [activeRoomForTest, stopPolling, provider]);

  // Handler for SpeedChecker native result
  const onNativeResult = useCallback(({ mbps, ping, upload }) => {
    setLoading(false);
    setTestActive(false);
    setTestPhase(null);
    setCurrentSpeed(0);

    const parts = [`${mbps.toFixed(1)} Mbps`];
    if (ping) parts.push(`Ping: ${ping.toFixed(0)} ms`);
    if (upload) parts.push(`↑ ${upload.toFixed(1)} Mbps`);

    const resultEntry = {
      id: Date.now().toString(),
      room: activeRoomForTest,
      type: 'Speedtest',
      speed: parts[0],
      extras: parts.slice(1),
      provider: provider?.label,
      timestamp: new Date().toLocaleTimeString(),
    };
    updateActiveLocation({ history: [resultEntry, ...history] });
  }, [activeRoomForTest, provider, history, updateActiveLocation]);

  const executeFastTest = (mode) => {
    if (mode === 'location' && !activeRoom) {
      Alert.alert('No Room Selected', 'Please select a room from the grid first.');
      return;
    }
    setActiveRoomForTest(mode === 'quick' ? 'No Location' : activeRoom);
    setActiveProviderKey('fastcom');
    setTestMode('inline');
    setLoading(true);
    setTestActive(true);
  };

  const executeOoklaTest = () => {
    setActiveRoomForTest(activeRoom || 'No Location');
    setActiveProviderKey('ookla');
    setTestMode('modal');
    setLoading(true);
    setTestModalVisible(true);
  };

  const cancelSpeedtest = () => {
    stopPolling();
    setTestModalVisible(false);
    setTestActive(false);
    setLoading(false);
    setTestPhase(null);
    setCurrentSpeed(0);
    setTestMode(null);
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
          if (f >= 2400 && f < 2500) { if (level > s24) s24 = level; }
          else if (f >= 5100 && f < 5900) { if (level > s5) s5 = level; }
          else if (f >= 5900 && f < 7200) { if (level > s6) s6 = level; }
        });
        if (s24 !== -1000) bandData['2.4GHz'] = `${s24} dBm`;
        if (s5 !== -1000) bandData['5GHz'] = `${s5} dBm`;
        if (s6 !== -1000) bandData['6GHz'] = `${s6} dBm`;
      }
    } catch (error) {
      console.warn('WiFi scan error:', error);
      Alert.alert('Scan Error', 'Make sure Location is enabled. Android limits scans to 4 times per 2 minutes.');
    }

    const resultEntry = {
      id: Date.now().toString(),
      room: activeRoom,
      type: 'Signal',
      bands: bandData,
      timestamp: new Date().toLocaleTimeString(),
    };

    updateActiveLocation({ history: [resultEntry, ...history] });
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
        {isSessionActive ? (
          <Text style={styles.sessionLabelActive}>
            Active Session:{' '}
            <Text style={styles.activeRoomName}>{activeLocation.name}</Text>
          </Text>
        ) : (
          <Text style={styles.sessionLabelInactive}>No Active Location Session</Text>
        )}

        {isSessionActive && (
          <Text style={styles.activeRoomLabel}>
            Selected Room:{' '}
            <Text style={styles.activeRoomName}>{activeRoom || 'None'}</Text>
          </Text>
        )}

        {testMode === 'inline' && testActive && !isNativeProvider ? (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressPhase}>{testPhase || 'TESTING...'}</Text>
              <TouchableOpacity onPress={cancelSpeedtest} style={styles.cancelLink}>
                <Text style={styles.cancelLinkText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.liveSpeedText}>
              {currentSpeed > 0 ? currentSpeed.toFixed(1) : '--.-'}
              <Text style={styles.liveSpeedUnit}> Mbps</Text>
            </Text>
            <ActivityIndicator size="small" color="#28A745" style={{ marginTop: 5 }} />
          </View>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.btnSignal, (loading || (isSessionActive && !activeRoom)) && styles.btnDisabled]}
              onPress={executeSignalScan}
              disabled={loading || (isSessionActive && !activeRoom)}
            >
              <Text style={styles.actionBtnText}>Scan Signal</Text>
            </TouchableOpacity>

            {isSessionActive ? (
              <TouchableOpacity
                style={[styles.actionBtn, styles.btnSpeed, (!activeRoom || loading) && styles.btnDisabled]}
                onPress={() => executeFastTest('location')}
                disabled={!activeRoom || loading}
              >
                <Text style={styles.actionBtnText}>Location Test</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.actionBtn, styles.btnQuick, loading && styles.btnDisabled]}
                onPress={() => executeFastTest('quick')}
                disabled={loading}
              >
                <Text style={styles.actionBtnText}>Quick Test</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionBtn, styles.btnOokla, loading && styles.btnDisabled]}
              onPress={executeOoklaTest}
              disabled={loading}
            >
              <Text style={styles.actionBtnText}>Ookla (Popup)</Text>
            </TouchableOpacity>

            {isSessionActive ? (
              <TouchableOpacity
                style={[styles.actionBtn, styles.btnEndSession, loading && styles.btnDisabled]}
                onPress={() => { setActiveLocationId(null); setActiveRoom(null); }}
                disabled={loading}
              >
                <Text style={styles.actionBtnText}>End Session</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.actionBtn, styles.btnStartSession, loading && styles.btnDisabled]}
                onPress={() => setSessionModalVisible(true)}
                disabled={loading}
              >
                <Text style={styles.actionBtnText}>Start Session</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Background WebView for Speedtest */}
      {testMode === 'inline' && testActive && !isNativeProvider && (
        <View style={styles.hiddenWebView}>
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

      {/* Speedtest Modal */}
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
                  <Text style={styles.modalSubtitle}>{provider ? provider.label : ''}</Text>
                </View>
                <TouchableOpacity onPress={cancelSpeedtest} style={styles.modalCloseBtn}>
                  <Text style={styles.modalCloseBtnText}>✕ Cancel</Text>
                </TouchableOpacity>
              </View>
              {provider && testMode === 'modal' && (
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

      {/* Session Selection Modal */}
      <Modal visible={sessionModalVisible} animationType="slide" transparent={true}>
        <View style={styles.sessionModalOverlay}>
          <View style={styles.sessionModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Location Session</Text>
              <TouchableOpacity onPress={() => setSessionModalVisible(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseBtnText}>✕ Cancel</Text>
              </TouchableOpacity>
            </View>
            {(!locations || locations.length === 0) ? (
              <Text style={styles.emptyText}>No saved locations. Go to the Report tab to create one.</Text>
            ) : (
              <FlatList
                data={locations}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.sessionListItem}
                    onPress={() => {
                      setActiveLocationId(item.id);
                      setActiveRoom(null);
                      setSessionModalVisible(false);
                    }}
                  >
                    <Text style={styles.sessionListItemText}>{item.name}</Text>
                    <Text style={styles.sessionListSubtext}>{item.rooms.length} rooms defined</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Rooms (Only visible during an active session) */}
      {isSessionActive && (
        <View style={styles.bottomHalf}>
          <Text style={styles.sectionTitle}>Rooms for {activeLocation.name}</Text>
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
                if (newRoom.trim()) {
                  updateActiveLocation({ rooms: [...rooms, newRoom.trim()] });
                  setNewRoom('');
                }
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
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#007BFF" />
              <Text style={styles.loadingText}>Running Test...</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  topHalf: { flex: 1.2, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  historyHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5, marginBottom: 10 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  savePdfButton: { backgroundColor: '#17A2B8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  savePdfButtonDisabled: { backgroundColor: '#A0A0A0' },
  savePdfText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  emptyText: { color: '#777', fontStyle: 'italic', marginTop: 20, textAlign: 'center' },
  listContainer: { paddingBottom: 20 },

  historyItem: {
    backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 2,
  },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  historyRoom: { fontSize: 16, fontWeight: '700', color: '#222' },
  historyTypePill: { fontSize: 12, fontWeight: '600', color: '#FFF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, overflow: 'hidden' },
  pillSpeed: { backgroundColor: '#28A745' },
  pillSignal: { backgroundColor: '#6C757D' },
  historyBody: { marginVertical: 4 },
  historyMetricBlock: { fontSize: 22, fontWeight: 'bold', color: '#28A745' },
  historyExtras: { fontSize: 12, color: '#555', marginTop: 3 },
  historyProviderLabel: { fontSize: 11, color: '#999', marginTop: 2 },
  bandsContainer: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F1F3F5', borderRadius: 6, padding: 8 },
  bandBlock: { alignItems: 'center' },
  bandLabel: { fontSize: 11, color: '#555', fontWeight: '600' },
  bandValue: { fontSize: 14, fontWeight: 'bold', color: '#007BFF', marginTop: 2 },
  historyTime: { fontSize: 11, color: '#888', marginTop: 6, textAlign: 'right' },

  actionArea: { backgroundColor: '#E9ECEF', padding: 15, borderBottomWidth: 1, borderBottomColor: '#CCC' },
  activeRoomLabel: { fontSize: 13, color: '#555', marginBottom: 10, textAlign: 'center' },
  sessionLabelActive: { fontSize: 15, color: '#007BFF', marginBottom: 2, textAlign: 'center', fontWeight: 'bold' },
  sessionLabelInactive: { fontSize: 15, color: '#666', marginBottom: 10, textAlign: 'center', fontStyle: 'italic' },
  activeRoomName: { fontWeight: 'bold', color: '#000', fontSize: 15 },
  actionButtons: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  actionBtn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, flexBasis: '48%', alignItems: 'center' },
  btnSignal: { backgroundColor: '#007BFF' },
  btnSpeed: { backgroundColor: '#28A745' },
  btnQuick: { backgroundColor: '#6f42c1' },
  btnOokla: { backgroundColor: '#17A2B8' },
  btnStartSession: { backgroundColor: '#FD7E14' },
  btnEndSession: { backgroundColor: '#DC3545' },
  btnDisabled: { backgroundColor: '#A0A0A0' },
  actionBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },

  modalContainer: { flex: 1, backgroundColor: '#FFF' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E0E0E0', backgroundColor: '#F8F9FA' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  modalSubtitle: { fontSize: 14, color: '#555', marginTop: 2 },
  modalCloseBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#E0E0E0', borderRadius: 8 },
  modalCloseBtnText: { color: '#333', fontWeight: 'bold' },

  sessionModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  sessionModalContent: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', maxHeight: '80%' },
  sessionListItem: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  sessionListItemText: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  sessionListSubtext: { fontSize: 13, color: '#666', marginTop: 2 },

  bottomHalf: { flex: 1, padding: 15, backgroundColor: '#FFF' },
  addRoomRow: { flexDirection: 'row', marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: '#CCC', borderRadius: 8, paddingHorizontal: 12, height: 40, backgroundColor: '#FFF', color: '#333' },
  addButton: { backgroundColor: '#6C757D', justifyContent: 'center', paddingHorizontal: 15, borderRadius: 8, marginLeft: 10 },
  addButtonText: { color: '#FFF', fontWeight: 'bold' },
  roomsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  roomButton: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#CCC', width: '30%', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  roomButtonActive: { backgroundColor: '#E6F4FE', borderColor: '#007BFF', borderWidth: 2 },
  roomButtonText: { color: '#333', fontSize: 14, fontWeight: '600' },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  loadingText: { marginTop: 10, fontSize: 16, fontWeight: '600', color: '#333' },

  progressContainer: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#DDD', marginTop: 10 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 5 },
  progressPhase: { fontSize: 12, fontWeight: 'bold', color: '#666', textTransform: 'uppercase' },
  cancelLink: { padding: 2 },
  cancelLinkText: { color: '#DC3545', fontSize: 12, fontWeight: 'bold' },
  liveSpeedText: { fontSize: 32, fontWeight: '900', color: '#28A745' },
  liveSpeedUnit: { fontSize: 16, fontWeight: '600', color: '#666' },
  hiddenWebView: { position: 'absolute', width: 100, height: 100, opacity: 0.05, top: -1000, left: -1000 },
});
