import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Info,
  Lock,
  MountainSnow,
  Receipt,
  Repeat,
  ShieldCheck,
  Sun,
  X,
  type LucideIcon,
} from "lucide-react";
import { MAX_LTV, money, quote, short, tokenSrc, type Ticker } from "./data";

const NAME = "[Nombre]";

export function App() {
  return (
    <div className="overflow-x-clip">
      <SiteHeader />
      <Hero />
      <main>
        <Problem />
        <HowItWorks />
        <Calculator />
        <Example />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </div>
  );
}

/* ---------- shared bits ---------- */

function Coin({ t, size, className = "" }: { t: Ticker; size: number; className?: string }) {
  return (
    <img
      src={tokenSrc(t)}
      alt={t}
      width={size}
      height={size}
      className={`shrink-0 rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      className={`text-xs font-semibold tracking-[2px] uppercase lg:text-[13px] ${
        dark ? "text-sun" : "text-sun-ink"
      }`}
    >
      {children}
    </p>
  );
}

function SectionTitle({ children, dark = false, className = "" }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <h2
      className={`text-[30px] leading-[35px] font-semibold tracking-[-0.6px] lg:text-[44px] lg:leading-[48px] lg:tracking-[-1px] ${
        dark ? "text-white" : "text-navy"
      } ${className}`}
    >
      {children}
    </h2>
  );
}

function Logo({ size = 18 }: { size?: number }) {
  return (
    <span className="flex items-center gap-1.5 lg:gap-2">
      <Sun className="text-sun" size={size + 4} aria-hidden />
      <span className="font-bold text-white" style={{ fontSize: size }}>
        {NAME}
      </span>
    </span>
  );
}

function Andes({ className }: { className: string }) {
  return (
    <img
      src="/andes.png"
      alt=""
      aria-hidden
      className={`andes pointer-events-none absolute left-1/2 -translate-x-1/2 select-none ${className}`}
    />
  );
}

function SolDeMayo({ className }: { className: string }) {
  return (
    <img
      src="/sol-de-mayo.png"
      alt=""
      aria-hidden
      className={`pointer-events-none absolute select-none ${className}`}
    />
  );
}

/* ---------- hero ---------- */

const STARS: [number, number, number][] = [
  [180, 150, 3],
  [320, 90, 2],
  [1240, 130, 3],
  [1100, 220, 2],
  [90, 330, 2],
  [1340, 300, 2],
  [460, 200, 2],
  [980, 80, 2],
];

/* The header is fixed: clear over the hero sky, navy with blur once the page scrolls. */
function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex justify-center px-6 transition-[background-color,box-shadow,padding] duration-300 lg:px-24 ${
        scrolled
          ? "bg-navy-deep/85 py-3 shadow-[0_8px_30px_#1b225033] backdrop-blur-md lg:py-3.5"
          : "bg-transparent py-5 lg:py-7"
      }`}
    >
      <nav className="flex w-full max-w-[1248px] items-center justify-between">
        <a href="#" aria-label={`${NAME}, inicio`}>
          <Logo size={16} />
        </a>
        <div className="hidden items-center gap-9 text-[15px] font-medium text-mist lg:flex">
          <a className="transition-colors hover:text-white" href="#como-funciona">Cómo funciona</a>
          <a className="transition-colors hover:text-white" href="#calculadora">Calculadora</a>
          <a className="transition-colors hover:text-white" href="#preguntas">Preguntas frecuentes</a>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm font-medium text-mist lg:inline">ES / EN</span>
          <a
            href="#contacto"
            className="rounded-full px-4 py-2 text-[13px] font-medium text-white ring-[1.5px] ring-white/50 ring-inset transition-colors hover:bg-white/10 lg:px-[22px] lg:py-3 lg:text-[15px]"
          >
            <span className="lg:hidden">Evaluar</span>
            <span className="hidden lg:inline">Evaluar mi expansión</span>
          </a>
        </div>
      </nav>
    </header>
  );
}

