import { IpcChannels } from '../../shared/ipc-channels.js'
import { coreService } from '../modules/core/core.service.js'
import { factoryReset } from '../modules/core/factoryReset.js'

// See electron/main/db/client.ts for why this is a bare `require` call.
const { ipcMain } = require('electron') as typeof import('electron')

export function registerCoreIpc(): void {
  ipcMain.handle(IpcChannels.core.ping, () => coreService.ping())
  ipcMain.handle(IpcChannels.core.factoryReset, (_event, token: string) =>
    factoryReset(token),
  )
}
