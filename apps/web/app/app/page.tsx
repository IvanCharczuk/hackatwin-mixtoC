"use client";

// /app: todo el recorrido en una pantalla. Arriba la empresa, a la izquierda la factura y
// el plan de firmas, a la derecha la revisión que se va llenando y el veredicto.
import { useEffect, useState } from "react";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { useAuth } from "@/lib/auth";
import { useCredito } from "@/lib/hooks/use-credito";
import { useCapacidad, useEmpresa, useFactura, useSaldos } from "@/lib/hooks/use-factura";
import { FACTURA_EJEMPLO } from "@/lib/factura-ejemplo";
import { Encabezado } from "@/components/app/encabezado";
import { Subir } from "@/components/app/subir";
import { Panel } from "@/components/app/panel";
import { Pagar } from "@/components/app/pagar";
import { Onboarding } from "@/components/app/onboarding";
import { borrarOnboarding, guardarOnboarding, leerOnboarding } from "@/lib/onboarding";

export default function App() {
  const sesion = useAuth();
  const { address } = useAccount();
  const dentro = sesion.ready && sesion.authenticated && Boolean(address);
  const wallet = dentro ? address : undefined;

  const [cuit, setCuitEstado] = useState("");
  // Primera vez por wallet: undefined = todavía no leído, null = falta el onboarding.
  const [ob, setOb] = useState<{ cuit: string } | null | undefined>(undefined);
  useEffect(() => {
    if (!wallet) return setOb(undefined);
    const o = leerOnboarding(wallet);
    setOb(o);
    if (o) setCuitEstado(o.cuit);
  }, [wallet]);
  const setCuit = (c: string) => {
    setCuitEstado(c);
    if (wallet && c.replace(/\D/g, "").length === 11) guardarOnboarding(wallet, { cuit: c.replace(/\D/g, "") });
  };
  const [proveedor, setProveedor] = useState("");
  const pagarA = isAddress(proveedor) ? proveedor : undefined;

  const empresa = useEmpresa(cuit, wallet);
  const saldos = useSaldos(wallet);
  const { data: credito } = useCredito(wallet);
  const f = useFactura();
  const [montoTxt, setMontoTxt] = useState("");
  const facturaOk = f.fase === "listo" && f.factura?.ok ? f.factura : undefined;
  useEffect(() => setMontoTxt(facturaOk ? String(facturaOk.total) : ""), [facturaOk]);
  // La wallet del proveedor sale de la factura; se puede corregir a mano.
  useEffect(() => setProveedor(f.factura?.walletProveedor ?? ""), [f.factura]);
  const monto = Number(montoTxt.replace(",", "."));
  const montoValido = Boolean(facturaOk) && monto > 0 && monto <= (facturaOk?.total ?? 0);
  const total = montoValido ? monto : undefined;
  const cap = useCapacidad(wallet, credito, saldos.chlt, total, pagarA);
  // Los dólares que van a quedar de respaldo, para que el agente calcule con lo mismo que el panel.
  const colateralUsdt0 = cap.limiteTotal && credito ? cap.limiteTotal / (credito.argtPorUsdt0 * 0.6) : undefined;

  return (
    <div className="tema-medicus flex min-h-dvh flex-col bg-paper">
      <Encabezado
        sesion={sesion}
        cuit={cuit}
        setCuit={setCuit}
        bcra={empresa.data?.perfil.bcra ?? f.resultado?.perfil.bcra}
        cargandoBcra={empresa.isLoading}
        razonSocialFactura={f.factura?.receptorCoincide ? f.factura.razonSocialReceptor : undefined}
        saldos={saldos}
      />

      {dentro && wallet && ob === null ? (
        <Onboarding
          wallet={wallet}
          simular={sesion.mock}
          onListo={(c) => {
            guardarOnboarding(wallet, { cuit: c });
            setCuitEstado(c);
            setOb({ cuit: c });
          }}
        />
      ) : (
      <main className="mx-auto grid w-full max-w-[1200px] flex-1 gap-10 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 lg:py-20">
        <div className="flex min-w-0 flex-col gap-14">
          <Subir
            fase={f.fase}
            error={f.error}
            bloqueado={!dentro}
            onArchivo={(file) => wallet && f.leerArchivo(file, cuit, wallet, colateralUsdt0)}
            onEjemplo={() => wallet && f.usarFactura(FACTURA_EJEMPLO, cuit, wallet, colateralUsdt0)}
            onReiniciar={f.reiniciar}
            proveedor={proveedor}
            setProveedor={setProveedor}
            proveedorValido={Boolean(pagarA)}
            hayFactura={Boolean(f.factura)}
            desdeFactura={Boolean(f.factura?.walletProveedor) && proveedor.toLowerCase() === f.factura?.walletProveedor?.toLowerCase()}
          />

          {facturaOk && (
            <div className="flex flex-col gap-2">
              <label htmlFor="monto" className="text-[14px] font-semibold text-navy">
                Monto a pagar ahora
              </label>
              <div className="flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 focus-within:border-sun">
                <input id="monto" value={montoTxt} onChange={(e) => setMontoTxt(e.target.value.replace(/[^\d.,]/g, ""))} inputMode="decimal" aria-describedby="monto-ayuda" className="w-full min-w-0 bg-transparent text-[17px] font-semibold text-navy tabular-nums outline-none" />
                <span className="text-[14px] font-semibold text-ink-2">ARS</span>
              </div>
              <p id="monto-ayuda" className={montoValido ? "text-[13px] text-ink-2" : "text-[13px] text-bad"}>
                {montoValido ? `De un total de ${facturaOk.total.toLocaleString("es-AR")} ARS. Podés pagar una parte ahora.` : `Poné un monto entre 1 y ${facturaOk.total.toLocaleString("es-AR")} ARS.`}
              </p>
            </div>
          )}

          {f.resultado?.explicacion?.texto && (
            <section aria-labelledby="agente" className="flex flex-col gap-2">
              <h2 id="agente" className="text-[17px] font-semibold text-navy">Lo que dice el agente</h2>
              <p className="max-w-[68ch] text-[15px] leading-relaxed text-pretty text-ink-2">{f.resultado.explicacion.texto}</p>
            </section>
          )}

          {cap.alcanza && cap.chequeo.data && (
            <Pagar
              key={`${cap.chltAUsar}-${total}-${pagarA ?? "yo"}`}
              pasos={cap.chequeo.data.pasos}
              simular={sesion.mock}
              monto={(total ?? 0).toLocaleString("es-AR")}
              aProveedor={Boolean(pagarA)}
            />
          )}
        </div>

        <div className="lg:row-span-2">
          <Panel
            fase={f.fase}
            factura={f.factura}
            checksAgente={f.resultado?.pago?.checks ?? []}
            saldoChlt={saldos.chlt}
            limiteTotal={cap.limiteTotal}
            faltan={cap.faltan}
            chequeos={cap.chequeo.data?.chequeos}
            listo={cap.listo}
            alcanza={cap.alcanza}
          />
        </div>
      </main>
      )}
      {dentro && wallet && ob && (
        <footer className="mx-auto w-full max-w-[1200px] px-6 pb-8">
          <button type="button" onClick={() => { borrarOnboarding(wallet); setOb(null); f.reiniciar(); }} className="text-[13px] text-ink-2 underline underline-offset-2 hover:text-navy">
            Rehacer el onboarding
          </button>
        </footer>
      )}
    </div>
  );
}
