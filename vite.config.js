import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const buildTime = new Date().toISOString()

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  define: {
    'process.env.VITE_BUILD_TIME': JSON.stringify(buildTime)
  }
})
