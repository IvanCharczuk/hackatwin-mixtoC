"use client";

import { ArrowDown, ArrowRight, LogOut, Wallet } from "lucide-react";
import { useAccount, useSwitchChain } from "wagmi";
import { SlidingNumber } from "@/components/animate-ui/primitives/texts/sliding-number";
import { CHAIN_ID } from "@/lib/tokens";
import { corta, fmt, pct } from "@/lib/formato";
import type { Credito } from "@/lib/credito";
import { SelectorIdioma, useT } from "@/lib/i18n";
import { useSaldos } from "@/lib/hooks/use-factura";

const EYEBROW = "text-[12px] font-semibold uppercase tracking-[2px] lg:text-[13px]";

export function BarraSuperior({ authenticated, mock, login, logout }: { authenticated: boolean; mock: boolean; login: () => void; logout: () => void }) {
  const { t } = useT();
  const { address, chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  const enArbitrum = chainId === CHAIN_ID;
  const saldos = useSaldos(authenticated ? address : undefined);
  const monto = (v: number | undefined) => (v === undefined ? "…" : fmt(v));
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-[1248px] flex-wrap items-center justify-between gap-x-3 gap-y-3 px-5 py-5 sm:flex-nowrap sm:px-6">
      <a href="/" className="flex shrink-0 items-center gap-2 text-[16px] font-bold whitespace-nowrap text-white sm:text-[17px]">
        <img src="/sol-de-mayo.png" alt="" className="size-7 sm:size-8" />
        Saltar
      </a>
      <div className="contents sm:flex sm:items-center sm:gap-2">
      <SelectorIdioma />
      {authenticated && address ? (
        <div className="order-last flex w-full items-center justify-end gap-1.5 sm:order-none sm:w-auto sm:gap-2">
          <button
            type="button"
            onClick={() => !enArbitrum && switchChain({ chainId: CHAIN_ID })}
            disabled={enArbitrum || isPending}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-3 py-2 text-[13px] whitespace-nowrap text-white disabled:cursor-default sm:px-3.5"
          >
            <span className={`size-2 rounded-full ${enArbitrum ? "bg-live" : "bg-sun"}`} aria-hidden="true" />
            {enArbitrum ? (
              <span className="font-mono font-semibold tabular-nums">
                {monto(saldos.argt)} <span className="font-sans font-medium text-lavender-soft">ARGt</span>
                <span className="hidden sm:inline">
                  {" "}· {monto(saldos.chlt)} <span className="font-sans font-medium text-lavender-soft">CHLt</span>
                </span>
              </span>
            ) : (
              <span className="font-semibold text-sun-soft">{t.cambiarArbitrum}</span>
            )}
            <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden="true" />
            <span className="hidden font-mono text-lavender-soft sm:inline">{corta(address)}</span>
            {mock && <span className="rounded-full bg-sun px-2 py-0.5 text-[11px] font-bold text-navy-deep">{t.demo}</span>}
          </button>
          <button type="button" onClick={logout} aria-label={t.salir} className="flex size-9 items-center justify-center rounded-full border border-white/20 text-lavender-soft hover:text-white">
            <LogOut className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={login}
          className="brillo-sol inline-flex items-center gap-2 rounded-full bg-sun px-5 py-2.5 text-[14px] font-bold text-navy-deep transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:hover:translate-y-0"
        >
          <Wallet className="size-4" aria-hidden="true" />
          {t.conectar}
        </button>
      )}
      </div>
    </header>
  );
}

function PillMoneda({ logo, etiqueta, monto }: { logo: string; etiqueta: string; monto: string }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/8 py-2 pr-6 pl-2 backdrop-blur-sm">
      <img src={logo} alt="" className="size-10 rounded-full lg:size-11" />
      <div className="leading-tight">
        <div className="text-[12px] text-lavender-soft">{etiqueta}</div>
        <div className="text-[17px] font-bold text-white lg:text-[19px]">{monto}</div>
      </div>
    </div>
  );
}

