// Argentina: la receta con las fuentes de acá. Envuelve la consulta real al BCRA.
import { consultarBcra } from "../bcra";
import type { Pais, ResultadoPaso, Verificador } from "./receta";

/** Valida un CUIT (dígito verificador). Devuelve «30546689979» o null. */
export function validarCuit(cuit: string): string | null {
  const d = String(cuit ?? "").replace(/\D/g, "");
  if (d.length !== 11) return null;
  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const suma = pesos.reduce((s, p, i) => s + p * Number(d[i]), 0);
  const r = 11 - (suma % 11);
  const dv = r === 11 ? 0 : r === 10 ? 9 : r;
  return dv === Number(d[10]) ? d : null;
}

export const ARGENTINA: Pais = {
  codigo: "AR",
  nombre: "Argentina",
  idFiscal: { nombre: "CUIT", validar: validarCuit },
  pasos: [
    { id: "identidad", titulo: "Identidad legal", obligatorio: true, fuentes: [{ nombre: "ARCA · Constancia de inscripción", url: "https://www.arca.gob.ar", acceso: "consulta_manual", costo: "gratis" }, { nombre: "IGJ (sociedades extranjeras, art. 118)", acceso: "consulta_manual" }] },
    { id: "deuda_financiera", titulo: "Deuda con bancos", obligatorio: true, fuentes: [{ nombre: "BCRA · Central de Deudores", url: "https://www.bcra.gob.ar/apis-banco-central/", acceso: "api_publica", costo: "gratis" }] },
    { id: "morosidad_comercial", titulo: "Cheques rechazados", obligatorio: false, fuentes: [{ nombre: "BCRA · Cheques rechazados", url: "https://www.bcra.gob.ar/apis-banco-central/", acceso: "api_publica", costo: "gratis" }] },
    { id: "insolvencia", titulo: "Quiebras y concursos", obligatorio: true, fuentes: [{ nombre: "Boletín Oficial y registros judiciales provinciales", acceso: "consulta_manual" }] },
    { id: "sanciones", titulo: "Sanciones y PEP", obligatorio: true, fuentes: [{ nombre: "Listas ONU, OFAC y UIF", acceso: "consulta_manual" }] },
  ],
};

export const verificarArgentina: Verificador = async (cuit, opciones = {}) => {
  const valido = validarCuit(cuit);
  const fila = (id: ResultadoPaso["id"], estado: ResultadoPaso["estado"], detalle: string, fuente: string): ResultadoPaso => {
    const p = ARGENTINA.pasos.find((x) => x.id === id)!;
    return { id, titulo: p.titulo, estado, detalle, fuente, obligatorio: p.obligatorio };
  };
  if (!valido) return [fila("identidad", "alerta_grave", `CUIT inválido: «${cuit}».`, "Dígito verificador del CUIT")];
  const b = await consultarBcra(valido);
  const pendiente = (id: ResultadoPaso["id"]) => {
    const f = ARGENTINA.pasos.find((x) => x.id === id)!.fuentes[0];
    return fila(id, opciones.simular ? "simulado" : "pendiente", opciones.simular ? `Ejemplo para la demo; en producción: ${f.nombre}.` : `A verificar en ${f.nombre}.`, f.nombre);
  };
  const deuda = !b.ok
    ? fila("deuda_financiera", "pendiente", "El BCRA no respondió.", "BCRA · Central de Deudores")
    : b.situacionMax === null
      ? fila("deuda_financiera", "verificado", "Sin deudas registradas.", "BCRA · Central de Deudores")
      : b.situacionMax >= 3
        ? fila("deuda_financiera", "alerta_grave", `Situación ${b.situacionMax}.`, "BCRA · Central de Deudores")
        : b.situacionMax === 2
          ? fila("deuda_financiera", "alerta", "Situación 2 (con atrasos).", "BCRA · Central de Deudores")
          : fila("deuda_financiera", "verificado", "Situación 1 (normal).", "BCRA · Central de Deudores");
  const cheques = !b.ok
    ? fila("morosidad_comercial", "pendiente", "El BCRA no respondió.", "BCRA · Cheques rechazados")
    : b.chequesRechazados > 0
      ? fila("morosidad_comercial", "alerta", `${b.chequesRechazados} cheque(s) rechazado(s).`, "BCRA · Cheques rechazados")
      : fila("morosidad_comercial", "verificado", "Sin cheques rechazados.", "BCRA · Cheques rechazados");
  return [
    b.denominacion ? fila("identidad", "verificado", b.denominacion, "BCRA · Central de Deudores") : pendiente("identidad"),
    deuda,
    cheques,
    pendiente("insolvencia"),
    pendiente("sanciones"),
  ];
};
