import { useState } from 'react'
import { usePatient } from './hooks/usePatient'
import { HistoriaClinicaForm } from '../historia-clinica/components/HistoriaClinicaForm'
import { ConsultaSection } from '../consulta/ConsultaSection'
import { CertificadosSection } from '../certificados/CertificadosSection'
import { AdjuntosSection } from '../adjuntos/AdjuntosSection'
import { useUpdateAppointment } from '../agenda/hooks/useAppointmentMutations'
import { calculateAge } from '../../shared/lib/age'

interface PatientWorkspacePageProps {
  patientId: string
  onBack: () => void
  autoOpenConsulta?: { reason?: string }
  appointmentId?: string
}

export function PatientWorkspacePage({
  patientId,
  onBack,
  autoOpenConsulta,
  appointmentId,
}: PatientWorkspacePageProps) {
  const { data: patient, isLoading } = usePatient(patientId)
  const updateAppointment = useUpdateAppointment()
  const [appointmentCompleted, setAppointmentCompleted] = useState(false)

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3 dark:border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          ← Volver
        </button>
        {!isLoading && patient && (
          <div>
            <p className="text-sm font-semibold">
              {patient.lastName}, {patient.firstName}
              {patient.birthDate && (
                <span className="ml-2 font-normal text-slate-500 dark:text-slate-400">
                  {calculateAge(patient.birthDate)} años
                </span>
              )}
              {patient.insuranceType && patient.insuranceType !== 'NINGUNO' && (
                <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-normal text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {patient.insuranceType}
                </span>
              )}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {patient.documentId ?? 'Sin documento'}
              {patient.phone ? ` · ${patient.phone}` : ''}
            </p>
            {patient.emergencyContactName && (
              <p className="text-xs text-slate-400">
                Emergencia: {patient.emergencyContactName}
                {patient.emergencyContactPhone
                  ? ` · ${patient.emergencyContactPhone}`
                  : ''}
              </p>
            )}
          </div>
        )}

        {appointmentId && (
          <button
            type="button"
            onClick={() =>
              updateAppointment.mutate(
                { id: appointmentId, status: 'COMPLETED' },
                { onSuccess: () => setAppointmentCompleted(true) },
              )
            }
            disabled={appointmentCompleted || updateAppointment.isPending}
            className="ml-auto rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-default disabled:bg-emerald-100 disabled:text-emerald-700 dark:disabled:bg-emerald-950 dark:disabled:text-emerald-300"
          >
            {appointmentCompleted
              ? '✓ Cita completada'
              : updateAppointment.isPending
                ? 'Completando…'
                : 'Completar cita'}
          </button>
        )}
      </div>

      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
        <div className="overflow-y-auto border-r border-slate-200 dark:border-slate-800">
          <HistoriaClinicaForm patientId={patientId} />
          <AdjuntosSection patientId={patientId} />
        </div>
        <div className="overflow-y-auto">
          {patient && (
            <>
              <ConsultaSection
                patientId={patientId}
                patient={patient}
                autoOpenConsulta={autoOpenConsulta}
              />
              <CertificadosSection patientId={patientId} patient={patient} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
