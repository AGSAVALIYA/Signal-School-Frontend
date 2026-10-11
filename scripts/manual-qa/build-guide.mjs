// Prints scripts/manual-qa/guide.html to manual-qa/Signal-School-QA-Guide.pdf with Playwright's Chromium.
//   node scripts/manual-qa/build-guide.mjs
// Screenshots in img/ come from the app running on the QA seed of the API (`npm run db:seed:qa`).
import { chromium } from '@playwright/test';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = fileURLToPath(new URL('../../manual-qa/Signal-School-QA-Guide.pdf', import.meta.url));
const localChromium = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch(existsSync(localChromium) ? { executablePath: localChromium } : {});
const page = await browser.newPage();
await page.goto(pathToFileURL(`${here}guide.html`).href, { waitUntil: 'networkidle' });
await page.evaluate(() => globalThis.document.fonts.ready);
const footer = `<div style="width:100%;font:7.5pt sans-serif;color:#6b5a60;padding:0 15mm;display:flex;justify-content:space-between">
  <span>Signal School · Testing guide · for testing only – all children and people in the app are made up</span>
  <span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;
await page.pdf({
  path: out,
  format: 'A4',
  printBackground: true,
  margin: { top: '15mm', right: '15mm', bottom: '17mm', left: '15mm' },
  displayHeaderFooter: true,
  headerTemplate: '<span></span>',
  footerTemplate: footer,
});
await browser.close();
console.log(out);
