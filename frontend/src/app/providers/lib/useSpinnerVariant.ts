import { useCallback, useEffect, useState } from 'react'

type SpinnerVariant = 'asterisk' | 'llama' | 'nova' | 'orbit'

const STORAGE_KEY = 'llamabook:spinner-variant'
const VALID_VARIANTS: SpinnerVariant[] = ['asterisk', 'llama', 'nova', 'orbit']

export function useSpinnerVariant() {
  const [spinnerVariant, setSpinnerVariantState] = useState<SpinnerVariant>('asterisk')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && VALID_VARIANTS.includes(saved as SpinnerVariant)) {
        setSpinnerVariantState(saved as SpinnerVariant)
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  const setSpinnerVariant = useCallback((variant: SpinnerVariant) => {
    setSpinnerVariantState(variant)
    try {
      localStorage.setItem(STORAGE_KEY, variant)
    } catch {
      // ignore storage errors
    }
  }, [])

  return {
    spinnerVariant,
    setSpinnerVariant,
  }
}
