import type { Model } from './types'

const gradients = {
  indigo: 'linear-gradient(135deg,#6366f1,#818cf8)',
  emerald: 'linear-gradient(135deg,#10b981,#34d399)',
  amber: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
  rose: 'linear-gradient(135deg,#f43f5e,#fb7185)',
  sky: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
  violet: 'linear-gradient(135deg,#8b5cf6,#a78bfa)',
  terracotta: 'linear-gradient(135deg,#c96442,#d97757)',
}

const dotColors = {
  indigo: '#818cf8',
  emerald: '#34d399',
  amber: '#fbbf24',
  rose: '#fb7185',
  sky: '#38bdf8',
  violet: '#a78bfa',
  terracotta: '#d97757',
}

export const defaultModel: Model = {
  id: 'llama3.2',
  name: 'llama3.2',
  desc: 'Modelo local generalista de Ollama',
  provider: 'local',
  gradient: gradients.terracotta,
  dotColor: dotColors.terracotta,
}

export const availableModels: Model[] = [
  defaultModel,
  {
    id: 'qwen2.5',
    name: 'qwen2.5',
    desc: 'Modelo local Qwen 2.5 de Ollama',
    provider: 'local',
    gradient: gradients.indigo,
    dotColor: dotColors.indigo,
  },
  {
    id: 'mistral',
    name: 'mistral',
    desc: 'Modelo local Mistral de Ollama',
    provider: 'local',
    gradient: gradients.sky,
    dotColor: dotColors.sky,
  },
  {
    id: 'codellama',
    name: 'codellama',
    desc: 'Modelo local especializado en codigo',
    provider: 'local',
    gradient: gradients.emerald,
    dotColor: dotColors.emerald,
  },
  {
    id: 'gemma2',
    name: 'gemma2',
    desc: 'Modelo local Gemma 2 de Ollama',
    provider: 'local',
    gradient: gradients.amber,
    dotColor: dotColors.amber,
  },
  {
    id: 'phi4',
    name: 'phi4',
    desc: 'Modelo local Phi 4 de Microsoft',
    provider: 'local',
    gradient: gradients.violet,
    dotColor: dotColors.violet,
  },
  {
    id: 'deepseek-r1',
    name: 'deepseek-r1',
    desc: 'Modelo local DeepSeek R1 de razonamiento',
    provider: 'local',
    gradient: gradients.rose,
    dotColor: dotColors.rose,
  },
]
