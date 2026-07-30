import { useState } from 'react'
import type { Patient } from '@prisma/client'
import { patientSchema, type PatientInput } from '../schemas/patient.schema'

type FormValues = Record<
  | 'firstName'
  | 'lastName'
  | 'documentId'
  | 'birthDate'
  | 'sex'
  | 'phone'
  | 'email'
  | 'address'
  | 'notes'
  | 'insuranceType'
  | 'emergencyContactName'
  | 'emergencyContactPhone',
  string
>

function toFormValues(patient: Patient | null): FormValues {
  return {
    firstName: patient?.firstName ?? '',
    lastName: patient?.lastName ?? '',
    documentId: patient?.documentId ?? '',
    birthDate: patient?.birthDate
      ? new Date(patient.birthDate).toISOString().slice(0, 10)
      : '',
    sex: patient?.sex ?? '',
    phone: patient?.phone ?? '',
    email: patient?.email ?? '',
    address: patient?.address ?? '',
    notes: patient?.notes ?? '',
    insuranceType: patient?.insuranceType ?? '',
    emergencyContactName: patient?.emergencyContactName ?? '',
    emergencyContactPhone: patient?.emergencyContactPhone ?? '',
  }
}

const INSURANCE_LABEL: Record<string, string> = {
  IESS: 'IESS',
  ISSFA: 'ISSFA',
  ISSPOL: 'ISSPOL',
  PRIVADO: 'Seguro privado',
  NINGUNO: 'Ninguno',
}

interface PatientFormProps {
  patient: Patient | null
  onSubmit: (values: PatientInput) => void
  onCancel: () => void
  isSubmitting: boolean
  serverError: string | null
}

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
const labelClass =
  'mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400'

export function PatientForm({
  patient,
  onSubmit,
  onCancel,
  isSubmitting,
  serverError,
}: PatientFormProps) {
  const [values, setValues] = useState<FormValues>(() => toFormValues(patient))
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})

  function setField(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const result = patientSchema.safeParse(values)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormValues, string>> = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormValues
        fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    setErrors({})
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Nombre *</label>
            <input
              autoFocus
              className={inputClass}
              value={values.firstName}
              onChange={(e) => setField('firstName', e.target.value)}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>Apellido *</label>
            <input
              className={inputClass}
              value={values.lastName}
              onChange={(e) => setField('lastName', e.target.value)}
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Cédula</label>
            <input
              className={inputClass}
              inputMode="numeric"
              maxLength={10}
              placeholder="10 dígitos"
              value={values.documentId}
              onChange={(e) => setField('documentId', e.target.value)}
            />
            {errors.documentId && (
              <p className="mt-1 text-xs text-red-600">{errors.documentId}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>Fecha de nacimiento</label>
            <input
              type="date"
              className={inputClass}
              value={values.birthDate}
              onChange={(e) => setField('birthDate', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Sexo</label>
          <select
            className={inputClass}
            value={values.sex}
            onChange={(e) => setField('sex', e.target.value)}
          >
            <option value="">Sin especificar</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Teléfono</label>
            <input
              className={inputClass}
              value={values.phone}
              onChange={(e) => setField('phone', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              className={inputClass}
              value={values.email}
              onChange={(e) => setField('email', e.target.value)}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label className={labelClass}>Dirección</label>
          <input
            className={inputClass}
            value={values.address}
            onChange={(e) => setField('address', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Afiliación</label>
          <select
            className={inputClass}
            value={values.insuranceType}
            onChange={(e) => setField('insuranceType', e.target.value)}
          >
            <option value="">Sin especificar</option>
            {Object.entries(INSURANCE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Contacto de emergencia</label>
            <input
              className={inputClass}
              value={values.emergencyContactName}
              onChange={(e) => setField('emergencyContactName', e.target.value)}
              placeholder="Nombre"
            />
          </div>
          <div>
            <label className={labelClass}>Teléfono de emergencia</label>
            <input
              className={inputClass}
              value={values.emergencyContactPhone}
              onChange={(e) => setField('emergencyContactPhone', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Notas</label>
          <textarea
            rows={3}
            className={inputClass}
            value={values.notes}
            onChange={(e) => setField('notes', e.target.value)}
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
          {isSubmitting ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
