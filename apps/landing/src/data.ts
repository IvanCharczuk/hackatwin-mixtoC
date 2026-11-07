export type Ticker = "ARGt" | "CHLt" | "MEXt" | "PERt";

export const tokenSrc = (t: Ticker) => `/tokens/${t}.svg`;

/** Chilean pesos per 1 Argentine peso. Illustrative only (Nov 2026 ballpark). */
export const CLP_PER_ARS = 0.657;

/** The loan can be up to this share of the collateral (check C5 of the circuit). */
export const MAX_LTV = 0.6;

export type Lang = "es" | "en" | "pt";
const LOCALE: Record<Lang, string> = { es: "es-AR", en: "en-US", pt: "pt-BR" };

/** Format with the locale of the current language. */
export const num = (n: number, lang: Lang, digits = 0) =>
  n.toLocaleString(LOCALE[lang], { maximumFractionDigits: digits, minimumFractionDigits: 0 });

/** $30.000.000 (es) · $30,000,000 (en) */
export const money = (n: number, lang: Lang) => `$${num(Math.round(n), lang)}`;

/** 19,7M · 9M · 38.400 · 76,8 (es) */
export const short = (n: number, lang: Lang) => {
  if (n >= 1e6) return `${num(n / 1e6, lang, 1)}M`;
  if (n >= 1e3) return num(n, lang);
  return num(n, lang, 1);
};

/** What a company must leave as collateral, in CHLt, to pay `ars` pesos in ARGt (1 ARGt = 1 peso). */
export function quote(ars: number) {
  const collateralArs = ars / MAX_LTV;
  return { pay: ars, collateralArs, collateralClp: collateralArs * CLP_PER_ARS };
}
