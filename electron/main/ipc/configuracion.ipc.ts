import { IpcChannels } from '../../shared/ipc-channels.js'
import {
  configuracionService,
  type DoctorProfileInput,
} from '../modules/configuracion/configuracion.service.js'
import { backupService } from '../modules/configuracion/backup.service.js'

// See electron/main/db/client.ts for why this is a bare `require` call.
const { ipcMain } = require('electron') as typeof import('electron')

export function registerConfiguracionIpc(): void {
  ipcMain.handle(IpcChannels.configuracion.getDoctorProfile, () =>
    configuracionService.getDoctorProfile(),
  )
  ipcMain.handle(
    IpcChannels.configuracion.updateDoctorProfile,
    (_event, input: DoctorProfileInput) =>
      configuracionService.updateDoctorProfile(input),
  )
  ipcMain.handle(IpcChannels.configuracion.listBackups, () =>
    backupService.list(),
  )
  ipcMain.handle(IpcChannels.configuracion.createBackup, () =>
    backupService.create(),
  )
  ipcMain.handle(IpcChannels.configuracion.getSetting, (_event, key: string) =>
    configuracionService.getSetting(key),
  )
  ipcMain.handle(
    IpcChannels.configuracion.setSetting,
    (_event, key: string, value: string) =>
      configuracionService.setSetting(key, value),
  )
}
