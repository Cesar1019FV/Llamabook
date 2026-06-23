interface LlamabookSpinnerProps {
  className?: string
  size?: number
  spinning?: boolean
  variant?: 'asterisk' | 'llama' | 'nova' | 'orbit'
}

export function LlamabookSpinner({
  className,
  size = 24,
  spinning = false,
  variant = 'asterisk',
}: LlamabookSpinnerProps) {
  const baseClasses = spinning ? 'animate-spin' : ''
  const rootClass = `${baseClasses} origin-center ${className ?? ''}`.trim() || undefined

  if (variant === 'llama') {
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
        className={rootClass}
      >
        <path d="M12 2c-1.5 0-2.5 1-3 2.5C8 6 8.5 8 10 9c-1 .5-2 1.5-2.5 3-.5 1.5-.5 3.5 0 5 .5 1.5 1.5 3 3 3.5" />
        <path d="M12 2c1.5 0 2.5 1 3 2.5C16 6 15.5 8 14 9c1 .5 2 1.5 2.5 3 .5 1.5.5 3.5 0 5-.5 1.5-1.5 3-3 3.5" />
        <circle cx="10.5" cy="6.5" r="0.8" fill="currentColor" />
        <path d="M8.5 17.5c-1.5 1-3.5.5-4.5-1" />
        <path d="M15.5 17.5c1.5 1 3.5.5 4.5-1" />
      </svg>
    )
  }

  if (variant === 'nova') {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={rootClass}
      >
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
        <path d="M4.93 4.93l2.83 2.83" />
        <path d="M16.24 16.24l2.83 2.83" />
        <path d="M4.93 19.07l2.83-2.83" />
        <path d="M16.24 7.76l2.83-2.83" />
      </svg>
    )
  }

  if (variant === 'orbit') {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={rootClass}
      >
        <circle cx="12" cy="12" r="2" />
        <path d="M12 6a6 6 0 0 1 6 6" />
        <path d="M12 18a6 6 0 0 1-6-6" />
        <path d="M5 12a7 7 0 0 1 7-7" />
        <path d="M19 12a7 7 0 0 1-7 7" />
        <circle cx="12" cy="3" r="1" fill="currentColor" />
        <circle cx="21" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="21" r="1" fill="currentColor" />
        <circle cx="3" cy="12" r="1" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={rootClass}
    >
      <path d="M12 2c.5 2.5 1.5 4 3.5 5" />
      <path d="M12 2c-.5 2.5-1.5 4-3.5 5" />
      <path d="M12 22c.5-2.5 1.5-4 3.5-5" />
      <path d="M12 22c-.5-2.5-1.5-4-3.5-5" />
      <path d="M2 12c2.5.5 4 1.5 5 3.5" />
      <path d="M2 12c2.5-.5 4-1.5 5-3.5" />
      <path d="M22 12c-2.5.5-4 1.5-5 3.5" />
      <path d="M22 12c-2.5-.5-4-1.5-5-3.5" />
    </svg>
  )
}
