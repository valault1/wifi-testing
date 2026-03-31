function getSignalBarsHtml(bars) {
  let html = '<div style="display: flex; gap: 2px; align-items: end; height: 16px;">';
  const heights = ['6px', '10px', '14px', '16px'];

  for (let i = 0; i < 4; i++) {
    const bgColor = i < bars ? 'var(--primary)' : '#cbd5e1';
    html += `<div style="width: 4px; height: ${heights[i]}; background: ${bgColor};"></div>`;
  }

  html += '</div>';
  return html;
}

function generatePdfHtml(location) {
  const { name = 'Unnamed Location', reportData = {}, history = [] } = location || {};

  const hardwareDisplay = reportData.hardwareType === 'separate'
    ? `Modem: ${reportData.modemName || 'N/A'} <br/> Router: ${reportData.routerName || 'N/A'}`
    : `Combo: ${reportData.comboName || 'N/A'}`;

  // Helper to format history item details
  const formatHistoryDetails = (item) => {
    if (item.type === 'Speedtest') {
      let details = `<strong>${item.speed}</strong>`;
      if (item.extras && item.extras.length > 0) {
        details += `<br/><span style="color: #64748b; font-size: 0.85em;">${item.extras.join(' | ')}</span>`;
      }
      return details;
    } else if (item.type === 'Signal') {
      let details = '';
      if (item.bands) {
        details = Object.entries(item.bands).map(([band, val]) => `${band}: ${val}`).join('<br/>');
      }
      return `<span style="color: #64748b; font-size: 0.85em;">${details}</span>`;
    }
    return 'N/A';
  };

  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          :root {
            --bg-color: #f8fafc;
            --bg-surface: #ffffff;
            --text-main: #0f172a;
            --text-muted: #64748b;
            --primary: #3b82f6;
            --radius-lg: 0.5rem;
          }
          body { 
            font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            padding: 40px; 
            background: var(--bg-surface);
            color: var(--text-main);
            margin: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
          }
          .header-section {
            text-align: center;
            margin-bottom: 3rem;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
          }
          .hero-badge {
            background: #e2e8f0;
            color: #475569;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 600;
            margin-bottom: 1rem;
            display: inline-block;
          }
          h1 {
            font-size: 2.2rem;
            margin-bottom: 0.5rem;
            letter-spacing: -0.02em;
            color: var(--text-main);
            margin-top: 0;
          }
          .subtitle {
            font-size: 1rem;
            color: var(--text-muted);
            max-width: 600px;
            margin: 0 auto;
          }
          .property-details {
            display: flex;
            justify-content: space-between;
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 40px;
            border: 1px solid #e2e8f0;
          }
          .prop-col {
            flex: 1;
          }
          .prop-label {
            font-size: 0.8rem;
            text-transform: uppercase;
            color: #64748b;
            font-weight: bold;
            margin-bottom: 4px;
          }
          .prop-value {
            font-size: 1.1rem;
            color: #0f172a;
            font-weight: 500;
          }
          h3 {
            font-size: 1.25rem;
            margin: 0 0 1rem 0;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            margin-top: 10px;
          }
          thead {
            background: #f8fafc;
            border-bottom: 2px solid #e2e8f0;
          }
          th {
            padding: 12px;
            font-weight: 600;
            color: var(--text-muted);
            font-size: 0.875rem;
          }
          td {
            padding: 14px 12px;
            border-bottom: 1px solid #e2e8f0;
          }
          .room-cell {
            font-weight: bold;
            color: #0f172a;
          }
          .type-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: bold;
            color: #fff;
            background-color: #3b82f6;
          }
          .type-badge.signal {
            background-color: #10b981;
          }
          .empty-state {
            text-align: center;
            padding: 40px;
            color: #94a3b8;
            font-style: italic;
          }
          
          @media print {
            @page { margin: 40px; }
            body { padding: 0; background: white; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header-section">
            <div class="hero-badge">WiFi Coverage & Speed Report</div>
            <h1>${name}</h1>
            <p class="subtitle">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>

          <div class="property-details">
            <div class="prop-col">
              <div class="prop-label">Number of Rooms</div>
              <div class="prop-value">${reportData.numRooms || 'Undisclosed'}</div>
            </div>
            <div class="prop-col">
              <div class="prop-label">WiFi Plan</div>
              <div class="prop-value">${reportData.wifiPlan || 'Unknown'}</div>
            </div>
            <div class="prop-col">
              <div class="prop-label">Hardware Type</div>
              <div class="prop-value">${hardwareDisplay}</div>
            </div>
          </div>

          <h3>Test History Log</h3>
          ${history.length === 0 ? '<div class="empty-state">No speed tests or signal scans were recorded for this location.</div>' : `
          <table>
            <thead>
              <tr>
                <th>Room / Location</th>
                <th>Test Type</th>
                <th>Results & Details</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              ${history.map(item => `
                <tr>
                  <td class="room-cell">${item.room || 'Generic'}</td>
                  <td>
                    <span class="type-badge ${item.type === 'Signal' ? 'signal' : ''}">${item.type.toUpperCase()}</span>
                    ${item.provider ? `<br/><span style="font-size:0.75em; color:#64748b;">via ${item.provider}</span>` : ''}
                  </td>
                  <td>${formatHistoryDetails(item)}</td>
                  <td style="color: #64748b; font-size: 0.9em;">${item.timestamp}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          `}
        </div>
      </body>
    </html>
  `;
}

module.exports = { generatePdfHtml };
