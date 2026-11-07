export type Ticker = "ARGt" | "CHLt" | "MEXt" | "BRAt" | "COLt" | "PERt" | "BOLt";

export const TICKERS: Ticker[] = ["ARGt", "CHLt", "MEXt", "BRAt", "COLt", "PERt", "BOLt"];

export const tokenSrc = (t: Ticker) => `/tokens/${t}.svg`;

export type Country = {
  name: string;
  ticker: Ticker;
  /** Units of the local currency per 1 Argentine peso. Illustrative only. */
  perArs: number;
  currencyName: string;
};

// Illustrative rates (Nov 2026 ballpark). 30M ARS ≈ 19,7M CLP matches the design.
export const COUNTRIES: Country[] = [
  { name: "Chile", ticker: "CHLt", perArs: 0.657, currencyName: "pesos chilenos" },
  { name: "México", ticker: "MEXt", perArs: 0.0128, currencyName: "pesos mexicanos" },
  { name: "Brasil", ticker: "BRAt", perArs: 0.0037, currencyName: "reales" },
  { name: "Colombia", ticker: "COLt", perArs: 2.75, currencyName: "pesos colombianos" },
  { name: "Perú", ticker: "PERt", perArs: 0.0026, currencyName: "soles" },
  { name: "Bolivia", ticker: "BOLt", perArs: 0.0048, currencyName: "bolivianos" },
];

/** The loan limit is three months of sales. */
export const LIMIT_MONTHS = 3;
/** Share of the loan that stays frozen as collateral. */
export const FROZEN_SHARE = 0.3;
/** Share of each sale abroad that repays the loan. */
export const REPAY_SHARE = 0.1;

const ar = (n: number, digits = 0) =>
  n.toLocaleString("es-AR", { maximumFractionDigits: digits, minimumFractionDigits: 0 });

/** $30.000.000 */
export const money = (n: number) => `$${ar(Math.round(n))}`;

/** 19,7M · 9M · 38.400 · 76,8 */
export const short = (n: number) => {
  if (n >= 1e6) return `${ar(n / 1e6, 1)}M`;
  if (n >= 1e3) return ar(n);
  return ar(n, 1);
};

export function quote(monthlySales: number, country: Country) {
  const limit = monthlySales * LIMIT_MONTHS;
  return {
    limit,
    frozen: limit * FROZEN_SHARE,
    received: limit * country.perArs,
  };
}
