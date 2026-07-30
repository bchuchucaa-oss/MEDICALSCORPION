import { z } from 'zod'

export const paymentSchema = z.object({
  patientId: z.string().min(1, 'Selecciona un paciente'),
  amount: z.coerce.number().positive('El monto debe ser mayor a 0'),
  method: z.enum(['CASH', 'CARD', 'TRANSFER', 'OTHER']),
  concept: z.string().optional(),
})

export type PaymentInput = z.infer<typeof paymentSchema>
