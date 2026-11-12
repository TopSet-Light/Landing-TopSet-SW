import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // The Web3Forms key is public by design. Besides the usual VITE_ name, accept
  // it without the prefix (WEB3FORMS_ACCESS_KEY or ACCESS_KEY), which is how it
  // is stored in the hosting, and hand it to the app under the VITE_ name.
  const env = loadEnv(mode, process.cwd(), '');
  const web3formsKey =
    env.VITE_WEB3FORMS_ACCESS_KEY || env.WEB3FORMS_ACCESS_KEY || env.ACCESS_KEY || '';

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_WEB3FORMS_ACCESS_KEY': JSON.stringify(web3formsKey),
    },
    // Keep non-source artifacts out of the file watcher. chokidar crashes with
    // EBUSY when it watches docs screenshots or the temporary files that atomic
    // file writes create inside src/ (*.tmpdir / *.tmp).
    server: {
      watch: {
        ignored: ['**/docs/**', '**/*.tmp', '**/*.tmpdir/**', '**/.*.tmpdir/**'],
      },
    },
    test: { environment: 'jsdom', clearMocks: true },
  };
});
