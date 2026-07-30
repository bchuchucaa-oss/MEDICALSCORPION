import type { Patient } from '@prisma/client'

interface PatientListProps {
  patients: Patient[]
  isLoading: boolean
  search: string
  onSearchChange: (value: string) => void
  onOpenWorkspace: (patient: Patient) => void
  onEdit: (patient: Patient) => void
  onCreate: () => void
}

export function PatientList({
  patients,
  isLoading,
  search,
  onSearchChange,
  onOpenWorkspace,
  onEdit,
  onCreate,
}: PatientListProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden p-6">
      <div className="mb-4 flex items-center gap-3">
        <input
          type="search"
          placeholder="Buscar por nombre o documento…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full max-w-sm rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
        />
        <button
          type="button"
          onClick={onCreate}
          className="ml-auto rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
        >
          + Nuevo paciente
        </button>
      </div>

      <div className="flex-1 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Cédula</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  Cargando…
                </td>
              </tr>
            )}
            {!isLoading && patients.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  No hay pacientes registrados todavía.
                </td>
              </tr>
            )}
            {patients.map((patient) => (
              <tr
                key={patient.id}
                onClick={() => onOpenWorkspace(patient)}
                className="cursor-pointer border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
              >
                <td className="px-4 py-2">
                  {patient.lastName}, {patient.firstName}
                </td>
                <td className="px-4 py-2 text-slate-500 dark:text-slate-400">
                  {patient.documentId ?? '—'}
                </td>
                <td className="px-4 py-2 text-slate-500 dark:text-slate-400">
                  {patient.phone ?? '—'}
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(patient)
                    }}
                    className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
