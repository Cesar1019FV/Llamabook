import { useState, useCallback } from 'react'
import type { Agent } from '@/entities/llamabook-agent'
import { initialAgents } from '@/shared/data'

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents)

  const addAgent = useCallback((agent: Omit<Agent, 'id'>) => {
    const id = 'agt_' + Date.now()
    setAgents((prev) => [
      ...prev,
      {
        id,
        name: agent.name.trim(),
        description: agent.description.trim(),
        avatar: agent.avatar,
        color: agent.color,
        context: agent.context.trim(),
      },
    ])
  }, [])

  return {
    agents,
    setAgents,
    addAgent,
  }
}
