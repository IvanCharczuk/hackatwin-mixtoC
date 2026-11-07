"use client";

// Adaptado de tx-button.tsx de Faro: mismo ciclo de vida, con la pill de Amanecer.
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

/** reposo → firma → en curso → éxito/error. `error` deja el click vivo como reintento. */
export type TxButtonStage = "idle" | "confirming" | "pending" | "success" | "error";

export function TxButton({
  label,
  successLabel,
  stage,
  onClick,
  disabled = false,
  className,
}: {
  label: string;
  successLabel?: string;
  stage: TxButtonStage;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const { t } = useT();
  const busy = stage === "confirming" || stage === "pending";
  return (
    <button
      type="button"
      aria-live="polite"
      onClick={onClick}
      disabled={disabled || busy || stage === "success"}
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold whitespace-nowrap transition-colors",
        "bg-navy text-white hover:bg-navy-deep disabled:cursor-not-allowed disabled:bg-cream-2 disabled:text-ink-2",
        stage === "success" && "bg-ok/10 text-ok disabled:bg-ok/10 disabled:text-ok",
        stage === "error" && "border-[1.5px] border-bad bg-transparent text-bad hover:bg-bad/5",
        className,
      )}
    >
      {busy && <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
      {stage === "success" && <Check className="size-4" aria-hidden="true" />}
      {stage === "confirming"
        ? t.confirmaWallet
        : stage === "pending"
          ? t.esperandoRed
          : stage === "success"
            ? (successLabel ?? t.listo.replace(/\.$/, ""))
            : stage === "error"
              ? t.fallo
              : label}
    </button>
  );
}
