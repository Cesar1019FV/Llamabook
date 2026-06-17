import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { IconClose, IconSettings, IconLanguage, IconSun, IconMoon } from '@/shared/ui/icons'

type SettingsSection = 'general'

export function SettingsModal() {
  const { t, i18n } = useTranslation()
  const { settingsModalOpen, closeSettingsModal } = useLlamabookDashboard()
  const [activeSection, setActiveSection] = useState<SettingsSection>('general')
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('dark')

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
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-llama-accent to-llama-accent-light flex items-center justify-center text-[18px] font-semibold text-white">
                  {t('dashboard.sidebar.profile.name')[0]}
                </div>
                <div>
                  <div className="text-[13.5px] text-llama-fg">{t('dashboard.sidebar.profile.name')}</div>
                  <div className="text-[12px] text-llama-fg-4">user@llamabook.local</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] text-llama-fg-2">{t('dashboard.settings.profile.fullName')}</label>
                  <input
                    type="text"
                    defaultValue={t('dashboard.sidebar.profile.name')}
                    className="w-[220px] px-3 py-2 rounded-lg bg-llama-surface border border-llama-border text-[13px] text-llama-fg outline-none focus:border-llama-border-2"
                  />
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
