import { useState } from 'react'
import type { Patient } from '@prisma/client'
import type { ConsultationWithDiagnoses } from '../hooks/useConsultations'
import type { PrescriptionWithItems } from '../../recetas/hooks/usePrescriptions'
import type { PrescriptionInput } from '../../recetas/schemas/prescription.schema'
import { PrescriptionForm } from '../../recetas/components/PrescriptionForm'
import { PrescriptionSummary } from '../../recetas/components/PrescriptionSummary'

interface ConsultationListItemProps {
  consultation: ConsultationWithDiagnoses
  patient: Patient
  prescriptions: PrescriptionWithItems[]
  onCreatePrescription: (
    consultationId: string,
    values: PrescriptionInput,
    onDone: () => void,
  ) => void
  isCreatingPrescription: boolean
  prescriptionError: string | null
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleString('es', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ConsultationListItem({
  consultation: c,
  patient,
  prescriptions,
  onCreatePrescription,
  isCreatingPrescription,
  prescriptionError,
}: ConsultationListItemProps) {
  const [prescriptionFormOpen, setPrescriptionFormOpen] = useState(false)

  return (
    <li className="space-y-2 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{c.reasonForVisit}</span>
        <span className="text-xs text-slate-400">{formatDate(c.date)}</span>
      </div>

      {c.diagnoses.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {c.diagnoses.map((d) => (
            <span
              key={d.id}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {d.description}
            </span>
          ))}
        </div>
      )}

      {c.plan && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Plan: {c.plan}
        </p>
      )}

      <PrescriptionSummary prescriptions={prescriptions} patient={patient} />

      {!prescriptionFormOpen && (
        <button
          type="button"
          onClick={() => setPrescriptionFormOpen(true)}
          className="text-xs text-slate-500 underline hover:text-slate-700 dark:text-slate-400"
        >
          + Receta
        </button>
      )}

      {prescriptionFormOpen && (
        <PrescriptionForm
          draftKey={`receta:${c.id}`}
          isSubmitting={isCreatingPrescription}
          serverError={prescriptionError}
          onCancel={() => setPrescriptionFormOpen(false)}
          onSubmit={(values) =>
            onCreatePrescription(c.id, values, () =>
              setPrescriptionFormOpen(false),
            )
          }
        />
      )}
    </li>
  )
}
