/**
 * Speedtest provider definitions.
 * Each provider has:
 *   - label:   Display name shown in Settings
 *   - url:     URL to load in the WebView (null for custom/inline HTML)
 *   - pollJs:  JS injected every 2s to detect completion and post result back
 *   - html:    (custom only) inline HTML string to use instead of a URL
 */

// --- Ookla (speedtest.net) ---
const OOKLA_POLL_JS = `
(function() {
  var speedEl = document.querySelector('.result-data-large.number') ||
                document.querySelector('#speed-value') ||
                document.querySelector('[data-testid="download-speed"]');
  var unitEl  = document.querySelector('.result-data-large.unit') ||
                document.querySelector('#speed-units');
  var doneEl  = document.querySelector('#share-button') ||
                document.querySelector('.result-tile') ||
                document.querySelector('[data-testid="result-tile"]') ||
                document.querySelector('.share-wrapper');
  if (speedEl && speedEl.innerText && parseFloat(speedEl.innerText) > 0 && doneEl) {
    var raw  = parseFloat(speedEl.innerText);
    var unit = unitEl ? (unitEl.innerText || 'Mbps').trim() : 'Mbps';
    var mbps = raw;
    if (unit === 'Gbps') mbps = raw * 1000;
    if (unit === 'Kbps') mbps = raw / 1000;
    window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'FINISHED', mbps: mbps }));
  }
})();
`;

// --- Netflix Fast.com ---
const FASTCOM_POLL_JS = `
(function() {
  if (window.__fcRunning) return;
  window.__fcRunning = true;
  window.__fcLastMsg = '';
  window.__fcPeak = 0;

  // Hide UI completely to optimize processor execution overhead
  var style = document.createElement('style');
  style.innerHTML = 'body { display: none !important; opacity: 0 !important; }';
  document.head.appendChild(style);

  var interval = setInterval(function() {
    var speedEl = document.querySelector('#speed-value');
    var unitEl  = document.querySelector('#speed-units');
    var doneEl  = document.querySelector('.show-more-details-link') ||
                  document.querySelector('.succeeded');
    
    var val = speedEl ? speedEl.innerText.trim() : '0';
    var unit = unitEl ? (unitEl.innerText || 'Mbps').trim() : 'Mbps';
    var isDone = !!doneEl;

    var raw = parseFloat(val) || 0;
    var currentMbps = raw;
    if (unit === 'Gbps') currentMbps = raw * 1000;
    if (unit === 'Kbps') currentMbps = raw / 1000;
    
    if (currentMbps > window.__fcPeak) {
      window.__fcPeak = currentMbps;
    }

    var msg = 'Connecting to server...';
    if (val !== '0' && val !== '' && !isDone) {
      msg = 'Measuring download: ' + val + ' ' + unit;
    } else if (isDone) {
      msg = 'Finishing up...';
    }

    if (msg !== window.__fcLastMsg) {
      window.__fcLastMsg = msg;
      window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'PROGRESS', message: msg }));
    }

    if (isDone && val !== '0' && val !== '' && !window.__fcDone) {
      window.__fcDone = true;
      clearInterval(interval);
      window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'FINISHED', mbps: window.__fcPeak }));
    }
  }, 250);
})();
`;

// --- LibreSpeed (librespeed.org) ---
const LIBRESPEED_POLL_JS = `
(function() {
  if (window.__lsRunning) return;
  window.__lsRunning = true;
  window.__lsPeak = 0;
  window.__lsLastMsg = '';

  // Hide UI for zero overhead and hide visual clutter
  var style = document.createElement('style');
  style.innerHTML = 'header, footer, .server-selector, .ping, .jitter, #upload-gauge { display: none !important; opacity: 0 !important; }';
  document.head.appendChild(style);

  var interval = setInterval(function() {
    var btn = document.querySelector('#start-button');
    if (!btn) return;
    var btnText = btn.textContent || '';
    
    // Auto start test when ready
    if (btnText === "Let's start" && !window.__lsStarted) {
      btn.click();
      window.__lsStarted = true;
    }

    // Track peak download speed
    var dlSpan = document.querySelector('#download-speed');
    var valDl = dlSpan ? parseFloat(dlSpan.textContent) || 0 : 0;
    if (valDl > window.__lsPeak) window.__lsPeak = valDl;

    var ulSpan = document.querySelector('#upload-speed');
    var valUl = ulSpan ? parseFloat(ulSpan.textContent) || 0 : 0;

    var isFinished = btnText === 'Restart' || btnText.toLowerCase().includes('restart');
    // If upload starts tracking any speed over 0, we can safely assume download is totally done!
    var uploadStarted = valUl > 0;

    var msg = 'Running Test...';
    if (btnText === 'Loading...' || btnText === '') {
      msg = 'Finding nearest server...';
    } else if (btnText === "Let's start") {
      msg = 'Server found, initiating...';
    } else if (btnText === 'Abort' || btnText.includes('Running')) {
      if (uploadStarted) {
        msg = 'Finishing up...';
      } else {
        msg = 'Measuring download: ' + valDl.toFixed(1) + ' Mbps';
      }
    } else if (isFinished) {
      msg = 'Finishing up...';
    }

    // Send progress updates
    if (msg !== window.__lsLastMsg) {
      window.__lsLastMsg = msg;
      window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'PROGRESS', message: msg }));
    }

    // Terminate early to skip upload step
    if (uploadStarted || isFinished) {
      clearInterval(interval);
      if (window.__lsPeak > 0 && !window.__lsDone) {
        window.__lsDone = true;
        window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'FINISHED', mbps: window.__lsPeak }));
      }
    }
  }, 100);
})();
`;

