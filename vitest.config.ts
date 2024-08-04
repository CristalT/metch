import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      reporters: 'verbose',
      setupFiles: ['./vitest.setup.ts'],
      coverage: {
        reporter: ['html'],
      },
    },
  }),
)
