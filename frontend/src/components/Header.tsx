import { useTranslation } from '../../node_modules/react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'

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

        <nav aria-label="Main navigation">
          <ul className="hidden items-center gap-6 text-sm text-llama-muted md:flex">
            <li>
              <a href="#features" className="hover:text-llama-ink transition-colors">
                {t('header.nav.features')}
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-llama-ink transition-colors">
                {t('header.nav.about')}
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-llama-ink transition-colors">
                {t('header.nav.contact')}
              </a>
            </li>
          </ul>
        </nav>

        <LanguageSwitcher />
      </div>
    </header>
  )
}
