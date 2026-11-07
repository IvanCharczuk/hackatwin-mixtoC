"use client";

// Asistente de Saltar: botón flotante con un chat que responde sobre Saltar,
// financiamiento y (con sesión) la cuenta de la persona. Habla con /api/chat.
// Vive en el dashboard (app/page.tsx) y en /app. Usa los colores del tema de la página.
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowUp, MessageCircle, RotateCcw, X } from "lucide-react";

export type Idioma = "es" | "en" | "pt";
type Mensaje = { rol: "usuario" | "asistente"; texto: string };

const TEXTOS = {
  es: {
    abrir: "Preguntale a Saltar",
    titulo: "Asistente de Saltar",
    sub: "Responde con datos en vivo de Morpho y el BCRA",
    hola: "Hola. Te ayudo con cómo funciona Saltar, cuánta garantía necesitás y cómo financiar tu llegada a Argentina.",
    holaCuenta: "Hola. Veo tu wallet: te digo cuánto podés financiar hoy, qué te falta para empezar y cómo pagar o devolver.",
    placeholder: "Escribí tu pregunta",
    enviar: "Enviar",
    cerrar: "Cerrar",
    borrar: "Empezar de nuevo",
    error: "No pude responder ahora. Probá de nuevo.",
    nota: "Sólo lee datos: no firma ni mueve fondos. No es asesoramiento financiero.",
    sugerencias: [
      "¿Cómo funciona Saltar?",
      "¿Cuánta garantía necesito para 1.000.000 de pesos?",
      "¿Cuánto cuesta y de dónde salen los pesos?",
    ],
    sugerenciasCuenta: ["¿Cuánto puedo financiar hoy?", "¿Cómo pago una factura?", "¿Cómo devuelvo lo que usé?"],
  },
  en: {
    abrir: "Ask Saltar",
    titulo: "Saltar assistant",
    sub: "Answers with live Morpho and BCRA data",
    hola: "Hi. I can help with how Saltar works, how much collateral you need and how to fund your move to Argentina.",
    holaCuenta: "Hi. I can see your wallet: I can tell you how much you can finance today, what you need to start and how to pay or pay back.",
    placeholder: "Type your question",
    enviar: "Send",
    cerrar: "Close",
    borrar: "Start over",
    error: "I couldn't answer right now. Please try again.",
    nota: "Read-only: it never signs or moves funds. Not financial advice.",
    sugerencias: ["How does Saltar work?", "How much collateral do I need for 1,000,000 pesos?", "What does it cost and where do the pesos come from?"],
    sugerenciasCuenta: ["How much can I finance today?", "How do I pay an invoice?", "How do I pay back what I used?"],
  },
  pt: {
    abrir: "Pergunte à Saltar",
    titulo: "Assistente da Saltar",
    sub: "Responde com dados ao vivo do Morpho e do BCRA",
    hola: "Olá. Posso ajudar com como a Saltar funciona, quanta garantia você precisa e como financiar sua chegada à Argentina.",
    holaCuenta: "Olá. Vejo sua wallet: digo quanto você pode financiar hoje, o que falta para começar e como pagar ou devolver.",
    placeholder: "Escreva sua pergunta",
    enviar: "Enviar",
    cerrar: "Fechar",
    borrar: "Recomeçar",
    error: "Não consegui responder agora. Tente de novo.",
    nota: "Só lê dados: não assina nem move fundos. Não é aconselhamento financeiro.",
    sugerencias: ["Como a Saltar funciona?", "Quanta garantia preciso para 1.000.000 de pesos?", "Quanto custa e de onde vêm os pesos?"],
    sugerenciasCuenta: ["Quanto posso financiar hoje?", "Como pago uma fatura?", "Como devolvo o que usei?"],
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
      <strong key={i} className="font-semibold text-navy">
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
                <li key={j} className="list-disc marker:text-ink-2">
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

export function Asistente({
  endpoint,
  wallet,
  idioma = "es",
  pagina,
  cuit,
}: {
  endpoint: string;
  wallet?: string | null;
  idioma?: Idioma;
  /** Qué pantalla está viendo, para que responda en contexto. */
  pagina?: "dashboard" | "pagar-factura";
  /** CUIT de la empresa en pantalla, para aplicar el tope del BCRA. */
  cuit?: string;
}) {
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
        body: JSON.stringify({ mensajes: nuevos, wallet: wallet ?? null, pagina: pagina ?? null, cuit: cuit ?? null }),
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
        className={`fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full bg-navy py-2.5 pr-4 pl-3.5 text-[14px] font-semibold text-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.45)] transition hover:opacity-90 active:scale-[0.98] sm:right-6 sm:bottom-6 ${
          abierto ? "pointer-events-none opacity-0 sm:pointer-events-auto sm:opacity-100" : ""
        }`}
      >
        {abierto ? <X className="size-4" aria-hidden /> : <MessageCircle className="size-4" aria-hidden />}
        {abierto ? t.cerrar : t.abrir}
      </button>

      <section
        role="dialog"
        aria-label={t.titulo}
        aria-hidden={!abierto}
        className={`fixed inset-x-3 bottom-3 z-50 flex max-h-[min(600px,calc(100dvh-24px))] flex-col overflow-hidden rounded-2xl border border-line bg-white text-navy shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)] transition duration-150 ease-out sm:inset-x-auto sm:right-6 sm:bottom-20 sm:w-[380px] ${
          abierto ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <header className="flex shrink-0 items-center gap-2 border-b border-line px-4 py-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] leading-tight font-semibold text-navy">{t.titulo}</h2>
            <p className="mt-0.5 text-[12px] text-ink-2">{t.sub}</p>
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
              className="grid size-8 place-items-center rounded-full text-ink-2 transition hover:bg-cream hover:text-navy"
            >
              <RotateCcw className="size-4" aria-hidden />
            </button>
          )}
          <button
            type="button"
            onClick={() => setAbierto(false)}
            aria-label={t.cerrar}
            className="grid size-8 place-items-center rounded-full text-ink-2 transition hover:bg-cream hover:text-navy"
          >
            <X className="size-4" aria-hidden />
          </button>
        </header>

        <div ref={lista} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 text-[14px] leading-relaxed text-navy" aria-live="polite">
          <p className="text-ink-2">{wallet ? t.holaCuenta : t.hola}</p>

          {mensajes.length === 0 && (
            <div className="flex flex-col items-start gap-2">
              {sugerencias.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void preguntar(s)}
                  className="rounded-full border border-line px-3 py-1.5 text-left text-[13px] font-medium text-navy transition hover:border-sun hover:bg-cream"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {mensajes.map((m, i) =>
            m.rol === "usuario" ? (
              <div key={i} className="ml-auto w-fit max-w-[85%] rounded-2xl bg-cream px-3.5 py-2 whitespace-pre-wrap text-navy">
                {m.texto}
              </div>
            ) : (
              <div key={i} className="max-w-full">
                <Texto texto={m.texto} />
              </div>
            ),
          )}

          {pensando && (
            <div className="flex items-center gap-1.5 py-1" aria-label="…">
              {[0, 150, 300].map((d) => (
                <span key={d} className="size-1.5 rounded-full bg-ink-2/60 motion-safe:animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          )}
          {error && <p className="text-[13px] text-bad">{error}</p>}
        </div>

        <form onSubmit={enviar} className="shrink-0 px-3 pt-2 pb-3">
          <div className="flex items-end gap-2 rounded-3xl border border-line bg-white py-1.5 pr-1.5 pl-4 transition focus-within:border-sun">
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
              className="max-h-28 min-h-8 flex-1 resize-none bg-transparent py-1.5 text-[14px] text-navy outline-none placeholder:text-ink-2/70"
            />
            <button
              type="submit"
              disabled={!texto.trim() || pensando}
              aria-label={t.enviar}
              className="grid size-8 shrink-0 place-items-center rounded-full bg-navy text-white transition hover:opacity-90 active:scale-95 disabled:opacity-30"
            >
              <ArrowUp className="size-4" aria-hidden />
            </button>
          </div>
          <p className="px-1 pt-2 text-[11px] text-ink-2/80">{t.nota}</p>
        </form>
      </section>
    </>
  );
}
