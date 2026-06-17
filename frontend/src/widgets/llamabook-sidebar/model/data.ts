import type { Notebook } from '@/entities/llamabook-notebook'
import type { Agent } from '@/entities/llamabook-agent'
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

export const initialAgents: Agent[] = [
  {
    id: 'infra-agent',
    name: 'Infra Advisor',
    description: 'Asesor de arquitectura, escalabilidad y operaciones.',
    avatar: '🛠️',
    color: 'rgba(99,102,241,0.35)',
    context:
      'Eres un experto en infraestructura y operaciones de software. Ayudas a diseñar arquitecturas escalables, resolver cuellos de botella y elegir tecnología cloud. Responde de forma clara, práctica y con ejemplos concretos.',
  },
  {
    id: 'code-agent',
    name: 'Code Reviewer',
    description: 'Revisa código, detecta problemas y sugiere mejoras.',
    avatar: '🔍',
    color: 'rgba(96,165,250,0.35)',
    context:
      'Eres un revisor de código senior. Analiza fragmentos de código en busca de bugs, problemas de rendimiento, seguridad y mantenibilidad. Sugiere mejoras con ejemplos de código cuando sea útil.',
  },
  {
    id: 'data-agent',
    name: 'Data Analyst',
    description: 'Analiza datos, genera reportes y explica métricas.',
    avatar: '📊',
    color: 'rgba(168,85,247,0.35)',
    context:
      'Eres un analista de datos. Interpretas métricas, detectas tendencias y presentas conclusiones de forma sencilla. Usa tablas o listas cuando ayuden a clarificar la información.',
  },
  {
    id: 'writer-agent',
    name: 'Tech Writer',
    description: 'Redacta documentación, correos y contenido técnico.',
    avatar: '✍️',
    color: 'rgba(251,146,60,0.35)',
    context:
      'Eres un redactor técnico. Ayudas a escribir documentación, correos, propuestas y contenido claro. Mantén un tono profesional, estructurado y fácil de entender.',
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
