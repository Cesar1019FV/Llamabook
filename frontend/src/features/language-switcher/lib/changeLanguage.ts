import i18n from '@/shared/i18n/config'
import type { SupportedLanguage } from '@/shared/i18n'

export function changeLanguage(language: SupportedLanguage): void {
  void i18n.changeLanguage(language)
  document.documentElement.lang = language
}
