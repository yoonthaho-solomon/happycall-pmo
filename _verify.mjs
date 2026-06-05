import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const msgs = [];
page.on('console', m => { if (m.text().includes('[MAP')) msgs.push(m.text()); });

await page.goto('http://localhost:8765/index.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);

// 업로드 화면 숨기고 대시보드 표시 + 지도 초기화
await page.evaluate(() => {
  const up = document.getElementById('up');
  if (up) up.style.display = 'none';
  const dash = document.getElementById('dash');
  if (dash) { dash.style.display = 'flex'; dash.classList.add('show'); }
  if (typeof initMap === 'function') initMap(true);
});
await page.waitForTimeout(7000);

// 1. 지도 뷰 (기본)
await page.screenshot({ path: '_v40_map.png' });
console.log('map screenshot done');

// 2. 분석모드 패널 토글
await page.evaluate(() => {
  if (typeof kplToggleRight === 'function') kplToggleRight();
});
await page.waitForTimeout(1000);
await page.screenshot({ path: '_v40_analysis.png' });
console.log('analysis panel screenshot done');

// 3. 발표 모드 토글
await page.evaluate(() => {
  if (typeof kplTogglePresentation === 'function') kplTogglePresentation();
});
await page.waitForTimeout(500);
await page.screenshot({ path: '_v40_presentation.png' });
console.log('presentation mode screenshot done');

console.log('map console:', msgs.join(' | '));
await browser.close();
