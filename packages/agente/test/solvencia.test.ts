import { test } from "node:test";
import assert from "node:assert/strict";
import { validarRut } from "../src/solvencia/chile";
import { combinar, type ResultadoPaso } from "../src/solvencia/receta";

test("RUT chileno: dígito verificador (módulo 11)", () => {
  assert.equal(validarRut("76.086.428-5"), "76086428-5");
  assert.equal(validarRut("12.345.678-5"), "12345678-5");
  assert.equal(validarRut("11.111.111-1"), "11111111-1");
  assert.equal(validarRut("10.000.013-K"), "10000013-K");
  assert.equal(validarRut("12.345.678-9"), null);
  assert.equal(validarRut("abc"), null);
});

const paso = (id: ResultadoPaso["id"], estado: ResultadoPaso["estado"], obligatorio = true): ResultadoPaso => ({
  id, titulo: id, estado, detalle: "", fuente: "x", obligatorio,
});

test("todo verificado sin alertas → apta, tope 60%", () => {
  const r = combinar([paso("identidad", "verificado"), paso("insolvencia", "verificado"), paso("sanciones", "verificado")]);
  assert.equal(r.nivel, "apta");
  assert.equal(r.tope, 0.6);
});

test("insolvencia o sanciones con alerta grave → rechazada", () => {
  assert.equal(combinar([paso("identidad", "verificado"), paso("insolvencia", "alerta_grave")]).nivel, "rechazada");
  assert.equal(combinar([paso("identidad", "verificado"), paso("sanciones", "alerta_grave")]).tope, 0);
});

test("un paso obligatorio sin verificar → condicional, tope 40% hasta completarlo", () => {
  const r = combinar([paso("identidad", "verificado"), paso("deuda_financiera", "pendiente")]);
  assert.equal(r.nivel, "condicional");
  assert.equal(r.tope, 0.4);
  assert.ok(r.faltan.includes("deuda_financiera"));
});

test("una alerta leve baja a 50%", () => {
  const r = combinar([paso("identidad", "verificado"), paso("morosidad_comercial", "alerta")]);
  assert.equal(r.tope, 0.5);
});

test("los pasos simulados se informan como tales", () => {
  const r = combinar([paso("identidad", "simulado"), paso("insolvencia", "verificado")]);
  assert.equal(r.simulados, 1);
});

import { validarCuit } from "../src/solvencia/argentina";
import { verificarSolvencia, PAISES } from "../src/solvencia/index";
import { decidir, type Bcra } from "../src/reglas";

test("CUIT argentino: dígito verificador", () => {
  assert.equal(validarCuit("30-54668997-9"), "30546689979");
  assert.equal(validarCuit("30-54668997-1"), null);
});

test("el registro tiene Chile y Argentina, y un país desconocido da error claro", async () => {
  assert.deepEqual(Object.keys(PAISES).sort(), ["AR", "CL"]);
  await assert.rejects(() => verificarSolvencia("PE", "123"), /País de origen inválido/);
});

test("Chile en modo demo: todo simulado, apta; sin simular: condicional al 40%", async () => {
  const demo = await verificarSolvencia("CL", "76.086.428-5", { simular: true });
  assert.equal(demo.veredicto.nivel, "apta");
  assert.ok(demo.veredicto.simulados > 0);
  const real = await verificarSolvencia("CL", "76.086.428-5");
  assert.equal(real.veredicto.nivel, "condicional");
  assert.equal(real.veredicto.tope, 0.4);
});

test("Chile con RUT inválido: rechazada", async () => {
  const r = await verificarSolvencia("CL", "12.345.678-9", { simular: true });
  assert.equal(r.veredicto.nivel, "rechazada");
});

test("el tope de la verificación de origen limita la decisión del agente", () => {
  const bcra: Bcra = { ok: true, situacionMax: null, deudaTotalArs: 0, entidades: 0, chequesRechazados: 0 };
  const mercado = { liquidezArgt: 1_000_000, precioArgtPorUsdt0: 1000, lltv: 0.77 };
  const d = decidir({ bcra, mercado, posicion: { colateralUsdt0: 10, deudaArgt: 0 }, topeMaximo: 0.4, motivoTopeMaximo: "Falta verificar en Chile." });
  assert.equal(d.tope, 0.4);
  assert.equal(d.disponibleArgt, 4000);
  assert.ok(d.motivos.some((m) => m.includes("Chile")));
});
