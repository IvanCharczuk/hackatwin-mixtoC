"use client";

// /app: todo el recorrido en una pantalla, como un hero claro (cielo, nubes, sol y Andes) con una
// sola tarjeta encima. A la izquierda la empresa y la revisión; a la derecha los 3 pasos y el pago.
import { useEffect, useState } from "react";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { useAuth } from "@/lib/auth";
import { useCredito } from "@/lib/hooks/use-credito";
import { useCapacidad, useEmpresa, useFactura, useSaldos } from "@/lib/hooks/use-factura";
import { FACTURA_EJEMPLO } from "@/lib/factura-ejemplo";
import { Barra, Empresa } from "@/components/app/encabezado";
import { Subir } from "@/components/app/subir";
import { Agente, Panel } from "@/components/app/panel";
import { Campo, Paso as PasoForm } from "@/components/app/paso";
import { Cielo } from "@/components/app/cielo";
import { Pagar } from "@/components/app/pagar";
import { Onboarding } from "@/components/app/onboarding";
import { Movimientos } from "@/components/dashboard/movimientos";
import type { Paso } from "@/lib/credito";
import { borrarOnboarding, guardarOnboarding, leerOnboarding, type Onboarding as DatosOnboarding } from "@/lib/onboarding";

export default function App() {
  const sesion = useAuth();
  const { address } = useAccount();
  const dentro = sesion.ready && sesion.authenticated && Boolean(address);
  const wallet = dentro ? address : undefined;

  const [cuit, setCuitEstado] = useState("");
  // Primera vez por wallet: undefined = todavía no leído, null = falta el onboarding.
  const [ob, setOb] = useState<DatosOnboarding | null | undefined>(undefined);
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
  // El plan se congela la primera vez que da verde: después de pagar, la deuda cambia y el chequeo
  // se recalcula, pero el pago tiene que quedar como comprobante y no volver al paso 1.
  const [plan, setPlan] = useState<Paso[] | null>(null);
  const [pagada, setPagada] = useState(false);
  useEffect(() => {
    setPlan(null);
    setPagada(false);
  }, [f.factura, montoTxt, pagarA]);
  useEffect(() => {
    if (!plan && cap.alcanza && cap.chequeo.data) setPlan(cap.chequeo.data.pasos);
  }, [plan, cap.alcanza, cap.chequeo.data]);
  // Los dólares que van a quedar de respaldo, para que el agente calcule con lo mismo que el panel.
  const colateralUsdt0 = cap.limiteTotal && credito ? cap.limiteTotal / (credito.argtPorUsdt0 * 0.6) : undefined;

  return (
    <div className="tema-medicus flex min-h-dvh flex-col bg-paper">
      <Cielo>
        <Barra sesion={sesion} />
        {dentro && wallet && ob === null ? (
          <Onboarding
            wallet={wallet}
            simular={sesion.mock}
            onListo={(d) => {
              guardarOnboarding(wallet, d);
              setCuitEstado(d.cuit);
              setOb(d);
            }}
          />
        ) : (
          <main className="mx-auto flex w-full max-w-[1120px] flex-1 items-center px-4 pt-2 pb-[200px] sm:px-6 lg:pb-[260px]">
            <div className="grid w-full overflow-hidden rounded-[28px] border border-white/80 bg-white/80 shadow-[0_40px_90px_-40px_rgb(0_37_100/0.35)] backdrop-blur-xl lg:grid-cols-[380px_minmax(0,1fr)]">
              <div className="order-2 flex flex-col gap-6 border-t border-line/70 bg-[#F5F8FD]/80 p-6 sm:p-8 lg:order-1 lg:border-t-0 lg:border-r">
                <Empresa
                  sesion={sesion}
                  cuit={cuit}
                  setCuit={setCuit}
                  bcra={empresa.data?.perfil.bcra ?? f.resultado?.perfil.bcra}
                  cargandoBcra={empresa.isLoading}
                  razonSocialFactura={(f.factura?.receptorCoincide ? f.factura.razonSocialReceptor : undefined) ?? ob?.nombre ?? (cuit.replace(/\D/g, "") === FACTURA_EJEMPLO.cuitReceptor ? FACTURA_EJEMPLO.razonSocialReceptor : undefined)}
                  saldos={saldos}
                />
                <div className="h-px bg-line" />
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
                  pagada={pagada}
                />
                {f.resultado?.explicacion?.texto && <Agente texto={f.resultado.explicacion.texto} />}
              </div>

              <div className="order-1 flex min-w-0 flex-col gap-9 p-6 sm:p-8 lg:order-2 lg:p-10">
                <Subir
                  fase={f.fase}
                  error={f.error}
                  bloqueado={!dentro}
                  factura={f.factura}
                  onArchivo={(file) => wallet && f.leerArchivo(file, cuit, wallet, colateralUsdt0)}
                  onEjemplo={() => wallet && f.usarFactura(FACTURA_EJEMPLO, cuit, wallet, colateralUsdt0)}
                  onReiniciar={f.reiniciar}
                  proveedor={proveedor}
                  setProveedor={setProveedor}
                  proveedorValido={Boolean(pagarA)}
                  hayFactura={Boolean(f.factura)}
                  desdeFactura={Boolean(f.factura?.walletProveedor) && proveedor.toLowerCase() === f.factura?.walletProveedor?.toLowerCase()}
                />

                <PasoForm n={3} titulo="Cuánto pagás ahora" apagado={!facturaOk}>
                  {facturaOk ? (
                    <Campo
                      id="monto"
                      label="Monto en pesos"
                      malo={!montoValido}
                      ayuda={montoValido ? `De un total de ${facturaOk.total.toLocaleString("es-AR")} ARS. Podés pagar una parte ahora.` : `Poné un monto entre 1 y ${facturaOk.total.toLocaleString("es-AR")} ARS.`}
                    >
                      <span className="text-[20px] font-semibold text-ink-2" aria-hidden="true">$</span>
                      <input id="monto" value={montoTxt} onChange={(e) => setMontoTxt(e.target.value.replace(/[^\d.,]/g, ""))} inputMode="decimal" aria-describedby="monto-ayuda" className="w-full min-w-0 bg-transparent text-[20px] font-semibold text-navy tabular-nums outline-none" />
                      <span className="text-[12px] font-semibold text-ink-2">ARS</span>
                    </Campo>
                  ) : (
                    <p className="text-[13px] text-ink-2">Podés pagar todo o una parte.</p>
                  )}
                </PasoForm>

                {plan ? (
                  <div className="sm:pl-11">
                    <Pagar
                      key={f.factura?.numeroCompleto ?? "factura"}
                      pasos={plan}
                      onListo={() => setPagada(true)}
                      simular={sesion.mock}
                      monto={(total ?? 0).toLocaleString("es-AR")}
                      aProveedor={Boolean(pagarA)}
                      plano
                    />
                  </div>
                ) : (
                  <div className="sm:pl-11">
                    <button type="button" disabled className="w-full rounded-full bg-navy py-3.5 text-[15px] font-semibold text-white disabled:opacity-35">
                      {facturaOk && total ? `Pagar ${total.toLocaleString("es-AR")} ARS` : "Pagar la factura"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
        )}
      </Cielo>
      {dentro && wallet && ob && <Movimientos address={wallet} ilustrativo={false} />}
      {dentro && wallet && ob && (
        <footer className="mx-auto w-full max-w-[1120px] px-6 pb-8">
          <button type="button" onClick={() => { borrarOnboarding(wallet); setOb(null); f.reiniciar(); }} className="text-[13px] text-ink-2 underline underline-offset-2 hover:text-navy">
            Rehacer el onboarding
          </button>
        </footer>
      )}
    </div>
  );
}
