import type { Payment, PaymentMethod, Patient, Receipt } from '@prisma/client'
import { prisma } from '../../db/client.js'

export type PaymentWithReceipt = Payment & {
  receipt: Receipt | null
  patient: Patient
}

export interface CreatePaymentInput {
  patientId: string
  amount: number
  method: PaymentMethod
  concept?: string
  // Explicit so a payment logged while viewing a past/future day in the
  // Caja calendar is dated to that day, not to the instant it was saved.
  paidAt: Date
}

export const cajaRepository = {
  async listForRange(from: Date, to: Date): Promise<PaymentWithReceipt[]> {
    return prisma.payment.findMany({
      where: { paidAt: { gte: from, lt: to } },
      include: { receipt: true, patient: true },
      orderBy: { paidAt: 'asc' },
    })
  },

  async create(input: CreatePaymentInput): Promise<PaymentWithReceipt> {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({ data: input })
      const receiptCount = await tx.receipt.count()
      const number = `R-${String(receiptCount + 1).padStart(6, '0')}`
      const receipt = await tx.receipt.create({
        data: { paymentId: payment.id, number },
      })
      const patient = await tx.patient.findUniqueOrThrow({
        where: { id: input.patientId },
      })
      return { ...payment, receipt, patient }
    })
  },
}
