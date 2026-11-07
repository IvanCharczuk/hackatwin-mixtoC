"use client";

import { Landmark, ReceiptText, ShieldCheck } from "lucide-react";
import { LIQUIDA, TOPE } from "@/lib/morpho";
import { fmt, pct } from "@/lib/formato";
import type { Credito } from "@/lib/credito";

const EYEBROW = "text-[12px] font-semibold uppercase tracking-[2px] text-sun-ink lg:text-[13px]";

function Tarjeta({ icono: Icono, titulo, valor, unidad, nota, children }: { icono: typeof Landmark; titulo: string; valor: string; unidad: string; nota: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-[22px] border border-line bg-paper p-6 lg:p-7">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[15px] font-semibold text-ink-2">{titulo}</h3>
        <Icono className="size-5 text-sun-ink" aria-hidden="true" />
      </div>
      <p className="flex items-baseline gap-2 tabular-nums">
        <span className="text-[30px] leading-none font-bold tracking-[-0.6px] text-navy lg:text-[34px]">{valor}</span>
        <span className="text-[15px] font-semibold text-navy">{unidad}</span>
      </p>
      <p className="text-[14px] leading-[1.4] text-ink-2">{nota}</p>
      {children}
    </div>
  );
}

export function Tarjetas({ credito }: { credito: Credito }) {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
      <Tarjeta
        icono={ReceiptText}
        titulo="Saldo a pagar"
        valor={fmt(credito.deudaArgt, 2)}
        unidad="ARGt"
        nota={credito.comisionAnual !== null ? <>Incluye el costo de financiación hasta hoy · {pct(credito.comisionAnual, 1)} anual</> : "Incluye el costo de financiación hasta hoy"}
      />
      <Tarjeta
        icono={ShieldCheck}
        titulo="Tu respaldo"
        valor={fmt(credito.garantiaUsdt0, 2)}
        unidad="USDT0"
        nota={<>≈ {fmt(credito.garantiaEnArgt)} ARS al precio del oráculo de Morpho</>}
      />
      <Tarjeta
        icono={Landmark}
        titulo="Fondos para financiar"
        valor={fmt(credito.liquidezArgt)}
        unidad="ARGt"
        nota="ARGt libres en Morpho, de donde sale cada pago que financiás"
      />
    </div>
  );
}

export function BarraSeguridad({ ltv }: { ltv: number }) {
  const marca = Math.min(Math.max(ltv, 0), 1);
  const estado = ltv < TOPE ? "ok" : ltv < LIQUIDA ? "cerca" : "riesgo";
  const frase =
    estado === "ok"
      ? `Usaste el ${pct(ltv)} de tu respaldo. Te quedan ${fmt((LIQUIDA - ltv) * 100)} puntos antes de que se liquide.`
      : estado === "cerca"
        ? `Usaste el ${pct(ltv)}: pasaste tu límite. Pagá una parte del saldo para volver a zona verde.`
        : `Usaste el ${pct(ltv)}: Morpho puede liquidar tu respaldo. Pagá tu saldo ahora.`;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className={EYEBROW}>Seguridad</p>
          <h2 className="mt-2 text-[22px] leading-[1.25] font-semibold text-navy lg:text-[26px]">¿Está seguro tu respaldo?</h2>
        </div>
        <p className={`max-w-[520px] text-[15px] leading-[1.5] lg:text-right lg:text-[16px] ${estado === "riesgo" ? "font-semibold text-bad" : "text-ink-2"}`}>{frase}</p>
      </div>

      <div className="relative pt-9 pb-12">
        <div className="absolute top-0 -translate-x-1/2 transition-[left] duration-700" style={{ left: `${marca * 100}%` }}>
          <div className="rounded-full bg-navy px-2.5 py-1 text-[12px] font-bold whitespace-nowrap text-white tabular-nums">Hoy {pct(ltv)}</div>
          <div className="mx-auto h-0 w-0 border-x-[6px] border-t-[7px] border-x-transparent border-t-navy" />
        </div>
        <div className="flex h-3.5 overflow-hidden rounded-full" role="img" aria-label={`Saldo sobre respaldo: ${pct(ltv)}. Límite 60 %, liquidación 77 %.`}>
          <div className="bg-ok" style={{ width: `${TOPE * 100}%` }} />
          <div className="bg-sun" style={{ width: `${(LIQUIDA - TOPE) * 100}%` }} />
          <div className="flex-1 bg-bad" />
        </div>
        <Tope en={TOPE} titulo="60 %" sub="tope de Saltar" lado="izq" />
        <Tope en={LIQUIDA} titulo="77 %" sub="se liquida" lado="der" />
      </div>
    </div>
  );
}

function Tope({ en, titulo, sub, lado }: { en: number; titulo: string; sub: string; lado: "izq" | "der" }) {
  // Los dos topes están a 17 puntos: en 390 px las etiquetas se pisan si se centran. La del 60 va
  // a la izquierda de su marca y la del 77 a la derecha.
  return (
    <div className={`absolute top-[38px] flex flex-col ${lado === "izq" ? "-translate-x-full items-end text-right" : "items-start"}`} style={{ left: `${en * 100}%` }}>
      <div className={`h-6 w-0.5 bg-navy ${lado === "izq" ? "translate-x-px" : "-translate-x-px"}`} />
      <span className="mt-1 text-[13px] font-semibold text-navy tabular-nums">{titulo}</span>
      <span className="text-[12px] whitespace-nowrap text-ink-2">{sub}</span>
    </div>
  );
}
