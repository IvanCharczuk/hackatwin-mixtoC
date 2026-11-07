// Herramientas del asistente. Todas son de lectura: ninguna firma ni manda
// transacciones (regla 4 de AGENTS.md). Reusan las lecturas del dashboard
// (lib/credito.ts) y el agente (packages/agente) para el BCRA.
import type Anthropic from "@anthropic-ai/sdk";
import { createPublicClient, erc20Abi, formatUnits, http, isAddress, getAddress, type PublicClient } from "viem";
import { arbitrum } from "viem/chains";
import { evaluar } from "agente";
import { leerCredito } from "@/lib/credito";
import { LIQUIDA, POOL_CHLT_USDT0, TOPE, curveAbi } from "@/lib/morpho";
import { RPC, TOKENS } from "@/lib/tokens";

const CERO = "0x0000000000000000000000000000000000000000" as const;
const r2 = (n: number) => Math.round(n * 100) / 100;

function cliente(): PublicClient {
  const rpc = process.env.ARBITRUM_RPC_URL || RPC;
  return createPublicClient({ chain: arbitrum, transport: http(rpc, { timeout: 15_000 }) }) as PublicClient;
}

export const HERRAMIENTAS: Anthropic.Beta.BetaTool[] = [
  {
    name: "mercado_hoy",
    description:
      "Lee en vivo el mercado ARGt/USDT0 de Morpho en Arbitrum: ARGt disponible para prestar, tasa anual variable, cuántos ARGt vale 1 USDT0 de garantía, cuántos CHLt equivalen a 1 USDT0 en Curve, el tope (60%) y el punto de liquidación (77%).",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
    strict: true,
  },
  {
    name: "simular_garantia",
    description:
      "Calcula con precios en vivo cuánta garantía hace falta para recibir una cantidad de pesos (ARGt), pidiendo un porcentaje del valor de la garantía (por defecto el máximo, 60%). Devuelve la garantía en ARGt, USDT0 y CHLt, y si el mercado tiene liquidez para prestarlo. Es una simulación, no una oferta.",
    input_schema: {
      type: "object",
      properties: {
        pesos: { type: "number", description: "Pesos (ARGt) que la empresa necesita recibir." },
        porcentaje: {
          type: ["number", "null"],
          description: "Porcentaje del valor de la garantía a pedir, entre 1 y 60. null para usar 60.",
        },
      },
      required: ["pesos", "porcentaje"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    name: "mi_cuenta",
    description:
      "Lee la cuenta de la persona conectada en la app: saldos de ETH, ARGt, CHLt y USDT0 en Arbitrum, su garantía y deuda en Morpho, qué porcentaje usa y cuánto ARGt puede pedir hoy. Sólo funciona si hay una wallet conectada.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
    strict: true,
  },
  {
    name: "revisar_empresa",
    description:
      "Consulta una empresa argentina por su CUIT en la Central de Deudores del BCRA y aplica las reglas del agente: situación, cheques rechazados, tope que le corresponde (60%, 50%, 40% o 0%) y por qué. Si hay wallet conectada, también dice cuánto ARGt podría pedir con su garantía.",
    input_schema: {
      type: "object",
      properties: { cuit: { type: "string", description: "CUIT de 11 dígitos, con o sin guiones." } },
      required: ["cuit"],
      additionalProperties: false,
    },
    strict: true,
  },
];

async function mercado() {
  const client = cliente();
  const [c, chltPorUsdt0] = await Promise.all([
    leerCredito(client, CERO),
    client.readContract({ address: POOL_CHLT_USDT0, abi: curveAbi, functionName: "price_oracle" }),
  ]);
  return {
    red: "Arbitrum One",
    argtDisponibleParaPrestar: r2(c.liquidezArgt),
    tasaAnualVariable: c.comisionAnual === null ? null : `${r2(c.comisionAnual * 100)}%`,
    argtPorUsdt0: r2(c.argtPorUsdt0),
    chltPorUsdt0: r2(Number(formatUnits(chltPorUsdt0, 18))),
    tope: `${TOPE * 100}%`,
    liquidaEn: `${LIQUIDA * 100}%`,
  };
}

async function simular(pesos: number, porcentaje: number | null) {
  if (!(pesos > 0)) throw new Error("pesos tiene que ser mayor a 0.");
  const pct = Math.min(Math.max(porcentaje ?? TOPE * 100, 1), TOPE * 100) / 100;
  const m = await mercado();
  const garantiaArgt = pesos / pct;
  const garantiaUsdt0 = garantiaArgt / m.argtPorUsdt0;
  return {
    pesosQueRecibe: r2(pesos),
    pidiendo: `${r2(pct * 100)}% del valor de la garantía`,
    garantia: { ARGt: r2(garantiaArgt), USDT0: r2(garantiaUsdt0), CHLt: r2(garantiaUsdt0 * m.chltPorUsdt0) },
    alcanzaLaLiquidez: pesos <= m.argtDisponibleParaPrestar,
    argtDisponibleParaPrestar: m.argtDisponibleParaPrestar,
    tasaAnualVariable: m.tasaAnualVariable,
    nota: "Simulación con precios de este momento. Si la garantía pierde valor, puede hacer falta sumar más.",
  };
}

async function cuenta(wallet: `0x${string}`) {
  const client = cliente();
  const bal = (t: keyof typeof TOKENS) =>
    client.readContract({ address: TOKENS[t].address, abi: erc20Abi, functionName: "balanceOf", args: [wallet] });
  const [c, eth, argt, chlt, usdt0] = await Promise.all([
    leerCredito(client, wallet),
    client.getBalance({ address: wallet }),
    bal("ARGt"),
    bal("CHLt"),
    bal("USDT0"),
  ]);
  return {
    wallet,
    saldos: {
      ETH: Number(formatUnits(eth, 18)),
      ARGt: r2(Number(formatUnits(argt, 18))),
      CHLt: r2(Number(formatUnits(chlt, 18))),
      USDT0: r2(Number(formatUnits(usdt0, 6))),
    },
    morpho: {
      tienePosicion: c.tienePosicion,
      garantiaUsdt0: r2(c.garantiaUsdt0),
      garantiaEnArgt: r2(c.garantiaEnArgt),
      deudaArgt: r2(c.deudaArgt),
      usaDelValorDeLaGarantia: `${r2(c.ltv * 100)}%`,
      puedePedirHoyArgt: r2(c.disponibleArgt),
      tasaAnualVariable: c.comisionAnual === null ? null : `${r2(c.comisionAnual * 100)}%`,
    },
  };
}

async function empresa(cuit: string, wallet: `0x${string}` | null) {
  const r = await evaluar({ cuit, wallet: wallet ?? CERO, conExplicacion: false });
  const b = r.perfil.bcra;
  return {
    empresa: b.denominacion ?? null,
    bcra: {
      consultaOk: b.ok,
      situacion: b.situacionMax,
      chequesRechazados: b.chequesRechazados,
      entidades: b.entidades,
      error: b.error ?? null,
    },
    tope: `${r2(r.decision.tope * 100)}%`,
    estado: r.decision.estado,
    motivos: r.decision.motivos,
    ...(wallet
      ? { puedePedirHoyArgt: r2(r.decision.disponibleArgt), garantiaUsdt0: r2(r.decision.colateralUsdt0) }
      : { nota: "Sin wallet conectada: el tope vale sobre la garantía que deje." }),
  };
}

/** Corre una herramienta y devuelve el texto para el tool_result. Nunca tira: los errores vuelven como texto. */
export async function correr(
  nombre: string,
  input: Record<string, unknown>,
  walletEntrada: string | null,
): Promise<{ texto: string; error: boolean }> {
  const wallet = walletEntrada && isAddress(walletEntrada) ? getAddress(walletEntrada) : null;
  try {
    let salida: unknown;
    if (nombre === "mercado_hoy") salida = await mercado();
    else if (nombre === "simular_garantia")
      salida = await simular(Number(input.pesos), input.porcentaje == null ? null : Number(input.porcentaje));
    else if (nombre === "mi_cuenta") {
      if (!wallet) return { texto: "No hay wallet conectada: la persona tiene que entrar a la app para ver su cuenta.", error: true };
      salida = await cuenta(wallet);
    } else if (nombre === "revisar_empresa") salida = await empresa(String(input.cuit ?? ""), wallet);
    else return { texto: `Herramienta desconocida: ${nombre}`, error: true };
    return { texto: JSON.stringify(salida), error: false };
  } catch (e) {
    return { texto: `No se pudo leer: ${e instanceof Error ? e.message : String(e)}`, error: true };
  }
}
