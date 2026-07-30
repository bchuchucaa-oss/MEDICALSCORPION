import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CertificateInput } from '../schemas/certificate.schema'

export function useCertificates(patientId: string) {
  return useQuery({
    queryKey: ['certificados', patientId],
    queryFn: () => window.mosa.certificados.listByPatient(patientId),
  })
}

export function useCreateCertificate(patientId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CertificateInput) =>
      window.mosa.certificados.create({ patientId, ...input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificados', patientId] })
    },
  })
}
