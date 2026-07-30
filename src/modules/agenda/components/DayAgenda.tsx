import type { AppointmentStatus } from '@prisma/client'
import type { AppointmentWithPatient } from '../hooks/useAppointments'

interface DayAgendaProps {
  appointments: AppointmentWithPatient[]
  isLoading: boolean
  onStatusChange: (id: string, status: AppointmentStatus) => void
  onStartConsultation: (appointment: AppointmentWithPatient) => void
}

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  SCHEDULED: 'Agendada',
  CONFIRMED: 'Confirmada',
  IN_PROGRESS: 'En curso',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
  NO_SHOW: 'No asistió',
}

const STATUS_COLOR: Record<AppointmentStatus, string> = {
  SCHEDULED: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  CONFIRMED: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  IN_PROGRESS: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  NO_SHOW: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
}

const NEXT_ACTIONS: Partial<
  Record<AppointmentStatus, { label: string; status: AppointmentStatus }[]>
> = {
  SCHEDULED: [
    { label: 'Confirmar', status: 'CONFIRMED' },
    { label: 'Cancelar', status: 'CANCELLED' },
  ],
  CONFIRMED: [
    { label: 'Iniciar', status: 'IN_PROGRESS' },
    { label: 'No asistió', status: 'NO_SHOW' },
    { label: 'Cancelar', status: 'CANCELLED' },
  ],
  IN_PROGRESS: [{ label: 'Completar', status: 'COMPLETED' }],
}

function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('es', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const CAN_START_CONSULTATION: ReadonlySet<AppointmentStatus> = new Set([
  'SCHEDULED',
  'CONFIRMED',
  'IN_PROGRESS',
])

export function DayAgenda({
  appointments,
  isLoading,
  onStatusChange,
  onStartConsultation,
}: DayAgendaProps) {
  if (isLoading) {
    return <p className="p-6 text-slate-400">Cargando…</p>
  }

  if (appointments.length === 0) {
    return (
      <p className="p-6 text-center text-slate-400">
        No hay citas agendadas para este día.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-slate-200 dark:divide-slate-800">
      {appointments.map((appt) => (
        <li key={appt.id} className="flex items-center gap-4 px-6 py-3">
          <span className="w-14 shrink-0 text-sm font-medium text-slate-700 dark:text-slate-300">
            {formatTime(appt.scheduledAt)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {appt.patient.lastName}, {appt.patient.firstName}
            </p>
            {appt.reason && (
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {appt.reason}
              </p>
            )}
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[appt.status]}`}
          >
            {STATUS_LABEL[appt.status]}
          </span>
          <div className="flex shrink-0 gap-1">
            {CAN_START_CONSULTATION.has(appt.status) && (
              <button
                type="button"
                onClick={() => onStartConsultation(appt)}
                className="rounded bg-slate-900 px-2 py-1 text-xs font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
              >
                Iniciar consulta
              </button>
            )}
            {(NEXT_ACTIONS[appt.status] ?? []).map((action) => (
              <button
                key={action.status}
                type="button"
                onClick={() => onStatusChange(appt.id, action.status)}
                className="rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {action.label}
              </button>
            ))}
          </div>
        </li>
      ))}
    </ul>
  )
}
