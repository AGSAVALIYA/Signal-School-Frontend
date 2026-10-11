import { describe, expect, test } from 'vitest';
import { LOOKS, LOOK_IDS, DEFAULT_LOOK } from './looks';
import { buildTheme } from './build';

// WCAG contrast ratio between two #rrggbb colours.
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const firstColour = (css) => css.match(/#[0-9a-f]{6}/i)[0];

describe.each(LOOK_IDS)('look "%s"', (id) => {
  const { palette: p, bar } = LOOKS[id];

  test('text is readable on every surface (≥ 4.5:1)', () => {
    for (const bg of [p.background.default, p.background.paper]) {
      expect(contrast(p.text.primary, bg)).toBeGreaterThanOrEqual(7);
      expect(contrast(p.text.secondary, bg)).toBeGreaterThanOrEqual(4.5);
    }
    for (const c of ['primary', 'secondary', 'success', 'warning', 'error', 'info']) {
      expect(contrast(p[c].main, p[c].contrastText), `${c} button text`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(p[c].main, p.background.paper), `${c} as text`).toBeGreaterThanOrEqual(4.5);
    }
    expect(contrast(bar.fg, firstColour(bar.bg))).toBeGreaterThanOrEqual(4.5);
  });

  test('is a light look and builds a theme', () => {
    expect(lum(p.background.default)).toBeGreaterThan(0.6);
    const theme = buildTheme(id, {});
    expect(theme.palette.mode).toBe('light');
    expect(theme.look.id).toBe(id);
  });

  test('has an icon for every meaning', async () => {
    const [own, base] = await Promise.all([LOOKS[id].icons(), LOOKS.classic.icons()]);
    expect(Object.keys(own.default).sort()).toEqual(Object.keys(base.default).sort());
  });
});

test('the default look is the Signal Shala look, and ids match the API list', () => {
  expect(DEFAULT_LOOK).toBe('signal');
  // Signal-School-Backend src/modules/schools/themes.js
  expect(LOOK_IDS).toEqual(['signal', 'chalkboard', 'notebook', 'marigold', 'classic', 'clear']);
});
