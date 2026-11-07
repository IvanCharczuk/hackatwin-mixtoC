// Central de Deudores del BCRA: API pública y gratuita, sin clave.
// https://www.bcra.gob.ar/apis-banco-central/
import type { Bcra } from "./reglas";

const BASE = "https://api.bcra.gob.ar/CentralDeDeudores/v1.0/Deudas";

async function pedir(url: string, ms = 12_000): Promise<{ status: number; body: any }> {
  const r = await fetch(url, { signal: AbortSignal.timeout(ms) });
  let body: any = null;
  try {
    body = await r.json();
  } catch {
    body = null;
  }
  return { status: r.status, body };
}

/** Cuenta los cheques rechazados en la respuesta, sea cual sea su anidamiento. */
function contarCheques(nodo: any): number {
  if (!nodo || typeof nodo !== "object") return 0;
  if (Array.isArray(nodo)) return nodo.reduce((s, x) => s + contarCheques(x), 0);
  let n = 0;
  if ("nroCheque" in nodo) n += 1;
  for (const v of Object.values(nodo)) if (typeof v === "object") n += contarCheques(v);
  return n;
}

/** Peso mínimo de una deuda (sobre el total) para que su situación cuente. */
export const MATERIALIDAD = 0.01;

type Entidad = { entidad?: string; situacion: number; monto: number };

/**
 * Resume las deudas del último período. La situación que cuenta es la peor
 * entre las deudas que pesan al menos 1% del total: una deuda chica irregular
 * (por ejemplo, $86 mil con un peaje en una empresa que debe millones) se
 * informa, pero no define el perfil.
 */
export function resumirEntidades(entidades: Entidad[]) {
  const montos = entidades.map((e) => Number(e.monto) || 0);
  const total = montos.reduce((s, m) => s + m, 0);
  let situacionMax: number | null = null;
  let situacionMaxTotal: number | null = null;
  let deudasMenoresIrregulares = 0;
  entidades.forEach((e, i) => {
    const sit = Number(e.situacion) || 1;
    situacionMaxTotal = Math.max(situacionMaxTotal ?? 0, sit);
    const material = total === 0 || montos[i] / total >= MATERIALIDAD;
    if (material) situacionMax = Math.max(situacionMax ?? 0, sit);
    else if (sit >= 2) deudasMenoresIrregulares += 1;
  });
  return {
    situacionMax,
    situacionMaxTotal,
    deudasMenoresIrregulares,
    // El BCRA informa los montos en miles de pesos.
    deudaTotalArs: total * 1000,
    entidades: entidades.length,
  };
}

export function normalizarCuit(cuit: string): string {
  const limpio = String(cuit).replace(/\D/g, "");
  if (limpio.length !== 11) throw new Error(`CUIT inválido: tiene que tener 11 dígitos (llegó «${cuit}»).`);
  return limpio;
}

export async function consultarBcra(cuitEntrada: string): Promise<Bcra> {
  const cuit = normalizarCuit(cuitEntrada);
  try {
    const [deudas, cheques] = await Promise.all([
      pedir(`${BASE}/${cuit}`),
      pedir(`${BASE}/ChequesRechazados/${cuit}`),
    ]);
    if (deudas.status !== 200 && deudas.status !== 404) {
      return { ok: false, situacionMax: null, deudaTotalArs: 0, entidades: 0, chequesRechazados: 0, error: `BCRA respondió ${deudas.status}` };
    }
    const chequesRechazados = cheques.status === 200 ? contarCheques(cheques.body?.results) : 0;
    if (deudas.status === 404) {
      return { ok: true, situacionMax: null, deudaTotalArs: 0, entidades: 0, chequesRechazados };
    }
    const res = deudas.body?.results ?? {};
    const periodos: any[] = res.periodos ?? [];
    const ultimo = periodos.slice().sort((a, b) => String(b.periodo).localeCompare(String(a.periodo)))[0];
    const resumen = resumirEntidades(ultimo?.entidades ?? []);
    return {
      ok: true,
      denominacion: res.denominacion,
      periodo: ultimo?.periodo,
      ...resumen,
      chequesRechazados,
    };
  } catch (e: any) {
    return { ok: false, situacionMax: null, deudaTotalArs: 0, entidades: 0, chequesRechazados: 0, error: e?.name === "TimeoutError" ? "el BCRA no respondió a tiempo" : String(e?.message ?? e) };
  }
}
