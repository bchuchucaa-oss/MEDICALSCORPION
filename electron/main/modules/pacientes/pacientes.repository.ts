import type { InsuranceType, Patient, Sex } from '@prisma/client'
import { prisma } from '../../db/client.js'

export interface CreatePatientInput {
  firstName: string
  lastName: string
  documentId?: string | null
  birthDate?: Date | null
  sex?: Sex | null
  phone?: string
  email?: string
  address?: string
  notes?: string
  insuranceType?: InsuranceType | null
  emergencyContactName?: string | null
  emergencyContactPhone?: string | null
}

export type UpdatePatientInput = Partial<CreatePatientInput>

const DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g')

// SQLite's `LIKE`/`contains` only folds ASCII case, so "jose" never matches
// "José" — a real problem for Spanish names. Normalize (strip accents,
// lowercase) and compare in JS instead. Patient counts for a single-doctor
// desktop app are small enough that fetching the full list is cheap.
function normalize(value: string): string {
  return value.normalize('NFD').replace(DIACRITICS, '').toLowerCase()
}

export const pacientesRepository = {
  async list(search?: string): Promise<Patient[]> {
    const patients = await prisma.patient.findMany({
      orderBy: { lastName: 'asc' },
    })

    if (!search) return patients

    const needle = normalize(search)
    return patients.filter(
      (p) =>
        normalize(p.firstName).includes(needle) ||
        normalize(p.lastName).includes(needle) ||
        (p.documentId && normalize(p.documentId).includes(needle)),
    )
  },

  async getById(id: string): Promise<Patient | null> {
    return prisma.patient.findUnique({ where: { id } })
  },

  async create(input: CreatePatientInput): Promise<Patient> {
    return prisma.patient.create({ data: input })
  },

  async update(id: string, input: UpdatePatientInput): Promise<Patient> {
    return prisma.patient.update({ where: { id }, data: input })
  },
}
