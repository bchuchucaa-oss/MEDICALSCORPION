import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PrescriptionInput } from '../schemas/prescription.schema'

export type PrescriptionWithItems = Awaited<
  ReturnType<typeof window.mosa.recetas.listByPatient>
>[number]

export function usePrescriptions(patientId: string) {
  return useQuery({
    queryKey: ['recetas', patientId],
    queryFn: () => window.mosa.recetas.listByPatient(patientId),
  })
}

export function useCreatePrescription(patientId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      consultationId,
      ...input
    }: PrescriptionInput & { consultationId: string }) =>
      window.mosa.recetas.create({ consultationId, ...input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recetas', patientId] })
    },
  })
}
