import { z } from 'zod'

export const certificateSchema = z.object({
  type: z.enum(['MEDICAL_LEAVE', 'FITNESS', 'ATTENDANCE', 'OTHER']),
  content: z.string().min(1, 'El contenido del certificado es obligatorio'),
})

export type CertificateInput = z.infer<typeof certificateSchema>
