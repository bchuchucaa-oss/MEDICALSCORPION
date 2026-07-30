import type { Appointment, AppointmentStatus, Patient } from '@prisma/client'
import { prisma } from '../../db/client.js'

export type AppointmentWithPatient = Appointment & { patient: Patient }

export interface CreateAppointmentInput {
  patientId: string
  doctorId: string
  scheduledAt: Date
  durationMin?: number
  reason?: string
}

export interface UpdateAppointmentInput {
  scheduledAt?: Date
  durationMin?: number
  reason?: string
  notes?: string
  status?: AppointmentStatus
}

export const agendaRepository = {
  async listForRange(from: Date, to: Date): Promise<AppointmentWithPatient[]> {
    return prisma.appointment.findMany({
      where: { scheduledAt: { gte: from, lt: to } },
      include: { patient: true },
      orderBy: { scheduledAt: 'asc' },
    })
  },

  // Candidates are scoped to the same calendar day and filtered in JS —
  // Prisma can't express "start + duration > X" in a `where` clause, and a
  // single doctor's daily appointment count is small enough not to matter.
  async findOverlapping(
    doctorId: string,
    scheduledAt: Date,
    durationMin: number,
    excludeId?: string,
  ): Promise<AppointmentWithPatient | null> {
    const dayStart = new Date(scheduledAt)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayEnd.getDate() + 1)

    const candidates = await prisma.appointment.findMany({
      where: {
        doctorId,
        scheduledAt: { gte: dayStart, lt: dayEnd },
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      include: { patient: true },
    })

    const newStart = scheduledAt.getTime()
    const newEnd = newStart + durationMin * 60_000

    return (
      candidates.find((c) => {
        const cStart = c.scheduledAt.getTime()
        const cEnd = cStart + c.durationMin * 60_000
        return newStart < cEnd && cStart < newEnd
      }) ?? null
    )
  },

  async getById(id: string): Promise<AppointmentWithPatient | null> {
    return prisma.appointment.findUnique({
      where: { id },
      include: { patient: true },
    })
  },

  async create(input: CreateAppointmentInput): Promise<AppointmentWithPatient> {
    return prisma.appointment.create({
      data: input,
      include: { patient: true },
    })
  },

  async update(
    id: string,
    input: UpdateAppointmentInput,
  ): Promise<AppointmentWithPatient> {
    return prisma.appointment.update({
      where: { id },
      data: input,
      include: { patient: true },
    })
  },
}
