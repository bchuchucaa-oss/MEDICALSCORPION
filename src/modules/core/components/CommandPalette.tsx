import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Patient } from '@prisma/client'
import { MODULES, IMPLEMENTED_MODULES, type ModuleKey } from '../../../shared/lib/modules'
import { normalizeForSearch } from '../../../shared/lib/text'
import { usePatients } from '../../pacientes/hooks/usePatients'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  onNavigateModule: (key: ModuleKey) => void
  onOpenPatient: (patientId: string) => void
}

type Result =
  | { type: 'module'; key: ModuleKey; label: string }
  | { type: 'patient'; patient: Patient }

// The spec's "búsqueda tipo Google" rule: Cmd/Ctrl+K from anywhere jumps
// straight to a module or a patient, no mouse required.
export function CommandPalette({
  open,
  onClose,
  onNavigateModule,
  onOpenPatient,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const trimmed = query.trim()
  const { data: patients = [] } = usePatients(trimmed, open && trimmed.length > 0)

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      // Let the portal mount before focusing.
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  const results = useMemo<Result[]>(() => {
    const moduleResults: Result[] = MODULES.filter(
      (m) =>
        IMPLEMENTED_MODULES.has(m.key) &&
        (trimmed === '' || normalizeForSearch(m.label).includes(normalizeForSearch(trimmed))),
    ).map((m) => ({ type: 'module', key: m.key, label: m.label }))

    const patientResults: Result[] =
      trimmed === ''
        ? []
        : patients.map((patient) => ({ type: 'patient', patient }))

    return [...moduleResults, ...patientResults]
  }, [trimmed, patients])

  function selectResult(result: Result) {
    if (result.type === 'module') onNavigateModule(result.key)
    else onOpenPatient(result.patient.id)
    onClose()
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      onClose()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const result = results[selectedIndex]
      if (result) selectResult(result)
    }
  }

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-lg border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedIndex(0)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Buscar un paciente o ir a un módulo…"
          className="w-full border-b border-slate-200 bg-transparent px-4 py-3 text-sm outline-none dark:border-slate-800"
        />
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-2 py-4 text-center text-sm text-slate-400">
              {trimmed ? 'Sin resultados' : 'Escribe para buscar…'}
            </p>
          ) : (
            results.map((result, index) => {
              const key = result.type === 'module' ? result.key : result.patient.id
              const label =
                result.type === 'module'
                  ? result.label
                  : `${result.patient.lastName}, ${result.patient.firstName}`
              return (
                <button
                  key={key}
                  type="button"
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => selectResult(result)}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${
                    index === selectedIndex
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs opacity-60">
                    {result.type === 'module' ? '↳' : '👤'}
                  </span>
                  {label}
                  {result.type === 'patient' && result.patient.documentId && (
                    <span className="ml-auto text-xs opacity-60">
                      {result.patient.documentId}
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
