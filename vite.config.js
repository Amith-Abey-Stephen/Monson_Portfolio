import { defineConfig } from 'vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  appType: 'mpa',
  publicDir: 'public',
  server: {
    port: 3000,
    strictPort: false,
    open: false,
  },
  preview: {
    port: 4173,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    cssCodeSplit: false,
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2018',
    cssMinify: 'esbuild',
    rollupOptions: {
      input: {
        main: 'index.html',
        edit: 'edit/index.html',
        notfound: '404.html',
      },
      output: {
        manualChunks: undefined,
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(css)$/.test(name ?? '')) return 'assets/css/[name]-[hash][extname]'
          if (/\.(png|jpe?g|svg|webp|avif|gif|ico)$/.test(name ?? '')) return 'assets/images/[name][extname]'
          return 'assets/[name][extname]'
        },
      },
    },
    reportCompressedSize: true,
    chunkSizeWarningLimit: 600,
  },
  plugins: [
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 78, progressive: true },
      jpg: { quality: 78, progressive: true },
      webp: { quality: 78, lossless: false },
      avif: { quality: 65 },
      svg: {
        multipass: true,
      },
      cache: true,
      cacheLocation: 'node_modules/.cache/vite-plugin-image-optimizer',
    }),
  ],
  esbuild: {
    drop: ['debugger'],
    pure: ['console.log', 'console.table', 'console.info', 'console.debug'],
    legalComments: 'none',
  },
})
