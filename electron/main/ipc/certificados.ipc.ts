import { IpcChannels } from '../../shared/ipc-channels.js'
import {
  certificadosService,
  type CreateCertificateServiceInput,
} from '../modules/certificados/certificados.service.js'

// See electron/main/db/client.ts for why this is a bare `require` call.
const { ipcMain } = require('electron') as typeof import('electron')

export function registerCertificadosIpc(): void {
  ipcMain.handle(
    IpcChannels.certificados.listByPatient,
    (_event, patientId: string) =>
      certificadosService.listByPatientId(patientId),
  )
  ipcMain.handle(
    IpcChannels.certificados.create,
    (_event, input: CreateCertificateServiceInput) =>
      certificadosService.create(input),
  )
}
