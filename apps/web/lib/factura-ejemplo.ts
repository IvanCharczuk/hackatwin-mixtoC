// Factura de ejemplo ya leída: mismos datos que packages/agente/test/factura.test.ts,
// con el total en 200 ARS para que la demo alcance con pocos CHLt. Sirve sin ANTHROPIC_API_KEY.
// ponytail: el PDF de public/factura-ejemplo.pdf sigue diciendo 8.500 ARS; no se linkea desde /app.
import type { FacturaVista } from "@/lib/hooks/use-factura";

export const FACTURA_EJEMPLO: FacturaVista = {
  ok: true,
  problemas: [],
  tipo: "A",
  razonSocialEmisor: "CATERING ANDINO S.R.L.",
  cuitEmisor: "30999999015",
  razonSocialReceptor: "MINERA LOS ANDES ARGENTINA S.A.",
  cuitReceptor: "30999999023",
  receptorCoincide: true,
  numeroCompleto: "0003-00000127",
  cae: "76451283920471",
  fechaEmision: "2026-11-05",
  vencimientoPago: "2027-01-04",
  total: 200,
  moneda: "ARS",
};
