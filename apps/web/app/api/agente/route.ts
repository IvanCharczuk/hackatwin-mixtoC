// Endpoint del agente (lado del servidor): la clave de Claude nunca llega al navegador.
// POST { cuit, wallet, colateralUsdt0?, pedidoArgt?, bcraSimulado?, factura? } → perfil, decisión y explicación.
// Lógica en packages/agente (spec: packages/agente/SPEC.md).
import { evaluar, type Factura } from "agente";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "El cuerpo tiene que ser JSON." }, { status: 400 });
  }
  const { cuit, wallet, colateralUsdt0, pedidoArgt, bcraSimulado, factura } = body ?? {};
  if (typeof cuit !== "string" || typeof wallet !== "string") {
    return Response.json({ error: "Faltan «cuit» y «wallet» (texto)." }, { status: 400 });
  }
  try {
    const r = await evaluar({
      cuit,
      wallet,
      colateralUsdt0: colateralUsdt0 as number | undefined,
      pedidoArgt: pedidoArgt as number | undefined,
      bcraSimulado: bcraSimulado as { situacion: number | null; chequesRechazados?: number } | undefined,
      factura: factura as Factura | undefined,
    });
    return Response.json(r);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // Errores de validación (CUIT, wallet, números) → 400; el resto, 502 (BCRA, RPC o Claude caídos).
    const esValidacion = /inválid|tiene que/.test(msg);
    return Response.json({ error: msg }, { status: esValidacion ? 400 : 502 });
  }
}
