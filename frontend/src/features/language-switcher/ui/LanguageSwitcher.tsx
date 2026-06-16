import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, type SupportedLanguage } from '../model'
import { changeLanguage } from '../lib/changeLanguage'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const currentLanguage = i18n.language as SupportedLanguage

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    changeLanguage(event.target.value as SupportedLanguage)
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
