import type { FeatureItem } from '../types'

interface FeatureCardProps {
  feature: FeatureItem
  index: number
}

export function FeatureCard({ feature, index }: FeatureCardProps) {
  return (
    <article className="rounded-xl border border-llama-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-llama-surface text-sm font-semibold text-llama-primary">
        {String(index + 1).padStart(2, '0')}
      </span>

      <h3 className="mb-2 text-lg font-semibold text-llama-ink">
        {feature.title}
      </h3>

      <p className="leading-relaxed text-llama-muted">
        {feature.description}
      </p>
    </article>
  )
}
