import { dayRange } from '../../shared/date-range.js'
import { ensureDefaultDoctor } from '../core/bootstrap.js'
import {
  agendaRepository,
  type AppointmentWithPatient,
  type UpdateAppointmentInput,
} from './agenda.repository.js'

export type { AppointmentWithPatient, UpdateAppointmentInput }

export interface CreateAppointmentInput {
  patientId: string
  scheduledAt: Date
  durationMin?: number
  reason?: string
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
}

async function assertNoOverlap(
  doctorId: string,
  scheduledAt: Date,
  durationMin: number,
  excludeId?: string,
): Promise<void> {
  const conflict = await agendaRepository.findOverlapping(
    doctorId,
    scheduledAt,
    durationMin,
    excludeId,
  )
  if (conflict) {
    throw new Error(
      `Ya existe una cita con ${conflict.patient.lastName}, ${conflict.patient.firstName} a las ${formatTime(conflict.scheduledAt)} que se cruza con este horario.`,
    )
  }
}

export const agendaService = {
  async listForDay(date: Date): Promise<AppointmentWithPatient[]> {
    const { from, to } = dayRange(date)
    return agendaRepository.listForRange(from, to)
  },

  async create(input: CreateAppointmentInput): Promise<AppointmentWithPatient> {
    const doctor = await ensureDefaultDoctor()
    await assertNoOverlap(doctor.id, input.scheduledAt, input.durationMin ?? 30)
    return agendaRepository.create({ ...input, doctorId: doctor.id })
  },

  async update(
    id: string,
    input: UpdateAppointmentInput,
  ): Promise<AppointmentWithPatient> {
    if (input.scheduledAt || input.durationMin) {
      const existing = await agendaRepository.getById(id)
      if (existing) {
        await assertNoOverlap(
          existing.doctorId,
          input.scheduledAt ?? existing.scheduledAt,
          input.durationMin ?? existing.durationMin,
          id,
        )
      }
    }
    return agendaRepository.update(id, input)
  },
}
