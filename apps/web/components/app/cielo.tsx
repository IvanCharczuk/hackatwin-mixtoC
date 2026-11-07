// Fondo de /app: el hero de la landing en versión de día. Cielo claro, nubes, el Sol de Mayo
// saliendo detrás de los Andes, todo centrado. El contenido va en una sola capa encima.
import { cn } from "@/lib/utils";

function Nube({ className, ancho }: { className: string; ancho: number }) {
  return (
    <svg viewBox="0 0 220 70" width={ancho} className={cn("nube pointer-events-none absolute", className)} aria-hidden="true">
      <g fill="#fff">
        <ellipse cx="60" cy="48" rx="50" ry="20" />
        <ellipse cx="100" cy="34" rx="40" ry="28" />
        <ellipse cx="146" cy="42" rx="36" ry="22" />
        <ellipse cx="180" cy="52" rx="30" ry="14" />
        <rect x="18" y="48" width="186" height="20" rx="10" />
      </g>
    </svg>
  );
}

export function Cielo({ children }: { children: React.ReactNode }) {
  return (
    <div className="cielo-claro relative flex min-h-dvh flex-col overflow-hidden">
      <div className="pointer-events-none absolute bottom-[20px] left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,#FFD98A99,#FFD98A00)]" aria-hidden="true" />
      <img src="/sol-de-mayo.png" alt="" aria-hidden="true" className="pointer-events-none absolute bottom-[-10px] left-1/2 w-[200px] -translate-x-1/2 select-none lg:w-[250px]" />
      <Nube className="top-[110px] left-[3%]" ancho={240} />
      <Nube className="top-[64px] right-[6%] opacity-80 [animation-delay:-6s]" ancho={180} />
      <Nube className="bottom-[300px] left-[-40px] opacity-70 [animation-delay:-11s]" ancho={280} />
      <Nube className="right-[-30px] bottom-[360px] opacity-75 [animation-delay:-3s]" ancho={200} />
      <img src="/andes.png" alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-[60px] left-1/2 w-[900px] max-w-none -translate-x-1/2 opacity-90 saturate-[0.85] select-none lg:-bottom-[150px] lg:w-[max(1440px,100%)]" />
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  );
}
