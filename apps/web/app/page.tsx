"use client";

// Dashboard de la empresa: cuánto ARGt puede pedir, cuánto debe y si su garantía está segura.
// Todo se lee en vivo de Morpho en Arbitrum (lib/credito.ts); sin backend.
import { useRef, useState } from "react";
import { useAccount } from "wagmi";
import { useAuth } from "@/lib/auth";
import { useCredito } from "@/lib/hooks/use-credito";
import { BarraSuperior, Hero, Paisaje } from "@/components/dashboard/hero";
import { BarraSeguridad, Tarjetas } from "@/components/dashboard/resumen";
import { AntesDePedir, type Modo } from "@/components/dashboard/antes-de-pedir";
import { Movimientos } from "@/components/dashboard/movimientos";

export default function Dashboard() {
  const { ready, authenticated, login, logout, mock } = useAuth();
  const { address } = useAccount();
  const { data: credito, isLoading, error } = useCredito(authenticated ? address : undefined);
  const [modo, setModo] = useState<Modo | null>(null);
  const planRef = useRef<HTMLElement>(null);

  function pedir() {
    if (!authenticated) return login();
    setModo("pedir");
    requestAnimationFrame(() => planRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Paisaje>
        <BarraSuperior authenticated={authenticated} mock={mock} login={login} logout={logout} />
        {ready && authenticated && address ? (
          <Hero credito={credito} cargando={isLoading} onPedir={pedir} />
        ) : (
          <div className="mx-auto flex w-full max-w-[1248px] flex-col items-start gap-5 px-6 pt-6 pb-[200px] lg:pt-14 lg:pb-[190px]">
            <p className="text-[12px] font-semibold tracking-[2px] text-sun uppercase lg:text-[13px]">Tu crédito en Argentina</p>
            <h1 className="max-w-[720px] text-[38px] leading-[1.06] font-semibold tracking-[-1px] text-white lg:text-[64px] lg:tracking-[-1.8px]">
              Entrá para ver cuánto ARGt podés pedir hoy
            </h1>
            <p className="max-w-[520px] text-[17px] leading-[1.45] font-medium text-lavender-soft lg:text-[19px]">
              Leemos tu posición en Morpho, en Arbitrum, en vivo.
            </p>
            <button type="button" onClick={login} disabled={!ready} className="brillo-sol rounded-full bg-sun px-[34px] py-[18px] text-[17px] font-bold text-navy-deep">
              {ready ? "Entrar" : "Cargando…"}
            </button>
          </div>
        )}
      </Paisaje>

      {authenticated && address && error && (
        <p className="mx-auto w-full max-w-[1248px] px-6 pt-6 text-[14px] text-bad">No pudimos leer Morpho ahora: {error.message.split("\n")[0]}. Reintentamos en el próximo bloque.</p>
      )}

      {authenticated && address && credito && (
        <>
          {credito.tienePosicion && (
            <section className="bg-cream">
              <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-14 px-6 py-[72px] lg:gap-20 lg:py-[96px]">
                <Tarjetas credito={credito} />
                <BarraSeguridad ltv={credito.ltv} />
                {credito.ilustrativo && <p className="-mt-6 text-[13px] text-ink-2">Números ilustrativos: el ejemplo de la SPEC, no tu posición real.</p>}
              </div>
            </section>
          )}
          <AntesDePedir ref={planRef} address={address} credito={credito} simular={mock} modo={modo} setModo={setModo} />
          <Movimientos address={address} ilustrativo={credito.ilustrativo} />
        </>
      )}

      <footer className="mt-auto bg-navy-deep">
        <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-2 px-6 py-8 text-[13px] text-lavender-soft sm:flex-row sm:justify-between">
          <span>Proyecto de HackaTwin 2026, equipo Mixto C</span>
          <span>Construido con las monedas de Twin · <a href="/transferir" className="underline underline-offset-2">Transferir</a></span>
        </div>
      </footer>
    </main>
  );
}
