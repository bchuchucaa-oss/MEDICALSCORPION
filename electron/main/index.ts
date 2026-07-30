import path from 'node:path'
import type { BrowserWindow as BrowserWindowType } from 'electron'
import { registerIpcHandlers } from './ipc/index.js'
import { ensureDefaultDoctor } from './modules/core/bootstrap.js'
import { ensureDatabaseFile } from './db/bootstrap.js'

// This build is emitted as CommonJS (see vite.config.ts), so `require` and
// `__dirname` are real Node globals here — no `createRequire`/
// `import.meta.url` dance needed (that combo triggers Rollup's
// browser-oriented `import.meta.url` shim, which breaks in Electron's
// preload/renderer context; see electron/main/db/client.ts).
const { app, BrowserWindow } = require('electron') as typeof import('electron')

// Populated by vite-plugin-electron at build time.
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

let mainWindow: BrowserWindowType | null = null

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      // Sandboxed preload scripts only get a curated Node subset, which
      // breaks `createRequire('electron')`. We need full Node access in
      // preload to reliably pull in the real 'electron' API.
      sandbox: false,
    },
  })

  mainWindow.webContents.on(
    'preload-error',
    (_event, preloadPath, error) => {
      console.error(`[preload-error] ${preloadPath}:`, error)
    },
  )

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(async () => {
  try {
    ensureDatabaseFile()
    await ensureDefaultDoctor()
    registerIpcHandlers()
    createMainWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
  } catch (error) {
    // Without this, a startup failure (e.g. a fresh install whose database
    // isn't ready yet) becomes an unhandled rejection that's easy to miss —
    // the window never appears and there's no clue why.
    console.error('[startup] failed to initialize app:', error)
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
