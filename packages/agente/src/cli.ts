// uso: npm run -s -w packages/agente perfil -- <cuit> <wallet> [--colateral <usdt0>] [--pedido <argt>] [--sin-explicacion]
// Lee ANTHROPIC_API_KEY y ARBITRUM_RPC_URL del .env de la raíz del repo.
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { evaluar } from "./index";

function cargarEnv() {
  const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
  const archivo = resolve(raiz, ".env");
  if (!existsSync(archivo)) return;
  for (const linea of readFileSync(archivo, "utf8").split("\n")) {
    const m = linea.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const args = process.argv.slice(2);
const pos: string[] = [];
const opt: Record<string, string | boolean> = {};
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--sin-explicacion") opt.sinExplicacion = true;
  else if (a.startsWith("--")) opt[a.slice(2)] = args[++i];
  else pos.push(a);
}

if (pos.length < 2) {
  console.error("uso: perfil <cuit> <wallet> [--colateral <usdt0>] [--pedido <argt>] [--sin-explicacion]");
  process.exit(2);
}

cargarEnv();
try {
  const r = await evaluar({
    cuit: pos[0],
    wallet: pos[1],
    colateralUsdt0: opt.colateral as string | undefined as any,
    pedidoArgt: opt.pedido as string | undefined as any,
    conExplicacion: !opt.sinExplicacion,
  });
  console.log(JSON.stringify(r, null, 2));
} catch (e: any) {
  console.error(`agente: ${e?.message ?? e}`);
  process.exit(1);
}
