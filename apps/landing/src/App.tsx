import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  Check,
  Coins,
  Info,
  Link2,
  MountainSnow,
  Receipt,
  Repeat,
  Snowflake,
  Sun,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  COUNTRIES,
  FROZEN_SHARE,
  REPAY_SHARE,
  TICKERS,
  money,
  quote,
  short,
  tokenSrc,
  type Ticker,
} from "./data";

const NAME = "[Nombre]";

export function App() {
  return (
    <div className="overflow-x-clip">
      <Hero />
      <main>
        <Problem />
        <HowItWorks />
        <Calculator />
        <Example />
        <Currencies />
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

function Hero() {
  return (
    <header className="hero-sky relative flex h-[800px] flex-col items-center overflow-hidden px-6 pt-5 lg:h-[980px] lg:px-24 lg:pt-7">
      <div className="hero-glow absolute bottom-[-60px] left-1/2 h-[400px] w-[640px] -translate-x-1/2 rounded-full lg:h-[520px] lg:w-[900px]" />
      <SolDeMayo className="sun-rise bottom-[-20px] left-[calc(50%-120px)] z-[1] w-[240px] lg:bottom-0 lg:left-[calc(50%-210px)] lg:w-[420px]" />
      <Andes className="bottom-[-226px] z-[2] lg:bottom-[-46px]" />
      {STARS.map(([x, y, s], i) => (
        <span
          key={i}
          aria-hidden
          className="absolute rounded-full bg-white/70"
          style={{ left: `${(x / 1440) * 100}%`, top: y, width: s, height: s }}
        />
      ))}

      <nav className="relative z-10 flex w-full max-w-[1248px] items-center justify-between">
        <a href="#" aria-label={`${NAME}, inicio`}>
          <Logo size={16} />
        </a>
        <div className="hidden items-center gap-9 text-[15px] font-medium text-mist lg:flex">
          <a className="transition-colors hover:text-white" href="#como-funciona">Cómo funciona</a>
          <a className="transition-colors hover:text-white" href="#calculadora">Calculadora</a>
          <a className="transition-colors hover:text-white" href="#monedas">Monedas</a>
        </div>
        <div className="hidden items-center gap-4 lg:flex">
          <span className="text-sm font-medium text-mist">ES / EN</span>
          <a
            href="#ejemplo"
            className="rounded-full px-[22px] py-3 text-[15px] font-medium text-white ring-[1.5px] ring-white/50 ring-inset transition-colors hover:bg-white/10"
          >
            Ver el ejemplo
          </a>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center">
        <p className="flex items-center gap-2 pt-12 pb-4 lg:pt-[72px] lg:pb-6">
          <span className="size-[7px] rounded-full bg-live lg:size-2" aria-hidden />
          <span className="text-[13px] text-mist lg:hidden">Crédito para PYMES que abren en LATAM</span>
          <span className="hidden text-sm text-lavender-soft lg:inline">
            Crédito para PYMES que abren en otro país de LATAM
          </span>
        </p>

        <h1 className="max-w-[900px] text-center text-[38px] leading-[41px] font-semibold tracking-[-1px] text-white lg:text-[68px] lg:leading-[72px] lg:tracking-[-1.8px]">
          Expandite a LATAM sin depender de un banco
        </h1>

        <p className="pt-4 pb-6 text-center text-[17px] leading-[25px] text-mist lg:hidden">
          Congelás 30, te prestamos 100. Tu garantía son tus ventas.
        </p>

        <div className="flex items-center gap-2.5 lg:gap-5 lg:pt-10 lg:pb-9">
          <EquationPill t="CHLt" label="Congelás" value="30 CHLt" />
          <ArrowRight className="size-5 text-sun lg:size-7" aria-hidden />
          <EquationPill t="ARGt" label="Te prestamos" value="100 ARGt" />
        </div>

        <p className="hidden text-center text-[23px] font-medium text-mist lg:block">
          Tu garantía son tus ventas. Lo devolvés con un % de lo que vendés allá.
        </p>

        <div className="w-full pt-5 lg:w-auto lg:pt-8">
          <a
            href="#calculadora"
            className="flex items-center justify-center gap-2.5 rounded-full bg-sun px-[34px] py-4 text-base font-bold text-navy-deep shadow-[0_10px_30px_#f2ae2e59] transition-transform hover:-translate-y-0.5 lg:py-[18px] lg:text-[17px]"
          >
            Calculá tu préstamo
            <ArrowRight size={18} aria-hidden />
          </a>
        </div>
      </div>
    </header>
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
  ["Historial", "El banco del país nuevo no te conoce", "Tu límite sale de tus ventas en ARGt"],
  ["Financiamiento", "El banco argentino no financia afuera", "Recibís el préstamo en la moneda de allá"],
  ["Monedas", "Convertir es caro y lento", "CHLt, MEXt, BRAt: 1 a 1 con la moneda local"],
] as const;

function Problem() {
  return (
    <section className="flex flex-col gap-7 bg-cream px-6 py-[72px] lg:items-center lg:gap-14 lg:px-24 lg:py-[120px]">
      <div className="flex flex-col gap-2.5 lg:items-center lg:gap-3.5">
        <Eyebrow>El problema</Eyebrow>
        <SectionTitle>Abrir afuera, hoy y con {NAME}</SectionTitle>
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
  { title: "Conectás tus ventas en ARGt", desc: "Lo que vendés en Argentina define tu límite.", icon: Link2 },
  { title: "Congelás una parte", desc: "Queda como garantía mientras devolvés el préstamo.", icon: Snowflake },
  { title: "Recibís el préstamo en la moneda nueva", desc: "CHLt, MEXt, BRAt o la del país donde abrís.", icon: Coins },
  { title: "Cada venta paga sola", desc: `Un contrato separa el ${REPAY_SHARE * 100}% de cada venta allá, hasta saldar.`, icon: Repeat },
];

function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="flex scroll-mt-4 flex-col gap-3.5 bg-paper px-6 py-[72px] lg:flex-row lg:gap-[72px] lg:px-24 lg:py-[120px]"
    >
      <div className="flex flex-col gap-2.5 pb-3.5 lg:w-[400px] lg:shrink-0 lg:gap-4 lg:pb-0">
        <Eyebrow>Cómo funciona</Eyebrow>
        <SectionTitle>Así funciona, en cuatro pasos</SectionTitle>
        <p className="text-base leading-6 text-ink-2 lg:text-lg lg:leading-[27px]">
          Tu garantía son tus ventas. No pedimos historial en el país nuevo.
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

function Calculator() {
  const [sales, setSales] = useState(10_000_000);
  const [countryIdx, setCountryIdx] = useState(0);
  const country = COUNTRIES[countryIdx];
  const q = quote(sales, country);

  const onSales = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 13);
    setSales(digits ? Number(digits) : 0);
  };

  return (
    <section
      id="calculadora"
      className="flex scroll-mt-4 flex-col gap-[22px] bg-navy-deep px-6 py-[72px] lg:flex-row lg:items-center lg:gap-[72px] lg:p-[120px]"
    >
      <div className="flex flex-1 flex-col gap-[22px] lg:gap-7">
        <Eyebrow dark>Calculadora</Eyebrow>
        <SectionTitle dark>¿Cuánto te podemos prestar?</SectionTitle>
        <p className="hidden text-lg text-lavender-soft lg:block">Poné lo que vendés por mes y adónde querés abrir.</p>

        <label className="flex flex-col gap-2 lg:gap-2.5 lg:pt-3">
          <span className="text-[13px] font-semibold text-lavender-soft lg:text-sm">Ventas mensuales en Argentina</span>
          <span className="flex items-center justify-between gap-3 rounded-[14px] bg-white/8 p-4 ring-1 ring-white/20 ring-inset focus-within:ring-sun lg:px-5 lg:py-[18px]">
            <span className="flex flex-1 items-center gap-2 text-xl font-semibold text-white lg:text-2xl">
              <span aria-hidden>$</span>
              <input
                inputMode="numeric"
                aria-label="Ventas mensuales en Argentina, en pesos"
                value={sales ? sales.toLocaleString("es-AR") : ""}
                placeholder="0"
                onChange={(e) => onSales(e.target.value)}
                className="w-full min-w-0 bg-transparent tabular-nums outline-none placeholder:text-white/40"
              />
            </span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-white lg:gap-2 lg:text-[15px]">
              <Coin t="ARGt" size={22} /> ARGt
            </span>
          </span>
        </label>

        <fieldset className="flex flex-col gap-2 lg:gap-2.5">
          <legend className="pb-2 text-[13px] font-semibold text-lavender-soft lg:pb-2.5 lg:text-sm">País destino</legend>
          {[COUNTRIES.slice(0, 3), COUNTRIES.slice(3)].map((row, r) => (
            <div key={r} className="grid grid-cols-3 gap-2 lg:flex lg:gap-2.5">
              {row.map((c) => {
                const idx = COUNTRIES.indexOf(c);
                const on = idx === countryIdx;
                return (
                  <button
                    key={c.ticker}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setCountryIdx(idx)}
                    className={`flex items-center justify-center gap-1.5 rounded-full px-1.5 py-[9px] text-[13px] font-semibold transition-colors lg:gap-2 lg:py-2.5 lg:pr-4 lg:pl-2.5 lg:text-[15px] ${
                      on ? "bg-sun text-navy-deep" : "bg-white/6 text-white ring-1 ring-white/20 ring-inset hover:bg-white/12"
                    }`}
                  >
                    <Coin t={c.ticker} size={18} className="lg:hidden" />
                    <Coin t={c.ticker} size={22} className="hidden lg:block" />
                    {c.name}
                  </button>
                );
              })}
            </div>
          ))}
        </fieldset>
      </div>

      <div className="flex flex-col rounded-[22px] bg-paper p-[22px] lg:w-[560px] lg:shrink-0 lg:rounded-3xl lg:p-9" aria-live="polite">
        <p className="text-[13px] font-semibold text-ink-2 lg:text-sm">Tu límite de préstamo</p>
        <p className="text-[40px] font-bold tracking-[-1px] text-navy tabular-nums lg:text-[56px] lg:tracking-[-1.5px]">{money(q.limit)}</p>
        <p className="text-sm leading-5 text-ink-2 lg:text-[15px] lg:leading-[22px]">
          Lo recibís en {country.ticker}: ≈ {short(q.received)} {country.currencyName}. Hasta 3 meses de tus ventas.
        </p>

        <dl className="flex flex-col pt-[18px] pb-1 lg:pt-7 lg:pb-0">
          <ResultRow icon={Snowflake} k="Congelás">
            <span className="text-base font-bold text-navy tabular-nums lg:hidden">${short(q.frozen)} ARGt</span>
            <span className="hidden text-lg font-bold text-navy tabular-nums lg:block">{money(q.frozen)} ARGt</span>
            <span className="hidden text-[13px] text-ink-2 lg:block">{FROZEN_SHARE * 100}% del préstamo</span>
          </ResultRow>
          <ResultRow icon={Repeat} k={<><span className="lg:hidden">Por venta en {country.name}</span><span className="hidden lg:inline">Se descuenta por venta</span></>}>
            <span className="text-base font-bold text-navy lg:text-lg">{REPAY_SHARE * 100}%</span>
            <span className="hidden text-[13px] text-ink-2 lg:block">de cada venta en {country.name}</span>
          </ResultRow>
          <ResultRow icon={Receipt} k="Comisión del préstamo">
            <span className="text-[13px] font-medium text-ink-2 lg:hidden">Antes de confirmar</span>
            <span className="hidden text-sm font-medium text-ink-2 lg:block">La ves antes de confirmar</span>
          </ResultRow>
        </dl>

        <button
          type="button"
          className="mt-0 flex items-center justify-center gap-2.5 rounded-full bg-navy p-4 text-[15px] font-semibold text-white transition-colors hover:bg-navy-deep lg:p-[18px] lg:text-base"
        >
          Pedí tu préstamo <ArrowRight size={18} aria-hidden />
        </button>
        <p className="pt-3 text-center text-xs leading-[17px] text-ink-2 lg:pt-3.5 lg:text-[13px]">
          Números ilustrativos. El límite depende de tus ventas reales en ARGt.
        </p>
      </div>
    </section>
  );
}

function ResultRow({ icon: Icon, k, children }: { icon: LucideIcon; k: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 border-t border-line py-[13px] lg:gap-3.5 lg:py-4">
      <Icon size={20} className="hidden shrink-0 text-navy lg:block" aria-hidden />
      <dt className="flex-1 text-sm font-medium text-navy lg:text-base">{k}</dt>
      <dd className="flex flex-col items-end gap-0.5 text-right">{children}</dd>
    </div>
  );
}

/* ---------- example ---------- */

const TICKET = [
  ["Ventas en Mendoza", "$10M / mes"],
  ["Límite (3 meses de ventas)", "Equiv. $30M"],
  ["Congela en ARGt", "$9M"],
  ["Recibe en CHLt", "≈ 19,7M CHLt"],
  ["Repago", "10% de cada venta"],
] as const;

function Example() {
  return (
    <section
      id="ejemplo"
      className="flex scroll-mt-4 flex-col gap-[18px] bg-cream px-6 py-[72px] lg:flex-row lg:items-center lg:gap-20 lg:px-24 lg:py-[120px]"
    >
      <div className="flex flex-1 flex-col gap-[18px]">
        <Eyebrow>Ejemplo ilustrativo</Eyebrow>
        <SectionTitle>Una cafetería de Mendoza abre en Santiago de Chile</SectionTitle>
        <p className="text-base leading-6 text-ink-2 lg:text-lg lg:leading-7">
          Vende $10M por mes en Argentina. Con {NAME} abre su segundo local del otro lado de la cordillera, sin pedirle nada a un banco chileno.
        </p>
        <img
          src="/cafeteria-mendoza.jpg"
          alt="Una cafetería con clientes y la cordillera de fondo, a la mañana"
          className="h-[210px] w-full rounded-[18px] object-cover lg:h-60 lg:rounded-[20px]"
        />
      </div>

      <div className="overflow-hidden rounded-[20px] bg-paper shadow-[0_14px_36px_#1b22501a] ring-1 ring-edge lg:w-[500px] lg:shrink-0 lg:rounded-3xl lg:shadow-[0_20px_50px_#1b22501a]">
        <div className="flex items-center justify-between bg-navy p-[18px] lg:px-7 lg:py-6">
          <TicketCity t="ARGt" city="Mendoza" />
          <MountainSnow size={26} className="text-sun" aria-hidden />
          <TicketCity t="CHLt" city="Santiago" />
        </div>
        <dl className="px-[18px] py-1 lg:px-7 lg:py-2">
          {TICKET.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-line py-[13px] text-sm lg:py-4 lg:text-[15px]">
              <dt className="text-ink-2">{k}</dt>
              <dd className="font-bold text-navy">{v}</dd>
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

/* ---------- currencies ---------- */

function Currencies() {
  return (
    <section
      id="monedas"
      className="flex scroll-mt-4 flex-col gap-[18px] bg-paper px-6 py-[72px] lg:flex-row lg:items-center lg:gap-20 lg:px-24 lg:py-[120px]"
    >
      <div className="flex flex-1 flex-col gap-[18px] lg:gap-4">
        <Eyebrow>Monedas</Eyebrow>
        <SectionTitle>7 monedas = 42 pares de países</SectionTitle>
        <p className="text-base leading-6 text-ink-2 lg:text-lg lg:leading-7">
          Cada punto es una ruta: vendés en la moneda de la fila y abrís en la de la columna. Construido con las monedas de Twin.
        </p>
      </div>
      <div className="flex justify-center pt-1.5 lg:pt-0">
        <Matrix />
      </div>
    </section>
  );
}

function Matrix() {
  const cell = "size-8 lg:size-11";
  return (
    <div
      role="img"
      aria-label="Matriz de 7 por 7 monedas: 42 rutas. Resaltada la ruta del ejemplo, de ARGt a CHLt."
      className="flex flex-col gap-[5px] rounded-[20px] bg-cream p-3.5 ring-1 ring-edge lg:gap-2 lg:rounded-3xl lg:p-6"
    >
      <div className="flex gap-[5px] lg:gap-2">
        <span className={cell} />
        {TICKERS.map((t) => (
          <img key={t} src={tokenSrc(t)} alt="" title={t} className={`${cell} rounded-full`} />
        ))}
      </div>
      {TICKERS.map((from) => (
        <div key={from} className="flex gap-[5px] lg:gap-2">
          <img src={tokenSrc(from)} alt="" title={from} className={`${cell} rounded-full`} />
          {TICKERS.map((to) => {
            if (from === to) return <span key={to} className={cell} />;
            const route = from === "ARGt" && to === "CHLt";
            return (
              <span
                key={to}
                title={`Vendés en ${from}, abrís en ${to}`}
                className={`${cell} flex items-center justify-center rounded-lg transition-colors lg:rounded-[10px] ${
                  route ? "bg-navy" : "bg-navy/6 hover:bg-navy/15"
                }`}
              >
                <span className={`rounded-full ${route ? "size-2.5 bg-sun lg:size-3.5" : "size-1.5 bg-lavender lg:size-2"}`} />
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ---------- closing + footer ---------- */

function Closing() {
  return (
    <section className="closing-sky relative flex h-[560px] flex-col items-center gap-[22px] overflow-hidden px-6 pt-[72px] lg:h-[640px] lg:gap-6 lg:px-[120px] lg:pt-[110px]">
      <SolDeMayo className="bottom-[70px] left-[calc(50%-80px)] w-40 lg:bottom-[180px]" />
      <Andes className="bottom-[-176px] z-[1] lg:bottom-[-76px]" />
      <h2 className="relative z-[2] max-w-[820px] text-center text-[32px] leading-9 font-semibold tracking-[-0.8px] text-navy lg:text-[52px] lg:leading-[57px] lg:tracking-[-1.5px]">
        Tu próxima sucursal no tiene que esperar al banco
      </h2>
      <a
        href="#calculadora"
        className="relative z-[3] flex items-center gap-2.5 rounded-full bg-navy px-7 py-4 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 lg:px-8 lg:py-[18px] lg:text-[17px]"
      >
        Calculá tu préstamo <ArrowRight size={18} aria-hidden />
      </a>
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
      <p className="text-xs leading-[18px] text-lavender lg:w-[460px] lg:text-right lg:text-[13px] lg:leading-5">
        Construido con las monedas de Twin. Las monedas de Twin son un medio de pago, no una inversión.
      </p>
    </footer>
  );
}
