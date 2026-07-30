import type { Patient } from '@prisma/client'
import type { PrescriptionWithItems } from '../hooks/usePrescriptions'
import { useDoctorProfile } from '../../configuracion/hooks/useDoctorProfile'
import { PrintMenu } from '../../impresion/components/PrintMenu'
import { buildRecetaHtml } from '../../impresion/templates'
import type { PrintFormat } from '../../impresion/types'

interface PrescriptionSummaryProps {
  prescriptions: PrescriptionWithItems[]
  patient: Patient
}

export function PrescriptionSummary({
  prescriptions,
  patient,
}: PrescriptionSummaryProps) {
  const { data: doctor } = useDoctorProfile()

  if (prescriptions.length === 0) return null

  return (
    <div className="space-y-2">
      {prescriptions.map((p) => (
        <div key={p.id} className="flex flex-wrap items-center gap-1">
          {p.items.map((item) => (
            <span
              key={item.id}
              className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-950 dark:text-blue-300"
            >
              {item.drugName} · {item.dosage}
            </span>
          ))}
          {doctor && (
            <PrintMenu
              fileNamePrefix={`receta-${patient.lastName}-${p.id.slice(0, 6)}`}
              buildHtml={(format: PrintFormat) =>
                buildRecetaHtml(format, doctor, patient, {
                  issuedAt: p.issuedAt,
                  notes: p.notes,
                  items: p.items,
                })
              }
            />
          )}
        </div>
      ))}
    </div>
  )
}
