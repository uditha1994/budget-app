import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import si from './si';
import ta from './ta';

const resources = {
    en: { translation: en },
    si: { translation: si },
    ta: { translation: ta },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
    compatibilityJSON: 'v4',
    react: {
        useSuspense: false,
    },
});

export default i18n;