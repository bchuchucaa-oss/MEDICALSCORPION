import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AppointmentInput } from '../schemas/appointment.schema'
import type { AppointmentStatus } from '@prisma/client'

export function useCreateAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: AppointmentInput) => window.mosa.agenda.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] })
    },
  })
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: {
      id: string
      scheduledAt?: Date
      durationMin?: number
      reason?: string
      notes?: string
      status?: AppointmentStatus
    }) => window.mosa.agenda.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] })
    },
  })
}
