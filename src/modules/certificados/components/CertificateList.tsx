import type { Certificate, Patient } from '@prisma/client'
import { useDoctorProfile } from '../../configuracion/hooks/useDoctorProfile'
import { PrintMenu } from '../../impresion/components/PrintMenu'
import { buildCertificadoHtml } from '../../impresion/templates'
import type { PrintFormat } from '../../impresion/types'

interface CertificateListProps {
  certificates: Certificate[]
  patient: Patient
  isLoading: boolean
}

const TYPE_LABEL: Record<Certificate['type'], string> = {
  MEDICAL_LEAVE: 'Reposo médico',
  FITNESS: 'Aptitud física',
  ATTENDANCE: 'Constancia de asistencia',
  OTHER: 'Otro',
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleString('es', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function CertificateList({
  certificates,
  patient,
  isLoading,
}: CertificateListProps) {
  const { data: doctor } = useDoctorProfile()

  if (isLoading) {
    return <p className="p-4 text-sm text-slate-400">Cargando…</p>
  }

  if (certificates.length === 0) {
    return (
      <p className="p-4 text-sm text-slate-400">
        Sin certificados emitidos todavía.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-slate-200 dark:divide-slate-800">
      {certificates.map((cert) => (
        <li key={cert.id} className="space-y-1 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {TYPE_LABEL[cert.type]}
            </span>
            <span className="text-xs text-slate-400">
              {formatDate(cert.issuedAt)}
            </span>
          </div>
          <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
            {cert.content}
          </p>
          {doctor && (
            <PrintMenu
              fileNamePrefix={`certificado-${patient.lastName}-${cert.id.slice(0, 6)}`}
              buildHtml={(format: PrintFormat) =>
                buildCertificadoHtml(format, doctor, patient, {
                  type: cert.type,
                  content: cert.content,
                  issuedAt: cert.issuedAt,
                })
              }
            />
          )}
        </li>
      ))}
    </ul>
  )
}
