import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useBackups() {
  return useQuery({
    queryKey: ['configuracion', 'backups'],
    queryFn: () => window.mosa.configuracion.listBackups(),
  })
}

export function useCreateBackup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => window.mosa.configuracion.createBackup(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracion', 'backups'] })
    },
  })
}
