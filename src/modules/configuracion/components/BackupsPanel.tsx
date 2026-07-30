import { useBackups, useCreateBackup } from '../hooks/useBackups'

function formatDate(date: string): string {
  return new Date(date).toLocaleString('es', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatSize(bytes: number): string {
  return `${(bytes / 1024).toFixed(0)} KB`
}

export function BackupsPanel() {
  const { data: backups = [], isLoading } = useBackups()
  const createBackup = useCreateBackup()

  return (
    <div className="max-w-md space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Copias de seguridad
        </h2>
        <button
          type="button"
          onClick={() => createBackup.mutate()}
          disabled={createBackup.isPending}
          className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
        >
          {createBackup.isPending ? 'Creando…' : '+ Crear backup ahora'}
        </button>
      </div>

      {createBackup.isError && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {createBackup.error.message}
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-slate-400">Cargando…</p>
      ) : backups.length === 0 ? (
        <p className="text-sm text-slate-400">
          No se han creado copias de seguridad todavía.
        </p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {backups.map((b) => (
            <li
              key={b.fileName}
              className="flex items-center justify-between px-3 py-2 text-sm"
            >
              <span className="truncate">{b.fileName}</span>
              <span className="ml-2 shrink-0 text-xs text-slate-400">
                {formatDate(b.createdAt)} · {formatSize(b.sizeBytes)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
