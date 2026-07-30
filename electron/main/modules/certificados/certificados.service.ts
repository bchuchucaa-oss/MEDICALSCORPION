import type { Certificate } from '@prisma/client'
import { ensureDefaultDoctor } from '../core/bootstrap.js'
import {
  certificadosRepository,
  type CreateCertificateInput,
} from './certificados.repository.js'

export interface CreateCertificateServiceInput {
  patientId: string
  type: CreateCertificateInput['type']
  content: string
}

export const certificadosService = {
  async listByPatientId(patientId: string): Promise<Certificate[]> {
    return certificadosRepository.listByPatientId(patientId)
  },

  async create(input: CreateCertificateServiceInput): Promise<Certificate> {
    const doctor = await ensureDefaultDoctor()
    return certificadosRepository.create({ ...input, doctorId: doctor.id })
  },
}
