import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { useLlamabookDashboard } from '@/app/providers'
import { useAuth } from '@/features/auth'
import { getVoiceSettings, saveVoiceSettings, TTS_VOICES } from '@/features/tts'
import type { VoiceSettings, TTSVoiceItem } from '@/features/tts'
import { LlamabookSpinner } from '@/shared/ui/icons/LlamabookSpinner'
import { IconClose, IconSettings, IconLanguage, IconSun, IconMoon, IconAudio, IconWebSearch, IconThinking } from '@/shared/ui/icons'

type SettingsSection = 'general' | 'voice' | 'triggers' | 'memory'

function KeywordList({
  title,
  hint,
  keywords,
  onAdd,
  onRemove,
}: {
  title: string
  hint: string
  keywords: string[]
  onAdd: (kw: string) => void
  onRemove: (kw: string) => void
}) {
  const { t } = useTranslation()
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setInput('')
  }

  return (
    <div>
      <div className="text-[13px] font-medium text-llama-fg-2 mb-1">{title}</div>
      <div className="text-[11.5px] text-llama-fg-4 mb-2">{hint}</div>
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {keywords.length === 0 && (
          <span className="text-[12px] text-llama-fg-5 italic">{t('dashboard.settings.triggers.empty')}</span>
        )}
        {keywords.map((kw) => (
          <span
            key={kw}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-llama-surface border border-llama-border text-[12px] text-llama-fg-3"
          >
            {kw}
            <button
              type="button"
              onClick={() => onRemove(kw)}
              className="text-llama-fg-5 hover:text-llama-error transition-colors duration-100"
              aria-label={t('dashboard.settings.triggers.remove')}
            >
              <IconClose className="w-3 h-3 stroke-2" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAdd()
            }
          }}
          placeholder={t('dashboard.settings.triggers.addPlaceholder')}
          className="flex-1 px-3 py-2 rounded-lg bg-llama-surface border border-llama-border text-[13px] text-llama-fg outline-none focus:border-llama-border-2"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!input.trim()}
          className="px-3 py-2 rounded-lg text-[12px] font-medium bg-llama-accent text-white hover:bg-llama-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-100"
        >
          {t('dashboard.settings.triggers.add')}
        </button>
      </div>
    </div>
  )
}

function TriggersSection() {
  const { t } = useTranslation()
  const {
    triggerSettings,
    toggleTriggersEnabled,
    addTriggerKeyword,
    removeTriggerKeyword,
  } = useLlamabookDashboard()

  return (
    <section>
      <h3 className="text-[14px] font-medium text-llama-fg mb-1">{t('dashboard.settings.triggers.title')}</h3>
      <p className="text-[12px] text-llama-fg-4 mb-4">{t('dashboard.settings.triggers.description')}</p>

      <div className="flex items-center justify-between mb-5 p-3 rounded-lg bg-llama-surface border border-llama-border">
        <span className="text-[13px] text-llama-fg-2">{t('dashboard.settings.triggers.enabled')}</span>
        <button
          type="button"
          onClick={toggleTriggersEnabled}
          className={clsx(
            'relative w-[40px] h-[22px] rounded-full transition-colors duration-200',
            triggerSettings.enabled ? 'bg-llama-accent' : 'bg-llama-border'
          )}
        >
          <span
            className={clsx(
              'absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-all duration-200',
              triggerSettings.enabled ? 'left-[20px]' : 'left-[2px]'
            )}
          />
        </button>
      </div>

      <div className="space-y-5">
        <KeywordList
          title={t('dashboard.settings.triggers.webSearch.title')}
          hint={t('dashboard.settings.triggers.webSearch.hint')}
          keywords={triggerSettings.webSearch}
          onAdd={(kw) => addTriggerKeyword('webSearch', kw)}
          onRemove={(kw) => removeTriggerKeyword('webSearch', kw)}
        />
        <KeywordList
          title={t('dashboard.settings.triggers.thinking.title')}
          hint={t('dashboard.settings.triggers.thinking.hint')}
          keywords={triggerSettings.thinking}
          onAdd={(kw) => addTriggerKeyword('thinking', kw)}
          onRemove={(kw) => removeTriggerKeyword('thinking', kw)}
        />
      </div>
    </section>
  )
}

