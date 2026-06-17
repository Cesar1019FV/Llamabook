import type { ReactNode } from 'react'

interface IconProps {
  className?: string
}

function baseSvg(className: string | undefined, children: ReactNode = null, size = 24) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  )
}

export function IconCloseSidebar({ className }: IconProps) {
  return baseSvg(className, <><path d="M11 19l-7-7 7-7" /><path d="M18 5l-7 7 7 7" /></>)
}

export function IconPlus({ className }: IconProps) {
  return baseSvg(className, <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>)
}

export function IconChevron({ className }: IconProps) {
  return baseSvg(className, <path d="M6 9l6 6 6-6" />)
}

export function IconMore({ className }: IconProps) {
  return baseSvg(className, <><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></>, 16)
}

export function IconMenu({ className }: IconProps) {
  return baseSvg(className, <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)
}

export function IconSidebar({ className }: IconProps) {
  return baseSvg(className, <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="3" x2="9" y2="21" /></>)
}

export function IconHome({ className }: IconProps) {
  return baseSvg(className, <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />)
}

export function IconCode({ className }: IconProps) {
  return baseSvg(className, <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>, 13)
}

export function IconChart({ className }: IconProps) {
  return baseSvg(className, <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>, 13)
}

export function IconBook({ className }: IconProps) {
  return baseSvg(className, <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>, 13)
}

export function IconFile({ className }: IconProps) {
  return baseSvg(className, <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>, 13)
}

export function IconCheck({ className }: IconProps) {
  return baseSvg(className, <polyline points="20 6 9 17 4 12" />)
}

export function IconMic({ className }: IconProps) {
  return baseSvg(className, <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></>)
}

export function IconSend({ className }: IconProps) {
  return baseSvg(className, <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>)
}

export function IconScrollBottom({ className }: IconProps) {
  return baseSvg(className, <><path d="M12 5v14" /><path d="M19 12l-7 7-7-7" /></>, 13)
}

export function IconUpload({ className }: IconProps) {
  return baseSvg(className, <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />)
}

export function IconDrive({ className }: IconProps) {
  return baseSvg(className, <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />)
}

export function IconLink({ className }: IconProps) {
  return baseSvg(className, <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>)
}

export function IconAudio({ className }: IconProps) {
  return baseSvg(className, <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /></>)
}

export function IconSlides({ className }: IconProps) {
  return baseSvg(className, <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>)
}

export function IconVideo({ className }: IconProps) {
  return baseSvg(className, <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></>)
}

export function IconMindmap({ className }: IconProps) {
  return baseSvg(className, <><circle cx="12" cy="12" r="3" /><line x1="12" y1="9" x2="12" y2="3" /><line x1="12" y1="15" x2="12" y2="21" /><line x1="9" y1="12" x2="3" y2="12" /><line x1="15" y1="12" x2="21" y2="12" /></>)
}

export function IconReport({ className }: IconProps) {
  return baseSvg(className, <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>)
}

export function IconFlash({ className }: IconProps) {
  return baseSvg(className, <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />)
}

export function IconQuiz({ className }: IconProps) {
  return baseSvg(className, <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>)
}

export function IconInfographic({ className }: IconProps) {
  return baseSvg(className, <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>)
}

export function IconTable({ className }: IconProps) {
  return baseSvg(className, <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></>)
}

export const iconsByToolId: Record<string, React.FC<IconProps>> = {
  audio: IconAudio,
  slides: IconSlides,
  video: IconVideo,
  mindmap: IconMindmap,
  report: IconReport,
  flash: IconFlash,
  quiz: IconQuiz,
  infographic: IconInfographic,
  table: IconTable,
}

export const iconsByActionId: Record<string, React.FC<IconProps>> = {
  upload: IconUpload,
  drive: IconDrive,
  link: IconLink,
}
