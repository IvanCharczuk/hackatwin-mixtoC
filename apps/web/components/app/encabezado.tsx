"use client";

import { BadgeCheck, CircleAlert, CircleHelp, LogOut } from "lucide-react";
import { useAccount, useSwitchChain } from "wagmi";
import { CHAIN_ID } from "@/lib/tokens";
import { corta, fmt } from "@/lib/formato";
import { cn } from "@/lib/utils";
import type { Bcra } from "@/lib/hooks/use-factura";

type Saldos = { chlt?: number; argt?: number; usdt0?: number; eth?: number; cargando: boolean };
type Sesion = { ready: boolean; authenticated: boolean; mock: boolean; login: () => void; logout: () => void };

function Hueco({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("block animate-pulse rounded-md bg-cream-2 motion-reduce:animate-none", className)} />;
}

function Situacion({ bcra, cargando }: { bcra?: Bcra; cargando: boolean }) {
  if (cargando) return <Hueco className="h-5 w-44" />;
  if (!bcra?.ok)
    return (
      <span className="inline-flex items-center gap-1.5 text-[14px] text-ink-2">
        <CircleHelp className="size-4" aria-hidden="true" /> Sin registros en la Central de Deudores
      </span>
    );
  const s = bcra.situacionMax ?? null;
  if (s === null)
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-ok/10 px-3 py-1 text-[13px] font-semibold text-ok">
        <BadgeCheck className="size-4" aria-hidden="true" /> Sin deudas en el BCRA
      </span>
    );
  const bien = s <= 2;
  const Icono = bien ? BadgeCheck : CircleAlert;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold", bien ? "bg-ok/10 text-ok" : "bg-bad/10 text-bad")}>
      <Icono className="size-4" aria-hidden="true" />
      Situación {s} en el BCRA
      {bcra.entidades ? <span className="font-medium opacity-80">· {bcra.entidades} entidades</span> : null}
    </span>
  );
}

function Saldo({ token, valor, d = 0 }: { token: string; valor?: number; d?: number }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-[12px] font-semibold text-ink-2">{token}</dt>
      <dd className="font-mono text-[18px] font-semibold text-navy tabular-nums">{valor === undefined ? <Hueco className="mt-1 h-5 w-16" /> : fmt(valor, d)}</dd>
    </div>
  );
}

function Barra({ sesion, dentro }: { sesion: Sesion; dentro: boolean }) {
  const { address, chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  const enArbitrum = chainId === CHAIN_ID;
  return (
    <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-3 px-6 py-4">
      <a href="/" className="flex items-center gap-2 text-[18px] font-bold tracking-[-0.01em] text-navy">
        <img src="/sol-de-mayo.png" alt="" className="size-7" />
        Saltar
      </a>
      {dentro && address ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => !enArbitrum && switchChain({ chainId: CHAIN_ID })}
            disabled={enArbitrum || isPending}
            className="flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-[13px] text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun disabled:cursor-default"
          >
            <span className={cn("size-2 rounded-full", enArbitrum ? "bg-live" : "bg-bad")} aria-hidden="true" />
            <span className="font-mono">{corta(address)}</span>
            <span className="hidden text-ink-2 sm:inline">· {enArbitrum ? "Arbitrum" : "Cambiar a Arbitrum"}</span>
            {sesion.mock && <span className="rounded-full bg-sun px-2 py-0.5 text-[11px] font-bold text-navy">demo</span>}
          </button>
          <button type="button" onClick={sesion.logout} aria-label="Salir" className="flex size-10 items-center justify-center rounded-full border border-line bg-white text-ink-2 hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun">
            <LogOut className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button type="button" onClick={sesion.login} disabled={!sesion.ready} className="rounded-full bg-sun px-6 py-2.5 text-[14px] font-semibold text-navy transition-colors hover:bg-sun-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:opacity-60">
          {sesion.ready ? "Entrar" : "Cargando…"}
        </button>
      )}
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
  sesion: Sesion;
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
    <header className="border-b border-line bg-white">
      <p className="bg-navy px-6 py-2 text-center text-[13px] font-medium text-white">Pagá hoy en Argentina, devolvé después · en pesos, sobre Arbitrum</p>
      <Barra sesion={sesion} dentro={dentro} />
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 pt-4 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 flex-col gap-3">
          <h1 className="text-[28px] leading-[1.1] font-bold tracking-[-0.02em] text-balance text-navy uppercase lg:text-[36px]">
            {dentro ? nombre : <>Pagá una factura <span className="text-sun">con tus CHLt</span></>}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <label htmlFor="cuit" className="flex items-center gap-2 text-[14px] font-medium text-ink-2">
              CUIT
              <input
                id="cuit"
                value={cuit}
                onChange={(e) => setCuit(e.target.value)}
                inputMode="numeric"
                className="w-[9.5rem] rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-[14px] text-navy outline-none focus-visible:border-sun"
              />
            </label>
            {dentro ? <Situacion bcra={bcra} cargando={cargandoBcra} /> : <span className="text-[14px] text-ink-2">Con tu sesión leemos tu perfil en el BCRA y tus saldos en Arbitrum.</span>}
          </div>
        </div>
        <dl className="grid grid-cols-4 gap-x-7 gap-y-2 rounded-[20px] bg-paper px-6 py-4" aria-label="Saldos en Arbitrum">
          <Saldo token="CHLt" valor={dentro ? saldos.chlt : undefined} />
          <Saldo token="ARGt" valor={dentro ? saldos.argt : undefined} />
          <Saldo token="USDT0" valor={dentro ? saldos.usdt0 : undefined} d={2} />
          <Saldo token="ETH" valor={dentro ? saldos.eth : undefined} d={4} />
        </dl>
      </div>
    </header>
  );
}
