import { z } from 'zod'

export const prescriptionItemSchema = z.object({
  drugName: z.string().min(1, 'El medicamento es obligatorio'),
  dosage: z.string().min(1, 'La dosis es obligatoria'),
  frequency: z.string().min(1, 'La frecuencia es obligatoria'),
  duration: z.string().min(1, 'La duración es obligatoria'),
  instructions: z.string().optional(),
})

export const prescriptionSchema = z.object({
  notes: z.string().optional(),
  items: z.array(prescriptionItemSchema).min(1, 'Agrega al menos un medicamento'),
})

export type PrescriptionItemInput = z.infer<typeof prescriptionItemSchema>
export type PrescriptionInput = z.infer<typeof prescriptionSchema>
