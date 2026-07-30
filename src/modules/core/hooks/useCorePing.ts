import { useQuery } from '@tanstack/react-query'

// Renderer-side "service client": thin wrapper around the IPC bridge that
// hooks/components use instead of calling `window.mosa` directly.
export function useCorePing() {
  return useQuery({
    queryKey: ['core', 'ping'],
    queryFn: () => window.mosa.core.ping(),
  })
}
