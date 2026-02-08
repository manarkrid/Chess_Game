import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['tests/e2e/**', 'node_modules/**'],
    reporters: ['default', 'html'],
    outputFile: './html/index.html'
  }
})