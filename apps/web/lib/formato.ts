export const fmt = (n: number, d = 0) =>
  n.toLocaleString("es-AR", { maximumFractionDigits: d, minimumFractionDigits: d });
export const pct = (n: number, d = 0) => `${fmt(n * 100, d)} %`;
export const corta = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
