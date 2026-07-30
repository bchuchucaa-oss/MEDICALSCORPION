import { ensureDefaultDoctor } from '../core/bootstrap.js'
import {
  prescriptionTemplatesRepository,
  type PrescriptionTemplateWithItems,
  type TemplateItemInput,
} from './prescriptionTemplates.repository.js'

export type { PrescriptionTemplateWithItems, TemplateItemInput }

export const prescriptionTemplatesService = {
  async list(): Promise<PrescriptionTemplateWithItems[]> {
    const doctor = await ensureDefaultDoctor()
    return prescriptionTemplatesRepository.listByDoctorId(doctor.id)
  },

  async create(
    name: string,
    items: TemplateItemInput[],
  ): Promise<PrescriptionTemplateWithItems> {
    const doctor = await ensureDefaultDoctor()
    return prescriptionTemplatesRepository.create(doctor.id, name, items)
  },

  async delete(id: string): Promise<void> {
    return prescriptionTemplatesRepository.delete(id)
  },
}
