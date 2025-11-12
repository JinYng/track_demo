import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    sourcemap: true,
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-core': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'mui-icons': ['@mui/icons-material'],
          'jbrowse': ['@jbrowse/core', '@jbrowse/react-linear-genome-view2'],
          'i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
    // Increase chunk size warning limit for JBrowse
    chunkSizeWarningLimit: 1000,
  },
  worker: {
    format: 'es',
  },
  server: {
    host: '0.0.0.0', // 允许外部访问
    port: 5173,
    hmr: {
      overlay: true, // 显示错误覆盖层
      clientPort: 5173, // WSL2需要指定客户端端口
      port: 5173,
    },
    watch: {
      usePolling: true, // WSL2环境需要轮询
      interval: 500, // 更频繁的轮询
      binaryInterval: 1000,
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
    fs: {
      strict: false,
    },
  },
})
