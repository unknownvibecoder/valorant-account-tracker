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
    port: 5173,
    host: true,
    proxy: {
      // Mọi request bắt đầu bằng /api sẽ tự động chuyển tiếp sang Backend Node.js
      '/api': {
        target: 'http://localhost:5000', // ⚠️ Đổi cổng 5000 thành cổng Backend của bạn nếu khác
        changeOrigin: true,
        secure: false,
      },
    },
  },
});