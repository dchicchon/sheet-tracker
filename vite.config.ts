import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { crx } from '@crxjs/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import manifest from './manifest.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), crx({ manifest }), tailwindcss()],
});
