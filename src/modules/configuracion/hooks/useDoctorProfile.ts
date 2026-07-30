import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { DoctorProfileInput } from '../schemas/doctorProfile.schema'

export function useDoctorProfile() {
  return useQuery({
    queryKey: ['configuracion', 'doctorProfile'],
    queryFn: () => window.mosa.configuracion.getDoctorProfile(),
  })
}

export function useUpdateDoctorProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: DoctorProfileInput) =>
      window.mosa.configuracion.updateDoctorProfile(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['configuracion', 'doctorProfile'],
      })
    },
  })
}
