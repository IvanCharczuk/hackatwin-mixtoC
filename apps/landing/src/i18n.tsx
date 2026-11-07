import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Lang } from "./data";

export type { Lang };
export const LANGS: Lang[] = ["es", "en", "pt"];

const STORAGE_KEY = "saltar-lang";

const es = {
  docTitle: "Saltar · Llegar a Argentina",
  nav: {
    home: "Saltar, inicio",
    how: "Cómo funciona",
    calc: "Calculadora",
    faq: "Preguntas frecuentes",
    ctaShort: "Evaluar",
    ctaLong: "Evaluar mi expansión",
    app: "Entrar a la app",
    langGroup: "Idioma",
    langNames: { es: "Español", en: "English", pt: "Português" },
  },
  hero: {
    tagMobile: "Para empresas que se expanden a Argentina",
    tagDesktop: "Para empresas de Chile que se expanden a Argentina",
    title1: "Expandí tu empresa a Argentina.",
    title2: "Operá en pesos desde el primer día.",
    sub: "Dejás tus stablecoins de garantía y recibís pesos digitales para abrir tu operación, sin vender lo que tenés.",
    leave: "Dejás de garantía",
    receive: "Recibís para operar",
    cta: "Evaluar mi expansión",
    note: "Piloto para empresas de Chile. Sujeto a evaluación, garantía y fondos disponibles.",
  },
  problem: {
    title: (name: string) => `Conseguir pesos en Argentina: hoy y con ${name}`,
    today: "Hoy",
    todayUpper: "HOY",
    withUs: (name: string) => `Con ${name}`,
    withUsUpper: (name: string) => `CON ${name.toUpperCase()}`,
    no: "No",
    yes: "Sí",
    rows: [
      { k: "Crédito", today: "El banco argentino no conoce tu empresa", withUs: "Tu garantía en CHLt define cuánto ARGt recibís" },
      { k: "Pesos", today: "Para tener pesos tenés que vender tus stablecoins", withUs: "Recibís ARGt, 1 a 1 con el peso, y tus CHLt quedan de garantía" },
      { k: "Condiciones", today: "Las conocés del todo recién al firmar", withUs: "Ves monto, costo, garantía y devolución antes" },
    ],
  },
  how: {
    eyebrow: "Cómo funciona",
    title: "De tu plan a operar en Argentina",
    intro: "No prestamos capital propio. El préstamo sale de un mercado de Morpho, un protocolo abierto de préstamos.",
    steps: [
      { title: "Contanos tu expansión", desc: (_p: number) => "Dónde abrís, qué ponés en marcha y cuántos pesos necesitás los primeros meses." },
      { title: "Revisamos tu empresa", desc: (_p: number) => "Un agente revisa la documentación y consulta a tu empresa en el BCRA." },
      { title: "Dejás CHLt de garantía", desc: (p: number) => `Pedís hasta el ${p}% de su valor. Ves el costo antes de firmar.` },
      { title: "Recibís ARGt para operar", desc: (_p: number) => "Pagás en pesos alquiler, equipos y sueldos. Devolvés lo pedido más el costo y recuperás tu garantía." },
    ],
  },
  calc: {
    eyebrow: "Calculadora",
    title: "¿Cuánta garantía necesitás?",
    intro: "Poné cuántos pesos necesitás para abrir tu operación en Argentina.",
    pesosLabel: "Pesos que necesitás en Argentina",
    from: "Tu empresa viene de",
    soonMobile: "(Perú y México, pronto)",
    soon: "· pronto",
    countries: { CHLt: "Chile", PERt: "Perú", MEXt: "México" },
    minCollateral: "Garantía mínima",
    equals: (pesos: string, pct: number) => `Equivale a ${pesos} en pesos. Pedís hasta el ${pct}% de tu garantía.`,
    youGet: "Recibís",
    oneToOne: "1 ARGt = 1 peso",
    yourCollateral: "Tu garantía",
    stays: "Queda en Morpho hasta que devolvés",
    cost: "Costo",
    variableRate: "Tasa variable de Morpho",
    seeBefore: "La ves antes de confirmar",
    cta: "Evaluar mi expansión",
    disclaimer: "Números ilustrativos. Si tu garantía pierde valor, puede que tengas que sumar más.",
  },
  example: {
    eyebrow: "Ejemplo ilustrativo",
    title: "Una empresa minera de Antofagasta suma una operación en San Juan",
    body: (name: string) =>
      `Sigue operando en Chile, abre una base en San Juan y necesita pesos para el galpón, los equipos y los primeros sueldos. Con ${name} deja CHLt de garantía y recibe ARGt para operar.`,
    alt: "Un equipo descarga herramientas frente a un galpón nuevo en San Juan, con la cordillera de fondo, al amanecer",
    needs: "Pesos que necesita",
    gets: "Recibe",
    collateral: (pct: number) => `Garantía (pide el ${pct}%)`,
    cost: "Costo",
    costValue: "Lo ve antes de firmar",
    repay: "Devolución",
    repayValue: "Préstamo y costo, como se acordó",
    disclaimer: "Números ilustrativos, no es una oferta.",
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    title: "Antes de comprometer nada",
    intro: "Cuánto recibís, cuánto cuesta y cómo se devuelve, antes de firmar.",
    items: [
      {
        q: "¿Para qué sirven los ARGt?",
        a: "Para operar en Argentina: alquiler, equipos, sueldos e impuestos. Cada ARGt vale un peso. Tu empresa devuelve lo pedido más los costos, según lo acordado.",
      },
      {
        q: "¿Quién presta la plata?",
        a: "No prestamos capital propio. El préstamo sale de un mercado de Morpho, financiado por quienes ponen liquidez en él.",
      },
      {
        q: "¿Qué pasa con la garantía?",
        a: "Queda comprometida mientras debés. Si pierde valor y deja de cubrir el préstamo, tenés que sumar más; si no, puede venderse para cubrir la deuda.",
      },
      {
        q: "¿Puedo devolverlo con lo que gane en Argentina?",
        a: "Podés planificarlo así, pero el calendario de pago tiene que poder cumplirse aunque tus ingresos se demoren.",
      },
      {
        q: "¿Ya puedo usarlo?",
        a: "Estamos preparando el piloto con empresas de Chile. Contanos tu caso y vemos si encaja.",
      },
    ],
  },
  closing: {
    title: "Ya sabés hacia dónde querés crecer",
    sub: "Hablemos de cómo llegar con pesos para operar.",
    sentTitle: "Recibimos tu consulta",
    sentBody: "El próximo paso es revisar tu caso y contactarte para conocer mejor tu proyecto.",
    name: "Nombre",
    company: "Empresa",
    email: "Correo de trabajo",
    country: "País de origen",
    countryDefault: "Chile",
    what: "¿Qué vas a poner en marcha en Argentina?",
    submit: "Quiero evaluar mi expansión",
    fine: "Enviar tus datos no te compromete a contratar ni confirma la aprobación de una operación.",
  },
  footer: {
    project: "Proyecto de HackaTwin 2026, equipo Mixto C",
    legal:
      "No prestamos capital propio: el préstamo sale de un mercado de Morpho. El financiamiento requiere garantía, tiene costos y puede implicar la pérdida de los activos comprometidos. Las monedas de Twin son un medio de pago, no una inversión.",
  },
};

