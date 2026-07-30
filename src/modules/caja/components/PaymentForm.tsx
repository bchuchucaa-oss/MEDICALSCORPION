import { useState } from 'react'
import type { Patient } from '@prisma/client'
import { PatientPicker } from '../../pacientes/components/PatientPicker'
import { paymentSchema, type PaymentInput } from '../schemas/payment.schema'
import { useSetting } from '../../configuracion/hooks/useSetting'
import { SETTINGS_KEYS } from '../../../shared/lib/settingsKeys'

interface PaymentFormProps {
  onSubmit: (values: PaymentInput) => void
  onCancel: () => void
  isSubmitting: boolean
  serverError: string | null
}

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
const labelClass =
  'mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400'

const METHOD_LABEL: Record<PaymentInput['method'], string> = {
  CASH: 'Efectivo',
  CARD: 'Tarjeta',
  TRANSFER: 'Transferencia',
  OTHER: 'Otro',
}

export function PaymentForm({
  onSubmit,
  onCancel,
  isSubmitting,
  serverError,
}: PaymentFormProps) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<PaymentInput['method']>('CASH')
  const [concept, setConcept] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { data: defaultAmount } = useSetting(
    SETTINGS_KEYS.defaultConsultationAmount,
  )

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!patient) {
      setError('Selecciona un paciente')
      return
    }

    const result = paymentSchema.safeParse({
      patientId: patient.id,
      amount,
      method,
      concept,
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className={labelClass.replace('mb-1 ', '')}>Monto *</label>
              {defaultAmount && (
                <button
                  type="button"
                  onClick={() => setAmount(defaultAmount)}
                  className="text-xs text-slate-500 underline hover:text-slate-700 dark:text-slate-400"
                >
                  Usar {Number(defaultAmount).toLocaleString('es', { minimumFractionDigits: 2 })}
                </button>
              )}
            </div>
            <input
              type="number"
              min={0}
              step="0.01"
              className={inputClass}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Método de pago</label>
            <select
              className={inputClass}
              value={method}
              onChange={(e) =>
                setMethod(e.target.value as PaymentInput['method'])
              }
            >
              {Object.entries(METHOD_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Concepto</label>
          <input
            className={inputClass}
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="Consulta general, control…"
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
          {isSubmitting ? 'Guardando…' : 'Registrar cobro'}
        </button>
      </div>
    </form>
  )
}
