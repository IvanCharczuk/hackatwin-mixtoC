import { test } from "node:test";
import assert from "node:assert/strict";
import { topePorPerfil, decidir, type Bcra, type Mercado } from "../src/reglas";

const sinHistorial: Bcra = { ok: true, situacionMax: null, deudaTotalArs: 0, entidades: 0, chequesRechazados: 0 };
const sit1: Bcra = { ...sinHistorial, situacionMax: 1, entidades: 2, deudaTotalArs: 1_000_000 };
const sit2: Bcra = { ...sit1, situacionMax: 2 };
const sit3: Bcra = { ...sit1, situacionMax: 3 };
const conCheques: Bcra = { ...sit1, chequesRechazados: 2 };
const sit2ConCheques: Bcra = { ...sit2, chequesRechazados: 1 };
const bcraCaido: Bcra = { ok: false, situacionMax: null, deudaTotalArs: 0, entidades: 0, chequesRechazados: 0, error: "timeout" };

// 1 USDT0 = 1.000 ARGt para que las cuentas sean redondas.
const mercado: Mercado = { liquidezArgt: 1_000_000, precioArgtPorUsdt0: 1000, lltv: 0.77 };
const sinPosicion = { colateralUsdt0: 0, deudaArgt: 0 };

test("tope: sin historial o situación 1 → 60%", () => {
  assert.equal(topePorPerfil(sinHistorial).tope, 0.6);
  assert.equal(topePorPerfil(sit1).tope, 0.6);
});

test("tope: situación 2 o cheques rechazados → 50%; las dos → 40%", () => {
  assert.equal(topePorPerfil(sit2).tope, 0.5);
  assert.equal(topePorPerfil(conCheques).tope, 0.5);
  assert.equal(topePorPerfil(sit2ConCheques).tope, 0.4);
});

test("tope: deudas chicas en mora se informan pero no bajan el 60%", () => {
  const r = topePorPerfil({ ...sit1, situacionMaxTotal: 5, deudasMenoresIrregulares: 1 });
  assert.equal(r.tope, 0.6);
  assert.ok(r.motivos.some((m) => m.includes("deuda(s) chica(s)")));
});

test("tope: situación 3 o peor → 0", () => {
  assert.equal(topePorPerfil(sit3).tope, 0);
  assert.equal(topePorPerfil({ ...sit1, situacionMax: 5 }).tope, 0);
});

test("tope: BCRA caído → 50% y lo dice", () => {
  const r = topePorPerfil(bcraCaido);
  assert.equal(r.tope, 0.5);
  assert.ok(r.motivos.some((m) => m.includes("BCRA")));
});

test("sin historial con 10 USDT0 puede pedir 60% del colateral: 6.000 ARGt", () => {
  const d = decidir({ bcra: sinHistorial, mercado, posicion: sinPosicion, colateralExtraUsdt0: 10 });
  assert.equal(d.estado, "aprobado");
  assert.equal(d.colateralEnArgt, 10_000);
  assert.equal(d.disponibleArgt, 6_000);
  assert.equal(d.otorgadoArgt, 6_000);
});

test("pedido dentro del tope → aprobado por lo pedido", () => {
  const d = decidir({ bcra: sinHistorial, mercado, posicion: sinPosicion, colateralExtraUsdt0: 10, pedidoArgt: 4_000 });
  assert.equal(d.estado, "aprobado");
  assert.equal(d.otorgadoArgt, 4_000);
  assert.equal(d.ltvResultante, 0.4);
});

test("pedido por encima del tope → recortado al tope", () => {
  const d = decidir({ bcra: sit2, mercado, posicion: sinPosicion, colateralExtraUsdt0: 10, pedidoArgt: 9_000 });
  assert.equal(d.estado, "recortado");
  assert.equal(d.otorgadoArgt, 5_000);
});

test("la liquidez del mercado (con 10% de margen) limita lo que se puede pedir", () => {
  const chico: Mercado = { ...mercado, liquidezArgt: 1_100 };
  const d = decidir({ bcra: sinHistorial, mercado: chico, posicion: sinPosicion, colateralExtraUsdt0: 10, pedidoArgt: 4_000 });
  assert.equal(d.estado, "recortado");
  assert.equal(d.otorgadoArgt, 1_000);
  assert.ok(d.motivos.some((m) => m.includes("liquidez")));
});

test("la deuda que ya tiene se descuenta del tope", () => {
  const d = decidir({ bcra: sinHistorial, mercado, posicion: { colateralUsdt0: 10, deudaArgt: 2_500 } });
  assert.equal(d.disponibleArgt, 3_500);
});

test("situación 3 → rechazado, no se otorga nada", () => {
  const d = decidir({ bcra: sit3, mercado, posicion: sinPosicion, colateralExtraUsdt0: 10, pedidoArgt: 1_000 });
  assert.equal(d.estado, "rechazado");
  assert.equal(d.otorgadoArgt, 0);
});

test("sin colateral → rechazado y dice que deje USDT0", () => {
  const d = decidir({ bcra: sinHistorial, mercado, posicion: sinPosicion, pedidoArgt: 1_000 });
  assert.equal(d.estado, "rechazado");
  assert.ok(d.motivos.some((m) => m.includes("colateral")));
});
