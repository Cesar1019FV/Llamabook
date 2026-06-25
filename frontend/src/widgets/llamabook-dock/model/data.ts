export interface AttachItem {
  id: string
  iconKey: string
}

export interface ToolItem {
  id: string
  iconKey: string
  comingSoon?: boolean
}

export const attachItems: AttachItem[] = [
  { id: 'upload', iconKey: 'upload' },
  { id: 'link', iconKey: 'link' },
]

export const toolItems: ToolItem[] = [
  { id: 'audio', iconKey: 'audio', comingSoon: true },
  { id: 'slides', iconKey: 'slides', comingSoon: true },
  { id: 'video', iconKey: 'video', comingSoon: true },
  { id: 'mindmap', iconKey: 'mindmap', comingSoon: true },
  { id: 'report', iconKey: 'report', comingSoon: true },
  { id: 'flash', iconKey: 'flash', comingSoon: true },
  { id: 'quiz', iconKey: 'quiz', comingSoon: true },
  { id: 'infographic', iconKey: 'infographic', comingSoon: true },
  { id: 'table', iconKey: 'table', comingSoon: true },
]
