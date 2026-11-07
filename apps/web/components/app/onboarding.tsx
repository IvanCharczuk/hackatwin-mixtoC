"use client";

// Primera vez en /app: el CUIT de la empresa y los permisos de una sola vez.
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { BadgeCheck, Building2, Check, CircleHelp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { PAISES } from "@/lib/paises";
import { FACTURA_EJEMPLO } from "@/lib/factura-ejemplo";
import { CHAIN_ID } from "@/lib/tokens";
import { planPermisos } from "@/lib/credito";
import { useEmpresa } from "@/lib/hooks/use-factura";
import { Pagar } from "@/components/app/pagar";
import { cn } from "@/lib/utils";

const digitos = (s: string) => s.replace(/\D/g, "");

export function Onboarding({ wallet, simular, onListo }: { wallet: `0x${string}`; simular: boolean; onListo: (datos: { cuit: string; pais: string; idLocal: string; nombre?: string }) => void }) {
  const [paso, setPaso] = useState<1 | 2>(1);
  const [paisId, setPaisId] = useState("CL");
  const pais = PAISES.find((p) => p.id === paisId)!;
  const [idLocal, setIdLocal] = useState("");
  const [cuitFilial, setCuitFilial] = useState("");
  const local = pais.id === "AR";
  const idOk = pais.valida(idLocal);
  const cuit = local ? idLocal : cuitFilial;
  const valido = digitos(cuit).length === 11 && idOk;
  const quieto = useReducedMotion();
  const empresa = useEmpresa(valido ? cuit : "", wallet);
  const bcra = empresa.data?.perfil.bcra;
  const client = usePublicClient({ chainId: CHAIN_ID });
  const permisos = useQuery({ queryKey: ["permisos", wallet], enabled: paso === 2 && Boolean(client), queryFn: () => planPermisos(client!, wallet) });
  // El nombre sale del BCRA; el CUIT de la demo es ficticio y el BCRA no lo trae: se usa el de la factura de ejemplo.
  const nombre = bcra?.denominacion || (digitos(cuit) === FACTURA_EJEMPLO.cuitReceptor ? FACTURA_EJEMPLO.razonSocialReceptor : undefined);
  const terminar = () => onListo({ cuit: digitos(cuit), pais: pais.id, idLocal: idLocal.trim(), nombre });

  return (
    <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col gap-6 px-6 py-12">
      <ol className="flex items-center gap-3 text-[13px] font-semibold" aria-label="Pasos">
        {["Tu empresa", "Habilitar pagos"].map((t, i) => (
          <li key={t} className={cn("flex items-center gap-2", paso === i + 1 ? "text-navy" : "text-ink-2")} aria-current={paso === i + 1 ? "step" : undefined}>
            <span className={cn("flex size-6 items-center justify-center rounded-full text-[12px]", paso > i + 1 ? "bg-ok text-white" : paso === i + 1 ? "bg-navy text-white" : "bg-cream-2")}>{i + 1}</span>
            {t}
          </li>
        ))}
      </ol>

      {paso === 1 ? (
        <section aria-labelledby="ob-empresa" className="flex flex-col gap-5 rounded-[20px] bg-white p-6 shadow-[0_1px_2px_rgb(0_37_100/0.06)]">
          <div>
            <h2 id="ob-empresa" className="text-[24px] font-bold tracking-[-0.01em] text-navy">¿De dónde es tu empresa?</h2>
            <p className="mt-1 text-[15px] text-ink-2">Revisamos tus antecedentes en las instituciones de tu país y a tu filial argentina en el BCRA.</p>
          </div>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-[14px] font-semibold text-navy">País de origen</legend>
            <div className="flex flex-wrap gap-2">
              {PAISES.map((p) => (
                <button key={p.id} type="button" aria-pressed={p.id === paisId} onClick={() => { setPaisId(p.id); setIdLocal(""); }} className={cn("rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy", p.id === paisId ? "border-navy bg-navy text-white" : "border-line bg-white text-navy hover:border-navy")}>
                  {p.nombre}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-col gap-2">
            <label htmlFor="ob-id" className="text-[14px] font-semibold text-navy">{pais.idNombre} de la empresa en {pais.nombre}</label>
            <input id="ob-id" value={idLocal} onChange={(e) => setIdLocal(e.target.value.replace(/[^0-9A-Za-zÑñ&.\-\/]/g, ""))} autoFocus placeholder={pais.ejemplo} spellCheck={false} aria-invalid={Boolean(idLocal) && !idOk} className={cn("rounded-full border bg-white px-5 py-3 font-mono text-[16px] text-navy outline-none focus-visible:border-navy", idLocal && !idOk ? "border-bad" : "border-line")} />
            <p className={cn("text-[13px]", idLocal && !idOk ? "text-bad" : "text-ink-2")}>
              {idLocal && !idOk ? `Ese ${pais.idNombre} no es válido. ` : ""}
              <button type="button" onClick={() => setIdLocal(pais.ejemplo)} className="font-semibold text-navy underline underline-offset-2 hover:opacity-70">
                Usar el de ejemplo
              </button>
            </p>
          </div>
          {idOk && !local && (
            <section aria-label={`Antecedentes en ${pais.nombre}`} className="flex flex-col gap-1 rounded-[16px] bg-paper px-4 py-3">
              <p className="text-[12px] font-bold text-ink-2">Antecedentes en {pais.nombre}</p>
              <ul>
                {pais.instituciones.map((inst, k) => (
                  <motion.li key={inst} initial={quieto ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: quieto ? 0 : 0.25 + k * 0.35, ease: [0.22, 1, 0.36, 1] }} className="flex items-center gap-2 py-1.5 text-[14px] text-navy">
                    <span className="flex size-5 items-center justify-center rounded-full bg-ok/14 text-ok"><Check className="size-3" strokeWidth={3} aria-hidden="true" /></span>
                    {inst} <span className="text-ink-2">· sin observaciones</span>
                  </motion.li>
                ))}
              </ul>
              <p className="pt-1 text-[12px] text-ink-2">Demo: consultas simuladas. La de BCRA, abajo, es real.</p>
            </section>
          )}
          {!local && idOk && (
            <div className="flex flex-col gap-2">
              <label htmlFor="ob-cuit" className="text-[14px] font-semibold text-navy">CUIT de tu filial en Argentina</label>
              <input id="ob-cuit" value={cuitFilial} onChange={(e) => setCuitFilial(e.target.value.replace(/[^\d-]/g, ""))} inputMode="numeric" placeholder="30-99999902-3" className="rounded-full border border-line bg-white px-5 py-3 font-mono text-[16px] text-navy outline-none focus-visible:border-navy" />
              <p className="text-[13px] text-ink-2">
                Es a quien le llegan las facturas.{" "}
                <button type="button" onClick={() => setCuitFilial("30-99999902-3")} className="font-semibold text-navy underline underline-offset-2 hover:opacity-70">
                  Usar el de ejemplo
                </button>
              </p>
            </div>
          )}
          {valido && (
            <div className="flex items-center gap-3 rounded-[16px] bg-paper px-4 py-3" aria-live="polite">
              <Building2 className="size-5 shrink-0 text-navy" aria-hidden="true" />
              {empresa.isLoading ? (
                <span className="text-[14px] text-ink-2">Buscando en el BCRA…</span>
              ) : bcra?.ok ? (
                <span className="flex flex-col">
                  <span className="text-[15px] font-semibold text-navy">{bcra.denominacion ?? `CUIT ${digitos(cuit).replace(/^(\d{2})(\d{8})(\d)$/, "$1-$2-$3")}`}</span>
                  <span className="inline-flex items-center gap-1 text-[13px] text-ok"><BadgeCheck className="size-3.5" aria-hidden="true" />{bcra.situacionMax ? `Situación ${bcra.situacionMax} en el BCRA` : "Sin deudas en el BCRA"}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[14px] text-ink-2"><CircleHelp className="size-4" aria-hidden="true" />Sin registros en la Central de Deudores. Podés seguir igual.</span>
              )}
            </div>
          )}
          <button type="button" onClick={() => setPaso(2)} disabled={!valido} className="rounded-full bg-navy px-6 py-4 text-[16px] font-bold text-white transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:bg-cream-2 disabled:text-ink-2 disabled:hover:opacity-100">
            Seguir
          </button>
        </section>
      ) : permisos.isLoading || !permisos.data ? (
        <div className="h-48 animate-pulse rounded-[20px] bg-cream-2 motion-reduce:animate-none" aria-label="Revisando permisos" />
      ) : permisos.data.length === 0 ? (
        <section className="flex flex-col gap-4 rounded-[20px] bg-white p-6">
          <h2 className="text-[22px] font-bold text-navy">Los pagos ya están habilitados</h2>
          <p className="text-[15px] text-ink-2">Esta wallet ya dio los permisos. Cada pago son 3 firmas.</p>
          <button type="button" onClick={terminar} className="rounded-full bg-navy px-6 py-4 text-[16px] font-bold text-white hover:opacity-90">Empezar</button>
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
