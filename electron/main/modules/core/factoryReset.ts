import fs from 'node:fs/promises'
import path from 'node:path'
import { prisma, resolveDatabasePath } from '../../db/client.js'

const { app } = require('electron') as typeof import('electron')

// Support-only escape hatch for when a machine is handed over to a client
// with leftover demo/test data on it. Deliberately not surfaced anywhere
// a doctor would stumble into it (see the hidden tap-7-times gate in
// Configuración) — this constant is the only thing standing between that
// hidden panel and a full wipe, so it's the one value to change if it
// ever needs rotating.
export const FACTORY_RESET_TOKEN = 'EJDM-S5Z5-MBWZ-UP2U'

export class InvalidResetTokenError extends Error {
  constructor() {
    super('Código incorrecto.')
  }
}

// Wipes the database, attachments, and local backups, then restarts the
// app so it re-runs the exact same first-run bootstrap a brand-new
// install goes through (see electron/main/db/bootstrap.ts) — rather than
// duplicating that logic here.
export async function factoryReset(token: string): Promise<void> {
  if (token !== FACTORY_RESET_TOKEN) {
    throw new InvalidResetTokenError()
  }

  await prisma.$disconnect()

  const dbPath = resolveDatabasePath()
  for (const suffix of ['', '-wal', '-shm', '-journal']) {
    await fs.rm(`${dbPath}${suffix}`, { force: true })
  }

  const userDataPath = app.getPath('userData')
  await fs.rm(path.join(userDataPath, 'storage'), {
    recursive: true,
    force: true,
  })
  await fs.rm(path.join(userDataPath, 'backups'), {
    recursive: true,
    force: true,
  })

  app.relaunch()
  app.exit(0)
}
