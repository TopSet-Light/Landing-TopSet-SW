import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Keep non-source artifacts out of the file watcher. chokidar crashes with
  // EBUSY when it watches docs screenshots or the temporary files that atomic
  // file writes create inside src/ (*.tmpdir / *.tmp).
  server: {
    watch: {
      ignored: ['**/docs/**', '**/*.tmp', '**/*.tmpdir/**', '**/.*.tmpdir/**'],
    },
  },
  test: { environment: 'jsdom', clearMocks: true },
});
