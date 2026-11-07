"use client";

// Adaptado de activity-card.tsx de Faro: misma fila (ícono, título, link, monto), con los
// eventos de Morpho de esta wallet y las firmas de esta sesión arriba.
import { ArrowDownLeft, ArrowUpRight, ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import { useMovimientos, type Evento } from "@/lib/hooks/use-movimientos";
import { useTxsSesion } from "@/lib/sesion";
import { EXPLORER_TX } from "@/lib/tokens";
import { corta } from "@/lib/formato";
import { useT, LOCALES } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const EYEBROW = "text-[12px] font-semibold uppercase tracking-[2px] text-sun-ink lg:text-[13px]";

type Clave = Evento | "Congelados";
type Fila = {
  hash?: `0x${string}`;
  clave?: Clave;
  /** Título ya escrito (firmas de esta sesión, en el idioma en que se firmaron). */
  texto?: string;
  signo?: "+" | "−";
  valor?: number;
  token?: string;
  timestamp: number;
  nota?: string;
  ilustrativa?: boolean;
  pendiente?: boolean;
  fallo?: boolean;
};

// El recorrido de la SPEC, para la demo con NEXT_PUBLIC_MOCK_POSITION=1. Sin hash: no existe en la red.
const ILUSTRATIVOS: Fila[] = [
  { clave: "Borrow", signo: "+", valor: 4000, token: "ARGt", timestamp: 0, ilustrativa: true },
  { clave: "SupplyCollateral", signo: "+", valor: 5.09, token: "USDT0", timestamp: 0, ilustrativa: true },
  { clave: "Congelados", signo: "−", valor: 5000, token: "CHLt", timestamp: 0, ilustrativa: true },
];

function cuando(ts: number, loc: string) {
  if (!ts) return "";
  return new Date(ts * 1000).toLocaleString(loc, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function Movimientos({ address, ilustrativo }: { address: `0x${string}`; ilustrativo: boolean }) {
  const { t, lang } = useT();
  const loc = LOCALES[lang];
  const { data, isLoading, error } = useMovimientos(address, !ilustrativo);
  const sesion = useTxsSesion();
  const enLogs = new Set((data ?? []).map((m) => m.hash));
  const filas: Fila[] = [
    ...sesion
      .filter((x) => !enLogs.has(x.hash))
      .map((x) => ({ hash: x.simulada ? undefined : x.hash, texto: x.titulo, timestamp: x.timestamp, nota: x.simulada ? `${t.simulada} · ${corta(x.hash)}` : undefined, pendiente: x.estado === "pendiente", fallo: x.estado === "fallo" })),
    ...(ilustrativo ? ILUSTRATIVOS : (data ?? [])),
  ];

  return (
    <section className="bg-cream">
      <div className="mx-auto w-full max-w-[1248px] px-6 py-[72px] lg:py-[96px]">
        <p className={EYEBROW}>{t.movEyebrow}</p>
        <h2 className="mt-3 text-[30px] leading-[1.1] font-semibold tracking-[-0.6px] text-navy lg:text-[40px] lg:tracking-[-1px]">{t.movTitulo}</h2>
        <div className="mt-8 rounded-[22px] border border-line bg-paper px-5 lg:px-7">
          {isLoading && !ilustrativo && filas.length === 0 && (
            <p className="flex items-center gap-2 py-8 text-[15px] text-ink-2">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> {t.movLeyendo}
            </p>
          )}
          {error && <p className="py-4 text-[14px] text-bad">{t.movError}</p>}
          {!isLoading && filas.length === 0 && (
            <div className="py-10">
              <p className="text-[16px] font-semibold text-navy">{t.movVacioTitulo}</p>
              <p className="mt-1 text-[15px] text-ink-2">{t.movVacioTexto}</p>
            </div>
          )}
          <ul className="divide-y divide-line">
            {filas.map((f, i) => {
              const titulo = f.clave ? t.ev[f.clave] : (f.texto ?? "");
              const montoTxt = f.valor !== undefined ? `${f.signo}${f.valor.toLocaleString(loc, { maximumFractionDigits: 2 })} ${f.token}` : undefined;
              const Icono = f.clave === "SupplyCollateral" || f.clave === "WithdrawCollateral" ? ShieldCheck : f.signo === "−" ? ArrowUpRight : ArrowDownLeft;
              return (
                <li key={f.hash ?? `${titulo}-${i}`} className="flex min-h-16 items-center gap-4 py-4">
                  <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", f.fallo ? "bg-bad/12 text-bad" : "bg-cream-2 text-navy")}>
                    {f.pendiente ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Icono className="size-4" aria-hidden="true" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-navy">
                      {titulo}
                      {f.fallo && <span className="ml-2 text-[13px] font-medium text-bad">{t.revertida}</span>}
                    </p>
                    {f.hash ? (
                      <a href={`${EXPLORER_TX}${f.hash}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[12px] text-ink-2 underline-offset-2 hover:text-navy hover:underline">
                        {corta(f.hash)}
                        {f.timestamp ? ` · ${cuando(f.timestamp, loc)}` : ""}
                        <ExternalLink className="size-3" aria-hidden="true" />
                      </a>
                    ) : (
                      <p className="font-mono text-[12px] text-ink-2">{f.ilustrativa ? t.ilustrativo : f.nota}</p>
                    )}
                  </div>
                  {montoTxt && <span className="shrink-0 text-[15px] font-semibold text-navy tabular-nums">{montoTxt}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
