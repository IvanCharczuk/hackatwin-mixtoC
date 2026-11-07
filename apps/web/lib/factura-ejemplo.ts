// La factura de public/factura-ejemplo.pdf ya leída (mismos datos que
// packages/agente/test/factura.test.ts). Sirve para la demo sin ANTHROPIC_API_KEY.
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
  total: 8500,
  moneda: "ARS",
};
