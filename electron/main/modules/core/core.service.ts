import { coreRepository } from './core.repository.js'

export interface PingResult {
  ok: true
  timestamp: string
  settingsCount: number
}

// Service layer: business logic and orchestration live here, never in the
// IPC handler and never in a UI component.
export const coreService = {
  async ping(): Promise<PingResult> {
    const settingsCount = await coreRepository.countSettings()
    return { ok: true, timestamp: new Date().toISOString(), settingsCount }
  },
}
