import { z } from 'zod'

export const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Selecciona un paciente'),
  scheduledAt: z.coerce.date(),
  durationMin: z.coerce.number().int().min(5).max(480).default(30),
  reason: z.string().optional(),
})

export type AppointmentInput = z.infer<typeof appointmentSchema>
