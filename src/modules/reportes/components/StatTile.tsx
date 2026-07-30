interface StatTileProps {
  label: string
  value: number
  previousValue: number
  isCurrency?: boolean
}

function formatValue(value: number, isCurrency: boolean): string {
  return value.toLocaleString('es', {
    minimumFractionDigits: isCurrency ? 2 : 0,
    maximumFractionDigits: isCurrency ? 2 : 0,
  })
}

// Stat tile contract (label + value + delta), per the dataviz skill: a
// handful of headline numbers is a KPI row, not a chart.
export function StatTile({
  label,
  value,
  previousValue,
  isCurrency = false,
}: StatTileProps) {
  const delta =
    previousValue === 0
      ? value === 0
        ? 0
        : null // no previous baseline to compare against
      : ((value - previousValue) / previousValue) * 100

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {formatValue(value, isCurrency)}
      </p>
      {delta !== null && (
        <p
          className={`mt-1 text-xs font-medium ${
            delta > 0
              ? 'text-emerald-600 dark:text-emerald-400'
              : delta < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-slate-400'
          }`}
        >
          {delta > 0 ? '▲' : delta < 0 ? '▼' : '–'} {Math.abs(delta).toFixed(0)}%
          <span className="ml-1 font-normal text-slate-400">
            vs. período anterior
          </span>
        </p>
      )}
    </div>
  )
}
