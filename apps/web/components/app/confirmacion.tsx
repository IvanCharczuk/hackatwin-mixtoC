"use client";

// Pantalla de pago confirmado: reemplaza la revisión para que el pago quede claro y con sus comprobantes.
import { motion, useReducedMotion } from "motion/react";
import { CircleCheck, ExternalLink, ListChecks, RotateCcw } from "lucide-react";
import { EXPLORER_TX } from "@/lib/tokens";
import { corta } from "@/lib/formato";
import type { Paso } from "@/lib/credito";

export type Recibo = {
  pasos: Paso[];
  hashes: Record<string, `0x${string}`>;
  monto: string;
  proveedor?: string;
  numero?: string;
  destino?: string;
  simulado: boolean;
};

export function Confirmacion({ recibo, onOtra }: { recibo: Recibo; onOtra: () => void }) {
  const quieto = useReducedMotion();
  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-6 px-6 py-12">
      <motion.section
        initial={quieto ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        aria-labelledby="confirmado"
        className="flex flex-col items-center gap-3 rounded-[20px] bg-white px-6 py-10 text-center shadow-[0_1px_2px_rgb(0_37_100/0.06)]"
      >
        <CircleCheck className="size-14 text-ok" aria-hidden="true" strokeWidth={1.75} />
        <h1 id="confirmado" className="text-[28px] font-bold tracking-[-0.02em] text-navy">Pago confirmado</h1>
        <p className="font-mono text-[34px] font-semibold text-navy tabular-nums">{recibo.monto} ARS</p>
        <p className="max-w-[44ch] text-[15px] text-ink-2">
          {recibo.destino
            ? <>Le llegaron a {recibo.proveedor ?? "tu proveedor"} en <span className="font-mono">{corta(recibo.destino)}</span>{recibo.numero ? <> por la factura {recibo.numero}</> : null}. El saldo quedó a tu nombre en Morpho.</>
            : <>Los ARGt llegaron a tu wallet. El saldo quedó a tu nombre en Morpho.</>}
        </p>
        {recibo.simulado && <p className="rounded-full bg-cream px-3 py-1 text-[12px] text-ink-2">Modo demo: transacciones simuladas</p>}
      </motion.section>

      <section aria-labelledby="comprobantes" className="rounded-[20px] bg-white p-6 shadow-[0_1px_2px_rgb(0_37_100/0.06)]">
        <h2 id="comprobantes" className="text-[16px] font-bold text-navy">Comprobantes en Arbitrum</h2>
        <ol className="mt-2">
          {recibo.pasos.map((p) => {
            const h = recibo.hashes[p.id];
            return (
              <li key={p.id} className="flex items-center gap-3 border-t border-line py-3 first:border-t-0">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-ok text-white">
                  <CircleCheck className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 text-[14px] font-semibold text-navy">{p.titulo}</span>
                {h && !recibo.simulado ? (
                  <a href={`${EXPLORER_TX}${h}`} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 font-mono text-[12px] text-sun-ink underline-offset-2 hover:underline">
                    {corta(h)} <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="shrink-0 font-mono text-[12px] text-ink-2">{h ? "simulada" : "ya estaba"}</span>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onOtra} className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3.5 text-[15px] font-bold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">
          <RotateCcw className="size-4" aria-hidden="true" /> Pagar otra factura
        </button>
        <a href="#movimientos" className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-navy px-6 py-3.5 text-[15px] font-semibold text-navy hover:bg-navy/5">
          <ListChecks className="size-4" aria-hidden="true" /> Ver movimientos
        </a>
      </div>
    </main>
  );
}
