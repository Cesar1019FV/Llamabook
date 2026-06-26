export const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/v1'

export const MAX_UPLOAD_SIZE = Number(import.meta.env.LLAMABOOK_MAX_UPLOAD_SIZE ?? 50 * 1024 * 1024)
