import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';
import gu from './locales/gu.json';

const flatten = (obj, prefix = '') =>
  Object.entries(obj).reduce((acc, [k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return typeof v === 'object' ? { ...acc, ...flatten(v, key) } : { ...acc, [key]: v };
  }, {});
const placeholders = (s) => [...s.matchAll(/{{\s*(\w+)\s*}}/g)].map((m) => m[1]).sort();

const base = flatten(en);

describe.each([
  ['hi', hi],
  ['mr', mr],
  ['gu', gu],
])('%s locale', (_, locale) => {
  const flat = flatten(locale);

  it('has exactly the same keys as en', () => {
    expect(Object.keys(flat).sort()).toEqual(Object.keys(base).sort());
  });

  it('keeps every placeholder and has no empty strings', () => {
    for (const [key, value] of Object.entries(base)) {
      expect(flat[key], key).toBeTruthy();
      expect(placeholders(flat[key] ?? ''), key).toEqual(placeholders(value));
    }
  });
});

describe('source code', () => {
  const files = (dir) =>
    readdirSync(dir).flatMap((f) => {
      const p = join(dir, f);
      if (statSync(p).isDirectory()) return files(p);
      return /\.jsx?$/.test(f) && !f.endsWith('.test.js') ? [p] : [];
    });

  it('only uses translation keys that exist in en', () => {
    const missing = [];
    for (const file of files(join(__dirname, '..'))) {
      const src = readFileSync(file, 'utf8');
      for (const [, key] of src.matchAll(/\bt\(\s*'([a-zA-Z0-9_.]+)'/g)) {
        if (!(key in base) && !(`${key}_one` in base) && !Object.keys(base).some((k) => k.startsWith(`${key}.`))) {
          missing.push(`${file.split('src/')[1]}: ${key}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });
});
