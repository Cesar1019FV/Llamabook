export interface AttachItem {
  id: string
  iconKey: string
}

export interface ToolItem {
  id: string
  iconKey: string
}

export const attachItems: AttachItem[] = [
  { id: 'upload', iconKey: 'upload' },
  { id: 'drive', iconKey: 'drive' },
  { id: 'link', iconKey: 'link' },
]

export const toolItems: ToolItem[] = [
  { id: 'audio', iconKey: 'audio' },
  { id: 'slides', iconKey: 'slides' },
  { id: 'video', iconKey: 'video' },
  { id: 'mindmap', iconKey: 'mindmap' },
  { id: 'report', iconKey: 'report' },
  { id: 'flash', iconKey: 'flash' },
  { id: 'quiz', iconKey: 'quiz' },
  { id: 'infographic', iconKey: 'infographic' },
  { id: 'table', iconKey: 'table' },
]
