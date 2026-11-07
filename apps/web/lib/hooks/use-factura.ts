"use client";

// Recorrido de /app: empresa (BCRA) → factura (PDF con Claude o la de ejemplo) →
// cuánto dan tus CHLt → ¿podés pagarla? → chequeos C1 a C6 y plan de firmas.
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { parseUnits, formatUnits } from "viem";
import { useBalance, usePublicClient, useReadContracts } from "wagmi";
import { CHAIN_ID, TOKENS, erc20Abi } from "@/lib/tokens";
import { POOL_CHLT_USDT0, TOPE, curveAbi } from "@/lib/morpho";
import { useChequeo } from "@/lib/hooks/use-credito";
import type { Credito } from "@/lib/credito";

export type Bcra = {
  ok: boolean;
  denominacion?: string;
  periodo?: string;
  situacionMax?: number | null;
  entidades?: number;
  chequesRechazados?: number;
  deudaTotalArs?: number;
};
export type CheckAgente = { id: string; titulo: string; ok: boolean; detalle: string };
export type FacturaVista = {
  ok: boolean;
  problemas: string[];
  tipo: string;
  razonSocialEmisor: string;
  cuitEmisor: string;
  razonSocialReceptor: string;
  cuitReceptor?: string;
  receptorCoincide: boolean;
  numeroCompleto: string;
  cae: string;
  fechaEmision: string;
  vencimientoPago: string;
  total: number;
  moneda: string;
  /** Wallet del proveedor si la factura la trae (forma de pago u observaciones). */
  walletProveedor?: string;
};
export type ResultadoAgente = {
  perfil: { bcra: Bcra };
  pago: { proveedor: Bcra; checks: CheckAgente[] } | null;
  explicacion: { texto: string; fuente: "claude" | "armada" };
};

const soloDigitos = (s: string) => s.replace(/\D/g, "");

