import { useState } from 'react'
import { useFactoryReset } from '../hooks/useFactoryReset'

const CONFIRMATION_PHRASE = 'ELIMINAR TODO'
const TAPS_TO_REVEAL = 7

// Deliberately not a normal settings section — a doctor should never
// notice this exists. Tapping the version label 7 times (same trick as
// Android's hidden developer options) reveals a panel gated by a
// maintenance token only the developer knows (see
// electron/main/modules/core/factoryReset.ts) plus a typed confirmation
// phrase, so a stray click can't wipe a real client's data.
export function FactoryResetPanel() {
  const [taps, setTaps] = useState(0)
  const [token, setToken] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const factoryReset = useFactoryReset()

  if (taps < TAPS_TO_REVEAL) {
    return (
      <button
        type="button"
        onClick={() => setTaps((t) => t + 1)}
        className="w-full cursor-default text-center text-xs text-slate-300 dark:text-slate-700"
      >
        Consultorio360 v0.0.0
      </button>
    )
  }

  const canSubmit =
    token.trim().length > 0 && confirmation === CONFIRMATION_PHRASE

  return (
    <div className="max-w-md space-y-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
      <h2 className="text-sm font-semibold text-red-700 dark:text-red-300">
        Restablecer de fábrica (solo soporte técnico)
      </h2>
      <p className="text-xs text-red-600 dark:text-red-400">
        Borra permanentemente todos los pacientes, citas, historias
        clínicas, recetas, certificados, archivos adjuntos y copias de
        seguridad guardadas en este equipo. La aplicación se reiniciará
        vacía, como una instalación nueva. Esta acción no se puede
        deshacer.
      </p>

      <label className="block text-xs font-medium text-red-700 dark:text-red-300">
        Código de mantenimiento
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="mt-1 w-full rounded border border-red-300 bg-white px-2 py-1 text-sm dark:border-red-800 dark:bg-slate-900"
        />
      </label>

      <label className="block text-xs font-medium text-red-700 dark:text-red-300">
        Escriba "{CONFIRMATION_PHRASE}" para confirmar
        <input
          type="text"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          className="mt-1 w-full rounded border border-red-300 bg-white px-2 py-1 text-sm dark:border-red-800 dark:bg-slate-900"
        />
      </label>

      {factoryReset.isError && (
        <p className="text-xs text-red-700 dark:text-red-300">
          {factoryReset.error.message}
        </p>
      )}

      <button
        type="button"
        disabled={!canSubmit || factoryReset.isPending}
        onClick={() => factoryReset.mutate(token)}
        className="w-full rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {factoryReset.isPending ? 'Borrando…' : 'Borrar todo y reiniciar'}
      </button>
    </div>
  )
}
