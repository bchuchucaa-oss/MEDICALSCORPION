import { prisma } from '../../db/client.js'

export interface ReportSummary {
  ingresos: number
  consultas: number
  citas: number
  recetas: number
  certificados: number
  pacientesNuevos: number
}

export const reportesRepository = {
  async getSummary(from: Date, to: Date): Promise<ReportSummary> {
    const [
      ingresosAgg,
      consultas,
      citas,
      recetas,
      certificados,
      pacientesNuevos,
    ] = await Promise.all([
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { paidAt: { gte: from, lt: to } },
      }),
      prisma.consultation.count({ where: { date: { gte: from, lt: to } } }),
      prisma.appointment.count({
        where: { scheduledAt: { gte: from, lt: to } },
      }),
      prisma.prescription.count({
        where: { issuedAt: { gte: from, lt: to } },
      }),
      prisma.certificate.count({ where: { issuedAt: { gte: from, lt: to } } }),
      prisma.patient.count({ where: { createdAt: { gte: from, lt: to } } }),
    ])

    return {
      ingresos: ingresosAgg._sum.amount ?? 0,
      consultas,
      citas,
      recetas,
      certificados,
      pacientesNuevos,
    }
  },
}
