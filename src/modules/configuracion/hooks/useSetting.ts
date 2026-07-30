import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useSetting(key: string) {
  return useQuery({
    queryKey: ['configuracion', 'setting', key],
    queryFn: () => window.mosa.configuracion.getSetting(key),
  })
}

export function useUpdateSetting(key: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (value: string) => window.mosa.configuracion.setSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracion', 'setting', key] })
    },
  })
}
