import { IpcChannels } from '../../shared/ipc-channels.js'
import {
  historiaClinicaService,
  type MedicalRecordInput,
} from '../modules/historia-clinica/historiaClinica.service.js'

// See electron/main/db/client.ts for why this is a bare `require` call.
const { ipcMain } = require('electron') as typeof import('electron')

export function registerHistoriaClinicaIpc(): void {
  ipcMain.handle(
    IpcChannels.historiaClinica.getByPatient,
    (_event, patientId: string) =>
      historiaClinicaService.getOrCreateByPatientId(patientId),
  )
  ipcMain.handle(
    IpcChannels.historiaClinica.update,
    (_event, patientId: string, input: MedicalRecordInput) =>
      historiaClinicaService.update(patientId, input),
  )
}
