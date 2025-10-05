import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
	plugins: [nodePolyfills(), react()],
	server: {
		port: 5173,
	},
	proxy: {
		"/api/auth": "http://localhost:3001",
	},
});
