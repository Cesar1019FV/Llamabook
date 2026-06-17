import { useLlamabookDashboard } from '@/app/providers'

export function DockFiles() {
  const { attachedFiles, removeFile } = useLlamabookDashboard()

  if (attachedFiles.length === 0) return null

  return (
    <div className="dock-files flex flex-wrap gap-1.5 pb-1.5">
      {attachedFiles.map((file) => (
        <div
          key={file}
          className="dock-file flex items-center gap-1.5 py-1 pl-2.5 pr-2 rounded-md bg-llama-surface border border-llama-border text-[12px] text-llama-fg-3"
        >
          <span>{file}</span>
          <span
            className="x cursor-pointer text-llama-fg-4 text-[14px] leading-none transition-colors duration-100 hover:text-llama-error"
            onClick={() => removeFile(file)}
          >
            ×
          </span>
        </div>
      ))}
    </div>
  )
}
