import { z } from 'zod'
import { isValidCedulaEcuatoriana } from '../../../shared/lib/cedula'

// Mirrors the `Patient` Prisma model. Forms validate against this before
// the value ever reaches the IPC bridge / repository layer.
export const patientSchema = z.object({
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  // `null` (not `undefined`) on an empty field: Prisma's `update` skips
  // `undefined` keys entirely (no-op), so clearing a field in the form
  // would silently fail to clear it in the database. An explicit `null`
  // actually clears it.
  documentId: z.preprocess(
    (v) => (v === '' ? null : v),
    z
      .string()
      .min(1)
      .nullable()
      .refine(
        (v) => v === null || isValidCedulaEcuatoriana(v),
        'Cédula ecuatoriana inválida',
      ),
  ),
  birthDate: z.preprocess(
    (v) => (v === '' ? null : v),
    z.coerce.date().nullable(),
  ),
  sex: z.preprocess(
    (v) => (v === '' ? null : v),
    z.enum(['M', 'F', 'OTHER']).nullable(),
  ),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  address: z.string().optional(),
  notes: z.string().optional(),
  insuranceType: z.preprocess(
    (v) => (v === '' ? null : v),
    z.enum(['IESS', 'ISSFA', 'ISSPOL', 'PRIVADO', 'NINGUNO']).nullable(),
  ),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
})

export type PatientInput = z.infer<typeof patientSchema>
