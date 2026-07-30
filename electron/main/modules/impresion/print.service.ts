import fs from 'node:fs/promises'
import { pdfPageSize, printPageSize, type PrintFormat } from './formats.js'

// See electron/main/db/client.ts for why this is a bare `require` call.
const { BrowserWindow, dialog, app } = require('electron') as typeof import('electron')

async function renderInHiddenWindow<T>(
  html: string,
  run: (win: InstanceType<typeof BrowserWindow>) => Promise<T>,
): Promise<T> {
  const win = new BrowserWindow({
    show: false,
    webPreferences: { sandbox: true },
  })

  try {
    await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
    return await run(win)
  } finally {
    win.close()
  }
}

export const printService = {
  async printHtml(html: string, format: PrintFormat): Promise<void> {
    await renderInHiddenWindow(html, (win) =>
      new Promise<void>((resolve, reject) => {
        win.webContents.print(
          { silent: false, pageSize: printPageSize(format), printBackground: true },
          (success, failureReason) => {
            if (success || failureReason === 'cancelled') resolve()
            else reject(new Error(failureReason))
          },
        )
      }),
    )
  },

  async exportPdf(
    html: string,
    format: PrintFormat,
    defaultFileName: string,
  ): Promise<string | null> {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Guardar PDF',
      defaultPath: `${app.getPath('documents')}/${defaultFileName}`,
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    })
    if (canceled || !filePath) return null

    const buffer = await renderInHiddenWindow(html, (win) =>
      win.webContents.printToPDF({
        pageSize: pdfPageSize(format),
        printBackground: true,
      }),
    )

    await fs.writeFile(filePath, buffer)
    return filePath
  },
}
