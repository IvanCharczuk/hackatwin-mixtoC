import { test } from "node:test";
import assert from "node:assert/strict";
import { planearPago, alertasProveedor, armarChecks } from "../src/pago";
import type { Bcra } from "../src/reglas";

const limpio: Bcra = { ok: true, situacionMax: 1, deudaTotalArs: 0, entidades: 1, chequesRechazados: 0 };

test("si el saldo alcanza, se paga todo del saldo y no hay que pedir", () => {
  const p = planearPago({ montoArgt: 1_000, saldoArgt: 5_000, disponibleArgt: 9_000, argtPorUsdt0DeTope: 982 });
  assert.equal(p.alcanza, true);
  assert.equal(p.desdeSaldoArgt, 1_000);
  assert.equal(p.aPedirArgt, 0);
  assert.equal(p.quedaSaldoArgt, 4_000);
  assert.equal(p.quedaParaPedirArgt, 9_000);
});

test("si el saldo no alcanza, usa el saldo y pide el resto", () => {
  const p = planearPago({ montoArgt: 8_000, saldoArgt: 3_000, disponibleArgt: 9_000, argtPorUsdt0DeTope: 982 });
  assert.equal(p.alcanza, true);
  assert.equal(p.desdeSaldoArgt, 3_000);
  assert.equal(p.aPedirArgt, 5_000);
  assert.equal(p.quedaSaldoArgt, 0);
  assert.equal(p.quedaParaPedirArgt, 4_000);
});

test("si ni el saldo ni lo que puede pedir alcanzan, dice cuánto falta y cuánto colateral sumar", () => {
  const p = planearPago({ montoArgt: 20_000, saldoArgt: 1_000, disponibleArgt: 9_000, argtPorUsdt0DeTope: 1_000 });
  assert.equal(p.alcanza, false);
  assert.equal(p.faltanteArgt, 10_000);
  assert.equal(p.colateralExtraUsdt0, 10);
});

test("proveedor en situación 3 o peor: alerta grave, no bloquea (decide la empresa)", () => {
  const a = alertasProveedor({ ...limpio, situacionMax: 4 });
  assert.equal(a.nivel, "grave");
  assert.ok(a.textos[0].includes("situación 4"));
});

test("proveedor con cheques rechazados: aviso; sin problemas: ok", () => {
  assert.equal(alertasProveedor({ ...limpio, chequesRechazados: 2 }).nivel, "aviso");
  assert.equal(alertasProveedor(limpio).nivel, "ok");
});

test("los checks para la pantalla incluyen BCRA de los dos, plata suficiente y disponibilidad", () => {
  const plan = planearPago({ montoArgt: 8_000, saldoArgt: 3_000, disponibleArgt: 9_000, argtPorUsdt0DeTope: 982 });
  const checks = armarChecks({ proveedor: limpio, empresa: limpio, tope: 0.6, plan });
  const nombres = checks.map((c) => c.id);
  assert.deepEqual(nombres, ["proveedor-bcra", "empresa-bcra", "plata-suficiente", "disponible-despues"]);
  assert.ok(checks.every((c) => c.ok));
});
