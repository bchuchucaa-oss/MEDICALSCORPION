import { useState } from 'react'
import { usePayments, useCreatePayment } from './hooks/usePayments'
import { PaymentList } from './components/PaymentList'
import { PaymentForm } from './components/PaymentForm'
import { QuickScheduleNext } from '../agenda/components/QuickScheduleNext'
import {
  addDays,
  formatDayLabel,
  parseDateInputValue,
  toDateInputValue,
} from '../../shared/lib/date'
import { useEscapeKey } from '../../shared/lib/useEscapeKey'

// A payment logged while viewing a past/future day in Caja should be dated
// to that day (at the current time of day), not to the real "now" — Prisma's
// `paidAt @default(now())` would otherwise silently record it under today
// regardless of which day the doctor was looking at.
function paidAtFor(viewedDay: Date): Date {
  const now = new Date()
  const paidAt = new Date(viewedDay)
  paidAt.setHours(now.getHours(), now.getMinutes(), now.getSeconds())
  return paidAt
}

export function CajaPage() {
  const [day, setDay] = useState(() => new Date())
  const [formOpen, setFormOpen] = useState(false)
  const [scheduleNextPatientId, setScheduleNextPatientId] = useState<
    string | null
  >(null)

  function closePanel() {
    setFormOpen(false)
    setScheduleNextPatientId(null)
  }

  useEscapeKey(closePanel, formOpen)

  const { data: payments = [], isLoading } = usePayments(day)
  const createPayment = useCreatePayment()

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
            + Nuevo cobro
          </button>
        </div>

        <div className="flex-1 overflow-hidden p-6">
          <PaymentList payments={payments} isLoading={isLoading} />
        </div>
      </div>

      {formOpen && (
        <>
          <div className="absolute inset-0 bg-black/20" onClick={closePanel} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md border-l border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <div className="flex h-14 flex-col justify-center border-b border-slate-200 px-4 dark:border-slate-800">
              <span className="font-semibold">Nuevo cobro</span>
              <span className="text-xs font-normal capitalize text-slate-500 dark:text-slate-400">
                {formatDayLabel(day)}
              </span>
            </div>
            <div className="h-[calc(100%-3.5rem)]">
              {scheduleNextPatientId ? (
                <div className="p-4">
                  <p className="mb-3 text-sm text-emerald-600 dark:text-emerald-400">
                    Cobro registrado.
                  </p>
                  <QuickScheduleNext
                    patientId={scheduleNextPatientId}
                    onDone={closePanel}
                  />
                </div>
              ) : (
                <PaymentForm
                  isSubmitting={createPayment.isPending}
                  serverError={
                    createPayment.isError ? createPayment.error.message : null
                  }
                  onCancel={closePanel}
                  onSubmit={(values) => {
                    createPayment.mutate(
                      { ...values, paidAt: paidAtFor(day) },
                      { onSuccess: () => setScheduleNextPatientId(values.patientId) },
                    )
                  }}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
