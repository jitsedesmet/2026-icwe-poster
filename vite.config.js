import { defineConfig } from 'vite'

export default defineConfig({
    // set base in production
    base: process.env.NODE_ENV === 'production' ? '/WebPoster/' : '/',
})
