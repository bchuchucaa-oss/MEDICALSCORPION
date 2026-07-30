// Builds prisma/template.db: an empty SQLite database with every
// migration applied. electron-builder bundles it as a resource, and the
// packaged app copies it into place on a doctor's very first launch —
// see electron/main/db/bootstrap.ts. Rebuilding from scratch each time
// (rather than hand-maintaining the file) guarantees it always matches
// the current prisma/migrations folder exactly.
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const templatePath = path.join(root, 'prisma', 'template.db')

for (const suffix of ['', '-journal', '-wal', '-shm']) {
  fs.rmSync(templatePath + suffix, { force: true })
}

execSync('pnpm exec prisma migrate deploy', {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: `file:${templatePath}` },
})

console.log(`Template database built at ${path.relative(root, templatePath)}`)
