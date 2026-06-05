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
  // 인사이트 탭 더미 데이터 주입
  if (typeof renderInsight === 'function') {
    window.D = window.D || {};
    window.D.hour = [{h:8,demand:120,failRate:45.2,sr:54.8},{h:12,demand:200,failRate:38.1,sr:61.9},{h:18,demand:180,failRate:52.3,sr:47.7}];
    window.D.idle = {refRate:65,expWithIdle:320,expTotal:490};
    window.D.grade = [{grade:'A',er:8.2,n:150},{grade:'B',er:15.4,n:280},{grade:'C',er:28.7,n:190}];
    window.D.kpi = {failRate:41.2,dates:['2024-01-15']};
    window.D.waitTime = [
      {key:'3분이내',n:480,share:35,can:28,dc:12,exp:18,fin:312,canRate:5.8,dcRate:2.5,expRate:3.8,finRate:65.0},
      {key:'3-5분',n:320,share:28,can:52,dc:38,exp:45,fin:186,canRate:16.3,dcRate:11.9,expRate:14.1,finRate:58.1},
      {key:'5-7분',n:210,share:20,can:68,dc:55,exp:42,fin:92,canRate:32.4,dcRate:26.2,expRate:20.0,finRate:43.8},
      {key:'7분초과',n:150,share:17,can:78,dc:62,exp:38,fin:42,canRate:52.0,dcRate:41.3,expRate:25.3,finRate:28.0}
    ];
    window.D.hex = [
      {id:'8a30e1234567fff',n:45,sr:72.1,er:18.2,fin:32,exp:8,can:5,lat:36.82,lon:127.14},
      {id:'8a30e2345678fff',n:38,sr:68.4,er:22.1,fin:26,exp:8,can:4,lat:36.83,lon:127.13},
      {id:'8a30e3456789fff',n:52,sr:18.3,er:71.2,fin:9,exp:37,can:6,lat:36.81,lon:127.15}
    ];
    try { renderInsight(); } catch(e) { console.warn('insight error:', e.message); }
  }
});
await page.waitForTimeout(1500);

// 인사이트 탭으로 전환
await page.evaluate(() => {
  const btn = document.querySelector('.nav-btn[onclick*="v-insight"]');
  if (btn) btn.click();
});
await page.waitForTimeout(500);
await page.screenshot({ path: '_v42_insight.png' });
console.log('insight screenshot done');

// 액션플랜 더미 데이터 + 렌더
await page.evaluate(() => {
  window.D.atRisk = {total:123,retained:67,churn:56,churnList:[{id:'P001',canceled:3,success:1}],retainedList:[{id:'P002',canceled:2,success:2}]};
  window.D.nonAccept = {count:19,list:[{id:'D001',total:8,exp:5,dc:3},{id:'D002',total:6,exp:4,dc:2}]};
  window.D.topDrivers = {top:12,goodNoPeak:5,peakLowSr:7};
  window.D.reward = {callcardHours:window.D.hour};
  window.D.cross = [{hexId:'8a30e1234567fff',hour:18,n:85,exp:62,er:72.9,lat:36.82,lon:127.14},{hexId:'8a30e2345678fff',hour:8,n:65,exp:42,er:64.6,lat:36.83,lon:127.13}];
  try { renderActionPlan(); } catch(e) { console.warn('action plan error:', e.message); }
});
await page.waitForTimeout(500);

// 액션플랜 탭으로 전환
await page.evaluate(() => {
  const btn = document.querySelector('.nav-btn[onclick*="v-reward"]');
  if (btn) btn.click();
});
await page.waitForTimeout(500);
await page.screenshot({ path: '_v42_action.png' });
console.log('action screenshot done');

await browser.close();
