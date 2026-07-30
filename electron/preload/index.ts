import type {
  Attachment,
  Certificate,
  Doctor,
  MedicalRecord,
  Patient,
} from '@prisma/client'
import { IpcChannels } from '../shared/ipc-channels.js'
import type { PingResult } from '../main/modules/core/core.service.js'
import type {
  CreatePatientInput,
  UpdatePatientInput,
} from '../main/modules/pacientes/pacientes.repository.js'
import type {
  AppointmentWithPatient,
  CreateAppointmentInput,
  UpdateAppointmentInput as UpdateAppointmentPayload,
} from '../main/modules/agenda/agenda.service.js'
import type { MedicalRecordInput } from '../main/modules/historia-clinica/historiaClinica.service.js'
import type {
  ConsultationWithDiagnoses,
  CreateConsultationInput,
} from '../main/modules/consulta/consulta.service.js'
import type {
  CreatePrescriptionInput,
  PrescriptionWithItems,
} from '../main/modules/recetas/recetas.service.js'
import type {
  PrescriptionTemplateWithItems,
  TemplateItemInput,
} from '../main/modules/recetas/prescriptionTemplates.service.js'
import type {
  CreatePaymentInput,
  PaymentWithReceipt,
} from '../main/modules/caja/caja.service.js'
import type { CreateCertificateServiceInput } from '../main/modules/certificados/certificados.service.js'
import type { DoctorProfileInput } from '../main/modules/configuracion/configuracion.service.js'
import type { BackupInfo } from '../main/modules/configuracion/backup.service.js'
import type { ReportComparison } from '../main/modules/reportes/reportes.service.js'
import type { PrintFormat } from '../main/modules/impresion/formats.js'

// See electron/main/db/client.ts for why this is a bare `require` call.
const { contextBridge, ipcRenderer } = require('electron') as typeof import('electron')

