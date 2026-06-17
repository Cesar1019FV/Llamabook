import type { Model } from './types'

export const LlamabookModel: Model = {
  id: 'llamabook-pro',
  name: 'Llamabook Pro',
  desc: 'Modelo avanzado, razonamiento superior',
  gradient: 'linear-gradient(135deg,var(--accent),var(--accent-light))',
  dotColor: '#34d399',
}

export const availableModels: Model[] = [
  LlamabookModel,
  {
    id: 'kimi',
    name: 'Kimi',
    desc: 'Contexto largo, investigación profunda',
    gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    dotColor: '#818cf8',
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    desc: 'Rápido, multimodal, eficiente',
    gradient: 'linear-gradient(135deg,#10b981,#34d399)',
    dotColor: '#34d399',
  },
  {
    id: 'gemma',
    name: 'Gemma',
    desc: 'Open source, ligero y preciso',
    gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
    dotColor: '#fbbf24',
  },
]
