import type { Notebook } from '@/entities/llamabook-notebook'
import type { Agent } from '@/entities/llamabook-agent'
import type { PDFSource, PDFChat, GeneratedDocument } from '@/entities/llamabook-document'

export const initialNotebooks: Notebook[] = [
  {
    id: 'infra',
    name: 'Infraestructura',
    color: 'rgba(99,102,241,0.35)',
    chats: [
      'Arquitectura de cache',
      'API Gateway patterns',
      'Particionamiento DB',
      'gRPC vs REST',
    ],
    context: '',
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    color: 'rgba(244,114,182,0.35)',
    chats: ['Transformer fine-tuning', 'Dataset augmentation', 'Helm charts prod'],
    context: '',
  },
  {
    id: 'devops',
    name: 'DevOps',
    color: 'rgba(34,197,94,0.35)',
    chats: ['CI/CD GitHub Actions', 'Prometheus + Grafana'],
    context: '',
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

export const initialPDFSources: PDFSource[] = [
  {
    id: 'pdf-infra',
    name: 'Arquitectura Cloud.pdf',
    size: '1.8 MB',
    pages: 24,
    color: 'rgba(99,102,241,0.35)',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: 'pdf-ml',
    name: 'ML Pipeline.pdf',
    size: '2.4 MB',
    pages: 31,
    color: 'rgba(244,114,182,0.35)',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
]

export const initialPDFChats: PDFChat[] = [
  {
    id: 'pch-infra-1',
    sourceId: 'pdf-infra',
    title: 'Resumen de patrones de escalabilidad',
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    messages: [],
  },
  {
    id: 'pch-ml-1',
    sourceId: 'pdf-ml',
    title: 'Explicacion del pipeline de entrenamiento',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    messages: [],
  },
]

export const initialGeneratedDocs: GeneratedDocument[] = [
  {
    id: 'doc-1',
    title: 'Propuesta de arquitectura escalable',
    content:
      '<h1>Propuesta de arquitectura escalable</h1><p>El documento presenta una arquitectura basada en microservicios con balanceo de carga y almacenamiento distribuido.</p><p>Se recomienda adoptar un API Gateway centralizado y un bus de eventos para desacoplar los servicios.</p>',
    sourceId: 'pdf-infra',
    chatId: 'pch-infra-1',
    type: 'report',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
]
