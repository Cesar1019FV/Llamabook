import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Features } from './components/Features'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-llama-canvas">
      <Header />

      <main className="flex-1">
        <Hero />
        <Features />
      </main>

      <Footer />
    </div>
  )
}

export default App
