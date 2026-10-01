import { describe, expect, it } from 'vitest';
import { initials, localName } from './format';
import { can, isStaff } from './permissions';

describe('format', () => {
  it('builds initials from the first two words', () => {
    expect(initials('sunita devi patil')).toBe('SD');
    expect(initials('')).toBe('');
  });

  it('prefers a translated name and falls back to the base name', () => {
    const item = { name: 'Maths', nameTranslations: { mr: 'गणित' } };
    expect(localName(item, 'mr')).toBe('गणित');
    expect(localName(item, 'gu')).toBe('Maths');
    expect(localName(null, 'mr')).toBe('');
  });
});

describe('permissions', () => {
  it('mirrors the server matrix', () => {
    expect(can('teacher', 'attendance.write')).toBe(true);
    expect(can('clerk', 'attendance.write')).toBe(false);
    expect(can('admin', 'org.manage')).toBe(false);
    expect(can('teacher', 'unknown.perm')).toBe(false);
    expect(isStaff('owner')).toBe(true);
    expect(isStaff('clerk')).toBe(false);
  });
});
