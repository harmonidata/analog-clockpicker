import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const PORT = 8999;
const ROOT = process.cwd();

// Simple static file server
const server = http.createServer((req, res) => {
  let filePath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(ROOT, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

async function run() {
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Server running at http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 960, deviceScaleFactor: 2 });

  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('#clockDial');
  await new Promise(r => setTimeout(r, 600));

  // 1. Light Mode Full Preview
  console.log('Capturing preview-light.png...');
  await page.screenshot({ path: 'assets/screenshots/preview-light.png' });

  // 2. Dropdown Popover Active
  console.log('Capturing preview-dropdown.png...');
  await page.click('#dropdownToggleBtn');
  await new Promise(r => setTimeout(r, 350));
  await page.screenshot({ path: 'assets/screenshots/preview-dropdown.png' });

  // Close dropdown
  await page.click('#dropdownToggleBtn');
  await new Promise(r => setTimeout(r, 200));

  // 3. 24-Hour Concentric Ring Mode
  console.log('Capturing preview-24h.png...');
  await page.click('#formatToggleBtn');
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: 'assets/screenshots/preview-24h.png' });

  // Toggle back to 12h
  await page.click('#formatToggleBtn');
  await new Promise(r => setTimeout(r, 200));

  // 4. Modal Dialog Active
  console.log('Capturing preview-modal.png...');
  await page.click('#openModalBtn');
  await new Promise(r => setTimeout(r, 350));
  await page.screenshot({ path: 'assets/screenshots/preview-modal.png' });

  // Close modal
  await page.click('#modalCloseX');
  await new Promise(r => setTimeout(r, 200));

  // 5. Dark Mode Preview
  console.log('Capturing preview-dark.png...');
  await page.click('#themeToggleBtn');
  await new Promise(r => setTimeout(r, 350));
  await page.screenshot({ path: 'assets/screenshots/preview-dark.png' });

  await browser.close();
  server.close();
  console.log('All screenshots captured successfully in assets/screenshots/!');
}

run().catch(err => {
  console.error(err);
  server.close();
  process.exit(1);
});
