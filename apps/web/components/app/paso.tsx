// Piezas del formulario de /app: un paso numerado (el número fino de la landing) y un campo sin caja.
import { cn } from "@/lib/utils";

export function Paso({
  n,
  titulo,
  id,
  extra,
  apagado = false,
  children,
}: {
  n: number;
  titulo: string;
  id?: string;
  extra?: React.ReactNode;
  apagado?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={cn("grid grid-cols-[28px_minmax(0,1fr)] gap-x-4 transition-opacity duration-300", apagado && "opacity-45")}>
      <span className="pt-0.5 text-[22px] leading-none font-light text-lavender" aria-hidden="true">{n}</span>
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id={id} className="text-[16px] font-semibold text-navy">{titulo}</h2>
          {extra}
        </div>
        {children}
      </div>
    </section>
  );
}

export function Campo({ id, label, ayuda, malo = false, children }: { id: string; label: string; ayuda?: string; malo?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[12px] font-medium text-ink-2">{label}</label>
      <div className={cn("flex items-center gap-2 border-b py-2 transition-colors focus-within:border-navy", malo ? "border-bad" : "border-line")}>{children}</div>
      {ayuda && <p id={`${id}-ayuda`} className={cn("text-[12px]", malo ? "text-bad" : "text-ink-2")}>{ayuda}</p>}
    </div>
  );
}
