import type { Consultation, Diagnosis } from '@prisma/client'
import { prisma } from '../../db/client.js'

export type ConsultationWithDiagnoses = Consultation & {
  diagnoses: Diagnosis[]
}

export interface CreateConsultationInput {
  medicalRecordId: string
  doctorId: string
  reasonForVisit?: string
  symptoms?: string
  physicalExam?: string
  vitalSigns?: string
  plan?: string
  diagnoses?: string[]
}

export const consultaRepository = {
  async listByPatientId(patientId: string): Promise<ConsultationWithDiagnoses[]> {
    return prisma.consultation.findMany({
      where: { medicalRecord: { patientId } },
      include: { diagnoses: true },
      orderBy: { date: 'desc' },
    })
  },

  async create(
    input: CreateConsultationInput,
  ): Promise<ConsultationWithDiagnoses> {
    const { diagnoses = [], ...data } = input
    return prisma.consultation.create({
      data: {
        ...data,
        diagnoses: {
          create: diagnoses.map((description, index) => ({
            description,
            isPrimary: index === 0,
          })),
        },
      },
      include: { diagnoses: true },
    })
  },
}
