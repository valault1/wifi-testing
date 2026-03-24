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
  Alert
} from 'react-native';
import * as Location from 'expo-location';
import WifiManager from 'react-native-wifi-reborn';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { generatePdfHtml } from './src/pdfGenerator';
import { WebView } from 'react-native-webview';

const cloudflareHtmlString = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <script type="module">
    import SpeedTest from 'https://esm.sh/@cloudflare/speedtest';
    
    try {
      const engine = new SpeedTest({
        autoStart: true,
        measurements: [
          { type: 'latency', numPackets: 20 },
          { type: 'download', bytes: 1e5, count: 5 },
          { type: 'download', bytes: 1e6, count: 5 },
          { type: 'download', bytes: 1e7, count: 2 },
          { type: 'upload', bytes: 1e5, count: 2 },
          { type: 'upload', bytes: 1e6, count: 2 }
        ]
      });

      engine.onFinish = (results) => {
        const summary = results.getSummary();
        window.ReactNativeWebView.postMessage(JSON.stringify({ 
          status: 'FINISHED', 
          download: summary.download,
          upload: summary.upload,
          latency: summary.latency
        }));
      };

      engine.onError = (err) => {
        window.ReactNativeWebView.postMessage(JSON.stringify({ 
          status: 'ERROR', 
          error: err.toString() 
        }));
      };
    } catch (e) {
       window.ReactNativeWebView.postMessage(JSON.stringify({ 
          status: 'ERROR', 
          error: e.toString() 
       }));
    }
  </script>
</body>
</html>
`;

export default function App() {
  const [rooms, setRooms] = useState(['Living Room', 'Garage']);
  const [newRoom, setNewRoom] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const [webViewTesting, setWebViewTesting] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

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
    setWebViewTesting(true);
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
    };

    try {
      if (Platform.OS === 'android') {
        const ssid = await WifiManager.getCurrentWifiSSID();

        // This initiates a fresh scan and returns all nearby networks
        const networks = await WifiManager.reScanAndLoadWifiList();

        // Filter purely to the network we are currently connected to
        // Note: remove quotes from ssid if android adds them occasionally
        const bareSsid = ssid.replace(/(^")|("$)/g, '');
        const targetNetworks = networks.filter(n => n.SSID.replace(/(^")|("$)/g, '') === bareSsid);

        let signal24 = -1000;
        let signal5 = -1000;
        let signal6 = -1000;

        targetNetworks.forEach(net => {
          const freq = net.frequency;
          const level = net.level; // dBm is negative, closer to 0 is better

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
        'Make sure Location is enabled. Android limits background scans to 4 times every 2 minutes. Wait a moment before scanning again.'
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

      <View style={{ width: 0, height: 0, position: 'absolute', opacity: 0 }}>
        {webViewTesting && (
          <WebView
            source={{ html: cloudflareHtmlString }}
            originWhitelist={['*']}
            onMessage={(event) => {
              const data = JSON.parse(event.nativeEvent.data);
              setWebViewTesting(false);
              setLoading(false);
              
              if (data.status === 'FINISHED') {
                const speedMbps = data.download ? (data.download / 1000000) : 0;
                const newEntry = {
                  id: Date.now().toString(),
                  room: activeRoom,
                  type: 'Speedtest',
                  speed: speedMbps > 0 ? `${speedMbps.toFixed(2)} Mbps` : 'Failed',
                  timestamp: new Date().toLocaleTimeString(),
                };
                setHistory((prev) => [newEntry, ...prev]);
              } else {
                console.warn("Speedtest failed from webview", data.error);
                Alert.alert("Test Failed", "Failed to run speed test.");
              }
            }}
          />
        )}
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
  }
});
