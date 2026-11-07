"use client";

// El agente en el dashboard: arma tu perfil (BCRA + onchain), te dice cuánto ARGt
// podés pedir hoy y por qué, y te lleva a pagar una factura. Llama a /api/agente
// (lado del servidor; la clave de Claude nunca llega al navegador).
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bot, FileText, Loader2, RefreshCw } from "lucide-react";
import { fmt } from "@/lib/formato";
import { cn } from "@/lib/utils";
import { useT, type Dict } from "@/lib/i18n";

const EYEBROW = "text-[12px] font-semibold uppercase tracking-[2px] text-sun-ink lg:text-[13px]";
const CUIT_DEMO = "30-99999902-3";

type Respuesta = {
  error?: string;
  perfil?: {
    bcra: { ok: boolean; simulado?: boolean; denominacion?: string; situacionMax: number | null; chequesRechazados: number; deudasMenoresIrregulares?: number };
    onchain: { transacciones: number; saldos: { ARGt: number; CHLt: number; USDT0: number }; posicion: { colateralUsdt0: number; deudaArgt: number } };
  };
  decision?: { estado: string; tope: number; disponibleArgt: number; motivos: string[] };
  explicacion?: { texto: string; fuente: "claude" | "armada" };
};

function Dato({ titulo, valor, nota, alerta }: { titulo: string; valor: string; nota: string; alerta?: boolean }) {
  return (
    <div className="flex flex-col gap-1 rounded-[18px] border border-line bg-paper p-5">
      <span className="text-[13px] font-semibold text-ink-2">{titulo}</span>
      <span className={cn("text-[24px] leading-tight font-bold tracking-[-0.4px] tabular-nums", alerta ? "text-bad" : "text-navy")}>{valor}</span>
      <span className="text-[13px] leading-[1.4] text-ink-2">{nota}</span>
    </div>
  );
}

function situacionTexto(b: NonNullable<Respuesta["perfil"]>["bcra"], t: Dict) {
  if (!b.ok) return { valor: t.sinDato, nota: t.sinDatoNota, alerta: true };
  if (b.situacionMax === null) return { valor: t.sinDeudas, nota: t.sinDeudasNota, alerta: false };
  return {
    valor: t.situacion(b.situacionMax),
    nota: b.chequesRechazados > 0 ? t.chequesNota(b.chequesRechazados) : b.situacionMax === 1 ? t.normal : t.conAtrasos,
    alerta: b.situacionMax >= 2 || b.chequesRechazados > 0,
  };
}

export function Agente({ address }: { address: `0x${string}` }) {
  const { t } = useT();
  const [cuit, setCuit] = useState(CUIT_DEMO);
  const [ejemplo, setEjemplo] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [r, setR] = useState<Respuesta | null>(null);

  const consultar = useCallback(async (conEjemplo: boolean) => {
    setCargando(true);
    try {
      const res = await fetch("/api/agente", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          cuit,
          wallet: address,
          ...(conEjemplo ? { bcraSimulado: { situacion: 2, chequesRechazados: 1 } } : {}),
        }),
      });
      setR(await res.json());
    } catch {
      setR({ error: t.errorAgente });
    } finally {
      setCargando(false);
    }
  }, [cuit, address, t]);

  useEffect(() => {
    consultar(false);
    // Sólo al entrar con una wallet; después, con el botón.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const b = r?.perfil?.bcra;
  const s = b ? situacionTexto(b, t) : null;
  const d = r?.decision;

  return (
    <section className="bg-paper">
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-8 px-6 py-[64px] lg:py-[88px]">
        <div className="flex flex-col gap-3">
          <p className={EYEBROW}>{t.agEyebrow}</p>
          <h2 className="max-w-[760px] text-[30px] leading-[1.1] font-semibold tracking-[-0.6px] text-navy lg:text-[42px]">{t.agTitulo}</h2>
          <p className="max-w-[640px] text-[16px] text-ink-2">
            {t.agTexto}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-2">
            <span className="text-[13px] font-semibold text-ink-2">{t.cuitEmpresa}</span>
            <input id="agente-cuit" value={cuit} onChange={(e) => setCuit(e.target.value)} className="w-full rounded-[14px] border border-line bg-white px-4 py-3 text-[16px] font-semibold text-navy outline-none focus:border-navy sm:w-[240px]" />
          </label>
          <button type="button" onClick={() => { setEjemplo(false); consultar(false); }} disabled={cargando} className="flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-3.5 text-[15px] font-semibold text-white disabled:opacity-50">
            {cargando ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} {t.analizar}
          </button>
          <label className="flex items-center gap-2 text-[14px] font-semibold text-ink-2">
            <input id="agente-ejemplo" type="checkbox" checked={ejemplo} onChange={(e) => { setEjemplo(e.target.checked); consultar(e.target.checked); }} className="size-4 accent-navy" />
            {t.perfilEjemplo}
          </label>
        </div>

        {r?.error && <p className="rounded-[14px] bg-bad/10 px-5 py-4 text-[15px] font-semibold text-bad">{r.error}</p>}

        {cargando && !r && <p className="flex items-center gap-2 text-[15px] text-ink-2"><Loader2 className="size-4 animate-spin" /> {t.agRevisando}</p>}

        {d && s && r?.perfil && (
          <div className={cn("flex flex-col gap-6 transition-opacity", cargando && "opacity-50")}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Dato titulo={b?.simulado ? t.bcraEjemplo : "BCRA"} valor={s.valor} nota={s.nota} alerta={s.alerta} />
              <Dato titulo={t.historial} valor={`${r.perfil.onchain.transacciones} ${t.tx}`} nota={t.historialNota} />
              <Dato titulo={t.topeSobre} valor={`${Math.round(d.tope * 100)}%`} nota={t.topeNota} alerta={d.tope < 0.6} />
              <Dato titulo={t.podesPedir} valor={`${fmt(d.disponibleArgt)} ARGt`} nota={r.perfil.onchain.posicion.colateralUsdt0 > 0 ? t.conRespaldo(fmt(r.perfil.onchain.posicion.colateralUsdt0, 2)) : t.dejaRespaldo} />
            </div>

            {r.explicacion?.texto && (
              <div className="flex gap-4 rounded-[22px] bg-navy p-6 text-white lg:p-8">
                <Bot className="mt-1 size-6 shrink-0 text-sun" aria-hidden="true" />
                <div className="flex flex-col gap-2">
                  <p className="text-[12px] font-semibold uppercase tracking-[2px] text-sun">{t.loQueDice}</p>
                  <p className="text-[17px] leading-[1.55]">{r.explicacion.texto}</p>
                </div>
              </div>
            )}

            <Link href="/factura" className="flex items-center gap-2 self-start rounded-full border border-navy px-6 py-3.5 text-[15px] font-semibold text-navy hover:bg-navy hover:text-white">
              <FileText className="size-4" /> {t.pagarFacturaProv}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
