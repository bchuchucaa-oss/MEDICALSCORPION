import { useState } from 'react'
import type { Patient } from '@prisma/client'
import { usePatients } from '../hooks/usePatients'
import { useCreatePatient } from '../hooks/usePatientMutations'

interface PatientPickerProps {
  value: Patient | null
  onChange: (patient: Patient) => void
}

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900'

export function PatientPicker({ value, onChange }: PatientPickerProps) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [creatingNew, setCreatingNew] = useState(false)
  const [newFirstName, setNewFirstName] = useState('')
  const [newLastName, setNewLastName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const { data: results = [] } = usePatients(search)
  const createPatient = useCreatePatient()

  function startCreatingNew() {
    // The search box is almost always "Apellido Nombre" or "Nombre
    // Apellido" by the time a doctor gives up looking — hand it straight
    // to the quick form instead of making them retype it.
    const [first = '', ...rest] = search.trim().split(/\s+/)
    setNewFirstName(first)
    setNewLastName(rest.join(' '))
    setCreatingNew(true)
  }

  function cancelCreatingNew() {
    setCreatingNew(false)
    setNewFirstName('')
    setNewLastName('')
    setNewPhone('')
  }

  function handleCreateNew(event: React.FormEvent) {
    event.preventDefault()
    if (!newFirstName.trim() || !newLastName.trim()) return

    createPatient.mutate(
      {
        firstName: newFirstName.trim(),
        lastName: newLastName.trim(),
        documentId: null,
        birthDate: null,
        sex: null,
        insuranceType: null,
        phone: newPhone.trim() || undefined,
      },
      {
        onSuccess: (patient) => {
          onChange(patient)
          setSearch('')
          setOpen(false)
          cancelCreatingNew()
        },
      },
    )
  }

  if (value && !open) {
    return (
      <div className="flex items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900">
        <span>
          {value.lastName}, {value.firstName}
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs text-slate-500 underline hover:text-slate-700 dark:text-slate-400"
        >
          Cambiar
        </button>
      </div>
    )
  }

  if (creatingNew) {
    return (
      <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Nuevo paciente
        </p>
        {createPatient.isError && (
          <p className="text-xs text-red-600 dark:text-red-400">
            {createPatient.error.message}
          </p>
        )}
        <div className="grid grid-cols-2 gap-2">
          <input
            autoFocus
            className={inputClass}
            placeholder="Nombre *"
            value={newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Apellido *"
            value={newLastName}
            onChange={(e) => setNewLastName(e.target.value)}
          />
        </div>
        <input
          className={inputClass}
          placeholder="Teléfono (opcional)"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={cancelCreatingNew}
            className="rounded-md px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleCreateNew}
            disabled={
              createPatient.isPending || !newFirstName.trim() || !newLastName.trim()
            }
            className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
          >
            {createPatient.isPending ? 'Creando…' : 'Crear y usar'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <input
        autoFocus
        type="search"
        placeholder="Buscar paciente por nombre o documento…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={inputClass}
      />
      {search && (
        <div className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {results.length === 0 && (
            <div className="px-3 py-2 text-sm text-slate-400">
              Sin resultados
            </div>
          )}
          {results.map((patient) => (
            <button
              key={patient.id}
              type="button"
              onClick={() => {
                onChange(patient)
                setSearch('')
                setOpen(false)
              }}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {patient.lastName}, {patient.firstName}
              {patient.documentId && (
                <span className="ml-2 text-slate-400">
                  {patient.documentId}
                </span>
              )}
            </button>
          ))}
          <button
            type="button"
            onClick={startCreatingNew}
            className="block w-full border-t border-slate-200 px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            + Crear paciente nuevo
          </button>
        </div>
      )}
    </div>
  )
}
