import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
  host: true,
  allowedHosts: [
    "cataphracted-uncorruptedly-ethyl.ngrok-free.dev",
    "unmenially-dextrorotatory-micah.ngrok-free.dev",
    "ngrok-free.dev",
    "*.ngrok-free.dev",
    "ngrok.io",
    "*.ngrok.io"
  ],
},
})
