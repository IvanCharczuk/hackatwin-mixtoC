"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/** Copia la dirección completa al portapapeles. `oscuro` para barras sobre fondo navy. */
export function CopiarDireccion({ address, oscuro = false }: { address: string; oscuro?: boolean }) {
  const [copiado, setCopiado] = useState(false);
  async function copiar() {
    try {
      await navigator.clipboard.writeText(address);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1600);
    } catch {
      window.prompt("Copiá la dirección:", address);
    }
  }
  const Icono = copiado ? Check : Copy;
  return (
    <button
      type="button"
      onClick={copiar}
      aria-label={copiado ? "Dirección copiada" : `Copiar la dirección ${address}`}
      title={copiado ? "Copiada" : "Copiar dirección completa"}
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        oscuro ? "border-white/20 text-lavender-soft hover:text-white focus-visible:outline-white" : "border-line bg-white text-ink-2 hover:text-navy focus-visible:outline-sun",
        copiado && (oscuro ? "text-live" : "text-ok"),
      )}
    >
      <Icono className="size-4" aria-hidden="true" />
      <span aria-live="polite" className="sr-only">{copiado ? "Copiada" : ""}</span>
    </button>
  );
}
