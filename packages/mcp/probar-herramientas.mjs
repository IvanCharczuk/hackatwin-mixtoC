// Prueba de las herramientas del flujo sin Worker ni login: crea el servidor
// con un usuario falso (una wallet real de Arbitrum) y las llama con el
// cliente MCP en memoria. Lee la cadena y el BCRA de verdad; no firma nada.
// Uso: npx tsx packages/mcp/probar-herramientas.mjs [wallet]
import { Client, InMemoryTransport } from "@modelcontextprotocol/client";
import { crearServidor } from "./src/herramientas.ts";

const wallet = process.argv[2] ?? "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
const props = { privyUserId: "did:privy:prueba", wallet, walletTipo: "externa", email: null };
const server = crearServidor({ ARBITRUM_RPC_URL: process.env.ARBITRUM_RPC_URL }, props);
const [a, b] = InMemoryTransport.createLinkedPair();
const client = new Client({ name: "prueba", version: "0" });
await Promise.all([server.connect(a), client.connect(b)]);

let fallas = 0;
const check = (ok, nombre, detalle = "") => {
	console.log(`${ok ? "OK  " : "MAL "} ${nombre}${detalle ? `: ${detalle}` : ""}`);
	if (!ok) fallas++;
};

const { tools } = await client.listTools();
check(["evaluar_factura", "preparar_adelanto"].every((n) => tools.some((t) => t.name === n)), "herramientas", tools.map((t) => t.name).join(", "));
const { prompts } = await client.listPrompts();
check(prompts.some((p) => p.name === "pedir_adelanto"), "prompt pedir_adelanto");
const p = await client.getPrompt({ name: "pedir_adelanto" });
check(p.messages[0].content.text.includes("preparar_adelanto"), "texto del prompt", `${p.messages[0].content.text.length} caracteres`);

// Factura de ejemplo de la web (apps/web/lib/factura-ejemplo.ts), empresa chilena simulada.
const ev = await client.callTool({
	name: "evaluar_factura",
	arguments: {
		cuit_empresa: "30999999023",
		cuit_proveedor: "30999999015",
		monto_ars: 200,
		numero: "0003-00000127",
		vencimiento_pago: "2027-01-04",
		wallet_proveedor: "0x40326B77C55b2EF41a0ca933B6Bc9Cb4995a4320",
		origen: { pais: "CL", id_fiscal: "76.086.428-5", simular: true },
		bcra_simulado: { situacion: 1 },
		bcra_simulado_proveedor: { situacion: 1 },
	},
});
const r = ev.structuredContent;
check(!ev.isError && r?.decision && r?.pago && r?.explicacion?.fuente === "armada", "evaluar_factura", ev.isError ? ev.content[0].text : `${r.decision.estado}, otorgado ${r.decision.otorgadoArgt} ARGt, solvencia ${r.solvencia?.veredicto?.nivel}`);
check(JSON.stringify(r) === JSON.stringify(JSON.parse(ev.content[0].text)), "evaluar_factura: texto = structuredContent");
console.log("   explicación:", r?.explicacion?.texto);
console.log("   siguiente:", JSON.stringify(r?.siguiente));

const pr = await client.callTool({
	name: "preparar_adelanto",
	arguments: { argt: 200, pagar_a: "0x40326B77C55b2EF41a0ca933B6Bc9Cb4995a4320", cuit: "30-99999902-3" },
});
const s = pr.structuredContent;
check(!pr.isError && Array.isArray(s?.chequeos) && s.chequeos.length === 6 && s.pasos.length >= 3, "preparar_adelanto", pr.isError ? pr.content[0].text : `ok=${s.ok}, chlt=${s.chlt}, ${s.pasos.length} pasos`);
check(s?.pasos?.every((x) => /^0x[0-9a-fA-F]{40}$/.test(x.tx.to) && x.tx.data.startsWith("0x")), "pasos con to + data");
check(s?.firmarEn?.startsWith("https://saltarg-app.vercel.app/app?monto=200"), "firmarEn", s?.firmarEn);
for (const c of s?.chequeos ?? []) console.log(`   ${c.ok ? "✓" : "✗"} ${c.id} ${c.titulo}: ${c.detalle}`);
for (const x of s?.pasos ?? []) console.log(`   → ${x.titulo}: ${x.detalle} (to ${x.tx.to}, data ${x.tx.data.slice(0, 10)}…)`);

const mal = await client.callTool({ name: "preparar_adelanto", arguments: { argt: 10, pagar_a: "no-es-wallet" } });
check(mal.isError === true, "preparar_adelanto rechaza wallet inválida", mal.content[0].text);

console.log(fallas ? `\n${fallas} chequeo(s) fallaron` : "\nTodo en verde");
process.exit(fallas ? 1 : 0);
