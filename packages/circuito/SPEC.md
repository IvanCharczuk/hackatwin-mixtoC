# SPEC — Circuito CHLt → colateral → adelanto en ARGt → repago

- **Dueño:** Franco
- **Rama:** `franco/mac`
- **Estado:** borrador, 7/11/2026 12:30

## Objetivo

El proveedor tiene CHLt en su wallet (Privy). El circuito chequea que todo
esté dado (saldo, liquidez, colateralización, gas), muestra el plan con
números, y con una confirmación de una persona ejecuta las cuatro
transacciones reales en Arbitrum: cambio en Curve, depósito de colateral en
Morpho, préstamo de ARGt a la wallet del proveedor, y repago con liberación
del colateral. El jurado ve cuatro hashes en Arbiscan y el ARGt llegando.

No hay contrato propio: Morpho Blue y Curve son los contratos. El escrow de
`packages/contratos` queda para después, si sobra tiempo.

## Alcance

**Dentro:**

- Chequeos previos (C1 a C6) con lectura onchain y respuesta en JSON.
- Ejecución de las cuatro transacciones firmando con la wallet embebida de
  Privy (wagmi `writeContractAsync`), una confirmación por transacción.
- Repago con liberación del colateral y vuelta opcional a CHLt.
- CLI para correr los chequeos y el circuito sin front (`npm run check`,
  `npm run run`), y hooks para que `apps/web` lo muestre.

**Fuera:**

- Contrato de escrow por factura (`packages/contratos`).
- Lectura de la factura y perfil BCRA (eso es `packages/agente`).
- Avalanche. Todo en Arbitrum (42161).
- Liquidaciones y cualquier manejo del interés más allá de leerlo.

## Chequeos previos

Se corren todos antes de pedir la primera firma. Si uno falla, el circuito no
arranca y dice por qué y qué falta.

| # | Chequeo | Cómo se lee | Pasa si |
|---|---|---|---|
| C1 Saldo | `balanceOf(wallet)` de CHLt | ≥ el monto a congelar |
| C2 Gas | `eth_getBalance(wallet)` | ≥ 0,0005 ETH (cuatro tx cortas) |
| C3 Cambio | `get_dy(0,1,monto)` en el pool CHLt/USDT0 y `balances(1)` | el pool tiene ≥ 2× lo que recibimos y el impacto contra `price_oracle()` es < 3 % |
| C4 Liquidez | `market(id)` en Morpho: `totalSupplyAssets − totalBorrowAssets` | ≥ el ARGt a pedir, con 10 % de margen |
| C5 Colateralización | precio del oráculo del mercado (`price()`), LLTV 77 % | el adelanto pedido ≤ 60 % del colateral en ARGt (deja 17 puntos de aire antes de la liquidación) |
| C6 Allowances | `allowance(wallet, pool)` de CHLt, `allowance(wallet, morpho)` de USDT0 y de ARGt | si falta, se agrega el `approve` al plan |

Salida de `check`:

```json
{ "ok": true, "chlt": 5000, "usdt0": 5.09, "colateralEnArs": 8440,
  "adelantoMax": 5064, "adelanto": 4000, "ltv": 0.47,
  "liquidezArgt": 155438, "tasaAnual": 0.254, "gasEth": 0.0012,
  "pasos": ["approve CHLt","exchange","approve USDT0","supplyCollateral","borrow"] }
```

## Las transacciones

Todas en Arbitrum, firmadas por la wallet del proveedor. Montos chicos y
redondos para la demo.

| Paso | Contrato | Llamada |
|---|---|---|
| 1 | CHLt `0xe8dbC4680235cCAeFf48e4C0B0EaceeBb89E5e17` | `approve(pool, monto)` |
| 2 | Pool CHLt/USDT0 `0xa087f05ecd245476d7844f6eab28d98724696ac2` (Curve twocrypto-ng) | `exchange(0, 1, monto, minDy)` con `minDy = get_dy × 0,99` |
| 3 | USDT0 `0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9` (6 decimales) | `approve(morpho, usdt0)` |
| 4 | Morpho Blue `0x6c247b1F6182318877311737BaC0844bAa518F5e` | `supplyCollateral(params, usdt0, wallet, "0x")` |
| 5 | Morpho Blue | `borrow(params, adelanto, 0, wallet, wallet)` |
| 6 (repago) | ARGt `0x59863989d080B22476DB95656d0C3CC18be92214` | `approve(morpho, deuda + 1 %)` |
| 7 | Morpho Blue | `repay(params, 0, borrowShares, wallet, "0x")` (por shares, así cierra la deuda entera con el interés) |
| 8 | Morpho Blue | `withdrawCollateral(params, usdt0, wallet, wallet)` |
| 9 (opcional) | Pool CHLt/USDT0 | `exchange(1, 0, usdt0, minDy)` para volver a CHLt |

`params` del mercado ARGt contra USDT0 (id
`0x83b1866f744b5113866619cd85aba571c1344a92c69fa354a16a8cacbe99c35c`):

```ts
{ loanToken: "0x59863989d080B22476DB95656d0C3CC18be92214",   // ARGt
  collateralToken: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", // USDT0
  oracle: "0x6581149982980CA25a17e51840dEFE11B1519580",
  irm: "0x66F30587FB8D4206918deb78ecA7d5eBbafD06DA",
  lltv: 770000000000000000n }
```

