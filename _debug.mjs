import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const logs = [];
page.on('console', m => logs.push(m.text()));

await page.goto('http://localhost:8765/index.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);

await page.evaluate(() => {
  const up = document.getElementById('up');
  if (up) up.style.display = 'none';
  const dash = document.getElementById('dash');
  if (dash) { dash.style.display = 'flex'; dash.classList.add('show'); }
  if (typeof initMap === 'function') initMap(true);
  if (typeof renderV9TimePresets === 'function') renderV9TimePresets();
});
await page.waitForTimeout(4000);

const info = await page.evaluate(() => {
  const el = document.getElementById('v9TimePresets');
  const hud = document.querySelector('.hud-b.v9-bottom-control');
  const slider = document.querySelector('.v9-time-slider');
  return {
    presets_html: el ? el.innerHTML.slice(0,300) : 'NOT FOUND',
    presets_style: el ? window.getComputedStyle(el).flexDirection + ' ' + window.getComputedStyle(el).display : '',
    hud_style: hud ? window.getComputedStyle(hud).flexDirection + ' disp:' + window.getComputedStyle(hud).display + ' pos:' + window.getComputedStyle(hud).position + ' bottom:' + window.getComputedStyle(hud).bottom : 'NOT FOUND',
    slider_display: slider ? window.getComputedStyle(slider).display : 'NOT FOUND',
    time_presets_keys: Object.keys(window.TIME_PRESETS || {}),
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
