import { z } from 'zod'

export const doctorProfileSchema = z.object({
  fullName: z.string().min(1, 'El nombre es obligatorio'),
  specialty: z.string().optional(),
  licenseNumber: z.string().optional(),
})

export type DoctorProfileInput = z.infer<typeof doctorProfileSchema>
