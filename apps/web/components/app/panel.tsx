"use client";

// Panel derecho: el veredicto arriba y, debajo, lo que el agente va sabiendo en orden.
import { motion, useReducedMotion } from "motion/react";
import { Check, CircleCheck, CircleX, Loader2, Minus, X } from "lucide-react";
import { fmt } from "@/lib/formato";
import { cn } from "@/lib/utils";
import type { Chequeo } from "@/lib/credito";
import type { CheckAgente, Fase, FacturaVista } from "@/lib/hooks/use-factura";

const fecha = (s: string) => (s ? new Date(`${s}T12:00:00`).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" }) : "sin fecha");
const cuitLindo = (c: string) => (c.length === 11 ? `${c.slice(0, 2)}-${c.slice(2, 10)}-${c.slice(10)}` : c);

type Item = { id: string; titulo: string; detalle?: string; estado: "ok" | "no" | "dato" };

function Fila({ item, i }: { item: Item; i: number }) {
  const quieto = useReducedMotion();
  const Icono = item.estado === "ok" ? Check : item.estado === "no" ? X : Minus;
  return (
    <motion.li
      initial={quieto ? false : { opacity: 0, y: 6, filter: "blur(2px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.24, delay: quieto ? 0 : i * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start gap-3 py-2.5"
    >
      <span
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
          item.estado === "ok" && "bg-ok/14 text-ok",
          item.estado === "no" && "bg-bad/14 text-bad",
          item.estado === "dato" && "bg-cream-2 text-ink-2",
        )}
      >
        <Icono className="size-3" strokeWidth={3} aria-label={item.estado === "ok" ? "bien" : item.estado === "no" ? "falla" : "dato"} />
      </span>
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-navy">{item.titulo}</p>
        {item.detalle && <p className="text-[13px] leading-snug text-ink-2">{item.detalle}</p>}
      </div>
    </motion.li>
  );
}

function Grupo({ titulo, items, desde }: { titulo: string; items: Item[]; desde: number }) {
  if (!items.length) return null;
  return (
    <section aria-label={titulo} className="border-t border-line pt-3">
      <h3 className="text-[12px] font-bold text-sun-ink">{titulo}</h3>
      <ul className="mt-1">{items.map((it, k) => <Fila key={it.id} item={it} i={desde + k} />)}</ul>
    </section>
  );
}

export function Panel({
  fase,
  factura,
  checksAgente,
  saldoChlt,
  limiteTotal,
  faltan,
  chequeos,
  listo,
  alcanza,
}: {
  fase: Fase;
  factura: FacturaVista | null;
  checksAgente: CheckAgente[];
  saldoChlt?: number;
  limiteTotal?: number;
  faltan?: number;
  chequeos?: Chequeo[];
  listo: boolean;
  alcanza: boolean;
}) {
  const facturaItems: Item[] = factura
    ? [
        { id: "num", titulo: `Factura ${factura.tipo} ${factura.numeroCompleto}`, detalle: `Emitida el ${fecha(factura.fechaEmision)} · CAE ${factura.cae || "sin CAE"}`, estado: factura.cae ? "ok" : "no" },
        { id: "emisor", titulo: factura.razonSocialEmisor || "Proveedor sin nombre", detalle: `Te la emite · CUIT ${cuitLindo(factura.cuitEmisor)}`, estado: "dato" },
        { id: "receptor", titulo: factura.receptorCoincide ? "Está a nombre de tu empresa" : "No está a nombre de tu empresa", detalle: factura.razonSocialReceptor, estado: factura.receptorCoincide ? "ok" : "no" },
        { id: "total", titulo: `${fmt(factura.total, 2)} ${factura.moneda}`, detalle: factura.vencimientoPago ? `Vence el ${fecha(factura.vencimientoPago)}` : "La factura no dice vencimiento", estado: factura.moneda === "ARS" ? "dato" : "no" },
      ]
    : [];
  const agenteItems: Item[] = checksAgente.filter((c) => /BCRA/.test(c.titulo)).map((c) => ({ id: c.id, titulo: c.titulo, detalle: c.detalle, estado: c.ok ? "ok" : "no" }));
  const chltItems: Item[] =
    factura && saldoChlt !== undefined && limiteTotal !== undefined
      ? [{ id: "chlt", titulo: `Tenés ${fmt(saldoChlt)} CHLt`, detalle: `Te dan un límite de unos ${fmt(limiteTotal)} ARGt al 60 %`, estado: "dato" }]
      : [];
  const cItems: Item[] = listo && chequeos ? chequeos.map((c) => ({ id: c.id, titulo: `${c.id} · ${c.titulo}`, detalle: c.detalle, estado: c.ok ? "ok" : "no" })) : [];

  const ocupado = fase === "leyendo" || fase === "evaluando" || (factura && !listo && fase !== "error");

  return (
    <aside aria-labelledby="revision" className="flex flex-col gap-4 rounded-[20px] bg-white p-6 shadow-[0_1px_2px_rgb(0_37_100/0.06)] lg:sticky lg:top-6">
      <h2 id="revision" className="text-[16px] font-bold text-navy">Revisión de la factura</h2>

      <div aria-live="polite" className={cn("rounded-[16px] px-4 py-4", !listo || fase !== "listo" ? "bg-cream" : alcanza ? "bg-ok/10" : "bg-bad/10")}>
        {fase === "vacio" ? (
          <p className="text-[15px] text-ink-2">Subí una factura y te decimos si la podés pagar con tus CHLt.</p>
        ) : fase === "error" ? (
          <p className="flex items-start gap-2 text-[15px] font-medium text-bad">
            <CircleX className="mt-0.5 size-5 shrink-0" aria-hidden="true" /> No pudimos revisarla
          </p>
        ) : ocupado ? (
          <p className="flex items-center gap-2 text-[15px] font-medium text-navy">
            <Loader2 className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            {fase === "leyendo" ? "Leyendo la factura…" : "Revisando en el BCRA y en Morpho…"}
          </p>
        ) : alcanza ? (
          <div className="flex items-start gap-3">
            <CircleCheck className="mt-0.5 size-6 shrink-0 text-ok" aria-hidden="true" />
            <div>
              <p className="text-[19px] font-semibold text-navy">Podés pagarla</p>
              <p className="text-[14px] text-ink-2">Tus CHLt alcanzan y todos los chequeos dan bien. El plan de firmas está a la izquierda.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <CircleX className="mt-0.5 size-6 shrink-0 text-bad" aria-hidden="true" />
            <div>
              <p className="text-[19px] font-semibold text-navy">No te alcanza</p>
              <p className="text-[14px] text-ink-2">
                {faltan && faltan > 0 ? `Te faltan unos ${fmt(Math.ceil(faltan))} CHLt para cubrir esta factura.` : "Hay un chequeo en rojo: revisalo abajo."}
              </p>
            </div>
          </div>
        )}
      </div>

      {fase === "vacio" ? (
        <ol className="flex flex-col gap-2 text-[14px] text-ink-2">
          <li>1. Leemos la factura y vemos que esté a tu nombre.</li>
          <li>2. Miramos al proveedor y a tu empresa en el BCRA.</li>
          <li>3. Calculamos cuánto te dan tus CHLt de respaldo.</li>
          <li>4. Revisamos liquidez, límite y gas antes de que firmes.</li>
        </ol>
      ) : (
        <div className="flex flex-col gap-3">
          {fase === "leyendo" && !factura && (
            <div className="flex flex-col gap-2" aria-hidden="true">
              {[0, 1, 2].map((i) => <span key={i} className="h-9 animate-pulse rounded-md bg-cream-2 motion-reduce:animate-none" />)}
            </div>
          )}
          <Grupo titulo="La factura" items={facturaItems} desde={0} />
          <Grupo titulo="El agente en el BCRA" items={agenteItems} desde={facturaItems.length} />
          <Grupo titulo="Tu respaldo" items={chltItems} desde={0} />
          <Grupo titulo="Antes de firmar" items={cItems} desde={0} />
        </div>
      )}
    </aside>
  );
}
