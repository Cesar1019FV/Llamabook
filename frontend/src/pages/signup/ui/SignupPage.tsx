import { useTranslation } from 'react-i18next'
import { SignupForm } from '@/features/auth'

export function SignupPage() {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-center min-h-screen bg-llama-bg px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-llama-accent to-llama-accent-light flex items-center justify-center text-white font-serif text-lg font-bold">
            L
          </div>
          <h1 className="font-serif text-2xl text-llama-fg font-medium">{t('auth.signup.title')}</h1>
          <p className="text-sm text-llama-fg-4">{t('auth.signup.subtitle')}</p>
        </div>

        <div className="bg-llama-surface border border-llama-border rounded-2xl p-6">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}