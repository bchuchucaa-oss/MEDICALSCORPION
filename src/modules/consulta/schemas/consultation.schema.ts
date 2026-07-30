import { z } from 'zod'

export const consultationSchema = z.object({
  reasonForVisit: z.string().min(1, 'El motivo de consulta es obligatorio'),
  symptoms: z.string().optional(),
  physicalExam: z.string().optional(),
  vitalSigns: z.string().optional(),
  plan: z.string().optional(),
  diagnoses: z.array(z.string().min(1)).optional(),
})

export type ConsultationInput = z.infer<typeof consultationSchema>
