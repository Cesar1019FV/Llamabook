import { useTranslation } from '../../node_modules/react-i18next'
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n/config'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const currentLanguage = i18n.language as SupportedLanguage

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const language = event.target.value as SupportedLanguage
    void i18n.changeLanguage(language)
    document.documentElement.lang = language
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language-switcher" className="sr-only">
        {t('language.label')}
      </label>

      <select
        id="language-switcher"
        value={currentLanguage}
        onChange={handleChange}
        className="rounded-lg border border-llama-border bg-white px-3 py-2 text-sm text-llama-ink focus:outline-none focus:ring-2 focus:ring-llama-primary focus:ring-offset-2"
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <option key={language} value={language}>
            {LANGUAGE_LABELS[language]}
          </option>
        ))}
      </select>
    </div>
  )
}
