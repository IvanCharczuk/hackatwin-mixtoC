// Fondo de /app: el hero de la landing en versión de día. Cielo claro y la cordillera 3D con el sol
// (Paisaje3D) saliendo detrás, todo centrado. El contenido va en una sola capa encima.
import { Paisaje3D } from "@/components/paisaje-3d";

export function Cielo({ children }: { children: React.ReactNode }) {
  return (
    <div className="cielo-claro relative flex min-h-dvh flex-col overflow-hidden">
      <div className="pointer-events-none absolute bottom-[20px] left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,#FFD98A99,#FFD98A00)]" aria-hidden="true" />
      <Paisaje3D className="inset-0 size-full" alto={0.85} carga />
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  );
}
