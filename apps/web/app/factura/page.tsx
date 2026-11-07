"use client";

// Subir la factura de un proveedor: el agente la lee, revisa al proveedor y a tu
// empresa en el BCRA, chequea si alcanza la plata y te dice de dónde sale el pago.
import { useState } from "react";
import { useAccount } from "wagmi";
import { Check, FileUp, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_ADDRESS } from "@/lib/mock";
import { useT, SelectorIdioma } from "@/lib/i18n";
import { getLocale } from "@/lib/formato";

const EYEBROW = "text-[12px] font-semibold uppercase tracking-[2px] text-sun-ink lg:text-[13px]";
const fmt = (n: number) => n.toLocaleString(getLocale(), { maximumFractionDigits: 2 });

type Check = { id: string; titulo: string; ok: boolean; detalle: string };
type Respuesta = {
  error?: string;
  factura?: {
    ok: boolean;
    problemas: string[];
    razonSocialEmisor: string;
    cuitEmisor: string;
    razonSocialReceptor: string;
    numeroCompleto: string;
    tipo: string;
    cae: string;
    fechaEmision: string;
    vencimientoPago: string;
    total: number;
    moneda: string;
    receptorCoincide: boolean;
  };
  resultado?: {
    decision: { disponibleArgt: number; tope: number };
    pago: {
      plan: { desdeSaldoArgt: number; aPedirArgt: number; alcanza: boolean; quedaSaldoArgt: number; quedaParaPedirArgt: number };
      checks: Check[];
      factura: { id: string };
    } | null;
    explicacion: { texto: string; fuente: string };
  } | null;
};

function Fila({ ok, titulo, detalle }: { ok: boolean; titulo: string; detalle: string }) {
  return (
    <li className="flex gap-3 border-b border-line py-3 last:border-0">
      <span className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full", ok ? "bg-ok text-white" : "bg-bad text-white")}>
        {ok ? <Check className="size-4" /> : <X className="size-4" />}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[15px] font-semibold text-navy">{titulo}</span>
        <span className="text-[14px] text-ink-2">{detalle}</span>
      </span>
    </li>
  );
}

