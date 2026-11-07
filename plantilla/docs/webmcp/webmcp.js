// webmcp.js — expone datos de la página a agentes del navegador con WebMCP.
// Sin dependencias ni red. Sirve con <script> y con require() desde node.
//
// WebMCP es experimental y la API cambia: las docs vigentes usan
// document.modelContext; textos anteriores, navigator.modelContext. Se
// buscan las dos y, si no hay ninguna, no pasa nada (la página sigue igual).
(function () {
  "use strict";

  function buscarContexto() {
    var doc = typeof document !== "undefined" ? document : undefined;
    if (doc && doc.modelContext && typeof doc.modelContext.registerTool === "function") {
      return doc.modelContext;
    }
    var nav = typeof navigator !== "undefined" ? navigator : undefined;
    if (nav && nav.modelContext && typeof nav.modelContext.registerTool === "function") {
      return nav.modelContext;
    }
    return null;
  }

  // Salida corta: las guías de Chrome piden <= 1.500 caracteres por respuesta.
  var MAX = 1500;
  function texto(s) {
    if (s.length > MAX) s = s.slice(0, MAX - 20) + "\n[...recortado]";
    return { content: [{ type: "text", text: s }] };
  }

  // datos: { secciones: [{ titulo, texto }] }. Adaptalo a lo que tenga tu app.
  function registrarHerramientas(datos) {
    var ctx = buscarContexto();
    if (!ctx) return 0;
    var secciones = (datos && datos.secciones) || [];

    var herramientas = [
      {
        name: "listar_secciones",
        description:
          "Lista los títulos de las secciones de la página. Usala primero para saber qué hay.",
        inputSchema: { type: "object", properties: {} },
        annotations: { readOnlyHint: true },
        execute: function () {
          return texto(
            secciones
              .map(function (s) { return s.titulo; })
              .join("\n")
          );
        },
      },
      {
        name: "buscar",
        description:
          "Busca un texto en las secciones de la página y devuelve las que lo contienen.",
        inputSchema: {
          type: "object",
          properties: {
            texto: { type: "string", description: "Texto a buscar, sin distinguir mayúsculas." },
          },
          required: ["texto"],
        },
        annotations: { readOnlyHint: true },
        execute: function (args) {
          var q = String((args && args.texto) || "").toLowerCase();
          var hallazgos = secciones.filter(function (s) {
            return (s.titulo + " " + s.texto).toLowerCase().indexOf(q) !== -1;
          });
          if (!q) return texto("Falta el texto a buscar.");
          if (!hallazgos.length) return texto("Ninguna sección contiene «" + q + "».");
          return texto(
            hallazgos
              .map(function (s) { return s.titulo + ": " + s.texto; })
              .join("\n")
          );
        },
      },
    ];

    var n = 0;
    herramientas.forEach(function (h) {
      // En algunas versiones registerTool devuelve una promesa: si falla,
      // la página sigue andando igual.
      var r = ctx.registerTool(h);
      if (r && typeof r.catch === "function") r.catch(function () {});
      n += 1;
    });
    return n;
  }

  globalThis.registrarHerramientas = registrarHerramientas;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { registrarHerramientas: registrarHerramientas };
  }
})();
