"use client";

// Transacciones que mandó (o simuló) esta pestaña. Se muestran arriba de "Movimientos" apenas
// salen, antes de que el evento de Morpho aparezca en los logs.
import { useSyncExternalStore } from "react";

export type TxSesion = {
  hash: `0x${string}`;
  titulo: string;
  estado: "pendiente" | "ok" | "fallo";
  simulada: boolean;
  timestamp: number;
};

let txs: TxSesion[] = [];
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

export function agregarTx(tx: TxSesion) {
  txs = [tx, ...txs.filter((t) => t.hash !== tx.hash)];
  emit();
}

export function marcarTx(hash: `0x${string}`, estado: TxSesion["estado"]) {
  txs = txs.map((t) => (t.hash === hash ? { ...t, estado } : t));
  emit();
}

const EMPTY: TxSesion[] = [];

export function useTxsSesion() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => txs,
    () => EMPTY,
  );
}
