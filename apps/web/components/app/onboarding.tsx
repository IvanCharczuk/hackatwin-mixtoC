"use client";

// Primera vez en /app: el CUIT de la empresa y los permisos de una sola vez.
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { BadgeCheck, Building2, CircleHelp } from "lucide-react";
import { CHAIN_ID } from "@/lib/tokens";
import { planPermisos } from "@/lib/credito";
import { useEmpresa } from "@/lib/hooks/use-factura";
import { Pagar } from "@/components/app/pagar";
import { cn } from "@/lib/utils";

const digitos = (s: string) => s.replace(/\D/g, "");

export function Onboarding({ wallet, simular, onListo }: { wallet: `0x${string}`; simular: boolean; onListo: (cuit: string) => void }) {
  const [paso, setPaso] = useState<1 | 2>(1);
  const [cuit, setCuit] = useState("");
  const valido = digitos(cuit).length === 11;
  const empresa = useEmpresa(valido ? cuit : "", wallet);
  const bcra = empresa.data?.perfil.bcra;
  const client = usePublicClient({ chainId: CHAIN_ID });
  const permisos = useQuery({ queryKey: ["permisos", wallet], enabled: paso === 2 && Boolean(client), queryFn: () => planPermisos(client!, wallet) });
  const terminar = () => onListo(digitos(cuit));

  return (
    <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col gap-6 px-6 py-12">
      <ol className="flex items-center gap-3 text-[13px] font-semibold" aria-label="Pasos">
        {["Tu empresa", "Habilitar pagos"].map((t, i) => (
          <li key={t} className={cn("flex items-center gap-2", paso === i + 1 ? "text-navy" : "text-ink-2")} aria-current={paso === i + 1 ? "step" : undefined}>
            <span className={cn("flex size-6 items-center justify-center rounded-full text-[12px]", paso > i + 1 ? "bg-ok text-white" : paso === i + 1 ? "bg-sun text-navy" : "bg-cream-2")}>{i + 1}</span>
            {t}
          </li>
        ))}
      </ol>

      {paso === 1 ? (
        <section aria-labelledby="ob-empresa" className="flex flex-col gap-5 rounded-[20px] bg-white p-6 shadow-[0_1px_2px_rgb(0_37_100/0.06)]">
          <div>
            <h2 id="ob-empresa" className="text-[24px] font-bold tracking-[-0.01em] text-navy">¿Qué empresa paga?</h2>
            <p className="mt-1 text-[15px] text-ink-2">Con el CUIT miramos tu perfil en el BCRA y validamos que las facturas estén a tu nombre.</p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="ob-cuit" className="text-[14px] font-semibold text-navy">CUIT de la empresa</label>
            <input id="ob-cuit" value={cuit} onChange={(e) => setCuit(e.target.value)} inputMode="numeric" autoFocus placeholder="30-99999902-3" className="rounded-full border border-line bg-white px-5 py-3 font-mono text-[16px] text-navy outline-none focus-visible:border-sun" />
            <p className="text-[13px] text-ink-2">11 números, con o sin guiones. Para la demo: 30-99999902-3.</p>
          </div>
          {valido && (
            <div className="flex items-center gap-3 rounded-[16px] bg-paper px-4 py-3" aria-live="polite">
              <Building2 className="size-5 shrink-0 text-sun-ink" aria-hidden="true" />
              {empresa.isLoading ? (
                <span className="text-[14px] text-ink-2">Buscando en el BCRA…</span>
              ) : bcra?.ok ? (
                <span className="flex flex-col">
                  <span className="text-[15px] font-semibold text-navy">{bcra.denominacion ?? "Empresa registrada"}</span>
                  <span className="inline-flex items-center gap-1 text-[13px] text-ok"><BadgeCheck className="size-3.5" aria-hidden="true" />{bcra.situacionMax ? `Situación ${bcra.situacionMax} en el BCRA` : "Sin deudas en el BCRA"}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[14px] text-ink-2"><CircleHelp className="size-4" aria-hidden="true" />Sin registros en la Central de Deudores. Podés seguir igual.</span>
              )}
            </div>
          )}
          <button type="button" onClick={() => setPaso(2)} disabled={!valido} className="rounded-full bg-sun px-6 py-4 text-[16px] font-bold text-navy transition-colors hover:bg-sun-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:opacity-50">
            Seguir
          </button>
        </section>
      ) : permisos.isLoading || !permisos.data ? (
        <div className="h-48 animate-pulse rounded-[20px] bg-cream-2 motion-reduce:animate-none" aria-label="Revisando permisos" />
      ) : permisos.data.length === 0 ? (
        <section className="flex flex-col gap-4 rounded-[20px] bg-white p-6">
          <h2 className="text-[22px] font-bold text-navy">Los pagos ya están habilitados</h2>
          <p className="text-[15px] text-ink-2">Esta wallet ya dio los permisos. Cada pago son 3 firmas.</p>
          <button type="button" onClick={terminar} className="rounded-full bg-sun px-6 py-4 text-[16px] font-bold text-navy hover:bg-sun-soft">Empezar</button>
        </section>
      ) : (
        <div className="flex flex-col gap-3">
          <Pagar
            pasos={permisos.data}
            simular={simular}
            titulo="Habilitar pagos"
            textoBoton={`Habilitar pagos · ${permisos.data.length} ${permisos.data.length === 1 ? "firma" : "firmas"}`}
            textoListo="Listo: los pagos quedaron habilitados. Cada pago son 3 firmas."
            onListo={terminar}
          />
          <p className="px-2 text-[13px] text-ink-2">Se firma una sola vez. Le permite al pool de Curve cambiar tus CHLt y a Morpho tomar el respaldo cuando pagás.</p>
        </div>
      )}
    </main>
  );
}
