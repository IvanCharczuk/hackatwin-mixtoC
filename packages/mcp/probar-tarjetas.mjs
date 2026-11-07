// Prueba en memoria: las tarjetas (MCP Apps) están registradas y cada herramienta apunta a la suya.
// Uso: npx tsx packages/mcp/probar-tarjetas.mjs
import { Client, InMemoryTransport } from "@modelcontextprotocol/client";
import { crearServidor } from "./src/herramientas.ts";

const server = crearServidor({}, { privyUserId: "did:privy:prueba", wallet: null, walletTipo: null, email: null });
const client = new Client({ name: "prueba", version: "0" });
const [a, b] = InMemoryTransport.createLinkedPair();
await Promise.all([server.connect(a), client.connect(b)]);

const { resources } = await client.listResources();
const { tools } = await client.listTools();
let ok = true;
for (const nombre of ["cuanto_puedo_pedir", "preparar_adelanto"]) {
	const uri = tools.find((t) => t.name === nombre)?._meta?.ui?.resourceUri;
	const r = resources.find((x) => x.uri === uri);
	const bien = Boolean(uri && r && r.mimeType === "text/html;profile=mcp-app");
	ok &&= bien;
	console.log(`${bien ? "OK  " : "FALLA"} ${nombre} → ${uri} (${r?.mimeType})`);
}
console.log(ok ? "\nTodo en verde" : "\nHay fallas");
process.exit(ok ? 0 : 1);
