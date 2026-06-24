const DB_NAME = 'llamabook-tts'
const STORE_NAME = 'audio_cache'
const DB_VERSION = 1
const TTL_MS = 7 * 24 * 60 * 60 * 1000

interface CacheEntry {
  key: string
  blob: Blob
  createdAt: number
  expiresAt: number
}

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

export async function getCachedAudio(key: string): Promise<Blob | null> {
  try {
    const db = await openDb()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.get(key)
      req.onsuccess = () => {
        const entry = req.result as CacheEntry | undefined
        if (!entry) {
          resolve(null)
          return
        }
        if (Date.now() > entry.expiresAt) {
          void deleteCachedAudio(key)
          resolve(null)
          return
        }
        resolve(entry.blob)
      }
      req.onerror = () => reject(req.error)
    })
  } catch {
    return null
  }
}

export async function setCachedAudio(key: string, blob: Blob): Promise<void> {
  try {
    const db = await openDb()
    const now = Date.now()
    const entry: CacheEntry = {
      key,
      blob,
      createdAt: now,
      expiresAt: now + TTL_MS,
    }
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      store.put(entry)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    // ignore
  }
}

async function deleteCachedAudio(key: string): Promise<void> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      store.delete(key)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    // ignore
  }
}

export async function cleanupExpiredAudio(): Promise<void> {
  try {
    const db = await openDb()
    const now = Date.now()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const req = store.getAll()
      req.onsuccess = () => {
        const entries = req.result as CacheEntry[]
        for (const entry of entries) {
          if (now > entry.expiresAt) {
            store.delete(entry.key)
          }
        }
      }
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    // ignore
  }
}