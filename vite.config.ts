import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    // Required for React Testing Library
    environment: 'jsdom',

    // Explicit test discovery (VERY IMPORTANT)
    include: [
      'tests/**/*.test.ts',
      'src/sanity.test.ts',
      // Only real tasks (task-*) should have runnable tests
      'src/tasks/task-*/tests/**/*.test.ts',
      'src/tasks/task-*/tests/**/*.test.tsx',
    ],

    // Setup for jest-dom matchers
    setupFiles: './src/setupTests.ts',

    // Clear, predictable output
    reporters: 'default',

    // Disable watch for CI-like behavior
    watch: false,
  },
});
