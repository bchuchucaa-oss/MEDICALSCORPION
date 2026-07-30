import { IpcChannels } from '../../shared/ipc-channels.js'
import {
  agendaService,
  type CreateAppointmentInput,
  type UpdateAppointmentInput,
} from '../modules/agenda/agenda.service.js'

// See electron/main/db/client.ts for why this is a bare `require` call.
const { ipcMain } = require('electron') as typeof import('electron')

export function registerAgendaIpc(): void {
  ipcMain.handle(
    IpcChannels.agenda.listForDay,
    (_event, isoDate: string) => agendaService.listForDay(new Date(isoDate)),
  )
  ipcMain.handle(
    IpcChannels.agenda.create,
    (_event, input: CreateAppointmentInput) => agendaService.create(input),
  )
  ipcMain.handle(
    IpcChannels.agenda.update,
    (_event, id: string, input: UpdateAppointmentInput) =>
      agendaService.update(id, input),
  )
}
