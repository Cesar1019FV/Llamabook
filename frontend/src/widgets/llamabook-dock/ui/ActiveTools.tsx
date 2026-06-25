import { useLlamabookDashboard } from '@/app/providers'
import { toolColors, toolNames } from '../model/consts'
import { toolItems } from '../model/data'

export function ActiveTools() {
  const { activeTools, toggleTool, i18n } = useLlamabookDashboard()

  const validTools = new Set(toolItems.filter((t) => !t.comingSoon).map((t) => t.id))
  const active = [...activeTools].filter((tool) => validTools.has(tool))

  if (active.length === 0) return null

  return (
    <div className="dock-active-tools flex flex-wrap gap-[5px] pb-1.5">
      {active.map((tool) => {
        const label = toolNames[i18n.language]?.[tool] || toolNames.es[tool]
        return (
          <button
            key={tool}
            className="at-chip flex items-center gap-[5px] py-1 px-2.5 rounded-full border border-llama-border text-llama-fg-3 text-[11.5px] font-normal whitespace-nowrap select-none cursor-pointer transition-all duration-150 hover:border-llama-border-2 hover:text-llama-fg-2"
            onClick={() => toggleTool(tool)}
          >
            <span
              className="at-chip-dot w-[5px] h-[5px] rounded-full shrink-0"
              style={{ background: toolColors[tool] }}
            />
            {label}
            <span className="at-chip-x text-[10px] text-llama-fg-5 ml-px leading-none hover:text-llama-fg">×</span>
          </button>
        )
      })}
    </div>
  )
}
