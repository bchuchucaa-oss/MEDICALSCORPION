import { useEffect, useState } from 'react'
import {
  useDoctorProfile,
  useUpdateDoctorProfile,
} from '../hooks/useDoctorProfile'
import type { DoctorProfileInput } from '../schemas/doctorProfile.schema'

const EMPTY: DoctorProfileInput = {
  fullName: '',
  specialty: '',
  licenseNumber: '',
}

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
const labelClass =
  'mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400'

export function DoctorProfileForm() {
  const { data: doctor, isLoading } = useDoctorProfile()
  const updateProfile = useUpdateDoctorProfile()
  const [values, setValues] = useState<DoctorProfileInput>(EMPTY)

  useEffect(() => {
    if (!doctor) return
    setValues({
      fullName: doctor.fullName,
      specialty: doctor.specialty ?? '',
      licenseNumber: doctor.licenseNumber ?? '',
    })
  }, [doctor])

  function setField(field: keyof DoctorProfileInput, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function save() {
    if (!values.fullName.trim()) return
    updateProfile.mutate(values)
  }

  if (isLoading) {
    return <p className="text-sm text-slate-400">Cargando…</p>
  }

  return (
    <div className="max-w-md space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Perfil del médico
        </h2>
        <span className="text-xs text-slate-400">
          {updateProfile.isPending
            ? 'Guardando…'
            : updateProfile.isSuccess
              ? 'Guardado'
              : ''}
        </span>
      </div>

      <div>
        <label className={labelClass}>Nombre completo *</label>
        <input
          className={inputClass}
          value={values.fullName}
          onChange={(e) => setField('fullName', e.target.value)}
          onBlur={save}
        />
      </div>

      <div>
        <label className={labelClass}>Especialidad</label>
        <input
          className={inputClass}
          value={values.specialty}
          onChange={(e) => setField('specialty', e.target.value)}
          onBlur={save}
        />
      </div>

      <div>
        <label className={labelClass}>Número de licencia / cédula</label>
        <input
          className={inputClass}
          value={values.licenseNumber}
          onChange={(e) => setField('licenseNumber', e.target.value)}
          onBlur={save}
        />
      </div>
    </div>
  )
}
