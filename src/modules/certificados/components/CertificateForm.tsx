import { useState } from 'react'
import {
  certificateSchema,
  type CertificateInput,
} from '../schemas/certificate.schema'
import { useDraftState } from '../../../shared/lib/useDraftState'

interface CertificateFormProps {
  onSubmit: (values: CertificateInput) => void
  onCancel: () => void
  isSubmitting: boolean
  serverError: string | null
  draftKey: string
}

const TYPE_LABEL: Record<CertificateInput['type'], string> = {
  MEDICAL_LEAVE: 'Reposo médico',
  FITNESS: 'Aptitud física',
  ATTENDANCE: 'Constancia de asistencia',
  OTHER: 'Otro',
}

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
const labelClass =
  'mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400'

export function CertificateForm({
  onSubmit,
  onCancel,
  isSubmitting,
  serverError,
  draftKey,
}: CertificateFormProps) {
  const [type, setType, clearTypeDraft] = useDraftState<CertificateInput['type']>(
    `${draftKey}:type`,
    'MEDICAL_LEAVE',
  )
  const [content, setContent, clearContentDraft] = useDraftState(
    `${draftKey}:content`,
    '',
  )
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const result = certificateSchema.safeParse({ type, content })
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Datos inválidos')
      return
    }

    setError(null)
    clearTypeDraft()
    clearContentDraft()
    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-slate-200 p-4 dark:border-slate-800">
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
        <label className={labelClass}>Tipo de certificado</label>
        <select
          className={inputClass}
          value={type}
          onChange={(e) => setType(e.target.value as CertificateInput['type'])}
        >
          {Object.entries(TYPE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Contenido *</label>
        <textarea
          autoFocus
          rows={6}
          className={inputClass}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Se certifica que el paciente…"
        />
      </div>

      <div className="flex justify-end gap-2">
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
          {isSubmitting ? 'Guardando…' : 'Guardar certificado'}
        </button>
      </div>
    </form>
  )
}
