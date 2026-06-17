import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLlamabookDashboard } from '@/app/providers'
import { toolColors } from '@/widgets/llamabook-dock'
import './StatusBar.css'

type Status = 'on' | 'off' | 'rec'

export function StatusBar() {
  const { t } = useTranslation()
  const { currentModel, activeTools } = useLlamabookDashboard()
  const [status, setStatus] = useState<Status>('on')
  const sequence: Status[] = ['on', 'on', 'on', 'rec', 'on', 'off', 'rec', 'on']
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.9) {
        const nextIndex = (index + 1) % sequence.length
        setIndex(nextIndex)
        setStatus(sequence[nextIndex])
      }
    }, 5000)
    return () => clearInterval(id)
  }, [index])

  const statusText =
    status === 'on'
      ? t('dashboard.statusBar.online')
      : status === 'off'
        ? t('dashboard.statusBar.offline')
        : t('dashboard.statusBar.reconnecting')

  return (
    <div className="status-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span className={['st-dot', status].join(' ')} />
          <span>{statusText}</span>
        </div>
        <div className="active-tools-ind">
          {[...activeTools].map((tool) => (
            <span
              key={tool}
              className="at-dot"
              style={{ background: toolColors[tool] || '#666' }}
            />
          ))}
        </div>
      </div>
      <span>
        <span style={{ color: 'var(--fg-3)' }}>2,847</span>{' '}
        {t('dashboard.statusBar.tokenCount', { count: '', model: currentModel.name })}
      </span>
    </div>
  )
}
