import { test, expect } from '@playwright/test';
import { login, watchErrors, expectNoHorizontalScroll } from './helpers';

// Every page each role can open renders without crashing, without console errors and without sideways scrolling.
const PAGES = {
  'owner@demo.test': [
    '/dashboard',
    '/attendance',
    '/attendance/register',
    '/students',
    '/students/import',
    '/syllabus',
    '/marks',
    '/classes',
    '/staff',
    '/years',
    '/years/new',
    '/holidays',
    '/school',
    '/audit',
    '/me',
  ],
  'clerk@demo.test': ['/dashboard', '/attendance', '/students', '/students/import', '/syllabus', '/me'],
  'sunita@demo.test': ['/', '/attendance', '/students', '/syllabus', '/marks', '/me'],
};

for (const [user, paths] of Object.entries(PAGES)) {
  test(`${user} can open every page`, async ({ page }) => {
    const errors = watchErrors(page);
    await login(page, user);
    for (const path of paths) {
      await page.goto(path);
      await expect(page.locator('main h1, main h2').first(), path).toBeVisible();
      await expect(page.getByRole('progressbar').and(page.locator('.MuiCircularProgress-root'))).toHaveCount(0, { timeout: 15000 });
      await expect(page.getByText('Something went wrong')).toHaveCount(0);
      await expectNoHorizontalScroll(page);
      await page.screenshot({
        path: `e2e-results/screens/${test.info().project.name}-${user.split('@')[0]}${path.replace(/\//g, '_') || '_home'}.png`,
        fullPage: true,
      });
    }
    expect(errors).toEqual([]);
  });
}

test('teacher takes attendance for the class in a few taps', async ({ page }) => {
  const errors = watchErrors(page);
  await login(page, 'sunita@demo.test');
  await page
    .getByRole('link', { name: /Take attendance|Change attendance/ })
    .first()
    .click();
  const rows = page.locator('main button[aria-label*=":"]');
  await expect(rows.first()).toBeVisible();
  await rows.first().click(); // Present → Absent
  await page.getByRole('button', { name: /Save attendance/i }).click();
  await expect(page.getByText(/Saved at/i)).toBeVisible();
  expect(errors).toEqual([]);
});

test('switching language changes the whole interface', async ({ page }) => {
  await login(page, 'sunita@demo.test');
  await page.goto('/me');
  await page.getByRole('button', { name: 'मराठी' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'mr');
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveText(/My profile|Me/);
  await page.getByRole('button', { name: 'English' }).click();
});
