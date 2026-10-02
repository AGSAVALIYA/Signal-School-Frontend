import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Regenerates the screenshots used in the README and docs: `npm run screenshots` (API running with seed data).
// Skipped in normal e2e runs.
test.skip(!process.env.SCREENSHOTS, 'set SCREENSHOTS=1 to refresh docs/screenshots');

const shot = (page, name) => page.screenshot({ path: `docs/screenshots/${test.info().project.name}-${name}.png` });
const settle = async (page) => {
  await expect(page.locator('.MuiCircularProgress-root')).toHaveCount(0, { timeout: 15000 });
  await page.waitForTimeout(300);
};

test('screens for the docs', async ({ page }) => {
  await page.goto('/');
  await settle(page);
  await shot(page, 'login');

  await login(page, 'sunita@demo.test');
  await settle(page);
  await shot(page, 'teacher-today');
  await page.getByRole('link', { name: /Take attendance|Change attendance/ }).first().click();
  await settle(page);
  await shot(page, 'take-attendance');

  await page.goto('/me');
  await page.getByRole('button', { name: 'मराठी' }).click();
  await page.goto('/');
  await settle(page);
  await shot(page, 'teacher-today-marathi');
  await page.goto('/me');
  await page.getByRole('button', { name: 'English' }).click();

  await page.goto('/me');
  await page.getByRole('button', { name: /Log out/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: /Log out/ }).click();
  await login(page, 'owner@demo.test');
  await settle(page);
  await shot(page, 'dashboard');
  await page.goto('/students');
  await settle(page);
  await shot(page, 'students');
  await page.locator('main .MuiListItemButton-root').first().click();
  await settle(page);
  await shot(page, 'student-profile');
  await page.goto('/attendance/register');
  await settle(page);
  await shot(page, 'register');
  await page.goto('/years/new');
  await settle(page);
  await shot(page, 'new-year-wizard');
});
