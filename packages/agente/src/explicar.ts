// Explicación en castellano con Claude Haiku 5.5; si la API falla, texto armado.
import Anthropic from "@anthropic-ai/sdk";
import type { Decision, Bcra } from "./reglas";
import type { Onchain } from "./onchain";
import type { Pago } from "./index";

const MODELO = "claude-haiku-5-5";
const fmt = (n: number) => n.toLocaleString("es-AR", { maximumFractionDigits: 2 });

export function explicacionArmada(d: Decision, bcra: Bcra): string {
  const quien = bcra.denominacion ?? "La empresa";
  if (d.estado === "rechazado") {
    return `${quien}: hoy no puede pedir ARGt. ${d.motivos.join(" ")}`;
  }
  const base = `${quien} puede pedir hasta ${fmt(d.disponibleArgt)} ARGt con ${fmt(d.colateralUsdt0)} USDT0 de colateral (tope ${Math.round(d.tope * 100)}%).`;
  const otorgado = d.pedidoArgt !== null ? ` Se le otorgan ${fmt(d.otorgadoArgt)} ARGt (${d.estado}).` : "";
  return `${base}${otorgado} ${d.motivos.join(" ")}`.trim();
}

export async function explicar(
  d: Decision,
  bcra: Bcra,
  onchain: Onchain | null,
  pago: Pago | null = null,
  apiKey = process.env.ANTHROPIC_API_KEY,
): Promise<{ texto: string; fuente: "claude" | "armada"; error?: string }> {
  const armada = explicacionArmada(d, bcra);
  if (!apiKey) return { texto: armada, fuente: "armada", error: "sin ANTHROPIC_API_KEY" };
  const datos = {
    empresa: bcra.denominacion ?? null,
    bcra: {
      consultaOk: bcra.ok,
      situacion: bcra.situacionMax,
      deudasMenoresIrregulares: bcra.deudasMenoresIrregulares ?? 0,
      chequesRechazados: bcra.chequesRechazados,
    },
    onchain: onchain && {
      transacciones: onchain.transacciones,
      saldos: onchain.saldos,
      posicion: onchain.posicion,
      tasaAnual: onchain.mercado.tasaAnual,
    },
    // Lo que todavía no depositó: es una simulación de cuánto podría pedir si lo deja.
    colateralSimuladoUsdt0: onchain ? Math.max(0, d.colateralUsdt0 - onchain.posicion.colateralUsdt0) : null,
    decision: d,
    factura: pago && {
      montoArs: pago.factura.montoArs,
      proveedor: { situacion: pago.proveedor.situacionMax, chequesRechazados: pago.proveedor.chequesRechazados, alertas: pago.alertas },
      plan: pago.plan,
    },
  };
  const client = new Anthropic({ apiKey, timeout: 25_000, maxRetries: 1 });
  try {
    const r = await client.messages.create({
      model: MODELO,
      max_tokens: 2000,
      // Haiku 5.5 piensa por defecto (effort medium); para una explicación corta alcanza con low.
      output_config: { effort: "low" },
      system:
        "Sos el agente de una plataforma que le da a empresas que llegan a operar en Argentina un préstamo en ARGt (stablecoin del peso argentino de Twin) usando USDT0 como colateral en Morpho, en Arbitrum. Explicás decisiones de crédito en castellano rioplatense, claro y sin jerga, en 3 o 4 oraciones. Reglas: no prometas rendimiento ni intereses a favor; no inventes datos que no estén en el JSON; si colateralSimuladoUsdt0 es mayor a 0, ese colateral todavía no está depositado: hablá en condicional («si dejás…»); montos en ARGt con separador de miles; no uses títulos ni viñetas.",
      messages: [
        {
          role: "user",
          content: (pago
            ? "La empresa cargó una factura de un proveedor para pagarla con ARGt. Explicale si le alcanza, de dónde sale la plata (su saldo y lo que pide prestado), qué le queda disponible después y si el proveedor tiene alertas en el BCRA. "
            : "Explicale a la empresa cuánto puede pedir, por qué (perfil del BCRA, colateral, liquidez del mercado) y qué podría hacer para pedir más. ") + `Datos:\n${JSON.stringify(datos)}`,
        },
      ],
    });
    if (r.stop_reason === "refusal") {
      return { texto: armada, fuente: "armada", error: "Claude declinó responder" };
    }
    const texto = r.content
      .flatMap((b) => (b.type === "text" ? [b.text] : []))
      .join("\n")
      .trim();
    if (!texto) return { texto: armada, fuente: "armada", error: `Claude no devolvió texto (${r.stop_reason})` };
    return { texto, fuente: "claude" };
  } catch (e) {
    const msg = e instanceof Anthropic.APIError ? `Claude ${e.status}: ${e.message}` : String((e as Error)?.message ?? e);
    return { texto: armada, fuente: "armada", error: msg };
  }
}
