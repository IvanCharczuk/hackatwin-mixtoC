"use client";

// Adaptado de activity-card.tsx de Faro: misma fila (ícono, título, link, monto), con los
// eventos de Morpho de esta wallet y las firmas de esta sesión arriba.
import { ArrowDownLeft, ArrowUpRight, ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import { useMovimientos } from "@/lib/hooks/use-movimientos";
import { useTxsSesion } from "@/lib/sesion";
import { EXPLORER_TX } from "@/lib/tokens";
import { corta } from "@/lib/formato";
import { cn } from "@/lib/utils";

const EYEBROW = "text-[12px] font-semibold uppercase tracking-[2px] text-sun-ink lg:text-[13px]";

type Fila = { hash?: `0x${string}`; titulo: string; monto?: string; timestamp: number; nota?: string; pendiente?: boolean; fallo?: boolean };

// El recorrido de la SPEC, para la demo con NEXT_PUBLIC_MOCK_POSITION=1. Sin hash: no existe en la red.
const ILUSTRATIVOS: Fila[] = [
  { titulo: "Adelanto recibido", monto: "+4.000 ARGt", timestamp: 0, nota: "ilustrativo" },
  { titulo: "Garantía depositada", monto: "+5,09 USDT0", timestamp: 0, nota: "ilustrativo" },
  { titulo: "CHLt congelados", monto: "−5.000 CHLt", timestamp: 0, nota: "ilustrativo" },
];

function cuando(ts: number) {
  if (!ts) return "";
  return new Date(ts * 1000).toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function Movimientos({ address, ilustrativo }: { address: `0x${string}`; ilustrativo: boolean }) {
  const { data, isLoading, error } = useMovimientos(address, !ilustrativo);
  const sesion = useTxsSesion();
  const enLogs = new Set((data ?? []).map((m) => m.hash));
  const filas: Fila[] = [
    ...sesion
      .filter((t) => !enLogs.has(t.hash))
      .map((t) => ({ hash: t.simulada ? undefined : t.hash, titulo: t.titulo, timestamp: t.timestamp, nota: t.simulada ? `simulada · ${corta(t.hash)}` : undefined, pendiente: t.estado === "pendiente", fallo: t.estado === "fallo" })),
    ...(ilustrativo ? ILUSTRATIVOS : (data ?? [])),
  ];

  return (
    <section className="bg-cream">
      <div className="mx-auto w-full max-w-[1248px] px-6 py-[72px] lg:py-[96px]">
        <p className={EYEBROW}>Movimientos</p>
        <h2 className="mt-3 text-[30px] leading-[1.1] font-semibold tracking-[-0.6px] text-navy lg:text-[40px] lg:tracking-[-1px]">Lo que pasó con tu crédito</h2>
        <div className="mt-8 rounded-[22px] border border-line bg-paper px-5 lg:px-7">
          {isLoading && !ilustrativo && filas.length === 0 && (
            <p className="flex items-center gap-2 py-8 text-[15px] text-ink-2">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Leyendo Morpho en Arbitrum…
            </p>
          )}
          {error && <p className="py-4 text-[14px] text-bad">No pudimos leer los movimientos ahora. Reintentamos en 30 s.</p>}
          {!isLoading && filas.length === 0 && (
            <div className="py-10">
              <p className="text-[16px] font-semibold text-navy">Todavía no hay movimientos</p>
              <p className="mt-1 text-[15px] text-ink-2">Cuando dejes garantía o recibas ARGt, lo vas a ver acá con su link a Arbiscan.</p>
            </div>
          )}
          <ul className="divide-y divide-line">
            {filas.map((f, i) => {
              const Icono = f.titulo.startsWith("Garantía") ? ShieldCheck : f.monto?.startsWith("−") ? ArrowUpRight : ArrowDownLeft;
              return (
                <li key={f.hash ?? `${f.titulo}-${i}`} className="flex min-h-16 items-center gap-4 py-4">
                  <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", f.fallo ? "bg-bad/12 text-bad" : "bg-cream-2 text-navy")}>
                    {f.pendiente ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Icono className="size-4" aria-hidden="true" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-navy">
                      {f.titulo}
                      {f.fallo && <span className="ml-2 text-[13px] font-medium text-bad">revertida</span>}
                    </p>
                    {f.hash ? (
                      <a href={`${EXPLORER_TX}${f.hash}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[12px] text-ink-2 underline-offset-2 hover:text-navy hover:underline">
                        {corta(f.hash)}
                        {f.timestamp ? ` · ${cuando(f.timestamp)}` : ""}
                        <ExternalLink className="size-3" aria-hidden="true" />
                      </a>
                    ) : (
                      <p className="font-mono text-[12px] text-ink-2">{f.nota}</p>
                    )}
                  </div>
                  {f.monto && <span className="shrink-0 text-[15px] font-semibold text-navy tabular-nums">{f.monto}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
