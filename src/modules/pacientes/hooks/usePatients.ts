import { useQuery } from '@tanstack/react-query'

export function usePatients(search: string, enabled = true) {
  return useQuery({
    queryKey: ['pacientes', 'list', search],
    queryFn: () => window.mosa.pacientes.list(search || undefined),
    enabled,
  })
}
