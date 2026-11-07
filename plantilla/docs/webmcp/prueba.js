// Prueba de webmcp.js con un modelContext falso. Corre con node, sin flag ni
// navegador: node docs/webmcp/prueba.js
"use strict";
const assert = require("node:assert");
const path = require("node:path");
const { registrarHerramientas } = require(path.join(__dirname, "webmcp.js"));

const datos = {
  secciones: [
    { titulo: "Inicio", texto: "Bienvenida al proyecto" },
    { titulo: "Precios", texto: "Planes y costos" },
    { titulo: "Contacto", texto: "Escribinos para consultar precios" },
  ],
};

function falso() {
  const tools = [];
  return { tools, registerTool: (t) => tools.push(t) };
}

function poner(clave, valor) {
  Object.defineProperty(globalThis, clave, { value: valor, configurable: true, writable: true });
}

function sacar(clave) {
  delete globalThis[clave];
}

function conContexto(donde) {
  const ctx = falso();
  poner("document", donde === "document" ? { modelContext: ctx } : {});
  poner("navigator", donde === "navigator" ? { modelContext: ctx } : {});
  const n = registrarHerramientas(datos);
  return { ctx, n };
}

for (const donde of ["document", "navigator"]) {
  const { ctx, n } = conContexto(donde);
  assert.strictEqual(n, 2, `${donde}: tiene que devolver 2`);
  assert.deepStrictEqual(ctx.tools.map((t) => t.name).sort(), ["buscar", "listar_secciones"]);
  for (const t of ctx.tools) {
    assert.ok(t.description && t.description.length > 0, `${t.name}: falta description`);
    assert.ok(t.inputSchema && t.inputSchema.type === "object", `${t.name}: falta inputSchema`);
  }
  const por = Object.fromEntries(ctx.tools.map((t) => [t.name, t]));
  const lista = por.listar_secciones.execute({});
  assert.strictEqual(lista.content[0].type, "text");
  for (const s of datos.secciones) assert.ok(lista.content[0].text.includes(s.titulo));
  const res = por.buscar.execute({ texto: "PRECIOS" }).content[0].text;
  assert.ok(res.includes("Precios") && res.includes("Contacto") && !res.includes("Inicio"));
}

poner("document", {});
poner("navigator", {});
assert.strictEqual(registrarHerramientas(datos), 0, "sin contexto tiene que devolver 0");
sacar("document");
sacar("navigator");
assert.strictEqual(registrarHerramientas(datos), 0, "sin document ni navigator tiene que devolver 0");

console.log("ok: webmcp.js registra por document y navigator, y sin contexto no hace nada");
