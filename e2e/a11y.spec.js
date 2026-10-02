import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { login } from './helpers';

// Automated accessibility scan (WCAG 2.1 A/AA rules) of the screens each role uses most.
const PAGES = {
  'sunita@demo.test': ['/', '/attendance', '/students', '/syllabus', '/me'],
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
    '/audit',
    '/school',
  ],
  'clerk@demo.test': ['/dashboard', '/students'],
};

const scan = async (page) => {
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  return violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length}× e.g. ${v.nodes[0].target.join(' ')} — ${v.help}`);
};

test('login screen has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /^Log in$/ })).toBeVisible();
  expect(await scan(page)).toEqual([]);
});

for (const [user, paths] of Object.entries(PAGES)) {
  test(`${user} screens have no accessibility violations`, async ({ page }) => {
    await login(page, user);
    const found = [];
    for (const path of paths) {
      await page.goto(path);
      await expect(page.locator('main h1, main h2').first()).toBeVisible();
      await expect(page.locator('.MuiCircularProgress-root')).toHaveCount(0, { timeout: 15000 });
      for (const v of await scan(page)) found.push(`${path}: ${v}`);
    }
    expect(found).toEqual([]);
  });
}

test('attendance sheet has no accessibility violations', async ({ page }) => {
  await login(page, 'sunita@demo.test');
  await page
    .getByRole('link', { name: /Take attendance|Change attendance/ })
    .first()
    .click();
  await expect(page.getByRole('button', { name: /: Absent$/ }).first()).toBeVisible();
  expect(await scan(page)).toEqual([]);
});

test('student profile tabs have no accessibility violations', async ({ page }) => {
  await login(page, 'owner@demo.test');
  await page.goto('/students');
  await page.locator('main .MuiListItemButton-root').first().click();
  const found = [];
  for (const tab of ['Details', 'Daily diary', 'Past years', 'Report card', 'Health']) {
    await page.getByRole('tab', { name: tab }).click();
    await expect(page.locator('.MuiCircularProgress-root')).toHaveCount(0, { timeout: 15000 });
    for (const v of await scan(page)) found.push(`${tab}: ${v}`);
  }
  await page.goto('/staff');
  await page.locator('main .MuiListItemButton-root').first().click();
  for (const tab of ['Profile', 'Classes', 'Activity']) {
    await page.getByRole('tab', { name: tab }).click();
    await expect(page.locator('.MuiCircularProgress-root')).toHaveCount(0, { timeout: 15000 });
    for (const v of await scan(page)) found.push(`staff ${tab}: ${v}`);
  }
  expect(found).toEqual([]);
});
