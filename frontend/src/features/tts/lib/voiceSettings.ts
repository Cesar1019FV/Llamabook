import type { VoiceSettings } from '../model/types'
import { TTS_VOICES } from '../model/types'

const STORAGE_KEY = 'llamabook:voice_settings:v1'

const DEFAULT_SETTINGS: VoiceSettings = {
  lang: 'es',
  voice: 'es-ES-AlvaroNeural',
}

function isVoiceValid(settings: VoiceSettings): boolean {
  return TTS_VOICES[settings.lang].some((v) => v.id === settings.voice)
}

export function getVoiceSettings(): VoiceSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw) as Partial<VoiceSettings>
    const settings: VoiceSettings = {
      lang: parsed.lang ?? DEFAULT_SETTINGS.lang,
      voice: parsed.voice ?? DEFAULT_SETTINGS.voice,
    }
    if (!isVoiceValid(settings)) {
      settings.voice = TTS_VOICES[settings.lang][0].id
      saveVoiceSettings(settings)
    }
    return settings
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveVoiceSettings(settings: VoiceSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // ignore
  }
}