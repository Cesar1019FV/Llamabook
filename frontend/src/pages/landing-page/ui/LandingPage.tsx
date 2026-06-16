import { Header } from '@/widgets/header'
import { Hero } from '@/widgets/hero'
import { FeaturesList } from '@/widgets/features-list'
import { Footer } from '@/widgets/footer'

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-llama-canvas">
      <Header />

      <main className="flex-1">
        <Hero />
        <FeaturesList />
      </main>

      <Footer />
    </div>
  )
}
