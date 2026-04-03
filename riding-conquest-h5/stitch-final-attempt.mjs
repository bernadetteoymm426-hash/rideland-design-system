import { chromium } from 'playwright';

const PROJECT_ID = '5180537362465701192';
const URL = `https://stitch.withgoogle.com/projects/${PROJECT_ID}`;

// Use existing design system to generate a screen
const PROMPT = `Using the Rideland Tactical design system already in this project, GENERATE A NEW SCREEN showing:

🎮 GAME HOMEPAGE - Landscape 1920x1080

WHAT TO SHOW:
• Full China map (85% of screen)
• Territory overlays: green for allied, red for enemy, orange for contested
• Top bar with logo and weekly status
• Bottom floating navigation with 4 icon buttons
• User avatar in top-right corner

ACTION: Create ONE screen showing this game homepage layout. NOT a design system - a SCREEN.`;

console.log('🎨 Final attempt: Generating game homepage screen...');
console.log('   Using existing Rideland Tactical design system');
console.log();

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await context.newPage();

await page.goto(URL, { timeout: 60000 });
await page.waitForTimeout(15000);

await page.mouse.click(960, 1000);
await page.waitForTimeout(1000);
await page.keyboard.type(PROMPT, { delay: 30 });
await page.waitForTimeout(500);
await page.keyboard.press('Enter');

console.log('⏳ Waiting for screen generation (150 seconds)...');
for (let i = 0; i < 15; i++) {
  console.log(`   ${((i+1)*10).toString().padStart(3)}%...`);
  await page.waitForTimeout(10000);
}

await page.screenshot({ path: '/tmp/stitch-final.png', fullPage: true });
await browser.close();

console.log();
console.log('✅ Check: https://stitch.withgoogle.com/projects/5180537362465701192');
