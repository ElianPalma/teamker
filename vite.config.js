import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Build normal (archivos separados y cacheables). El HTML de cada idioma lo genera scripts/prerender.js.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
