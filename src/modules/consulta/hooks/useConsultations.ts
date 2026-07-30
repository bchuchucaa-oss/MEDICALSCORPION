import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ConsultationInput } from '../schemas/consultation.schema'

export type ConsultationWithDiagnoses = Awaited<
  ReturnType<typeof window.mosa.consulta.listByPatient>
>[number]

export function useConsultations(patientId: string) {
  return useQuery({
    queryKey: ['consulta', patientId],
    queryFn: () => window.mosa.consulta.listByPatient(patientId),
  })
}

export function useCreateConsultation(patientId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ConsultationInput) =>
      window.mosa.consulta.create({ patientId, ...input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consulta', patientId] })
    },
  })
}
