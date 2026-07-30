import { useEffect, useState } from 'react'
import { useUiStore } from './shared/lib/uiStore'
import { MODULES, IMPLEMENTED_MODULES, type ModuleKey } from './shared/lib/modules'
import { SystemStatus } from './modules/core/components/SystemStatus'
import { CommandPalette } from './modules/core/components/CommandPalette'
import { PacientesPage } from './modules/pacientes/PacientesPage'
import { PatientWorkspacePage } from './modules/pacientes/PatientWorkspacePage'
import { AgendaPage } from './modules/agenda/AgendaPage'
import { CajaPage } from './modules/caja/CajaPage'
import { ConfiguracionPage } from './modules/configuracion/ConfiguracionPage'
import { ReportesPage } from './modules/reportes/ReportesPage'

// Historia Clínica, Consulta, Recetas and Certificados are patient-scoped —
// there's no standalone list, only the view inside a patient's workspace —
// so their sidebar entry redirects to Pacientes with a contextual notice
// instead of showing its own page.
const PATIENT_SCOPED_NOTICE: Partial<Record<ModuleKey, string>> = {
  'historia-clinica': 'Selecciona un paciente para ver su historia clínica.',
  consulta: 'Selecciona un paciente para ver o registrar una consulta.',
  recetas: 'Selecciona un paciente para ver o emitir una receta.',
  certificados: 'Selecciona un paciente para ver o emitir un certificado.',
}

function App() {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const [activeModule, setActiveModule] = useState<ModuleKey>('agenda')
  const [workspace, setWorkspace] = useState<{
    patientId: string
    // Presence of this key (not its content) is what triggers
    // auto-opening the consultation form — the appointment's `reason`
    // itself is very often empty/undefined.
    autoOpenConsulta?: { reason?: string }
    // Set when the workspace was opened via Agenda's "Iniciar consulta" —
    // lets the workspace offer a "Completar cita" button that reports
    // back to that same appointment, instead of making the doctor return
    // to Agenda just to mark it done.
    appointmentId?: string
  } | null>(null)
  const [paletteOpen, setPaletteOpen] = useState(false)

  const activeLabel = MODULES.find((m) => m.key === activeModule)?.label ?? ''

  function openWorkspace(patientId: string) {
    setWorkspace({ patientId })
  }

  function navigateModule(key: ModuleKey) {
    setWorkspace(null)
    setActiveModule(key)
  }

  // Cmd/Ctrl+K opens the global command palette from anywhere in the app —
  // the spec's "búsqueda tipo Google" rule.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <aside
        className={`flex flex-col border-r border-slate-200 bg-white transition-all dark:border-slate-800 dark:bg-slate-950 ${
          sidebarOpen ? 'w-60' : 'w-14'
        }`}
      >
        <div className="flex h-14 items-center justify-between px-4">
          {sidebarOpen && (
            <span className="font-semibold">Consultorio360</span>
          )}
          <button
            type="button"
            onClick={toggleSidebar}
            className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Alternar barra lateral"
          >
            ☰
          </button>
        </div>
        <div className="px-2 pb-2">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            🔍 {sidebarOpen && <span>Buscar…</span>}
            {sidebarOpen && (
              <span className="ml-auto text-xs opacity-60">Ctrl+K</span>
            )}
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-2">
          {MODULES.map((mod) => {
            const implemented = IMPLEMENTED_MODULES.has(mod.key)
            const active = mod.key === activeModule
            return (
              <button
                key={mod.key}
                type="button"
                disabled={!implemented}
                onClick={() => navigateModule(mod.key)}
                className={`w-full truncate rounded px-2 py-1.5 text-left text-sm transition-colors ${
                  active
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : implemented
                      ? 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      : 'cursor-not-allowed text-slate-300 dark:text-slate-700'
                }`}
              >
                {sidebarOpen ? mod.label : mod.label.charAt(0)}
              </button>
            )
          })}
        </nav>
      </aside>

      <main className="flex flex-1 flex-col overflow-hidden">
        {workspace ? (
          <PatientWorkspacePage
            patientId={workspace.patientId}
            autoOpenConsulta={workspace.autoOpenConsulta}
            appointmentId={workspace.appointmentId}
            onBack={() => setWorkspace(null)}
          />
        ) : (
          <>
            <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-800">
              <h1 className="text-lg font-semibold">{activeLabel}</h1>
              <SystemStatus />
            </header>

            {activeModule === 'agenda' ? (
              <AgendaPage
                onStartConsultation={(patientId, appointmentId, reason) =>
                  setWorkspace({
                    patientId,
                    appointmentId,
                    autoOpenConsulta: { reason },
                  })
                }
              />
            ) : activeModule === 'pacientes' ? (
              <PacientesPage onOpenWorkspace={openWorkspace} />
            ) : activeModule === 'caja' ? (
              <CajaPage />
            ) : activeModule === 'configuracion' ? (
              <ConfiguracionPage />
            ) : activeModule === 'reportes' ? (
              <ReportesPage />
            ) : PATIENT_SCOPED_NOTICE[activeModule] ? (
              <PacientesPage
                onOpenWorkspace={openWorkspace}
                notice={PATIENT_SCOPED_NOTICE[activeModule]}
              />
            ) : (
              <section className="flex flex-1 items-center justify-center p-6">
                <p className="max-w-md text-center text-slate-500 dark:text-slate-400">
                  Este módulo todavía no está implementado.
                </p>
              </section>
            )}
          </>
        )}
      </main>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigateModule={navigateModule}
        onOpenPatient={openWorkspace}
      />
    </div>
  )
}

export default App
