// "Primera vez" por wallet, en localStorage. Si el navegador lo bloquea, queda en memoria.
export type Onboarding = { cuit: string };

const clave = (wallet: string) => `saltar:onboarding:${wallet.toLowerCase()}`;
const memoria = new Map<string, Onboarding>();

export function leerOnboarding(wallet: string): Onboarding | null {
  try {
    const v = localStorage.getItem(clave(wallet));
    if (v) return JSON.parse(v) as Onboarding;
  } catch {}
  return memoria.get(clave(wallet)) ?? null;
}

export function guardarOnboarding(wallet: string, datos: Onboarding) {
  memoria.set(clave(wallet), datos);
  try {
    localStorage.setItem(clave(wallet), JSON.stringify(datos));
  } catch {}
}

export function borrarOnboarding(wallet: string) {
  memoria.delete(clave(wallet));
  try {
    localStorage.removeItem(clave(wallet));
  } catch {}
}
