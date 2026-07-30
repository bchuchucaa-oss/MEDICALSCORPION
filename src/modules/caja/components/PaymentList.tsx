import type { PaymentWithReceipt } from '../hooks/usePayments'
import { useDoctorProfile } from '../../configuracion/hooks/useDoctorProfile'
import { PrintMenu } from '../../impresion/components/PrintMenu'
import { buildComprobanteHtml } from '../../impresion/templates'
import type { PrintFormat } from '../../impresion/types'

interface PaymentListProps {
  payments: PaymentWithReceipt[]
  isLoading: boolean
}

const METHOD_LABEL: Record<PaymentWithReceipt['method'], string> = {
  CASH: 'Efectivo',
  CARD: 'Tarjeta',
  TRANSFER: 'Transferencia',
  OTHER: 'Otro',
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('es', { minimumFractionDigits: 2 })
}

export function PaymentList({ payments, isLoading }: PaymentListProps) {
  const { data: doctor } = useDoctorProfile()
  const total = payments.reduce((sum, p) => sum + p.amount, 0)

  if (isLoading) {
    return <p className="p-6 text-slate-400">Cargando…</p>
  }

  if (payments.length === 0) {
    return (
      <p className="p-6 text-center text-slate-400">
        No hay cobros registrados para este día.
      </p>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-100 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2">Comprobante</th>
              <th className="px-4 py-2">Paciente</th>
              <th className="px-4 py-2">Concepto</th>
              <th className="px-4 py-2">Método</th>
              <th className="px-4 py-2 text-right">Monto</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr
                key={p.id}
                className="border-t border-slate-100 dark:border-slate-800"
              >
                <td className="px-4 py-2 text-slate-500 dark:text-slate-400">
                  {p.receipt?.number ?? '—'}
                </td>
                <td className="px-4 py-2">
                  {p.patient.lastName}, {p.patient.firstName}
                </td>
                <td className="px-4 py-2 text-slate-500 dark:text-slate-400">
                  {p.concept ?? '—'}
                </td>
                <td className="px-4 py-2 text-slate-500 dark:text-slate-400">
                  {METHOD_LABEL[p.method]}
                </td>
                <td className="px-4 py-2 text-right font-medium">
                  {formatCurrency(p.amount)}
                </td>
                <td className="px-4 py-2 text-right">
                  {doctor && p.receipt && (
                    <PrintMenu
                      fileNamePrefix={`comprobante-${p.receipt.number}`}
                      buildHtml={(format: PrintFormat) =>
                        buildComprobanteHtml(format, doctor, p.patient, {
                          receiptNumber: p.receipt!.number,
                          amount: p.amount,
                          method: p.method,
                          concept: p.concept,
                          paidAt: p.paidAt,
                        })
                      }
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end border-t border-slate-200 px-4 py-3 text-sm font-semibold dark:border-slate-800">
        Total del día: {formatCurrency(total)}
      </div>
    </div>
  )
}
