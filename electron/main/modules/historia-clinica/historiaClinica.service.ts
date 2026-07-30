import type { MedicalRecord } from '@prisma/client'
import {
  historiaClinicaRepository,
  type MedicalRecordInput,
} from './historiaClinica.repository.js'

export type { MedicalRecordInput }

export const historiaClinicaService = {
  async getOrCreateByPatientId(patientId: string): Promise<MedicalRecord> {
    const existing = await historiaClinicaRepository.getByPatientId(patientId)
    if (existing) return existing
    return historiaClinicaRepository.create(patientId)
  },

  async update(
    patientId: string,
    input: MedicalRecordInput,
  ): Promise<MedicalRecord> {
    await this.getOrCreateByPatientId(patientId)
    return historiaClinicaRepository.update(patientId, input)
  },
}
