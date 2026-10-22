import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this repo from https://akjoc.github.io/Lumen-Grove/
// The deploy workflow builds with GITHUB_PAGES=true; local dev/builds stay at '/'.
const base = process.env.GITHUB_PAGES === 'true' ? '/Lumen-Grove/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
  server: { host: '0.0.0.0', port: 5173, allowedHosts: true },
  preview: { host: '0.0.0.0', port: 4173, allowedHosts: true },
  build: { chunkSizeWarningLimit: 2000 }
})
