import type { Patient } from '@prisma/client'
import type { ConsultationWithDiagnoses } from '../hooks/useConsultations'
import type { PrescriptionWithItems } from '../../recetas/hooks/usePrescriptions'
import type { PrescriptionInput } from '../../recetas/schemas/prescription.schema'
import { ConsultationListItem } from './ConsultationListItem'

interface ConsultationListProps {
  consultations: ConsultationWithDiagnoses[]
  patient: Patient
  isLoading: boolean
  prescriptionsByConsultationId: Map<string, PrescriptionWithItems[]>
  onCreatePrescription: (
    consultationId: string,
    values: PrescriptionInput,
    onDone: () => void,
  ) => void
  isCreatingPrescription: boolean
  prescriptionError: string | null
}

export function ConsultationList({
  consultations,
  patient,
  isLoading,
  prescriptionsByConsultationId,
  onCreatePrescription,
  isCreatingPrescription,
  prescriptionError,
}: ConsultationListProps) {
  if (isLoading) {
    return <p className="p-4 text-sm text-slate-400">Cargando…</p>
  }

  if (consultations.length === 0) {
    return (
      <p className="p-4 text-sm text-slate-400">
        Sin consultas registradas todavía.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-slate-200 dark:divide-slate-800">
      {consultations.map((c) => (
        <ConsultationListItem
          key={c.id}
          consultation={c}
          patient={patient}
          prescriptions={prescriptionsByConsultationId.get(c.id) ?? []}
          onCreatePrescription={onCreatePrescription}
          isCreatingPrescription={isCreatingPrescription}
          prescriptionError={prescriptionError}
        />
      ))}
    </ul>
  )
}
