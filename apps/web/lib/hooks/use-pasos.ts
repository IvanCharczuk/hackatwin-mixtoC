"use client";

import { useState } from "react";
import { keccak256, toHex } from "viem";
import { useConfig, useSendTransaction, useSwitchChain, useAccount } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { useQueryClient } from "@tanstack/react-query";
import { CHAIN_ID } from "@/lib/tokens";
import { agregarTx, marcarTx } from "@/lib/sesion";
import type { Paso } from "@/lib/credito";
import type { TxButtonStage } from "@/components/tx-button";

/**
 * Ejecuta un plan paso a paso. Cada paso es un click de una persona y una firma propia:
 * el siguiente se habilita solo cuando el anterior quedó confirmado en la red (regla 4).
 * En modo demo no sale nada a la red: se simula el recorrido con un hash falso.
 */
export function usePasos(pasos: Paso[], simular: boolean) {
  const config = useConfig();
  const queryClient = useQueryClient();
  const { chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();
  const [stages, setStages] = useState<Record<string, TxButtonStage>>({});
  const [hashes, setHashes] = useState<Record<string, `0x${string}`>>({});
  const [errores, setErrores] = useState<Record<string, string>>({});

  const hechos = pasos.filter((p) => stages[p.id] === "success").length;
  const actual = pasos.findIndex((p) => stages[p.id] !== "success");
  const set = (id: string, s: TxButtonStage) => setStages((prev) => ({ ...prev, [id]: s }));

  async function firmar(paso: Paso) {
    set(paso.id, "confirming");
    setErrores((e) => ({ ...e, [paso.id]: "" }));
    try {
      let hash: `0x${string}`;
      if (simular) {
        await new Promise((ok) => setTimeout(ok, 700));
        hash = keccak256(toHex(`${paso.id}:${Date.now()}`));
      } else {
        if (chainId !== CHAIN_ID) await switchChainAsync({ chainId: CHAIN_ID });
        hash = await sendTransactionAsync({ ...paso.tx, chainId: CHAIN_ID });
      }
      setHashes((h) => ({ ...h, [paso.id]: hash }));
      agregarTx({ hash, titulo: paso.titulo, estado: "pendiente", simulada: simular, timestamp: Date.now() / 1000 });
      set(paso.id, "pending");
      let ok = true;
      if (simular) await new Promise((r) => setTimeout(r, 900));
      else ok = (await waitForTransactionReceipt(config, { hash, chainId: CHAIN_ID })).status === "success";
      marcarTx(hash, ok ? "ok" : "fallo");
      set(paso.id, ok ? "success" : "error");
      if (!ok) setErrores((e) => ({ ...e, [paso.id]: "La transacción se revirtió." }));
      void queryClient.invalidateQueries();
    } catch (err) {
      set(paso.id, "error");
      setErrores((e) => ({ ...e, [paso.id]: err instanceof Error ? err.message.split("\n")[0] : "Falló la firma." }));
    }
  }

  function reiniciar() {
    setStages({});
    setHashes({});
    setErrores({});
  }

  return { stages, hashes, errores, hechos, actual, firmar, reiniciar, listo: pasos.length > 0 && hechos === pasos.length };
}
