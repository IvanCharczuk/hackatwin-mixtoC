// Dónde se revisa a la empresa según su país de origen. Solo Argentina (BCRA) es una consulta real;
// el resto se muestra como simulado en la demo. ponytail: sumar APIs reales país por país.
export type Pais = { id: string; nombre: string; idNombre: string; ejemplo: string; instituciones: string[]; valida: (v: string) => boolean };

const digitos = (s: string) => s.replace(/\D/g, "");

/** RUT chileno: módulo 11 sobre el cuerpo, el último carácter es el dígito verificador (0-9 o K). */
export function rutValido(v: string) {
  const limpio = v.replace(/[^0-9kK]/g, "").toUpperCase();
  if (limpio.length < 8) return false;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  let suma = 0;
  let mult = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * mult;
    mult = mult === 7 ? 2 : mult + 1;
  }
  const r = 11 - (suma % 11);
  const esperado = r === 11 ? "0" : r === 10 ? "K" : String(r);
  return dv === esperado;
}

export const PAISES: Pais[] = [
  { id: "CL", nombre: "Chile", idNombre: "RUT", ejemplo: "76.086.428-5", instituciones: ["SII · situación tributaria", "CMF · registro de emisores", "Boletín Comercial · morosidad"], valida: rutValido },
  { id: "PE", nombre: "Perú", idNombre: "RUC", ejemplo: "20100047218", instituciones: ["SUNAT · contribuyente activo", "SBS · central de riesgos"], valida: (v) => digitos(v).length === 11 },
  { id: "MX", nombre: "México", idNombre: "RFC", ejemplo: "ABC010101AB1", instituciones: ["SAT · lista de contribuyentes", "Buró de Crédito"], valida: (v) => /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/i.test(v.trim()) },
  { id: "CO", nombre: "Colombia", idNombre: "NIT", ejemplo: "900123456-7", instituciones: ["DIAN · RUT", "Superfinanciera"], valida: (v) => digitos(v).length >= 9 },
  { id: "BR", nombre: "Brasil", idNombre: "CNPJ", ejemplo: "12.345.678/0001-90", instituciones: ["Receita Federal · CNPJ", "Serasa · crédito"], valida: (v) => digitos(v).length === 14 },
  { id: "BO", nombre: "Bolivia", idNombre: "NIT", ejemplo: "1020304050", instituciones: ["SIN · padrón", "ASFI · central de riesgos"], valida: (v) => digitos(v).length >= 7 },
  { id: "AR", nombre: "Argentina", idNombre: "CUIT", ejemplo: "30-99999902-3", instituciones: ["BCRA · Central de Deudores"], valida: (v) => digitos(v).length === 11 },
];
