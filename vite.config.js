/* eslint-env node */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import fs from "node:fs";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const apiTarget = env.VITE_API_URL;

	return {
		plugins: [react()],
		server: {
			host: true,
			port: 5173,
			https: {
				key: fs.readFileSync("localhost-key.pem"),
				cert: fs.readFileSync("localhost.pem"),
			},
			proxy: apiTarget
				? {
						"/api": {
							target: apiTarget,
							changeOrigin: true,
						},
				  }
				: undefined,
		},
	};
});
