const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(String(err)));
  await page.goto('http://localhost:5174', { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  const title = await page.title();
  const iconHref = await page.evaluate(() => document.querySelector('link[rel="icon"]')?.href);
  const joinHref = await page.evaluate(() => document.querySelector('.hit-join')?.href);
  console.log('title:', title, 'icon:', iconHref, 'joinHref:', joinHref);
  console.log('ERRORS:', JSON.stringify(errors));
  await page.screenshot({ path: 'shot-final2.png' });
  await browser.close();
})();
