import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto('http://localhost:8765/index.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);

await page.evaluate(() => {
  const up = document.getElementById('up');
  if (up) up.style.display = 'none';
  const dash = document.getElementById('dash');
  if (dash) { dash.style.display = 'flex'; dash.classList.add('show'); }
  if (typeof initMap === 'function') initMap(true);
  // 더미 KPI 데이터 주입 후 renderKpiBar 호출
  const k = {
    n:1763, fin:483, exp:671, can:312, dc:189,
    sr:27.4, failRate:71.3, er:38.0, canR:17.7, dcR:10.7,
    avgEta:5.8
  };
  if (typeof renderKpiBar === 'function') renderKpiBar(k);
});
await page.waitForTimeout(4000);
await page.screenshot({ path: '_v43_kpi.png' });
console.log('done');
await browser.close();
