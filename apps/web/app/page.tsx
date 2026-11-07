"use client";

// Root: solo el hero y un botón para conectar. Con sesión, pasa directo a /app.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useAuth } from "@/lib/auth";
import { CIELO, Paisaje } from "@/components/dashboard/hero";

export default function Inicio() {
  const { ready, authenticated, login } = useAuth();
  const { address } = useAccount();
  const router = useRouter();
  const dentro = ready && authenticated && Boolean(address);

  useEffect(() => {
    if (dentro) router.replace("/app");
  }, [dentro, router]);

  return (
    <main className="flex min-h-screen flex-col">
      <Paisaje llenar>
        <header className="relative z-10 mx-auto flex w-full max-w-[1248px] items-center gap-2 px-5 py-5 text-[16px] font-bold text-white sm:px-6 sm:text-[17px]">
          <img src="/sol-de-mayo.png" alt="" className="size-7 sm:size-8" />
          Saltar
        </header>
        <div className={`mx-auto flex w-full max-w-[1248px] flex-col items-start gap-6 px-6 pt-8 lg:pt-10 ${CIELO}`}>
          <p className="text-[12px] font-semibold tracking-[2px] text-sun uppercase lg:text-[13px]">Pagá hoy en Argentina, devolvé después</p>
          <h1 className="max-w-[720px] text-[38px] leading-[1.06] font-semibold tracking-[-1px] text-white lg:text-[64px] lg:tracking-[-1.8px]">
            Entrá para ver tu límite disponible
          </h1>
          <p className="max-w-[520px] text-[17px] leading-[1.45] font-medium text-lavender-soft lg:text-[19px]">
            Le pagamos a tu proveedor en pesos y lo devolvés cuando cobrás tus ventas acá.
          </p>
          <button type="button" onClick={login} disabled={!ready || dentro} className="brillo-sol rounded-full bg-sun px-[34px] py-[18px] text-[17px] font-bold text-navy-deep">
            {ready ? "Conectar" : "Cargando…"}
          </button>
        </div>
      </Paisaje>
    </main>
  );
}
