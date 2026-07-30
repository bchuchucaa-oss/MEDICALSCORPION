import { useQuery } from '@tanstack/react-query'

export function useReportSummary(from: Date, to: Date) {
  return useQuery({
    queryKey: ['reportes', from.toDateString(), to.toDateString()],
    queryFn: () => window.mosa.reportes.getSummary(from, to),
  })
}
