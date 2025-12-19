/* eslint-env node */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_URL;

  const isDev = command === "serve";

  const serverConfig = {
    host: true,
    port: 5173,
    proxy: apiTarget
      ? {
          "/api": {
            target: apiTarget,
            changeOrigin: true,
			secure: false,
          },
        }
      : undefined,
  };

  // Solo en local/dev: usa HTTPS con tus certificados
  if (isDev) {
    serverConfig.https = {
      key: fs.readFileSync(path.resolve(process.cwd(), "localhost-key.pem")),
      cert: fs.readFileSync(path.resolve(process.cwd(), "localhost.pem")),
    };
  }

  return {
    plugins: [react()],
    server: serverConfig,
  };
});
