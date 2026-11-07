"use client";

// El asistente en la app: con sesión le pasa la wallet para que pueda leer la cuenta.
import { useAccount } from "wagmi";
import { Asistente } from "@/components/asistente";

export function AsistenteWeb() {
  const { address } = useAccount();
  return <Asistente endpoint="/api/chat" wallet={address ?? null} idioma="es" />;
}
