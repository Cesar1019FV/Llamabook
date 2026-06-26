import { http } from '@/shared/api'

export interface FileUploadResponse {
  id: string
  name: string
  mime_type: string
  size: number
  created_at: string
}

export async function uploadFileApi(file: File): Promise<FileUploadResponse> {
  const formData = new FormData()
  formData.append('upload', file)
  return http.postForm<FileUploadResponse>('/files/', formData)
}