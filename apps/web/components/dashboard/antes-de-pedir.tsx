"use client";

import { forwardRef, useMemo, useState } from "react";
import { isAddress } from "viem";
import { Check, ExternalLink, X } from "lucide-react";
import { useChequeo } from "@/lib/hooks/use-credito";
import { usePasos } from "@/lib/hooks/use-pasos";
import { planRecuperar, planRepago, type Credito, type Paso } from "@/lib/credito";
import { EXPLORER_TX } from "@/lib/tokens";
import { corta } from "@/lib/formato";
import { TxButton } from "@/components/tx-button";
import { cn } from "@/lib/utils";

export type Modo = "pedir" | "repagar" | "recuperar";
const EYEBROW = "text-[12px] font-semibold uppercase tracking-[2px] text-sun-ink lg:text-[13px]";
const TITULOS: Record<Modo, string> = { pedir: "Tu plan para financiar el pago", repagar: "Pagar tu saldo", recuperar: "Liberar tu respaldo" };

function Campo({ label, unidad, value, onChange }: { label: string; unidad: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-1 flex-col gap-2">
      <span className="text-[13px] font-semibold text-ink-2">{label}</span>
      <span className="flex items-center gap-2 rounded-[14px] border border-line bg-white px-4 py-3 focus-within:border-navy">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
          inputMode="numeric"
          className="w-full min-w-0 bg-transparent text-[18px] font-semibold text-navy tabular-nums outline-none"
        />
        <span className="text-[13px] font-semibold text-ink-2">{unidad}</span>
      </span>
    </label>
  );
}

export const AntesDePedir = forwardRef<HTMLElement, {
  address: `0x${string}`;
  credito: Credito;
  simular: boolean;
  modo: Modo | null;
  setModo: (m: Modo | null) => void;
}>(function AntesDePedir({ address, credito, simular, modo, setModo }, ref) {
  const [chlt, setChlt] = useState("5000");
  const [argt, setArgt] = useState("4000");
  const [proveedor, setProveedor] = useState("");
  const pagarA = isAddress(proveedor) ? proveedor : undefined;
  const chequeo = useChequeo(address, credito, Number(chlt), Number(argt), pagarA);
  const deudaCero = credito.raw.borrowShares === 0n;
  const puedeRepagar = credito.tienePosicion && !deudaCero;
  const puedeRecuperar = credito.raw.collateral > 0n && deudaCero;

  return (
    <section ref={ref} id="antes-de-pedir" className="scroll-mt-6 bg-paper">
      <div className="mx-auto grid w-full max-w-[1248px] gap-10 px-6 py-[72px] lg:grid-cols-[380px_1fr] lg:gap-20 lg:py-[96px]">
        <div className="flex flex-col gap-6">
          <div>
            <p className={EYEBROW}>Antes de financiar</p>
            <h2 className="mt-3 text-[30px] leading-[1.1] font-semibold tracking-[-0.6px] text-navy lg:text-[40px] lg:tracking-[-1px]">Revisamos seis cosas antes de pagarle a tu proveedor</h2>
            <p className="mt-4 text-[16px] leading-[1.5] text-ink-2">Si algo falla, no arranca y te decimos qué falta. Cada paso después te pide su propia firma.</p>
          </div>
          <div className="flex gap-3">
            <Campo label="CHLt de respaldo" unidad="CHLt" value={chlt} onChange={setChlt} />
            <Campo label="Monto a pagar" unidad="ARGt" value={argt} onChange={setArgt} />
          </div>
          <label className="flex flex-col gap-2">
            <span className="text-[13px] font-semibold text-ink-2">Pagale a</span>
            <input
              id="proveedor"
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value.trim())}
              placeholder="0x… wallet de tu proveedor"
              className="rounded-[14px] border border-line bg-white px-4 py-3 font-mono text-[14px] text-navy outline-none focus:border-navy"
            />
            {proveedor && !pagarA ? <span className="text-[13px] text-bad">No es una dirección válida.</span> : <span className="text-[13px] text-ink-2">{pagarA ? "El ARGt va directo a tu proveedor y el saldo queda a tu nombre." : "Si lo dejás vacío, el ARGt llega a tu wallet."}</span>}
          </label>
          {credito.tienePosicion && (
            <div className="flex flex-wrap gap-3 border-t border-line pt-6">
              <SecButton onClick={() => setModo("repagar")} disabled={!puedeRepagar} activo={modo === "repagar"}>Pagar saldo</SecButton>
              <SecButton onClick={() => setModo("recuperar")} disabled={!puedeRecuperar} activo={modo === "recuperar"}>Liberar respaldo</SecButton>
              {!puedeRecuperar && credito.raw.collateral > 0n && <p className="w-full text-[13px] text-ink-2">El respaldo se libera cuando el saldo queda en cero.</p>}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8">
          <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {(chequeo.data?.chequeos ?? PLACEHOLDER).map((c) => (
              <li key={c.id} className="flex items-start gap-3 border-b border-line py-4">
                <span className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full", !chequeo.data ? "bg-cream-2" : c.ok ? "bg-ok/12 text-ok" : "bg-bad/12 text-bad")}>
                  {chequeo.data && (c.ok ? <Check className="size-3.5" strokeWidth={3} aria-label="pasa" /> : <X className="size-3.5" strokeWidth={3} aria-label="falta" />)}
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-navy">
                    <span className="mr-1.5 font-mono text-[12px] text-ink-2">{c.id}</span>
                    {c.titulo}
                  </p>
                  <p className={cn("text-[14px] leading-[1.4]", chequeo.data && !c.ok ? "font-medium text-bad" : "text-ink-2")}>{chequeo.data ? c.detalle : "Leyendo Arbitrum…"}</p>
                </div>
              </li>
            ))}
          </ul>
          {chequeo.error && <p className="text-[14px] text-bad">No pudimos leer los chequeos: {String(chequeo.error.message).split("\n")[0]}</p>}

          {modo === null ? (
            <div className="flex flex-wrap items-center gap-4">
              <button type="button" onClick={() => setModo("pedir")} className="inline-flex items-center gap-2 rounded-full bg-navy px-[30px] py-4 text-[16px] font-bold text-white hover:bg-navy-deep">
                Ver el plan
              </button>
              <p className="text-[14px] text-ink-2">{chequeo.data ? (chequeo.data.ok ? "Todo en verde: podés empezar." : "Hay chequeos en rojo.") : ""}</p>
            </div>
          ) : (
            <Plan
              key={modo}
              titulo={TITULOS[modo]}
              pasos={modo === "pedir" ? (chequeo.data?.pasos ?? []) : modo === "repagar" ? planRepago(credito, address) : planRecuperar(credito, address)}
              bloqueado={modo === "pedir" && !simular && !chequeo.data?.ok}
              rojo={modo === "pedir" && simular && chequeo.data?.ok === false}
              simular={simular}
              onCerrar={() => setModo(null)}
            />
          )}
        </div>
      </div>
    </section>
  );
});

