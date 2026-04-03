import { chromium } from 'playwright';

const PROJECT_ID = '5180537362465701192';
const URL = `https://stitch.withgoogle.com/projects/${PROJECT_ID}`;

const PROMPT = `Create a landscape game homepage 1920x1080 for RideLand cycling conquest. Top bar 80px logo weekly status, China map 85% territory overlays, floating navigation 4 buttons, user avatar gold ring. Tech-geo dark theme.`;

console.log('🎨 Automating Stitch UI with Playwright...');

const browser = await chromium.launch({ 
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
});

const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 }
});

const page = await context.newPage();

console.log('📡 Navigating to Stitch...');
await page.goto(URL, { timeout: 60000 });
await page.waitForTimeout(15000);
console.log('✅ Page loaded');

console.log('📝 Clicking at bottom center to activate input...');
// Click at bottom center where input box should be
await page.mouse.click(960, 1000);
await page.waitForTimeout(2000);

console.log('⌨️  Typing prompt...');
await page.keyboard.type(PROMPT, { delay: 50 });
await page.waitForTimeout(1000);

console.log('⌨️  Pressing Enter...');
await page.keyboard.press('Enter');

console.log('⏳ Waiting for generation (120 seconds)...');
for (let i = 0; i < 12; i++) {
  console.log(`   Progress: ${(i+1)*10}/120 seconds`);
  await page.waitForTimeout(10000);
}

console.log('📸 Saving screenshot...');
await page.screenshot({ path: '/tmp/stitch-result.png', fullPage: true });

await browser.close();

console.log();
console.log('✅ Done! Check project:');
console.log(`https://stitch.withgoogle.com/projects/${PROJECT_ID}`);
console.log();
console.log('🖼️  Screenshot: /tmp/stitch-result.png');
