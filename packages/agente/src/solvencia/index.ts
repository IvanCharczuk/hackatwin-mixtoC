// Registro de países. Para sumar uno (Perú, Brasil, Canadá, Australia…):
// 1. Crear solvencia/<pais>.ts con su `Pais` (id fiscal y fuentes por paso de la receta)
//    y su `Verificador` (siguiendo chile.ts o argentina.ts).
// 2. Agregarlo acá en PAISES.
// La receta (receta.ts) y el veredicto no cambian: no saben de qué país viene la empresa.
import { combinar, type Pais, type ResultadoPaso, type Verificador, type Veredicto } from "./receta";
import { CHILE, verificarChile } from "./chile";
import { ARGENTINA, verificarArgentina } from "./argentina";

export type { Pais, ResultadoPaso, Veredicto } from "./receta";
export { combinar } from "./receta";
export { validarRut } from "./chile";
export { validarCuit } from "./argentina";

export const PAISES: Record<string, { pais: Pais; verificar: Verificador }> = {
  CL: { pais: CHILE, verificar: verificarChile },
  AR: { pais: ARGENTINA, verificar: verificarArgentina },
};

export type Solvencia = { pais: string; idFiscal: string; pasos: ResultadoPaso[]; veredicto: Veredicto };

export async function verificarSolvencia(codigo: string, idFiscal: string, opciones: { simular?: boolean } = {}): Promise<Solvencia> {
  const entrada = PAISES[String(codigo ?? "").toUpperCase()];
  if (!entrada) {
    throw new Error(`País de origen inválido: «${codigo}». Hoy están: ${Object.keys(PAISES).join(", ")}.`);
  }
  const pasos = await entrada.verificar(idFiscal, opciones);
  return { pais: entrada.pais.nombre, idFiscal, pasos, veredicto: combinar(pasos) };
}
