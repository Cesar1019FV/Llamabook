import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { IconScrollBottom } from '@/shared/ui/icons'

interface ScrollButtonProps {
  visible: boolean
  onClick: () => void
}

export function ScrollButton({ visible, onClick }: ScrollButtonProps) {
  const { t } = useTranslation()

  return (
    <div
      className={clsx(
        'absolute left-1/2 bottom-[120px] z-50 -translate-x-1/2 transition-opacity duration-150',
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="w-10 h-10 rounded-full bg-llama-surface border border-llama-border shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center justify-center text-llama-fg-3 hover:text-llama-fg hover:border-llama-border-2 transition-colors duration-100"
        aria-label={t('dashboard.chatView.scrollToBottom')}
      >
        <IconScrollBottom className="w-4 h-4 stroke-2" />
      </button>
    </div>
  )
}