async function postAgente(body: object): Promise<ResultadoAgente> {
  const r = await fetch("/api/agente", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(j.error ?? `El agente respondió ${r.status}`);
  return j;
}

/** Perfil de la empresa en el BCRA para el encabezado. Se pide una vez por CUIT. */
export function useEmpresa(cuit: string, wallet: `0x${string}` | undefined) {
  const c = soloDigitos(cuit);
  return useQuery({
    queryKey: ["empresa", c, wallet],
    enabled: c.length === 11 && Boolean(wallet),
    staleTime: 10 * 60_000,
    queryFn: () => postAgente({ cuit: c, wallet, conExplicacion: false }),
  });
}

/** Saldos de la wallet en Arbitrum. */
export function useSaldos(address: `0x${string}` | undefined) {
  const eth = useBalance({ address, chainId: CHAIN_ID, query: { enabled: Boolean(address) } });
  const keys = ["CHLt", "ARGt", "USDT0"] as const;
  const r = useReadContracts({
    contracts: keys.map((k) => ({ address: TOKENS[k].address, abi: erc20Abi, functionName: "balanceOf" as const, args: address ? [address] : undefined, chainId: CHAIN_ID })),
    query: { enabled: Boolean(address), refetchInterval: 15_000 },
  });
  const val = (i: number) => {
    const x = r.data?.[i];
    return x?.status === "success" ? Number(formatUnits(x.result as bigint, TOKENS[keys[i]].decimals)) : undefined;
  };
  return {
    chlt: val(0),
    argt: val(1),
    usdt0: val(2),
    eth: eth.data ? Number(formatUnits(eth.data.value, 18)) : undefined,
    cargando: r.isLoading || eth.isLoading,
  };
}

export type Fase = "vacio" | "leyendo" | "evaluando" | "listo" | "error";

/** Leer la factura (PDF propio o la de ejemplo) y correr el agente. */
export function useFactura() {
  const [fase, setFase] = useState<Fase>("vacio");
  const [factura, setFactura] = useState<FacturaVista | null>(null);
  const [resultado, setResultado] = useState<ResultadoAgente | null>(null);
  const [error, setError] = useState("");

  function reiniciar() {
    setFase("vacio");
    setFactura(null);
    setResultado(null);
    setError("");
  }

  async function leerArchivo(archivo: File, cuit: string, wallet: string, colateralUsdt0?: number) {
    reiniciar();
    setFase("leyendo");
    const fd = new FormData();
    fd.append("archivo", archivo);
    fd.append("cuit", soloDigitos(cuit));
    fd.append("wallet", wallet);
    if (colateralUsdt0) fd.append("colateralUsdt0", String(colateralUsdt0));
    try {
      const r = await fetch("/api/agente/factura", { method: "POST", body: fd });
      const j = await r.json();
      if (j.error) throw new Error(j.error);
      setFactura(j.factura);
      setResultado(j.resultado);
      setFase(j.factura?.ok ? "listo" : "error");
      if (!j.factura?.ok) setError(j.factura?.problemas?.join(" ") || "La factura no pasó la validación.");
    } catch (e) {
      setFase("error");
      setError(e instanceof Error ? e.message : "No pudimos leer la factura.");
    }
  }

  async function usarFactura(f: FacturaVista, cuit: string, wallet: string, colateralUsdt0?: number) {
    reiniciar();
    setFactura(f);
    setFase("evaluando");
    try {
      const r = await postAgente({ cuit: soloDigitos(cuit), wallet, colateralUsdt0, factura: { cuitProveedor: f.cuitEmisor, montoArs: f.total, numero: f.numeroCompleto } });
      setResultado(r);
      setFase("listo");
    } catch (e) {
      setFase("error");
      setError(e instanceof Error ? e.message : "El agente no respondió.");
    }
  }

  return { fase, factura, resultado, error, leerArchivo, usarFactura, reiniciar };
}

/**
 * ¿Te alcanzan los CHLt para pagar `total` ARGt? Cuánto límite dan tus CHLt al 60 %
 * (Curve CHLt→USDT0 × oráculo de Morpho), cuántos CHLt hacen falta y los chequeos C1 a C6
 * sobre esa cantidad. ponytail: lineal en CHLt con 3 % de margen (el tope de impacto de C3); C5 hace la cuenta exacta.
 */
export function useCapacidad(address: `0x${string}` | undefined, credito: Credito | undefined, saldoChlt: number | undefined, total: number | undefined, pagarA?: `0x${string}`) {
  const client = usePublicClient({ chainId: CHAIN_ID });
  const limite = useQuery({
    queryKey: ["limite-chlt", saldoChlt, credito?.argtPorUsdt0],
    enabled: Boolean(client && credito) && saldoChlt !== undefined,
    refetchInterval: 15_000,
    queryFn: async () => {
      const muestra = saldoChlt! > 0 ? saldoChlt! : 1000;
      const dy = await client!.readContract({ address: POOL_CHLT_USDT0, abi: curveAbi, functionName: "get_dy", args: [0n, 1n, parseUnits(String(muestra), 18)] });
      const usdt0 = Number(formatUnits(dy, 6));
      const porChlt = (usdt0 * credito!.argtPorUsdt0 * TOPE) / muestra;
      return { porChlt, deTusChlt: saldoChlt! * porChlt };
    },
  });

  const libreActual = credito ? Math.max(0, credito.garantiaEnArgt * TOPE - credito.deudaArgt) : 0;
  const porChlt = limite.data?.porChlt;
  const necesarios = total !== undefined && porChlt ? Math.max(0, (total - libreActual) / porChlt) * 1.03 : undefined;
  const faltan = necesarios !== undefined && saldoChlt !== undefined ? Math.max(0, necesarios - saldoChlt) : undefined;
  // Se chequea con lo que hace falta (o con todo tu saldo si no alcanza), para que C1 y C5 cuenten la verdad.
  const chltAUsar = necesarios !== undefined && saldoChlt !== undefined ? Math.max(1, Math.ceil(faltan! > 0 ? Math.max(necesarios, saldoChlt) : necesarios)) : 0;
  const chequeo = useChequeo(address, credito, chltAUsar, total ?? 0, pagarA);
  const listo = Boolean(chequeo.data) && faltan !== undefined;

  return {
    limiteTotal: limite.data ? limite.data.deTusChlt + libreActual : undefined,
    porChlt,
    necesarios,
    faltan,
    chltAUsar,
    chequeo,
    listo,
    alcanza: listo && faltan === 0 && chequeo.data!.ok,
  };
}
