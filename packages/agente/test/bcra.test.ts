import { test } from "node:test";
import assert from "node:assert/strict";
import { resumirEntidades } from "../src/bcra";

const e = (situacion: number, monto: number) => ({ entidad: `E${situacion}-${monto}`, situacion, monto });

test("la situación que cuenta es la peor entre las deudas que pesan al menos 1% del total", () => {
  // Caso real de YPF: 32 deudas en situación 1 y una de $86 mil (situación 5) con un peaje.
  const r = resumirEntidades([e(1, 381_787_527), e(1, 31_033_316), e(5, 86)]);
  assert.equal(r.situacionMax, 1);
  assert.equal(r.situacionMaxTotal, 5);
  assert.equal(r.deudasMenoresIrregulares, 1);
});

test("una deuda irregular material sí cuenta", () => {
  const r = resumirEntidades([e(1, 1_000), e(3, 200)]);
  assert.equal(r.situacionMax, 3);
  assert.equal(r.deudasMenoresIrregulares, 0);
});

test("sin entidades → sin situación", () => {
  const r = resumirEntidades([]);
  assert.equal(r.situacionMax, null);
  assert.equal(r.deudaTotalArs, 0);
});

test("los montos del BCRA vienen en miles de pesos", () => {
  assert.equal(resumirEntidades([e(1, 86)]).deudaTotalArs, 86_000);
});
