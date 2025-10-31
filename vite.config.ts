import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), tailwindcss()],
  server: {
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', 'af2267f81e1b.ngrok-free.app'],    
  },
})
