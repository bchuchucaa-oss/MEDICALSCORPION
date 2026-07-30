import { IpcChannels } from '../../shared/ipc-channels.js'
import {
  consultaService,
  type CreateConsultationInput,
} from '../modules/consulta/consulta.service.js'

// See electron/main/db/client.ts for why this is a bare `require` call.
const { ipcMain } = require('electron') as typeof import('electron')

export function registerConsultaIpc(): void {
  ipcMain.handle(
    IpcChannels.consulta.listByPatient,
    (_event, patientId: string) => consultaService.listByPatientId(patientId),
  )
  ipcMain.handle(
    IpcChannels.consulta.create,
    (_event, input: CreateConsultationInput) => consultaService.create(input),
  )
}
