import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({ include: ['src'] })],
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
