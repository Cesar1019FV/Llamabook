export type ModelProvider = 'local' | 'external'

export interface Model {
  id: string
  name: string
  desc: string
  provider: ModelProvider
  gradient: string
  dotColor: string
}
