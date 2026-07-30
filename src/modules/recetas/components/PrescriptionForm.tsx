import { useState } from 'react'
import {
  prescriptionSchema,
  type PrescriptionInput,
  type PrescriptionItemInput,
} from '../schemas/prescription.schema'
import { MedicationAutocomplete } from './MedicationAutocomplete'
import type { MedicationPreset } from '../data/commonMedications'
import {
  usePrescriptionTemplates,
  useCreatePrescriptionTemplate,
  useDeletePrescriptionTemplate,
} from '../hooks/usePrescriptionTemplates'
import { useDraftState } from '../../../shared/lib/useDraftState'

interface PrescriptionFormProps {
  onSubmit: (values: PrescriptionInput) => void
  onCancel: () => void
  isSubmitting: boolean
  serverError: string | null
  draftKey: string
}

const EMPTY_ITEM: PrescriptionItemInput = {
  drugName: '',
  dosage: '',
  frequency: '',
  duration: '',
  instructions: '',
}

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
const labelClass =
  'mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400'

export function PrescriptionForm({
  onSubmit,
  onCancel,
  isSubmitting,
  serverError,
  draftKey,
}: PrescriptionFormProps) {
  const [items, setItems, clearItemsDraft] = useDraftState<
    PrescriptionItemInput[]
  >(`${draftKey}:items`, [{ ...EMPTY_ITEM }])
  const [notes, setNotes, clearNotesDraft] = useDraftState(
    `${draftKey}:notes`,
    '',
  )
  const [error, setError] = useState<string | null>(null)

  const { data: templates = [] } = usePrescriptionTemplates()
  const createTemplate = useCreatePrescriptionTemplate()
  const deleteTemplate = useDeletePrescriptionTemplate()
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [savingTemplate, setSavingTemplate] = useState(false)
  const [templateName, setTemplateName] = useState('')

  function applyTemplate() {
    const template = templates.find((t) => t.id === selectedTemplateId)
    if (!template) return
    setItems(
      template.items.map((item) => ({
        drugName: item.drugName,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        instructions: item.instructions ?? '',
      })),
    )
  }

  function handleSaveTemplate() {
    if (!templateName.trim()) return
    const validItems = items.filter(
      (i) => i.drugName && i.dosage && i.frequency && i.duration,
    )
    if (validItems.length === 0) return
    createTemplate.mutate(
      { name: templateName.trim(), items: validItems },
      { onSuccess: () => {
        setSavingTemplate(false)
        setTemplateName('')
      } },
    )
  }

  function setItemField(
    index: number,
    field: keyof PrescriptionItemInput,
    value: string,
  ) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    )
  }

  // Filling from a suggestion sets the name and, only for whatever the
  // doctor hasn't already typed, the dosage/frequency/duration defaults —
  // it should speed up entry, never overwrite an edit already in progress.
  function selectPreset(index: number, preset: MedicationPreset) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              drugName: preset.drugName,
              dosage: item.dosage || preset.dosage,
              frequency: item.frequency || preset.frequency,
              duration: item.duration || preset.duration,
            }
          : item,
      ),
    )
  }

  function addItem() {
    setItems((prev) => [...prev, { ...EMPTY_ITEM }])
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const result = prescriptionSchema.safeParse({ notes, items })
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Datos inválidos')
      return
    }

    setError(null)
    clearItemsDraft()
    clearNotesDraft()
    onSubmit(result.data)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50"
    >
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

      {templates.length > 0 && (
        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
          <select
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className={inputClass}
          >
            <option value="">Usar plantilla…</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={applyTemplate}
            disabled={!selectedTemplateId}
            className="shrink-0 rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Aplicar
          </button>
          {selectedTemplateId && (
            <button
              type="button"
              onClick={() => {
                deleteTemplate.mutate(selectedTemplateId)
                setSelectedTemplateId('')
              }}
              className="shrink-0 text-xs text-slate-400 hover:text-red-600"
              title="Eliminar plantilla"
            >
              🗑
            </button>
          )}
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-md border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">
                Medicamento {index + 1}
              </span>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕ Quitar
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>Medicamento *</label>
                <MedicationAutocomplete
                  className={inputClass}
                  value={item.drugName}
                  onChange={(value) => setItemField(index, 'drugName', value)}
                  onSelectPreset={(preset) => selectPreset(index, preset)}
                />
              </div>
              <div>
                <label className={labelClass}>Dosis *</label>
                <input
                  className={inputClass}
                  value={item.dosage}
                  onChange={(e) => setItemField(index, 'dosage', e.target.value)}
                  placeholder="500 mg"
                />
              </div>
              <div>
                <label className={labelClass}>Frecuencia *</label>
                <input
                  className={inputClass}
                  value={item.frequency}
                  onChange={(e) => setItemField(index, 'frequency', e.target.value)}
                  placeholder="Cada 8 horas"
                />
              </div>
              <div>
                <label className={labelClass}>Duración *</label>
                <input
                  className={inputClass}
                  value={item.duration}
                  onChange={(e) => setItemField(index, 'duration', e.target.value)}
                  placeholder="7 días"
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Indicaciones</label>
                <input
                  className={inputClass}
                  value={item.instructions}
                  onChange={(e) =>
                    setItemField(index, 'instructions', e.target.value)
                  }
                  placeholder="Tomar con alimentos…"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={addItem}
          className="text-xs text-slate-500 underline hover:text-slate-700 dark:text-slate-400"
        >
          + Agregar medicamento
        </button>
        {!savingTemplate && (
          <button
            type="button"
            onClick={() => setSavingTemplate(true)}
            className="text-xs text-slate-500 underline hover:text-slate-700 dark:text-slate-400"
          >
            💾 Guardar como plantilla
          </button>
        )}
      </div>

      {savingTemplate && (
        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
          <input
            autoFocus
            className={inputClass}
            placeholder="Nombre de la plantilla (ej. Gripe común)"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
          <button
            type="button"
            onClick={handleSaveTemplate}
            disabled={createTemplate.isPending}
            className="shrink-0 rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => {
              setSavingTemplate(false)
              setTemplateName('')
            }}
            className="shrink-0 text-xs text-slate-400 hover:text-slate-600"
          >
            Cancelar
          </button>
        </div>
      )}

      <div>
        <label className={labelClass}>Notas</label>
        <textarea
          rows={2}
          className={inputClass}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
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
          {isSubmitting ? 'Guardando…' : 'Guardar receta'}
        </button>
      </div>
    </form>
  )
}