export type Dict = typeof es;

const en: Dict = {
  docTitle: "Saltar · Get to Argentina",
  nav: {
    home: "Saltar, home",
    how: "How it works",
    calc: "Calculator",
    faq: "FAQ",
    ctaShort: "Apply",
    ctaLong: "Assess my expansion",
    app: "Open the app",
    langGroup: "Language",
    langNames: { es: "Español", en: "English", pt: "Português" },
  },
  hero: {
    tagMobile: "For companies expanding to Argentina",
    tagDesktop: "For Chilean companies expanding to Argentina",
    title1: "Expand your company to Argentina.",
    title2: "Operate in pesos from day one.",
    sub: "You post your stablecoins as collateral and receive digital pesos to open your operation, without selling what you hold.",
    leave: "You post as collateral",
    receive: "You receive to operate",
    cta: "Assess my expansion",
    note: "Pilot for Chilean companies. Subject to review, collateral and available funds.",
  },
  problem: {
    title: (name) => `Getting pesos in Argentina: today and with ${name}`,
    today: "Today",
    todayUpper: "TODAY",
    withUs: (name) => `With ${name}`,
    withUsUpper: (name) => `WITH ${name.toUpperCase()}`,
    no: "No",
    yes: "Yes",
    rows: [
      { k: "Credit", today: "Argentine banks don't know your company", withUs: "Your CHLt collateral sets how much ARGt you receive" },
      { k: "Pesos", today: "To get pesos you have to sell your stablecoins", withUs: "You receive ARGt, 1 to 1 with the peso, and your CHLt stay as collateral" },
      { k: "Terms", today: "You only learn them fully when you sign", withUs: "You see amount, cost, collateral and repayment up front" },
    ],
  },
  how: {
    eyebrow: "How it works",
    title: "From your plan to operating in Argentina",
    intro: "We don't lend our own capital. The loan comes from a Morpho market, an open lending protocol.",
    steps: [
      { title: "Tell us about your expansion", desc: () => "Where you're opening, what you're launching and how many pesos you need for the first months." },
      { title: "We review your company", desc: () => "An agent reviews your documents and checks your company with the BCRA." },
      { title: "Post CHLt as collateral", desc: (p) => `Borrow up to ${p}% of its value. You see the cost before you sign.` },
      { title: "Receive ARGt to operate", desc: () => "Pay rent, equipment and salaries in pesos. Repay what you borrowed plus the cost and get your collateral back." },
    ],
  },
  calc: {
    eyebrow: "Calculator",
    title: "How much collateral do you need?",
    intro: "Enter how many pesos you need to get set up in Argentina.",
    pesosLabel: "Pesos you need in Argentina",
    from: "Your company comes from",
    soonMobile: "(Peru and Mexico, soon)",
    soon: "· soon",
    countries: { CHLt: "Chile", PERt: "Peru", MEXt: "Mexico" },
    minCollateral: "Minimum collateral",
    equals: (pesos, pct) => `Equivalent to ${pesos} in pesos. You can borrow up to ${pct}% of your collateral.`,
    youGet: "You receive",
    oneToOne: "1 ARGt = 1 peso",
    yourCollateral: "Your collateral",
    stays: "Stays in Morpho until you repay",
    cost: "Cost",
    variableRate: "Morpho variable rate",
    seeBefore: "You see it before you confirm",
    cta: "Assess my expansion",
    disclaimer: "Illustrative numbers. If your collateral loses value, you may have to add more.",
  },
  example: {
    eyebrow: "Illustrative example",
    title: "A mining company from Antofagasta adds an operation in San Juan",
    body: (name) =>
      `It keeps operating in Chile, opens a base in San Juan and needs pesos for the warehouse, equipment and the first salaries. With ${name} it posts CHLt as collateral and receives ARGt to operate.`,
    alt: "A crew unloads tools in front of a new warehouse in San Juan, with the Andes in the background, at dawn",
    needs: "Pesos it needs",
    gets: "Receives",
    collateral: (pct) => `Collateral (borrows ${pct}%)`,
    cost: "Cost",
    costValue: "Seen before signing",
    repay: "Repayment",
    repayValue: "Loan plus cost, as agreed",
    disclaimer: "Illustrative numbers, not an offer.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Before you commit to anything",
    intro: "How much you receive, what it costs and how it is repaid, before you sign.",
    items: [
      {
        q: "What are ARGt for?",
        a: "To operate in Argentina: rent, equipment, salaries and taxes. Each ARGt is worth one peso. Your company repays what it borrowed plus costs, as agreed.",
      },
      {
        q: "Who lends the money?",
        a: "We don't lend our own capital. The loan comes from a Morpho market, funded by those who supply liquidity to it.",
      },
      {
        q: "What happens to the collateral?",
        a: "It stays locked while you owe. If it loses value and no longer covers the loan, you have to add more; otherwise it may be sold to cover the debt.",
      },
      {
        q: "Can I repay it with what I earn in Argentina?",
        a: "You can plan it that way, but the repayment schedule must be doable even if your income comes in late.",
      },
      {
        q: "Can I use it already?",
        a: "We are preparing the pilot with Chilean companies. Tell us your case and we'll see if it fits.",
      },
    ],
  },
  closing: {
    title: "You already know where you want to grow",
    sub: "Let's talk about how to arrive with pesos to operate.",
    sentTitle: "We got your request",
    sentBody: "The next step is to review your case and contact you to learn more about your project.",
    name: "Name",
    company: "Company",
    email: "Work email",
    country: "Country of origin",
    countryDefault: "Chile",
    what: "What will you launch in Argentina?",
    submit: "I want to assess my expansion",
    fine: "Sending your details doesn't commit you to anything and doesn't confirm approval of any transaction.",
  },
  footer: {
    project: "HackaTwin 2026 project, team Mixto C",
    legal:
      "We don't lend our own capital: the loan comes from a Morpho market. Financing requires collateral, has costs and may mean losing the assets pledged. Twin coins are a means of payment, not an investment.",
  },
};

