import React, { useState, useEffect } from 'react';
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
  AppState
} from 'react-native';
import * as Location from 'expo-location';
import WifiManager from 'react-native-wifi-reborn';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import { generatePdfHtml } from './src/pdfGenerator';
import { WebView } from 'react-native-webview';

const cloudflareHtmlString = ''; // Deprecated in favor of native fetch speedtest

export default function App() {
  const [rooms, setRooms] = useState(['Living Room', 'Garage']);
  const [newRoom, setNewRoom] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const [serverIp, setServerIp] = useState('localhost');
  const [testMode, setTestMode] = useState('WAN');
  const [updateStatus, setUpdateStatus] = useState('Checking...');

  const currentVersion = '1.0.2';

  useEffect(() => {
    requestPermissions();
    checkForUpdates();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkForUpdates();
      }
    });

    return () => subscription.remove();
  }, []);

  const checkForUpdates = async (isManual = false) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const updateUrl = 'http://localhost:8080/version.json';
      const response = await fetch(updateUrl, { signal: controller.signal });
      const data = await response.json();
      clearTimeout(timeoutId);

      if (data.version !== currentVersion) {
        setUpdateStatus(`v${data.version} Available`);
        Alert.alert(
          'Update Available',
          `Your version: ${currentVersion}\nNew version: ${data.version}\n\nNotes: ${data.notes || 'No notes.'}`,
          [
            { text: 'Later', style: 'cancel' },
            { text: 'Update Now', onPress: () => performUpdate() }
          ]
        );
      } else {
        setUpdateStatus('Up to Date');
        if (isManual) {
          Alert.alert('App Up to Date', `You are already running the latest version: ${currentVersion}`);
        }
      }
    } catch (e) {
      setUpdateStatus('Server Offline');
      if (isManual) {
        Alert.alert('Check Failed', 'Could not reach the update server on your Mac. Ensure it is connected via USB and update_server.py is running.');
      }
    }
  };

  const performUpdate = async () => {
    setLoading(true);
    try {
      const apkUrl = 'http://localhost:8080/app-release.apk';
      const fileUri = FileSystem.cacheDirectory + 'app-release.apk';

      const downloadRes = await FileSystem.downloadAsync(apkUrl, fileUri);

      if (downloadRes.status === 200) {
        setLoading(false);
        const contentUri = await FileSystem.getContentUriAsync(downloadRes.uri);
        await IntentLauncher.startActivityAsync('android.intent.action.INSTALL_PACKAGE', {
          data: contentUri,
          flags: 1, // GRANT_READ_URI_PERMISSION
          type: 'application/vnd.android.package-archive'
        });
      }
    } catch (e) {
      setLoading(false);
      Alert.alert('Update Failed', 'Could not download or install update.');
    }
  };

  const requestPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to read WiFi signal strength on Android.');
    }
  };

  const generateAndSavePDF = async () => {
    try {
      const htmlContent = generatePdfHtml(history);

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (err) {
      console.warn(err);
      Alert.alert('Error', 'Failed to generate or share PDF.');
    }
  };

  const addRoom = () => {
    if (newRoom.trim() !== '') {
      setRooms([...rooms, newRoom.trim()]);
      setNewRoom('');
    }
  };

  const executeSpeedtest = async () => {
    if (!activeRoom) {
      Alert.alert('No Room Selected', 'Please select a room from the bottom grid first.');
      return;
    }

    setLoading(true);

    const isWan = testMode === 'WAN';
    const testUrl = isWan
      ? 'https://speed.cloudflare.com/__down?bytes=500000000'
      : `http://${serverIp}:8080/test-data`;

    const xhr = new XMLHttpRequest();
    let loadedBytes = 0;
    const startTime = Date.now();
    const testDurationMs = 5000;

    const finalizeTest = (receivedBytes, start, end) => {
      const durationSec = (end - start) / 1000 || 1;
      const speedMbps = (receivedBytes * 8) / (durationSec * 1_000_000);

      const newEntry = {
        id: Date.now().toString(),
        room: activeRoom,
        type: `Speedtest (${testMode})`,
        speed: `${speedMbps.toFixed(2)} Mbps`,
        timestamp: new Date().toLocaleTimeString(),
      };

      setHistory((prev) => [newEntry, ...prev]);
      setLoading(false);
    };

    xhr.open('GET', testUrl, true);

    xhr.onprogress = (event) => {
      loadedBytes = event.loaded;
    };

    xhr.onload = () => {
      finalizeTest(loadedBytes, startTime, Date.now());
    };

    xhr.onerror = (e) => {
      setLoading(false);
      Alert.alert('Test Failed', `Could not reach ${isWan ? 'Internet' : 'Local Server'}.\n\nCheck your connection and Mac IP.`);
    };

    xhr.send();

    // Abort after 5 seconds to calculate intermediate speed
    setTimeout(() => {
      if (xhr.readyState !== 4) {
        xhr.abort();
        finalizeTest(loadedBytes, startTime, Date.now());
      }
    }, testDurationMs);
  };

  const executeSignalScan = async () => {
    if (!activeRoom) {
      Alert.alert('No Room Selected', 'Please select a room from the bottom grid first.');
      return;
    }

    setLoading(true);
    let bandData = {
      '2.4GHz': 'N/A',
      '5GHz': 'N/A',
      '6GHz': 'N/A',
      'LinkSpeed': 'N/A'
    };

    try {
      if (Platform.OS === 'android') {
        const ssid = await WifiManager.getCurrentWifiSSID();

        // Direct metric: Link Speed (Mbps)
        const linkSpeed = await WifiManager.getLinkSpeed();
        bandData['LinkSpeed'] = `${linkSpeed} Mbps`;

        // This initiates a fresh scan and returns all nearby networks
        const networks = await WifiManager.reScanAndLoadWifiList();

        // Filter purely to the network we are currently connected to
        const bareSsid = ssid.replace(/(^")|("$)/g, '');
        const targetNetworks = networks.filter(n => n.SSID.replace(/(^")|("$)/g, '') === bareSsid);

        let signal24 = -1000;
        let signal5 = -1000;
        let signal6 = -1000;

        targetNetworks.forEach(net => {
          const freq = net.frequency;
          const level = net.level; // dBm

          if (freq >= 2400 && freq < 2500) {
            if (level > signal24) signal24 = level;
          } else if (freq >= 5100 && freq < 5900) {
            if (level > signal5) signal5 = level;
          } else if (freq >= 5900 && freq < 7200) {
            if (level > signal6) signal6 = level;
          }
        });

        if (signal24 !== -1000) bandData['2.4GHz'] = `${signal24} dBm`;
        if (signal5 !== -1000) bandData['5GHz'] = `${signal5} dBm`;
        if (signal6 !== -1000) bandData['6GHz'] = `${signal6} dBm`;
      }
    } catch (error) {
      console.warn('Error scanning WiFi:', error);
      Alert.alert(
        'Scan Error',
        'Make sure Location is enabled. Android limits background scans.'
      );
    }

    const newEntry = {
      id: Date.now().toString(),
      room: activeRoom,
      type: 'Signal',
      bands: bandData,
      timestamp: new Date().toLocaleTimeString(),
    };

    setHistory((prev) => [newEntry, ...prev]);
    setLoading(false);
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyRoom}>{item.room}</Text>
        <Text style={styles.historyType}>{item.type}</Text>
      </View>

      <View style={styles.historyBody}>
        {item.type === 'Speedtest' ? (
          <Text style={styles.historyMetricBlock}>{item.speed}</Text>
        ) : (
          <View style={styles.bandsContainer}>
            <View style={styles.bandBlock}>
              <Text style={styles.bandLabel}>2.4 GHz</Text>
              <Text style={styles.bandValue}>{item.bands['2.4GHz']}</Text>
            </View>
            <View style={styles.bandBlock}>
              <Text style={styles.bandLabel}>5 GHz</Text>
              <Text style={styles.bandValue}>{item.bands['5GHz']}</Text>
            </View>
            <View style={styles.bandBlock}>
              <Text style={styles.bandLabel}>6 GHz</Text>
              <Text style={styles.bandValue}>{item.bands['6GHz']}</Text>
            </View>
            <View style={styles.bandBlock}>
              <Text style={styles.bandLabel}>Link Speed</Text>
              <Text style={[styles.bandValue, { color: '#28A745' }]}>{item.bands['LinkSpeed']}</Text>
            </View>
          </View>
        )}
      </View>
      <Text style={styles.historyTime}>{item.timestamp}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Half - History */}
      <View style={styles.topHalf}>
        <View style={styles.historyHeaderContainer}>
          <Text style={styles.headerTitle}>History Log</Text>
          <TouchableOpacity
            onPress={generateAndSavePDF}
            style={[styles.savePdfButton, history.length === 0 && styles.savePdfButtonDisabled]}
            disabled={history.length === 0}
          >
            <Text style={styles.savePdfText}>Save PDF</Text>
          </TouchableOpacity>
        </View>
        {history.length === 0 ? (
          <Text style={styles.emptyText}>No data points yet. Select a room and run a test.</Text>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={renderHistoryItem}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>

      {/* Middle Context Area */}
      <View style={styles.middleActionArea}>
        <View style={styles.testModeContainer}>
          <TouchableOpacity
            style={[styles.modeToggle, testMode === 'WAN' && styles.modeToggleActive]}
            onPress={() => setTestMode('WAN')}
          >
            <Text style={[styles.modeToggleText, testMode === 'WAN' && styles.modeToggleTextActive]}>Internet (WAN)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeToggle, testMode === 'LAN' && styles.modeToggleActive]}
            onPress={() => setTestMode('LAN')}
          >
            <Text style={[styles.modeToggleText, testMode === 'LAN' && styles.modeToggleTextActive]}>WiFi (LAN)</Text>
          </TouchableOpacity>
        </View>

        {testMode === 'LAN' && (
          <View style={styles.ipInputContainer}>
            <Text style={styles.ipLabel}>Mac IP:</Text>
            <TextInput
              style={styles.ipInput}
              placeholder="e.g. 192.168.1.10"
              value={serverIp}
              onChangeText={setServerIp}
            />
          </View>
        )}

        <Text style={styles.activeRoomLabel}>
          Active Room: <Text style={styles.activeRoomName}>{activeRoom || 'None Selected'}</Text>
        </Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.btnSignal, !activeRoom && styles.btnDisabled]}
            onPress={executeSignalScan}
            disabled={!activeRoom || loading}
          >
            <Text style={styles.actionBtnText}>Scan Signal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.btnSpeed, !activeRoom && styles.btnDisabled]}
            onPress={executeSpeedtest}
            disabled={!activeRoom || loading}
          >
            <Text style={styles.actionBtnText}>Speedtest</Text>
          </TouchableOpacity>
        </View>
      </View>


      {/* Bottom Half - Rooms */}
      <View style={styles.bottomHalf}>
        <Text style={styles.headerTitle}>Locations</Text>
        <View style={styles.addRoomContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Room (e.g. Kitchen)"
            value={newRoom}
            onChangeText={setNewRoom}
          />
          <TouchableOpacity style={styles.addButton} onPress={addRoom}>
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

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version: {currentVersion} | Status: {updateStatus}</Text>
        <TouchableOpacity style={styles.footerAction} onPress={() => checkForUpdates(true)}>
          <Text style={styles.footerActionText}>Check for Updates</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: 50,
  },
  topHalf: {
    flex: 1.2,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 0,
    color: '#333',
  },
  historyHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 5,
  },
  savePdfButton: {
    backgroundColor: '#17A2B8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  savePdfButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  savePdfText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyText: {
    color: '#777',
    fontStyle: 'italic',
    marginTop: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  historyItem: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  historyRoom: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  historyType: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
    backgroundColor: '#6C757D',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  historyBody: {
    marginVertical: 4,
  },
  historyMetricBlock: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28A745',
  },
  bandsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F1F3F5',
    borderRadius: 6,
    padding: 8,
  },
  bandBlock: {
    alignItems: 'center',
  },
  bandLabel: {
    fontSize: 11,
    color: '#555',
    fontWeight: '600',
  },
  bandValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007BFF',
    marginTop: 2,
  },
  historyTime: {
    fontSize: 11,
    color: '#888',
    marginTop: 6,
    textAlign: 'right',
  },
  middleActionArea: {
    backgroundColor: '#E9ECEF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  testModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modeToggle: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  modeToggleActive: {
    backgroundColor: '#007BFF',
  },
  modeToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  modeToggleTextActive: {
    color: '#FFF',
  },
  ipInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  ipLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#333',
  },
  ipInput: {
    flex: 1,
    height: 35,
    paddingHorizontal: 8,
    color: '#000',
    fontSize: 15,
  },
  activeRoomLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  activeRoomName: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  actionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  btnSignal: {
    backgroundColor: '#007BFF',
  },
  btnSpeed: {
    backgroundColor: '#28A745',
  },
  btnDisabled: {
    backgroundColor: '#A0A0A0',
  },
  actionBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  bottomHalf: {
    flex: 1,
    padding: 15,
    backgroundColor: '#FFF',
  },
  addRoomContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: '#FFF',
  },
  addButton: {
    backgroundColor: '#6C757D',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  roomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
  },
  roomButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#CCC',
    width: '30%',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  roomButtonActive: {
    backgroundColor: '#E6F4FE',
    borderColor: '#007BFF',
    borderWidth: 2,
  },
  roomButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    padding: 10,
    backgroundColor: '#F1F3F5',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#CCC',
  },
  footerText: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '500',
  },
  footerAction: {
    marginTop: 5,
    backgroundColor: '#007BFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 4,
  },
  footerActionText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  }
});
