// Agente: perfil (BCRA + onchain) → tope → cuánto ARGt puede pedir → (si hay
// factura) de dónde se paga y qué queda → explicación.
// No firma ni manda nada: la transacción la ejecuta el circuito con confirmación de una persona.
import { keccak256, toHex } from "viem";
import { consultarBcra, normalizarCuit } from "./bcra";
import { leerOnchain, normalizarWallet, type Onchain } from "./onchain";
import { decidir, type Bcra, type Decision } from "./reglas";
import { planearPago, alertasProveedor, armarChecks, type PlanPago, type Alertas, type Check } from "./pago";
import { explicar } from "./explicar";

export type { Bcra, Decision, Onchain, PlanPago, Alertas, Check };
export { decidir, topePorPerfil } from "./reglas";
export { planearPago, alertasProveedor, armarChecks } from "./pago";

type BcraSimulado = { situacion: number | null; chequesRechazados?: number };

export type Factura = {
  /** CUIT del proveedor que emitió la factura. */
  cuitProveedor: string;
  /** Monto a pagar en pesos (= ARGt). */
  montoArs: number;
  numero?: string;
  /** Perfil del proveedor de ejemplo, para la demo. */
  bcraSimulado?: BcraSimulado;
};

export type Pedido = {
  cuit: string;
  wallet: string;
  colateralUsdt0?: number;
  pedidoArgt?: number;
  conExplicacion?: boolean;
  /**
   * Perfil del BCRA de ejemplo, para mostrar en la demo cómo recorta o rechaza
   * sin exponer a una empresa real. Si viene, no se consulta al BCRA.
   */
  bcraSimulado?: BcraSimulado;
  /** Factura a pagar con ARGt: suma el perfil del proveedor y el plan de pago. */
  factura?: Factura;
};

export type Pago = {
  factura: { cuitProveedor: string; montoArs: number; numero: string | null; id: string };
  proveedor: Bcra;
  alertas: Alertas;
  plan: PlanPago;
  checks: Check[];
};

export type Resultado = {
  perfil: { bcra: Bcra; onchain: Onchain };
  decision: Decision;
  pago: Pago | null;
  explicacion: { texto: string; fuente: "claude" | "armada"; error?: string };
  consultadoEn: string;
};

function perfilSimulado(s: BcraSimulado, denominacion: string): Bcra {
  const situacion = s.situacion === null || s.situacion === undefined ? null : Number(s.situacion);
  if (situacion !== null && !(Number.isInteger(situacion) && situacion >= 1 && situacion <= 5)) {
    throw new Error("bcraSimulado.situacion inválida: tiene que ser 1 a 5 o null.");
  }
  const cheques = Number(s.chequesRechazados ?? 0);
  if (!Number.isInteger(cheques) || cheques < 0) throw new Error("bcraSimulado.chequesRechazados inválido.");
  return {
    ok: true,
    simulado: true,
    denominacion,
    situacionMax: situacion,
    deudaTotalArs: 0,
    entidades: situacion === null ? 0 : 1,
    chequesRechazados: cheques,
  };
}

function numeroOpcional(v: unknown, nombre: string): number | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) throw new Error(`${nombre} inválido: tiene que ser un número mayor o igual a 0.`);
  return n;
}

/** Identificador de la factura: sólo el hash viaja a la cadena, nunca los datos fiscales. */
export function idFactura(cuitProveedor: string, numero: string | null, montoArs: number): string {
  return keccak256(toHex(`${cuitProveedor}|${numero ?? ""}|${montoArs}`));
}

export async function evaluar(p: Pedido): Promise<Resultado> {
  // Validar antes de salir a la red: errores claros para el endpoint (400).
  const cuit = normalizarCuit(p.cuit);
  const wallet = normalizarWallet(p.wallet);
  const colateralExtraUsdt0 = numeroOpcional(p.colateralUsdt0, "colateralUsdt0");
  const pedidoArgt = numeroOpcional(p.pedidoArgt, "pedidoArgt");
  let factura: Pago["factura"] | null = null;
  if (p.factura) {
    const cuitProveedor = normalizarCuit(p.factura.cuitProveedor);
    const montoArs = numeroOpcional(p.factura.montoArs, "factura.montoArs");
    if (!montoArs) throw new Error("factura.montoArs inválido: tiene que ser mayor a 0.");
    const numero = p.factura.numero ? String(p.factura.numero).slice(0, 40) : null;
    factura = { cuitProveedor, montoArs, numero, id: idFactura(cuitProveedor, numero, montoArs) };
  }

  const empresaSim = p.bcraSimulado ? perfilSimulado(p.bcraSimulado, "Empresa de ejemplo") : null;
  const proveedorSim = p.factura?.bcraSimulado ? perfilSimulado(p.factura.bcraSimulado, "Proveedor de ejemplo") : null;
  const [bcra, onchain, proveedor] = await Promise.all([
    empresaSim ?? consultarBcra(cuit),
    leerOnchain(wallet),
    factura ? (proveedorSim ?? consultarBcra(factura.cuitProveedor)) : Promise.resolve(null),
  ]);
  const decision = decidir({ bcra, mercado: onchain.mercado, posicion: onchain.posicion, colateralExtraUsdt0, pedidoArgt });

  let pago: Pago | null = null;
  if (factura && proveedor) {
    const plan = planearPago({
      montoArgt: factura.montoArs,
      saldoArgt: onchain.saldos.ARGt,
      disponibleArgt: decision.disponibleArgt,
      argtPorUsdt0DeTope: onchain.mercado.precioArgtPorUsdt0 * decision.tope,
    });
    pago = {
      factura,
      proveedor,
      alertas: alertasProveedor(proveedor),
      plan,
      checks: armarChecks({ proveedor, empresa: bcra, tope: decision.tope, plan }),
    };
  }

  const explicacion =
    p.conExplicacion === false
      ? { texto: "", fuente: "armada" as const }
      : await explicar(decision, bcra, onchain, pago);
  return { perfil: { bcra, onchain }, decision, pago, explicacion, consultadoEn: new Date().toISOString() };
}
