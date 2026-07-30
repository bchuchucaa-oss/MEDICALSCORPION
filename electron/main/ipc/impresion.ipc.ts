import { IpcChannels } from '../../shared/ipc-channels.js'
import { printService } from '../modules/impresion/print.service.js'
import type { PrintFormat } from '../modules/impresion/formats.js'

// See electron/main/db/client.ts for why this is a bare `require` call.
const { ipcMain } = require('electron') as typeof import('electron')

export function registerImpresionIpc(): void {
  ipcMain.handle(
    IpcChannels.impresion.print,
    (_event, html: string, format: PrintFormat) =>
      printService.printHtml(html, format),
  )
  ipcMain.handle(
    IpcChannels.impresion.exportPdf,
    (_event, html: string, format: PrintFormat, defaultFileName: string) =>
      printService.exportPdf(html, format, defaultFileName),
  )
}
