/**
 * signalScape Speedtest provider definitions.
 */

const FASTCOM_POLL_JS = `
(function() {
  if (window.__fcRunning) return;
  window.__fcRunning = true;
  window.__fcLastMsg = '';
  window.__fcPeak = 0;

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

    var msg = 'Connecting...';
    if (val !== '0' && val !== '' && !isDone) {
      msg = 'MEASURING DOWNLOAD...';
    } else if (isDone) {
      msg = 'FINISHING UP...';
    }

    if (msg !== window.__fcLastMsg || currentMbps !== window.__fcLastMbps) {
      window.__fcLastMsg = msg;
      window.__fcLastMbps = currentMbps;
      window.ReactNativeWebView.postMessage(JSON.stringify({ 
        status: 'PROGRESS', 
        message: msg,
        mbps: currentMbps
      }));
    }

    if (isDone && val !== '0' && val !== '' && !window.__fcDone) {
      window.__fcDone = true;
      clearInterval(interval);
      window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'FINISHED', mbps: window.__fcPeak }));
    }
  }, 250);
})();
`;

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

    let lastBytes = 0, lastT = performance.now(), peak = 0;
    setInterval(() => {
      const now = performance.now(), elapsed = now - t0;
      const mbps = (totalBytes - lastBytes) * 8 / ((now - lastT) * 1000);
      lastBytes = totalBytes; lastT = now;

      let statusMsg = 'CONNECTING...';

      if (elapsed < WARMUP) {
        statusMsg = 'WARMING UP...';
        if (mbps > peak) peak = mbps;
      } else if (elapsed < DURATION) {
        statusMsg = 'MEASURING DOWNLOAD...';
        if (mbps > peak) peak = mbps;
      }

      window.ReactNativeWebView.postMessage(JSON.stringify({ 
        status: 'PROGRESS', 
        mbps: mbps > 0 ? mbps : 0, 
        message: statusMsg 
      }));

      if (elapsed >= DURATION) {
        active = false;
        window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'FINISHED', mbps: peak }));
      }
    }, INTERVAL);
  </script>
</body>
</html>
`;

export const PROVIDERS = {
  'fast.com': {
    id: 'fast.com',
    label: 'Fast.com',
    url: 'https://fast.com',
    pollJs: FASTCOM_POLL_JS,
    html: null,
  },
  'custom': {
    id: 'custom',
    label: 'Custom Engine',
    url: null,
    pollJs: null,
    html: CUSTOM_SPEEDTEST_HTML,
  },
};
