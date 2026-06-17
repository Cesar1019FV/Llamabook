export interface PinnedItem {
  id: string
  title: string
  preview: string
  time: string
}

export interface NotebookCard {
  id: string
  name: string
  preview: string
  chatCount: number
  emoji: string
  color: string
  textColor: string
}

export const pinnedItems: PinnedItem[] = [
  {
    id: 'c1',
    title: 'Arquitectura de caché',
    preview: 'Redis Cluster con sharding y Cache-Aside',
    time: 'hace 12 min',
  },
  {
    id: 'c4',
    title: 'Auth flow microservicios',
    preview: 'JWT, refresh tokens y rotación',
    time: 'ayer',
  },
]

export const notebookCards: NotebookCard[] = [
  {
    id: 'infra',
    name: 'Infraestructura',
    preview: 'Caché, Gateways, Sharding, Auth',
    chatCount: 4,
    emoji: '⚙',
    color: 'rgba(99,102,241,0.1)',
    textColor: '#818cf8',
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    preview: 'Fine-tuning, Datasets, Deploy',
    chatCount: 3,
    emoji: '🧠',
    color: 'rgba(244,114,182,0.1)',
    textColor: '#f472b6',
  },
  {
    id: 'devops',
    name: 'DevOps',
    preview: 'CI/CD, Monitoring',
    chatCount: 2,
    emoji: '🚀',
    color: 'rgba(34,197,94,0.1)',
    textColor: '#4ade80',
  },
]
