import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import SpeedCheckerPlugin from '@speedchecker/react-native-plugin';

const PHASES = {
  '': 'Waiting...',
  'Ping': 'Measuring latency...',
  'Download': 'Measuring download...',
  'Upload': 'Measuring upload...',
  'Finished': 'Done!',
  'Speed Test stopped': 'Stopped',
};

export default function SpeedCheckerScreen({ onResult, onCancel }) {
  const [status, setStatus] = useState('');
  const [ping, setPing] = useState(null);
  const [currentSpeed, setCurrentSpeed] = useState(null);
  const [download, setDownload] = useState(null);
  const [upload, setUpload] = useState(null);
  const [server, setServer] = useState('');
  const [finished, setFinished] = useState(false);

  const phase = PHASES[status] || status;
  const isDownloading = status === 'Download';
  const isUploading = status === 'Upload';

  const stopTest = useCallback(() => {
    SpeedCheckerPlugin.stopTest();
    SpeedCheckerPlugin.removeTestStartedListener();
  }, []);

  useEffect(() => {
    // Guard against the native module not being linked (e.g. stale build)
    if (!SpeedCheckerPlugin || typeof SpeedCheckerPlugin.startTest !== 'function') {
      setStatus('Native module not loaded — please rebuild the app.');
      setFinished(true);
      return;
    }

    SpeedCheckerPlugin.addTestStartedListener((event) => {
      const s = event.status || '';
      setStatus(s);
      if (event.ping)          setPing(parseFloat(event.ping));
      if (event.currentSpeed)  setCurrentSpeed(parseFloat(event.currentSpeed));
      if (event.downloadSpeed) setDownload(parseFloat(event.downloadSpeed));
      if (event.uploadSpeed)   setUpload(parseFloat(event.uploadSpeed));
      if (event.server)        setServer(event.server);

      if (s === 'Finished') {
        setFinished(true);
        SpeedCheckerPlugin.removeTestStartedListener();
        // Report result back to parent after a short delay so user can see the result
        setTimeout(() => {
          onResult({
            mbps: parseFloat(event.downloadSpeed) || 0,
            ping: parseFloat(event.ping) || null,
            upload: parseFloat(event.uploadSpeed) || null,
          });
        }, 1500);
      }
    });
    SpeedCheckerPlugin.startTest();

    return () => {
      SpeedCheckerPlugin.removeTestStartedListener();
    };
  }, [onResult]);

  const handleCancel = () => {
    stopTest();
    onCancel();
  };

  return (
    <View style={styles.container}>
      {/* Status label */}
      <Text style={styles.phaseLabel}>{phase.toUpperCase()}</Text>

      {/* Big speed number */}
      {(isDownloading || isUploading) && currentSpeed != null ? (
        <Text style={styles.speedNumber}>{currentSpeed.toFixed(1)}</Text>
      ) : finished && download != null ? (
        <Text style={[styles.speedNumber, styles.speedDone]}>{download.toFixed(1)}</Text>
      ) : (
        <ActivityIndicator size="large" color="#00d4aa" style={{ marginVertical: 24 }} />
      )}
      <Text style={styles.speedUnit}>Mbps</Text>

      {/* Result cards */}
      {(download != null || ping != null || upload != null) && (
        <View style={styles.metricsRow}>
          <MetricCard label="Ping" value={ping != null ? `${ping.toFixed(0)} ms` : '—'} />
          <MetricCard label="Download" value={download != null ? `${download.toFixed(1)}` : '—'} unit="Mbps" highlight />
          <MetricCard label="Upload" value={upload != null ? `${upload.toFixed(1)}` : '—'} unit="Mbps" />
        </View>
      )}

      {server ? <Text style={styles.serverLabel}>Server: {server}</Text> : null}

      {/* Cancel / Done button */}
      <TouchableOpacity
        style={[styles.btn, finished ? styles.btnDone : styles.btnCancel]}
        onPress={finished ? onCancel : handleCancel}
      >
        <Text style={styles.btnText}>{finished ? '✓ Save & Close' : '✕ Cancel'}</Text>
      </TouchableOpacity>
    </View>
  );
}

function MetricCard({ label, value, unit, highlight }) {
  return (
    <View style={[styles.metricCard, highlight && styles.metricCardHighlight]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, highlight && styles.metricValueHighlight]}>{value}</Text>
      {unit && <Text style={styles.metricUnit}>{unit}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  phaseLabel: {
    fontSize: 12,
    letterSpacing: 3,
    color: '#888',
    fontWeight: '600',
    marginBottom: 12,
  },
  speedNumber: {
    fontSize: 72,
    fontWeight: '800',
    color: '#00d4aa',
    lineHeight: 80,
  },
  speedDone: {
    color: '#00e676',
  },
  speedUnit: {
    fontSize: 18,
    color: '#00d4aa',
    fontWeight: '600',
    marginBottom: 28,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  metricCard: {
    backgroundColor: '#1e1e30',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 90,
  },
  metricCardHighlight: {
    backgroundColor: '#003d30',
    borderWidth: 1,
    borderColor: '#00d4aa',
  },
  metricLabel: {
    fontSize: 10,
    color: '#888',
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#EEE',
  },
  metricValueHighlight: {
    color: '#00d4aa',
  },
  metricUnit: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  serverLabel: {
    fontSize: 11,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
  },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 16,
  },
  btnCancel: {
    backgroundColor: '#3a1010',
    borderWidth: 1,
    borderColor: '#DC3545',
  },
  btnDone: {
    backgroundColor: '#003d30',
    borderWidth: 1,
    borderColor: '#00d4aa',
  },
  btnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
