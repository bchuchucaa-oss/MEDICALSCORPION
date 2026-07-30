import { useState } from 'react'
import type { Patient } from '@prisma/client'
import { useCertificates, useCreateCertificate } from './hooks/useCertificates'
import { CertificateList } from './components/CertificateList'
import { CertificateForm } from './components/CertificateForm'

interface CertificadosSectionProps {
  patientId: string
  patient: Patient
}

export function CertificadosSection({
  patientId,
  patient,
}: CertificadosSectionProps) {
  const [formOpen, setFormOpen] = useState(false)
  const { data: certificates = [], isLoading } = useCertificates(patientId)
  const createCertificate = useCreateCertificate(patientId)

  return (
    <div className="mt-8 border-t border-slate-200 pt-2 dark:border-slate-800">
      <div className="flex items-center justify-between p-4 pb-0">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Certificados
        </h3>
        {!formOpen && (
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
          >
            + Nuevo certificado
          </button>
        )}
      </div>

      {formOpen && (
        <CertificateForm
          draftKey={`certificado:${patientId}`}
          isSubmitting={createCertificate.isPending}
          serverError={
            createCertificate.isError ? createCertificate.error.message : null
          }
          onCancel={() => setFormOpen(false)}
          onSubmit={(values) => {
            createCertificate.mutate(values, {
              onSuccess: () => setFormOpen(false),
            })
          }}
        />
      )}

      <CertificateList
        certificates={certificates}
        patient={patient}
        isLoading={isLoading}
      />
    </div>
  )
}
