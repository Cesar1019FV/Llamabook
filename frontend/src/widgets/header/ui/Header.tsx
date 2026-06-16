import { useTranslation } from 'react-i18next'
import { HeaderNav } from './HeaderNav'
import { LanguageSwitcher } from '@/features/language-switcher'

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="w-full border-b border-llama-border bg-llama-canvas">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <a
          href="#"
          className="text-xl font-semibold tracking-tight text-llama-ink"
          aria-label={t('header.logo')}
        >
          {t('header.logo')}
        </a>

        <HeaderNav />

        <LanguageSwitcher />
      </div>
    </header>
  )
}
