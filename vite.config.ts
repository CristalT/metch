import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'peach',
      fileName: 'peach',
    },
  },
  resolve: {
    alias: {
      peach: new URL('./src/', import.meta.url).pathname,
    },
  },
})
