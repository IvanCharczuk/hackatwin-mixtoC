"use client";

import { useEffect, useState } from "react";
import { formatUnits, isAddress, keccak256, parseUnits, toHex } from "viem";
import {
  useAccount,
  useBalance,
  useReadContracts,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useAuth } from "@/lib/auth";
import { useT, SelectorIdioma } from "@/lib/i18n";
import { getLocale } from "@/lib/formato";
import { CHAIN_ID, EXPLORER_TX, TOKENS, TOKEN_KEYS, erc20Abi, type TokenKey } from "@/lib/tokens";

type Stage = "idle" | "confirming" | "pending" | "success" | "error";

export default function Page() {
  const { t } = useT();
  const { ready, authenticated, login, logout, mock } = useAuth();
  const { address, chainId } = useAccount();
  const { switchChainAsync, isPending: switching } = useSwitchChain();
  const onArbitrum = chainId === CHAIN_ID;

  const eth = useBalance({ address, chainId: CHAIN_ID, query: { enabled: Boolean(address) } });
  const balances = useReadContracts({
    contracts: TOKEN_KEYS.map((k) => ({
      address: TOKENS[k].address,
      abi: erc20Abi,
      functionName: "balanceOf" as const,
      args: address ? [address] : undefined,
      chainId: CHAIN_ID,
    })),
    query: { enabled: Boolean(address) },
  });

  const [token, setToken] = useState<TokenKey>("ARGt");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState("");
  const { writeContractAsync } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash, chainId: CHAIN_ID, query: { enabled: Boolean(hash) } });

  useEffect(() => {
    if (receipt.isSuccess) {
      setStage(receipt.data.status === "success" ? "success" : "error");
      balances.refetch();
      eth.refetch();
    }
  }, [receipt.isSuccess, receipt.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const busy = stage === "confirming" || stage === "pending";
  const canSend = Boolean(address && isAddress(to) && Number(amount) > 0 && !busy);

  async function send() {
    if (!canSend || !isAddress(to)) return;
    setStage("confirming");
    setError("");
    setHash(undefined);
    if (mock) {
      // Modo demo: no sale nada a la red, sólo se simula el recorrido.
      await new Promise((ok) => setTimeout(ok, 800));
      setHash(keccak256(toHex(`${to}:${amount}:${Date.now()}`)));
      setStage("pending");
      setTimeout(() => setStage("success"), 1200);
      return;
    }
    try {
      if (!onArbitrum) await switchChainAsync({ chainId: CHAIN_ID });
      const txHash = await writeContractAsync({
        address: TOKENS[token].address,
        abi: erc20Abi,
        functionName: "transfer",
        args: [to, parseUnits(amount, TOKENS[token].decimals)],
        chainId: CHAIN_ID,
      });
      setHash(txHash);
      setStage("pending");
    } catch (e) {
      setStage("error");
      setError(e instanceof Error ? e.message.split("\n")[0] : t.falloTx);
    }
  }

  if (!ready) return <main className="p-6">{t.cargando}</main>;

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t.tTitulo}</h1>
        <div className="flex items-center gap-3">
          <SelectorIdioma tono="claro" />
          {authenticated ? (
            <button onClick={logout} className="text-sm underline">{t.salir}</button>
          ) : (
            <button onClick={login} className="rounded bg-neutral-900 px-3 py-1.5 text-sm text-white">{t.entrar}</button>
          )}
        </div>
      </header>

      {mock && (
        <p className="rounded border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
          {t.tDemo}
        </p>
      )}

      {authenticated && address && (
        <>
          <section className="rounded border bg-white p-4 text-sm">
            <div className="font-mono break-all">{address}</div>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-block h-2 w-2 rounded-full ${onArbitrum ? "bg-green-600" : "bg-amber-500"}`} />
              {onArbitrum ? "Arbitrum (42161)" : t.fueraArbitrum(String(chainId ?? "?"))}
              {!onArbitrum && (
                <button
                  onClick={() => switchChainAsync({ chainId: CHAIN_ID })}
                  disabled={switching}
                  className="ml-auto rounded border px-2 py-1 text-xs"
                >
                  {switching ? t.cambiando : t.cambiarArbitrum}
                </button>
              )}
            </div>
          </section>

          <section className="rounded border bg-white p-4 text-sm">
            <h2 className="mb-2 font-medium">{t.saldosEn}</h2>
            <table className="w-full tabular-nums">
              <tbody>
                <tr><td>{t.ethGas}</td><td className="text-right">{eth.data ? Number(formatUnits(eth.data.value, 18)).toFixed(5) : "…"}</td></tr>
                {TOKEN_KEYS.map((k, i) => {
                  const r = balances.data?.[i];
                  const v = r?.status === "success" ? Number(formatUnits(r.result as bigint, TOKENS[k].decimals)).toLocaleString(getLocale(), { maximumFractionDigits: 2 }) : r ? t.errorGenerico : "…";
                  return <tr key={k}><td>{k}</td><td className="text-right">{v}</td></tr>;
                })}
              </tbody>
            </table>
          </section>

          <section className="rounded border bg-white p-4 text-sm">
            <h2 className="mb-2 font-medium">{t.transferir}</h2>
            <div className="flex flex-col gap-2">
              <select id="token" value={token} onChange={(e) => setToken(e.target.value as TokenKey)} className="rounded border p-2">
                {TOKEN_KEYS.map((k) => <option key={k}>{k}</option>)}
              </select>
              <input id="to" value={to} onChange={(e) => setTo(e.target.value.trim())} placeholder={t.destino} className="rounded border p-2 font-mono" />
              <input id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t.monto} inputMode="decimal" className="rounded border p-2" />
              <button onClick={send} disabled={!canSend} className="rounded bg-neutral-900 px-3 py-2 text-white disabled:opacity-40">
                {stage === "confirming" ? t.confirmaEnWallet : stage === "pending" ? t.esperandoRed : t.enviar(token)}
              </button>
              {hash && mock && (
                <p className="break-all text-neutral-600">
                  {stage === "success" ? t.simuladaM : t.simulando}: {hash}
                </p>
              )}
              {hash && !mock && (
                <a href={`${EXPLORER_TX}${hash}`} target="_blank" rel="noreferrer" className="break-all underline">
                  {stage === "success" ? t.confirmada : stage === "error" ? t.revertidaM : t.enviada}: {hash}
                </a>
              )}
              {error && <p className="text-red-700">{error}</p>}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
