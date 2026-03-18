import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
    // Keep relative URLs for both hosted and file:// output.
    base: './',
    build: {
        outDir: mode === 'file' ? 'dist-file' : 'dist',
    },
}))
