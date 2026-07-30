import { useState } from 'react'
import { useCreateAppointment } from '../hooks/useAppointmentMutations'
import { toDateInputValue } from '../../../shared/lib/date'

interface QuickScheduleNextProps {
  patientId: string
  onDone: () => void
}

const inputClass =
  'rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900'

// Closes the spec's "Flujo Principal" loop (…Cobro → Comprobante →
// Próxima cita) by offering the follow-up appointment right where the
// visit just wrapped up, instead of making the doctor go find Agenda.
export function QuickScheduleNext({ patientId, onDone }: QuickScheduleNextProps) {
  const createAppointment = useCreateAppointment()
  const [date, setDate] = useState(() => {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    return toDateInputValue(nextWeek)
  })
  const [time, setTime] = useState('09:00')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const [year, month, day] = date.split('-').map(Number)
    const [hours, minutes] = time.split(':').map(Number)
    const scheduledAt = new Date(year, month - 1, day, hours, minutes, 0, 0)

    createAppointment.mutate(
      { patientId, scheduledAt, durationMin: 30 },
      {
        onSuccess: onDone,
        onError: (e) => setError(e.message),
      },
    )
  }

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-900/50">
      <p className="mb-2 text-slate-600 dark:text-slate-300">
        ¿Agendar la próxima cita?
      </p>
      {error && (
        <p className="mb-2 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
        <input
          type="date"
          className={inputClass}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="time"
          className={inputClass}
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button
          type="submit"
          disabled={createAppointment.isPending}
          className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
        >
          {createAppointment.isPending ? 'Agendando…' : 'Agendar'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          Omitir
        </button>
      </form>
    </div>
  )
}
