export type Ticker = "ARGt" | "CHLt" | "MEXt" | "PERt";

export const tokenSrc = (t: Ticker) => `/tokens/${t}.svg`;

/** Chilean pesos per 1 Argentine peso. Illustrative only (Nov 2026 ballpark). */
export const CLP_PER_ARS = 0.657;

/** The loan can be up to this share of the collateral (check C5 of the circuit). */
export const MAX_LTV = 0.6;

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

/** What a company must leave as collateral, in CHLt, to pay `ars` pesos in ARGt (1 ARGt = 1 peso). */
export function quote(ars: number) {
  const collateralArs = ars / MAX_LTV;
  return { pay: ars, collateralArs, collateralClp: collateralArs * CLP_PER_ARS };
}
