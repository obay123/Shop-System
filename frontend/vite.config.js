import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // Plugins should be at the top level
  esbuild: {
    jsx: 'transform', // Enables JSX parsing and transformation
  },
  server: {
    proxy: {
      // Proxy API calls to the backend server
      "/api": {
        target: "http://localhost:5000", // Backend server URL
        changeOrigin: true,
        secure: false, // Use this if the backend doesn't use HTTPS
      },
    },
  },
});
