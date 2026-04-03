import { chromium } from 'playwright';

const PROJECT_ID = '5180537362465701192';
const URL = `https://stitch.withgoogle.com/projects/${PROJECT_ID}`;

const PROMPT = `Create a landscape game homepage (1920x1080) for "Rideland" cycling conquest using Rideland Tactical design system. Top bar 80px logo weekly status, China map 85% territory overlays, floating navigation bottom 4 buttons, user avatar top-right gold ring. Deep space black background, tech blue primary, tactical command center.`;

console.log('🎨 Automating Stitch UI with Playwright...');
console.log(`URL: ${URL}`);
console.log();

const browser = await chromium.launch({ 
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 }
});

const page = await context.newPage();

console.log('📡 Navigating to Stitch...');
try {
  await page.goto(URL, { timeout: 60000, waitUntil: 'networkidle' });
  console.log('✅ Page loaded');
} catch (e) {
  console.log(`❌ Navigation failed: ${e.message}`);
  await browser.close();
  process.exit(1);
}

console.log('⏳ Waiting for page to load...');
await page.waitForTimeout(10000);

console.log('📸 Taking before screenshot...');
await page.screenshot({ path: '/tmp/stitch-before.png', fullPage: true });

console.log('📝 Looking for input box...');
const inputBox = page.locator('textarea').first();

try {
  await inputBox.waitFor({ state: 'visible', timeout: 10000 });
  console.log('✅ Found input box');
  
  console.log('⌨️  Typing prompt...');
  await inputBox.click();
  await page.waitForTimeout(1000);
  await inputBox.fill(PROMPT);
  await page.waitForTimeout(1000);
  
  console.log('⌨️  Pressing Enter...');
  await page.keyboard.press('Enter');
  
  console.log('⏳ Waiting for generation (90 seconds)...');
  for (let i = 0; i < 9; i++) {
    console.log(`   Progress: ${(i+1)*10}/90 seconds...`);
    await page.waitForTimeout(10000);
  }
  
  console.log('📸 Taking after screenshot...');
  await page.screenshot({ path: '/tmp/stitch-after.png', fullPage: true });
  
} catch (e) {
  console.log(`❌ Error: ${e.message}`);
  await page.screenshot({ path: '/tmp/stitch-error.png', fullPage: true });
}

await browser.close();

console.log();
console.log('✅ Done!');
console.log('🖼️  Check: /tmp/stitch-before.png, /tmp/stitch-after.png');
console.log();
console.log('🌐 Check project:');
console.log(`   https://stitch.withgoogle.com/projects/${PROJECT_ID}`);
