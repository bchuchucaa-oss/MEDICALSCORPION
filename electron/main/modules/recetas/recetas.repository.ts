import type { Prescription, PrescriptionItem } from '@prisma/client'
import { prisma } from '../../db/client.js'

export type PrescriptionWithItems = Prescription & { items: PrescriptionItem[] }

export interface PrescriptionItemInput {
  drugName: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
}

export interface CreatePrescriptionInput {
  consultationId: string
  doctorId: string
  notes?: string
  items: PrescriptionItemInput[]
}

export const recetasRepository = {
  async listByPatientId(patientId: string): Promise<PrescriptionWithItems[]> {
    return prisma.prescription.findMany({
      where: { consultation: { medicalRecord: { patientId } } },
      include: { items: true },
      orderBy: { issuedAt: 'desc' },
    })
  },

  async create(input: CreatePrescriptionInput): Promise<PrescriptionWithItems> {
    const { items, ...data } = input
    return prisma.prescription.create({
      data: {
        ...data,
        items: { create: items },
      },
      include: { items: true },
    })
  },
}
