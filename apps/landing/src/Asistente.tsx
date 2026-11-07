// Asistente de Saltar: botón flotante con un chat que responde sobre Saltar,
// financiamiento y (con sesión) la cuenta de la persona. Habla con /api/chat.
// Copia de apps/web/components/asistente.tsx: si cambiás uno, copialo al otro.
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

export type Idioma = "es" | "en" | "pt";
type Mensaje = { rol: "usuario" | "asistente"; texto: string };

const TEXTOS = {
  es: {
    abrir: "Preguntale a Saltar",
    titulo: "Asistente de Saltar",
    sub: "Responde con datos en vivo de Morpho y el BCRA",
    hola: "Hola. Te ayudo con cómo funciona Saltar, cuánta garantía necesitás y cómo financiar tu llegada a Argentina.",
    holaCuenta: "Hola. Veo tu wallet: puedo decirte tus saldos, tu deuda y cuánto podés pedir hoy.",
    placeholder: "Escribí tu pregunta",
    enviar: "Enviar",
    cerrar: "Cerrar",
    borrar: "Empezar de nuevo",
    error: "No pude responder ahora. Probá de nuevo.",
    nota: "Sólo lee datos: no firma ni mueve fondos. No es asesoramiento financiero.",
    sugerencias: [
      "¿Cómo funciona Saltar?",
      "¿Cuánta garantía necesito para 1.000.000 de pesos?",
      "¿Cuánto cuesta y quién presta la plata?",
    ],
    sugerenciasCuenta: ["¿Cuánto puedo pedir hoy?", "¿Cuánto debo y cuánto uso de mi garantía?", "¿Cómo está el mercado hoy?"],
  },
  en: {
    abrir: "Ask Saltar",
    titulo: "Saltar assistant",
    sub: "Answers with live Morpho and BCRA data",
    hola: "Hi. I can help with how Saltar works, how much collateral you need and how to fund your move to Argentina.",
    holaCuenta: "Hi. I can see your wallet: I can tell you your balances, your debt and how much you can borrow today.",
    placeholder: "Type your question",
    enviar: "Send",
    cerrar: "Close",
    borrar: "Start over",
    error: "I couldn't answer right now. Please try again.",
    nota: "Read-only: it never signs or moves funds. Not financial advice.",
    sugerencias: ["How does Saltar work?", "How much collateral do I need for 1,000,000 pesos?", "What does it cost and who lends the money?"],
    sugerenciasCuenta: ["How much can I borrow today?", "How much do I owe?", "How is the market today?"],
  },
  pt: {
    abrir: "Pergunte à Saltar",
    titulo: "Assistente da Saltar",
    sub: "Responde com dados ao vivo do Morpho e do BCRA",
    hola: "Olá. Posso ajudar com como a Saltar funciona, quanta garantia você precisa e como financiar sua chegada à Argentina.",
    holaCuenta: "Olá. Vejo sua wallet: posso dizer seus saldos, sua dívida e quanto você pode pedir hoje.",
    placeholder: "Escreva sua pergunta",
    enviar: "Enviar",
    cerrar: "Fechar",
    borrar: "Recomeçar",
    error: "Não consegui responder agora. Tente de novo.",
    nota: "Só lê dados: não assina nem move fundos. Não é aconselhamento financeiro.",
    sugerencias: ["Como a Saltar funciona?", "Quanta garantia preciso para 1.000.000 de pesos?", "Quanto custa e quem empresta o dinheiro?"],
    sugerenciasCuenta: ["Quanto posso pedir hoje?", "Quanto devo?", "Como está o mercado hoje?"],
  },
} satisfies Record<Idioma, unknown>;

const CLAVE = "saltar-asistente";

function leerGuardado(): Mensaje[] {
  try {
    const v = JSON.parse(sessionStorage.getItem(CLAVE) ?? "[]");
    return Array.isArray(v) ? v.filter((m) => m && typeof m.texto === "string").slice(-24) : [];
  } catch {
    return [];
  }
}