const pt: Dict = {
  docTitle: "Saltar · Chegar à Argentina",
  nav: {
    home: "Saltar, início",
    how: "Como funciona",
    calc: "Calculadora",
    faq: "Perguntas frequentes",
    ctaShort: "Avaliar",
    ctaLong: "Avaliar minha expansão",
    app: "Entrar no app",
    langGroup: "Idioma",
    langNames: { es: "Español", en: "English", pt: "Português" },
  },
  hero: {
    tagMobile: "Para empresas que se expandem para a Argentina",
    tagDesktop: "Para empresas do Chile que se expandem para a Argentina",
    title1: "Expanda para a Argentina.",
    title2: "Opere em pesos desde o primeiro dia.",
    sub: "Você deixa suas stablecoins como garantia e recebe pesos digitais para abrir sua operação, sem vender o que você tem.",
    leave: "Você deixa como garantia",
    receive: "Você recebe para operar",
    cta: "Avaliar minha expansão",
    note: "Piloto para empresas do Chile. Sujeito a avaliação, garantia e fundos disponíveis.",
  },
  problem: {
    title: (name) => `Conseguir pesos na Argentina: hoje e com a ${name}`,
    today: "Hoje",
    todayUpper: "HOJE",
    withUs: (name) => `Com a ${name}`,
    withUsUpper: (name) => `COM A ${name.toUpperCase()}`,
    no: "Não",
    yes: "Sim",
    rows: [
      { k: "Crédito", today: "O banco argentino não conhece a sua empresa", withUs: "Sua garantia em CHLt define quanto ARGt você recebe" },
      { k: "Pesos", today: "Para ter pesos, você precisa vender suas stablecoins", withUs: "Você recebe ARGt, 1 para 1 com o peso, e seus CHLt ficam como garantia" },
      { k: "Condições", today: "Você só as conhece por completo na hora de assinar", withUs: "Você vê valor, custo, garantia e devolução antes" },
    ],
  },
  how: {
    eyebrow: "Como funciona",
    title: "Do seu plano a operar na Argentina",
    intro: "Não emprestamos capital próprio. O empréstimo sai de um mercado da Morpho, um protocolo aberto de empréstimos.",
    steps: [
      { title: "Conte sobre a sua expansão", desc: () => "Onde você vai abrir, o que vai colocar em marcha e quantos pesos precisa nos primeiros meses." },
      { title: "Analisamos a sua empresa", desc: () => "Um agente revisa a documentação e consulta a sua empresa no BCRA." },
      { title: "Você deixa CHLt como garantia", desc: (p) => `Você pede até ${p}% do valor dela. Vê o custo antes de assinar.` },
      { title: "Você recebe ARGt para operar", desc: () => "Pague em pesos aluguel, equipamentos e salários. Devolva o valor pedido mais o custo e recupere a sua garantia." },
    ],
  },
  calc: {
    eyebrow: "Calculadora",
    title: "De quanta garantia você precisa?",
    intro: "Informe quantos pesos você precisa para abrir sua operação na Argentina.",
    pesosLabel: "Pesos que você precisa na Argentina",
    from: "Sua empresa vem de",
    soonMobile: "(Peru e México, em breve)",
    soon: "· em breve",
    countries: { CHLt: "Chile", PERt: "Peru", MEXt: "México" },
    minCollateral: "Garantia mínima",
    equals: (pesos, pct) => `Equivale a ${pesos} em pesos. Você pode pedir até ${pct}% da sua garantia.`,
    youGet: "Você recebe",
    oneToOne: "1 ARGt = 1 peso",
    yourCollateral: "Sua garantia",
    stays: "Fica na Morpho até você devolver",
    cost: "Custo",
    variableRate: "Taxa variável da Morpho",
    seeBefore: "Você vê antes de confirmar",
    cta: "Avaliar minha expansão",
    disclaimer: "Números ilustrativos. Se a sua garantia perder valor, talvez você precise reforçá-la.",
  },
  example: {
    eyebrow: "Exemplo ilustrativo",
    title: "Uma mineradora de Antofagasta abre uma operação em San Juan",
    body: (name) =>
      `Ela segue operando no Chile, abre uma base em San Juan e precisa de pesos para o galpão, os equipamentos e os primeiros salários. Com a ${name}, deixa CHLt como garantia e recebe ARGt para operar.`,
    alt: "Uma equipe descarrega ferramentas em frente a um galpão novo em San Juan, com a cordilheira ao fundo, ao amanhecer",
    needs: "Pesos de que precisa",
    gets: "Recebe",
    collateral: (pct) => `Garantia (pede ${pct}%)`,
    cost: "Custo",
    costValue: "Vê antes de assinar",
    repay: "Devolução",
    repayValue: "Empréstimo e custo, como combinado",
    disclaimer: "Números ilustrativos, não é uma oferta.",
  },
  faq: {
    eyebrow: "Perguntas frequentes",
    title: "Antes de se comprometer com qualquer coisa",
    intro: "Quanto você recebe, quanto custa e como se devolve, antes de assinar.",
    items: [
      {
        q: "Para que servem os ARGt?",
        a: "Para operar na Argentina: aluguel, equipamentos, salários e impostos. Cada ARGt vale um peso. Sua empresa devolve o valor pedido mais os custos, conforme combinado.",
      },
      {
        q: "Quem empresta o dinheiro?",
        a: "Não emprestamos capital próprio. O empréstimo sai de um mercado da Morpho, financiado por quem coloca liquidez nele.",
      },
      {
        q: "O que acontece com a garantia?",
        a: "Ela fica comprometida enquanto você deve. Se perder valor e deixar de cobrir o empréstimo, você precisa reforçá-la; senão, ela pode ser vendida para cobrir a dívida.",
      },
      {
        q: "Posso devolver com o que ganhar na Argentina?",
        a: "Pode planejar assim, mas o cronograma de pagamento precisa ser cumprível mesmo que a sua receita atrase.",
      },
      {
        q: "Já posso usar?",
        a: "Estamos preparando o piloto com empresas do Chile. Conte o seu caso e vemos se encaixa.",
      },
    ],
  },
  closing: {
    title: "Você já sabe para onde quer crescer",
    sub: "Vamos conversar sobre como chegar com pesos para operar.",
    sentTitle: "Recebemos a sua consulta",
    sentBody: "O próximo passo é analisar o seu caso e entrar em contato para conhecer melhor o seu projeto.",
    name: "Nome",
    company: "Empresa",
    email: "E-mail de trabalho",
    country: "País de origem",
    countryDefault: "Chile",
    what: "O que você vai colocar em marcha na Argentina?",
    submit: "Quero avaliar minha expansão",
    fine: "Enviar seus dados não obriga você a contratar nem confirma a aprovação de uma operação.",
  },
  footer: {
    project: "Projeto da HackaTwin 2026, equipe Mixto C",
    legal:
      "Não emprestamos capital próprio: o empréstimo sai de um mercado da Morpho. O financiamento exige garantia, tem custos e pode implicar a perda dos ativos comprometidos. As moedas da Twin são um meio de pagamento, não um investimento.",
  },
};

const DICTS: Record<Lang, Dict> = { es, en, pt };

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "es" || saved === "en" || saved === "pt") return saved;
  } catch {
    /* storage blocked */
  }
  const nav = (typeof navigator !== "undefined" ? navigator.language : "").slice(0, 2).toLowerCase();
  if (nav === "es" || nav === "en" || nav === "pt") return nav;
  return "es";
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict };
const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = DICTS[lang].docTitle;
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      t: DICTS[lang],
      setLang: (l) => {
        setLangState(l);
        try {
          localStorage.setItem(STORAGE_KEY, l);
        } catch {
          /* storage blocked */
        }
      },
    }),
    [lang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useT(): Ctx {
  const c = useContext(LangContext);
  if (!c) throw new Error("useT must be used inside LangProvider");
  return c;
}
