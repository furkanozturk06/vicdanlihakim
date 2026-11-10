import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

export default defineConfig({
    // Shown on the main menu, so players can tell which version they are reporting about
    define: {
        __APP_VERSION__: JSON.stringify(version),
    },
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist'
    }
});
