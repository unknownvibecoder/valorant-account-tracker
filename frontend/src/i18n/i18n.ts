import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import các file ngôn ngữ từ thư mục locales
import viTranslation from './locales/vi.json';
import enTranslation from './locales/en.json';
import zhTranslation from './locales/zh.json';

const resources = {
  vi: { translation: viTranslation },
  en: { translation: enTranslation },
  zh: { translation: zhTranslation },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'vi', // Ngôn ngữ mặc định
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React đã tự động chống XSS
  },
});

export default i18n;