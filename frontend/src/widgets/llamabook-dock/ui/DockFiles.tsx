import { useLlamabookDashboard } from '@/app/providers'

export function DockFiles() {
  const { attachedFiles, removeFile } = useLlamabookDashboard()

  if (attachedFiles.length === 0) return null

  return (
    <div className="dock-files">
      {attachedFiles.map((file) => (
        <div key={file} className="dock-file">
          <span>{file}</span>
          <span className="x" onClick={() => removeFile(file)}>×</span>
        </div>
      ))}
    </div>
  )
}
