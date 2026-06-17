import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { toolColors } from '@/widgets/llamabook-dock'

type Status = 'on' | 'off' | 'rec'

interface StatusBarProps {
  status?: Status
}

export function StatusBar({ status: propStatus }: StatusBarProps = {}) {
  const { t } = useTranslation()
  const { currentModel, activeTools } = useLlamabookDashboard()
  const status = propStatus || 'on'

  const statusText =
    status === 'on'
      ? t('dashboard.statusBar.online')
      : status === 'off'
        ? t('dashboard.statusBar.offline')
        : t('dashboard.statusBar.reconnecting')

  return (
    <div
      id="status"
      className="flex items-center justify-between px-4 md:px-7 py-0.5 pb-2 text-[11px] text-llama-fg-5 font-mono shrink-0 gap-3 min-h-5"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <span
            className={clsx(
              'st-dot w-[5px] h-[5px] rounded-full shrink-0',
              status === 'on' && 'bg-llama-online',
              status === 'off' && 'bg-llama-offline',
              status === 'rec' && 'bg-llama-recording blink-dot'
            )}
          />
          <span>{statusText}</span>
        </div>
        <div className="active-tools-ind flex items-center gap-1">
          {[...activeTools].map((tool) => (
            <span
              key={tool}
              className="at-dot w-1 h-1 rounded-full"
              style={{ background: toolColors[tool] || '#666' }}
            />
          ))}
        </div>
      </div>
      <span className="overflow-hidden text-ellipsis whitespace-nowrap min-w-0 text-right">
        <span className="text-llama-fg-3">2,847</span>{' '}
        {t('dashboard.statusBar.tokenCount', { count: '', model: currentModel.name })}
      </span>
    </div>
  )
}
