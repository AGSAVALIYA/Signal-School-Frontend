import { describe, expect, it } from 'vitest';
import { initials, localName } from './format';
import { can, isStaff } from './permissions';

describe('format', () => {
  it('builds initials from the first two words', () => {
    expect(initials('sunita devi patil')).toBe('SD');
    expect(initials('')).toBe('');
    expect(initials(null)).toBe('');
  });

  it('keeps Indic letters whole (conjuncts and vowel signs)', () => {
    expect(initials('क्षितिज पवार')).toBe('क्षिप');
    expect(initials('श्रेया शिंदे')).toBe('श्रेशिं');
    expect(initials('ગીતા પટેલ')).toBe('ગીપ');
    expect(initials('Sunita Devi')).toBe('SD');
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
