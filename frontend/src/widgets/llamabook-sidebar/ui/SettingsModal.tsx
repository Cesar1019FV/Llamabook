import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { useAuth } from '@/features/auth'
import { LlamabookSpinner } from '@/shared/ui/icons/LlamabookSpinner'
import { IconClose, IconSettings, IconLanguage, IconSun, IconMoon } from '@/shared/ui/icons'

type SettingsSection = 'general'

export function SettingsModal() {
  const { t, i18n } = useTranslation()
  const { settingsModalOpen, closeSettingsModal, spinnerVariant, setSpinnerVariant } = useLlamabookDashboard()
  const { user, updateProfile } = useAuth()
  const [activeSection, setActiveSection] = useState<SettingsSection>('general')
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('dark')
  const [nameInput, setNameInput] = useState('')
  const [isSavingName, setIsSavingName] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)

  useEffect(() => {
    setNameInput(user?.name ?? '')
    setNameSaved(false)
  }, [user?.name])

  const displayName = user?.name ?? user?.email ?? ''
  const displayEmail = user?.email ?? ''
  const initial = displayName[0]?.toUpperCase() ?? displayEmail[0]?.toUpperCase() ?? 'U'

  async function handleSaveName() {
    const trimmed = nameInput.trim()
    if (!trimmed || trimmed === user?.name) return
    setIsSavingName(true)
    setNameSaved(false)
    try {
      await updateProfile({ name: trimmed })
      setNameSaved(true)
    } finally {
      setIsSavingName(false)
    }
  }

  if (!settingsModalOpen) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeSettingsModal()
      }}
    >
      <div className="w-full max-w-[720px] max-h-[85dvh] bg-llama-surface-2 border border-llama-border-2 rounded-2xl shadow-[0_16px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-[220px] border-b md:border-b-0 md:border-r border-llama-border p-3 shrink-0">
          <div className="flex items-center justify-between md:block mb-2 md:mb-0">
            <span className="hidden md:block text-[10.5px] font-medium text-llama-fg-5 px-2.5 pt-2 pb-2 tracking-wide uppercase">
              {t('dashboard.settings.title')}
            </span>
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-md text-llama-fg-3 hover:bg-llama-surface"
              onClick={closeSettingsModal}
              aria-label={t('dashboard.settings.close')}
            >
              <IconClose className="w-4 h-4 stroke-2" />
            </button>
          </div>

          <button
            className={clsx(
              'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-left transition-colors duration-100',
              activeSection === 'general'
                ? 'bg-llama-surface text-llama-fg'
                : 'text-llama-fg-3 hover:text-llama-fg hover:bg-white/[0.08]'
            )}
            onClick={() => setActiveSection('general')}
          >
            <IconSettings className="w-4 h-4 stroke-[1.8]" />
            {t('dashboard.settings.sections.general')}
          </button>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-5 py-3 border-b border-llama-border shrink-0">
            <span className="text-[15px] font-medium text-llama-fg">{t('dashboard.settings.sections.general')}</span>
            <button
              className="hidden md:flex w-8 h-8 items-center justify-center rounded-md text-llama-fg-3 hover:bg-llama-surface"
              onClick={closeSettingsModal}
              aria-label={t('dashboard.settings.close')}
            >
              <IconClose className="w-4 h-4 stroke-2" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <section>
              <h3 className="text-[14px] font-medium text-llama-fg mb-3">{t('dashboard.settings.profile.title')}</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-llama-surface border border-llama-border-2 flex items-center justify-center text-[18px] font-semibold text-llama-accent">
                  {initial}
                </div>
                <div>
                  <div className="text-[13.5px] text-llama-fg">{displayName || displayEmail}</div>
                  <div className="text-[12px] text-llama-fg-4">{displayEmail}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] text-llama-fg-2">{t('dashboard.settings.profile.fullName')}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => {
                        setNameInput(e.target.value)
                        setNameSaved(false)
                      }}
                      disabled={isSavingName}
                      className="w-[220px] px-3 py-2 rounded-lg bg-llama-surface border border-llama-border text-[13px] text-llama-fg outline-none focus:border-llama-border-2 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      disabled={isSavingName || !nameInput.trim() || nameInput.trim() === user?.name}
                      onClick={handleSaveName}
                      className={clsx(
                        'px-3 py-2 rounded-lg text-[12px] font-medium transition-colors duration-100',
                        nameInput.trim() && nameInput.trim() !== user?.name && !isSavingName
                          ? 'bg-llama-accent text-white hover:bg-llama-accent-light'
                          : 'bg-llama-surface text-llama-fg-5 cursor-not-allowed'
                      )}
                    >
                      {isSavingName ? t('dashboard.settings.profile.saving') : nameSaved ? t('dashboard.settings.profile.saved') : t('dashboard.settings.profile.save')}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-[13px] text-llama-fg-2">{t('dashboard.settings.profile.role')}</label>
                  <span className="px-3 py-1.5 rounded-lg bg-llama-surface border border-llama-border text-[13px] text-llama-fg-4 capitalize">
                    {user?.role ?? 'user'}
                  </span>
                </div>
              </div>
            </section>

            <section className="pt-4 border-t border-llama-border">
              <h3 className="text-[14px] font-medium text-llama-fg mb-3">{t('dashboard.settings.preferences.title')}</h3>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <IconLanguage className="w-4 h-4 text-llama-fg-4" />
                  <span className="text-[13px] text-llama-fg-2">{t('dashboard.settings.preferences.language')}</span>
                </div>
                <select
                  value={i18n.language}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-llama-surface border border-llama-border text-[13px] text-llama-fg outline-none cursor-pointer"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <LlamabookSpinner size={16} className="text-llama-fg-4" />
                  <span className="text-[13px] text-llama-fg-2">{t('dashboard.settings.spinner.title')}</span>
                </div>
                <div className="flex items-center gap-2 p-1 rounded-lg bg-llama-surface border border-llama-border">
                  {(['asterisk', 'llama', 'nova', 'orbit'] as const).map((variant) => (
                    <button
                      key={variant}
                      type="button"
                      onClick={() => setSpinnerVariant(variant)}
                      className={clsx(
                        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors duration-100',
                        spinnerVariant === variant
                          ? 'bg-llama-accent/20 text-llama-accent'
                          : 'text-llama-fg-4 hover:text-llama-fg-2'
                      )}
                    >
                      <LlamabookSpinner
                        variant={variant}
                        size={14}
                        spinning={spinnerVariant === variant}
                        className={spinnerVariant === variant ? 'text-llama-accent' : 'text-llama-fg-4'}
                      />
                      {t(`dashboard.settings.spinner.${variant}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {theme === 'light' ? (
                    <IconSun className="w-4 h-4 text-llama-fg-4" />
                  ) : (
                    <IconMoon className="w-4 h-4 text-llama-fg-4" />
                  )}
                  <span className="text-[13px] text-llama-fg-2">{t('dashboard.settings.preferences.appearance')}</span>
                </div>
                <div className="flex items-center gap-1 p-1 rounded-lg bg-llama-surface border border-llama-border">
                  {(['system', 'light', 'dark'] as const).map((tKey) => (
                    <button
                      key={tKey}
                      className={clsx(
                        'px-2.5 py-1 rounded-md text-[12px] font-medium transition-colors duration-100',
                        theme === tKey ? 'bg-llama-fg-4 text-llama-fg' : 'text-llama-fg-4 hover:text-llama-fg-2'
                      )}
                      onClick={() => setTheme(tKey)}
                    >
                      {t(`dashboard.settings.preferences.themes.${tKey}`)}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
