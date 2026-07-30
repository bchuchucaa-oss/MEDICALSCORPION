import { IpcChannels } from '../../shared/ipc-channels.js'
import { reportesService } from '../modules/reportes/reportes.service.js'

// See electron/main/db/client.ts for why this is a bare `require` call.
const { ipcMain } = require('electron') as typeof import('electron')

export function registerReportesIpc(): void {
  ipcMain.handle(
    IpcChannels.reportes.getSummary,
    (_event, fromIso: string, toIso: string) =>
      reportesService.getSummary(new Date(fromIso), new Date(toIso)),
  )
}
