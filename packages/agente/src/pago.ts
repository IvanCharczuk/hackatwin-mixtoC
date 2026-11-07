// Pago de una factura con ARGt: de dónde sale la plata, si alcanza y qué queda
// disponible después. Funciones puras: se prueban con `npm test`.
// 1 ARGt = 1 peso argentino, así que el monto de la factura en pesos es el monto en ARGt.
import type { Bcra } from "./reglas";

const r2 = (n: number) => Math.round(n * 100) / 100;

export type PlanPago = {
  montoArgt: number;
  /** Lo que sale del saldo de ARGt que la empresa ya tiene. */
  desdeSaldoArgt: number;
  /** Lo que hay que pedir prestado en Morpho para completar el pago. */
  aPedirArgt: number;
  alcanza: boolean;
  /** Si no alcanza: cuánto falta y cuánto USDT0 más de colateral lo cubriría. */
  faltanteArgt: number;
  colateralExtraUsdt0: number;
  /** Lo que le queda después de pagar. */
  quedaSaldoArgt: number;
  quedaParaPedirArgt: number;
};

export function planearPago(p: {
  montoArgt: number;
  saldoArgt: number;
  /** Cuánto ARGt puede pedir hoy (sale de la decisión del agente). */
  disponibleArgt: number;
  /** ARGt que habilita cada USDT0 extra de colateral: precio del oráculo × tope. */
  argtPorUsdt0DeTope: number;
}): PlanPago {
  const desdeSaldoArgt = Math.min(p.saldoArgt, p.montoArgt);
  const aPedirArgt = p.montoArgt - desdeSaldoArgt;
  const alcanza = aPedirArgt <= p.disponibleArgt;
  const faltanteArgt = alcanza ? 0 : aPedirArgt - p.disponibleArgt;
  const colateralExtraUsdt0 =
    faltanteArgt > 0 && p.argtPorUsdt0DeTope > 0 ? Math.ceil((faltanteArgt / p.argtPorUsdt0DeTope) * 100) / 100 : 0;
  return {
    montoArgt: r2(p.montoArgt),
    desdeSaldoArgt: r2(desdeSaldoArgt),
    aPedirArgt: r2(aPedirArgt),
    alcanza,
    faltanteArgt: r2(faltanteArgt),
    colateralExtraUsdt0,
    quedaSaldoArgt: r2(p.saldoArgt - desdeSaldoArgt),
    quedaParaPedirArgt: r2(Math.max(0, p.disponibleArgt - (alcanza ? aPedirArgt : p.disponibleArgt))),
  };
}

export type Alertas = { nivel: "ok" | "aviso" | "grave"; textos: string[] };

/** Perfil del proveedor en el BCRA: avisa, no bloquea; decide la empresa. */
export function alertasProveedor(b: Bcra): Alertas {
  if (!b.ok) return { nivel: "aviso", textos: ["No pudimos consultar al proveedor en el BCRA."] };
  const textos: string[] = [];
  let nivel: Alertas["nivel"] = "ok";
  if (b.situacionMax !== null && b.situacionMax >= 3) {
    nivel = "grave";
    textos.push(`El proveedor está en situación ${b.situacionMax} en el BCRA: revisalo antes de pagarle por adelantado.`);
  } else if (b.situacionMax === 2) {
    nivel = "aviso";
    textos.push("El proveedor está en situación 2 en el BCRA (con atrasos).");
  }
  if (b.chequesRechazados > 0) {
    if (nivel === "ok") nivel = "aviso";
    textos.push(`El proveedor tiene ${b.chequesRechazados} cheque(s) rechazado(s).`);
  }
  if (!textos.length) {
    textos.push(
      b.situacionMax === null ? "El proveedor no tiene deudas registradas en el BCRA." : "El proveedor está en situación 1 (normal) en el BCRA.",
    );
  }
  return { nivel, textos };
}

export type Check = { id: string; titulo: string; ok: boolean; detalle: string };

const fmt = (n: number) => n.toLocaleString("es-AR", { maximumFractionDigits: 2 });

/** Los chequeos que muestra la pantalla al cargar una factura. */
export function armarChecks(p: { proveedor: Bcra; empresa: Bcra; tope: number; plan: PlanPago }): Check[] {
  const ap = alertasProveedor(p.proveedor);
  return [
    { id: "proveedor-bcra", titulo: "Proveedor en el BCRA", ok: ap.nivel !== "grave", detalle: ap.textos.join(" ") },
    {
      id: "empresa-bcra",
      titulo: "Tu perfil en el BCRA",
      ok: p.tope > 0,
      detalle:
        p.tope > 0
          ? `Podés pedir hasta el ${Math.round(p.tope * 100)}% de tu colateral.`
          : "Tu situación en el BCRA no permite pedir ARGt.",
    },
    {
      id: "plata-suficiente",
      titulo: "Plata suficiente para pagar",
      ok: p.plan.alcanza,
      detalle: p.plan.alcanza
        ? `Sale ${fmt(p.plan.desdeSaldoArgt)} ARGt de tu saldo${p.plan.aPedirArgt > 0 ? ` y se piden ${fmt(p.plan.aPedirArgt)} ARGt` : ""}.`
        : `Faltan ${fmt(p.plan.faltanteArgt)} ARGt: dejá ${fmt(p.plan.colateralExtraUsdt0)} USDT0 más de colateral.`,
    },
    {
      id: "disponible-despues",
      titulo: "Disponible después del pago",
      ok: true,
      detalle: `Te quedan ${fmt(p.plan.quedaSaldoArgt)} ARGt en tu wallet y podés pedir ${fmt(p.plan.quedaParaPedirArgt)} ARGt más.`,
    },
  ];
}
