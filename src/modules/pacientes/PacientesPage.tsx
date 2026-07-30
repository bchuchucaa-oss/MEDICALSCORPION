import { useState } from 'react'
import type { Patient } from '@prisma/client'
import { usePatients } from './hooks/usePatients'
import { useCreatePatient, useUpdatePatient } from './hooks/usePatientMutations'
import { PatientList } from './components/PatientList'
import { PatientForm } from './components/PatientForm'
import { useEscapeKey } from '../../shared/lib/useEscapeKey'

type PanelState = { mode: 'create' } | { mode: 'edit'; patient: Patient } | null

interface PacientesPageProps {
  onOpenWorkspace: (patientId: string) => void
  notice?: string
}

export function PacientesPage({ onOpenWorkspace, notice }: PacientesPageProps) {
  const [search, setSearch] = useState('')
  const [panel, setPanel] = useState<PanelState>(null)

  const { data: patients = [], isLoading } = usePatients(search)
  const createPatient = useCreatePatient()
  const updatePatient = useUpdatePatient(panel?.mode === 'edit' ? panel.patient.id : '')

  const activeMutation = panel?.mode === 'edit' ? updatePatient : createPatient

  useEscapeKey(() => setPanel(null), panel !== null)

  return (
    <div className="relative flex h-full flex-1 overflow-hidden">
      <div className="flex flex-1 flex-col">
        {notice && (
          <div className="border-b border-blue-200 bg-blue-50 px-6 py-2 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
            {notice}
          </div>
        )}
        <PatientList
          patients={patients}
          isLoading={isLoading}
          search={search}
          onSearchChange={setSearch}
          onOpenWorkspace={(patient) => onOpenWorkspace(patient.id)}
          onEdit={(patient) => setPanel({ mode: 'edit', patient })}
          onCreate={() => setPanel({ mode: 'create' })}
        />
      </div>

      {panel && (
        <>
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setPanel(null)}
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-md border-l border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <div className="flex h-14 items-center border-b border-slate-200 px-4 font-semibold dark:border-slate-800">
              {panel.mode === 'create' ? 'Nuevo paciente' : 'Editar paciente'}
            </div>
            <div className="h-[calc(100%-3.5rem)]">
              <PatientForm
                patient={panel.mode === 'edit' ? panel.patient : null}
                isSubmitting={activeMutation.isPending}
                serverError={
                  activeMutation.isError
                    ? activeMutation.error.message
                    : null
                }
                onCancel={() => setPanel(null)}
                onSubmit={(values) => {
                  activeMutation.mutate(values, {
                    onSuccess: () => setPanel(null),
                  })
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
