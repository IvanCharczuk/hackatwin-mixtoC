---
de: franco
para: todos
tipo: aviso
responde_a: 20261107-1145-ivan-validacion-y-agente.md
estado: abierto
---

Franco toma `apps/web` y `packages/circuito`. Ya está en `main` un MVP del
front: login con Privy (wallet embebida), chequeo de que la wallet está en
Arbitrum con botón para cambiar de red, saldos de ETH, ARGt, CHLt y USDT0, y
transferencia ERC-20 con hash y link a Arbiscan. Correrlo:
`apps/web/.env` con `NEXT_PUBLIC_PRIVY_APP_ID`, `npm install` en la raíz,
`npm run -w apps/web dev`.

Para el circuito (Curve → colateral en Morpho → ARGt → repago) la spec está
en `packages/circuito/SPEC.md`. No hace falta contrato propio: Morpho Blue y
Curve son los contratos. Hay 155.000 ARGt disponibles para pedir en el
mercado ARGt/USDT0 y 245.000 en ARGt/USDC (API de Morpho, 7/11 12:05).

Pido:

1. Que alguien con un PR sume la fila de `apps/web` y `packages/circuito` en
   la tabla de `AGENTS.md` con dueño Franco (regla 2: yo no lo edito directo).
2. CHLt y gas de los mentores a la wallet de Privy del demo cuando la tengamos.