const PLACEHOLDER = (["C1", "C2", "C3", "C4", "C5", "C6"] as const).map((id) => ({
  id,
  titulo: { C1: "Tenés los CHLt", C2: "Hay gas para firmar", C3: "El cambio a USDT0 rinde", C4: "Hay fondos para financiarte", C5: "Entra en tu límite", C6: "Permisos de los tokens" }[id],
  ok: false,
  detalle: "",
}));

function SecButton({ children, onClick, disabled, activo }: { children: React.ReactNode; onClick: () => void; disabled: boolean; activo: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full border-[1.5px] border-navy px-5 py-2.5 text-[14px] font-semibold text-navy hover:bg-navy/5 disabled:cursor-not-allowed disabled:border-line disabled:text-ink-2/70",
        activo && "bg-navy text-white hover:bg-navy",
      )}
    >
      {children}
    </button>
  );
}

export function Plan({ titulo, pasos, bloqueado, rojo, simular, onCerrar }: { titulo: string; pasos: Paso[]; bloqueado: boolean; rojo: boolean; simular: boolean; onCerrar: () => void }) {
  // Congelamos el plan al abrirlo: si los chequeos se releen en el medio, los pasos no cambian.
  const [fijos] = useState(pasos);
  const plan = useMemo(() => (fijos.length ? fijos : pasos), [fijos, pasos]);
  const { stages, hashes, errores, actual, firmar, listo } = usePasos(plan, simular);

  return (
    <div className="rounded-[22px] border border-line bg-white p-5 shadow-[0_20px_50px_#1b22501a] lg:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[20px] font-semibold text-navy lg:text-[22px]">{titulo}</h3>
          <p className="mt-1 text-[14px] text-ink-2">
            {simular ? "Modo demo: cada firma se simula, no sale nada a la red." : "Una firma por paso. Nada sale sin que lo confirmes."}
          </p>
        </div>
        <button type="button" onClick={onCerrar} aria-label="Cerrar el plan" className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-cream">
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      {rojo && <p className="mt-4 rounded-[14px] bg-cream px-4 py-3 text-[14px] text-ink-2">Con una wallet real este plan no arranca: hay chequeos en rojo.</p>}
      {bloqueado && <p className="mt-4 rounded-[14px] bg-bad/8 px-4 py-3 text-[14px] font-medium text-bad">Resolvé los chequeos en rojo para empezar.</p>}
      {plan.length === 0 && <p className="mt-4 text-[14px] text-ink-2">Armando el plan…</p>}
      <ol className="mt-5 flex flex-col">
        {plan.map((p, i) => (
          <li key={p.id} className="flex flex-col gap-3 border-t border-line py-4 sm:flex-row sm:items-center">
            <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full text-[14px] font-bold", stages[p.id] === "success" ? "bg-ok/12 text-ok" : i === actual ? "bg-sun text-navy-deep" : "bg-cream-2 text-ink-2")}>{i + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-navy">{p.titulo}</p>
              <p className="text-[14px] text-ink-2">{p.detalle}</p>
              {hashes[p.id] &&
                (simular ? (
                  <p className="mt-1 font-mono text-[12px] text-ink-2">simulada · {corta(hashes[p.id])}</p>
                ) : (
                  <a href={`${EXPLORER_TX}${hashes[p.id]}`} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 font-mono text-[12px] text-navy underline underline-offset-2">
                    {corta(hashes[p.id])} <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                ))}
              {errores[p.id] && <p className="mt-1 text-[13px] text-bad">{errores[p.id]}</p>}
            </div>
            <TxButton label="Firmar" successLabel="Firmado" stage={stages[p.id] ?? "idle"} onClick={() => firmar(p)} disabled={bloqueado || i !== actual} className="sm:w-[180px]" />
          </li>
        ))}
      </ol>
      {listo && <p className="mt-2 border-t border-line pt-4 text-[15px] font-semibold text-ok">Listo. {simular ? "Recorrido simulado completo." : "Mirá los movimientos abajo."}</p>}
    </div>
  );
}
