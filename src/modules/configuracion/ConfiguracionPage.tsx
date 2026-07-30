import { DoctorProfileForm } from './components/DoctorProfileForm'
import { BillingSettingsForm } from './components/BillingSettingsForm'
import { BackupsPanel } from './components/BackupsPanel'

export function ConfiguracionPage() {
  return (
    <div className="flex-1 space-y-8 overflow-y-auto p-6">
      <DoctorProfileForm />
      <BillingSettingsForm />
      <BackupsPanel />
    </div>
  )
}
