export function dayRange(date: Date): { from: Date; to: Date } {
  const from = new Date(date)
  from.setHours(0, 0, 0, 0)
  const to = new Date(from)
  to.setDate(to.getDate() + 1)
  return { from, to }
}
