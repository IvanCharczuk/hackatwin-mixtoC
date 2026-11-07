// Reglas puras del agente: tope sobre el colateral según el perfil y cuánto
// ARGt se puede pedir hoy. Sin red ni efectos: se prueban con `npm test`.

export type Bcra = {
  ok: boolean;
  /** Perfil de ejemplo para la demo (no consultó al BCRA). */
  simulado?: boolean;
  denominacion?: string;
  /** Peor situación del último período entre las deudas materiales (1 a 5); null si no tiene deudas registradas. */
  situacionMax: number | null;
  /** Peor situación contando también las deudas chicas (sólo informativo). */
  situacionMaxTotal?: number | null;
  /** Deudas chicas (menos de 1% del total) en situación 2 o peor: se informan, no bajan el tope. */
  deudasMenoresIrregulares?: number;
  deudaTotalArs: number;
  entidades: number;
  chequesRechazados: number;
  periodo?: string;
  error?: string;
};

export type Mercado = {
  /** ARGt disponible para pedir (oferta menos deuda del mercado). */
  liquidezArgt: number;
  /** Cuántos ARGt vale 1 USDT0 según el oráculo del mercado. */
  precioArgtPorUsdt0: number;
  /** Punto de liquidación de Morpho (0,77). */
  lltv: number;
  tasaAnual?: number | null;
};

export type Posicion = { colateralUsdt0: number; deudaArgt: number };

export type Entrada = {
  bcra: Bcra;
  mercado: Mercado;
  posicion: Posicion;
  /** USDT0 que la empresa piensa sumar de colateral (simulación). */
  colateralExtraUsdt0?: number;
  /** ARGt que quiere pedir; si falta, se informa el máximo. */
  pedidoArgt?: number;
  /** Tope que impone otra verificación (la de solvencia en el país de origen). Se usa el menor. */
  topeMaximo?: number;
  motivoTopeMaximo?: string;
};

export type Decision = {
  estado: "aprobado" | "recortado" | "rechazado";
  tope: number;
  motivos: string[];
  colateralUsdt0: number;
  colateralEnArgt: number;
  maxPorColateralArgt: number;
  liquidezUsableArgt: number;
  disponibleArgt: number;
  pedidoArgt: number | null;
  otorgadoArgt: number;
  ltvResultante: number;
};

export const TOPE_MAXIMO = 0.6; // el máximo seguro del circuito (Morpho liquida a 0,77)
export const MARGEN_LIQUIDEZ = 1.1; // igual que el C4 del circuito

const r2 = (n: number) => Math.round(n * 100) / 100;

export function topePorPerfil(bcra: Bcra): { tope: number; motivos: string[] } {
  if (!bcra.ok) {
    return {
      tope: 0.5,
      motivos: ["No pudimos consultar el BCRA: el tope queda en 50% hasta poder verificar."],
    };
  }
  const sit = bcra.situacionMax;
  if (sit !== null && sit >= 3) {
    return {
      tope: 0,
      motivos: [`Situación ${sit} en la Central de Deudores del BCRA: no puede pedir.`],
    };
  }
  const malaSituacion = sit === 2;
  const cheques = bcra.chequesRechazados > 0;
  if (malaSituacion && cheques) {
    return {
      tope: 0.4,
      motivos: [
        `Situación 2 en el BCRA y ${bcra.chequesRechazados} cheque(s) rechazado(s): tope 40%.`,
      ],
    };
  }
  if (malaSituacion) {
    return { tope: 0.5, motivos: ["Situación 2 en el BCRA: tope 50%."] };
  }
  if (cheques) {
    return {
      tope: 0.5,
      motivos: [`${bcra.chequesRechazados} cheque(s) rechazado(s) en el BCRA: tope 50%.`],
    };
  }
  const motivos = [
    sit === null
      ? "Sin deudas registradas en el BCRA: puede pedir el máximo seguro, 60% de su colateral."
      : "Situación 1 en el BCRA (normal): puede pedir el máximo seguro, 60% de su colateral.",
  ];
  const menores = bcra.deudasMenoresIrregulares ?? 0;
  if (menores > 0) {
    motivos.push(
      `Tiene ${menores} deuda(s) chica(s) en mora (menos de 1% de lo que debe): se informan, pero no cambian el tope.`,
    );
  }
  return { tope: TOPE_MAXIMO, motivos };
}

export function decidir(e: Entrada): Decision {
  const perfil = topePorPerfil(e.bcra);
  const motivos = perfil.motivos;
  let tope = perfil.tope;
  if (e.topeMaximo !== undefined && e.topeMaximo < tope) {
    tope = e.topeMaximo;
    motivos.push(e.motivoTopeMaximo ?? `La verificación en el país de origen limita el tope al ${Math.round(tope * 100)}%.`);
  }
  const colateralUsdt0 = e.posicion.colateralUsdt0 + (e.colateralExtraUsdt0 ?? 0);
  const colateralEnArgt = colateralUsdt0 * e.mercado.precioArgtPorUsdt0;
  const maxPorColateralArgt = Math.max(0, colateralEnArgt * tope - e.posicion.deudaArgt);
  const liquidezUsableArgt = Math.max(0, e.mercado.liquidezArgt / MARGEN_LIQUIDEZ);
  const disponibleArgt = r2(Math.min(maxPorColateralArgt, liquidezUsableArgt));
  const pedidoArgt = e.pedidoArgt ?? null;
  const salida = (estado: Decision["estado"], otorgadoArgt: number): Decision => ({
    estado,
    tope,
    motivos,
    colateralUsdt0: r2(colateralUsdt0),
    colateralEnArgt: r2(colateralEnArgt),
    maxPorColateralArgt: r2(maxPorColateralArgt),
    liquidezUsableArgt: r2(liquidezUsableArgt),
    disponibleArgt,
    pedidoArgt,
    otorgadoArgt: r2(otorgadoArgt),
    ltvResultante:
      colateralEnArgt > 0 ? r2((e.posicion.deudaArgt + otorgadoArgt) / colateralEnArgt) : 0,
  });

  if (tope === 0) return salida("rechazado", 0);
  if (colateralUsdt0 <= 0) {
    motivos.push("No tiene colateral: tiene que dejar USDT0 en el mercado para poder pedir ARGt.");
    return salida("rechazado", 0);
  }
  if (liquidezUsableArgt < maxPorColateralArgt) {
    motivos.push(
      `La liquidez del mercado alcanza para ${r2(liquidezUsableArgt)} ARGt (con 10% de margen): eso limita lo que puede pedir hoy.`,
    );
  }
  if (disponibleArgt <= 0) {
    motivos.push("Hoy no hay ARGt disponible para pedir con este colateral.");
    return salida("rechazado", 0);
  }
  if (pedidoArgt === null) return salida("aprobado", disponibleArgt);
  if (pedidoArgt <= disponibleArgt) return salida("aprobado", pedidoArgt);
  motivos.push(`Pidió ${pedidoArgt} ARGt; se recorta a ${disponibleArgt} ARGt.`);
  return salida("recortado", disponibleArgt);
}
