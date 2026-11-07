"use client";

import { BadgeCheck, CircleAlert, CircleHelp } from "lucide-react";
import { BarraSuperior } from "@/components/dashboard/hero";
import { fmt } from "@/lib/formato";
import { cn } from "@/lib/utils";
import type { Bcra } from "@/lib/hooks/use-factura";

type Saldos = { chlt?: number; argt?: number; usdt0?: number; eth?: number; cargando: boolean };

function Hueco({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("block animate-pulse rounded-md bg-white/10 motion-reduce:animate-none", className)} />;
}

function Situacion({ bcra, cargando }: { bcra?: Bcra; cargando: boolean }) {
  if (cargando) return <Hueco className="h-5 w-44" />;
  if (!bcra?.ok)
    return (
      <span className="inline-flex items-center gap-1.5 text-[14px] text-lavender-soft">
        <CircleHelp className="size-4" aria-hidden="true" /> Sin registros en la Central de Deudores
      </span>
    );
  const s = bcra.situacionMax ?? null;
  if (s === null)
    return (
      <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-white">
        <BadgeCheck className="size-4 text-live" aria-hidden="true" /> Sin deudas en el BCRA
      </span>
    );
  const bien = s <= 2;
  const Icono = bien ? BadgeCheck : CircleAlert;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[14px] font-medium", bien ? "text-white" : "text-sun-soft")}>
      <Icono className={cn("size-4", bien ? "text-live" : "text-sun")} aria-hidden="true" />
      Situación {s} en el BCRA
      {bcra.entidades ? <span className="font-normal text-lavender-soft">· {bcra.entidades} entidades</span> : null}
    </span>
  );
}

function Saldo({ token, valor, d = 0 }: { token: string; valor?: number; d?: number }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="text-[12px] font-medium text-lavender-soft">{token}</dt>
      <dd className="font-mono text-[17px] font-semibold text-white tabular-nums">{valor === undefined ? <Hueco className="mt-1 h-5 w-16" /> : fmt(valor, d)}</dd>
    </div>
  );
}

export function Encabezado({
  sesion,
  cuit,
  setCuit,
  bcra,
  cargandoBcra,
  razonSocialFactura,
  saldos,
}: {
  sesion: { ready: boolean; authenticated: boolean; mock: boolean; login: () => void; logout: () => void };
  cuit: string;
  setCuit: (c: string) => void;
  bcra?: Bcra;
  cargandoBcra: boolean;
  razonSocialFactura?: string;
  saldos: Saldos;
}) {
  const dentro = sesion.ready && sesion.authenticated;
  const nombre = (bcra?.ok && bcra.denominacion) || razonSocialFactura || "Tu empresa";
  return (
    <header className="bg-navy-deep">
      <BarraSuperior authenticated={dentro} mock={sesion.mock} login={sesion.login} logout={sesion.logout} />
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 pt-2 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          {dentro ? (
            <h1 className="text-[26px] leading-tight font-semibold text-balance text-white lg:text-[30px]">{nombre}</h1>
          ) : (
            <h1 className="text-[26px] leading-tight font-semibold text-white lg:text-[30px]">Entrá para pagar una factura</h1>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <label htmlFor="cuit" className="flex items-center gap-2 text-[14px] text-lavender-soft">
              CUIT
              <input
                id="cuit"
                value={cuit}
                onChange={(e) => setCuit(e.target.value)}
                inputMode="numeric"
                className="w-[9.5rem] rounded-md border border-white/20 bg-white/8 px-2 py-1 font-mono text-[14px] text-white outline-none focus-visible:border-sun"
              />
            </label>
            {dentro ? <Situacion bcra={bcra} cargando={cargandoBcra} /> : <span className="text-[14px] text-lavender-soft">Con tu sesión leemos tu perfil en el BCRA y tus saldos en Arbitrum.</span>}
          </div>
        </div>
        {dentro ? (
          <dl className="grid grid-cols-4 gap-x-6 gap-y-2 rounded-xl border border-white/12 px-5 py-4" aria-label="Saldos en Arbitrum">
            <Saldo token="CHLt" valor={saldos.chlt} />
            <Saldo token="ARGt" valor={saldos.argt} />
            <Saldo token="USDT0" valor={saldos.usdt0} d={2} />
            <Saldo token="ETH" valor={saldos.eth} d={4} />
          </dl>
        ) : (
          <div className="flex items-center gap-4">
            <div className="hidden grid-cols-4 gap-6 sm:grid" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => <Hueco key={i} className="h-10 w-16" />)}
            </div>
            <button type="button" onClick={sesion.login} disabled={!sesion.ready} className="brillo-sol rounded-full bg-sun px-6 py-3 text-[15px] font-bold text-navy-deep transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun disabled:opacity-60">
              {sesion.ready ? "Entrar" : "Cargando…"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
