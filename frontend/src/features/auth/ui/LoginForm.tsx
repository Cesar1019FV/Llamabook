import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useAuth } from '../model/useAuth'
import type { ApiError } from '@/shared/api'

export function LoginForm() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isFormValid = email.includes('@') && password.length >= 1

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isFormValid || isSubmitting) return

    setError(null)
    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      const apiErr = err as ApiError
      if (apiErr.code === 'unauthorized') {
        setError(t('auth.errors.invalidCredentials'))
      } else if (apiErr.code === 'unknown') {
        setError(t('auth.errors.network'))
      } else {
        setError(apiErr.detail ?? t('auth.errors.unknown'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {error ? (
        <div className="text-sm text-llama-error bg-llama-error/10 border border-llama-error/30 rounded-lg px-3 py-2">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-email" className="text-xs text-llama-fg-4 font-medium">
          {t('auth.login.email')}
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          className="w-full bg-llama-surface border border-llama-border rounded-lg px-3 py-2.5 text-sm text-llama-fg placeholder:text-llama-fg-5 focus:border-llama-border-2 focus:outline-none transition-colors"
          placeholder="user@example.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-password" className="text-xs text-llama-fg-4 font-medium">
          {t('auth.login.password')}
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
          className="w-full bg-llama-surface border border-llama-border rounded-lg px-3 py-2.5 text-sm text-llama-fg placeholder:text-llama-fg-5 focus:border-llama-border-2 focus:outline-none transition-colors"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={!isFormValid || isSubmitting}
        className={clsx(
          'w-full py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
          isFormValid && !isSubmitting
            ? 'bg-llama-accent text-white hover:bg-llama-accent-light'
            : 'bg-llama-surface text-llama-fg-5 cursor-not-allowed',
        )}
      >
        {isSubmitting ? t('auth.login.loading') : t('auth.login.submit')}
      </button>

      <p className="text-center text-xs text-llama-fg-4">
        {t('auth.login.noAccount')}{' '}
        <a href="/signup" className="text-llama-accent hover:text-llama-accent-light">
          {t('auth.login.signupLink')}
        </a>
      </p>
    </form>
  )
}