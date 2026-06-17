import { ActiveTools } from './ActiveTools'
import { DockFiles } from './DockFiles'
import { DockInput } from './DockInput'
import './LlamabookDock.css'

export function LlamabookDock() {
  return (
    <div className="dock">
      <div className="dock-inner">
        <ActiveTools />
        <DockFiles />
        <DockInput />
      </div>
    </div>
  )
}
