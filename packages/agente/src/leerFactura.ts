// Lee una factura (PDF o foto) con Claude y devuelve sus datos estructurados.
// La validación (validarFacturaLeida) es pura y se prueba con `npm test`.
import Anthropic from "@anthropic-ai/sdk";

export type FacturaLeida = {
  tipo: string;
  cuitEmisor: string;
  razonSocialEmisor: string;
  cuitReceptor: string;
  razonSocialReceptor: string;
  puntoVenta: string;
  numero: string;
  /** AAAA-MM-DD */
  fechaEmision: string;
  cae: string;
  /** AAAA-MM-DD */
  vencimientoCae: string;
  /** AAAA-MM-DD; vacío si la factura no lo dice. */
  vencimientoPago: string;
  total: number;
  /** Wallet del proveedor (0x…) si la factura la trae en forma de pago u observaciones; vacío si no. */
  walletProveedor?: string;
  /** "ARS", "USD" u otra. */
  moneda: string;
};

export type FacturaValidada = FacturaLeida & {
  ok: boolean;
  cuitEmisor: string;
  cuitReceptor: string;
  numeroCompleto: string;
  receptorCoincide: boolean;
  problemas: string[];
};

const soloDigitos = (s: string) => String(s ?? "").replace(/\D/g, "");

export function validarFacturaLeida(f: FacturaLeida, cuitEmpresa: string): FacturaValidada {
  const problemas: string[] = [];
  const cuitEmisor = soloDigitos(f.cuitEmisor);
  const cuitReceptor = soloDigitos(f.cuitReceptor);
  const empresa = soloDigitos(cuitEmpresa);
  if (cuitEmisor.length !== 11) problemas.push("No se pudo leer el CUIT del proveedor (emisor).");
  if (!soloDigitos(f.cae)) problemas.push("La factura no tiene CAE: no está autorizada por ARCA.");
  if (!(f.total > 0)) problemas.push("No se pudo leer el importe total.");
  if (f.moneda && f.moneda.toUpperCase() !== "ARS") problemas.push(`La factura está en ${f.moneda}, no en pesos: el pago en ARGt es en pesos.`);
  if (f.vencimientoCae && f.fechaEmision && f.vencimientoCae < f.fechaEmision) problemas.push("El CAE vence antes de la fecha de emisión: revisá la factura.");
  const receptorCoincide = cuitReceptor.length === 11 && cuitReceptor === empresa;
  if (!receptorCoincide) problemas.push("El CUIT del receptor de la factura no es el de tu empresa.");
  const pv = soloDigitos(f.puntoVenta).padStart(4, "0");
  const nro = soloDigitos(f.numero).padStart(8, "0");
  const graves = problemas.filter((p) => !p.includes("pesos") && !p.includes("receptor"));
  return {
    ...f,
    cuitEmisor,
    cuitReceptor,
    numeroCompleto: `${pv}-${nro}`,
    receptorCoincide,
    problemas,
    ok: graves.length === 0,
  };
}

const ESQUEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "tipo", "cuitEmisor", "razonSocialEmisor", "cuitReceptor", "razonSocialReceptor", "puntoVenta",
    "numero", "fechaEmision", "cae", "vencimientoCae", "vencimientoPago", "total", "moneda", "walletProveedor",
  ],
  properties: {
    tipo: { type: "string", description: "Letra del comprobante (A, B, C, M) o «FCE» si es factura de crédito electrónica." },
    cuitEmisor: { type: "string", description: "CUIT de quien emite la factura (el proveedor)." },
    razonSocialEmisor: { type: "string" },
    cuitReceptor: { type: "string", description: "CUIT del cliente al que se le factura." },
    razonSocialReceptor: { type: "string" },
    puntoVenta: { type: "string" },
    numero: { type: "string", description: "Número de comprobante, sin el punto de venta." },
    fechaEmision: { type: "string", description: "AAAA-MM-DD" },
    cae: { type: "string", description: "Número de CAE; vacío si no tiene." },
    vencimientoCae: { type: "string", description: "AAAA-MM-DD; vacío si no figura." },
    vencimientoPago: { type: "string", description: "AAAA-MM-DD; vacío si no figura." },
    total: { type: "number", description: "Importe total en la moneda de la factura." },
    moneda: { type: "string", description: "ARS si es en pesos; si no, el código (USD, etc.)." },
    walletProveedor: { type: "string", description: "Dirección de wallet del proveedor (0x seguido de 40 caracteres hexadecimales) si figura en forma de pago u observaciones; vacío si no figura." },
  },
} as const;

export type Archivo = { base64: string; mediaType: string };

const TIPOS_IMAGEN = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

export async function leerFactura(archivo: Archivo, apiKey = process.env.ANTHROPIC_API_KEY): Promise<FacturaLeida> {
  if (!apiKey) throw new Error("Para leer la factura hace falta ANTHROPIC_API_KEY en el servidor.");
  const esPdf = archivo.mediaType === "application/pdf";
  const esImagen = (TIPOS_IMAGEN as readonly string[]).includes(archivo.mediaType);
  if (!esPdf && !esImagen) throw new Error("La factura tiene que ser un PDF o una foto (JPG, PNG o WEBP): formato inválido.");
  const adjunto: Anthropic.ContentBlockParam = esPdf
    ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: archivo.base64 } }
    : { type: "image", source: { type: "base64", media_type: archivo.mediaType as (typeof TIPOS_IMAGEN)[number], data: archivo.base64 } };

  const client = new Anthropic({ apiKey, timeout: 60_000, maxRetries: 1 });
  const r = await client.messages.create({
    model: "claude-haiku-5-5",
    max_tokens: 4000,
    output_config: { effort: "low", format: { type: "json_schema", schema: ESQUEMA } },
    messages: [
      {
        role: "user",
        content: [
          adjunto,
          {
            type: "text",
            text: "Es una factura argentina. Extraé los datos tal como figuran en el comprobante. Si un dato no figura, dejalo vacío (o 0 para el total). Fechas en AAAA-MM-DD; el total como número (sin separador de miles). Si la factura indica una wallet del proveedor para cobrar (0x…), copiala exacta en walletProveedor.",
          },
        ],
      },
    ],
  });
  if (r.stop_reason === "refusal") throw new Error("Claude no pudo leer la factura.");
  const texto = r.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
  try {
    return JSON.parse(texto) as FacturaLeida;
  } catch {
    throw new Error(`No se pudo leer la factura (${r.stop_reason}).`);
  }
}
