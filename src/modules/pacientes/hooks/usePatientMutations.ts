import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { PatientInput } from '../schemas/patient.schema'

export function useCreatePatient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: PatientInput) => window.mosa.pacientes.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes', 'list'] })
    },
  })
}

export function useUpdatePatient(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Partial<PatientInput>) =>
      window.mosa.pacientes.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['pacientes', 'detail', id] })
    },
  })
}
