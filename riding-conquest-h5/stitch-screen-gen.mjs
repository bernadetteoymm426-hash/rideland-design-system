import { chromium } from 'playwright';

const PROJECT_ID = '5180537362465701192';
const URL = `https://stitch.withgoogle.com/projects/${PROJECT_ID}`;

// More specific prompt to generate a SCREEN not a design system
const PROMPT = `Generate a new SCREEN: Landscape mobile game homepage 1920x1080 for "Rideland" cycling conquest game.

EXACT LAYOUT:
- Top bar 80px: Logo left, weekly status pill right
- Map area 85% screen: China map with green/red/orange territory overlays  
- Floating navigation at bottom: 4 buttons 80x80px (战队/作战/战报/排行)
- User avatar top-right corner: 64px circle with gold rotating ring

COLORS: Deep space black #070E1B background, tech blue #3B82F6 buttons, emerald green territories

This is for a GAME UI, not a website. Generate ONE SCREEN showing the homepage map view.`;

console.log('🎨 Generating homepage SCREEN in Stitch...');

const browser = await chromium.launch({ 
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await context.newPage();

await page.goto(URL, { timeout: 60000 });
await page.waitForTimeout(15000);
console.log('✅ Page loaded');

await page.mouse.click(960, 1000);
await page.waitForTimeout(1000);
await page.keyboard.type(PROMPT, { delay: 30 });
await page.waitForTimeout(500);
await page.keyboard.press('Enter');

console.log('⏳ Waiting for screen generation (120 seconds)...');
for (let i = 0; i < 12; i++) {
  console.log(`   ${((i+1)*10).toString().padStart(3)}%...`);
  await page.waitForTimeout(10000);
}

await page.screenshot({ path: '/tmp/stitch-screen-result.png', fullPage: true });
await browser.close();

console.log();
console.log('✅ Check project: https://stitch.withgoogle.com/projects/5180537362465701192');
