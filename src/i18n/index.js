import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/hi';
import 'dayjs/locale/mr';
import 'dayjs/locale/gu';
import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';
import gu from './locales/gu.json';
import { session } from '../api/session';

export const LANGUAGES = [
  { code: 'en', native: 'English' },
  { code: 'hi', native: 'हिंदी' },
  { code: 'mr', native: 'मराठी' },
  { code: 'gu', native: 'ગુજરાતી' },
];

const supported = LANGUAGES.map((l) => l.code);
const fromBrowser = (navigator.language || 'en').slice(0, 2);
const initial = session.get().language || (supported.includes(fromBrowser) ? fromBrowser : 'en');

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, hi: { translation: hi }, mr: { translation: mr }, gu: { translation: gu } },
  lng: initial,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
});

const apply = (lng) => {
  document.documentElement.lang = lng;
  dayjs.locale(lng);
};
apply(initial);
i18n.on('languageChanged', (lng) => {
  apply(lng);
  session.set({ language: lng });
});

export default i18n;
