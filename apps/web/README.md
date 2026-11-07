# web

Front de la demo. Hoy: login con Privy (wallet embebida), chequeo de que la
wallet está en Arbitrum (y cambio de red), saldos de ETH, ARGt, CHLt y USDT0,
y transferencia ERC-20 con hash y link a Arbiscan.

- **Dueño:** Franco
- **Estado:** MVP de login + red + transferencia. Falta el circuito
  (`packages/circuito`) y el agente.
- **Correr:** `.env` con `NEXT_PUBLIC_PRIVY_APP_ID` (ver `.env.example`), después
  `npm install` en la raíz y `npm run -w apps/web dev`. En dashboard.privy.io
  el origen `http://localhost:3000` tiene que estar permitido.
- **Dashboard (`/`):** la empresa ve cuánto ARGt puede pedir hoy, cuánto debe, su
  garantía, la barra de seguridad (60 % tope, 77 % se liquida), los chequeos C1 a C6,
  el plan paso a paso (una firma por paso) y sus movimientos con link a Arbiscan. Lee
  en vivo Morpho, el oráculo, el IRM y el pool de Curve en Arbitrum, sin backend
  (`lib/credito.ts`, `lib/morpho.ts`). Cuando `packages/circuito` exporte
  `chequear`/`planear`, se cambian ahí. La transferencia vieja quedó en `/transferir`.
- **Posición ilustrativa:** `NEXT_PUBLIC_MOCK_POSITION=1` llena el dashboard con el
  ejemplo de la SPEC (5.000 CHLt, 4.000 ARGt, LTV 47 %), marcado "ilustrativo". Sin
  eso, una wallet sin posición ve el estado vacío con "Pedir adelanto".
- **Modo demo:** sin `NEXT_PUBLIC_PRIVY_APP_ID` (o con `NEXT_PUBLIC_MOCK=1`) arranca
  sin `.env`: wallet simulada, saldos reales de `NEXT_PUBLIC_MOCK_ADDRESS` en
  Arbitrum, y las transferencias se simulan (no salen a la red).