function MemorySection() {
  const { t } = useTranslation()
  const { user, deleteMemoryTag } = useAuth()
  const { memoryCount } = useLlamabookDashboard()
  const [removing, setRemoving] = useState<string | null>(null)

  const memory = user?.preferences?.memory
  const tags = memory?.tags ?? []
  const messagesLeft = Math.max(0, 5 - memoryCount)

  const handleRemove = async (tag: string) => {
    setRemoving(tag)
    try {
      await deleteMemoryTag(tag)
    } finally {
      setRemoving(null)
    }
  }

  return (
    <section>
      <h3 className="text-[14px] font-medium text-llama-fg mb-1">{t('dashboard.settings.memory.title')}</h3>
      <p className="text-[12px] text-llama-fg-4 mb-4">{t('dashboard.settings.memory.description')}</p>

      <div className="flex items-center justify-between mb-5 p-3 rounded-lg bg-llama-surface border border-llama-border">
        <span className="text-[13px] text-llama-fg-2">{t('dashboard.settings.memory.tags')}</span>
        <span className="text-[12px] text-llama-fg-4">
          {t('dashboard.settings.memory.nextExtraction', { count: messagesLeft })}
        </span>
      </div>

      {tags.length === 0 ? (
        <div className="text-center py-8">
          <IconThinking className="w-8 h-8 mx-auto text-llama-fg-5 mb-3" />
          <p className="text-[13px] text-llama-fg-4 italic">{t('dashboard.settings.memory.empty')}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="flex items-start justify-between gap-3 p-3 rounded-lg bg-llama-surface border border-llama-border hover:border-llama-border-2 transition-colors duration-100"
            >
              <span className="text-[13px] text-llama-fg-2 leading-relaxed flex-1">{tag}</span>
              <button
                type="button"
                onClick={() => handleRemove(tag)}
                disabled={removing === tag}
                className="shrink-0 text-llama-fg-5 hover:text-llama-error transition-colors duration-100 disabled:opacity-50"
                aria-label={t('dashboard.settings.memory.remove')}
              >
                <IconClose className="w-3.5 h-3.5 stroke-2" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function SettingsModal() {
  const { t, i18n } = useTranslation()
  const { settingsModalOpen, closeSettingsModal, spinnerVariant, setSpinnerVariant } = useLlamabookDashboard()
  const { user, updateProfile } = useAuth()
  const [activeSection, setActiveSection] = useState<SettingsSection>('general')
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('dark')
  const [nameInput, setNameInput] = useState('')
  const [isSavingName, setIsSavingName] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => getVoiceSettings())

  useEffect(() => {
    setNameInput(user?.name ?? '')
    setNameSaved(false)
  }, [user?.name])

  function updateVoiceSettings(partial: Partial<VoiceSettings>) {
    const next = { ...voiceSettings, ...partial }
    if (partial.lang && !TTS_VOICES[partial.lang].some((v) => v.id === next.voice)) {
      next.voice = TTS_VOICES[partial.lang][0].id
    }
    setVoiceSettings(next)
    saveVoiceSettings(next)
  }

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

          <button
            className={clsx(
              'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-left transition-colors duration-100',
              activeSection === 'voice'
                ? 'bg-llama-surface text-llama-fg'
                : 'text-llama-fg-3 hover:text-llama-fg hover:bg-white/[0.08]'
            )}
            onClick={() => setActiveSection('voice')}
          >
            <IconAudio className="w-4 h-4 stroke-[1.8]" />
            {t('dashboard.settings.sections.voice')}
          </button>

          <button
            className={clsx(
              'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-left transition-colors duration-100',
              activeSection === 'triggers'
                ? 'bg-llama-surface text-llama-fg'
                : 'text-llama-fg-3 hover:text-llama-fg hover:bg-white/[0.08]'
            )}
            onClick={() => setActiveSection('triggers')}
          >
            <IconWebSearch className="w-4 h-4 stroke-[1.8]" />
            {t('dashboard.settings.sections.triggers')}
          </button>

          <button
            className={clsx(
              'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-left transition-colors duration-100',
              activeSection === 'memory'
                ? 'bg-llama-surface text-llama-fg'
                : 'text-llama-fg-3 hover:text-llama-fg hover:bg-white/[0.08]'
            )}
            onClick={() => setActiveSection('memory')}
          >
            <IconThinking className="w-4 h-4 stroke-[1.8]" />
            {t('dashboard.settings.sections.memory')}
          </button>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-5 py-3 border-b border-llama-border shrink-0">
            <span className="text-[15px] font-medium text-llama-fg">
              {activeSection === 'memory'
                ? t('dashboard.settings.sections.memory')
                : activeSection === 'voice'
                ? t('dashboard.settings.sections.voice')
                : activeSection === 'triggers'
                ? t('dashboard.settings.sections.triggers')
                : t('dashboard.settings.sections.general')}
            </span>
            <button
              className="hidden md:flex w-8 h-8 items-center justify-center rounded-md text-llama-fg-3 hover:bg-llama-surface"
              onClick={closeSettingsModal}
              aria-label={t('dashboard.settings.close')}
            >
              <IconClose className="w-4 h-4 stroke-2" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {activeSection === 'memory' ? (
              <MemorySection />
            ) : activeSection === 'voice' ? (
              <section>
                <h3 className="text-[14px] font-medium text-llama-fg mb-3">{t('dashboard.settings.voice.title')}</h3>

                <div className="flex items-center justify-between mb-3">
                  <label className="text-[13px] text-llama-fg-2">{t('dashboard.settings.voice.language')}</label>
                  <select
                    value={voiceSettings.lang}
                    onChange={(e) => updateVoiceSettings({ lang: e.target.value as 'es' | 'en' })}
                    className="px-3 py-2 rounded-lg bg-llama-surface border border-llama-border text-[13px] text-llama-fg outline-none cursor-pointer"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-[13px] text-llama-fg-2">{t('dashboard.settings.voice.voice')}</label>
                  <select
                    value={voiceSettings.voice}
                    onChange={(e) => updateVoiceSettings({ voice: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-llama-surface border border-llama-border text-[13px] text-llama-fg outline-none cursor-pointer"
                  >
                    {TTS_VOICES[voiceSettings.lang].map((v: TTSVoiceItem) => (
                      <option key={v.id} value={v.id}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </section>
            ) : activeSection === 'triggers' ? (
              <TriggersSection />
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
