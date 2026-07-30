import type { PrescriptionTemplate, PrescriptionTemplateItem } from '@prisma/client'
import { prisma } from '../../db/client.js'

export type PrescriptionTemplateWithItems = PrescriptionTemplate & {
  items: PrescriptionTemplateItem[]
}

export interface TemplateItemInput {
  drugName: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
}

export const prescriptionTemplatesRepository = {
  async listByDoctorId(doctorId: string): Promise<PrescriptionTemplateWithItems[]> {
    return prisma.prescriptionTemplate.findMany({
      where: { doctorId },
      include: { items: true },
      orderBy: { name: 'asc' },
    })
  },

  async create(
    doctorId: string,
    name: string,
    items: TemplateItemInput[],
  ): Promise<PrescriptionTemplateWithItems> {
    return prisma.prescriptionTemplate.create({
      data: {
        doctorId,
        name,
        items: { create: items },
      },
      include: { items: true },
    })
  },

  async delete(id: string): Promise<void> {
    await prisma.prescriptionTemplate.delete({ where: { id } })
  },
}
