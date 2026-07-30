import fs from 'node:fs'
import path from 'node:path'
import { resolveDatabasePath } from './client.js'

const { app } = require('electron') as typeof import('electron')

// A fresh install has no database at all — Prisma can't create tables on
// its own (that needs the migration engine, which we don't ship). Instead
// we seed the userData path with a pre-migrated empty copy on first launch.
// See scripts/build-template-db.mjs for how template.db is produced.
function resolveTemplateDbPath(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'template.db')
    : path.join(__dirname, '../../prisma/template.db')
}

export function ensureDatabaseFile(): void {
  const dbPath = resolveDatabasePath()
  if (fs.existsSync(dbPath)) return

  fs.mkdirSync(path.dirname(dbPath), { recursive: true })
  fs.copyFileSync(resolveTemplateDbPath(), dbPath)
}
