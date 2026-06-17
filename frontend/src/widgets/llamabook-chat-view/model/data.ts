import type { Message } from '@/entities/llamabook-message'

export const sampleMessages: Message[] = [
  { id: 's1', type: 'system', text: 'Conversación iniciada · Llamabook Pro' },
  {
    id: 'u1',
    type: 'user',
    text: '¿Puedes explicarme cómo implementar un sistema de caché distribuido con Redis?',
    time: '14:32',
    status: 'sent',
  },
  {
    id: 'a1',
    type: 'ai',
    text: 'Claro. Un sistema de caché distribuido con Redis requiere varios componentes:\n\n<strong>1. Patrón Cache-Aside</strong> — la aplicación consulta la caché primero; si no encuentra el dato, lo obtiene de la base de datos y lo almacena en Redis.\n\n<strong>2. Topología</strong> — usa Redis Cluster con sharding para distribuir la carga.\n\n<strong>3. Replicación</strong> — configura al menos una réplica por shard.\n\n<strong>4. TTL por tipo de dato</strong> — asigna tiempos de expiración diferenciados.',
    time: '14:32',
    status: 'sent',
  },
  {
    id: 'u2',
    type: 'user',
    text: '¿Y cómo manejo la invalidación en múltiples nodos?',
    time: '14:34',
    status: 'sent',
  },
  {
    id: 'a2',
    type: 'ai',
    text: 'La invalidación en múltiples nodos se maneja con pub/sub y versionado de keys:',
    time: '14:34',
    status: 'sent',
    code: {
      lang: 'yaml',
      body: '# redis-pub-sub-cache-invalidation.yml\ninvalidation:\n  channel: "cache:invalidate"\n  strategy:\n    - pattern: "cache:invalidate:{key}"\n      action: DELETE\n  publisher:\n    on_write: publish_invalidation_event\n  subscriber:\n    on_event:\n      - delete_local_cache_entry\n      - update_version_counter',
    },
  },
  {
    id: 'u3',
    type: 'user',
    text: 'Perfecto, ¿puedes generar el docker-compose?',
    time: '14:36',
    status: 'sent',
  },
  {
    id: 'a3',
    type: 'ai',
    text: 'Aquí tienes una configuración de Docker Compose:',
    time: '14:36',
    status: 'sent',
    code: {
      lang: 'yaml',
      body: 'version: "3.8"\nservices:\n  redis-shard-1:\n    image: redis:7-alpine\n    ports: ["6379:6379"]\n    command: redis-server --cluster-enabled yes\n\n  redis-replica-1:\n    image: redis:7-alpine\n    ports: ["6380:6379"]\n    command: >\n      redis-server --cluster-enabled yes\n      --replicaof redis-shard-1 6379\n    depends_on: [redis-shard-1]\n\n  app:\n    build: .\n    ports: ["3000:3000"]\n    environment:\n      REDIS_URL: "redis://redis-shard-1:6379"\n    depends_on: [redis-shard-1]',
    },
  },
]
