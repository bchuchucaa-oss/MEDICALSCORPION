import type { MedicalRecord } from '@prisma/client'
import { prisma } from '../../db/client.js'

export interface MedicalRecordInput {
  bloodType?: string
  chronicConditions?: string
  allergies?: string
  familyHistory?: string
  surgicalHistory?: string
}

export const historiaClinicaRepository = {
  async getByPatientId(patientId: string): Promise<MedicalRecord | null> {
    return prisma.medicalRecord.findUnique({ where: { patientId } })
  },

  async create(patientId: string): Promise<MedicalRecord> {
    return prisma.medicalRecord.create({ data: { patientId } })
  },

  async update(
    patientId: string,
    input: MedicalRecordInput,
  ): Promise<MedicalRecord> {
    return prisma.medicalRecord.update({ where: { patientId }, data: input })
  },
}
