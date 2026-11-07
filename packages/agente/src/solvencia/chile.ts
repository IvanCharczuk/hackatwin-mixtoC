// Chile, caso base (el país con más inversión minera hacia Argentina).
// Cada paso de la receta con su fuente real en Chile y cómo se accede.
// Hoy, en la demo, sólo el RUT se valida de verdad; el resto queda «simulado»
// o «pendiente» hasta conectar cada fuente.
import type { Pais, ResultadoPaso, Verificador } from "./receta";

/** Valida un RUT chileno (dígito verificador, módulo 11). Devuelve «12345678-5» o null. */
export function validarRut(rut: string): string | null {
  const limpio = String(rut ?? "").replace(/[.\s-]/g, "").toUpperCase();
  const m = limpio.match(/^(\d{7,8})([\dK])$/);
  if (!m) return null;
  const [, cuerpo, dv] = m;
  let suma = 0;
  let factor = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const r = 11 - (suma % 11);
  const esperado = r === 11 ? "0" : r === 10 ? "K" : String(r);
  return esperado === dv ? `${cuerpo}-${dv}` : null;
}

export const CHILE: Pais = {
  codigo: "CL",
  nombre: "Chile",
  idFiscal: { nombre: "RUT", validar: validarRut },
  pasos: [
    {
      id: "identidad",
      titulo: "Identidad legal",
      obligatorio: true,
      fuentes: [
        { nombre: "SII · Situación tributaria de terceros", url: "https://www.sii.cl/como_se_hace_para/situacion_trib_terceros.html", acceso: "consulta_manual", costo: "gratis", nota: "Pública por RUT; tiene captcha, así que la hace una persona." },
        { nombre: "Registro de Empresas y Sociedades (Ministerio de Economía)", url: "https://www.registrodeempresasysociedades.cl", acceso: "consulta_manual", costo: "gratis", nota: "Para sociedades creadas en el régimen simplificado." },
      ],
    },
    {
      id: "situacion_tributaria",
      titulo: "Situación tributaria",
      obligatorio: true,
      fuentes: [
        { nombre: "SII · Situación tributaria de terceros", url: "https://www.sii.cl/como_se_hace_para/situacion_trib_terceros.html", acceso: "consulta_manual", costo: "gratis", nota: "Inicio de actividades vigente y actividad económica; no muestra deudas." },
      ],
    },
    {
      id: "deuda_financiera",
      titulo: "Deuda con bancos",
      obligatorio: true,
      fuentes: [
        { nombre: "CMF · Informe de deudas", url: "https://www.cmfchile.cl", acceso: "con_consentimiento", costo: "gratis para el titular", nota: "Sólo lo pide la propia empresa: lo entrega en el onboarding." },
      ],
    },
    {
      id: "morosidad_comercial",
      titulo: "Morosidad comercial",
      obligatorio: false,
      fuentes: [
        { nombre: "Equifax (DICOM) / Boletín Comercial de la Cámara de Comercio de Santiago", url: "https://www.equifax.cl", acceso: "con_consentimiento", costo: "pago", nota: "Informe comercial de empresa, por proveedor." },
      ],
    },
    {
      id: "insolvencia",
      titulo: "Quiebras y concursos",
      obligatorio: true,
      fuentes: [
        { nombre: "Boletín Concursal (Superintendencia de Insolvencia y Reemprendimiento)", url: "https://www.boletinconcursal.cl", acceso: "consulta_manual", costo: "gratis" },
      ],
    },
    {
      id: "sanciones",
      titulo: "Sanciones y PEP",
      obligatorio: true,
      fuentes: [
        { nombre: "Listas de sanciones ONU y OFAC", url: "https://sanctionssearch.ofac.treas.gov", acceso: "consulta_manual", costo: "gratis", nota: "Se automatiza con las listas descargables." },
      ],
    },
    {
      id: "capacidad",
      titulo: "Capacidad financiera",
      obligatorio: false,
      fuentes: [
        { nombre: "Estados financieros de la empresa", acceso: "con_consentimiento", nota: "Si cotiza en bolsa, la CMF los publica." },
      ],
    },
  ],
};

/** Corre la receta para Chile. Sin fuentes conectadas, marca cada paso como simulado (demo) o pendiente. */
export const verificarChile: Verificador = async (rut, opciones = {}) => {
  const valido = validarRut(rut);
  const resultados: ResultadoPaso[] = [];
  for (const p of CHILE.pasos) {
    const fuente = p.fuentes[0];
    if (p.id === "identidad" && !valido) {
      resultados.push({ id: p.id, titulo: p.titulo, estado: "alerta_grave", detalle: `RUT inválido: «${rut}».`, fuente: "Dígito verificador del RUT", obligatorio: p.obligatorio });
      continue;
    }
    resultados.push({
      id: p.id,
      titulo: p.titulo,
      estado: opciones.simular ? "simulado" : "pendiente",
      detalle: opciones.simular
        ? `Ejemplo para la demo; en producción: ${fuente.nombre} (${fuente.acceso.replace(/_/g, " ")}).`
        : `A verificar en ${fuente.nombre} (${fuente.acceso.replace(/_/g, " ")}).`,
      fuente: fuente.nombre,
      obligatorio: p.obligatorio,
    });
  }
  return resultados;
};
