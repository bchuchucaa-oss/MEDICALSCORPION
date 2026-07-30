import { IpcChannels } from '../../shared/ipc-channels.js'
import { coreService } from '../modules/core/core.service.js'

// See electron/main/db/client.ts for why this is a bare `require` call.
const { ipcMain } = require('electron') as typeof import('electron')

export function registerCoreIpc(): void {
  ipcMain.handle(IpcChannels.core.ping, () => coreService.ping())
}
