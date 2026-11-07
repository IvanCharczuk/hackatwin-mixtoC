// Subir la factura (PDF o foto): el agente la lee con Claude, la valida y corre
// el perfil y el plan de pago. Lado del servidor: la clave nunca llega al navegador.
// POST multipart/form-data: archivo, cuit (de la empresa), wallet, colateralUsdt0?
import { evaluar, leerFactura, validarFacturaLeida } from "agente";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BYTES = 4 * 1024 * 1024; // Vercel corta los cuerpos de más de 4,5 MB

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Mandá el archivo como formulario (multipart/form-data)." }, { status: 400 });
  }
  const archivo = form.get("archivo");
  const cuit = String(form.get("cuit") ?? "");
  const wallet = String(form.get("wallet") ?? "");
  const colateral = form.get("colateralUsdt0");
  if (!(archivo instanceof File)) return Response.json({ error: "Falta el archivo de la factura." }, { status: 400 });
  if (archivo.size > MAX_BYTES) return Response.json({ error: "La factura pesa más de 4 MB: subí un PDF o una foto más liviana." }, { status: 400 });
  if (!cuit || !wallet) return Response.json({ error: "Faltan el CUIT de tu empresa y la wallet." }, { status: 400 });

  try {
    const base64 = Buffer.from(await archivo.arrayBuffer()).toString("base64");
    const leida = await leerFactura({ base64, mediaType: archivo.type || "application/pdf" });
    const factura = validarFacturaLeida(leida, cuit);
    if (!factura.ok) return Response.json({ factura, resultado: null });
    const resultado = await evaluar({
      cuit,
      wallet,
      colateralUsdt0: colateral ? Number(colateral) : undefined,
      factura: { cuitProveedor: factura.cuitEmisor, montoArs: factura.total, numero: factura.numeroCompleto },
    });
    return Response.json({ factura, resultado });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const esValidacion = /inválid|tiene que|hace falta/.test(msg);
    return Response.json({ error: msg }, { status: esValidacion ? 400 : 502 });
  }
}
