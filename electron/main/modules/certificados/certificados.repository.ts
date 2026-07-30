import type { Certificate, CertificateType } from '@prisma/client'
import { prisma } from '../../db/client.js'

export interface CreateCertificateInput {
  patientId: string
  doctorId: string
  type: CertificateType
  content: string
}

export const certificadosRepository = {
  async listByPatientId(patientId: string): Promise<Certificate[]> {
    return prisma.certificate.findMany({
      where: { patientId },
      orderBy: { issuedAt: 'desc' },
    })
  },

  async create(input: CreateCertificateInput): Promise<Certificate> {
    return prisma.certificate.create({ data: input })
  },
}
