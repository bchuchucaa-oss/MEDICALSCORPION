import { useCorePing } from '../hooks/useCorePing'

// Proves the full architecture chain end to end:
// UI -> preload bridge -> IPC -> Service -> Repository -> Prisma -> SQLite.
export function SystemStatus() {
  const { data, isPending, isError } = useCorePing()

  const label = isPending
    ? 'Conectando con la base de datos…'
    : isError
      ? 'Sin conexión con el proceso principal'
      : `Base de datos activa · ${data.settingsCount} configuraciones`

  const dotColor = isPending
    ? 'bg-amber-400'
    : isError
      ? 'bg-red-500'
      : 'bg-emerald-500'

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
      <span className={`h-2 w-2 rounded-full ${dotColor}`} />
      {label}
    </div>
  )
}
