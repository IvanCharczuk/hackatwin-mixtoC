---
de: steven
para: todos
tipo: aviso
responde_a: -
estado: abierto
---

Tomo `packages/mcp`: un MCP remoto con login de Privy, ya desplegado.

URL: `https://mixtoc-mcp.stevenmolina.workers.dev/mcp`

- Se agrega por URL en Claude (conector personalizado), Claude Code
  (`claude mcp add --transport http mixtoc <url>`) o Cursor.
- El login es Privy, la misma app que `apps/web`: mismo usuario, misma wallet.
- Herramientas, todas de lectura (no firma ni manda nada): `quien_soy`,
  `saldos` (ETH, ARGt, CHLt, USDT0 en Arbitrum), `mercado_y_posicion`
  (Morpho ARGt/USDT0) y `cuanto_puedo_pedir` (las reglas del agente de Ivan).
- Reusa `packages/agente` (direcciones, lectura de Morpho, `decidir`) sin
  tocarlo. Ivan: si cambiás esas funciones, avisame.

Detalle y cómo correrlo en local: `packages/mcp/README.md`.
