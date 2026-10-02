import { expect } from '@playwright/test';

export const PASSWORD = 'password123';

// Logs in through the real login form and waits for the app shell.
export async function login(page, identifier) {
  await page.goto('/');
  await page.getByRole('button', { name: 'English' }).click();
  await page.getByLabel(/Mobile number or email/i).fill(identifier);
  await page.getByLabel(/^Password/i).fill(PASSWORD);
  await page.getByRole('button', { name: /^Log in$/i }).click();
  await expect(page.locator('main')).toBeVisible();
}

// Collects page crashes and console errors so every test can assert a clean run.
export function watchErrors(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource|favicon|net::ERR/.test(m.text())) errors.push(`console: ${m.text()}`);
  });
  return errors;
}

// No sideways scrolling on the page itself (wide tables scroll inside their own card).
export async function expectNoHorizontalScroll(page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, 'page scrolls sideways').toBeLessThanOrEqual(1);
}
