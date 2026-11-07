"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useBlockNumber, usePublicClient } from "wagmi";
import { CHAIN_ID } from "@/lib/tokens";
import { MOCK_POSITION } from "@/lib/mock";
import { useT, LOCALES } from "@/lib/i18n";
import { CREDITO_ILUSTRATIVO, chequear, leerCredito, type Credito } from "@/lib/credito";

/** Posición en Morpho + mercado, releída en cada bloque nuevo que ve wagmi (poll de ~4 s). */
export function useCredito(address: `0x${string}` | undefined) {
  const client = usePublicClient({ chainId: CHAIN_ID });
  const { data: block } = useBlockNumber({ chainId: CHAIN_ID, watch: !MOCK_POSITION });
  const query = useQuery({
    queryKey: ["credito", address],
    enabled: Boolean(address && client) && !MOCK_POSITION,
    queryFn: () => leerCredito(client!, address!),
  });
  const { refetch } = query;
  useEffect(() => {
    if (block !== undefined && address && !MOCK_POSITION) void refetch();
  }, [block, address, refetch]);

  if (MOCK_POSITION) return { data: CREDITO_ILUSTRATIVO as Credito, isLoading: false, error: null, block };
  return { data: query.data, isLoading: query.isLoading, error: query.error, block };
}

export function useChequeo(address: `0x${string}` | undefined, credito: Credito | undefined, chlt: number, argt: number, pagarA?: `0x${string}`) {
  const client = usePublicClient({ chainId: CHAIN_ID });
  const { t, lang } = useT();
  return useQuery({
    queryKey: ["chequeo", lang, address, chlt, argt, pagarA, credito?.ilustrativo, credito?.deudaArgt.toFixed(2)],
    enabled: Boolean(address && client && credito) && chlt > 0 && argt > 0,
    queryFn: () => chequear(client!, address!, credito!, chlt, argt, pagarA, t, LOCALES[lang]),
    refetchInterval: 15_000,
    placeholderData: (prev) => prev,
  });
}
