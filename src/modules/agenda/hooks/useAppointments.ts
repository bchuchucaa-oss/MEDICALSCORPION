import { useQuery } from '@tanstack/react-query'

export type AppointmentWithPatient = Awaited<
  ReturnType<typeof window.mosa.agenda.listForDay>
>[number]

export function useAppointments(date: Date) {
  const dayKey = date.toDateString()
  return useQuery({
    queryKey: ['agenda', 'day', dayKey],
    queryFn: () => window.mosa.agenda.listForDay(date),
  })
}
