import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const msgs = [];
page.on('console', m => msgs.push(m.text()));
await page.goto('http://localhost:8765/index.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);
// 업로드 화면 숨기고 대시보드/지도 뷰 표시 후 initMap 호출
await page.evaluate(() => {
  const up = document.getElementById('up');
  if (up) up.style.display = 'none';
  const dash = document.getElementById('dash');
  if (dash) { dash.style.display = 'flex'; dash.classList.add('show'); }
  if (typeof initMap === 'function') initMap(true);
});
await page.waitForTimeout(8000);
console.log('all console:', msgs.join('\n'));
await page.screenshot({ path: 'C:/Users/pgman/happycall/_map_preview.png' });
await browser.close();
console.log('done');
