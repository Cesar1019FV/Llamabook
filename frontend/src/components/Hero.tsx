import { useTranslation } from '../../node_modules/react-i18next'

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="w-full bg-llama-canvas px-4 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-llama-primary">
          {t('hero.eyebrow')}
        </p>

        <h1 className="mb-6 text-4xl font-semibold leading-tight tracking-tight text-llama-ink md:text-5xl lg:text-6xl">
          {t('hero.title')}
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-llama-muted">
          {t('hero.subtitle')}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#features"
            className="inline-flex items-center justify-center rounded-lg bg-llama-primary px-6 py-3 text-base font-medium text-white hover:bg-llama-primary-hover focus-ring transition-colors"
          >
            {t('hero.ctaPrimary')}
          </a>

          <a
            href="#about"
            className="inline-flex items-center justify-center rounded-lg border border-llama-border bg-llama-canvas px-6 py-3 text-base font-medium text-llama-ink hover:bg-llama-surface focus-ring transition-colors"
          >
            {t('hero.ctaSecondary')}
          </a>
        </div>
      </div>
    </section>
  )
}
