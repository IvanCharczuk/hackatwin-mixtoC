import { test } from "node:test";
import assert from "node:assert/strict";
import { validarFacturaLeida, type FacturaLeida } from "../src/leerFactura";

const base: FacturaLeida = {
  tipo: "A",
  cuitEmisor: "30-99999901-5",
  razonSocialEmisor: "CATERING ANDINO S.R.L.",
  cuitReceptor: "30-99999902-3",
  razonSocialReceptor: "MINERA LOS ANDES ARGENTINA S.A.",
  puntoVenta: "0003",
  numero: "00000127",
  fechaEmision: "2026-11-05",
  cae: "76451283920471",
  vencimientoCae: "2026-11-15",
  vencimientoPago: "2027-01-04",
  total: 8500,
  moneda: "ARS",
};

test("factura completa: CUITs normalizados, número armado y receptor coincide", () => {
  const v = validarFacturaLeida(base, "30999999023");
  assert.equal(v.ok, true);
  assert.equal(v.cuitEmisor, "30999999015");
  assert.equal(v.numeroCompleto, "0003-00000127");
  assert.equal(v.receptorCoincide, true);
});

test("factura hecha a otra empresa: lo marca", () => {
  const v = validarFacturaLeida(base, "30546689979");
  assert.equal(v.receptorCoincide, false);
  assert.ok(v.problemas.some((p) => p.includes("receptor")));
});

test("sin CAE o con total cero: no es válida", () => {
  assert.equal(validarFacturaLeida({ ...base, cae: "" }, "30999999023").ok, false);
  assert.equal(validarFacturaLeida({ ...base, total: 0 }, "30999999023").ok, false);
});

test("en dólares: avisa que el monto no está en pesos", () => {
  const v = validarFacturaLeida({ ...base, moneda: "USD" }, "30999999023");
  assert.ok(v.problemas.some((p) => p.includes("pesos")));
});

test("CAE vencido a la fecha de emisión: lo marca", () => {
  const v = validarFacturaLeida({ ...base, vencimientoCae: "2026-11-01" }, "30999999023");
  assert.ok(v.problemas.some((p) => p.includes("CAE")));
});
