import { useTranslation } from 'react-i18next'
import { getCurrentYear } from '../lib/getCurrentYear'

export function Footer() {
  const { t } = useTranslation()
  const year = getCurrentYear()

  return (
    <footer className="w-full border-t border-llama-border bg-llama-canvas px-4 py-10 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-llama-muted md:flex-row">
        <p>{t('footer.copyright', { year })}</p>

        <p className="hidden md:block">{t('footer.madeWith')}</p>
      </div>
    </footer>
  )
}
