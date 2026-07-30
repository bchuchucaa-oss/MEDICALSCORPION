import { IpcChannels } from '../../shared/ipc-channels.js'
import {
  pacientesService,
  type CreatePatientInput,
  type UpdatePatientInput,
} from '../modules/pacientes/pacientes.service.js'

// See electron/main/db/client.ts for why this is a bare `require` call.
const { ipcMain } = require('electron') as typeof import('electron')

export function registerPacientesIpc(): void {
  ipcMain.handle(IpcChannels.pacientes.list, (_event, search?: string) =>
    pacientesService.list(search),
  )
  ipcMain.handle(IpcChannels.pacientes.getById, (_event, id: string) =>
    pacientesService.getById(id),
  )
  ipcMain.handle(
    IpcChannels.pacientes.create,
    (_event, input: CreatePatientInput) => pacientesService.create(input),
  )
  ipcMain.handle(
    IpcChannels.pacientes.update,
    (_event, id: string, input: UpdatePatientInput) =>
      pacientesService.update(id, input),
  )
}
