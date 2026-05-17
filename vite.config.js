import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/SISR_Review/',
  plugins: [react()],
});
