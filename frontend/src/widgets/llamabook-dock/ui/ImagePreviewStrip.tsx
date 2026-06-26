import { useLlamabookDashboard } from '@/app/providers'
import { IconClose } from '@/shared/ui/icons'

export function ImagePreviewStrip() {
  const { pendingImages, removePendingImage } = useLlamabookDashboard()

  if (pendingImages.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 pb-1.5">
      {pendingImages.map((img) => (
        <div
          key={img.clientId}
          className="relative w-[52px] h-[52px] rounded-lg overflow-hidden border border-llama-border-2 bg-llama-surface group"
        >
          <img
            src={img.previewUrl}
            alt={img.file.name}
            className="w-full h-full object-cover"
          />
          {img.uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
          <button
            type="button"
            onClick={() => removePendingImage(img.clientId)}
            className="absolute top-0.5 right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors duration-100"
            aria-label="Remove image"
          >
            <IconClose className="w-2.5 h-2.5 stroke-[2.5]" />
          </button>
        </div>
      ))}
    </div>
  )
}