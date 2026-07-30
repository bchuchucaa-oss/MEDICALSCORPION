import type { Doctor } from '@prisma/client'
import { ensureDefaultDoctor } from '../core/bootstrap.js'
import {
  configuracionRepository,
  type DoctorProfileInput,
} from './configuracion.repository.js'

export type { DoctorProfileInput }

export const configuracionService = {
  async getDoctorProfile(): Promise<Doctor> {
    const existing = await configuracionRepository.getDoctorProfile()
    if (existing) return existing
    return ensureDefaultDoctor()
  },

  async updateDoctorProfile(input: DoctorProfileInput): Promise<Doctor> {
    const doctor = await this.getDoctorProfile()
    return configuracionRepository.updateDoctorProfile(doctor.id, input)
  },

  async getSetting(key: string): Promise<string | null> {
    return configuracionRepository.getSetting(key)
  },

  async setSetting(key: string, value: string): Promise<void> {
    return configuracionRepository.setSetting(key, value)
  },
}