// **negrita** y listas con guiones; nada más.
function enLinea(texto: string): ReactNode[] {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold text-navy-deep">
        {p.slice(2, -2)}
      </strong>
    ) : (
      p
    ),
  );
}

const VINETA = /^\s*[-•*]\s+/;

// Agrupa líneas seguidas: las que empiezan con guion van a una lista, el resto a párrafos.
function Texto({ texto }: { texto: string }) {
  const grupos: { lista: boolean; lineas: string[] }[] = [];
  for (const l of texto.split("\n")) {
    if (!l.trim()) {
      grupos.push({ lista: false, lineas: [] });
      continue;
    }
    const lista = VINETA.test(l);
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.lista === lista && ultimo.lineas.length) ultimo.lineas.push(l);
    else grupos.push({ lista, lineas: [l] });
  }
  return (
    <>
      {grupos
        .filter((g) => g.lineas.length)
        .map((g, i) =>
          g.lista ? (
            <ul key={i} className="my-1.5 space-y-1 pl-4">
              {g.lineas.map((l, j) => (
                <li key={j} className="list-disc marker:text-sun">
                  {enLinea(l.replace(VINETA, ""))}
                </li>
              ))}
            </ul>
          ) : (
            <p key={i} className="my-1.5 first:mt-0 last:mb-0">
              {g.lineas.map((l, j) => (
                <span key={j}>
                  {j > 0 && <br />}
                  {enLinea(l)}
                </span>
              ))}
            </p>
          ),
        )}
    </>
  );
}

function Sol({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <circle cx="12" cy="12" r="5" fill="currentColor" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x="11.2" y="1.5" width="1.6" height="4" rx="0.8" fill="currentColor" transform={`rotate(${i * 45} 12 12)`} />
      ))}
    </svg>
  );
}

