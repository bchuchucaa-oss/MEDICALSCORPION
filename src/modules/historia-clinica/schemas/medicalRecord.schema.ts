import { z } from 'zod'

export const medicalRecordSchema = z.object({
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),
  familyHistory: z.string().optional(),
  surgicalHistory: z.string().optional(),
})

export type MedicalRecordInput = z.infer<typeof medicalRecordSchema>
