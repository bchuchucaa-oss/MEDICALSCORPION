import path from 'node:path'
import type { PrismaClient as PrismaClientType } from '@prisma/client'

// This build is emitted as CommonJS (see vite.config.ts), so `require` is
// a real Node global here. Using it directly — instead of routing through
// `createRequire(import.meta.url)` — avoids Rollup's browser-oriented
// `import.meta.url` shim, which resolves to bogus non-file URLs in the
// Electron preload/renderer context.
const { app } = require('electron') as typeof import('electron')

// electron-builder's dependency walker only bundles packages declared in
// a package.json "dependencies" field. `.prisma/client` (the generated
// client + native query engine) is reached by @prisma/client via a bare
// specifier (`require(".prisma/client/default")`), not a relative path,
// so it gets silently dropped from a packaged build unless copied in
// ourselves (see extraResources in electron-builder.yml). That bare
// specifier only resolves inside a directory literally named
// `node_modules` — Node walks up looking for exactly that name — which
// is why the extraResources destination is nested one level deeper than
// you'd expect. This has to be a runtime-computed require (not a static
// `import`) since the path depends on whether the app is packaged.
const prismaClientPath = app.isPackaged
  ? path.join(
      process.resourcesPath,
      'prisma-runtime',
      'node_modules',
      '@prisma',
      'client',
    )
  : '@prisma/client'
const { PrismaClient } = require(prismaClientPath) as {
  PrismaClient: typeof PrismaClientType
}

// The raw filesystem path to the SQLite file, reused by the backup
// service — kept separate from the `file:` URL Prisma wants.
export function resolveDatabasePath(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL.replace(/^file:/, '')
  }
  return path.join(app.getPath('userData'), 'mosa.db')
}

export const prisma = new PrismaClient({
  datasources: {
    db: { url: `file:${resolveDatabasePath()}` },
  },
})
