import { IpcChannels } from '../../shared/ipc-channels.js'
import { adjuntosService } from '../modules/adjuntos/adjuntos.service.js'

// See electron/main/db/client.ts for why this is a bare `require` call.
const { ipcMain } = require('electron') as typeof import('electron')

export function registerAdjuntosIpc(): void {
  ipcMain.handle(
    IpcChannels.adjuntos.listByPatient,
    (_event, patientId: string) => adjuntosService.listByPatientId(patientId),
  )
  ipcMain.handle(IpcChannels.adjuntos.addFile, (_event, patientId: string) =>
    adjuntosService.addFile(patientId),
  )
  ipcMain.handle(IpcChannels.adjuntos.open, (_event, id: string) =>
    adjuntosService.open(id),
  )
  ipcMain.handle(IpcChannels.adjuntos.delete, (_event, id: string) =>
    adjuntosService.delete(id),
  )
}
