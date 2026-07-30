export type PrintFormat = 'letter' | 'half-letter' | 'thermal-58' | 'thermal-80'

const MM_PER_INCH = 25.4

// Thermal receipts are a continuous roll; there's no real "page height" to
// validate against, so we just pick a generous one long enough for a
// prescription/certificate/receipt to never paginate.
const THERMAL_HEIGHT_MM = 200

// `webContents.print()`'s custom pageSize wants width/height in *microns*;
// `webContents.printToPDF()`'s wants them in *inches*. Same physical sizes,
// two different units — keep both derived from one mm source of truth.
const SIZES_MM: Record<PrintFormat, { width: number; height: number } | null> = {
  letter: null, // built-in 'Letter' page size covers this
  'half-letter': { width: 215.9, height: 139.7 },
  'thermal-58': { width: 58, height: THERMAL_HEIGHT_MM },
  'thermal-80': { width: 80, height: THERMAL_HEIGHT_MM },
}

export function printPageSize(
  format: PrintFormat,
): 'Letter' | { width: number; height: number } {
  const mm = SIZES_MM[format]
  if (!mm) return 'Letter'
  return { width: Math.round(mm.width * 1000), height: Math.round(mm.height * 1000) }
}

export function pdfPageSize(
  format: PrintFormat,
): 'Letter' | { width: number; height: number } {
  const mm = SIZES_MM[format]
  if (!mm) return 'Letter'
  return { width: mm.width / MM_PER_INCH, height: mm.height / MM_PER_INCH }
}
