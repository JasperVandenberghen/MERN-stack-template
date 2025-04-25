import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../src/locales/gb/gb.json';
import frTranslation from '../src/locales/fr/fr.json';
import nlTranslation from '../src/locales/nl/nl.json';

i18n.use(initReactI18next).init({
  resources: {
    gb: {
      translation: enTranslation,
    },
    fr: {
      translation: frTranslation,
    },
    nl: {
      translation: nlTranslation,
    },
  },
  lng: 'gb',
  fallbackLng: 'gb',
  interpolation: {
    escapeValue: false,
  },
  returnObjects: false,
});

export default i18n;
