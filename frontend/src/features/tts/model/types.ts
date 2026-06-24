export interface TTSVoiceItem {
  id: string
  label: string
}

export interface TTSVoicesData {
  es: TTSVoiceItem[]
  en: TTSVoiceItem[]
}

export interface VoiceSettings {
  lang: 'es' | 'en'
  voice: string
}

export const TTS_VOICES: TTSVoicesData = {
  es: [
    { id: 'es-ES-AlvaroNeural', label: 'Álvaro (España)' },
    { id: 'es-AR-ElenaNeural', label: 'Elena (Argentina)' },
    { id: 'es-MX-GerardoNeural', label: 'Gerardo (México)' },
  ],
  en: [
    { id: 'en-US-GuyNeural', label: 'Guy (US)' },
    { id: 'en-US-JennyNeural', label: 'Jenny (US)' },
    { id: 'en-GB-RyanNeural', label: 'Ryan (UK)' },
  ],
}