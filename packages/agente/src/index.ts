// Agente: perfil (BCRA + onchain) → tope → cuánto ARGt puede pedir → explicación.
// No firma ni manda nada: la transacción la ejecuta el circuito con confirmación de una persona.
import { consultarBcra, normalizarCuit } from "./bcra";
import { leerOnchain, normalizarWallet, type Onchain } from "./onchain";
import { decidir, type Bcra, type Decision } from "./reglas";
import { explicar } from "./explicar";

export type { Bcra, Decision, Onchain };
export { decidir, topePorPerfil } from "./reglas";

export type Pedido = {
  cuit: string;
  wallet: string;
  colateralUsdt0?: number;
  pedidoArgt?: number;
  conExplicacion?: boolean;
};

export type Resultado = {
  perfil: { bcra: Bcra; onchain: Onchain };
  decision: Decision;
  explicacion: { texto: string; fuente: "claude" | "armada"; error?: string };
  consultadoEn: string;
};

function numeroOpcional(v: unknown, nombre: string): number | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) throw new Error(`${nombre} inválido: tiene que ser un número mayor o igual a 0.`);
  return n;
}

export async function evaluar(p: Pedido): Promise<Resultado> {
  // Validar antes de salir a la red: errores claros para el endpoint (400).
  const cuit = normalizarCuit(p.cuit);
  const wallet = normalizarWallet(p.wallet);
  const colateralExtraUsdt0 = numeroOpcional(p.colateralUsdt0, "colateralUsdt0");
  const pedidoArgt = numeroOpcional(p.pedidoArgt, "pedidoArgt");

  const [bcra, onchain] = await Promise.all([consultarBcra(cuit), leerOnchain(wallet)]);
  const decision = decidir({ bcra, mercado: onchain.mercado, posicion: onchain.posicion, colateralExtraUsdt0, pedidoArgt });
  const explicacion =
    p.conExplicacion === false
      ? { texto: "", fuente: "armada" as const }
      : await explicar(decision, bcra, onchain);
  return { perfil: { bcra, onchain }, decision, explicacion, consultadoEn: new Date().toISOString() };
}
