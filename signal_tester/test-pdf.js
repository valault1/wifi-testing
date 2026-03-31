const fs = require('fs');
const puppeteer = require('puppeteer');
const { generatePdfHtml } = require('./src/pdfGenerator');

const mockReportData = {
  customerName: "Smith Residence",
  testDate: "October 24th",
  homeSize: "3,200 sq. ft.",
  status: "Coverage Optimal",
  averageDownload: "940",
  averageUpload: "820",
  deadZones: 0,
  rooms: [
    { location: "Living Room", signalBars: 4, speedRating: "Excellent" },
    { location: "Master Bedroom", signalBars: 4, speedRating: "Excellent" },
    { location: "Kitchen", signalBars: 3, speedRating: "Good" },
    { location: "Back Patio", signalBars: 4, speedRating: "Excellent" }
  ]
};

async function generatePDF() {
  console.log('Generating HTML content...');
  const htmlContent = generatePdfHtml(mockReportData);
  
  console.log('Launching Puppeteer...');
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
  });
  const page = await browser.newPage();
  
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  const outputPath = 'test_output.pdf';
  console.log(`Writing PDF to ${outputPath}...`);
  await page.pdf({ path: outputPath, format: 'A4', printBackground: true });
  
  await browser.close();
  console.log('✅ PDF generated successfully! You can now view test_output.pdf');
}

generatePDF().catch(err => {
  console.error('Error generating PDF:', err);
});
