import { useEffect } from 'react'

// Lets a slide-over/modal close on Escape — the spec's "navegación
// completa por teclado" rule — without every panel wiring its own
// `keydown` listener.
export function useEscapeKey(onEscape: () => void, enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onEscape()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, onEscape])
}
