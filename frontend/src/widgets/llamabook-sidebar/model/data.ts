import type { Notebook } from '@/entities/llamabook-notebook'
import type { ChatGroup } from '@/entities/llamabook-chat'

export const initialNotebooks: Notebook[] = [
  {
    id: 'infra',
    name: 'Infraestructura',
    color: 'rgba(99,102,241,0.35)',
    chats: [
      'Arquitectura de caché',
      'API Gateway patterns',
      'Particionamiento DB',
      'gRPC vs REST',
    ],
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    color: 'rgba(244,114,182,0.35)',
    chats: ['Transformer fine-tuning', 'Dataset augmentation', 'Helm charts prod'],
  },
  {
    id: 'devops',
    name: 'DevOps',
    color: 'rgba(34,197,94,0.35)',
    chats: ['CI/CD GitHub Actions', 'Prometheus + Grafana'],
  },
]

export const recentChatGroups: ChatGroup[] = [
  {
    label: 'today',
    chats: [
      { id: 'c1', title: 'Arquitectura de caché distribuido' },
      { id: 'c2', title: 'API Gateway design patterns' },
      { id: 'c3', title: 'Estrategias de particionamiento DB' },
    ],
  },
  {
    label: 'yesterday',
    chats: [
      { id: 'c4', title: 'Microservicios auth flow' },
      { id: 'c5', title: 'gRPC vs REST comparison' },
    ],
  },
  {
    label: 'last7Days',
    chats: [
      { id: 'c6', title: 'Transformer fine-tuning pipeline' },
      { id: 'c7', title: 'Dataset augmentation strategies' },
    ],
  },
]
