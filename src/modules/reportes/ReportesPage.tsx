import { useState } from 'react'
import { useReportSummary } from './hooks/useReportSummary'
import { StatTile } from './components/StatTile'

type PresetKey = 'today' | '7d' | '30d' | 'month' | 'custom'

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, amount: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + amount)
  return d
}

function toDateInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateInputValue(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function rangeForPreset(preset: PresetKey): { from: Date; to: Date } {
  const today = startOfDay(new Date())
  const tomorrow = addDays(today, 1)

  switch (preset) {
    case 'today':
      return { from: today, to: tomorrow }
    case '7d':
      return { from: addDays(today, -6), to: tomorrow }
    case '30d':
      return { from: addDays(today, -29), to: tomorrow }
    case 'month':
      return {
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: new Date(today.getFullYear(), today.getMonth() + 1, 1),
      }
    case 'custom':
      return { from: today, to: tomorrow }
  }
}

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: 'today', label: 'Hoy' },
  { key: '7d', label: 'Últimos 7 días' },
  { key: '30d', label: 'Últimos 30 días' },
  { key: 'month', label: 'Este mes' },
]

export function ReportesPage() {
  const [preset, setPreset] = useState<PresetKey>('30d')
  const [customRange, setCustomRange] = useState(() => rangeForPreset('30d'))

  const range = preset === 'custom' ? customRange : rangeForPreset(preset)
  const { data, isLoading } = useReportSummary(range.from, range.to)

  const current = data?.current
  const previous = data?.previous

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setPreset(p.key)}
            className={`rounded-full px-3 py-1 text-sm ${
              preset === p.key
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {p.label}
          </button>
        ))}
        <div className="ml-2 flex items-center gap-1 border-l border-slate-200 pl-3 dark:border-slate-800">
          <input
            type="date"
            value={toDateInputValue(range.from)}
            onChange={(e) => {
              if (!e.target.value) return
              setPreset('custom')
              setCustomRange((r) => ({
                ...r,
                from: parseDateInputValue(e.target.value),
              }))
            }}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
          <span className="text-sm text-slate-400">a</span>
          <input
            type="date"
            value={toDateInputValue(addDays(range.to, -1))}
            onChange={(e) => {
              if (!e.target.value) return
              setPreset('custom')
              setCustomRange((r) => ({
                ...r,
                to: addDays(parseDateInputValue(e.target.value), 1),
              }))
            }}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
      </div>

      {isLoading || !current || !previous ? (
        <p className="text-sm text-slate-400">Cargando…</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatTile
            label="Ingresos"
            value={current.ingresos}
            previousValue={previous.ingresos}
            isCurrency
          />
          <StatTile
            label="Consultas realizadas"
            value={current.consultas}
            previousValue={previous.consultas}
          />
          <StatTile
            label="Citas agendadas"
            value={current.citas}
            previousValue={previous.citas}
          />
          <StatTile
            label="Recetas emitidas"
            value={current.recetas}
            previousValue={previous.recetas}
          />
          <StatTile
            label="Certificados emitidos"
            value={current.certificados}
            previousValue={previous.certificados}
          />
          <StatTile
            label="Pacientes nuevos"
            value={current.pacientesNuevos}
            previousValue={previous.pacientesNuevos}
          />
        </div>
      )}
    </div>
  )
}
