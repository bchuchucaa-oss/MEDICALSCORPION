import { useCallback, useEffect, useState } from 'react'

// Drop-in replacement for `useState` that mirrors the value to
// localStorage — so a long consultation/prescription/certificate note
// survives an accidental close of the panel or an app crash. Call the
// returned `clearDraft()` once the form actually submits successfully.
export function useDraftState<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? (JSON.parse(stored) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage full/unavailable — the draft is best-effort, never fatal.
    }
  }, [key, value])

  const clearDraft = useCallback(() => {
    localStorage.removeItem(key)
  }, [key])

  return [value, setValue, clearDraft]
}
