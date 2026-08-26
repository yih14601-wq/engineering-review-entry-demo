import { type DragEvent } from 'react'
import {
  CircleCheck,
  CircleX,
  CloudUpload,
  FileText,
  RotateCcw,
  Trash2,
  Upload,
} from 'lucide-react'

export type UploadStatus = 'success' | 'error'
export const MAX_UPLOAD_FILE_SIZE = 50 * 1024 * 1024

export interface UploadFileItem {
  id: string
  name: string
  size: number
  status: UploadStatus
}

const formatFileSize = (size: number) => {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`
  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

function FilePicker({
  label,
  onFiles,
}: {
  label: string
  onFiles: (files: File[]) => void
}) {
  return (
    <label className="primary-button compact-button upload-picker">
      <Upload size={16} />
      {label}
      <input
        type="file"
        multiple
        onChange={(event) => {
          onFiles(Array.from(event.target.files ?? []))
          event.target.value = ''
        }}
      />
    </label>
  )
}

export default function FileUploadPanel({
  categoryLabel,
  files,
  onFiles,
  onDelete,
  onRetry,
}: {
  categoryLabel: string
  files: UploadFileItem[]
  onFiles: (files: File[]) => void
  onDelete: (id: string) => void
  onRetry: (id: string) => void
}) {
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    onFiles(Array.from(event.dataTransfer.files))
  }
  const failedCount = files.filter((file) => file.status === 'error').length
  const successCount = files.length - failedCount

  return (
    <div
      className={`upload-panel${files.length ? ' is-populated' : ''}`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      {files.length === 0 ? (
        <>
          <span className="upload-cloud-icon"><CloudUpload size={20} /></span>
          <strong>拖拽文件到此处，或点击选择文件</strong>
          <p>支持一次多选，也可分批重复上传</p>
          <FilePicker label="选择文件" onFiles={onFiles} />
        </>
      ) : (
        <>
          <div className="upload-continue-row">
            <span className="upload-cloud-icon is-compact"><CloudUpload size={18} /></span>
            <div className="upload-continue-copy">
              <strong>拖拽文件到此处，或继续选择文件</strong>
              <span>支持一次多选，也可分批重复上传</span>
            </div>
            <FilePicker label="继续上传" onFiles={onFiles} />
          </div>

          <div className="upload-file-summary">
            <span className={failedCount ? 'is-error' : undefined}>
              {failedCount
                ? `${successCount} 份成功 · ${failedCount} 份失败`
                : `已上传 ${successCount} 份`}
            </span>
            <span>单个文件最大 50MB</span>
          </div>

          <div className="uploaded-file-list" aria-label={`${categoryLabel}已选择文件`}>
            {files.map((file) => {
              const failed = file.status === 'error'
              return (
                <div className={`uploaded-file-row${failed ? ' is-error' : ''}`} key={file.id}>
                  <FileText className="uploaded-file-type" size={16} aria-hidden="true" />
                  <strong title={file.name}>{file.name}</strong>
                  <span className="uploaded-file-size">
                    {failed ? '上传失败' : formatFileSize(file.size)}
                  </span>
                  <span
                    className="upload-status-icon"
                    title={failed ? '上传失败' : '上传成功'}
                    aria-label={failed ? '上传失败' : '上传成功'}
                  >
                    {failed ? <CircleX size={16} /> : <CircleCheck size={16} />}
                  </span>
                  {failed ? (
                    <button
                      type="button"
                      className="icon-button upload-status-action"
                      title="重试上传"
                      aria-label={`重试上传 ${file.name}`}
                      onClick={() => onRetry(file.id)}
                    >
                      <RotateCcw size={16} />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="icon-button upload-delete-action"
                    title="删除文件"
                    aria-label={`删除 ${file.name}`}
                    onClick={() => onDelete(file.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
