import type { Doctor } from '@prisma/client'
import { prisma } from '../../db/client.js'

export interface DoctorProfileInput {
  fullName: string
  specialty?: string
  licenseNumber?: string
}

export const configuracionRepository = {
  async getDoctorProfile(): Promise<Doctor | null> {
    return prisma.doctor.findFirst()
  },

  async updateDoctorProfile(
    doctorId: string,
    input: DoctorProfileInput,
  ): Promise<Doctor> {
    return prisma.doctor.update({ where: { id: doctorId }, data: input })
  },

  async getSetting(key: string): Promise<string | null> {
    const setting = await prisma.settings.findUnique({ where: { key } })
    return setting?.value ?? null
  },

  async setSetting(key: string, value: string): Promise<void> {
    await prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  },
}
