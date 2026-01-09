import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Output directory
    outDir: "dist",

    // Generate sourcemaps for production
    sourcemap: true,

    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000,

    // Rollup options for optimization
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // React core
          "react-vendor": ["react", "react-dom"],

          // UI libraries
          "ui-vendor": ["react-icons", "react-colorful", "sonner"],

          // Lazy-loaded libraries
          confetti: ["react-confetti"],
        },

        // Asset file naming
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split(".").at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = "img";
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            extType = "fonts";
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },

        // Chunk file naming
        chunkFileNames: "assets/js/[name]-[hash].js",

        // Entry file naming
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },

    // Minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },

    // Target modern browsers
    target: "es2015",

    // CSS code splitting
    cssCodeSplit: true,
  },

  // Server configuration for development
  server: {
    port: 3000,
    open: true,
    cors: true,
  },

  // Preview server configuration
  preview: {
    port: 4173,
    open: true,
  },

  // Optimization
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});
