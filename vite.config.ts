import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()]
});

// vite.config.js

// import { resolve } from "path";

// export default defineConfig({
//   css: {
//     devSourcemap: false
//   },
//   build: {
//     sourcemap: true,
//     manifest: true, // adds a manifest.json
//     rollupOptions: {
//       input: [resolve(__dirname, "./src/main.tsx")]
//     },
//     outDir: "build",
//     assetsDir: "static"
//   },
//   plugins: [react()],
//   server: {
//     port: 3001, // make sure this doesn't conflict with other ports you're using
//     open: false
//   }
// });
