import { useMutation } from '@tanstack/react-query'

export function useFactoryReset() {
  return useMutation({
    mutationFn: (token: string) => window.mosa.core.factoryReset(token),
  })
}
