import type { PrintFormat } from './types'

export interface DoctorInfo {
  fullName: string
  specialty?: string | null
  licenseNumber?: string | null
}

export interface PatientInfo {
  firstName: string
  lastName: string
  documentId?: string | null
}

const THERMAL_FORMATS = new Set<PrintFormat>(['thermal-58', 'thermal-80'])

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function nl2br(value: string): string {
  return escapeHtml(value).replace(/\n/g, '<br>')
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// One shared shell (doctor header, patient line, signature footer) so every
// printable document — receta, certificado, comprobante — looks consistent.
// The format only changes scale (thermal receipts are narrow and dense;
// carta/media-hoja are a normal document page).
function wrapDocument(
  format: PrintFormat,
  title: string,
  doctor: DoctorInfo,
  patient: PatientInfo | null,
  issuedAt: Date | string,
  bodyHtml: string,
): string {
  const thermal = THERMAL_FORMATS.has(format)

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: ${thermal ? '3mm' : '15mm'};
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    font-size: ${thermal ? '10px' : '13px'};
    color: #0b0b0b;
    max-width: ${thermal ? '100%' : '180mm'};
  }
  h1 {
    font-size: ${thermal ? '12px' : '16px'};
    margin: 0 0 2px;
  }
  .doctor-meta {
    font-size: ${thermal ? '9px' : '11px'};
    color: #52514e;
    margin-bottom: ${thermal ? '6px' : '12px'};
  }
  hr {
    border: none;
    border-top: 1px solid #c3c2b7;
    margin: ${thermal ? '6px 0' : '12px 0'};
  }
  .patient-line {
    font-size: ${thermal ? '9px' : '12px'};
    margin-bottom: ${thermal ? '6px' : '14px'};
  }
  .title {
    font-weight: 600;
    font-size: ${thermal ? '11px' : '15px'};
    margin-bottom: ${thermal ? '6px' : '12px'};
  }
  .signature {
    margin-top: ${thermal ? '16px' : '40px'};
    text-align: center;
  }
  .signature .line {
    border-top: 1px solid #0b0b0b;
    width: ${thermal ? '80%' : '60mm'};
    margin: 0 auto 4px;
  }
  table { width: 100%; border-collapse: collapse; }
  th, td {
    text-align: left;
    padding: ${thermal ? '2px 0' : '4px 6px'};
    font-size: ${thermal ? '9px' : '12px'};
    border-bottom: 1px solid #e1e0d9;
  }
</style>
</head>
<body>
  <h1>${escapeHtml(doctor.fullName)}</h1>
  <div class="doctor-meta">
    ${[doctor.specialty, doctor.licenseNumber ? `Lic. ${doctor.licenseNumber}` : null]
      .filter(Boolean)
      .map((v) => escapeHtml(v as string))
      .join(' · ')}
  </div>
  <hr>
  ${
    patient
      ? `<div class="patient-line">
          <strong>Paciente:</strong> ${escapeHtml(patient.lastName)}, ${escapeHtml(patient.firstName)}
          ${patient.documentId ? ` · <strong>Documento:</strong> ${escapeHtml(patient.documentId)}` : ''}
        </div>`
      : ''
  }
  ${bodyHtml}
  <div class="signature">
    <div class="line"></div>
    ${escapeHtml(doctor.fullName)}
  </div>
  <div class="doctor-meta" style="margin-top: ${thermal ? '8px' : '16px'}; text-align: ${thermal ? 'center' : 'left'}">
    ${formatDate(issuedAt)}
  </div>
</body>
</html>`
}

export interface PrescriptionItemLike {
  drugName: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string | null
}

export function buildRecetaHtml(
  format: PrintFormat,
  doctor: DoctorInfo,
  patient: PatientInfo,
  prescription: {
    issuedAt: Date | string
    notes?: string | null
    items: PrescriptionItemLike[]
  },
): string {
  const rows = prescription.items
    .map(
      (item) => `<tr>
        <td>${escapeHtml(item.drugName)}</td>
        <td>${escapeHtml(item.dosage)}</td>
        <td>${escapeHtml(item.frequency)}</td>
        <td>${escapeHtml(item.duration)}</td>
      </tr>${
        item.instructions
          ? `<tr><td colspan="4" style="border-bottom:none; font-style:italic; color:#52514e;">${escapeHtml(item.instructions)}</td></tr>`
          : ''
      }`,
    )
    .join('')

  const body = `
    <div class="title">Receta médica</div>
    <table>
      <thead><tr><th>Medicamento</th><th>Dosis</th><th>Frecuencia</th><th>Duración</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${prescription.notes ? `<p>${nl2br(prescription.notes)}</p>` : ''}
  `

  return wrapDocument(format, 'Receta médica', doctor, patient, prescription.issuedAt, body)
}

export function buildCertificadoHtml(
  format: PrintFormat,
  doctor: DoctorInfo,
  patient: PatientInfo,
  certificate: {
    type: 'MEDICAL_LEAVE' | 'FITNESS' | 'ATTENDANCE' | 'OTHER'
    content: string
    issuedAt: Date | string
  },
): string {
  const typeLabel: Record<typeof certificate.type, string> = {
    MEDICAL_LEAVE: 'Reposo médico',
    FITNESS: 'Aptitud física',
    ATTENDANCE: 'Constancia de asistencia',
    OTHER: 'Certificado médico',
  }

  const body = `
    <div class="title">${escapeHtml(typeLabel[certificate.type])}</div>
    <p>${nl2br(certificate.content)}</p>
  `

  return wrapDocument(
    format,
    typeLabel[certificate.type],
    doctor,
    patient,
    certificate.issuedAt,
    body,
  )
}

export function buildComprobanteHtml(
  format: PrintFormat,
  doctor: DoctorInfo,
  patient: PatientInfo,
  payment: {
    receiptNumber: string
    amount: number
    method: 'CASH' | 'CARD' | 'TRANSFER' | 'OTHER'
    concept?: string | null
    paidAt: Date | string
  },
): string {
  const methodLabel: Record<typeof payment.method, string> = {
    CASH: 'Efectivo',
    CARD: 'Tarjeta',
    TRANSFER: 'Transferencia',
    OTHER: 'Otro',
  }

  const body = `
    <div class="title">Comprobante de pago · ${escapeHtml(payment.receiptNumber)}</div>
    <table>
      <tbody>
        ${payment.concept ? `<tr><td>Concepto</td><td>${escapeHtml(payment.concept)}</td></tr>` : ''}
        <tr><td>Método de pago</td><td>${escapeHtml(methodLabel[payment.method])}</td></tr>
        <tr><td>Monto</td><td><strong>${payment.amount.toLocaleString('es', { minimumFractionDigits: 2 })}</strong></td></tr>
      </tbody>
    </table>
  `

  return wrapDocument(format, 'Comprobante de pago', doctor, patient, payment.paidAt, body)
}
