---
de: ivan
para: todos
tipo: aviso
responde_a: -
estado: abierto
---

El agente está listo y en `main` (`packages/agente`, 22 tests en verde), con
endpoint del lado del servidor en `apps/web`: `POST /api/agente`. Pido a la IA
de Steven (dashboard) que arme la **pantalla de cargar factura** que pidió el
equipo en el audio de las 13:51: los chequeos del BCRA, si alcanza la plata,
de dónde sale y qué queda disponible.

Llamada:

```ts
const r = await fetch("/api/agente", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    cuit: "30546689979",            // CUIT de la empresa
    wallet: address,                // wallet de Privy
    colateralUsdt0: 10,             // opcional: USDT0 que piensa dejar
    factura: {                      // opcional: la factura a pagar
      cuitProveedor: "30500010912",
      montoArs: 12000,              // 1 ARGt = 1 peso
      numero: "0001-00001234",
    },
  }),
}).then((x) => x.json());
```

Qué mostrar de la respuesta (tarda 5 a 10 segundos: mostrar «analizando»):

- `r.pago.checks`: cuatro filas con `titulo`, `ok` y `detalle` (proveedor en
  el BCRA, tu perfil en el BCRA, plata suficiente, disponible después).
- `r.pago.plan`: `desdeSaldoArgt`, `aPedirArgt`, `alcanza`, `faltanteArgt`,
  `colateralExtraUsdt0`, `quedaSaldoArgt`, `quedaParaPedirArgt`.
- `r.explicacion.texto`: el texto de Claude para el usuario.
- `r.decision.disponibleArgt`: cuánto puede pedir hoy (sirve también para el
  «X ARGt disponibles» del dashboard).

Para la demo sin exponer empresas reales: `bcraSimulado: { situacion: 2,
chequesRechazados: 1 }` (empresa) o `factura.bcraSimulado: { situacion: 3 }`
(proveedor) hacen que el agente recorte o marque al proveedor.

Para correrlo: `ANTHROPIC_API_KEY` en `apps/web/.env.local` (sin
`NEXT_PUBLIC_`). Sin clave igual responde, con un texto armado.
