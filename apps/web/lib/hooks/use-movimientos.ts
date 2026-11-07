"use client";

// Adaptado de use-activity.ts de Faro: en vez de Transfer de todos los tokens, los eventos de
// Morpho del mercado ARGt/USDT0 para esta wallet.
import { useQuery } from "@tanstack/react-query";
import { formatUnits, getAbiItem, type AbiEvent } from "viem";
import { usePublicClient } from "wagmi";
import { CHAIN_ID } from "@/lib/tokens";
import { MARKET_ID, MORPHO, morphoAbi } from "@/lib/morpho";

// ponytail: el RPC público acepta hasta ~100k bloques por getLogs (unas 7 h en Arbitrum).
// Leemos 4 ventanas (~28 h), suficiente para la demo. Para más, un RPC con API key.
const SPAN = 100_000n;
const VENTANAS = 4;

const EVENTOS = {
  SupplyCollateral: { titulo: "Respaldo depositado", token: "USDT0", decimals: 6, signo: "+" },
  Borrow: { titulo: "Pago financiado", token: "ARGt", decimals: 18, signo: "+" },
  Repay: { titulo: "Pago de tu saldo", token: "ARGt", decimals: 18, signo: "−" },
  WithdrawCollateral: { titulo: "Respaldo liberado", token: "USDT0", decimals: 6, signo: "−" },
} as const;
type Evento = keyof typeof EVENTOS;

export type Movimiento = {
  hash: `0x${string}`;
  titulo: string;
  monto: string;
  timestamp: number;
};

export function useMovimientos(address: `0x${string}` | undefined, enabled = true) {
  const client = usePublicClient({ chainId: CHAIN_ID });
  return useQuery({
    queryKey: ["movimientos", address],
    enabled: Boolean(address && client) && enabled,
    refetchInterval: 30_000,
    queryFn: async (): Promise<Movimiento[]> => {
      const latest = await client!.getBlockNumber();
      const out: (Omit<Movimiento, "timestamp"> & { blockNumber: bigint })[] = [];
      for (let i = 0; i < VENTANAS; i++) {
        const toBlock = latest - SPAN * BigInt(i);
        const fromBlock = toBlock - SPAN + 1n;
        // Una llamada por evento: onBehalf está indexado en posiciones distintas en cada uno.
        const logs = await Promise.all(
          (Object.keys(EVENTOS) as Evento[]).map(async (name) => {
            const found = await client!.getLogs({
              address: MORPHO,
              event: getAbiItem({ abi: morphoAbi, name }) as AbiEvent,
              args: { id: MARKET_ID, onBehalf: address },
              fromBlock,
              toBlock,
            });
            return found.map((log) => ({ name, log }));
          }),
        );
        for (const { name, log } of logs.flat()) {
          const e = EVENTOS[name];
          const assets = (log.args as { assets?: bigint }).assets ?? 0n;
          out.push({
            hash: log.transactionHash!,
            titulo: e.titulo,
            monto: `${e.signo}${Number(formatUnits(assets, e.decimals)).toLocaleString("es-AR", { maximumFractionDigits: 2 })} ${e.token}`,
            blockNumber: log.blockNumber!,
          });
        }
      }
      const blocks = [...new Set(out.map((m) => m.blockNumber))];
      const stamps = new Map(
        await Promise.all(blocks.map(async (n) => [n, Number((await client!.getBlock({ blockNumber: n })).timestamp)] as const)),
      );
      return out
        .map(({ blockNumber, ...m }) => ({ ...m, timestamp: stamps.get(blockNumber) ?? 0 }))
        .sort((a, b) => b.timestamp - a.timestamp);
    },
  });
}
