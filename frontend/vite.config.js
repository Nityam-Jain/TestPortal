import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL, // ✅ Use full URL here
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'), // Optional
        },
        '/uploads': {
          target: env.VITE_API_BASE_URL, // ✅ Must also be full URL
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
};
