import { useEffect, useState } from 'react'
import { API_URL } from '@/shared/config'

const TOKEN_KEY = 'llamabook:access_token:v1'

function getAccessToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

interface AuthImageProps {
  src: string
  alt: string
  className?: string
}

export function AuthImage({ src, alt, className }: AuthImageProps) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    let revoked = false
    let objectUrl: string | null = null

    const token = getAccessToken()
    if (!token) return

    fetch(`${API_URL}${src}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load image')
        return res.blob()
      })
      .then((blob) => {
        if (revoked) return
        objectUrl = URL.createObjectURL(blob)
        setUrl(objectUrl)
      })
      .catch(() => {
        // ignore
      })

    return () => {
      revoked = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [src])

  if (!url) {
    return <div className={className} style={{ background: 'rgba(255,255,255,0.04)' }} />
  }

  return <img src={url} alt={alt} className={className} />
}