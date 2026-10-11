import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { login, watchErrors, expectNoHorizontalScroll } from './helpers';

// School looks: the principal tries and saves one; every look keeps the screens readable and accessible.
const LOOKS = ['signal', 'chalkboard', 'notebook', 'marigold', 'classic', 'clear'];

async function setLook(request, theme) {
  const res = await request.post('/api/v1/auth/login', { data: { identifier: 'owner@demo.test', password: 'password123' } });
  const { accessToken } = (await res.json()).data;
  const patched = await request.patch('/api/v1/school', { data: { theme }, headers: { Authorization: `Bearer ${accessToken}` } });
  expect(patched.ok()).toBeTruthy();
}

const scan = async (page) => {
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  return violations.map((v) => `${v.id}: ${v.nodes.length}× e.g. ${v.nodes[0].target.join(' ')} — ${v.help}`);
};
const settle = (page) => expect(page.locator('.MuiCircularProgress-root')).toHaveCount(0, { timeout: 15000 });

test.afterAll(async ({ request }) => setLook(request, 'signal'));

test('principal tries a look on their own screen, then uses it for the whole school', async ({ page, browser }) => {
  const errors = watchErrors(page);
  await login(page, 'principal@demo.test');
  await page.goto('/school?tab=look');
  await page.getByRole('button', { name: /Blackboard/ }).click();
  await expect(page.getByText(/You are trying “Blackboard”/)).toBeVisible();
  // Only this screen changed: the app bar is the blackboard green now.
  await expect(page.locator('header')).toHaveCSS('background-color', 'rgb(31, 74, 58)');
  await page.getByRole('button', { name: 'Use for the whole school' }).click();
  await expect(page.getByText(/Everyone in the school now sees “Blackboard”/)).toBeVisible();
  await expectNoHorizontalScroll(page);

  // A teacher logging in on another phone gets the school's look.
  const teacher = await browser.newPage({ viewport: { width: 360, height: 740 } });
  await login(teacher, 'sunita@demo.test');
  await expect(teacher.locator('header')).toHaveCSS('background-color', 'rgb(31, 74, 58)');
  await teacher.close();

  // Cancel goes back to the saved look.
  await page.getByRole('button', { name: /Marigold/ }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.locator('header')).toHaveCSS('background-color', 'rgb(31, 74, 58)');
  expect(errors).toEqual([]);
});

for (const look of LOOKS) {
  test(`“${look}” look: main screens are accessible and fit the screen`, async ({ page, request }) => {
    await setLook(request, look);
    const errors = watchErrors(page);
    await login(page, 'sunita@demo.test');
    const found = [];
    for (const path of ['/', '/students']) {
      await page.goto(path);
      await settle(page);
      await expectNoHorizontalScroll(page);
      for (const v of await scan(page)) found.push(`${path}: ${v}`);
    }
    await page.goto('/');
    await page
      .getByRole('link', { name: /Take attendance|Change attendance/ })
      .first()
      .click();
    await expect(page.getByRole('button', { name: /: Absent$/ }).first()).toBeVisible();
    for (const v of await scan(page)) found.push(`attendance: ${v}`);
    await page.goto('/me');
    await page.getByRole('button', { name: /Log out/ }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: /Log out/ })
      .click();
    await login(page, 'principal@demo.test');
    for (const path of ['/dashboard', '/school?tab=look']) {
      await page.goto(path);
      await settle(page);
      await expectNoHorizontalScroll(page);
      for (const v of await scan(page)) found.push(`${path}: ${v}`);
    }
    expect(found).toEqual([]);
    expect(errors).toEqual([]);
  });
}
