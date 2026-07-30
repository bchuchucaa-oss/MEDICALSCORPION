// Shared IPC channel names between the main and renderer processes.
// Every module exposes its channels here so the preload bridge and the
// renderer service clients stay in sync with what the main process handles.

export const IpcChannels = {
  core: {
    ping: 'core:ping',
    factoryReset: 'core:factoryReset',
  },
  pacientes: {
    list: 'pacientes:list',
    getById: 'pacientes:getById',
    create: 'pacientes:create',
    update: 'pacientes:update',
  },
  agenda: {
    listForDay: 'agenda:listForDay',
    create: 'agenda:create',
    update: 'agenda:update',
  },
  historiaClinica: {
    getByPatient: 'historiaClinica:getByPatient',
    update: 'historiaClinica:update',
  },
  consulta: {
    listByPatient: 'consulta:listByPatient',
    create: 'consulta:create',
  },
  recetas: {
    listByPatient: 'recetas:listByPatient',
    create: 'recetas:create',
    listTemplates: 'recetas:listTemplates',
    createTemplate: 'recetas:createTemplate',
    deleteTemplate: 'recetas:deleteTemplate',
  },
  caja: {
    listForDay: 'caja:listForDay',
    create: 'caja:create',
  },
  certificados: {
    listByPatient: 'certificados:listByPatient',
    create: 'certificados:create',
  },
  configuracion: {
    getDoctorProfile: 'configuracion:getDoctorProfile',
    updateDoctorProfile: 'configuracion:updateDoctorProfile',
    listBackups: 'configuracion:listBackups',
    createBackup: 'configuracion:createBackup',
    getSetting: 'configuracion:getSetting',
    setSetting: 'configuracion:setSetting',
  },
  reportes: {
    getSummary: 'reportes:getSummary',
  },
  impresion: {
    print: 'impresion:print',
    exportPdf: 'impresion:exportPdf',
  },
  adjuntos: {
    listByPatient: 'adjuntos:listByPatient',
    addFile: 'adjuntos:addFile',
    open: 'adjuntos:open',
    delete: 'adjuntos:delete',
  },
} as const
