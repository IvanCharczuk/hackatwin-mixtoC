"use client";

// Pasos 1 y 2 del formulario: la factura (soltarla, o ver cuál es) y a quién se le paga.
import { useRef, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { fmt } from "@/lib/formato";
import { cn } from "@/lib/utils";
import type { Fase, FacturaVista } from "@/lib/hooks/use-factura";
import { Campo, Paso } from "@/components/app/paso";

const fecha = (s: string) => new Date(`${s}T12:00:00`).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
const lindo = (s: string) =>
  s !== s.toUpperCase() ? s : s.toLowerCase().replace(/(^|[\s(])(\p{L})/gu, (_, a: string, b: string) => a + b.toUpperCase()).replace(/\b(s\.a\.|s\.r\.l\.|s\.a\.s\.)/gi, (m) => m.toUpperCase());

export function Subir({
  fase,
  error,
  bloqueado,
  factura,
  onArchivo,
  onEjemplo,
  onReiniciar,
  proveedor,
  setProveedor,
  proveedorValido,
  hayFactura,
  desdeFactura,
}: {
  fase: Fase;
  error: string;
  bloqueado: boolean;
  factura?: FacturaVista | null;
  onArchivo: (f: File) => void;
  onEjemplo: () => void;
  onReiniciar: () => void;
  proveedor: string;
  setProveedor: (s: string) => void;
  proveedorValido: boolean;
  hayFactura: boolean;
  desdeFactura: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [encima, setEncima] = useState(false);
  const ocupado = fase === "leyendo" || fase === "evaluando";
  const sinClave = /ANTHROPIC_API_KEY/.test(error);
  const malo = Boolean(proveedor) && !proveedorValido;

  function tomar(files: FileList | null) {
    const f = files?.[0];
    if (f) onArchivo(f);
  }

  return (
    <>
      <Paso
        n={1}
        id="subir"
        titulo="La factura"
        extra={
          fase !== "vacio" && (
            <button type="button" onClick={onReiniciar} disabled={ocupado} className="text-[13px] text-ink-2 underline-offset-2 hover:text-navy hover:underline focus-visible:outline-2 focus-visible:outline-navy disabled:opacity-50">
              Otra factura
            </button>
          )
        }
      >
        {factura ? (
          <div className="flex items-center gap-3 border-b border-line pb-4">
            <FileText className="size-5 shrink-0 text-ink-2" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-medium text-navy">{lindo(factura.razonSocialEmisor || "Proveedor sin nombre")}</p>
              <p className="text-[12px] text-ink-2">
                Factura {factura.tipo} {factura.numeroCompleto}
                {factura.vencimientoPago ? ` · vence el ${fecha(factura.vencimientoPago)}` : ""}
              </p>
            </div>
            <p className="shrink-0 text-[18px] font-semibold text-navy tabular-nums">
              ${fmt(factura.total, 0)} <span className="text-[12px] font-medium text-ink-2">{factura.moneda}</span>
            </p>
          </div>
        ) : (
          <>
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
                "flex cursor-pointer items-center gap-4 rounded-[14px] border border-dashed bg-white px-5 py-5 transition-colors duration-200",
                encima ? "border-[#F2AE2E] bg-[#FFF8EA]" : "border-line hover:border-[#F2AE2E]",
                (bloqueado || ocupado) && "cursor-not-allowed opacity-60",
                "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-navy",
              )}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FFF3D9] text-[#94601A]">
                {ocupado ? <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <FileText className="size-4" aria-hidden="true" />}
              </span>
              <span className="flex flex-col">
                <span className="text-[14px] font-medium text-navy">{ocupado ? "Revisando…" : "Soltá el PDF o la foto de la factura"}</span>
                <span className="text-[12px] text-ink-2">o hacé clic para elegirla · hasta 4 MB</span>
              </span>
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
            <p className="text-[13px] text-ink-2">
              {bloqueado ? (
                "Entrá con tu cuenta para empezar."
              ) : (
                <>
                  ¿No tenés una a mano?{" "}
                  <button type="button" onClick={onEjemplo} disabled={ocupado} className="font-semibold text-navy underline underline-offset-2 disabled:opacity-50">
                    Usar la factura de ejemplo
                  </button>{" "}
                  ·{" "}
                  <a href="/factura-ejemplo.pdf" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-navy">
                    ver el PDF
                  </a>
                </>
              )}
            </p>
          </>
        )}
        {error && (
          <p role="alert" className="text-[13px] text-bad">
            {sinClave ? "El servidor todavía no tiene la clave para leer PDFs. Probá con la factura de ejemplo." : error}
          </p>
        )}
      </Paso>

      <Paso n={2} titulo="A quién le pagás" apagado={!hayFactura}>
        {hayFactura ? (
          <Campo
            id="proveedor"
            label="Wallet del proveedor en Arbitrum"
            malo={malo}
            ayuda={
              malo
                ? "No es una dirección válida."
                : desdeFactura
                  ? "Sale de la factura. El ARGt le llega directo y el saldo queda a tu nombre."
                  : proveedorValido
                    ? "La cargaste a mano. El ARGt le llega directo y el saldo queda a tu nombre."
                    : "La factura no trae wallet. Pedísela al proveedor y cargala acá; si la dejás vacía, el ARGt llega a tu wallet."
            }
          >
            <input
              id="proveedor"
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value.trim())}
              placeholder="0x…"
              spellCheck={false}
              aria-describedby="proveedor-ayuda"
              className="w-full min-w-0 bg-transparent font-mono text-[13px] text-navy outline-none"
            />
          </Campo>
        ) : (
          <p className="text-[13px] text-ink-2">Sale de la factura cuando la subís.</p>
        )}
      </Paso>
    </>
  );
}
