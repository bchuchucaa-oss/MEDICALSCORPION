import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { MedicalRecordInput } from '../schemas/medicalRecord.schema'

export function useMedicalRecord(patientId: string) {
  return useQuery({
    queryKey: ['historiaClinica', patientId],
    queryFn: () => window.mosa.historiaClinica.getByPatient(patientId),
  })
}

export function useUpdateMedicalRecord(patientId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: MedicalRecordInput) =>
      window.mosa.historiaClinica.update(patientId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['historiaClinica', patientId],
      })
    },
  })
}
