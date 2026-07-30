import { ensureDefaultDoctor } from '../core/bootstrap.js'
import { historiaClinicaService } from '../historia-clinica/historiaClinica.service.js'
import {
  consultaRepository,
  type ConsultationWithDiagnoses,
} from './consulta.repository.js'

export type { ConsultationWithDiagnoses }

export interface CreateConsultationInput {
  patientId: string
  reasonForVisit?: string
  symptoms?: string
  physicalExam?: string
  vitalSigns?: string
  plan?: string
  diagnoses?: string[]
}

export const consultaService = {
  async listByPatientId(patientId: string): Promise<ConsultationWithDiagnoses[]> {
    return consultaRepository.listByPatientId(patientId)
  },

  async create(
    input: CreateConsultationInput,
  ): Promise<ConsultationWithDiagnoses> {
    const { patientId, ...rest } = input
    const [medicalRecord, doctor] = await Promise.all([
      historiaClinicaService.getOrCreateByPatientId(patientId),
      ensureDefaultDoctor(),
    ])
    return consultaRepository.create({
      ...rest,
      medicalRecordId: medicalRecord.id,
      doctorId: doctor.id,
    })
  },
}
