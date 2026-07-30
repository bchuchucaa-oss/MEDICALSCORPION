import { useQuery } from '@tanstack/react-query'

export function usePatient(id: string | null) {
  return useQuery({
    queryKey: ['pacientes', 'detail', id],
    queryFn: () => window.mosa.pacientes.getById(id as string),
    enabled: id !== null,
  })
}