// El paisaje es una columna de al menos una pantalla: el contenido se centra en el cielo (CIELO deja libre el alto
// de las montañas, que escala con el ancho). `llenar`: sin sesión además crece hasta el footer.
export const CIELO = "flex-1 justify-center pb-[200px] lg:pb-[max(190px,min(21vw,400px))]";

export function Paisaje({ children, llenar = false }: { children: React.ReactNode; llenar?: boolean }) {
  return (
    <section className={`amanecer relative flex min-h-[100dvh] flex-col overflow-hidden${llenar ? " flex-1" : ""}`}>
      <div className="estrellas pointer-events-none absolute inset-0" aria-hidden="true" />
      <img src="/sol-de-mayo.png" alt="" aria-hidden="true" className="pointer-events-none absolute bottom-[70px] left-[58%] w-[260px] -translate-x-1/2 lg:bottom-[20px] lg:left-[60%] lg:w-[340px]" />
      <img src="/andes.png" alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-[40px] left-1/2 w-[900px] lg:-bottom-[90px] max-w-none -translate-x-1/2 lg:w-[max(1440px,100%)]" />
      <div className="relative flex flex-1 flex-col">{children}</div>
    </section>
  );
}

export function Hero({ credito, cargando, onPedir }: { credito: Credito | undefined; cargando: boolean; onPedir: () => void }) {
  const { t, lang } = useT();
  const vacio = !cargando && credito && !credito.tienePosicion;
  return (
    <div className={`mx-auto grid w-full max-w-[1248px] content-center gap-10 px-6 pt-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16 lg:pt-10 ${CIELO}`}>
      <div className="flex flex-col items-start gap-5">
        <p className={`${EYEBROW} flex items-center gap-3 text-sun`}>
          {t.eyebrow}
          {credito?.ilustrativo && <span className="rounded-full border border-sun/60 px-2 py-0.5 text-[11px] tracking-[1px]">{t.ilustrativo}</span>}
        </p>
        {cargando || !credito ? (
          <div className="h-[84px] w-[min(560px,100%)] animate-pulse rounded-2xl bg-white/10 lg:h-[144px]" />
        ) : vacio ? (
          <h1 className="max-w-[780px] text-[38px] leading-[1.06] font-semibold tracking-[-1px] text-white lg:text-[56px] lg:tracking-[-1.6px]">
            {t.heroVacioTitulo}
          </h1>
        ) : (
          <h1 className="text-[38px] leading-[1.06] font-semibold tracking-[-1px] text-white lg:text-[60px] lg:tracking-[-1.6px]">
            <span className="flex items-baseline gap-3">
              <SlidingNumber number={Math.floor(credito.disponibleArgt)} thousandSeparator={lang === "en" ? "," : "."} className="tabular-nums" />
              <span>ARGt</span>
            </span>
            <span className="block">{t.heroLimite}</span>
          </h1>
        )}
        <p className="max-w-[520px] text-[17px] leading-[1.45] font-medium text-lavender-soft lg:text-[19px]">
          {vacio
            ? t.heroVacioTexto
            : credito
              ? t.heroTexto(credito.comisionAnual !== null ? pct(credito.comisionAnual, 1) : null)
              : t.heroLeyendo}
        </p>
        <button type="button" onClick={onPedir} className="brillo-sol mt-1 inline-flex items-center gap-2 rounded-full bg-sun px-[30px] py-4 text-[16px] font-bold text-navy-deep transition-transform hover:-translate-y-0.5 lg:px-[34px] lg:py-[18px] lg:text-[17px]">
          {t.financiar}
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </div>

      {credito && !cargando && (
        <div className="flex flex-col items-start gap-2 lg:items-stretch">
          <PillMoneda logo="/tokens/CHLt.svg" etiqueta={vacio ? t.dejasDeRespaldo : t.tuRespaldo} monto={vacio ? "CHLt" : `≈ ${fmt(credito.chltCongelado)} CHLt`} />
          <ArrowDown className="ml-7 size-4 text-sun" aria-hidden="true" />
          <PillMoneda logo="/tokens/ARGt.svg" etiqueta={vacio ? t.lePagamos : t.financiado} monto={vacio ? "ARGt" : `${fmt(credito.deudaArgt)} ARGt`} />
        </div>
      )}
    </div>
  );
}
