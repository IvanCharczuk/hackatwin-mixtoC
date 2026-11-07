// Prueba en memoria: el servidor real (crearServidor) publica las tarjetas
// ui:// y `cuanto_puedo_pedir` apunta a la suya con `_meta.ui.resourceUri`.
// Uso: npx -y tsx@4.20.6 packages/mcp/tarjetas-preview/probar.ts
import { Client } from "@modelcontextprotocol/client";
import { InMemoryTransport } from "@modelcontextprotocol/server";
import { crearServidor } from "../src/herramientas";
import { MIME_APP, UI_CUANTO, UI_PLAN } from "../src/tarjetas";

const server = crearServidor({} as any, { wallet: "0x0000000000000000000000000000000000000001" } as any);
const [a, b] = InMemoryTransport.createLinkedPair();
await server.connect(a);
const client = new Client({ name: "prueba-tarjetas", version: "0.0.1" });
await client.connect(b);

const { resources } = await client.listResources();
console.log("resources/list:", resources.map((r) => `${r.uri} (${r.mimeType})`));
const { tools } = await client.listTools();
const t = tools.find((x) => x.name === "cuanto_puedo_pedir");
console.log("cuanto_puedo_pedir._meta:", JSON.stringify(t?._meta));
const leido = await client.readResource({ uri: UI_PLAN });
const c = leido.contents[0] as { mimeType?: string; text?: string };
console.log(`resources/read ${UI_PLAN}:`, c.mimeType, `${c.text?.length} caracteres`);

const ok =
	resources.some((r) => r.uri === UI_CUANTO && r.mimeType === MIME_APP) &&
	resources.some((r) => r.uri === UI_PLAN && r.mimeType === MIME_APP) &&
	(t?._meta as any)?.ui?.resourceUri === UI_CUANTO &&
	c.mimeType === MIME_APP && (c.text?.length ?? 0) > 1000;
console.log(ok ? "OK" : "FALLA");
process.exit(ok ? 0 : 1);
