// Receta abstracta para verificar la solvencia de una empresa de afuera que
// hace el onboarding en Argentina. La receta es la misma para todos los países;
// cada país la implementa con sus propias fuentes (ver chile.ts, el caso base).

export type IdPaso =
  | "identidad"          // existe, razón social, vigencia, actividad
  | "situacion_tributaria" // inscripción vigente y actividad declarada
  | "deuda_financiera"   // deuda con bancos y financieras reguladas
  | "morosidad_comercial" // deudas impagas con proveedores, cheques protestados
  | "insolvencia"        // quiebras o procedimientos concursales
  | "sanciones"          // listas de sanciones y personas expuestas (PEP)
  | "capacidad"          // estados financieros, ventas, patrimonio
  | "argentina_local"    // si ya tiene CUIT: BCRA, IGJ
  | "historial_onchain"; // historial de su wallet (sirve en cualquier país)

/** Cómo se obtiene el dato en un país. */
export type Acceso =
  | "api_publica"     // se consulta solo, sin permiso
  | "consulta_manual" // pública pero con captcha o sin API: la hace una persona
  | "con_consentimiento" // la empresa lo entrega o autoriza (informe propio, proveedor pago)
  | "no_disponible";

export type Fuente = { nombre: string; url?: string; acceso: Acceso; costo?: string; nota?: string };

export type Paso = { id: IdPaso; titulo: string; obligatorio: boolean; fuentes: Fuente[] };

export type Pais = {
  codigo: string; // ISO 3166-1 alfa-2
  nombre: string;
  idFiscal: { nombre: string; validar: (valor: string) => string | null };
  pasos: Paso[];
};

export type Estado = "verificado" | "alerta" | "alerta_grave" | "pendiente" | "simulado" | "no_aplica";

export type ResultadoPaso = {
  id: IdPaso;
  titulo: string;
  estado: Estado;
  detalle: string;
  fuente: string;
  obligatorio: boolean;
};

export type Veredicto = {
  nivel: "apta" | "condicional" | "rechazada";
  /** Tope sobre el colateral que surge de la verificación (el agente usa el menor con el del BCRA). */
  tope: number;
  faltan: IdPaso[];
  alertas: string[];
  simulados: number;
};

/**
 * Regla de combinación, igual para todos los países:
 * - Alerta grave (insolvencia, sanciones u otra) → rechazada, tope 0.
 * - Algún paso obligatorio pendiente → condicional, tope 40% hasta completarlo.
 * - Alguna alerta leve → apta con tope 50%.
 * - Todo verificado → apta, tope 60% (el máximo seguro del circuito).
 * Los pasos simulados cuentan como verificados para la demo y se informan aparte.
 */
export function combinar(r: ResultadoPaso[]): Veredicto {
  const alertas = r.filter((p) => p.estado === "alerta" || p.estado === "alerta_grave").map((p) => `${p.titulo}: ${p.detalle}`.trim());
  const simulados = r.filter((p) => p.estado === "simulado").length;
  const faltan = r.filter((p) => p.obligatorio && p.estado === "pendiente").map((p) => p.id);
  if (r.some((p) => p.estado === "alerta_grave")) return { nivel: "rechazada", tope: 0, faltan, alertas, simulados };
  if (faltan.length) return { nivel: "condicional", tope: 0.4, faltan, alertas, simulados };
  if (r.some((p) => p.estado === "alerta")) return { nivel: "apta", tope: 0.5, faltan, alertas, simulados };
  return { nivel: "apta", tope: 0.6, faltan, alertas, simulados };
}

/** Lo que cada país implementa: correr los pasos con sus fuentes. */
export type Verificador = (idFiscal: string, opciones?: { simular?: boolean }) => Promise<ResultadoPaso[]>;
