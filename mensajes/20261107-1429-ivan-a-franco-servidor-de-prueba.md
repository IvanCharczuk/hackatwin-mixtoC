---
de: ivan
para: franco
tipo: aviso
responde_a: 20261107-1427-ivan-servidor-de-prueba.md
estado: abierto
---

Franco: todo lo que tu IA necesita para probar el circuito de la web sin
plata real, y lo que falta para la entrega. Ivan pidió que no se use plata
del equipo.

## 1. Servidor de prueba (ya probado)

`packages/fork`: copia local de Arbitrum (chain id 42161, mismos contratos de
Twin, Morpho y Curve) con plata de mentira. Pasos:

```bash
npm install                                  # en la raíz
npm run -w packages/fork node                # dejarlo corriendo (127.0.0.1:8545)
npm run -w packages/fork fondear -- 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 --desbloquear
```

Y en `apps/web/.env.local`:

```
NEXT_PUBLIC_MOCK=1
NEXT_PUBLIC_RPC_ARBITRUM=http://127.0.0.1:8545
```

`--desbloquear` hace que el servidor firme por la wallet de demo
(`MOCK_ADDRESS`, la de `apps/web/lib/mock.ts`) sin clave: un
`eth_sendTransaction` desde ella se ejecuta en la copia (probado, devuelve
hash). Hoy el modo demo **simula** las transferencias en `mock.ts`; si las
mandás por wagmi al RPC, con esto se ejecutan de verdad en la copia y podés
probar approve, `supplyCollateral`, `borrow` (con el proveedor de receiver),
`repay` y `withdrawCollateral` sin gastar nada.

Referencia que ya anda: `packages/fork/probar-circuito.mts` hace approve,
`supplyCollateral` de 10 USDT0 y `borrow` de 5.000 ARGt al proveedor contra la
copia; las tres en `success`. Usa los mismos `MARKET_PARAMS` que tu
`apps/web/lib/morpho.ts`.

## 2. Montos para la demo

- CHLt casi no tiene liquidez: pool de Curve con unos 3.100 USDT, vault con
  unos 20.100. Cambios de decenas de dólares.
- El mercado ARGt/USDT0 de Morpho presta como máximo unos 141.000 ARGt
  (con 10% de margen), cerca de US$ 86. Con 10 USDT0 de colateral se pueden
  pedir unos 9.800 ARGt.

## 3. El agente en la web

`POST /api/agente` ya está en `apps/web` y funciona en Vercel, pero ahí
responde con texto armado porque falta la clave. Si tenés acceso al
proyecto en Vercel: Settings → Environment Variables →
`ANTHROPIC_API_KEY` (sin `NEXT_PUBLIC_`), y redeploy. La clave te la pasa
Ivan en persona, no por el repo. Contrato del endpoint en
`mensajes/20261107-1356-ivan-agente-y-factura.md`.

## 4. El hash que pide la consigna

Los hashes de la copia local no se ven en Arbiscan. Para la transacción real
que pide Twin, usar los montos chicos de prueba que dan los mentores (la
consigna lo dice), no plata del equipo. Preguntarles también si vale una red
de prueba.
