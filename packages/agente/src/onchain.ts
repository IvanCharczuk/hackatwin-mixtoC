// Lecturas reales en Arbitrum: saldos, historial y posición en Morpho.
import { createPublicClient, http, isAddress, getAddress, formatUnits, parseAbi } from "viem";
import { arbitrum } from "viem/chains";
import { TOKENS, MORPHO_BLUE, MERCADO_ARGT_USDT0, RPC_DEFAULT } from "./direcciones";
import type { Mercado, Posicion } from "./reglas";

const erc20 = parseAbi(["function balanceOf(address) view returns (uint256)"]);
const morpho = parseAbi([
  "function market(bytes32 id) view returns (uint128 totalSupplyAssets, uint128 totalSupplyShares, uint128 totalBorrowAssets, uint128 totalBorrowShares, uint128 lastUpdate, uint128 fee)",
  "function position(bytes32 id, address user) view returns (uint256 supplyShares, uint128 borrowShares, uint128 collateral)",
]);
const oracle = parseAbi(["function price() view returns (uint256)"]);

export type Onchain = {
  wallet: string;
  saldos: { ARGt: number; CHLt: number; USDT0: number };
  transacciones: number;
  posicion: Posicion;
  mercado: Mercado;
};

export function normalizarWallet(w: string): `0x${string}` {
  if (!isAddress(w)) throw new Error(`Wallet inválida: «${w}» no es una dirección.`);
  return getAddress(w);
}

async function tasaAnual(): Promise<number | null> {
  try {
    const r = await fetch("https://blue-api.morpho.org/graphql", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: `{ marketByUniqueKey(uniqueKey: "${MERCADO_ARGT_USDT0.id}", chainId: 42161) { state { borrowApy } } }`,
      }),
      signal: AbortSignal.timeout(6_000),
    });
    const j: any = await r.json();
    const v = j?.data?.marketByUniqueKey?.state?.borrowApy;
    return typeof v === "number" ? v : null;
  } catch {
    return null;
  }
}

export async function leerOnchain(walletEntrada: string, rpc = process.env.ARBITRUM_RPC_URL || RPC_DEFAULT): Promise<Onchain> {
  const wallet = normalizarWallet(walletEntrada);
  const client = createPublicClient({ chain: arbitrum, transport: http(rpc, { timeout: 15_000 }) });
  const id = MERCADO_ARGT_USDT0.id as `0x${string}`;
  const bal = (t: keyof typeof TOKENS) =>
    client.readContract({ address: TOKENS[t].address, abi: erc20, functionName: "balanceOf", args: [wallet] });

  const [argt, chlt, usdt0, txs, m, p, precio, tasa] = await Promise.all([
    bal("ARGt"),
    bal("CHLt"),
    bal("USDT0"),
    client.getTransactionCount({ address: wallet }),
    client.readContract({ address: MORPHO_BLUE, abi: morpho, functionName: "market", args: [id] }),
    client.readContract({ address: MORPHO_BLUE, abi: morpho, functionName: "position", args: [id, wallet] }),
    client.readContract({ address: MERCADO_ARGT_USDT0.oracle, abi: oracle, functionName: "price" }),
    tasaAnual(),
  ]);

  const [totalSupplyAssets, , totalBorrowAssets, totalBorrowShares] = m;
  const [, borrowShares, collateral] = p;
  const deudaRaw = totalBorrowShares > 0n ? (borrowShares * totalBorrowAssets + totalBorrowShares - 1n) / totalBorrowShares : 0n;
  // Oráculo de Morpho: ARGt(raw) = USDT0(raw) × price / 1e36. Para 1 USDT0 (1e6 raw) en ARGt (18 decimales): price / 1e48.
  const precioArgtPorUsdt0 = Number(formatUnits(precio, 48));

  return {
    wallet,
    saldos: {
      ARGt: Number(formatUnits(argt, 18)),
      CHLt: Number(formatUnits(chlt, 18)),
      USDT0: Number(formatUnits(usdt0, 6)),
    },
    transacciones: txs,
    posicion: {
      colateralUsdt0: Number(formatUnits(collateral, 6)),
      deudaArgt: Number(formatUnits(deudaRaw, 18)),
    },
    mercado: {
      liquidezArgt: Number(formatUnits(totalSupplyAssets - totalBorrowAssets, 18)),
      precioArgtPorUsdt0,
      lltv: MERCADO_ARGT_USDT0.lltv,
      tasaAnual: tasa,
    },
  };
}
