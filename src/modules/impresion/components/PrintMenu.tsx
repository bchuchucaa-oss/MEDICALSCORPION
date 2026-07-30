import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FORMAT_LABELS, FORMAT_OPTIONS, type PrintFormat } from '../types'

interface PrintMenuProps {
  buildHtml: (format: PrintFormat) => string
  fileNamePrefix: string
}

export function PrintMenu({ buildHtml, fileNamePrefix }: PrintMenuProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState<{ top: number; right: number } | null>(null)
  const [format, setFormat] = useState<PrintFormat>('letter')
  const [busy, setBusy] = useState<'print' | 'pdf' | null>(null)
  const [error, setError] = useState<string | null>(null)

  function openMenu() {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return
    setPosition({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
  }

  function closeMenu() {
    setPosition(null)
  }

  async function handlePrint() {
    setBusy('print')
    setError(null)
    try {
      await window.mosa.impresion.print(buildHtml(format), format)
      closeMenu()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo imprimir')
    } finally {
      setBusy(null)
    }
  }

  async function handleExportPdf() {
    setBusy('pdf')
    setError(null)
    try {
      const filePath = await window.mosa.impresion.exportPdf(
        buildHtml(format),
        format,
        `${fileNamePrefix}.pdf`,
      )
      if (filePath) closeMenu()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo exportar el PDF')
    } finally {
      setBusy(null)
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (position ? closeMenu() : openMenu())}
        className="rounded px-2 py-1 text-xs text-slate-500 underline hover:text-slate-700 dark:text-slate-400"
      >
        🖨 Imprimir
      </button>

      {position &&
        createPortal(
          <>
            <div className="fixed inset-0 z-40" onClick={closeMenu} />
            <div
              style={{ top: position.top, right: position.right }}
              className="fixed z-50 w-56 rounded-md border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900"
            >
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Formato
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as PrintFormat)}
                className="mb-3 w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                {FORMAT_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {FORMAT_LABELS[f]}
                  </option>
                ))}
              </select>

              {error && (
                <p className="mb-2 text-xs text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  disabled={busy !== null}
                  className="flex-1 rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
                >
                  {busy === 'print' ? 'Imprimiendo…' : 'Imprimir'}
                </button>
                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={busy !== null}
                  className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {busy === 'pdf' ? 'Guardando…' : 'PDF'}
                </button>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  )
}
