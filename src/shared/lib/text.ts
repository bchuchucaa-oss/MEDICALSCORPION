const DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g')

// Strips accents and lowercases so "clinica" matches "Clínica" — mirrors
// electron/main/modules/pacientes/pacientes.repository.ts's normalize(),
// duplicated here since main and renderer don't share a module boundary.
export function normalizeForSearch(value: string): string {
  return value.normalize('NFD').replace(DIACRITICS, '').toLowerCase()
}
