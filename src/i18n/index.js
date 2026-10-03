import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/hi';
import 'dayjs/locale/mr';
import 'dayjs/locale/gu';
import en from './locales/en.json';
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

// Only English (the fallback) is in the main bundle. Each other language (~45 KB of Indic text) is its own chunk,
// downloaded when it is chosen or needed for a guardian's WhatsApp message, and precached for offline use.
const loaders = {
  hi: () => import('./locales/hi.json'),
  mr: () => import('./locales/mr.json'),
  gu: () => import('./locales/gu.json'),
};
const lazyLocales = {
  type: 'backend',
  init() {},
  read(lng, _ns, done) {
    if (!loaders[lng]) return done(null, {});
    loaders[lng]().then(
      (m) => done(null, m.default),
      (err) => done(err, null),
    );
  },
};

// Resolves once the starting language is loaded; main.jsx renders after it so there is no English flash.
export const i18nReady = i18n
  .use(lazyLocales)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en } },
    partialBundledLanguages: true,
    lng: initial,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    returnNull: false,
    react: { useSuspense: false },
  });

// Makes sure a language's texts are available (e.g. to write a message in the guardian's language).
export const loadLanguage = (lng) => (i18n.hasResourceBundle(lng, 'translation') ? Promise.resolve() : i18n.loadLanguages(lng));

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