export function Asistente({ endpoint, wallet, idioma = "es" }: { endpoint: string; wallet?: string | null; idioma?: Idioma }) {
  const t = TEXTOS[idioma] ?? TEXTOS.es;
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState("");
  const [pensando, setPensando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lista = useRef<HTMLDivElement>(null);
  const entrada = useRef<HTMLTextAreaElement>(null);

  useEffect(() => setMensajes(leerGuardado()), []);
  useEffect(() => {
    try {
      sessionStorage.setItem(CLAVE, JSON.stringify(mensajes));
    } catch {
      /* storage bloqueado */
    }
  }, [mensajes]);
  useEffect(() => {
    lista.current?.scrollTo({ top: lista.current.scrollHeight, behavior: "smooth" });
  }, [mensajes, pensando, abierto]);
  useEffect(() => {
    if (abierto) entrada.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [abierto]);

  async function preguntar(pregunta: string) {
    const q = pregunta.trim();
    if (!q || pensando) return;
    const nuevos: Mensaje[] = [...mensajes, { rol: "usuario", texto: q }];
    setMensajes(nuevos);
    setTexto("");
    setError(null);
    setPensando(true);
    try {
      const r = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mensajes: nuevos, wallet: wallet ?? null }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || typeof j.texto !== "string") throw new Error(j.error ?? t.error);
      setMensajes([...nuevos, { rol: "asistente", texto: j.texto }]);
    } catch {
      setError(t.error);
    } finally {
      setPensando(false);
    }
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    void preguntar(texto);
  }

  const sugerencias = wallet ? t.sugerenciasCuenta : t.sugerencias;

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-label={abierto ? t.cerrar : t.abrir}
        className={`fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full bg-navy-deep py-3 pr-5 pl-4 text-sm font-semibold text-cream shadow-[0_10px_30px_-8px_rgba(27,34,80,0.55)] ring-1 ring-white/10 transition duration-200 hover:-translate-y-0.5 hover:bg-navy active:translate-y-0 sm:right-6 sm:bottom-6 ${
          abierto ? "pointer-events-none translate-y-2 opacity-0 sm:pointer-events-auto sm:translate-y-0 sm:opacity-100" : ""
        }`}
      >
        <Sol className="h-5 w-5 text-sun motion-safe:animate-[spin_12s_linear_infinite]" />
        {abierto ? t.cerrar : t.abrir}
      </button>

      <section
        role="dialog"
        aria-label={t.titulo}
        aria-hidden={!abierto}
        className={`fixed inset-x-3 bottom-3 z-50 flex max-h-[min(640px,calc(100dvh-24px))] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-line bg-paper text-navy shadow-[0_30px_80px_-20px_rgba(27,34,80,0.45)] transition duration-200 ease-out sm:inset-x-auto sm:right-6 sm:bottom-22 sm:w-[400px] ${
          abierto ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-3 scale-95 opacity-0"
        }`}
      >
        <header className="relative shrink-0 overflow-hidden bg-navy-deep px-5 pt-4 pb-5 text-cream">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{
              background:
                "radial-gradient(70% 120% at 85% 130%, #f3c98a 0%, #f3c98a00 60%), linear-gradient(180deg, #161c45 0%, #2b3470 70%, #6f6a9a 100%)",
            }}
          />
          <div className="relative flex items-start gap-3">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sun/15 ring-1 ring-sun/40">
              <Sol className="h-5 w-5 text-sun" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-base leading-tight font-semibold">{t.titulo}</h2>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-cream/75">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#2fbf71] opacity-60 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2fbf71]" />
                </span>
                {t.sub}
              </p>
            </div>
            {mensajes.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setMensajes([]);
                  setError(null);
                }}
                aria-label={t.borrar}
                title={t.borrar}
                className="grid h-8 w-8 place-items-center rounded-full text-cream/80 transition hover:bg-white/10 hover:text-cream"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                  <path
                    d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label={t.cerrar}
              className="grid h-8 w-8 place-items-center rounded-full text-cream/80 transition hover:bg-white/10 hover:text-cream"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </header>

        <div ref={lista} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm leading-relaxed" aria-live="polite">
          <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-cream-2/70 px-3.5 py-2.5">{wallet ? t.holaCuenta : t.hola}</div>

          {mensajes.length === 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {sugerencias.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void preguntar(s)}
                  className="rounded-full border border-line bg-paper px-3 py-1.5 text-left text-xs font-medium text-navy transition hover:-translate-y-px hover:border-sun hover:bg-sun-soft/40 active:translate-y-0"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {mensajes.map((m, i) =>
            m.rol === "usuario" ? (
              <div key={i} className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-md bg-navy px-3.5 py-2.5 whitespace-pre-wrap text-cream">
                {m.texto}
              </div>
            ) : (
              <div key={i} className="max-w-[92%] rounded-2xl rounded-tl-md bg-cream-2/70 px-3.5 py-2.5">
                <Texto texto={m.texto} />
              </div>
            ),
          )}

          {pensando && (
            <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-tl-md bg-cream-2/70 px-4 py-3" aria-label="…">
              {[0, 150, 300].map((d) => (
                <span key={d} className="h-1.5 w-1.5 rounded-full bg-ink-2 motion-safe:animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          )}
          {error && <p className="text-xs text-[#b5524a]">{error}</p>}
        </div>

        <form onSubmit={enviar} className="shrink-0 border-t border-line bg-paper px-3 pt-3 pb-2">
          <div className="flex items-end gap-2 rounded-2xl border border-line bg-cream/60 p-1.5 pl-3.5 transition focus-within:border-navy/50 focus-within:bg-paper">
            <textarea
              ref={entrada}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void preguntar(texto);
                }
              }}
              rows={1}
              maxLength={2000}
              placeholder={t.placeholder}
              className="max-h-28 min-h-9 flex-1 resize-none bg-transparent py-2 text-sm text-navy outline-none placeholder:text-ink-2/70"
            />
            <button
              type="submit"
              disabled={!texto.trim() || pensando}
              aria-label={t.enviar}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sun text-navy-deep transition hover:brightness-105 active:scale-95 disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <p className="px-1 pt-1.5 text-[11px] text-ink-2/80">{t.nota}</p>
        </form>
      </section>
    </>
  );
}