Si la liquidez de USDT0 no alcanza, el mismo circuito corre contra USDC
(mercado `0xccc7…32be`, colateral `0xaf88d065e77c8cC2239327C5EDb3A432268e5831`,
oráculo `0xc67F9A01554Dcc0AB415D267b3B3252eEB03aC4F`) cambiando el pool por
uno con USDC. El mercado no figura en la interfaz de Morpho: se llama directo
al contrato.

Datos leídos el 7/11/2026 a las 12:10: pool CHLt con 3,05 M CHLt y 1.475
USDT0, `price_oracle` 883,9 CHLt por USDT0; pool ARGt 1.658,5 ARGt por USDT0;
mercado ARGt/USDT0 con 155.438 ARGt disponibles al 25,4 % anual.

## Código

`packages/circuito/src/`:

- `direcciones.ts`: todo lo de arriba, con chain 42161 explícita.
- `abis.ts`: solo las funciones usadas (ERC-20, Curve `get_dy`/`exchange`/
  `balances`/`price_oracle`, Morpho `supplyCollateral`/`borrow`/`repay`/
  `withdrawCollateral`/`market`/`position`, oráculo `price`).
- `chequear.ts`: los seis chequeos con viem `publicClient`. Devuelve el JSON.
- `circuito.ts`: `planear(chequeo)` arma la lista de pasos; `ejecutar(paso,
  walletClient)` manda uno y espera el receipt. Nunca manda dos sin
  confirmación en el medio.
- `cli.ts`: `check <wallet> <chlt> <argt>` y `run` (con `PRIVATE_KEY` de una
  wallet de prueba en `.env`, solo para probar sin front).

Privy: `apps/web` usa `@privy-io/react-auth` + `@privy-io/wagmi`, como en
Faro (`agentes/faro-wallet-twin/apps/faro/lib/wagmi-config.ts` y
`components/rewards-panel.tsx` muestran el `writeContractAsync` y el
`waitForTransactionReceipt`). El circuito recibe el `walletClient` de wagmi
y no sabe de Privy.

Reutilizar de Faro: login y wallet embebida, `use-token-balances.ts`,
`use-vault-position.ts` (si después se muestra el ARGt rindiendo en el vault).

## Criterios de aceptación

- **CA-1** — Los chequeos corren contra Arbitrum y devuelven JSON con `ok` y
  los seis resultados para una wallet dada.
  `npm run -w packages/circuito check -- 0x<wallet> 5000 4000 | node -e "const j=JSON.parse(require('fs').readFileSync(0));process.exit(typeof j.ok==='boolean'&&j.pasos?0:1)"`
- **CA-2** — Con una wallet sin CHLt, `check` devuelve `ok:false` y nombra C1.
  `npm run -w packages/circuito check -- 0x000000000000000000000000000000000000dEaD 5000 4000 | grep -q '"C1"' && echo 0`
- **CA-3** — El circuito completo (pasos 1 a 5) deja a la wallet con deuda en
  ARGt y colateral en USDT0 leíbles en `position(id, wallet)`, y los cinco
  hashes con `status: success`.
  `npm run -w packages/circuito run -- 5000 4000 | grep -c success` → `5`
- **CA-4** — El repago (pasos 6 a 8) deja `borrowShares = 0` y `collateral =
  0` en `position`, y la wallet con el USDT0 de vuelta.
  `npm run -w packages/circuito run -- --repagar | grep -q '"borrowShares":"0"' && echo 0`
- **CA-5** — Nada se firma sin confirmación: con `--si` ausente, `run`
  imprime el plan y termina sin mandar nada.
  `npm run -w packages/circuito run -- 5000 4000 | grep -q 'plan' && echo 0`

## Notas

- **Regla 4 de AGENTS.md:** cada transacción pide confirmación a una persona.
  En el CLI es `--si`; en el front, el botón por paso.
- **El colateral es USDT0, no CHLt.** Ningún mercado de Morpho acepta un
  token de Twin como garantía. En el pitch se dice "congelás tus pesos
  chilenos" y el paso 2 los convierte; mejor decirlo que esconderlo.
- **El vault ARGt Prime no interviene.** El ARGt prestado sale de la
  liquidez del mercado. Los siete vaults Prime tienen la plata ociosa
  (99 % sin asignar, API de Morpho 7/11/2026). Si queremos mostrar el ARGt
  rindiendo mientras espera, es un `deposit` aparte, con el código de Faro.
- **Interés:** 25 % anual sobre el ARGt prestado. En una demo de 10 minutos
  son centavos; el repago por shares lo cubre. Es costo del préstamo de
  Morpho, no rendimiento de ARGt (regla 8).
- **Por qué 60 % y no 77 %:** el oráculo del mercado mueve el precio ARS/USD
  todo el día; 17 puntos de aire evitan que una demo se liquide en vivo.
- **Pedir a los mentores:** CHLt (unos 5.000, 5 USD), ARGt chico por si el
  repago necesita cubrir interés, y 0,001 ETH de gas en Arbitrum.
- **Fuentes:** consigna del track (`docs/sources/2026-11-07-twin-stablecoins.pdf`,
  páginas 2 y 3), API de Morpho (`api.morpho.org/graphql`, consultada
  7/11/2026 12:05), lecturas RPC de los pools (7/11/2026 12:10).
