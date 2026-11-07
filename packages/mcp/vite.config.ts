import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Compila la página de login a dist/login. El Worker la sirve en /authorize.
export default defineConfig({
	root: "login",
	base: "/login/",
	plugins: [react()],
	build: { outDir: "../dist/login", emptyOutDir: true },
});
