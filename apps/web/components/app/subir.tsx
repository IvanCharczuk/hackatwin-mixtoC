"use client";

import { useRef, useState } from "react";
import { FileUp, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Fase } from "@/lib/hooks/use-factura";

export function Subir({
  fase,
  error,
  bloqueado,
  onArchivo,
  onEjemplo,
  onReiniciar,
  proveedor,
  setProveedor,
  proveedorValido,
}: {
  fase: Fase;
  error: string;
  bloqueado: boolean;
  onArchivo: (f: File) => void;
  onEjemplo: () => void;
  onReiniciar: () => void;
  proveedor: string;
  setProveedor: (s: string) => void;
  proveedorValido: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [encima, setEncima] = useState(false);
  const ocupado = fase === "leyendo" || fase === "evaluando";
  const sinClave = /ANTHROPIC_API_KEY/.test(error);

  function tomar(files: FileList | null) {
    const f = files?.[0];
    if (f) onArchivo(f);
  }

  return (
    <section aria-labelledby="subir" className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="subir" className="text-[22px] font-semibold text-navy">Factura a pagar</h2>
          <p className="mt-1 max-w-[60ch] text-[15px] text-ink-2">El agente la lee, revisa al proveedor y a tu empresa, y calcula si tus CHLt alcanzan para pagarla en pesos.</p>
        </div>
        {fase !== "vacio" && (
          <button type="button" onClick={onReiniciar} disabled={ocupado} className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[14px] font-medium text-navy hover:bg-cream-2 focus-visible:outline-2 focus-visible:outline-navy disabled:opacity-50">
            <RotateCcw className="size-4" aria-hidden="true" /> Otra factura
          </button>
        )}
      </div>

      <label
        htmlFor="archivo"
        onDragOver={(e) => {
          e.preventDefault();
          if (!bloqueado && !ocupado) setEncima(true);
        }}
        onDragLeave={() => setEncima(false)}
        onDrop={(e) => {
          e.preventDefault();
          setEncima(false);
          if (!bloqueado && !ocupado) tomar(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed px-6 py-10 text-center transition-colors duration-200",
          encima ? "border-navy bg-lavender-soft/30" : "border-line bg-white hover:border-ink-2",
          (bloqueado || ocupado) && "cursor-not-allowed opacity-60",
          "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-navy",
        )}
      >
        <FileUp className="size-7 text-navy" aria-hidden="true" />
        <span className="text-[16px] font-semibold text-navy">{ocupado ? "Revisando…" : "Soltá el PDF o la foto de la factura"}</span>
        <span className="text-[14px] text-ink-2">o hacé clic para elegirla · hasta 4 MB</span>
        <input
          ref={input}
          id="archivo"
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          disabled={bloqueado || ocupado}
          className="sr-only"
          onChange={(e) => {
            tomar(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={onEjemplo} disabled={bloqueado || ocupado} className="rounded-full border-[1.5px] border-navy px-5 py-2.5 text-[14px] font-semibold text-navy hover:bg-navy/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:border-line disabled:text-ink-2">
          Usar la factura de ejemplo
        </button>
        <a href="/factura-ejemplo.pdf" target="_blank" rel="noreferrer" className="text-[14px] text-ink-2 underline underline-offset-2 hover:text-navy">
          Ver el PDF de ejemplo
        </a>
        {bloqueado && <span className="text-[14px] text-ink-2">Entrá con tu cuenta para empezar.</span>}
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-bad/10 px-4 py-3 text-[14px] text-bad">
          {sinClave ? "El servidor todavía no tiene la clave para leer PDFs. Probá con la factura de ejemplo." : error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="proveedor" className="text-[14px] font-semibold text-navy">
          Wallet del proveedor
        </label>
        <input
          id="proveedor"
          value={proveedor}
          onChange={(e) => setProveedor(e.target.value.trim())}
          placeholder="0x…"
          spellCheck={false}
          aria-describedby="proveedor-ayuda"
          className={cn("rounded-lg border bg-white px-4 py-3 font-mono text-[14px] text-navy outline-none focus-visible:border-navy", proveedor && !proveedorValido ? "border-bad" : "border-line")}
        />
        <p id="proveedor-ayuda" className={cn("text-[13px]", proveedor && !proveedorValido ? "text-bad" : "text-ink-2")}>
          {proveedor && !proveedorValido ? "No es una dirección válida." : proveedorValido ? "El ARGt le llega directo y el saldo queda a tu nombre." : "Si la dejás vacía, el ARGt llega a tu wallet."}
        </p>
      </div>
    </section>
  );
}
