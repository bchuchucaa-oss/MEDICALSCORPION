import { useState } from 'react'
import type { AppointmentStatus } from '@prisma/client'
import { useAppointments, type AppointmentWithPatient } from './hooks/useAppointments'
import {
  useCreateAppointment,
  useUpdateAppointment,
} from './hooks/useAppointmentMutations'
import { DayAgenda } from './components/DayAgenda'
import { AppointmentForm } from './components/AppointmentForm'
import {
  addDays,
  formatDayLabel,
  parseDateInputValue,
  toDateInputValue,
} from '../../shared/lib/date'
import { useEscapeKey } from '../../shared/lib/useEscapeKey'

interface AgendaPageProps {
  onStartConsultation: (
    patientId: string,
    appointmentId: string,
    reason?: string,
  ) => void
}

export function AgendaPage({ onStartConsultation }: AgendaPageProps) {
  const [day, setDay] = useState(() => new Date())
  const [formOpen, setFormOpen] = useState(false)

  const { data: appointments = [], isLoading } = useAppointments(day)
  const createAppointment = useCreateAppointment()
  const updateAppointment = useUpdateAppointment()

  useEscapeKey(() => setFormOpen(false), formOpen)

  function startConsultation(appointment: AppointmentWithPatient) {
    if (appointment.status !== 'IN_PROGRESS') {
      updateAppointment.mutate({ id: appointment.id, status: 'IN_PROGRESS' })
    }
    onStartConsultation(
      appointment.patientId,
      appointment.id,
      appointment.reason ?? undefined,
    )
  }

  return (
    <div className="relative flex h-full flex-1 overflow-hidden">
      <div className="flex h-full flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setDay((d) => addDays(d, -1))}
            className="rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ← Anterior
          </button>
          <button
            type="button"
            onClick={() => setDay(new Date())}
            className="rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={() => setDay((d) => addDays(d, 1))}
            className="rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Siguiente →
          </button>
          <input
            type="date"
            value={toDateInputValue(day)}
            onChange={(e) => {
              if (e.target.value) setDay(parseDateInputValue(e.target.value))
            }}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
          <span className="capitalize text-sm font-medium text-slate-700 dark:text-slate-300">
            {formatDayLabel(day)}
          </span>
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="ml-auto rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
          >
            + Nueva cita
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <DayAgenda
            appointments={appointments}
            isLoading={isLoading}
            onStatusChange={(id, status: AppointmentStatus) =>
              updateAppointment.mutate({ id, status })
            }
            onStartConsultation={startConsultation}
          />
        </div>
      </div>

      {formOpen && (
        <>
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setFormOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md border-l border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <div className="flex h-14 items-center border-b border-slate-200 px-4 font-semibold dark:border-slate-800">
              Nueva cita
            </div>
            <div className="h-[calc(100%-3.5rem)]">
              <AppointmentForm
                defaultDate={day}
                isSubmitting={createAppointment.isPending}
                serverError={
                  createAppointment.isError
                    ? createAppointment.error.message
                    : null
                }
                onCancel={() => setFormOpen(false)}
                onSubmit={(values) => {
                  createAppointment.mutate(values, {
                    onSuccess: () => {
                      setFormOpen(false)
                      setDay(values.scheduledAt)
                    },
                  })
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
