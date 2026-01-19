import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    // Allow requests from the specified Cloudflare tunnel host - frontend url
     allowedHosts: [ 'heaven-louise-motor-eval.trycloudflare.com' ]
  },
  plugins: [react()],
})
