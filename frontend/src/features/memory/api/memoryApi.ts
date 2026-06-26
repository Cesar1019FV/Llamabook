import { http } from '@/shared/api'
import type { User } from '@/entities/user'

export interface MemoryExtractResponse {
  tags: string[]
  user: User
}

export async function extractMemoryApi(
  messages: string[],
  model: string | null,
): Promise<MemoryExtractResponse> {
  return http.post<MemoryExtractResponse>('/memory/extract', { messages, model })
}