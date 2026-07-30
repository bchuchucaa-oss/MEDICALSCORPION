import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PrescriptionItemInput } from '../schemas/prescription.schema'

export type PrescriptionTemplateWithItems = Awaited<
  ReturnType<typeof window.mosa.recetas.listTemplates>
>[number]

export function usePrescriptionTemplates() {
  return useQuery({
    queryKey: ['recetas', 'templates'],
    queryFn: () => window.mosa.recetas.listTemplates(),
  })
}

export function useCreatePrescriptionTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      name,
      items,
    }: {
      name: string
      items: PrescriptionItemInput[]
    }) => window.mosa.recetas.createTemplate(name, items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recetas', 'templates'] })
    },
  })
}

export function useDeletePrescriptionTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => window.mosa.recetas.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recetas', 'templates'] })
    },
  })
}
