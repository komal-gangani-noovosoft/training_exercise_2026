import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 8080,
        strictPort: true,
        watch: {
            usePolling: true,
            interval: 100,
        },
        hmr: {
            clientPort: 8080,
        },
        proxy: {
            '/api': {
                target: 'http://backend-server:3000',
                changeOrigin: true,
                secure: false,
            }
        }
    }
})
