export const MODULES = [
  { key: 'agenda', label: 'Agenda' },
  { key: 'pacientes', label: 'Pacientes' },
  { key: 'historia-clinica', label: 'Historia Clínica' },
  { key: 'consulta', label: 'Consulta' },
  { key: 'recetas', label: 'Recetas' },
  { key: 'certificados', label: 'Certificados' },
  { key: 'caja', label: 'Caja' },
  { key: 'reportes', label: 'Reportes' },
  { key: 'configuracion', label: 'Configuración' },
] as const

export type ModuleKey = (typeof MODULES)[number]['key']

export const IMPLEMENTED_MODULES: ReadonlySet<ModuleKey> = new Set([
  'agenda',
  'pacientes',
  'caja',
  'configuracion',
  'reportes',
  'historia-clinica',
  'consulta',
  'recetas',
  'certificados',
])
