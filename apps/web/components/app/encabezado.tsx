"use client";

// Arriba de /app: la barra (marca y wallet) sobre el cielo, y el bloque de la empresa que abre la tarjeta.
import { Check, CircleAlert, CircleHelp, LogOut, Wallet } from "lucide-react";
import { useAccount, useSwitchChain } from "wagmi";
import { CHAIN_ID } from "@/lib/tokens";
import { corta, fmt } from "@/lib/formato";
import { cn } from "@/lib/utils";
import type { Bcra } from "@/lib/hooks/use-factura";
import { CopiarDireccion } from "@/components/copiar-direccion";

type Saldos = { chlt?: number; argt?: number; usdt0?: number; eth?: number; cargando: boolean };
type Sesion = { ready: boolean; authenticated: boolean; mock: boolean; login: () => void; logout: () => void };

/** Etiqueta chica en mayúsculas, el "eyebrow" de la landing. */
export const OJO = "text-[11px] font-semibold uppercase tracking-[1.8px] text-[#94601A]";

// "MINERA LOS ANDES ARGENTINA S.A." → "Minera Los Andes Argentina S.A."
const lindo = (s: string) =>
  s !== s.toUpperCase() ? s : s.toLowerCase().replace(/(^|[\s(])(\p{L})/gu, (_, a: string, b: string) => a + b.toUpperCase()).replace(/\b(s\.a\.|s\.r\.l\.|s\.a\.s\.)/gi, (m) => m.toUpperCase());

function Hueco({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("inline-block animate-pulse rounded-md bg-cream-2 motion-reduce:animate-none", className)} />;
}

function Situacion({ bcra, cargando }: { bcra?: Bcra; cargando: boolean }) {
  if (cargando) return <Hueco className="h-4 w-36" />;
  if (!bcra?.ok)
    return (
      <span className="inline-flex items-center gap-1">
        <CircleHelp className="size-3.5" aria-hidden="true" /> Sin registros en la Central de Deudores
      </span>
    );
  const s = bcra.situacionMax ?? null;
  if (s === null)
    return (
      <span className="inline-flex items-center gap-1 text-ok">
        <Check className="size-3.5" strokeWidth={2.75} aria-hidden="true" /> Sin deudas en el BCRA
      </span>
    );
  const bien = s <= 2;
  const Icono = bien ? Check : CircleAlert;
  return (
    <span className={cn("inline-flex items-center gap-1", bien ? "text-ok" : "text-bad")}>
      <Icono className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
      Situación {s} en el BCRA{bcra.entidades ? ` · ${bcra.entidades} entidades` : ""}
    </span>
  );
}

export function Barra({ sesion }: { sesion: Sesion }) {
  const dentro = sesion.ready && sesion.authenticated;
  const { address, chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  const enArbitrum = chainId === CHAIN_ID;
  return (
    <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-3 px-6 py-5">
      <a href="/" className="flex items-center gap-2 text-[16px] font-bold tracking-[-0.01em] text-navy">
        <img src="/sol-de-mayo.png" alt="" className="size-7" />
        Saltar
      </a>
      {dentro && address ? (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => !enArbitrum && switchChain({ chainId: CHAIN_ID })}
            disabled={enArbitrum || isPending}
            className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-[12px] text-ink-2 backdrop-blur focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-default"
          >
            <span className={cn("size-1.5 rounded-full", enArbitrum ? "bg-live" : "bg-bad")} aria-hidden="true" />
            {enArbitrum ? <span className="font-mono">{corta(address)}</span> : <span className="font-semibold text-bad">Cambiar a Arbitrum</span>}
            {sesion.mock && <span className="rounded-full bg-[#F2AE2E] px-1.5 py-px text-[10px] font-bold text-navy">demo</span>}
          </button>
          <CopiarDireccion address={address} />
          <button type="button" onClick={sesion.logout} aria-label="Salir" className="flex size-10 items-center justify-center rounded-full border border-line bg-white text-ink-2 hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">
            <LogOut className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button type="button" onClick={sesion.login} disabled={!sesion.ready} className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:opacity-60">
          <Wallet className="size-4" aria-hidden="true" />
          {sesion.ready ? "Conectar" : "Cargando…"}
        </button>
      )}
    </div>
  );
}

export function Empresa({
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
    <div className="flex flex-col gap-4">
      <div>
        <p className={OJO}>{dentro ? "Tu empresa" : "Pagá hoy, devolvé después"}</p>
        <h1 className="mt-1.5 text-[22px] leading-tight font-semibold tracking-[-0.4px] text-balance text-navy">
          {dentro ? lindo(nombre) : "Pagá una factura con tus CHLt"}
        </h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-ink-2">
          <label htmlFor="cuit" className="flex items-center gap-1">
            CUIT
            <input
              id="cuit"
              value={cuit}
              onChange={(e) => setCuit(e.target.value)}
              inputMode="numeric"
              placeholder="30-00000000-0"
              size={12}
              className="rounded-md border border-transparent bg-transparent px-1 py-0.5 font-mono text-[12px] text-navy outline-none hover:border-line focus-visible:border-navy"
            />
          </label>
          <span aria-hidden="true">·</span>
          {dentro ? <Situacion bcra={bcra} cargando={cargandoBcra} /> : <span>Con tu sesión leemos tu perfil en el BCRA.</span>}
        </div>
      </div>
      {dentro && (
        <dl className="flex gap-6" aria-label="Saldos en Arbitrum">
          {(
            [
              ["CHLt", saldos.chlt, "/tokens/CHLt.svg"],
              ["ARGt", saldos.argt, "/tokens/ARGt.svg"],
            ] as const
          ).map(([token, valor, logo]) => (
            <div key={token} className="flex items-center gap-2">
              <img src={logo} alt="" className="size-6" />
              <dt className="text-[12px] text-ink-2">{token}</dt>
              <dd className="font-mono text-[15px] font-semibold text-navy tabular-nums">{valor === undefined ? <Hueco className="h-4 w-10 align-middle" /> : fmt(valor)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
