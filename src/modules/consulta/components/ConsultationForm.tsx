import { useState } from 'react'
import {
  consultationSchema,
  type ConsultationInput,
} from '../schemas/consultation.schema'
import { useDraftState } from '../../../shared/lib/useDraftState'

interface ConsultationFormProps {
  onSubmit: (values: ConsultationInput) => void
  onCancel: () => void
  isSubmitting: boolean
  serverError: string | null
  initialReasonForVisit?: string
  // Scopes the autosaved draft (e.g. `consulta:<patientId>`) so a
  // half-written note survives an accidental close, without leaking
  // across different patients.
  draftKey: string
}

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
const labelClass =
  'mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400'

export function ConsultationForm({
  onSubmit,
  onCancel,
  isSubmitting,
  serverError,
  initialReasonForVisit,
  draftKey,
}: ConsultationFormProps) {
  const [reasonForVisit, setReasonForVisit, clearReasonForVisit] = useDraftState(
    `${draftKey}:reasonForVisit`,
    initialReasonForVisit ?? '',
  )
  const [symptoms, setSymptoms, clearSymptoms] = useDraftState(`${draftKey}:symptoms`, '')
  const [physicalExam, setPhysicalExam, clearPhysicalExam] = useDraftState(
    `${draftKey}:physicalExam`,
    '',
  )
  const [vitalSigns, setVitalSigns, clearVitalSigns] = useDraftState(
    `${draftKey}:vitalSigns`,
    '',
  )
  const [plan, setPlan, clearPlan] = useDraftState(`${draftKey}:plan`, '')
  const [diagnoses, setDiagnoses, clearDiagnoses] = useDraftState<string[]>(
    `${draftKey}:diagnoses`,
    [''],
  )
  const [error, setError] = useState<string | null>(null)

  function clearDraft() {
    clearReasonForVisit()
    clearSymptoms()
    clearPhysicalExam()
    clearVitalSigns()
    clearPlan()
    clearDiagnoses()
  }

  function setDiagnosis(index: number, value: string) {
    setDiagnoses((prev) => prev.map((d, i) => (i === index ? value : d)))
  }

  function addDiagnosis() {
    setDiagnoses((prev) => [...prev, ''])
  }

  function removeDiagnosis(index: number) {
    setDiagnoses((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const result = consultationSchema.safeParse({
      reasonForVisit,
      symptoms,
      physicalExam,
      vitalSigns,
      plan,
      diagnoses: diagnoses.map((d) => d.trim()).filter(Boolean),
    })

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Datos inválidos')
      return
    }

    setError(null)
    clearDraft()
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
        <label className={labelClass}>Motivo de consulta *</label>
        <input
          autoFocus
          className={inputClass}
          value={reasonForVisit}
          onChange={(e) => setReasonForVisit(e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Síntomas</label>
        <textarea
          rows={2}
          className={inputClass}
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Examen físico</label>
        <textarea
          rows={2}
          className={inputClass}
          value={physicalExam}
          onChange={(e) => setPhysicalExam(e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Signos vitales</label>
        <input
          className={inputClass}
          placeholder="TA 120/80, FC 72, T 36.5°C…"
          value={vitalSigns}
          onChange={(e) => setVitalSigns(e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>Diagnósticos</label>
        <div className="space-y-2">
          {diagnoses.map((diagnosis, index) => (
            <div key={index} className="flex gap-2">
              <input
                className={inputClass}
                value={diagnosis}
                onChange={(e) => setDiagnosis(index, e.target.value)}
                placeholder={index === 0 ? 'Diagnóstico principal' : 'Diagnóstico adicional'}
              />
              {diagnoses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDiagnosis(index)}
                  className="rounded px-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addDiagnosis}
          className="mt-2 text-xs text-slate-500 underline hover:text-slate-700 dark:text-slate-400"
        >
          + Agregar diagnóstico
        </button>
      </div>

      <div>
        <label className={labelClass}>Plan</label>
        <textarea
          rows={2}
          className={inputClass}
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
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
          {isSubmitting ? 'Guardando…' : 'Guardar consulta'}
        </button>
      </div>
    </form>
  )
}
