import { ensureDefaultDoctor } from '../core/bootstrap.js'
import {
  recetasRepository,
  type PrescriptionItemInput,
  type PrescriptionWithItems,
} from './recetas.repository.js'

export type { PrescriptionWithItems, PrescriptionItemInput }

export interface CreatePrescriptionInput {
  consultationId: string
  notes?: string
  items: PrescriptionItemInput[]
}

export const recetasService = {
  async listByPatientId(patientId: string): Promise<PrescriptionWithItems[]> {
    return recetasRepository.listByPatientId(patientId)
  },

  async create(input: CreatePrescriptionInput): Promise<PrescriptionWithItems> {
    const doctor = await ensureDefaultDoctor()
    return recetasRepository.create({ ...input, doctorId: doctor.id })
  },
}
