import { useTranslation } from 'react-i18next'
import { IconScrollBottom } from '@/shared/ui/icons'

interface ScrollButtonProps {
  visible: boolean
  onClick: () => void
}

export function ScrollButton({ visible, onClick }: ScrollButtonProps) {
  const { t } = useTranslation()

  return (
    <button
      className={['scroll-btn', visible ? 'visible' : ''].filter(Boolean).join(' ')}
      onClick={onClick}
      aria-label={t('dashboard.chatView.scrollToBottom')}
    >
      <IconScrollBottom />
    </button>
  )
}
