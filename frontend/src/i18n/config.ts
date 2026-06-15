import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './locales/es.json'
import en from './locales/en.json'

export const SUPPORTED_LANGUAGES = ['es', 'en'] as const
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  es: 'Español',
  en: 'English',
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: true,
    },
  })

export default i18n
