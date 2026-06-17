import { useLlamabookDashboard } from '@/app/providers'
import { toolColors, toolNames } from '../model/consts'

export function ActiveTools() {
  const { activeTools, toggleTool, i18n } = useLlamabookDashboard()

  if (activeTools.size === 0) return null

  return (
    <div className="dock-active-tools">
      {[...activeTools].map((tool) => {
        const label = toolNames[i18n.language]?.[tool] || toolNames.es[tool]
        return (
          <button
            key={tool}
            className="at-chip"
            onClick={() => toggleTool(tool)}
          >
            <span className="at-chip-dot" style={{ background: toolColors[tool] }} />
            {label}
            <span className="at-chip-x">×</span>
          </button>
        )
      })}
    </div>
  )
}
