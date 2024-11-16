import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// vite.config.js


export default defineConfig({
  esbuild: {
    jsx: 'react', // enables JSX parsing in .js files
    loader: {
      '.js': 'jsx'  // Treat .js files as JSX
    },
    plugins: [react()]
  }
});


