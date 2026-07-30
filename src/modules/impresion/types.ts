export type PrintFormat = 'letter' | 'half-letter' | 'thermal-58' | 'thermal-80'

export const FORMAT_LABELS: Record<PrintFormat, string> = {
  letter: 'Carta',
  'half-letter': 'Media hoja',
  'thermal-58': 'Térmica 58mm',
  'thermal-80': 'Térmica 80mm',
}

export const FORMAT_OPTIONS: PrintFormat[] = [
  'letter',
  'half-letter',
  'thermal-58',
  'thermal-80',
]
