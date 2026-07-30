import { dayRange } from '../../shared/date-range.js'
import {
  cajaRepository,
  type CreatePaymentInput,
  type PaymentWithReceipt,
} from './caja.repository.js'

export type { PaymentWithReceipt, CreatePaymentInput }

export const cajaService = {
  async listForDay(date: Date): Promise<PaymentWithReceipt[]> {
    const { from, to } = dayRange(date)
    return cajaRepository.listForRange(from, to)
  },

  async create(input: CreatePaymentInput): Promise<PaymentWithReceipt> {
    return cajaRepository.create(input)
  },
}
