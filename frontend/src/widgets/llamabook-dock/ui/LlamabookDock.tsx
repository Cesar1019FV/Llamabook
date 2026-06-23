import { ActiveTools } from './ActiveTools'
import { DockFiles } from './DockFiles'
import { DockInput } from './DockInput'

export function LlamabookDock() {
  return (
    <div
      id="dock"
      className="px-4 md:px-7 pt-8 md:pt-10 pb-2.5 md:pb-3.5 bg-gradient-to-t from-llama-bg via-llama-bg to-transparent shrink-0"
    >
      <div className="dock-inner max-w-[680px] mx-auto relative">
        <ActiveTools />
        <DockFiles />
        <DockInput />
      </div>
    </div>
  )
}
