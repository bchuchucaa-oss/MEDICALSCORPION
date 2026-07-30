import { reportesRepository, type ReportSummary } from './reportes.repository.js'

export type { ReportSummary }

export interface ReportComparison {
  current: ReportSummary
  previous: ReportSummary
}

export const reportesService = {
  async getSummary(from: Date, to: Date): Promise<ReportComparison> {
    const rangeMs = to.getTime() - from.getTime()
    const previousTo = from
    const previousFrom = new Date(from.getTime() - rangeMs)

    const [current, previous] = await Promise.all([
      reportesRepository.getSummary(from, to),
      reportesRepository.getSummary(previousFrom, previousTo),
    ])

    return { current, previous }
  },
}
