import { chromium } from 'playwright';

const PROJECT_ID = '5180537362465701192';
const URL = `https://stitch.withgoogle.com/projects/${PROJECT_ID}`;

const PROMPT = `Create a landscape game homepage (1920x1080) for "Rideland" cycling conquest using Rideland Tactical design system. Top bar 80px logo weekly status, China map 85% territory overlays, floating navigation bottom 4 buttons, user avatar top-right gold ring. Deep space black background, tech blue primary, tactical command center.`;

console.log('🎨 Automating Stitch UI with Playwright...');
console.log(`URL: ${URL}`);
console.log();

const browser = await chromium.launch({ 
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
});

const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 }
});

const page = await context.newPage();

console.log('📡 Navigating to Stitch...');
await page.goto(URL, { timeout: 60000, waitUntil: 'networkidle' });
console.log('✅ Page loaded');

console.log('⏳ Waiting for page to stabilize...');
await page.waitForTimeout(15000);

console.log('📸 Taking screenshot...');
await page.screenshot({ path: '/tmp/stitch-page.png', fullPage: true });

console.log('📝 Looking for input box at bottom of page...');

// Try multiple selectors based on the screenshot analysis
const selectors = [
  'input[placeholder*="change or create"]',
  'input[placeholder*="What would you like"]',
  'textarea[placeholder*="change"]',
  '[role="textbox"]',
  '[contenteditable="true"]',
  'div[contenteditable]',
  'input[type="text"]',
  '.prompt-input',
  'input'
];

let inputFound = false;
for (const selector of selectors) {
  try {
    const inputBox = page.locator(selector).first();
    const isVisible = await inputBox.isVisible();
    if (isVisible) {
      console.log(`✅ Found input with selector: ${selector}`);
      
      console.log('⌨️  Clicking input...');
      await inputBox.click();
      await page.waitForTimeout(1000);
      
      console.log('⌨️  Typing prompt...');
      await inputBox.fill(PROMPT);
      await page.waitForTimeout(1000);
      
      console.log('⌨️  Pressing Enter...');
      await page.keyboard.press('Enter');
      
      inputFound = true;
      break;
    }
  } catch (e) {
    console.log(`❌ Selector ${selector} failed: ${e.message}`);
  }
}

if (!inputFound) {
  console.log('❌ No input box found with any selector!');
  console.log('📸 Saving screenshot: /tmp/stitch-no-input.png');
  await page.screenshot({ path: '/tmp/stitch-no-input.png', fullPage: true });
  
  // Try clicking at bottom center of page where input should be
  console.log('🎯 Trying to click at bottom center position...');
  await page.click({ x: 960, y: 1000 });
  await page.waitForTimeout(2000);
  await page.keyboard.type(PROMPT.substring(0, 200));
  await page.waitForTimeout(1000);
  await page.keyboard.press('Enter');
  inputFound = true;
}

console.log('⏳ Waiting for generation (120 seconds)...');
for (let i = 0; i < 12; i++) {
  console.log(`   Progress: ${(i+1)*10}/120 seconds...`);
  await page.waitForTimeout(10000);
  
  // Check if generation started by looking for loading indicators
  const hasLoading = await page.locator('[class*="loading"], [class*="spinner"], [class*="progress"]').first().isVisible().catch(() => false);
  if (hasLoading) {
    console.log('   🔄 Generation in progress...');
  }
}

console.log('📸 Taking after screenshot...');
await page.screenshot({ path: '/tmp/stitch-after.png', fullPage: true });

await browser.close();

console.log();
console.log('✅ Done!');
console.log('🖼️  Check screenshots:');
console.log('   /tmp/stitch-page.png - Page overview');
console.log('   /tmp/stitch-after.png - After generation attempt');
console.log();
console.log('🌐 Check project:');
console.log(`   https://stitch.withgoogle.com/projects/${PROJECT_ID}`);
