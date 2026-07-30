import { useMemo, useState } from 'react'
import type { Patient } from '@prisma/client'
import { useConsultations, useCreateConsultation } from './hooks/useConsultations'
import { ConsultationList } from './components/ConsultationList'
import { ConsultationForm } from './components/ConsultationForm'
import {
  usePrescriptions,
  useCreatePrescription,
} from '../recetas/hooks/usePrescriptions'
import type { PrescriptionWithItems } from '../recetas/hooks/usePrescriptions'
import { QuickScheduleNext } from '../agenda/components/QuickScheduleNext'

interface ConsultaSectionProps {
  patientId: string
  patient: Patient
  autoOpenConsulta?: { reason?: string }
}

export function ConsultaSection({
  patientId,
  patient,
  autoOpenConsulta,
}: ConsultaSectionProps) {
  const [formOpen, setFormOpen] = useState(autoOpenConsulta !== undefined)
  const [showScheduleNext, setShowScheduleNext] = useState(false)
  const { data: consultations = [], isLoading } = useConsultations(patientId)
  const createConsultation = useCreateConsultation(patientId)

  const { data: prescriptions = [] } = usePrescriptions(patientId)
  const createPrescription = useCreatePrescription(patientId)

  const prescriptionsByConsultationId = useMemo(() => {
    const map = new Map<string, PrescriptionWithItems[]>()
    for (const prescription of prescriptions) {
      const list = map.get(prescription.consultationId) ?? []
      list.push(prescription)
      map.set(prescription.consultationId, list)
    }
    return map
  }, [prescriptions])

  return (
    <div>
      <div className="flex items-center justify-between p-4 pb-0">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Consultas
        </h3>
        {!formOpen && (
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
          >
            + Nueva consulta
          </button>
        )}
      </div>

      {formOpen && (
        <ConsultationForm
          draftKey={`consulta:${patientId}`}
          initialReasonForVisit={autoOpenConsulta?.reason}
          isSubmitting={createConsultation.isPending}
          serverError={
            createConsultation.isError ? createConsultation.error.message : null
          }
          onCancel={() => setFormOpen(false)}
          onSubmit={(values) => {
            createConsultation.mutate(values, {
              onSuccess: () => {
                setFormOpen(false)
                setShowScheduleNext(true)
              },
            })
          }}
        />
      )}

      {showScheduleNext && (
        <div className="p-4 pt-0">
          <QuickScheduleNext
            patientId={patientId}
            onDone={() => setShowScheduleNext(false)}
          />
        </div>
      )}

      <ConsultationList
        consultations={consultations}
        patient={patient}
        isLoading={isLoading}
        prescriptionsByConsultationId={prescriptionsByConsultationId}
        onCreatePrescription={(consultationId, values, onDone) => {
          createPrescription.mutate(
            { consultationId, ...values },
            { onSuccess: onDone },
          )
        }}
        isCreatingPrescription={createPrescription.isPending}
        prescriptionError={
          createPrescription.isError ? createPrescription.error.message : null
        }
      />
    </div>
  )
}
