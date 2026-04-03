import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const generateReport = async (jobDetails, rooms) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SignalScape Report</title>
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 40px; }
            .header { border-bottom: 2px solid #0066FF; padding-bottom: 20px; margin-bottom: 30px; }
            h1 { color: #0066FF; margin: 0 0 10px 0; font-size: 28px; }
            .meta { display: flex; justify-content: space-between; font-size: 14px; color: #666; }
            .section-title { font-size: 18px; color: #121212; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 30px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
            
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .info-block strong { color: #555; display: block; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
            .info-block p { margin: 0; font-size: 15px; font-weight: 500; }
            
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; background-color: #f8f9fa; color: #555; padding: 12px 15px; font-size: 13px; text-transform: uppercase; border-bottom: 2px solid #ddd; }
            td { padding: 15px; border-bottom: 1px solid #eee; vertical-align: middle; }
            .room-name { font-weight: bold; font-size: 16px; }
            
            .speed-val { font-size: 18px; font-weight: bold; color: #0066FF; }
            .speed-unit { font-size: 12px; color: #777; font-weight: normal; }
            
            .signal-bars { display: inline-flex; gap: 3px; align-items: flex-end; height: 16px; margin-right: 8px; }
            .bar { width: 4px; background-color: #ccc; border-radius: 2px; }
            .bar-1 { height: 4px; } .bar-2 { height: 8px; } .bar-3 { height: 12px; } .bar-4 { height: 16px; }
            .active-bar { background-color: #10B981; }
            
            .signal-val { font-size: 14px; color: #666; }
            
            .footer { margin-top: 50px; text-align: center; color: #aaa; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>WiFi Performance Report</h1>
            <div class="meta">
                <span>Date: ${new Date().toLocaleDateString()}</span>
                <span>Powered by signalScape</span>
            </div>
        </div>

        <div class="info-grid">
            <div class="info-block">
                <strong>Customer Name</strong>
                <p>${jobDetails.customerName || 'N/A'}</p>
            </div>
            <div class="info-block">
                <strong>Address</strong>
                <p>${jobDetails.address || 'N/A'}</p>
            </div>
            <div class="info-block">
                <strong>Service Plan</strong>
                <p>${jobDetails.isp || 'N/A'} - ${jobDetails.maxPlanSpeed ? jobDetails.maxPlanSpeed + ' Mbps' : 'N/A'}</p>
            </div>
            <div class="info-block">
                <strong>Hardware</strong>
                <p>Modem: ${jobDetails.modem || 'N/A'}</p>
                <p>Router(s): ${jobDetails.routers || 'N/A'}</p>
            </div>
        </div>

        <div class="section-title">Room-by-Room Metrics</div>
        <table>
            <thead>
                <tr>
                    <th>Location</th>
                    <th>Signal Strength</th>
                    <th>Download Speed</th>
                </tr>
            </thead>
            <tbody>
                ${rooms.map(room => `
                    <tr>
                        <td class="room-name">${room.name}</td>
                        <td>
                            <div style="display: flex; align-items: center;">
                                <div class="signal-bars">
                                    <div class="bar bar-1 ${room.signal?.bars >= 1 ? 'active-bar' : ''}"></div>
                                    <div class="bar bar-2 ${room.signal?.bars >= 2 ? 'active-bar' : ''}"></div>
                                    <div class="bar bar-3 ${room.signal?.bars >= 3 ? 'active-bar' : ''}"></div>
                                    <div class="bar bar-4 ${room.signal?.bars >= 4 ? 'active-bar' : ''}"></div>
                                </div>
                                <span class="signal-val">${room.signal ? `${room.signal.bars} Bars (${room.signal.dbm} dBm)` : 'Not Tested'}</span>
                            </div>
                        </td>
                        <td>
                            ${room.speed ? `
                                <span class="speed-val">${room.speed.mbps}</span>
                                <span class="speed-unit">Mbps</span>
                            ` : '<span class="signal-val">Not Tested</span>'}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="footer">
            Generated by the signalScape Pro application for WiFi Technicians.
        </div>
    </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent, base64: false });
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    }
  } catch (err) {
    console.error('Failed to generate PDF', err);
  }
};
