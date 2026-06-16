import { useTranslation } from 'react-i18next'
import { FeatureCard } from '@/entities/feature-card'

export function FeaturesList() {
  const { t } = useTranslation()
  const items = t('features.items', { returnObjects: true }) as Array<{ title: string; description: string }>

  return (
    <section id="features" className="w-full bg-llama-surface px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight text-llama-ink">
          {t('features.title')}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
