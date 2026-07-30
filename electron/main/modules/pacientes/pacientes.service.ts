import type { Patient } from '@prisma/client'
import {
  pacientesRepository,
  type CreatePatientInput,
  type UpdatePatientInput,
} from './pacientes.repository.js'

export type { CreatePatientInput, UpdatePatientInput }

// Duck-typed instead of `instanceof Prisma.PrismaClientKnownRequestError`
// so this file never needs a runtime import of '@prisma/client' — the
// generated client is loaded from a resourcesPath-relative location in
// packaged builds (see electron/main/db/client.ts), not the bundler's
// static module graph.
function rethrowFriendly(error: unknown): never {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === 'P2002'
  ) {
    throw new Error('Ya existe un paciente registrado con ese documento.')
  }
  throw error
}

export const pacientesService = {
  async list(search?: string): Promise<Patient[]> {
    return pacientesRepository.list(search)
  },

  async getById(id: string): Promise<Patient | null> {
    return pacientesRepository.getById(id)
  },

  async create(input: CreatePatientInput): Promise<Patient> {
    try {
      return await pacientesRepository.create(input)
    } catch (error) {
      rethrowFriendly(error)
    }
  },

  async update(id: string, input: UpdatePatientInput): Promise<Patient> {
    try {
      return await pacientesRepository.update(id, input)
    } catch (error) {
      rethrowFriendly(error)
    }
  },
}
