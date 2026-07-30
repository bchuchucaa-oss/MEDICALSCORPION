import type { Doctor } from '@prisma/client'
import { prisma } from '../../db/client.js'

// V1 is a single-doctor desktop app with no auth/user-management UI yet
// (see MOSA_Especificacion_Proyecto.md roadmap: multiusuario is V2). Every
// module that needs a `doctorId` (Agenda, Consulta, Recetas, Certificados)
// depends on this one row existing.
export async function ensureDefaultDoctor(): Promise<Doctor> {
  const existing = await prisma.doctor.findFirst()
  if (existing) return existing

  return prisma.doctor.create({
    data: {
      fullName: 'Doctor',
      user: {
        create: {
          email: 'doctor@local.mosa',
          passwordHash: 'unset',
        },
      },
    },
  })
}
