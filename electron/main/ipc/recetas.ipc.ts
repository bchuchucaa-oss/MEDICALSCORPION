import { IpcChannels } from '../../shared/ipc-channels.js'
import {
  recetasService,
  type CreatePrescriptionInput,
} from '../modules/recetas/recetas.service.js'
import {
  prescriptionTemplatesService,
  type TemplateItemInput,
} from '../modules/recetas/prescriptionTemplates.service.js'

// See electron/main/db/client.ts for why this is a bare `require` call.
const { ipcMain } = require('electron') as typeof import('electron')

export function registerRecetasIpc(): void {
  ipcMain.handle(
    IpcChannels.recetas.listByPatient,
    (_event, patientId: string) => recetasService.listByPatientId(patientId),
  )
  ipcMain.handle(
    IpcChannels.recetas.create,
    (_event, input: CreatePrescriptionInput) => recetasService.create(input),
  )
  ipcMain.handle(IpcChannels.recetas.listTemplates, () =>
    prescriptionTemplatesService.list(),
  )
  ipcMain.handle(
    IpcChannels.recetas.createTemplate,
    (_event, name: string, items: TemplateItemInput[]) =>
      prescriptionTemplatesService.create(name, items),
  )
  ipcMain.handle(
    IpcChannels.recetas.deleteTemplate,
    (_event, id: string) => prescriptionTemplatesService.delete(id),
  )
}
