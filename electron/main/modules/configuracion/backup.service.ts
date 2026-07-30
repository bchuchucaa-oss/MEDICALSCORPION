import fs from 'node:fs/promises'
import path from 'node:path'
import { resolveDatabasePath } from '../../db/client.js'

const { app } = require('electron') as typeof import('electron')

export interface BackupInfo {
  fileName: string
  createdAt: string
  sizeBytes: number
}

function backupsDir(): string {
  return path.join(app.getPath('userData'), 'backups')
}

function timestamp(): string {
  return new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_')
    .slice(0, 19)
}

export const backupService = {
  async create(): Promise<BackupInfo> {
    const dir = backupsDir()
    await fs.mkdir(dir, { recursive: true })

    const dbPath = resolveDatabasePath()
    const fileName = `mosa-${timestamp()}.db`
    const destPath = path.join(dir, fileName)

    await fs.copyFile(dbPath, destPath)

    // Best-effort: WAL/SHM sidecar files may not exist (e.g. right after
    // a checkpoint), so a missing file here isn't an error.
    for (const suffix of ['-wal', '-shm']) {
      await fs
        .copyFile(`${dbPath}${suffix}`, `${destPath}${suffix}`)
        .catch(() => {})
    }

    const stats = await fs.stat(destPath)
    return { fileName, createdAt: stats.mtime.toISOString(), sizeBytes: stats.size }
  },

  async list(): Promise<BackupInfo[]> {
    const dir = backupsDir()
    const entries = await fs.readdir(dir).catch(() => [] as string[])

    const backups = await Promise.all(
      entries
        .filter((name) => name.endsWith('.db'))
        .map(async (fileName) => {
          const stats = await fs.stat(path.join(dir, fileName))
          return {
            fileName,
            createdAt: stats.mtime.toISOString(),
            sizeBytes: stats.size,
          }
        }),
    )

    return backups.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },
}
