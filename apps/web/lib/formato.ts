// El idioma lo fija LangProvider (lib/i18n.tsx) en cada render; los números siguen su locale.
let locale = "es-AR";
export const setLocale = (l: string) => {
  locale = l;
};
export const getLocale = () => locale;
export const fmt = (n: number, d = 0, loc = locale) =>
  n.toLocaleString(loc, { maximumFractionDigits: d, minimumFractionDigits: d });
// En es se mantiene "60 %" con espacio, como la copia original.
export const pct = (n: number, d = 0) => `${fmt(n * 100, d)}${locale === "es-AR" ? " %" : "%"}`;
export const corta = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
