import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/piston': {
        target: 'http://localhost:2000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/piston/, ''),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/analytics'],
          'vendor-icons': ['lucide-react'],
          'vendor-xyflow': ['@xyflow/react'],
          'vendor-docs': ['docx', 'mammoth', 'pdfjs-dist'],
          'vendor-monaco': ['@monaco-editor/react'],
          'vendor-marked': ['marked'],
        },
      },
    },
  },
});
