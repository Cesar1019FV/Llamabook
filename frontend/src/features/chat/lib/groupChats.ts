import type { Chat, ChatGroup } from '@/entities/llamabook-chat'

const MS_PER_DAY = 24 * 60 * 60 * 1000

function startOfDay(ts: number): number {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function groupChatsByDate(chats: Chat[]): ChatGroup[] {
  const todayStart = startOfDay(Date.now())
  const yesterdayStart = todayStart - MS_PER_DAY
  const sevenDaysStart = todayStart - 7 * MS_PER_DAY

  const pinned: Chat[] = []
  const today: Chat[] = []
  const yesterday: Chat[] = []
  const last7Days: Chat[] = []

  for (const chat of chats) {
    if (chat.pinned) {
      pinned.push(chat)
      continue
    }
    const ts = new Date(chat.updated_at).getTime()
    if (ts >= todayStart) today.push(chat)
    else if (ts >= yesterdayStart) yesterday.push(chat)
    else if (ts >= sevenDaysStart) last7Days.push(chat)
  }

  const groups: ChatGroup[] = []
  if (today.length) groups.push({ label: 'today', chats: today })
  if (yesterday.length) groups.push({ label: 'yesterday', chats: yesterday })
  if (last7Days.length) groups.push({ label: 'last7Days', chats: last7Days })
  return groups
}

export function formatRelativeTime(updatedAt: string): string {
  const now = Date.now()
  const ts = new Date(updatedAt).getTime()
  const diff = now - ts

  if (diff < 60_000) return 'now'
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks}w`
  const months = Math.floor(days / 30)
  return `${months}mo`
}