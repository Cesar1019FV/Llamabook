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
    <button
      id="scroll-btn"
      className={clsx(
        'fixed bottom-[90px] right-4 md:right-7 w-7 h-7 rounded-full bg-llama-surface border border-llama-border flex items-center justify-center cursor-pointer opacity-0 pointer-events-none transition-opacity duration-150 z-10 hover:border-llama-border-2',
        visible && 'opacity-100 pointer-events-auto'
      )}
      onClick={onClick}
      aria-label={t('dashboard.chatView.scrollToBottom')}
    >
      <IconScrollBottom className="w-[13px] h-[13px] stroke-llama-fg-3 stroke-2" />
    </button>
  )
}
