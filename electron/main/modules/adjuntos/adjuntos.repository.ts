import type { Attachment } from '@prisma/client'
import { prisma } from '../../db/client.js'

export interface CreateAttachmentInput {
  patientId: string
  fileName: string
  filePath: string
  mimeType?: string
  sizeBytes?: number
}

export const adjuntosRepository = {
  async listByPatientId(patientId: string): Promise<Attachment[]> {
    return prisma.attachment.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(id: string): Promise<Attachment | null> {
    return prisma.attachment.findUnique({ where: { id } })
  },

  async create(input: CreateAttachmentInput): Promise<Attachment> {
    return prisma.attachment.create({ data: input })
  },

  async delete(id: string): Promise<Attachment> {
    return prisma.attachment.delete({ where: { id } })
  },
}
