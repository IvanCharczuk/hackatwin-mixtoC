// Asistente de Saltar (lado del servidor): la clave de Claude nunca llega al navegador.
// POST { mensajes: [{ rol: "usuario" | "asistente", texto }], wallet? } → { texto }
// Lo usan la app y la landing (otro dominio), por eso responde con CORS abierto.
// Sólo lee: las herramientas no firman ni mandan nada.
import Anthropic from "@anthropic-ai/sdk";
import { SISTEMA } from "@/lib/asistente/conocimiento";
import { HERRAMIENTAS, correr } from "@/lib/asistente/herramientas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MODELO = "claude-opus-5-5";
const MAX_MENSAJES = 24;
const MAX_TEXTO = 2000;
const MAX_VUELTAS = 5;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};

const responder = (body: unknown, status = 200) => Response.json(body, { status, headers: CORS });

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

type Entrada = { rol: "usuario" | "asistente"; texto: string };

function leerMensajes(v: unknown): Anthropic.Beta.BetaMessageParam[] | null {
  if (!Array.isArray(v) || v.length === 0) return null;
  const ultimos = (v as Entrada[]).slice(-MAX_MENSAJES);
  const mensajes: Anthropic.Beta.BetaMessageParam[] = [];
  for (const m of ultimos) {
    if (!m || (m.rol !== "usuario" && m.rol !== "asistente") || typeof m.texto !== "string") return null;
    const texto = m.texto.trim().slice(0, MAX_TEXTO);
    if (!texto) continue;
    mensajes.push({ role: m.rol === "usuario" ? "user" : "assistant", content: texto });
  }
  // La conversación arranca y termina con la persona.
  while (mensajes.length && mensajes[0].role !== "user") mensajes.shift();
  if (!mensajes.length || mensajes[mensajes.length - 1].role !== "user") return null;
  return mensajes;
}

export async function POST(req: Request) {
  let body: { mensajes?: unknown; wallet?: unknown; pagina?: unknown; cuit?: unknown };
  try {
    body = await req.json();
  } catch {
    return responder({ error: "El cuerpo tiene que ser JSON." }, 400);
  }
  const mensajes = leerMensajes(body?.mensajes);
  if (!mensajes) return responder({ error: "Faltan «mensajes»: una lista que termina con una pregunta." }, 400);
  const wallet = typeof body.wallet === "string" && body.wallet ? body.wallet : null;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return responder({ error: "El asistente no está configurado (falta ANTHROPIC_API_KEY)." }, 503);
  const client = new Anthropic({ apiKey, timeout: 45_000, maxRetries: 1 });

  const pagina = body.pagina === "pagar-factura" ? "Pagar una factura (/app)" : body.pagina === "dashboard" ? "el dashboard" : null;
  const cuit = typeof body.cuit === "string" && /^\d{2}-?\d{8}-?\d$/.test(body.cuit.trim()) ? body.cuit.trim() : null;
  const contexto = [
    wallet
      ? `La persona entró a la app con la wallet ${wallet}. Podés usar mi_cuenta.`
      : "La persona no tiene una wallet conectada (está en la landing o sin sesión).",
    pagina && `Está mirando ${pagina}.`,
    cuit && `El CUIT de su empresa en pantalla es ${cuit}.`,
  ]
    .filter(Boolean)
    .join(" ");

  try {
    for (let vuelta = 0; vuelta < MAX_VUELTAS; vuelta++) {
      const r = await client.beta.messages.create({
        model: MODELO,
        max_tokens: 4000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        output_config: { effort: "low" },
        system: [
          { type: "text", text: SISTEMA, cache_control: { type: "ephemeral" } },
          { type: "text", text: contexto },
        ],
        tools: HERRAMIENTAS,
        messages: mensajes,
      });

      if (r.stop_reason === "refusal") {
        return responder({ texto: "Con eso no te puedo ayudar. Preguntame lo que quieras sobre cómo pagar en Argentina con Saltar." });
      }
      if (r.stop_reason !== "tool_use") {
        const texto = r.content
          .flatMap((b) => (b.type === "text" ? [b.text] : []))
          .join("\n")
          .trim();
        return responder({ texto: texto || "No te entendí bien. ¿Me lo preguntás de otra forma?" });
      }

      // Guardamos la respuesta entera (incluye los bloques de razonamiento) y corremos las herramientas en paralelo.
      mensajes.push({ role: "assistant", content: r.content });
      const usos = r.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
      const resultados = await Promise.all(
        usos.map(async (u) => {
          const { texto, error } = await correr(u.name, (u.input ?? {}) as Record<string, unknown>, wallet);
          return { type: "tool_result" as const, tool_use_id: u.id, content: texto, is_error: error };
        }),
      );
      mensajes.push({ role: "user", content: resultados });
    }
    return responder({ texto: "Uy, eso me enredó. ¿Me lo preguntás más simple?" });
  } catch (e) {
    const msg = e instanceof Anthropic.APIError ? `Claude ${e.status}: ${e.message}` : String((e as Error)?.message ?? e);
    console.error("asistente:", msg);
    return responder({ error: "Uy, se me cortó. ¿Me lo repetís en un ratito?" }, 502);
  }
}
