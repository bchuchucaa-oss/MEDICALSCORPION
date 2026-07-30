import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useAttachments(patientId: string) {
  return useQuery({
    queryKey: ['adjuntos', patientId],
    queryFn: () => window.mosa.adjuntos.listByPatient(patientId),
  })
}

export function useAddAttachment(patientId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => window.mosa.adjuntos.addFile(patientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adjuntos', patientId] })
    },
  })
}

export function useOpenAttachment() {
  return useMutation({
    mutationFn: (id: string) => window.mosa.adjuntos.open(id),
  })
}

export function useDeleteAttachment(patientId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => window.mosa.adjuntos.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adjuntos', patientId] })
    },
  })
}