export default function SubirFactura() {
  const { t } = useT();
  const { address } = useAccount();
  const [archivo, setArchivo] = useState<File | null>(null);
  const [cuit, setCuit] = useState("30-99999902-3");
  const [wallet, setWallet] = useState("");
  const [colateral, setColateral] = useState("10");
  const [cargando, setCargando] = useState(false);
  const [r, setR] = useState<Respuesta | null>(null);
  // Sin sesión iniciada, usa la wallet de demo para que la pantalla funcione igual.
  const walletUsada = wallet || address || MOCK_ADDRESS;

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!archivo) return;
    setCargando(true);
    setR(null);
    const fd = new FormData();
    fd.append("archivo", archivo);
    fd.append("cuit", cuit);
    fd.append("wallet", walletUsada);
    fd.append("colateralUsdt0", colateral);
    try {
      const res = await fetch("/api/agente/factura", { method: "POST", body: fd });
      setR(await res.json());
    } catch {
      setR({ error: t.errorAgente });
    } finally {
      setCargando(false);
    }
  }

  const f = r?.factura;
  const pago = r?.resultado?.pago;

  return (
    <main className="mx-auto flex w-full max-w-[880px] flex-col gap-8 px-5 py-10 lg:py-14">
      <div className="-mb-2 flex items-center justify-between gap-3">
        <a href="/" className="text-[16px] font-bold text-navy">Saltar</a>
        <SelectorIdioma tono="claro" />
      </div>
      <header className="flex flex-col gap-3">
        <p className={EYEBROW}>{t.fEyebrow}</p>
        <h1 className="text-[32px] leading-[1.08] font-semibold tracking-[-0.8px] text-navy lg:text-[44px]">{t.fTitulo}</h1>
        <p className="max-w-[620px] text-[16px] text-ink-2">
          {t.fTexto}
        </p>
      </header>

      <form onSubmit={enviar} className="flex flex-col gap-5 rounded-[20px] border border-line bg-paper p-5 lg:p-7">
        <label
          className={cn(
            "flex cursor-pointer flex-col items-center gap-2 rounded-[16px] border-2 border-dashed px-4 py-8 text-center transition-colors",
            archivo ? "border-ok bg-white" : "border-line bg-white hover:border-navy",
          )}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const x = e.dataTransfer.files?.[0];
            if (x) setArchivo(x);
          }}
        >
          <FileUp className="size-7 text-navy" />
          <span className="text-[15px] font-semibold text-navy">{archivo ? archivo.name : t.fArrastra}</span>
          <span className="text-[13px] text-ink-2">{t.fFormatos}</span>
          <input id="archivo" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => setArchivo(e.target.files?.[0] ?? null)} />
        </label>
        <a href="/factura-ejemplo.pdf" download className="-mt-2 self-center text-[13px] font-semibold text-sun-ink underline underline-offset-4">
          {t.fEjemplo}
        </a>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-2">
            <span className="text-[13px] font-semibold text-ink-2">{t.cuitEmpresa}</span>
            <input id="cuit" value={cuit} onChange={(e) => setCuit(e.target.value)} className="rounded-[14px] border border-line bg-white px-4 py-3 text-[16px] font-semibold text-navy outline-none focus:border-navy" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-[13px] font-semibold text-ink-2">{t.tuWallet}</span>
            <input id="wallet" value={wallet} placeholder={address ?? MOCK_ADDRESS} onChange={(e) => setWallet(e.target.value.trim())} className="rounded-[14px] border border-line bg-white px-4 py-3 font-mono text-[14px] text-navy outline-none focus:border-navy" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-[13px] font-semibold text-ink-2">{t.colateral}</span>
            <input id="colateral" inputMode="decimal" value={colateral} onChange={(e) => setColateral(e.target.value.replace(/[^\d.]/g, ""))} className="rounded-[14px] border border-line bg-white px-4 py-3 text-[16px] font-semibold text-navy tabular-nums outline-none focus:border-navy" />
          </label>
        </div>

        <button
          type="submit"
          disabled={!archivo || !walletUsada || cargando}
          className="flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-4 text-[16px] font-semibold text-white transition-opacity disabled:opacity-40"
        >
          {cargando ? <><Loader2 className="size-5 animate-spin" /> {t.revisando}</> : t.revisar}
        </button>
      </form>

      {r?.error && <p className="rounded-[14px] bg-bad/10 px-5 py-4 text-[15px] font-semibold text-bad">{r.error}</p>}

      {f && (
        <section className="flex flex-col gap-4 rounded-[20px] border border-line bg-white p-5 lg:p-7">
          <p className={EYEBROW}>{t.laFactura}</p>
          <div className="grid gap-x-8 gap-y-2 text-[15px] sm:grid-cols-2">
            <span><b>{t.proveedor}:</b> {f.razonSocialEmisor} · CUIT {f.cuitEmisor}</span>
            <span><b>{t.para}:</b> {f.razonSocialReceptor}</span>
            <span><b>{t.facturaTipo} {f.tipo}</b> {f.numeroCompleto} · {f.fechaEmision}</span>
            <span><b>{t.cae}:</b> <span className="font-mono">{f.cae}</span></span>
            <span><b>{t.venceElPago}:</b> {f.vencimientoPago || t.noFigura}</span>
            <span className="text-[18px] font-semibold"><b>{t.total}:</b> $ {fmt(f.total)} {f.moneda !== "ARS" ? f.moneda : ""}</span>
          </div>
          {f.problemas.length > 0 && (
            <ul className="flex flex-col gap-1 rounded-[14px] bg-sun-soft/40 px-4 py-3 text-[14px] text-sun-ink">
              {f.problemas.map((p) => <li key={p}>{p}</li>)}
            </ul>
          )}
        </section>
      )}

      {pago && (
        <section className="flex flex-col gap-2 rounded-[20px] border border-line bg-white p-5 lg:p-7">
          <p className={EYEBROW}>{t.chequeosAgente}</p>
          <ul>{pago.checks.map((c) => <Fila key={c.id} ok={c.ok} titulo={c.titulo} detalle={c.detalle} />)}</ul>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[14px] bg-cream px-4 py-3"><p className="text-[13px] text-ink-2">{t.deTuSaldo}</p><p className="text-[22px] font-semibold tabular-nums">{fmt(pago.plan.desdeSaldoArgt)} ARGt</p></div>
            <div className="rounded-[14px] bg-cream px-4 py-3"><p className="text-[13px] text-ink-2">{t.aPedirMorpho}</p><p className="text-[22px] font-semibold tabular-nums">{fmt(pago.plan.aPedirArgt)} ARGt</p></div>
            <div className="rounded-[14px] bg-cream px-4 py-3"><p className="text-[13px] text-ink-2">{t.teQueda}</p><p className="text-[22px] font-semibold tabular-nums">{fmt(pago.plan.quedaParaPedirArgt)} ARGt</p></div>
          </div>
          <p className="mt-2 font-mono text-[12px] text-ink-2">{t.idFactura}: {pago.factura.id.slice(0, 18)}…</p>
        </section>
      )}

      {r?.resultado?.explicacion?.texto && (
        <section className="flex flex-col gap-2 rounded-[20px] bg-navy p-5 text-white lg:p-7">
          <p className="text-[12px] font-semibold uppercase tracking-[2px] text-sun">{t.loQueDice}</p>
          <p className="text-[17px] leading-[1.5]">{r.resultado.explicacion.texto}</p>
        </section>
      )}
    </main>
  );
}