// --- Custom multi-CDN XHR engine ---
// This runs entirely as inline HTML with no external page required.
const CUSTOM_SPEEDTEST_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #1a1a2e; gap: 12px; }
    #speed { font-size: 52px; font-weight: bold; color: #00d4aa; }
    #label { font-size: 15px; color: #aaa; letter-spacing: 1px; }
    #unit  { font-size: 18px; color: #00d4aa; font-weight: 600; }
  </style>
</head>
<body>
  <div id="label">CONNECTING...</div>
  <div id="speed">—</div>
  <div id="unit">Mbps</div>
  <script>
    const THREADS = 16, DURATION = 10000, WARMUP = 2500, INTERVAL = 250;
    const URLS = [
      'https://cachefly.cachefly.net/100mb.test',
      'https://speed.cloudflare.com/__down?bytes=104857600',
    ];
    let totalBytes = 0, active = true, idx = 0;
    const t0 = performance.now();

    function nextUrl() {
      const u = URLS[idx % URLS.length]; idx++;
      return u + (u.includes('?') ? '&' : '?') + 'r=' + Math.random();
    }
    function spawnThread() {
      if (!active) return;
      const xhr = new XMLHttpRequest();
      xhr.open('GET', nextUrl(), true);
      let last = 0;
      xhr.onprogress = e => { if (active) { totalBytes += e.loaded - last; last = e.loaded; } };
      xhr.onload = xhr.onerror = () => { if (active && performance.now() - t0 < DURATION) spawnThread(); };
      xhr.send();
    }
    for (let i = 0; i < THREADS; i++) spawnThread();

    let lastBytes = 0, lastT = performance.now(), peak = 0, recent = [];
    const W = Math.round(1000 / INTERVAL);
    setInterval(() => {
      const now = performance.now(), elapsed = now - t0;
      const mbps = (totalBytes - lastBytes) * 8 / ((now - lastT) * 1000);
      lastBytes = totalBytes; lastT = now;
      if (elapsed > WARMUP && elapsed < DURATION) {
        recent.push(mbps); if (recent.length > W) recent.shift();
        const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
        if (avg > peak) peak = avg;
        document.getElementById('speed').innerText = Math.round(peak);
        document.getElementById('label').innerText = 'DOWNLOAD SPEED';
      }
      if (elapsed >= DURATION) {
        active = false;
        document.getElementById('label').innerText = 'COMPLETE';
        window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'FINISHED', mbps: peak }));
      }
    }, INTERVAL);
  </script>
</body>
</html>
`;

export const PROVIDERS = {
  ookla: {
    id: 'ookla',
    label: 'Ookla Speedtest',
    subtitle: 'speedtest.net — industry standard',
    type: 'webview',
    url: 'https://www.speedtest.net',
    pollJs: OOKLA_POLL_JS,
    html: null,
  },
  fastcom: {
    id: 'fastcom',
    label: 'Fast.com',
    subtitle: 'Netflix CDN — simple & reliable',
    type: 'webview',
    url: 'https://fast.com',
    pollJs: FASTCOM_POLL_JS,
    html: null,
  },
  custom: {
    id: 'custom',
    label: 'Custom Engine',
    subtitle: 'Multi-CDN XHR — built-in, no browser',
    type: 'webview',
    url: null,
    pollJs: null,
    html: CUSTOM_SPEEDTEST_HTML,
  },
  librespeed: {
    id: 'librespeed',
    label: 'LibreSpeed',
    subtitle: 'Open Source — peak download optimized',
    type: 'webview',
    url: 'https://librespeed.org/',
    pollJs: LIBRESPEED_POLL_JS,
    html: null,
  },
  speedchecker: {
    id: 'speedchecker',
    label: 'SpeedChecker SDK',
    subtitle: 'Native SDK — no WebView, most accurate',
    type: 'native',
    url: null,
    pollJs: null,
    html: null,
  },
};

export const DEFAULT_PROVIDER = 'ookla';