/*
 * Hero parallax: scroll progress through the hero (0 to 1) is written to --p on the
 * section, and each layer moves at its own depth. Far layers (stars, sun) sink
 * fastest, the Andes barely move, the copy lifts and fades. Off with reduced motion.
 */
function useHeroParallax() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const p = Math.min(Math.max(window.scrollY / el.offsetHeight, 0), 1);
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return ref;
}

function Hero() {
  const ref = useHeroParallax();
  return (
    <section
      ref={ref}
      className="hero-sky relative flex h-[800px] flex-col items-center overflow-hidden px-6 pt-14 lg:h-[980px] lg:px-24 lg:pt-[76px]"
    >
      <div className="parallax-layer intro-fade absolute inset-0" style={{ ["--depth" as string]: 0.55 }} aria-hidden>
        {STARS.map(([x, y, s], i) => (
          <span
            key={i}
            className="twinkle absolute rounded-full bg-white/70"
            style={{ left: `${(x / 1440) * 100}%`, top: y, width: s, height: s, animationDelay: `${i * 0.37}s` }}
          />
        ))}
      </div>
      <div className="parallax-layer absolute inset-0" style={{ ["--depth" as string]: 0.4 }} aria-hidden>
        <div className="hero-glow absolute bottom-[-60px] left-1/2 h-[400px] w-[640px] -translate-x-1/2 rounded-full lg:h-[520px] lg:w-[900px]" />
        <SolDeMayo className="sun-rise bottom-[-20px] left-[calc(50%-120px)] w-[240px] lg:bottom-0 lg:left-[calc(50%-210px)] lg:w-[420px]" />
      </div>
      <div className="parallax-layer absolute inset-0 z-[2]" style={{ ["--depth" as string]: 0.12 }} aria-hidden>
        <div className="andes-rise absolute inset-0">
          <Andes className="bottom-[-226px] lg:bottom-[-46px]" />
        </div>
      </div>

      <div className="parallax-copy relative z-10 flex flex-col items-center">
        <p className="intro-up flex items-center gap-2 pt-12 pb-4 lg:pt-[72px] lg:pb-6" style={{ animationDelay: "0.1s" }}>
          <span className="size-[7px] rounded-full bg-live lg:size-2" aria-hidden />
          <span className="text-[13px] text-mist lg:hidden">Para empresas de Chile que llegan a Argentina</span>
          <span className="hidden text-sm text-lavender-soft lg:inline">
            Para empresas de Chile que quieren crecer en Argentina
          </span>
        </p>

        <h1
          className="intro-up max-w-[1120px] text-center text-[34px] leading-[38px] font-semibold tracking-[-1px] text-white lg:text-[60px] lg:leading-[66px] lg:tracking-[-1.6px]"
          style={{ animationDelay: "0.25s" }}
        >
          Tu próximo cliente está en Argentina.{" "}
          <span className="text-sun">¿Cómo pagás el primer paso?</span>
        </h1>

        <p className="intro-up pt-4 pb-6 text-center text-[17px] leading-[25px] text-mist lg:hidden" style={{ animationDelay: "0.4s" }}>
          Proveedores, equipos y puesta en marcha: los primeros pagos llegan antes que los primeros cobros.
        </p>

        <div className="intro-up flex items-center gap-2.5 lg:gap-5 lg:pt-8 lg:pb-7" style={{ animationDelay: "0.45s" }}>
          <EquationPill t="CHLt" label="Dejás de garantía" value="CHLt" />
          <ArrowRight className="size-5 text-sun lg:size-7" aria-hidden />
          <EquationPill t="ARGt" label="Tu proveedor cobra en" value="ARGt" />
        </div>

        <p className="intro-up hidden text-center text-xl font-medium text-mist lg:block" style={{ animationDelay: "0.55s" }}>
          Proveedores, equipos y puesta en marcha: los primeros pagos llegan antes que los primeros cobros.
        </p>

        <div className="intro-up w-full pt-5 lg:w-auto lg:pt-7" style={{ animationDelay: "0.65s" }}>
          <a
            href="#contacto"
            className="flex items-center justify-center gap-2.5 rounded-full bg-sun px-[34px] py-4 text-base font-bold text-navy-deep shadow-[0_10px_30px_#f2ae2e59] transition-transform hover:-translate-y-0.5 lg:py-[18px] lg:text-[17px]"
          >
            Evaluar mi expansión
            <ArrowRight size={18} aria-hidden />
          </a>
        </div>
        <p
          className="intro-up max-w-[340px] pt-4 text-center text-xs leading-[18px] font-medium text-white [text-shadow:0_1px_10px_#1b2250] lg:max-w-none lg:text-[13px]"
          style={{ animationDelay: "0.75s" }}
        >
          Piloto para empresas de Chile. Sujeto a evaluación, garantía y fondos disponibles.
        </p>
      </div>
    </section>
  );
}

