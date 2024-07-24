import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      mula: new URL('./src/', import.meta.url).pathname,
    },
  },
})
