import fs from 'node:fs/promises'
import path from 'node:path'
import type { Attachment } from '@prisma/client'
import { adjuntosRepository } from './adjuntos.repository.js'

// See electron/main/db/client.ts for why this is a bare `require` call.
const { app, dialog, shell } = require('electron') as typeof import('electron')

function patientStorageDir(patientId: string): string {
  return path.join(app.getPath('userData'), 'storage', patientId)
}

export const adjuntosService = {
  async listByPatientId(patientId: string): Promise<Attachment[]> {
    return adjuntosRepository.listByPatientId(patientId)
  },

  // Opens the native "choose file" dialog, copies the chosen file into this
  // patient's storage folder, and stores only the reference in SQLite —
  // per the spec: "Guardar documentos en carpetas y almacenar solo
  // referencias en SQLite."
  async addFile(patientId: string): Promise<Attachment | null> {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Adjuntar documento',
      properties: ['openFile'],
    })
    if (canceled || filePaths.length === 0) return null

    const sourcePath = filePaths[0]
    const fileName = path.basename(sourcePath)
    const dir = patientStorageDir(patientId)
    await fs.mkdir(dir, { recursive: true })

    const destFileName = `${Date.now()}-${fileName}`
    const destPath = path.join(dir, destFileName)
    await fs.copyFile(sourcePath, destPath)

    const stats = await fs.stat(destPath)
    const mimeType = MIME_BY_EXTENSION[path.extname(fileName).toLowerCase()]

    return adjuntosRepository.create({
      patientId,
      fileName,
      filePath: destPath,
      mimeType,
      sizeBytes: stats.size,
    })
  },

  async open(id: string): Promise<void> {
    const attachment = await adjuntosRepository.getById(id)
    if (!attachment) throw new Error('Adjunto no encontrado')
    const result = await shell.openPath(attachment.filePath)
    if (result) throw new Error(`No se pudo abrir el archivo: ${result}`)
  },

  async delete(id: string): Promise<void> {
    const attachment = await adjuntosRepository.delete(id)
    await fs.unlink(attachment.filePath).catch(() => {})
  },
}

const MIME_BY_EXTENSION: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}
