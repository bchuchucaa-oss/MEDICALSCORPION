import { IpcChannels } from '../../shared/ipc-channels.js'
import {
  cajaService,
  type CreatePaymentInput,
} from '../modules/caja/caja.service.js'

// See electron/main/db/client.ts for why this is a bare `require` call.
const { ipcMain } = require('electron') as typeof import('electron')

export function registerCajaIpc(): void {
  ipcMain.handle(IpcChannels.caja.listForDay, (_event, isoDate: string) =>
    cajaService.listForDay(new Date(isoDate)),
  )
  ipcMain.handle(
    IpcChannels.caja.create,
    (_event, input: CreatePaymentInput) => cajaService.create(input),
  )
}
