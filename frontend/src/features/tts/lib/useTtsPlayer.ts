import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchTtsAudio } from '../api/ttsApi'
import { getCachedAudio, setCachedAudio, cleanupExpiredAudio } from '../lib/ttsCache'
import { hashText } from '../lib/hashText'

interface UseTtsPlayerResult {
  playingKey: string | null
  loadingKey: string | null
  play: (chatId: string, messageId: string, text: string, voice: string, lang: string) => void
  stop: () => void
}

export function useTtsPlayer(): UseTtsPlayerResult {
  const [playingKey, setPlayingKey] = useState<string | null>(null)
  const [loadingKey, setLoadingKey] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentKeyRef = useRef<string | null>(null)

  useEffect(() => {
    void cleanupExpiredAudio()
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      if (audioRef.current.src.startsWith('blob:')) {
        URL.revokeObjectURL(audioRef.current.src)
      }
      audioRef.current = null
    }
    currentKeyRef.current = null
    setPlayingKey(null)
    setLoadingKey(null)
  }, [])

  const play = useCallback(
    async (chatId: string, messageId: string, text: string, voice: string, lang: string) => {
      const cacheKey = `${messageId}:${voice}:${await hashText(text)}`

      if (currentKeyRef.current === cacheKey && audioRef.current) {
        if (!audioRef.current.paused) {
          audioRef.current.pause()
          setPlayingKey(null)
        } else {
          void audioRef.current.play()
          setPlayingKey(cacheKey)
        }
        return
      }

      stop()

      currentKeyRef.current = cacheKey
      setLoadingKey(cacheKey)

      try {
        let blob = await getCachedAudio(cacheKey)

        if (!blob) {
          blob = await fetchTtsAudio(chatId, messageId, voice, lang)
          await setCachedAudio(cacheKey, blob)
        }

        if (currentKeyRef.current !== cacheKey) return

        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audioRef.current = audio

        audio.onended = () => {
          if (audio.src.startsWith('blob:')) {
            URL.revokeObjectURL(audio.src)
          }
          audioRef.current = null
          currentKeyRef.current = null
          setPlayingKey(null)
        }

        await audio.play()
        setPlayingKey(cacheKey)
      } catch {
        currentKeyRef.current = null
        setPlayingKey(null)
      } finally {
        setLoadingKey(null)
      }
    },
    [stop],
  )

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        if (audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src)
        }
        audioRef.current = null
      }
    }
  }, [])

  return { playingKey, loadingKey, play, stop }
}