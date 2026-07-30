import { prisma } from '../../db/client.js'

// Repository layer: the only place in the app allowed to talk to the
// Prisma client directly. Services depend on this, never on `prisma`.
export const coreRepository = {
  async countSettings(): Promise<number> {
    return prisma.settings.count()
  },
}
