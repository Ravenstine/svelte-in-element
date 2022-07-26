import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  root: './test/dummy',
  plugins: [svelte()],
  server: {
    port: 1337,
  }
});