// This is the only bridge between the renderer and the main process.
// The renderer never gets direct Node/IPC access — it only sees the
// typed methods exposed here, one per module.
const api = {
  core: {
    ping: (): Promise<PingResult> => ipcRenderer.invoke(IpcChannels.core.ping),
    factoryReset: (token: string): Promise<void> =>
      ipcRenderer.invoke(IpcChannels.core.factoryReset, token),
  },
  pacientes: {
    list: (search?: string): Promise<Patient[]> =>
      ipcRenderer.invoke(IpcChannels.pacientes.list, search),
    getById: (id: string): Promise<Patient | null> =>
      ipcRenderer.invoke(IpcChannels.pacientes.getById, id),
    create: (input: CreatePatientInput): Promise<Patient> =>
      ipcRenderer.invoke(IpcChannels.pacientes.create, input),
    update: (id: string, input: UpdatePatientInput): Promise<Patient> =>
      ipcRenderer.invoke(IpcChannels.pacientes.update, id, input),
  },
  agenda: {
    listForDay: (date: Date): Promise<AppointmentWithPatient[]> =>
      ipcRenderer.invoke(IpcChannels.agenda.listForDay, date.toISOString()),
    create: (input: CreateAppointmentInput): Promise<AppointmentWithPatient> =>
      ipcRenderer.invoke(IpcChannels.agenda.create, input),
    update: (
      id: string,
      input: UpdateAppointmentPayload,
    ): Promise<AppointmentWithPatient> =>
      ipcRenderer.invoke(IpcChannels.agenda.update, id, input),
  },
  historiaClinica: {
    getByPatient: (patientId: string): Promise<MedicalRecord> =>
      ipcRenderer.invoke(IpcChannels.historiaClinica.getByPatient, patientId),
    update: (
      patientId: string,
      input: MedicalRecordInput,
    ): Promise<MedicalRecord> =>
      ipcRenderer.invoke(IpcChannels.historiaClinica.update, patientId, input),
  },
  consulta: {
    listByPatient: (patientId: string): Promise<ConsultationWithDiagnoses[]> =>
      ipcRenderer.invoke(IpcChannels.consulta.listByPatient, patientId),
    create: (
      input: CreateConsultationInput,
    ): Promise<ConsultationWithDiagnoses> =>
      ipcRenderer.invoke(IpcChannels.consulta.create, input),
  },
  recetas: {
    listByPatient: (patientId: string): Promise<PrescriptionWithItems[]> =>
      ipcRenderer.invoke(IpcChannels.recetas.listByPatient, patientId),
    create: (
      input: CreatePrescriptionInput,
    ): Promise<PrescriptionWithItems> =>
      ipcRenderer.invoke(IpcChannels.recetas.create, input),
    listTemplates: (): Promise<PrescriptionTemplateWithItems[]> =>
      ipcRenderer.invoke(IpcChannels.recetas.listTemplates),
    createTemplate: (
      name: string,
      items: TemplateItemInput[],
    ): Promise<PrescriptionTemplateWithItems> =>
      ipcRenderer.invoke(IpcChannels.recetas.createTemplate, name, items),
    deleteTemplate: (id: string): Promise<void> =>
      ipcRenderer.invoke(IpcChannels.recetas.deleteTemplate, id),
  },
  caja: {
    listForDay: (date: Date): Promise<PaymentWithReceipt[]> =>
      ipcRenderer.invoke(IpcChannels.caja.listForDay, date.toISOString()),
    create: (input: CreatePaymentInput): Promise<PaymentWithReceipt> =>
      ipcRenderer.invoke(IpcChannels.caja.create, input),
  },
  certificados: {
    listByPatient: (patientId: string): Promise<Certificate[]> =>
      ipcRenderer.invoke(IpcChannels.certificados.listByPatient, patientId),
    create: (input: CreateCertificateServiceInput): Promise<Certificate> =>
      ipcRenderer.invoke(IpcChannels.certificados.create, input),
  },
  configuracion: {
    getDoctorProfile: (): Promise<Doctor> =>
      ipcRenderer.invoke(IpcChannels.configuracion.getDoctorProfile),
    updateDoctorProfile: (input: DoctorProfileInput): Promise<Doctor> =>
      ipcRenderer.invoke(IpcChannels.configuracion.updateDoctorProfile, input),
    listBackups: (): Promise<BackupInfo[]> =>
      ipcRenderer.invoke(IpcChannels.configuracion.listBackups),
    createBackup: (): Promise<BackupInfo> =>
      ipcRenderer.invoke(IpcChannels.configuracion.createBackup),
    getSetting: (key: string): Promise<string | null> =>
      ipcRenderer.invoke(IpcChannels.configuracion.getSetting, key),
    setSetting: (key: string, value: string): Promise<void> =>
      ipcRenderer.invoke(IpcChannels.configuracion.setSetting, key, value),
  },
  reportes: {
    getSummary: (from: Date, to: Date): Promise<ReportComparison> =>
      ipcRenderer.invoke(
        IpcChannels.reportes.getSummary,
        from.toISOString(),
        to.toISOString(),
      ),
  },
  impresion: {
    print: (html: string, format: PrintFormat): Promise<void> =>
      ipcRenderer.invoke(IpcChannels.impresion.print, html, format),
    exportPdf: (
      html: string,
      format: PrintFormat,
      defaultFileName: string,
    ): Promise<string | null> =>
      ipcRenderer.invoke(
        IpcChannels.impresion.exportPdf,
        html,
        format,
        defaultFileName,
      ),
  },
  adjuntos: {
    listByPatient: (patientId: string): Promise<Attachment[]> =>
      ipcRenderer.invoke(IpcChannels.adjuntos.listByPatient, patientId),
    addFile: (patientId: string): Promise<Attachment | null> =>
      ipcRenderer.invoke(IpcChannels.adjuntos.addFile, patientId),
    open: (id: string): Promise<void> =>
      ipcRenderer.invoke(IpcChannels.adjuntos.open, id),
    delete: (id: string): Promise<void> =>
      ipcRenderer.invoke(IpcChannels.adjuntos.delete, id),
  },
}

export type MosaApi = typeof api

contextBridge.exposeInMainWorld('mosa', api)
