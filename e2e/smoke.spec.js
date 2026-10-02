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
  const absent = page.getByRole('button', { name: /: Absent$/ });
  await expect(absent.first()).toBeVisible();
  await absent.first().click(); // one tap: Absent
  await expect(absent.first()).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('Absent: 1')).toBeVisible();
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
  const saved = page.waitForResponse((r) => r.url().endsWith('/api/v1/me') && r.request().method() === 'PATCH');
  await page.getByRole('button', { name: 'English' }).click();
  await saved;
});

test('office records a health check-up and prints a leaving certificate', async ({ page }) => {
  const errors = watchErrors(page);
  await login(page, 'clerk@demo.test');
  await page.goto('/students');
  await page.locator('main .MuiListItemButton-root').first().click();
  await page.getByRole('tab', { name: 'Health' }).click();
  await page.getByRole('button', { name: 'Add health check-up' }).click();
  await page.getByLabel('Weight (kg)').fill('21.5');
  await page.getByLabel('Needs a doctor again').check();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByText('Weight: 21.5 kg')).toBeVisible();
  await expect(page.getByText(/needs to see a doctor again/)).toBeVisible();

  await page.getByRole('button', { name: 'Mark as left school' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Reason').click();
  await page.getByRole('option', { name: 'Joined another school' }).click();
  await dialog.getByLabel('Joining school (if known)').fill('ZP School Kalwa');
  await dialog.getByRole('button', { name: 'Mark as left school' }).click();
  await page.getByRole('link', { name: 'Leaving certificate' }).click();
  await expect(page.getByText('ZP School Kalwa')).toBeVisible();
  await expectNoHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('extra large text still fits a phone screen', async ({ page }) => {
  await login(page, 'sunita@demo.test');
  await page.goto('/me');
  await page.getByRole('button', { name: 'Extra large' }).click();
  await expect(page.locator('html')).toHaveAttribute('style', /font-size: 130%/);
  for (const path of ['/', '/students', '/syllabus', '/me']) {
    await page.goto(path);
    await expect(page.locator('main h1, main h2').first()).toBeVisible();
    await expectNoHorizontalScroll(page);
  }
  await page.goto('/');
  await page
    .getByRole('link', { name: /Take attendance|Change attendance/ })
    .first()
    .click();
  await expect(page.getByRole('button', { name: /: Absent$/ }).first()).toBeVisible();
  await expectNoHorizontalScroll(page);
  await page.goto('/me');
  await page.getByRole('button', { name: 'Normal' }).click();
});

test('principal filters the activity log', async ({ page }) => {
  const errors = watchErrors(page);
  await login(page, 'owner@demo.test');
  await page.goto('/audit');
  await page.getByLabel('Kind of change').click();
  await page.getByRole('option', { name: 'Health' }).click();
  await expect(page.locator('main')).toContainText(/health check-up|No activity yet/);
  await page.getByLabel('Person').click();
  await page.getByRole('option').nth(1).click();
  await expect(page.locator('main h1')).toBeVisible();
  expect(errors).toEqual([]);
});

test('office is warned before admitting a child twice, and sees one child’s month', async ({ page }) => {
  const errors = watchErrors(page);
  await login(page, 'clerk@demo.test');
  await page.goto('/students');
  const first = page.locator('main .MuiListItemButton-root').first();
  const name = (await first.locator('.MuiListItemText-primary').textContent()).trim();
  await page.getByRole('button', { name: 'Add student' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel(/^Full name/).fill(name);
  await dialog.getByRole('combobox', { name: /^Class/ }).click();
  await page.getByRole('option').first().click();
  await dialog.getByRole('button', { name: 'Save student' }).click();
  await expect(dialog.getByText('Is this child already in the school records?')).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'No, add as a new child' })).toBeVisible();
  await dialog
    .getByText(new RegExp(`^${name} · GR`))
    .first()
    .click();
  await expect(page).toHaveURL(/\/students\/\d+$/);
  await page.getByRole('tab', { name: 'Past years' }).click();
  await expect(page.getByRole('grid', { name: 'Attendance this month' })).toBeVisible();
  await expectNoHorizontalScroll(page);
  expect(errors).toEqual([]);
});
