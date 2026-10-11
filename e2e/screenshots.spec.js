import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { login } from './helpers';

// Regenerates the screenshots used in the README and docs: `npm run screenshots` (API running with `npm run db:seed`
// data). Skipped in normal e2e runs.
test.skip(!process.env.SCREENSHOTS, 'set SCREENSHOTS=1 to refresh docs/screenshots');

const DIR = 'docs/screenshots';
const LOOKS = ['signal', 'chalkboard', 'notebook', 'marigold', 'classic', 'clear'];
const shot = (page, name) => page.screenshot({ path: `${DIR}/${test.info().project.name}-${name}.png` });
const settle = async (page) => {
  await expect(page.locator('.MuiCircularProgress-root')).toHaveCount(0, { timeout: 15000 });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(400);
};
const logout = async (page) => {
  await page.goto('/me');
  await page.getByRole('button', { name: /Log out/ }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: /Log out/ })
    .click();
};
async function setLook(request, theme) {
  const res = await request.post('/api/v1/auth/login', { data: { identifier: 'owner@demo.test', password: 'password123' } });
  const { accessToken } = (await res.json()).data;
  await request.patch('/api/v1/school', { data: { theme }, headers: { Authorization: `Bearer ${accessToken}` } });
}

test('screens for the docs', async ({ page, request }) => {
  test.setTimeout(240000);
  await setLook(request, 'signal');
  await page.goto('/');
  await settle(page);
  await shot(page, 'login');

  await login(page, 'sunita@demo.test');
  await settle(page);
  await shot(page, 'teacher-today');
  await page
    .getByRole('link', { name: /Take attendance|Change attendance/ })
    .first()
    .click();
  await settle(page);
  await page
    .getByRole('button', { name: /: Absent$/ })
    .nth(2)
    .click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(page, 'take-attendance');

  await page.goto('/me');
  await page.getByRole('button', { name: 'मराठी' }).click();
  await page.goto('/');
  await settle(page);
  await shot(page, 'teacher-today-marathi');
  await page.goto('/me');
  await page.getByRole('button', { name: 'English' }).click();
  await logout(page);

  await login(page, 'principal@demo.test');
  await settle(page);
  await shot(page, 'dashboard');
  await page.goto('/attendance');
  await settle(page);
  await shot(page, 'attendance-today');
  await page.goto('/students');
  await settle(page);
  await shot(page, 'students');
  await page.locator('main .MuiListItemButton-root').nth(1).click();
  await settle(page);
  await shot(page, 'student-profile');
  await page.goto('/attendance/register');
  await settle(page);
  await shot(page, 'register');
  await page.goto('/years/new');
  await settle(page);
  await shot(page, 'new-year-wizard');
  await page.goto('/school?tab=look');
  await settle(page);
  await shot(page, 'look-picker');
  await logout(page);

  // The teacher home in every look, side by side (phone only).
  if (test.info().project.name !== 'phone') return;
  for (const look of LOOKS) {
    await setLook(request, look);
    await login(page, 'sunita@demo.test');
    await settle(page);
    await page.screenshot({ path: `e2e-results/looks/${look}.png` });
    await logout(page);
  }
  await setLook(request, 'signal');
  const images = LOOKS.map((l) => `data:image/png;base64,${readFileSync(`e2e-results/looks/${l}.png`).toString('base64')}`);
  // One device pixel per CSS pixel keeps the README image small.
  const sheet = await page
    .context()
    .browser()
    .newPage({ viewport: { width: 6 * 372 + 12, height: 760 }, deviceScaleFactor: 1 });
  await sheet.setContent(
    `<body style="margin:0;background:#fff;display:flex;gap:12px;padding:6px">${images.map((src) => `<img src="${src}" width="360" style="border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.25)">`).join('')}</body>`,
  );
  await sheet.screenshot({ path: `${DIR}/looks.png` });
  await sheet.close();
});
