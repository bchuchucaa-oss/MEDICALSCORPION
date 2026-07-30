import { useEffect, useState } from 'react'
import { useMedicalRecord, useUpdateMedicalRecord } from '../hooks/useMedicalRecord'
import type { MedicalRecordInput } from '../schemas/medicalRecord.schema'

interface HistoriaClinicaFormProps {
  patientId: string
}

const EMPTY: MedicalRecordInput = {
  bloodType: '',
  allergies: '',
  chronicConditions: '',
  familyHistory: '',
  surgicalHistory: '',
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const

const textareaClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
const labelClass =
  'mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400'

// Autosaves on blur (per the spec's "autoguardado" UX principle) instead
// of requiring an explicit save button.
export function HistoriaClinicaForm({ patientId }: HistoriaClinicaFormProps) {
  const { data: record, isLoading } = useMedicalRecord(patientId)
  const updateRecord = useUpdateMedicalRecord(patientId)
  const [values, setValues] = useState<MedicalRecordInput>(EMPTY)

  useEffect(() => {
    if (!record) return
    setValues({
      bloodType: record.bloodType ?? '',
      allergies: record.allergies ?? '',
      chronicConditions: record.chronicConditions ?? '',
      familyHistory: record.familyHistory ?? '',
      surgicalHistory: record.surgicalHistory ?? '',
    })
  }, [record])

  function setField(field: keyof MedicalRecordInput, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function save() {
    updateRecord.mutate(values)
  }

  // Selects commit their value immediately (unlike free text, there's no
  // "still typing" state to wait out with onBlur), so save with the new
  // value directly instead of the stale `values` from this closure.
  function handleBloodTypeChange(bloodType: string) {
    const next = { ...values, bloodType }
    setValues(next)
    updateRecord.mutate(next)
  }

  if (isLoading) {
    return <p className="p-4 text-sm text-slate-400">Cargando…</p>
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Historia clínica
        </h3>
        <span className="text-xs text-slate-400">
          {updateRecord.isPending
            ? 'Guardando…'
            : updateRecord.isSuccess
              ? 'Guardado'
              : ''}
        </span>
      </div>

      <div>
        <label className={labelClass}>Tipo de sangre</label>
        <select
          className={textareaClass}
          value={values.bloodType}
          onChange={(e) => handleBloodTypeChange(e.target.value)}
        >
          <option value="">Sin especificar</option>
          {BLOOD_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Alergias</label>
        <textarea
          rows={2}
          className={textareaClass}
          value={values.allergies}
          onChange={(e) => setField('allergies', e.target.value)}
          onBlur={save}
        />
      </div>

      <div>
        <label className={labelClass}>Condiciones crónicas</label>
        <textarea
          rows={2}
          className={textareaClass}
          value={values.chronicConditions}
          onChange={(e) => setField('chronicConditions', e.target.value)}
          onBlur={save}
        />
      </div>

      <div>
        <label className={labelClass}>Antecedentes familiares</label>
        <textarea
          rows={2}
          className={textareaClass}
          value={values.familyHistory}
          onChange={(e) => setField('familyHistory', e.target.value)}
          onBlur={save}
        />
      </div>

      <div>
        <label className={labelClass}>Antecedentes quirúrgicos</label>
        <textarea
          rows={2}
          className={textareaClass}
          value={values.surgicalHistory}
          onChange={(e) => setField('surgicalHistory', e.target.value)}
          onBlur={save}
        />
      </div>
    </div>
  )
}
