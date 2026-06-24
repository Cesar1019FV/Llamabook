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

export function IconEdit({ className }: IconProps) {
  return baseSvg(className, <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>, 16)
}

export function IconSearch({ className }: IconProps) {
  return baseSvg(className, <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>, 16)
}

export function IconDocument({ className }: IconProps) {
  return baseSvg(className, <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>, 16)
}

export function IconWorkspace({ className }: IconProps) {
  return baseSvg(className, <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>, 16)
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

export function IconFileUpload({ className }: IconProps) {
  return baseSvg(className, <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M12 12v9" /><path d="M9 15l3-3 3 3" /></>, 16)
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

export function IconClose({ className }: IconProps) {
  return baseSvg(className, <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>, 16)
}

export function IconSettings({ className }: IconProps) {
  return baseSvg(className, <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></>, 16)
}

export function IconLanguage({ className }: IconProps) {
  return baseSvg(className, <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>, 16)
}

export function IconLogout({ className }: IconProps) {
  return baseSvg(className, <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>, 16)
}

export function IconSun({ className }: IconProps) {
  return baseSvg(className, <><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></>, 16)
}

export function IconMoon({ className }: IconProps) {
  return baseSvg(className, <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />, 16)
}

export function IconFolder({ className }: IconProps) {
  return baseSvg(className, <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></>, 16)
}

export function IconUser({ className }: IconProps) {
  return baseSvg(className, <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>, 16)
}

export function IconLightbulb({ className }: IconProps) {
  return baseSvg(className, <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" /></>, 16)
}

export function IconInfo({ className }: IconProps) {
  return baseSvg(className, <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>, 16)
}

export function IconPDF({ className }: IconProps) {
  return baseSvg(className, <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M10.5 12.5h6" /><path d="M10.5 15.5h6" /></>, 16)
}

export function IconLibrary({ className }: IconProps) {
  return baseSvg(className, <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>, 16)
}

export function IconExport({ className }: IconProps) {
  return baseSvg(className, <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>, 16)
}

export function IconPen({ className }: IconProps) {
  return baseSvg(className, <><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></>, 16)
}

export function IconCopy({ className }: IconProps) {
  return baseSvg(className, <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>, 16)
}

export function IconPlay({ className }: IconProps) {
  return baseSvg(className, <polygon points="5 3 19 12 5 21 5 3" />, 16)
}

export function IconPause({ className }: IconProps) {
  return baseSvg(className, <><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></>, 16)
}

export function IconRefresh({ className }: IconProps) {
  return baseSvg(className, <><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></>, 16)
}

export function IconBookOpen({ className }: IconProps) {
  return baseSvg(className, <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>, 16)
}

export function IconMessage({ className }: IconProps) {
  return baseSvg(className, <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>, 16)
}

export function IconThinking({ className }: IconProps) {
  return baseSvg(className, <><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v3A2.5 2.5 0 0 1 9.5 10H4a2 2 0 0 1-2-2V4.5A2.5 2.5 0 0 1 4.5 2z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v3a2.5 2.5 0 0 0 2.5 2.5H20a2 2 0 0 0 2-2V4.5A2.5 2.5 0 0 0 19.5 2z" /><path d="M4 14a2 2 0 0 0-2 2v1.5A2.5 2.5 0 0 0 4.5 20H10a2.5 2.5 0 0 0 2.5-2.5v-3A2.5 2.5 0 0 0 10 12z" /><path d="M14 12a2.5 2.5 0 0 0-2.5 2.5v3A2.5 2.5 0 0 0 14 20h5.5A2.5 2.5 0 0 0 22 17.5V16a2 2 0 0 0-2-2z" /><circle cx="5.5" cy="5.5" r="0.5" fill="currentColor" /><circle cx="18.5" cy="5.5" r="0.5" fill="currentColor" /><circle cx="5.5" cy="16.5" r="0.5" fill="currentColor" /><circle cx="18.5" cy="16.5" r="0.5" fill="currentColor" /></>, 16)
}

export function IconWebSearch({ className }: IconProps) {
  return baseSvg(className, <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><path d="M11 3a8 8 0 0 1 0 16" /><line x1="3" y1="11" x2="19" y2="11" /><path d="M11 3a8 8 0 0 0-4 8 8 8 0 0 0 4 8 8 8 0 0 0 4-8 8 8 0 0 0-4-8z" /></>, 16)
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
  thinking: IconThinking,
  web_search: IconWebSearch,
}

export const iconsByActionId: Record<string, React.FC<IconProps>> = {
  upload: IconUpload,
  drive: IconDrive,
  link: IconLink,
}
