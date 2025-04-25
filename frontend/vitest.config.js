import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['@testing-library/jest-dom'],
    coverage: {
      enabled: true,
      reporter: ['text'],
      all: true,
      include: ['src/**/*.{js,ts,jsx,tsx}'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/public/**',
        '**/cypress/**',
        '**/*.test.{js,ts,jsx,tsx}',
      ],
    },
  },
});
