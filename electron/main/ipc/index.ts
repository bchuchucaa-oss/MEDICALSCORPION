import { registerCoreIpc } from './core.ipc.js'
import { registerPacientesIpc } from './pacientes.ipc.js'
import { registerAgendaIpc } from './agenda.ipc.js'
import { registerHistoriaClinicaIpc } from './historiaClinica.ipc.js'
import { registerConsultaIpc } from './consulta.ipc.js'
import { registerRecetasIpc } from './recetas.ipc.js'
import { registerCajaIpc } from './caja.ipc.js'
import { registerCertificadosIpc } from './certificados.ipc.js'
import { registerConfiguracionIpc } from './configuracion.ipc.js'
import { registerReportesIpc } from './reportes.ipc.js'
import { registerImpresionIpc } from './impresion.ipc.js'
import { registerAdjuntosIpc } from './adjuntos.ipc.js'

// All 10 MVP modules, plus the cross-cutting Impresión (printing) engine
// and Adjuntos (patient file attachments).
export function registerIpcHandlers(): void {
  registerCoreIpc()
  registerPacientesIpc()
  registerAgendaIpc()
  registerHistoriaClinicaIpc()
  registerConsultaIpc()
  registerRecetasIpc()
  registerCajaIpc()
  registerCertificadosIpc()
  registerConfiguracionIpc()
  registerReportesIpc()
  registerImpresionIpc()
  registerAdjuntosIpc()
}
