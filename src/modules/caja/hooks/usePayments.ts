import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PaymentInput } from '../schemas/payment.schema'

export type PaymentWithReceipt = Awaited<
  ReturnType<typeof window.mosa.caja.listForDay>
>[number]

export function usePayments(date: Date) {
  const dayKey = date.toDateString()
  return useQuery({
    queryKey: ['caja', 'day', dayKey],
    queryFn: () => window.mosa.caja.listForDay(date),
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: PaymentInput & { paidAt: Date }) =>
      window.mosa.caja.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caja'] })
    },
  })
}
