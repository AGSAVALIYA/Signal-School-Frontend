import dayjs from 'dayjs';

export const todayISO = () => dayjs().format('YYYY-MM-DD');
export const fmtDate = (d) => (d ? dayjs(d).format('DD MMM YYYY') : '');
export const fmtShort = (d) => (d ? dayjs(d).format('DD/MM/YYYY') : '');
export const fmtDateTime = (d) => (d ? dayjs(d).format('DD MMM YYYY, HH:mm') : '');
export const fmtTime = (d) => (d ? dayjs(d).format('HH:mm') : '');
export const monthISO = (d = undefined) => dayjs(d).format('YYYY-MM');

// Master data may carry translations: { name, nameTranslations: { mr: '...' } }.
export const localName = (item, lng) => (item ? item.nameTranslations?.[lng] || item.name : '');

export const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
