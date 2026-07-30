import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/main/index.ts',
        vite: {
          build: {
            outDir: 'dist-electron/main',
            lib: {
              entry: 'electron/main/index.ts',
              formats: ['cjs'],
              fileName: () => '[name].cjs',
            },
            rollupOptions: {
              // The generated Prisma client ships a native query-engine
              // binary and isn't statically analyzable — never bundle it.
              external: [
                'electron',
                '@prisma/client',
                /[\\/]db[\\/]generated[\\/]/,
              ],
            },
          },
        },
      },
      preload: {
        input: 'electron/preload/index.ts',
        vite: {
          build: {
            outDir: 'dist-electron/preload',
            rollupOptions: {
              external: ['electron'],
              // The plugin's default preload build emits CJS (`require`)
              // but names the file `.mjs`, which Node always parses as
              // ESM regardless of content — force a matching `.cjs` name.
              output: {
                entryFileNames: '[name].cjs',
                chunkFileNames: '[name].cjs',
              },
            },
          },
        },
      },
      renderer: {},
    }),
  ],
})
