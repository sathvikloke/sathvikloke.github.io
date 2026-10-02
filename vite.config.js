import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const page = (p) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [react()],
  // For a user site (username.github.io) keep this as '/'.
  // For a PROJECT repo, change to '/your-repo-name/'.
  base: '/',
  // One HTML entry per page so /music/ is a real URL that GitHub Pages serves
  // with a 200, not a hash route or a 404.html fallback.
  build: {
    rollupOptions: {
      input: { main: page('./index.html'), music: page('./music/index.html') },
    },
  },
})
