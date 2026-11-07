// Escribe las tarjetas de MCP Apps como HTML sueltos para verlas en un
// navegador (se dibujan con los datos de muestra). `?tema=dark` fuerza oscuro.
// Uso: node packages/mcp/tarjetas-preview/generar.mjs
import { writeFileSync } from "node:fs";
import { TARJETA_CUANTO, TARJETA_PLAN } from "../src/tarjetas.ts";
const aca = new URL(".", import.meta.url);
writeFileSync(new URL("cuanto-puedo-pedir.html", aca), TARJETA_CUANTO);
writeFileSync(new URL("preparar-adelanto.html", aca), TARJETA_PLAN);
console.log("tarjetas escritas en", aca.pathname);
