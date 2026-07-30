import { useState } from 'react'
import type { Patient } from '@prisma/client'
import { PatientPicker } from '../../pacientes/components/PatientPicker'
import { appointmentSchema, type AppointmentInput } from '../schemas/appointment.schema'

interface AppointmentFormProps {
  defaultDate: Date
  onSubmit: (values: AppointmentInput) => void
  onCancel: () => void
  isSubmitting: boolean
  serverError: string | null
}

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
const labelClass =
  'mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400'

function toTimeInput(date: Date): string {
  return date.toTimeString().slice(0, 5)
}

// `date.toISOString()` shifts to UTC first, which can land on the wrong
// calendar day — build the `YYYY-MM-DD` string from local components.
function toDateInput(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function AppointmentForm({
  defaultDate,
  onSubmit,
  onCancel,
  isSubmitting,
  serverError,
}: AppointmentFormProps) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [date, setDate] = useState(() => toDateInput(defaultDate))
  const [time, setTime] = useState(() => toTimeInput(defaultDate))
  const [durationMin, setDurationMin] = useState('30')
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!patient) {
      setError('Selecciona un paciente')
      return
    }

    const [year, month, day] = date.split('-').map(Number)
    const [hours, minutes] = time.split(':').map(Number)
    const scheduledAt = new Date(year, month - 1, day, hours, minutes, 0, 0)

    const result = appointmentSchema.safeParse({
      patientId: patient.id,
      scheduledAt,
      durationMin,
      reason,
    })

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Datos inválidos')
      return
    }

    setError(null)
    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {serverError && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {serverError}
          </div>
        )}
        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        <div>
          <label className={labelClass}>Paciente *</label>
          <PatientPicker value={patient} onChange={setPatient} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Fecha</label>
            <input
              type="date"
              className={inputClass}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Hora</label>
            <input
              type="time"
              className={inputClass}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Duración (min)</label>
            <input
              type="number"
              min={5}
              max={480}
              step={5}
              className={inputClass}
              value={durationMin}
              onChange={(e) => setDurationMin(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Motivo</label>
          <input
            className={inputClass}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Control, consulta general…"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-200 p-4 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
        >
          {isSubmitting ? 'Guardando…' : 'Agendar'}
        </button>
      </div>
    </form>
  )
}