function EquationPill({ t, label, value }: { t: Ticker; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/8 py-2 pr-4 pl-2 ring-1 ring-white/20 ring-inset lg:gap-3.5 lg:py-3.5 lg:pr-6 lg:pl-3.5">
      <Coin t={t} size={30} className="lg:hidden" />
      <Coin t={t} size={44} className="hidden lg:block" />
      <div className="flex flex-col">
        <span className="hidden text-[13px] text-lavender-soft lg:block">{label}</span>
        <span className="text-[17px] font-bold text-white lg:text-[28px]">{value}</span>
      </div>
    </div>
  );
}

/* ---------- problem ---------- */

const ROWS = [
  ["Crédito", "El banco argentino no conoce tu empresa", "Tu garantía en CHLt define cuánto podés pagar"],
  ["Pagos", "Pagás proveedores antes de cobrar el primer peso", "Cada factura se paga en ARGt, 1 a 1 con el peso"],
  ["Condiciones", "Las conocés del todo recién al firmar", "Ves monto, costo, garantía y devolución antes"],
] as const;

function Problem() {
  return (
    <section className="flex flex-col gap-7 bg-cream px-6 py-[72px] lg:items-center lg:gap-14 lg:px-24 lg:py-[120px]">
      <div className="flex flex-col gap-2.5 lg:items-center lg:gap-3.5">
        <Eyebrow>El problema</Eyebrow>
        <SectionTitle>Llegar a Argentina, hoy y con {NAME}</SectionTitle>
      </div>

      {/* Desktop: comparison table */}
      <div className="hidden w-full max-w-[1040px] overflow-hidden rounded-3xl bg-paper ring-1 ring-edge lg:block" role="table">
        <div className="flex text-[15px] font-bold" role="row">
          <div className="flex-1 px-7 py-[18px]" role="columnheader" />
          <div className="flex-1 bg-cream-2 px-7 py-[18px] text-ink-2" role="columnheader">Hoy</div>
          <div className="flex-1 bg-navy px-7 py-[18px] text-white" role="columnheader">Con {NAME}</div>
        </div>
        {ROWS.map(([k, today, withUs]) => (
          <div key={k} className="flex min-h-24 border-t border-line" role="row">
            <div className="flex flex-1 items-center px-7 py-6 text-[17px] font-semibold text-navy" role="rowheader">{k}</div>
            <div className="flex flex-1 items-center gap-2.5 bg-cream-2/40 px-7 py-6" role="cell">
              <X size={18} className="shrink-0 text-no" aria-label="No" />
              <span className="text-base leading-[23px] text-ink-2">{today}</span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 bg-navy/5 px-7 py-6" role="cell">
              <Check size={18} className="shrink-0 text-yes" aria-label="Sí" />
              <span className="text-base leading-[23px] font-medium text-navy">{withUs}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: one card per row */}
      <div className="flex flex-col gap-3.5 lg:hidden">
        {ROWS.map(([k, today, withUs]) => (
          <div key={k} className="overflow-hidden rounded-[20px] bg-paper ring-1 ring-edge">
            <p className="px-[18px] pt-4 pb-2 text-base font-bold text-navy">{k}</p>
            <div className="px-[18px] pt-2.5 pb-3.5">
              <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-[1.2px] text-ink-2">
                <X size={13} className="text-no" aria-hidden /> HOY
              </p>
              <p className="text-[15px] leading-[22px] text-ink-2">{today}</p>
            </div>
            <div className="bg-navy px-[18px] pt-3.5 pb-4">
              <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-[1.2px] text-sun">
                <Check size={13} aria-hidden /> CON {NAME.toUpperCase()}
              </p>
              <p className="text-[15px] leading-[22px] font-medium text-white">{withUs}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- how it works ---------- */

const STEPS: { title: string; desc: string; icon: LucideIcon }[] = [
  { title: "Contanos qué tenés que pagar", desc: "La factura, el proveedor y qué ponés en marcha en Argentina.", icon: Receipt },
  { title: "Revisamos la operación", desc: "Un agente valida la factura y consulta al proveedor y a tu empresa en el BCRA.", icon: ShieldCheck },
  { title: "Dejás CHLt de garantía", desc: `Pedís hasta el ${MAX_LTV * 100}% de su valor. Ves el costo antes de firmar.`, icon: Lock },
  { title: "Tu proveedor cobra en ARGt", desc: "Devolvés lo pedido más el costo y recuperás tu garantía.", icon: Repeat },
];

function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="flex scroll-mt-4 flex-col gap-3.5 bg-paper px-6 py-[72px] lg:flex-row lg:gap-[72px] lg:px-24 lg:py-[120px]"
    >
      <div className="flex flex-col gap-2.5 pb-3.5 lg:w-[400px] lg:shrink-0 lg:gap-4 lg:pb-0">
        <Eyebrow>Cómo funciona</Eyebrow>
        <SectionTitle>De tu plan al pago de tu proveedor</SectionTitle>
        <p className="text-base leading-6 text-ink-2 lg:text-lg lg:leading-[27px]">
          No prestamos capital propio. El préstamo sale de un mercado de Morpho, un protocolo abierto de préstamos.
        </p>
      </div>
      <ol className="grid flex-1 gap-3.5 lg:grid-cols-2 lg:gap-4">
        {STEPS.map((s, i) => (
          <Step key={s.title} n={i + 1} last={i === STEPS.length - 1} {...s} />
        ))}
      </ol>
    </section>
  );
}

function Step({ n, title, desc, icon: Icon, last }: { n: number; title: string; desc: string; icon: LucideIcon; last: boolean }) {
  return (
    <li
      className={`flex gap-4 rounded-[20px] p-[22px] lg:flex-col lg:gap-3.5 lg:rounded-3xl lg:p-8 ${
        last ? "bg-navy" : "bg-cream ring-1 ring-edge"
      }`}
    >
      <div className="flex items-start justify-between lg:w-full">
        <span className={`text-[44px] leading-[44px] font-light lg:text-[64px] lg:leading-[64px] ${last ? "text-sun" : "text-lavender"}`}>
          {n}
        </span>
        <Icon size={26} className={`hidden lg:block ${last ? "text-sun" : "text-navy"}`} aria-hidden />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 lg:gap-3.5">
        <div className="flex items-start gap-2">
          <h3 className={`flex-1 text-lg leading-[23px] font-semibold lg:text-[22px] lg:leading-[1.25] ${last ? "text-white" : "text-navy"}`}>
            {title}
          </h3>
          <Icon size={22} className={`shrink-0 lg:hidden ${last ? "text-sun" : "text-navy"}`} aria-hidden />
        </div>
        <p className={`text-[15px] leading-[23px] lg:text-base lg:leading-6 ${last ? "text-lavender-soft" : "text-ink-2"}`}>{desc}</p>
      </div>
    </li>
  );
}

/* ---------- calculator ---------- */

const ORIGINS: { name: string; t: Ticker; on: boolean }[] = [
  { name: "Chile", t: "CHLt", on: true },
  { name: "Perú", t: "PERt", on: false },
  { name: "México", t: "MEXt", on: false },
];

function Calculator() {
  const [ars, setArs] = useState(12_000_000);
  const q = quote(ars);

  const onArs = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 13);
    setArs(digits ? Number(digits) : 0);
  };

  return (
    <section
      id="calculadora"
      className="flex scroll-mt-4 flex-col gap-[22px] bg-navy-deep px-6 py-[72px] lg:flex-row lg:items-center lg:gap-[72px] lg:p-[120px]"
    >
      <div className="flex flex-1 flex-col gap-[22px] lg:gap-7">
        <Eyebrow dark>Calculadora</Eyebrow>
        <SectionTitle dark>¿Cuánta garantía necesitás?</SectionTitle>
        <p className="hidden text-lg text-lavender-soft lg:block">Poné cuánto tenés que pagar en Argentina.</p>

        <label className="flex flex-col gap-2 lg:gap-2.5 lg:pt-3">
          <span className="text-[13px] font-semibold text-lavender-soft lg:text-sm">Pagos a proveedores en Argentina</span>
          <span className="flex items-center justify-between gap-3 rounded-[14px] bg-white/8 p-4 ring-1 ring-white/20 ring-inset focus-within:ring-sun lg:px-5 lg:py-[18px]">
            <span className="flex flex-1 items-center gap-2 text-xl font-semibold text-white lg:text-2xl">
              <span aria-hidden>$</span>
              <input
                inputMode="numeric"
                aria-label="Pagos a proveedores en Argentina, en pesos"
                value={ars ? ars.toLocaleString("es-AR") : ""}
                placeholder="0"
                onChange={(e) => onArs(e.target.value)}
                className="w-full min-w-0 bg-transparent tabular-nums outline-none placeholder:text-white/40"
              />
            </span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-white lg:gap-2 lg:text-[15px]">
              <Coin t="ARGt" size={22} /> ARGt
            </span>
          </span>
        </label>

        <div className="flex flex-col gap-2 lg:gap-2.5">
          <p className="text-[13px] font-semibold text-lavender-soft lg:text-sm">Tu empresa viene de <span className="font-normal text-lavender lg:hidden">(Perú y México, pronto)</span></p>
          <div className="grid grid-cols-3 gap-2 lg:flex lg:gap-2.5">
            {ORIGINS.map((o) => (
              <span
                key={o.t}
                className={`flex items-center justify-center gap-1.5 rounded-full px-1.5 py-[9px] text-[13px] font-semibold lg:gap-2 lg:py-2.5 lg:pr-4 lg:pl-2.5 lg:text-[15px] ${
                  o.on ? "bg-sun text-navy-deep" : "text-lavender ring-1 ring-white/15 ring-inset"
                }`}
              >
                <Coin t={o.t} size={20} className={o.on ? "" : "opacity-50"} />
                {o.name}
                {!o.on && <span className="hidden text-xs font-medium lg:inline">· pronto</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-[22px] bg-paper p-[22px] lg:w-[560px] lg:shrink-0 lg:rounded-3xl lg:p-9" aria-live="polite">
        <p className="text-[13px] font-semibold text-ink-2 lg:text-sm">Garantía mínima</p>
        <p className="flex items-baseline gap-2 text-[40px] font-bold tracking-[-1px] text-navy tabular-nums lg:text-[56px] lg:tracking-[-1.5px]">
          {money(q.collateralClp)}
          <span className="text-lg font-semibold tracking-normal lg:text-2xl">CHLt</span>
        </p>
        <p className="text-sm leading-5 text-ink-2 lg:text-[15px] lg:leading-[22px]">
          Equivale a {money(q.collateralArs)} en pesos. Pedís hasta el {MAX_LTV * 100}% de tu garantía.
        </p>

        <dl className="flex flex-col pt-[18px] pb-1 lg:pt-7 lg:pb-0">
          <ResultRow icon={Receipt} k="Tu proveedor cobra">
            <span className="text-base font-bold text-navy tabular-nums lg:text-lg">{short(q.pay)} ARGt</span>
            <span className="text-xs text-ink-2 lg:text-[13px]">1 ARGt = 1 peso</span>
          </ResultRow>
          <ResultRow icon={Lock} k="Tu garantía">
            <span className="text-base font-bold text-navy tabular-nums lg:text-lg">{short(q.collateralClp)} CHLt</span>
            <span className="text-xs text-ink-2 lg:text-[13px]">Queda en Morpho hasta que devolvés</span>
          </ResultRow>
          <ResultRow icon={Info} k="Costo">
            <span className="text-sm font-medium text-ink-2">Tasa variable de Morpho</span>
            <span className="text-xs text-ink-2 lg:text-[13px]">La ves antes de confirmar</span>
          </ResultRow>
        </dl>

        <a
          href="#contacto"
          className="flex items-center justify-center gap-2.5 rounded-full bg-navy p-4 text-[15px] font-semibold text-white transition-colors hover:bg-navy-deep lg:p-[18px] lg:text-base"
        >
          Evaluar mi expansión <ArrowRight size={18} aria-hidden />
        </a>
        <p className="pt-3 text-center text-xs leading-[17px] text-ink-2 lg:pt-3.5 lg:text-[13px]">
          Números ilustrativos. Si tu garantía pierde valor, puede que tengas que sumar más.
        </p>
      </div>
    </section>
  );
}

function ResultRow({ icon: Icon, k, children }: { icon: LucideIcon; k: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 border-t border-line py-[13px] lg:gap-3.5 lg:py-4">
      <Icon size={20} className="hidden shrink-0 text-navy lg:block" aria-hidden />
      <dt className="flex-1 text-sm font-medium whitespace-nowrap text-navy lg:text-base">{k}</dt>
      <dd className="flex flex-col items-end gap-0.5 text-right">{children}</dd>
    </div>
  );
}

/* ---------- example ---------- */

const EXAMPLE_ARS = 12_000_000;
const ex = quote(EXAMPLE_ARS);
const TICKET = [
  ["Factura del proveedor", money(EXAMPLE_ARS)],
  ["El proveedor cobra", `${short(EXAMPLE_ARS)} ARGt`],
  [`Garantía (pide el ${MAX_LTV * 100}%)`, `≈ ${short(ex.collateralClp)} CHLt`],
  ["Costo", "Lo ve antes de firmar"],
  ["Devolución", "Préstamo y costo, como se acordó"],
] as const;

function Example() {
  return (
    <section
      id="ejemplo"
      className="flex scroll-mt-4 flex-col gap-[18px] bg-cream px-6 py-[72px] lg:flex-row lg:items-center lg:gap-20 lg:px-24 lg:py-[120px]"
    >
      <div className="flex flex-1 flex-col gap-[18px]">
        <Eyebrow>Ejemplo ilustrativo</Eyebrow>
        <SectionTitle>Una empresa minera de Antofagasta empieza a operar en San Juan</SectionTitle>
        <p className="text-base leading-6 text-ink-2 lg:text-lg lg:leading-7">
          Ganó un contrato en San Juan y tiene que pagar el montaje a un proveedor local antes de cobrar. Con {NAME} deja CHLt de garantía y el proveedor cobra en ARGt.
        </p>
        <img
          src="/ejemplo-san-juan.jpg"
          alt="Un equipo descarga herramientas frente a un galpón nuevo en San Juan, con la cordillera de fondo, al amanecer"
          className="h-[210px] w-full rounded-[18px] object-cover lg:h-60 lg:rounded-[20px]"
        />
      </div>

      <div className="overflow-hidden rounded-[20px] bg-paper shadow-[0_14px_36px_#1b22501a] ring-1 ring-edge lg:w-[500px] lg:shrink-0 lg:rounded-3xl lg:shadow-[0_20px_50px_#1b22501a]">
        <div className="flex items-center justify-between bg-navy p-[18px] lg:px-7 lg:py-6">
          <TicketCity t="CHLt" city="Antofagasta" />
          <MountainSnow size={26} className="text-sun" aria-hidden />
          <TicketCity t="ARGt" city="San Juan" />
        </div>
        <dl className="px-[18px] py-1 lg:px-7 lg:py-2">
          {TICKET.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-line py-[13px] text-sm lg:py-4 lg:text-[15px]">
              <dt className="text-ink-2">{k}</dt>
              <dd className="text-right font-bold text-navy">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="flex items-center gap-2 px-[18px] pt-3.5 pb-[18px] text-xs text-ink-2 lg:px-7 lg:pt-[18px] lg:pb-6 lg:text-[13px]">
          <Info size={16} aria-hidden /> Números ilustrativos, no es una oferta.
        </p>
      </div>
    </section>
  );
}

function TicketCity({ t, city }: { t: Ticker; city: string }) {
  return (
    <div className="flex items-center gap-2 lg:gap-2.5">
      <Coin t={t} size={28} className="lg:hidden" />
      <Coin t={t} size={32} className="hidden lg:block" />
      <div className="flex flex-col">
        <span className="text-[15px] font-bold text-white lg:text-[17px]">{city}</span>
        <span className="text-[11px] text-lavender-soft lg:text-xs">{t}</span>
      </div>
    </div>
  );
}

/* ---------- faq ---------- */

const FAQ = [
  [
    "¿Me dan plata o pagan mi expansión?",
    "Pagamos gastos concretos: cada pago va a un proveedor y está atado a una factura. Tu empresa devuelve lo pedido más los costos, según lo acordado.",
  ],
  [
    "¿Quién presta la plata?",
    "No prestamos capital propio. El préstamo sale de un mercado de Morpho, financiado por quienes ponen liquidez en él.",
  ],
  [
    "¿Qué pasa con la garantía?",
    "Queda comprometida mientras debés. Si pierde valor y deja de cubrir el préstamo, tenés que sumar más; si no, puede venderse para cubrir la deuda.",
  ],
  [
    "¿Puedo devolverlo con lo que cobre en Argentina?",
    "Podés planificarlo así, pero el calendario de pago tiene que poder cumplirse aunque tus cobros se demoren.",
  ],
  [
    "¿Ya puedo usarlo?",
    "Estamos preparando el piloto con empresas de Chile. Contanos tu caso y vemos si encaja.",
  ],
] as const;

function Faq() {
  return (
    <section
      id="preguntas"
      className="flex scroll-mt-4 flex-col gap-3.5 bg-paper px-6 py-[72px] lg:flex-row lg:gap-[72px] lg:px-24 lg:py-[120px]"
    >
      <div className="flex flex-col gap-2.5 pb-3.5 lg:w-[400px] lg:shrink-0 lg:gap-4 lg:pb-0">
        <Eyebrow>Preguntas frecuentes</Eyebrow>
        <SectionTitle>Antes de comprometer nada</SectionTitle>
        <p className="text-base leading-6 text-ink-2 lg:text-lg lg:leading-[27px]">
          Qué se paga, cuánto cuesta y cómo se devuelve, antes de firmar.
        </p>
      </div>
      <div className="flex flex-1 flex-col">
        {FAQ.map(([q, a], i) => (
          <details key={q} open={i === 0} className="group border-b border-line">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-base font-semibold text-navy lg:py-6 lg:text-lg [&::-webkit-details-marker]:hidden">
              {q}
              <ChevronDown size={20} className="shrink-0 text-ink-2 transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <p className="pb-5 text-[15px] leading-6 text-ink-2 lg:pb-6 lg:text-base lg:leading-[26px]">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ---------- closing + footer ---------- */

const FIELD =
  "w-full rounded-xl bg-paper px-4 py-3 text-[15px] text-navy ring-1 ring-edge ring-inset outline-none placeholder:text-ink-2/60 focus:ring-2 focus:ring-sun";

function Closing() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section
      id="contacto"
      className="closing-sky relative flex scroll-mt-4 flex-col items-center gap-[22px] overflow-hidden px-6 pt-[72px] pb-[300px] lg:gap-6 lg:px-[120px] lg:pt-[110px] lg:pb-[420px]"
    >
      <SolDeMayo className="bottom-[70px] left-[calc(50%-80px)] w-40 lg:bottom-[180px]" />
      <Andes className="bottom-[-176px] z-[1] lg:bottom-[-76px]" />
      <h2 className="relative z-[2] max-w-[820px] text-center text-[32px] leading-9 font-semibold tracking-[-0.8px] text-navy lg:text-[52px] lg:leading-[57px] lg:tracking-[-1.5px]">
        Ya sabés hacia dónde querés crecer
      </h2>
      <p className="relative z-[2] text-center text-lg text-ink-2 lg:text-[22px]">Hablemos de cómo pagar el primer paso.</p>

      <div className="relative z-[3] w-full max-w-[560px] rounded-[22px] bg-white p-[22px] shadow-[0_20px_50px_#1b225026] lg:rounded-3xl lg:p-8">
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <Check size={32} className="text-yes" aria-hidden />
            <p className="text-lg font-semibold text-navy">Recibimos tu consulta</p>
            <p className="text-[15px] leading-6 text-ink-2">
              El próximo paso es revisar tu caso y contactarte para conocer mejor tu proyecto.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <div className="grid gap-3 lg:grid-cols-2">
              <input required name="nombre" placeholder="Nombre" aria-label="Nombre" className={FIELD} />
              <input required name="empresa" placeholder="Empresa" aria-label="Empresa" className={FIELD} />
              <input required type="email" name="correo" placeholder="Correo de trabajo" aria-label="Correo de trabajo" className={FIELD} />
              <input required name="pais" defaultValue="Chile" placeholder="País de origen" aria-label="País de origen" className={FIELD} />
            </div>
            <textarea
              required
              name="pagos"
              rows={3}
              placeholder="¿Qué necesitás pagar en Argentina?"
              aria-label="¿Qué necesitás pagar en Argentina?"
              className={`${FIELD} resize-none`}
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2.5 rounded-full bg-navy p-4 text-[15px] font-semibold text-white transition-colors hover:bg-navy-deep lg:text-base"
            >
              Quiero evaluar mi expansión <ArrowRight size={18} aria-hidden />
            </button>
            <p className="text-center text-xs leading-[17px] text-ink-2">
              Enviar tus datos no te compromete a contratar ni confirma la aprobación de una operación.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col gap-3.5 bg-navy-deep px-6 py-9 lg:flex-row lg:items-center lg:justify-between lg:px-[120px] lg:py-10">
      <div className="flex flex-col gap-2">
        <Logo size={17} />
        <p className="text-sm text-lavender-soft">Proyecto de HackaTwin 2026, equipo Mixto C</p>
      </div>
      <p className="text-xs leading-[18px] text-lavender lg:w-[560px] lg:text-right lg:text-[13px] lg:leading-5">
        No prestamos capital propio: el préstamo sale de un mercado de Morpho. El financiamiento requiere garantía, tiene
        costos y puede implicar la pérdida de los activos comprometidos. Las monedas de Twin son un medio de pago, no una
        inversión.
      </p>
    </footer>
  );
}
