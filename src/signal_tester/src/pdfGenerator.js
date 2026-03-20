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

function generatePdfHtml(reportData) {
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
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
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
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            letter-spacing: -0.02em;
            color: var(--text-main);
            margin-top: 0;
          }
          .subtitle {
            font-size: 1.1rem;
            color: var(--text-muted);
            max-width: 600px;
            margin: 0 auto;
          }
          .report-card {
            background: var(--bg-surface);
            border-radius: var(--radius-lg);
            overflow: hidden;
            border: 1px solid #e2e8f0;
          }
          .report-header {
            padding: 2rem;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
          }
          .report-header h2 {
            font-size: 1.5rem;
            margin: 0 0 0.25rem 0;
          }
          .report-header p {
            color: var(--text-muted);
            margin: 0;
          }
          .status-badge {
            background: rgba(34, 197, 94, 0.1);
            color: rgb(21, 128, 61);
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .status-badge svg {
            width: 18px;
            height: 18px;
          }
          .report-body {
            padding: 2rem;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
            margin-bottom: 3rem;
          }
          .stat-card {
            background: #f8fafc;
            padding: 1.5rem;
            border-radius: 0.5rem;
            text-align: center;
          }
          .stat-label {
            color: var(--text-muted);
            font-size: 0.875rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin: 0 0 0.5rem 0;
          }
          .stat-value {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--text-main);
          }
          .stat-value .unit {
            font-size: 1rem;
            color: var(--text-muted);
            font-weight: 500;
          }
          .stat-value.highlight {
            color: var(--primary);
          }
          h3 {
            font-size: 1.25rem;
            margin: 0 0 1rem 0;
          }
          .table-wrapper {
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            overflow: hidden;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }
          thead {
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
          }
          th {
            padding: 1rem;
            font-weight: 600;
            color: var(--text-muted);
            font-size: 0.875rem;
          }
          td {
            padding: 1rem;
          }
          tr {
            border-bottom: 1px solid #e2e8f0;
            page-break-inside: avoid;
          }
          tr:last-child {
            border-bottom: none;
          }
          .location-cell {
            font-weight: 500;
          }
          .rating-excellent {
            color: var(--primary);
            font-weight: 600;
          }
          .rating-good {
            color: #64748b;
            font-weight: 600;
          }
          
          @media print {
            @page {
              margin: 40px;
            }
            body { 
              padding: 0; 
              background: white;
            }
            .stats-grid {
              display: flex;
              justify-content: space-between;
            }
            .stat-card {
              flex: 1;
              margin: 0 0.5rem;
            }
            .stat-card:first-child { margin-left: 0; }
            .stat-card:last-child { margin-right: 0; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header-section">
            <div class="hero-badge">Coverage Report</div>
            <h1>Coverage Assessment</h1>
            <p class="subtitle">
              Detailed coverage report for the property during the assessment.
            </p>
          </div>

          <div class="report-card">
            <div class="report-header">
              <div>
                <h2>${reportData.customerName}</h2>
                <p>Tested on: ${reportData.testDate} &bull; ${reportData.homeSize}</p>
              </div>
              <div class="status-badge">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                ${reportData.status}
              </div>
            </div>

            <div class="report-body">
              <div class="stats-grid">
                <div class="stat-card">
                  <p class="stat-label">Average Download</p>
                  <div class="stat-value">${reportData.averageDownload} <span class="unit">Mbps</span></div>
                </div>
                <div class="stat-card">
                  <p class="stat-label">Average Upload</p>
                  <div class="stat-value">${reportData.averageUpload} <span class="unit">Mbps</span></div>
                </div>
                <div class="stat-card">
                  <p class="stat-label">Dead Zones</p>
                  <div class="stat-value highlight">${reportData.deadZones}</div>
                </div>
              </div>

              <h3>Room-by-Room Analysis</h3>
              <div class="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>Signal Strength</th>
                      <th>Speed Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${reportData.rooms.map(room => `
                      <tr>
                        <td class="location-cell">${room.location}</td>
                        <td>
                          ${getSignalBarsHtml(room.signalBars)}
                        </td>
                        <td class="${room.speedRating === 'Excellent' ? 'rating-excellent' : 'rating-good'}">
                          ${room.speedRating}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

module.exports = { generatePdfHtml };
