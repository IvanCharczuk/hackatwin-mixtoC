# WebMCP: que tu app la use un agente sin computer use

## Qué es y cuándo conviene

WebMCP deja que una página web le diga al navegador qué funciones ofrece
(«listar productos», «buscar», «reservar») para que un agente las llame
directo, en vez de adivinar clicks sobre la pantalla. Conviene cuando tu app
tiene acciones que un agente haría a clicks: buscar, filtrar, consultar
datos. Si la app es una página estática sin acciones, no suma.

## Estado

Es **experimental**. Corre detrás de una flag de Chrome y la API todavía
cambia: las docs de Chrome vigentes usan `document.modelContext.registerTool`
y textos anteriores usan `navigator.modelContext`. Por eso `webmcp.js`
detecta las dos rutas y, si no hay ninguna, no hace nada.

## Cómo activarlo en Chrome

1. Chrome reciente (desde la 149 hay origin trial; antes, sólo con la flag).
2. Abrí `chrome://flags/#enable-webmcp-testing`, activá la flag y reiniciá.
3. Abrí `docs/webmcp/ejemplo.html` (con un servidor local o directo desde el
   archivo) y mirá las herramientas registradas en DevTools, en
   Application > WebMCP. Si tu versión no tiene ese panel, probá con una
   extensión de inspección de WebMCP o con la prueba de abajo.

Los nombres de la flag y del panel cambian entre versiones: si no aparecen,
buscá «WebMCP» en `chrome://flags` y revisá las docs de Chrome.

## Cómo adaptar `webmcp.js` al proyecto

- Copiá `docs/webmcp/webmcp.js` a donde sirva tu app y cargalo con
  `<script src="webmcp.js"></script>`.
- Pasale a `registrarHerramientas(datos)` los datos que querés exponer.
  Elegí pocos y que sirvan a la demo.
- Nombres en `snake_case`, con verbo (`listar_secciones`, `buscar`).
- Descripciones que un modelo entienda: qué hace y cuándo usarla.
- **Sólo lectura por defecto.** Las herramientas de escritura las decide el
  equipo (ver seguridad).
- Presupuestos: nombre de 30 caracteres como máximo, descripción de 500,
  respuesta de 1.500 (`webmcp.js` recorta).
- Marcá `annotations: { readOnlyHint: true }` sólo en consultas puras, y
  `untrustedContentHint: true` si la respuesta trae texto que escribieron
  usuarios.
- Los errores se **devuelven** (`{ error, code, retryable }`), no se tiran:
  una excepción le llega al agente como un error genérico.

## Forma declarativa

También se puede declarar la herramienta en un `<form>`:

```html
<form toolname="buscar_en_pagina"
      tooldescription="Busca un texto en las secciones de esta página.">
  <input name="texto" type="text" toolparamdescription="Texto a buscar">
  <button type="submit">Buscar</button>
</form>
```

`toolname` y `tooldescription` van juntos. Sin `toolautosubmit`, el
navegador llena el formulario y espera que la persona lo mande. Hay un
ejemplo completo en `docs/webmcp/ejemplo.html`.

## Probarlo sin navegador

```sh
node docs/webmcp/prueba.js
```

Usa un `modelContext` falso, sin flag: comprueba las dos rutas, el resultado
de cada herramienta y que sin contexto no pasa nada. Si cambiás
`webmcp.js`, volvé a correrla.

## Prompt para el agente de código

Pegale esto:

> Agregá WebMCP a esta app siguiendo `docs/webmcp.md`. Partí de
> `docs/webmcp/webmcp.js`, exponé sólo lectura sobre los datos de la app
> (nombres en `snake_case`, descripciones claras), mantené la detección de
> `document.modelContext` y `navigator.modelContext`, no agregues
> dependencias y corré `node docs/webmcp/prueba.js` antes de dar por
> terminado.

## Seguridad

- Nada de claves ni secretos en el cliente: todo lo que ve la página lo ve
  el agente.
- Nada de JS de terceros sin versión fija.
- Toda herramienta que escriba o mande datos (compras, envíos, cuentas)
  pide confirmación humana antes de ejecutar: en vez de hacerlo sola,
  devuelve `status: "requires_user_action"` y abre la pantalla donde la
  persona confirma.

## Links

- Docs de Chrome sobre WebMCP: https://developer.chrome.com/docs/ai/webmcp
- https://webmcp.com
- Skill de Google para agentes de código (`build-webmcp-tools`, Apache-2.0):
  https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/webmcp-skills.
  Si el equipo la quiere usar, leerla antes y fijarla a un commit; no viene
  instalada en esta plantilla.
