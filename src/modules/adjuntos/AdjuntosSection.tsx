import {
  useAttachments,
  useAddAttachment,
  useOpenAttachment,
  useDeleteAttachment,
} from './hooks/useAttachments'

interface AdjuntosSectionProps {
  patientId: string
}

function formatSize(bytes: number | null): string {
  if (bytes == null) return ''
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(0)} KB`
}

const FILE_ICON: Record<string, string> = {
  'application/pdf': '📄',
  'image/png': '🖼️',
  'image/jpeg': '🖼️',
  'image/gif': '🖼️',
}

export function AdjuntosSection({ patientId }: AdjuntosSectionProps) {
  const { data: attachments = [], isLoading } = useAttachments(patientId)
  const addAttachment = useAddAttachment(patientId)
  const openAttachment = useOpenAttachment()
  const deleteAttachment = useDeleteAttachment(patientId)

  return (
    <div className="border-t border-slate-200 p-4 dark:border-slate-800">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Adjuntos
        </h3>
        <button
          type="button"
          onClick={() => addAttachment.mutate()}
          disabled={addAttachment.isPending}
          className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
        >
          {addAttachment.isPending ? 'Adjuntando…' : '+ Adjuntar archivo'}
        </button>
      </div>

      {addAttachment.isError && (
        <p className="mb-2 text-xs text-red-600 dark:text-red-400">
          {addAttachment.error.message}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-slate-400">Cargando…</p>
      ) : attachments.length === 0 ? (
        <p className="text-sm text-slate-400">Sin documentos adjuntos.</p>
      ) : (
        <ul className="divide-y divide-slate-200 dark:divide-slate-800">
          {attachments.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between gap-2 py-2 text-sm"
            >
              <button
                type="button"
                onClick={() => openAttachment.mutate(a.id)}
                className="flex min-w-0 items-center gap-2 text-left hover:underline"
              >
                <span>{a.mimeType ? FILE_ICON[a.mimeType] ?? '📎' : '📎'}</span>
                <span className="truncate">{a.fileName}</span>
              </button>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-slate-400">
                  {formatSize(a.sizeBytes)}
                </span>
                <button
                  type="button"
                  onClick={() => deleteAttachment.mutate(a.id)}
                  className="text-xs text-slate-400 hover:text-red-600"
                >
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
