import { useEffect, useState } from 'react'
import { useSetting, useUpdateSetting } from '../hooks/useSetting'
import { SETTINGS_KEYS } from '../../../shared/lib/settingsKeys'

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
const labelClass =
  'mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400'

// Lets Caja's "Nuevo cobro" form offer a one-click fill instead of typing
// the same consultation fee every time.
export function BillingSettingsForm() {
  const { data: stored } = useSetting(SETTINGS_KEYS.defaultConsultationAmount)
  const updateSetting = useUpdateSetting(SETTINGS_KEYS.defaultConsultationAmount)
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (stored != null) setAmount(stored)
  }, [stored])

  function save() {
    if (amount.trim() === '') return
    updateSetting.mutate(amount)
  }

  return (
    <div className="max-w-md space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Facturación
        </h2>
        <span className="text-xs text-slate-400">
          {updateSetting.isPending
            ? 'Guardando…'
            : updateSetting.isSuccess
              ? 'Guardado'
              : ''}
        </span>
      </div>

      <div>
        <label className={labelClass}>Monto de consulta por defecto</label>
        <input
          type="number"
          min={0}
          step="0.01"
          className={inputClass}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onBlur={save}
        />
      </div>
    </div>
  )
}
