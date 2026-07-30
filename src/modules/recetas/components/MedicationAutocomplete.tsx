import { useState } from 'react'
import { COMMON_MEDICATIONS, type MedicationPreset } from '../data/commonMedications'

interface MedicationAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelectPreset: (preset: MedicationPreset) => void
  className: string
}

const DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g')

function normalize(value: string): string {
  return value.normalize('NFD').replace(DIACRITICS, '').toLowerCase()
}

export function MedicationAutocomplete({
  value,
  onChange,
  onSelectPreset,
  className,
}: MedicationAutocompleteProps) {
  const [open, setOpen] = useState(false)

  const suggestions =
    value.trim().length === 0
      ? []
      : COMMON_MEDICATIONS.filter((m) =>
          normalize(m.drugName).includes(normalize(value)),
        ).slice(0, 8)

  return (
    <div className="relative">
      <input
        className={className}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {suggestions.map((preset) => (
            <button
              key={preset.drugName}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onSelectPreset(preset)
                setOpen(false)
              }}
              className="block w-full px-2 py-1.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {preset.drugName}
              <span className="ml-2 text-xs text-slate-400">
                {preset.dosage}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
