"use client";

// Columna de la revisión: el veredicto en una línea y, debajo, una sola lista de chequeos.
// Lo que da bien se resume; lo que falla se explica.
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Loader2, Minus, X } from "lucide-react";
import { corta, fmt } from "@/lib/formato";
import { cn } from "@/lib/utils";
import type { Chequeo } from "@/lib/credito";
import type { CheckAgente, Fase, FacturaVista } from "@/lib/hooks/use-factura";
import { OJO } from "@/components/app/encabezado";

type Item = { id: string; titulo: string; nota?: string; estado: "ok" | "no" | "dato" };

function Fila({ item, i }: { item: Item; i: number }) {
  const quieto = useReducedMotion();
  const Icono = item.estado === "ok" ? Check : item.estado === "no" ? X : Minus;
  return (
    <motion.li
      initial={quieto ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: quieto ? 0 : i * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start gap-2.5 py-2 text-[13px]"
    >
      <Icono
        className={cn("mt-0.5 size-3.5 shrink-0", item.estado === "ok" ? "text-ok" : item.estado === "no" ? "text-bad" : "text-ink-2")}
        strokeWidth={2.75}
        aria-label={item.estado === "ok" ? "bien" : item.estado === "no" ? "falla" : "dato"}
      />
      <span className="min-w-0 flex-1 text-navy">{item.titulo}</span>
      {item.nota && <span className={cn("max-w-[55%] text-right text-[12px]", item.estado === "no" ? "text-bad" : "text-ink-2", item.id === "wallet" && "font-mono")}>{item.nota}</span>}
    </motion.li>
  );
}

function Grupo({ titulo, items, desde }: { titulo: string; items: Item[]; desde: number }) {
  if (!items.length) return null;
  return (
    <section aria-label={titulo}>
      <h3 className="mb-0.5 text-[11px] font-semibold text-ink-2">{titulo}</h3>
      <ul className="divide-y divide-line/70">{items.map((it, k) => <Fila key={it.id} item={it} i={desde + k} />)}</ul>
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
  pagada = false,
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
  pagada?: boolean;
}) {
  const facturaItems: Item[] = factura
    ? [
        { id: "receptor", titulo: factura.receptorCoincide ? "A nombre de tu empresa" : "No está a nombre de tu empresa", nota: factura.receptorCoincide ? undefined : factura.razonSocialReceptor, estado: factura.receptorCoincide ? "ok" : "no" },
        { id: "cae", titulo: factura.cae ? "Factura válida, con CAE" : "La factura no tiene CAE", estado: factura.cae ? "ok" : "no" },
        factura.walletProveedor
          ? { id: "wallet", titulo: "Wallet del proveedor", nota: corta(factura.walletProveedor), estado: "ok" }
          : { id: "wallet", titulo: "La factura no trae wallet", nota: "cargala a mano", estado: "no" },
        ...(factura.moneda !== "ARS" ? [{ id: "moneda", titulo: `Está en ${factura.moneda}, no en pesos`, estado: "no" as const }] : []),
      ]
    : [];
  const agenteItems: Item[] = checksAgente.filter((c) => /BCRA/.test(c.titulo)).map((c) => ({ id: c.id, titulo: c.titulo, nota: c.ok ? undefined : c.detalle, estado: c.ok ? "ok" : "no" }));
  const chltItems: Item[] =
    factura && saldoChlt !== undefined && limiteTotal !== undefined
      ? [{ id: "chlt", titulo: `Tenés ${fmt(saldoChlt)} CHLt`, nota: `límite de ${fmt(limiteTotal)} ARGt`, estado: "dato" }]
      : [];
  const bien = chequeos?.filter((c) => c.ok) ?? [];
  const cItems: Item[] =
    listo && chequeos
      ? [
          ...chequeos.filter((c) => !c.ok).map((c): Item => ({ id: c.id, titulo: c.titulo, nota: c.detalle, estado: "no" })),
          ...(bien.length ? [{ id: "resto", titulo: bien.length === chequeos.length ? "Todos los chequeos dan bien" : `${bien.length} chequeos más dan bien`, estado: "ok" as const }] : []),
        ]
      : [];

  const ocupado = !pagada && (fase === "leyendo" || fase === "evaluando" || (factura && !listo && fase !== "error"));
  const veredicto =
    fase === "vacio"
      ? null
      : fase === "error"
        ? { tono: "no", titulo: "No pudimos revisarla", texto: "" }
        : ocupado
          ? { tono: "cargando", titulo: fase === "leyendo" ? "Leyendo la factura…" : "Revisando en el BCRA y en Morpho…", texto: "" }
          : pagada
            ? { tono: "ok", titulo: "Factura pagada", texto: "El proveedor ya cobró. El comprobante quedó en el pago y en tus movimientos." }
            : alcanza
              ? { tono: "ok", titulo: "Podés pagarla", texto: "Tus CHLt alcanzan y todos los chequeos dan bien." }
              : { tono: "no", titulo: "No te alcanza", texto: faltan && faltan > 0 ? `Te faltan unos ${fmt(Math.ceil(faltan))} CHLt para cubrir esta factura.` : "Hay un chequeo en rojo: revisalo abajo." };

  return (
    <section aria-labelledby="revision" className="flex flex-col gap-5">
      <div>
        <h2 id="revision" className={OJO}>Revisión</h2>
        <div aria-live="polite" className="mt-2">
          {veredicto ? (
            <div className="flex items-start gap-2.5">
              {veredicto.tono === "cargando" ? (
                <Loader2 className="mt-1 size-4 shrink-0 animate-spin text-ink-2 motion-reduce:animate-none" aria-hidden="true" />
              ) : (
                <span className={cn("mt-2 size-2 shrink-0 rounded-full", veredicto.tono === "ok" ? "bg-ok" : "bg-bad")} aria-hidden="true" />
              )}
              <div>
                <p className={cn("font-semibold tracking-[-0.2px] text-navy", veredicto.tono === "cargando" ? "text-[15px]" : "text-[18px]")}>{veredicto.titulo}</p>
                {veredicto.texto && <p className="text-[13px] text-ink-2">{veredicto.texto}</p>}
              </div>
            </div>
          ) : (
            <p className="text-[14px] leading-relaxed text-ink-2">Subí una factura y te decimos si la podés pagar con tus CHLt. Revisamos la factura, el BCRA y tu respaldo antes de que firmes.</p>
          )}
        </div>
      </div>

      {fase === "leyendo" && !factura && (
        <div className="flex flex-col gap-2" aria-hidden="true">
          {[0, 1, 2].map((i) => <span key={i} className="h-7 animate-pulse rounded-md bg-cream-2 motion-reduce:animate-none" />)}
        </div>
      )}
      <Grupo titulo="La factura" items={facturaItems} desde={0} />
      <Grupo titulo="El BCRA" items={agenteItems} desde={facturaItems.length} />
      <Grupo titulo="Tu respaldo" items={chltItems} desde={0} />
      <Grupo titulo="Antes de firmar" items={cItems} desde={0} />
    </section>
  );
}

/** Lo que dice el agente: dos líneas y "Leer todo". */
export function Agente({ texto }: { texto: string }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <section aria-labelledby="agente" className="border-l-2 border-[#F2AE2E] pl-4">
      <h2 id="agente" className={OJO}>Lo que dice el agente</h2>
      <p className={cn("mt-1.5 text-[13px] leading-relaxed text-pretty text-ink-2", !abierto && "line-clamp-2")}>{texto}</p>
      <button type="button" onClick={() => setAbierto(!abierto)} aria-expanded={abierto} className="mt-1 text-[12px] font-semibold text-navy hover:underline">
        {abierto ? "Ver menos" : "Leer todo"}
      </button>
    </section>
  );
}
