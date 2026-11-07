"use client";

// Un botón paga la factura: corre los pasos en orden y la lista se va tildando con su link a Arbiscan.
import { useState } from "react";
import { Check, ExternalLink, Loader2, X } from "lucide-react";
import { usePasos } from "@/lib/hooks/use-pasos";
import { EXPLORER_TX } from "@/lib/tokens";
import { corta } from "@/lib/formato";
import { cn } from "@/lib/utils";
import type { Paso } from "@/lib/credito";

export function Pagar({
  pasos,
  simular,
  monto,
  aProveedor,
  titulo = "Pagar la factura",
  textoBoton,
  textoListo,
  onListo,
  plano = false,
}: {
  pasos: Paso[];
  simular: boolean;
  monto?: string;
  aProveedor?: boolean;
  titulo?: string;
  textoBoton?: string;
  textoListo?: string;
  onListo?: (hashes: Record<string, `0x${string}`>) => void;
  /** Sin caja propia, para ir dentro de otra tarjeta. */
  plano?: boolean;
}) {
  const [fijos] = useState(pasos); // el plan no cambia mientras se paga
  const { stages, hashes, errores, hechos, firmarTodos, listo } = usePasos(fijos, simular);
  const [corriendo, setCorriendo] = useState(false);
  const fallo = fijos.some((p) => stages[p.id] === "error");

  async function pagar() {
    setCorriendo(true);
    const r = await firmarTodos();
    setCorriendo(false);
    if (r) onListo?.(r);
  }

  return (
    <section aria-labelledby="pagar" className={cn("flex flex-col gap-5", !plano && "rounded-[20px] bg-white p-6 shadow-[0_1px_2px_rgb(0_37_100/0.06)]")}>
      <div>
        <h2 id="pagar" className={plano ? "text-[16px] font-semibold text-navy" : "text-[22px] font-bold tracking-[-0.01em] text-navy"}>{titulo}</h2>
        <p className={cn("mt-1 text-ink-2", plano ? "text-[13px]" : "text-[14px]")}>
          {simular ? "Modo demo: las firmas se simulan, no sale nada a la red." : `${fijos.length} transacciones en Arbitrum. Tu wallet te pide confirmar cada una.`}
        </p>
      </div>

      <ol className="flex flex-col" aria-live="polite">
        {fijos.map((p, i) => {
          const st = stages[p.id] ?? "idle";
          const enCurso = st === "confirming" || st === "pending";
          return (
            <li key={p.id} className="flex items-start gap-3 border-t border-line py-3.5 first:border-t-0">
              <span
                className={cn(
                  "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-colors duration-200",
                  st === "success" && "bg-ok text-white",
                  st === "error" && "bg-bad text-white",
                  enCurso && "bg-lavender-soft text-sun-ink",
                  st === "idle" && "bg-cream text-ink-2",
                )}
              >
                {st === "success" ? <Check className="size-4" strokeWidth={3} aria-label="hecho" /> : st === "error" ? <X className="size-4" strokeWidth={3} aria-label="falló" /> : enCurso ? <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-label="en curso" /> : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn("text-[15px] font-semibold", st === "idle" ? "text-ink-2" : "text-navy")}>{p.titulo}</p>
                <p className="text-[13px] text-ink-2">{st === "confirming" ? "Confirmalo en tu wallet…" : st === "pending" ? "Esperando la red…" : p.detalle}</p>
                {errores[p.id] && <p className="mt-1 text-[13px] text-bad">{errores[p.id]}</p>}
              </div>
              {hashes[p.id] &&
                (simular ? (
                  <span className="shrink-0 pt-1 font-mono text-[12px] text-ink-2">simulada</span>
                ) : (
                  <a href={`${EXPLORER_TX}${hashes[p.id]}`} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 pt-1 font-mono text-[12px] text-sun-ink underline-offset-2 hover:underline">
                    {corta(hashes[p.id])} <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                ))}
            </li>
          );
        })}
      </ol>

      {listo ? (
        <p className="flex items-center gap-2 rounded-[14px] bg-ok/10 px-4 py-3 text-[15px] font-semibold text-ok">
          <Check className="size-5" aria-hidden="true" /> {textoListo ?? (aProveedor ? `Factura pagada: ${monto} ARS le llegaron al proveedor.` : `Listo: ${monto} ARGt llegaron a tu wallet.`)}
        </p>
      ) : (
        <button
          type="button"
          onClick={pagar}
          disabled={corriendo}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full px-6 transition-colors duration-200",
            plano ? "bg-navy py-3.5 text-[15px] font-semibold text-white hover:bg-navy-deep" : "bg-navy py-4 text-[16px] font-bold text-white hover:opacity-90",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-progress disabled:opacity-80",
          )}
        >
          {corriendo && <Loader2 className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
          {corriendo ? `Pagando… paso ${Math.min(hechos + 1, fijos.length)} de ${fijos.length}` : fallo ? "Reintentar" : (textoBoton ?? `Pagar ${monto} ARS`)}
        </button>
      )}
    </section>
  );
}
